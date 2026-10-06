// Chart additions (gauge, heatmap, time axis + zoom, stacked) — kui-react parity.
// The pure maths lives in modules/ui/Chart/scripts/chart-helpers.js and mirrors
// kui-react's charts/_time.ts, _heatmap.ts and _helpers.ts one to one, so these
// cases are the same ones kui-react's chart-math tests pin.
import { describe, it, expect, beforeAll } from 'vitest';
import ejs from 'ejs';
import { createRequire } from 'node:module';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..');
const CHART = path.join(REPO_ROOT, 'modules/ui/Chart/Chart.ejs');
const require_ = createRequire(import.meta.url);

type K = Record<string, any>;
let K: K;
beforeAll(() => {
  require_(path.join(REPO_ROOT, 'modules/ui/Chart/scripts/chart-helpers.js'));
  K = (globalThis as unknown as { KuiChart: K }).KuiChart;
});

describe('time maths', () => {
  it('toTime: ms numbers, ISO strings, bad input', () => {
    expect(K.toTime(1_000)).toBe(1_000);
    expect(K.toTime(Number.NaN)).toBeNull();
    expect(K.toTime('2026-10-06T00:00:00Z')).toBe(Date.UTC(2026, 9, 6));
    expect(K.toTime('not a date')).toBeNull();
    expect(K.toTime({})).toBeNull();
  });
  it('a date-only string is a local calendar day, not UTC midnight', () => {
    expect(K.toTime('2026-10-06')).toBe(new Date(2026, 9, 6).getTime());
  });
  it('isTimeSeries needs every point parsable and at least one point', () => {
    const ok = [{ id: 'a', name: 'A', data: [{ x: '2026-10-06T00:00:00Z', y: 1 }] }];
    expect(K.isTimeSeries(ok)).toBe(true);
    expect(K.isTimeSeries([])).toBe(false);
    expect(K.isTimeSeries([{ id: 'a', name: 'A', data: [{ x: 'Mon', y: 1 }] }])).toBe(false);
  });
  it('timeExtent widens a single instant by 30 minutes each side', () => {
    const t = Date.UTC(2026, 9, 6);
    const [lo, hi] = K.timeExtent([{ id: 'a', name: 'A', data: [{ x: t, y: 1 }] }]);
    expect(lo).toBe(t - 30 * 60_000);
    expect(hi).toBe(t + 30 * 60_000);
    expect(K.timeExtent([])).toEqual([0, 1]);
  });
  it('visibleYExtent covers only visible points and always includes zero', () => {
    const all = [[{ t: 1, y: 10 }, { t: 2, y: 20 }, { t: 3, y: 500 }]];
    expect(K.visibleYExtent(all, [1, 2])).toEqual({ min: 0, max: 20 });
    expect(K.visibleYExtent([[{ t: 1, y: null }]], [0, 5])).toEqual({ min: 0, max: 1 });
  });
  it('xTime and invTime are inverses; a flat domain centres', () => {
    const rect = { x: 40, y: 0, width: 400, height: 100 };
    const d: [number, number] = [1000, 2000];
    expect(K.xTime(1000, d, rect)).toBe(40);
    expect(K.xTime(2000, d, rect)).toBe(440);
    expect(K.invTime(K.xTime(1500, d, rect), d, rect)).toBeCloseTo(1500);
    expect(K.xTime(5, [5, 5], rect)).toBe(240);
  });
  it('tickStep picks the smallest step with at most `target` ticks', () => {
    expect(K.tickStep(60_000, 6)).toBe(15_000);
    expect(K.tickStep(24 * 3_600_000, 6)).toBe(6 * 3_600_000);
    expect(K.tickStep(1e15, 6)).toBe(365 * 86_400_000);
  });
  it('timeTicks stay inside the domain and are step aligned', () => {
    const d: [number, number] = [Date.UTC(2026, 9, 6, 8), Date.UTC(2026, 9, 6, 15)];
    const ticks: number[] = K.timeTicks(d, 6);
    expect(ticks.length).toBeGreaterThan(1);
    ticks.forEach((t) => { expect(t).toBeGreaterThanOrEqual(d[0]); expect(t).toBeLessThanOrEqual(d[1]); });
    expect(K.timeTicks([5, 5])).toEqual([5]);
  });
  it('brushDomain ignores a click-sized or sub-second brush and clamps to the full range', () => {
    const rect = { x: 0, y: 0, width: 1000, height: 100 };
    const full: [number, number] = [0, 1_000_000];
    expect(K.brushDomain(100, 104, full, full, rect)).toBeNull();
    expect(K.brushDomain(100, 700, full, full, rect)).toEqual([100_000, 700_000]);
    expect(K.brushDomain(900, 100, full, full, rect)).toEqual([100_000, 900_000]);
    expect(K.brushDomain(0, 8, [0, 5000], [0, 5000], rect)).toBeNull(); // 40 ms < MIN_ZOOM_MS
  });
  it('nearestIndex: ties go to the earlier time, empty is -1', () => {
    expect(K.nearestIndex([], 5)).toBe(-1);
    expect(K.nearestIndex([10, 20, 30], 14)).toBe(0);
    expect(K.nearestIndex([10, 20, 30], 15)).toBe(0);
    expect(K.nearestIndex([10, 20, 30], 16)).toBe(1);
    expect(K.nearestIndex([10, 20, 30], 99)).toBe(2);
  });
});

describe('heatmap grid', () => {
  it('orders by first appearance, sorts an all-numeric axis, last value wins, bad value is an empty cell', () => {
    const g = K.buildHeatGrid([
      { x: '10', y: 'b', value: 1 }, { x: '9', y: 'a', value: 5 }, { x: '10', y: 'a', value: Number.NaN },
      { x: '10', y: 'b', value: 7 },
    ]);
    expect(g.xs).toEqual(['9', '10']);
    expect(g.ys).toEqual(['b', 'a']);
    expect(g.values[0][1]).toBe(7);
    expect(g.values[1][0]).toBe(5);
    expect(g.values[1][1]).toBeNull();
    expect(g.min).toBe(5);
    expect(g.max).toBe(7);
  });
  it('an empty grid has a 0..1 domain; axes are capped', () => {
    expect(K.buildHeatGrid([])).toMatchObject({ xs: [], ys: [], min: 0, max: 1 });
    const many = Array.from({ length: 10 }, (_, i) => ({ x: i, y: 0, value: 1 }));
    expect(K.buildHeatGrid(many, 3).xs).toHaveLength(3);
  });
  it('heatIntensity clamps and a flat range is full', () => {
    expect(K.heatIntensity(5, 0, 10)).toBe(0.5);
    expect(K.heatIntensity(-5, 0, 10)).toBe(0);
    expect(K.heatIntensity(50, 0, 10)).toBe(1);
    expect(K.heatIntensity(3, 3, 3)).toBe(1);
  });
});

describe('stack maths', () => {
  const s = [
    { id: 'a', name: 'A', data: [{ x: 'x', y: 2 }, { x: 'y', y: -3 }, { x: 'z', y: null }] },
    { id: 'b', name: 'B', data: [{ x: 'x', y: 3 }, { x: 'y', y: 4 }, { x: 'z', y: 1 }] },
  ];
  it('stackedExtent sums positives only; an empty stack is 0..1', () => {
    expect(K.stackedExtent(s)).toEqual({ min: 0, max: 5 });
    expect(K.stackedExtent([])).toEqual({ min: 0, max: 1 });
  });
  it('stackTops accumulates; negatives count as 0; null stays null', () => {
    expect(K.stackTops(s)).toEqual([[2, 0, null], [5, 4, 1]]);
  });
});

describe('Chart.ejs dispatch', () => {
  const series = [{ id: 'a', name: 'A', data: [{ x: '2026-10-06T00:00:00Z', y: 1 }, { x: '2026-10-06T01:00:00Z', y: 3 }] }];
  const render = (locals: Record<string, unknown>) => ejs.renderFile(CHART, { id: 'c1', ...locals });
  const cfgOf = (html: string) => JSON.parse(/data-kui-chart-config="([^"]*)"/.exec(html)![1].replace(/&#34;/g, '"').replace(/&amp;/g, '&'));

  it('xAxis="time" (and the xScale alias) on line/area go to the time renderer', async () => {
    for (const locals of [{ type: 'line', xAxis: 'time' }, { type: 'area', xScale: 'time' }]) {
      const html = await render({ ...locals, series });
      expect(html).toContain('data-kui-chart-kind="time"');
      expect(html).toMatch(/<button[^>]*data-kui-chart-reset/);
      expect(html).toContain('Reset zoom');
      expect(cfgOf(html).variant).toBe(locals.type);
    }
  });
  it('xAxis wins over xScale; resetZoomLabel and zoom=false are honoured', async () => {
    const band = await render({ type: 'line', xAxis: 'band', xScale: 'time', series });
    expect(band).not.toContain('data-kui-chart-kind="');
    const html = await render({ type: 'line', xAxis: 'time', series, resetZoomLabel: 'Whole range' });
    expect(html).toContain('Whole range');
    expect(await render({ type: 'line', xAxis: 'time', zoom: false, series })).not.toMatch(/<button[^>]*data-kui-chart-reset/);
  });
  it('a stacked area ignores the time axis; bar never uses it', async () => {
    expect(await render({ type: 'area', xAxis: 'time', stacked: true, series })).not.toContain('data-kui-chart-kind="');
    expect(await render({ type: 'bar', xAxis: 'time', series })).not.toContain('data-kui-chart-kind="');
  });
  it('heatmap: client config, no series legend', async () => {
    const html = await render({ type: 'heatmap', cells: [{ x: 'a', y: 'b', value: 1 }], series, valueLabel: 'Msgs' });
    expect(html).toContain('data-kui-chart-kind="heatmap"');
    expect(html).not.toContain('kui-chart-legend');
    expect(cfgOf(html).valueLabel).toBe('Msgs');
  });
  it('loadHelpers:false leaves the helper scripts out', async () => {
    const html = await render({ type: 'line', xAxis: 'time', series, loadHelpers: false });
    expect(html).not.toContain('window.KuiChart = ');
    expect(html).not.toContain('KuiChart.renderers.time');
  });
  it('stacked bar/area pass the flag to the partial', async () => {
    expect(await render({ type: 'bar', stacked: true, series })).toContain('var stacked = true;');
    expect(await render({ type: 'area', series })).toContain('var stacked = false;');
  });
});

describe('gauge (server rendered)', () => {
  const gauge = (locals: Record<string, unknown>) => ejs.renderFile(CHART, { id: 'g', type: 'gauge', ...locals });
  const bands = [{ to: 50, tone: 'success' }, { to: 100, tone: 'error' }];
  it('is a meter with value, range and band name', async () => {
    const html = await gauge({ value: 72, unit: '%', bands });
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('aria-valuenow="72"');
    expect(html).toMatch(/aria-valuetext="72 %, error"/);
    expect(html).toContain('viewBox="0 0 200 118"');
  });
  it('clamps the arc but keeps the real value in the text', async () => {
    const html = await gauge({ value: 250, max: 100 });
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-valuetext="250"');
  });
  it('no value: no valuenow, a dash, and the stale hint on request', async () => {
    const html = await gauge({ value: null, stale: true });
    expect(html).not.toContain('aria-valuenow');
    expect(html).toContain('aria-valuetext="no value"');
    expect(html).toContain('opacity-60');
    expect(html).toContain('>stale<');
  });
  it('a needle adds the line + hub; a custom format function is applied', async () => {
    const html = await gauge({ value: 10, needle: true, format: (v: number) => `${v} rpm` });
    expect(html).toContain('<circle cx="100" cy="100" r="5"');
    expect(html).toContain('10 rpm');
  });
  it('band segments are drawn at 0.28 opacity under the value arc', async () => {
    const html = await gauge({ value: 10, bands });
    expect(html.match(/stroke-opacity="0.28"/g)).toHaveLength(2);
  });
});
