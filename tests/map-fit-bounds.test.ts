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
type Opts = { markers?: { position: LatLng }[]; zones?: { positions: LatLng[] }[]; routes?: { positions: LatLng[] }[]; fitBoundsPadding?: number };

function run(opts: Opts) {
  const fits: { points: LatLng[]; padding: unknown }[] = [];
  const layer = () => ({ addTo() { return this; }, bindTooltip() { return this; }, on() { return this; } });
  const L = {
    map: () => ({ setView() { return this; }, removeLayer() {}, fitBounds(b: { points: LatLng[] }, o: { padding: unknown }) { fits.push({ points: b.points, padding: o.padding }); } }),
    tileLayer: layer, polygon: layer, polyline: layer, marker: layer, divIcon: () => ({}),
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
  return fits;
}

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
