// MapView / MapCanvas fit-to-bounds (kui-react parity, modules/ui/MapView/parts/LeafletCanvas.tsx):
// the view is framed on the zone and route vertices as well as the markers, so a map of zones or
// routes alone is framed too. The Leaflet runtime (scripts/map-leaflet.js) runs in a vm context
// against a stub `L` that records what it is asked to fit.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SRC = fs.readFileSync(path.resolve(__dirname, '../modules/ui/MapView/scripts/map-leaflet.js'), 'utf-8');

type LatLng = [number, number];
type Opts = {
  markers?: { position: LatLng }[]; zones?: { positions: LatLng[] }[]; routes?: { positions: LatLng[] }[]; fitBoundsPadding?: number;
  showMarkers?: boolean; showZones?: boolean; showRoutes?: boolean;
  image?: { url: unknown; width: unknown; height: unknown }; minZoom?: number;
};

function exec(opts: Opts) {
  const fits: { points: LatLng[]; padding: unknown }[] = [];
  // Which kinds of layer were added to the map (tile, image, polygon, polyline, marker).
  const drawn: string[] = [];
  // Where each zone / route / marker was placed, and the picture drawn (url + bounds).
  const placed: { kind: string; at: unknown }[] = [];
  const overlays: { url: string; bounds: unknown }[] = [];
  const created: { options: unknown; view: unknown[] }[] = [];
  const layer = (kind: string) => (at?: unknown) => {
    if (kind !== 'tile' && kind !== 'image') placed.push({ kind, at });
    return { addTo() { drawn.push(kind); return this; }, bindTooltip() { return this; }, on() { return this; } };
  };
  const CRS = { Simple: { simple: true } };
  const L = {
    CRS,
    map: (_id: string, options?: unknown) => {
      const rec = { options, view: [] as unknown[] };
      created.push(rec);
      return { setView(c: unknown, z: unknown) { rec.view = [c, z]; return this; }, removeLayer() {}, fitBounds(b: { points: LatLng[] }, o: { padding: unknown }) { fits.push({ points: b.points, padding: o.padding }); } };
    },
    imageOverlay: (url: string, bounds: unknown) => { overlays.push({ url, bounds }); return layer('image')(); },
    tileLayer: layer('tile'), polygon: layer('zone'), polyline: layer('route'), marker: layer('marker'), divIcon: () => ({}),
    latLngBounds: (points: LatLng[]) => ({ points, isValid: () => points.length > 0 }),
  };
  const mapEl = { querySelector: () => null };
  const window: Record<string, unknown> = { L };
  const ctx = vm.createContext({
    window, L,
    document: { getElementById: (id: string) => (id === 'm-map' ? mapEl : null), documentElement: { classList: { contains: () => false } } },
    MutationObserver: class { observe() {} disconnect() {} },
  });
  vm.runInContext(SRC, ctx);
  (window.__MapViewLeaflet as { init: (o: unknown) => void }).init({ id: 'm', center: [39, 35], zoom: 5, ...opts });
  return { fits, drawn: drawn.filter((k) => k !== 'tile'), tiles: drawn.filter((k) => k === 'tile').length, placed, overlays, created, CRS };
}

const run = (opts: Opts) => exec(opts).fits;

const ZONE: LatLng[] = [[41, 28], [41, 30], [40, 29]];
const ROUTE: LatLng[] = [[39.9, 32.8], [38.4, 27.1]];

describe('MapView fit-to-bounds', () => {
  it('frames a map of zones alone', () => {
    expect(run({ zones: [{ positions: ZONE }], fitBoundsPadding: 32 })).toEqual([{ points: ZONE, padding: [32, 32] }]);
  });

  it('frames a map of routes alone', () => {
    expect(run({ routes: [{ positions: ROUTE }], fitBoundsPadding: 16 })).toEqual([{ points: ROUTE, padding: [16, 16] }]);
  });

  it('frames markers, zone vertices and route vertices together', () => {
    const fits = run({ markers: [{ position: [37, 35.3] }], zones: [{ positions: ZONE }], routes: [{ positions: ROUTE }], fitBoundsPadding: 32 });
    expect(fits).toEqual([{ points: [[37, 35.3], ...ZONE, ...ROUTE], padding: [32, 32] }]);
  });

  it('does not fit without a padding, nor with nothing to frame', () => {
    expect(run({ zones: [{ positions: ZONE }] })).toEqual([]);
    expect(run({ fitBoundsPadding: 32 })).toEqual([]);
  });
});

// Layer visibility (kui-react MapCanvas showMarkers / showZones / showRoutes parity).
describe('MapView layer visibility', () => {
  const ALL = { markers: [{ position: [37, 35.3] as LatLng }], zones: [{ positions: ZONE }], routes: [{ positions: ROUTE }], fitBoundsPadding: 32 };

  it('draws every layer by default', () => {
    expect(exec(ALL).drawn).toEqual(['zone', 'route', 'marker']);
  });

  it('leaves a hidden layer off the map', () => {
    expect(exec({ ...ALL, showMarkers: false }).drawn).toEqual(['zone', 'route']);
    expect(exec({ ...ALL, showZones: false }).drawn).toEqual(['route', 'marker']);
    expect(exec({ ...ALL, showRoutes: false }).drawn).toEqual(['zone', 'marker']);
    expect(exec({ ...ALL, showMarkers: false, showZones: false, showRoutes: false }).drawn).toEqual([]);
  });

  it('still frames hidden layers, so hiding never moves the view', () => {
    const shown = run(ALL);
    const hidden = run({ ...ALL, showMarkers: false, showZones: false, showRoutes: false });
    expect(hidden).toEqual(shown);
    expect(hidden).toEqual([{ points: [[37, 35.3], ...ZONE, ...ROUTE], padding: [32, 32] }]);
  });
});

// Image (floor-plan) map (kui-react MapCanvas `image` parity, modules/ui/MapView/parts/LeafletCanvas.tsx):
// flat coordinates, a picture instead of tiles, [y, x] pixels from the picture's top-left.
describe('MapView image map', () => {
  const IMAGE = { url: '/plans/floor-1.png', width: 1000, height: 600 };

  it('uses flat coordinates, draws the picture over its bounds and no tiles', () => {
    const r = exec({ image: IMAGE, fitBoundsPadding: 32 });
    expect(r.created).toHaveLength(1);
    expect((r.created[0].options as { crs: unknown }).crs).toBe(r.CRS.Simple);
    expect(r.overlays).toEqual([{ url: '/plans/floor-1.png', bounds: [[0, 0], [600, 1000]] }]);
    expect(r.tiles).toBe(0);
    expect(r.drawn).toEqual(['image']);
  });

  it('starts on the picture centre at zoom 0, minZoom -5 unless one is given', () => {
    const r = exec({ image: IMAGE });
    expect(r.created[0]).toEqual({ options: { crs: r.CRS.Simple, zoomSnap: 0.1, zoomDelta: 0.5, minZoom: -5 }, view: [[300, 500], 0] });
    expect((exec({ image: IMAGE, minZoom: -2 }).created[0].options as { minZoom: number }).minZoom).toBe(-2);
  });

  it('flips [y, x] from the top-left to Leaflet upward y for markers, zones and routes', () => {
    const r = exec({
      image: IMAGE,
      markers: [{ position: [100, 200] }],
      zones: [{ positions: [[0, 0], [0, 1000], [600, 1000]] }],
      routes: [{ positions: [[50, 10], [550, 990]] }],
    });
    expect(r.placed).toEqual([
      { kind: 'zone', at: [[600, 0], [600, 1000], [0, 1000]] },
      { kind: 'route', at: [[550, 10], [50, 990]] },
      { kind: 'marker', at: [500, 200] },
    ]);
  });

  it('frames the whole picture, not its markers', () => {
    const fits = run({ image: IMAGE, markers: [{ position: [100, 200] }], zones: [{ positions: ZONE }], fitBoundsPadding: 16 });
    expect(fits).toEqual([{ points: [[0, 0], [600, 1000]], padding: [16, 16] }]);
  });

  it('refuses an unsafe picture address: flat coordinates stay, no picture is drawn', () => {
    for (const url of ['javascript:alert(1)', 'data:image/svg+xml,<svg/>', '//evil.example/p.png', '/\\evil.example/p.png', 'http://x.example/p.png', 'java\tscript:x', 'plans/p.png', '', 42]) {
      const r = exec({ image: { url, width: 1000, height: 600 } });
      expect(r.overlays, String(url)).toEqual([]);
      expect((r.created[0].options as { crs: unknown }).crs).toBe(r.CRS.Simple);
    }
    expect(exec({ image: { url: 'https://cdn.example/p.png', width: 10, height: 10 } }).overlays).toEqual([{ url: 'https://cdn.example/p.png', bounds: [[0, 0], [10, 10]] }]);
  });

  it('ignores an image without a positive size (a geographic map with tiles)', () => {
    const r = exec({ image: { url: '/p.png', width: 0, height: 600 }, markers: [{ position: [37, 35] }] });
    expect(r.overlays).toEqual([]);
    expect(r.tiles).toBe(1);
    expect(r.created[0].view).toEqual([[39, 35], 5]);
    expect(r.placed).toEqual([{ kind: 'marker', at: [37, 35] }]);
  });
});
