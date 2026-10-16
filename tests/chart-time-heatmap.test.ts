// Chart maths and server rendering, kui-react parity: value-axis ticks and bounds, label
// thinning, the right axis, stacks, marks, time labels and zones, heatmap grid, gauge.
// The pure maths lives in modules/ui/Chart/scripts/chart-helpers.js and mirrors kui-react's
// charts/_helpers.ts, _time.ts and _heatmap.ts one to one; these are the cases its tests pin.
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

describe('value axis: round steps and bounds (kui-react _helpers.ts)', () => {
  it('niceStep picks 1, 2, 2.5 or 5 times a power of ten', () => {
    expect(K.niceStep(351, 4)).toBe(100);
    expect(K.niceStep(10, 4)).toBe(2.5);
    expect(K.niceStep(0.9, 4)).toBe(0.25);
    expect(K.niceStep(0, 4)).toBe(1);
  });
  it('niceTicks never prints a value like 263.25 on a 0-351 axis', () => {
    expect(K.niceTicks(0, 351, 4)).toEqual([0, 100, 200, 300]);
    expect(K.niceTicks(0, 0)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(K.niceTicks(0, 1, 4)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });
  it('a resolved domain is spanned exactly by its ticks', () => {
    for (const [lo, hi] of [[16.6, 25.3], [0, 351], [3, 7.2], [-12, 48]]) {
      const d = K.resolveDomain({ min: lo, max: hi }, { count: 4 });
      const t: number[] = K.niceTicks(d.min, d.max, 4);
      expect(t[0]).toBeCloseTo(d.min, 9);
      expect(t[t.length - 1]).toBeCloseTo(d.max, 9);
    }
    expect(K.resolveDomain({ min: 0, max: 351 })).toEqual({ min: 0, max: 400 });
    expect(K.resolveDomain({ min: 0, max: 80 }, { count: 8 }).max).toBe(80);
  });
  it('resolveDomain: thresholds widen an automatic end, fixed bounds win', () => {
    expect(K.resolveDomain({ min: 0, max: 10 }, { thresholds: [{ value: 15 }] })).toEqual({ min: 0, max: 15 });
    expect(K.resolveDomain({ min: 0, max: 10 }, { min: 2, max: 8, thresholds: [{ value: 15 }] })).toEqual({ min: 2, max: 8 });
  });
  it('the right axis takes the left grid: same intervals, round step, covering its data', () => {
    const r = K.alignedDomain({ min: 41, max: 53 }, 3);
    expect(r.ticks).toHaveLength(4);
    expect(r.min).toBeLessThanOrEqual(41);
    expect(r.max).toBeGreaterThanOrEqual(53);
    expect(r.ticks[1] - r.ticks[0]).toBe(5);
    expect(K.alignedDomain({ min: 0, max: 1 }, 2, { min: 0, max: 100 }).ticks).toEqual([0, 50, 100]);
  });
  it('thinLabels keeps every k-th label so they never overlap; positions stay', () => {
    const ticks = Array.from({ length: 30 }, (_, i) => ({ position: i * 10, label: `${i + 1} Oct` }));
    const thin = K.thinLabels(ticks, 300);
    expect(thin).toHaveLength(30);
    expect(thin.map((t: { position: number }) => t.position)).toEqual(ticks.map((t) => t.position));
    const shown = thin.filter((t: { label: string }) => t.label);
    expect(shown.length).toBeLessThan(30);
    expect(shown.length * (K.labelWidth(['30 Oct']) + 12)).toBeLessThanOrEqual(300 + K.labelWidth(['30 Oct']) + 12);
    expect(K.thinLabels(ticks.slice(0, 3), 600)).toEqual(ticks.slice(0, 3));
  });
  it('plotPadding leaves room for long labels, a second axis and titles', () => {
    const p = K.plotPadding({ yTickLabels: ['100000'], y2TickLabels: ['40'], yLabel: 'kW', y2Label: '°C', xLabel: 'Day' });
    expect(p.left).toBe(K.labelWidth(['100000']) + 12 + 18);
    expect(p.right).toBe(K.labelWidth(['40']) + 12 + 18);
    expect(p.bottom).toBe(24 + 16);
    expect(K.plotPadding({ yTickLabels: ['1'], showYAxis: false, showXAxis: false }).left).toBe(8);
  });
});

describe('paths, marks and stacks', () => {
  it('step paths retrace in reverse; curves; dash patterns', () => {
    expect(K.stepPath([{ x: 0, y: 0 }, { x: 10, y: 5 }])).toBe('M0 0 H10 V5');
    expect(K.stepPath([{ x: 10, y: 5 }, { x: 0, y: 0 }], 'before')).toBe('M10 5 V0 H0');
    expect(K.continuePath([{ x: 1, y: 2 }, { x: 3, y: 4 }], 'linear', 'after')).toBe('L1 2 L3 4');
    expect(K.curvePath([{ x: 0, y: 0 }, { x: 2, y: 2 }], 'linear')).toBe('M0 0 L2 2');
    expect(K.dashArray('solid')).toBeUndefined();
    expect(K.dashArray('dotted', 2)).toBe('0 4');
    expect(K.dashArray('dashed', 5)).toBe('15 10');
  });
  it('point shapes', () => {
    expect(K.pointPath('diamond', 10, 10, 4)).toMatch(/^M10 5L15 10/);
    expect(K.pointPath('square', 10, 10, 10)).toBe('M1 1H19V19H1Z');
    expect(K.pointPath('triangle', 0, 0, 10)).toMatch(/^M0 -12L/);
  });
  it('stack groups: series sharing a key stack, others stand alone; extents can leave zero out', () => {
    const s = [
      { id: 'a', name: 'a', data: [{ x: 1, y: 1 }], stack: 'g' },
      { id: 'b', name: 'b', data: [{ x: 1, y: 2 }], stack: 'g' },
      { id: 'c', name: 'c', data: [{ x: 1, y: 5 }] },
    ];
    const keys = K.stackKeys(s, false);
    expect(keys[2]).toBeNull();
    expect(K.stackKeys(s, true)[2]).not.toBeNull();
    const { tops, below } = K.groupedStackTops(s, keys);
    expect(tops.map((t: number[]) => t[0])).toEqual([1, 3, 5]);
    expect(below).toEqual([-1, 0, -1]);
    expect(K.topsExtent([[5, 7]], false)).toEqual({ min: 5, max: 7 });
    expect(K.topsExtent([[5, 7]])).toEqual({ min: 0, max: 7 });
  });
  it('series stats and legend values', () => {
    const s = { id: 'a', name: 'A', data: [{ x: 'Mon', y: 1 }, { x: 'Tue', y: 3 }, { x: 'Wed', y: 2 }] };
    expect(K.seriesStats(s)).toEqual({ latest: 2, min: 1, max: 3, avg: 2, total: 6 });
    expect(K.legendValueTexts([s], ['latest', 'max'], (v: number) => `${v} u`)).toEqual({ a: '2 u · max 3 u' });
    expect(K.valueText(s, 2, { label: 'two' })).toBe('two');
  });
});

describe('time labels (kui-react _time.ts)', () => {
  it('time ticks are 24 h; dates read d MMM', () => {
    const t = Date.UTC(2026, 9, 6, 15, 30);
    expect(K.formatTick(t, 3_600_000, 'en-US', 'UTC')).toBe('15:30');
    expect(K.dayMonthText(t, 'en-US', 'UTC')).toBe('6 Oct');
    expect(K.dayMonthText(t, 'en-US', 'UTC', true)).toBe('6 Oct 2026');
    expect(K.formatTick(t, 30 * 86_400_000, 'en-US', 'UTC')).toBe('6 Oct');
    expect(K.formatFull(t, 3_600_000, 'en-US', 'UTC')).toBe('6 Oct 15:30');
  });
  it('day ticks land on midnight in the axis time zone', () => {
    const d: [number, number] = [Date.UTC(2026, 9, 1, 5), Date.UTC(2026, 9, 8, 5)];
    const ticks: number[] = K.timeTicks(d, 8, 'Europe/Istanbul');
    ticks.forEach((t) => expect(new Date(t + 3 * 3_600_000).getUTCHours()).toBe(0));
    expect(K.zoneOffsetMs(Date.UTC(2026, 0, 1), 'UTC')).toBe(0);
  });
  it('visibleYExtent can leave zero out', () => {
    expect(K.visibleYExtent([[{ t: 1, y: 10 }, { t: 2, y: 20 }]], [0, 5], false)).toEqual({ min: 10, max: 20 });
  });
});

describe('Chart.ejs dispatch', () => {
  const series = [{ id: 'a', name: 'A', data: [{ x: '2026-10-06T00:00:00Z', y: 1 }, { x: '2026-10-06T01:00:00Z', y: 3 }] }];
  const render = (locals: Record<string, unknown>) => ejs.renderFile(CHART, { id: 'c1', ...locals });
  const cfgOf = (html: string) => JSON.parse(/data-kui-chart-config="([^"]*)"/.exec(html)![1].replace(/&#34;/g, '"').replace(/&amp;/g, '&'));

  it('xAxis="time" (and the xScale alias) on line/area go to the series renderer in time mode', async () => {
    for (const locals of [{ type: 'line', xAxis: 'time' }, { type: 'area', xScale: 'time' }]) {
      const html = await render({ ...locals, series });
      expect(html).toContain('data-kui-chart-kind="series"');
      expect(html).toMatch(/<button[^>]*data-kui-chart-reset/);
      expect(html).toContain('Reset zoom');
      expect(cfgOf(html)).toMatchObject({ variant: locals.type, mode: 'time' });
    }
  });
  it('xAxis wins over xScale; resetZoomLabel and zoom=false are honoured', async () => {
    const band = await render({ type: 'line', xAxis: 'band', xScale: 'time', series });
    expect(cfgOf(band).mode).toBe('band');
    expect(band).not.toMatch(/<button[^>]*data-kui-chart-reset/);
    const html = await render({ type: 'line', xAxis: 'time', series, resetZoomLabel: 'Whole range' });
    expect(html).toContain('Whole range');
    expect(await render({ type: 'line', xAxis: 'time', zoom: false, series })).not.toMatch(/<button[^>]*data-kui-chart-reset/);
  });
  it('a stacked area ignores the time axis; bar has its own renderer', async () => {
    expect(cfgOf(await render({ type: 'area', xAxis: 'time', stacked: true, series }))).toMatchObject({ mode: 'band', stacked: true });
    const bar = await render({ type: 'bar', xAxis: 'time', series });
    expect(bar).toContain('data-kui-chart-kind="bar"');
    expect(bar).toContain('K.renderers.bar = render');
  });
  it('the settings surface travels in the config; functions are left out', async () => {
    const cfg = cfgOf(await render({
      type: 'bar', series, yMin: 0, yMax: 100, yTickCount: 6, gridStyle: 'dotted', y2Label: 'R', thresholds: [{ value: 3 }],
      markers: [{ at: 1, label: 'Mean' }], orientation: 'horizontal', yFormat: 'fmt', tooltipValueFormat: (v: number) => v, unknownProp: 1,
    }));
    expect(cfg).toMatchObject({ yMin: 0, yMax: 100, yTickCount: 6, gridStyle: 'dotted', y2Label: 'R', orientation: 'horizontal', yFormat: 'fmt' });
    expect(cfg.thresholds).toEqual([{ value: 3 }]);
    expect(cfg.markers).toEqual([{ at: 1, label: 'Mean' }]);
    expect(cfg).not.toHaveProperty('tooltipValueFormat');
    expect(cfg).not.toHaveProperty('unknownProp');
  });
  it('donut is the pie renderer with innerRadius 0.6 unless given', async () => {
    const pie = [{ id: 'p', name: 'p', data: [{ x: 'A', y: 30 }, { x: 'B', y: 10 }] }];
    expect(cfgOf(await render({ type: 'donut', series: pie })).innerRadius).toBe(0.6);
    expect(cfgOf(await render({ type: 'donut', series: pie, innerRadius: 0.7 })).innerRadius).toBe(0.7);
    expect(await render({ type: 'pie', series: pie })).toContain('data-kui-chart-kind="pie"');
  });
  it('the frame follows the legend position and fill', async () => {
    expect(await render({ type: 'line', series })).toContain('class="kui-chart flex w-full flex-col"');
    expect(await render({ type: 'line', series, legendPosition: 'right' })).toContain('flex w-full flex-row gap-4 items-center');
    expect(await render({ type: 'line', series, showLegend: false })).toContain('class="kui-chart w-full"');
    const fill = await render({ type: 'line', series, fill: true });
    expect(fill).toContain('h-full min-h-0');
    expect(fill).toContain('style="min-height: 80px;"');
  });
  it('heatmap: client config, legend side layout', async () => {
    const html = await render({ type: 'heatmap', cells: [{ x: 'a', y: 'b', value: 1 }], series, valueLabel: 'Msgs', legendPosition: 'right' });
    expect(html).toContain('data-kui-chart-kind="heatmap"');
    expect(html).toContain('flex flex-row items-stretch gap-3');
    expect(cfgOf(html).valueLabel).toBe('Msgs');
  });
  it('loadHelpers:false leaves the helper scripts out', async () => {
    const html = await render({ type: 'line', xAxis: 'time', series, loadHelpers: false });
    expect(html).not.toContain('global.KuiChart = ');
    expect(html).not.toContain('K.renderers.series = render');
  });
});

describe('gauge (server rendered, kui-react GaugeChart)', () => {
  const gauge = (locals: Record<string, unknown>) => ejs.renderFile(CHART, { id: 'g', type: 'gauge', ...locals });
  const bands = [{ to: 50, tone: 'success' }, { to: 100, tone: 'error' }];
  it('is a meter with value, range and band name', async () => {
    const html = await gauge({ value: 72, unit: '%', bands });
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('aria-valuenow="72"');
    expect(html).toMatch(/aria-valuetext="72 %, error"/);
    expect(html).toContain('data-layout="arc"');
  });
  it('clamps the arc but keeps the real value in the text', async () => {
    const html = await gauge({ value: 250, max: 100 });
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-valuetext="250"');
    expect(html).toContain('stroke-dasharray="1 1"');
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
    expect(html).toContain('<circle cx="100" cy="100" r="6"');
    expect(html).toMatch(/<line[^>]*data-part="needle"/);
    expect(html).toContain('10 rpm');
  });
  it('draws bands as a thin outer line by default, or tinted on the track', async () => {
    const outer = await gauge({ value: 72, bands });
    const b = outer.match(/<path[^>]*data-part="band"[^>]*>/g)!;
    expect(b).toHaveLength(2);
    expect(b[0]).not.toContain('stroke-opacity');
    expect(Number(/stroke-width="([\d.]+)"/.exec(b[0])![1])).toBeLessThan(16);
    const track = await gauge({ value: 72, bands, bandStyle: 'track', bandOpacity: 0.6 });
    const t = track.match(/<path[^>]*data-part="band"[^>]*>/g)!;
    expect(t[0]).toContain('stroke-opacity="0.6"');
    expect(t[0]).toContain('stroke-width="16"');
  });
  it('writes the value, caption, min / max and tick labels as HTML text', async () => {
    const html = await gauge({ value: 72, unit: '%', label: 'CPU', ticks: 3, tickLabels: true });
    expect(html).not.toMatch(/<svg[\s\S]*<text[\s\S]*<\/svg>/);
    expect(html).toMatch(/data-part="value"><span>72<\/span><span[^>]*>%<\/span>/);
    expect(html).toMatch(/data-part="caption">CPU</);
    expect(html).toMatch(/data-part="min">0</);
    expect(html).toMatch(/data-part="max">100</);
    expect(html.match(/data-part="tick-label"/g)).toHaveLength(1);
  });
  it('needle styles and the bar / level layouts', async () => {
    expect(await gauge({ value: 40, needle: true, needleStyle: 'arrow' })).toMatch(/<path[^>]*data-part="needle"/);
    const level = await gauge({ value: 40, layout: 'level', needle: true, needleStyle: 'marker' });
    expect(level).toContain('data-layout="level"');
    expect(level).toContain('data-part="bulb"');
    expect(level).toMatch(/data-part="bar" style="height: calc\(40\.000% \+ 16px\)/);
    expect(await gauge({ value: 40, layout: 'bar-horizontal' })).toMatch(/data-part="bar" style="width: 40\.000%/);
    expect(await gauge({ value: 40, layout: 'bar-vertical' })).toMatch(/data-part="bar" style="height: 40\.000%/);
    expect(await gauge({ value: 40, layout: 'donut' })).toContain('data-layout="donut"');
  });
  it('bands with `from` and bandEdges decide which band a boundary value is in', async () => {
    const b = [{ from: 0, to: 50, tone: 'success', label: 'ok' }, { from: 50, to: 100, tone: 'error', label: 'hot' }];
    expect(await gauge({ value: 50, bands: b })).toContain('aria-valuetext="50, ok"');
    expect(await gauge({ value: 50, bands: b, bandEdges: 'from' })).toContain('aria-valuetext="50, hot"');
  });
});
