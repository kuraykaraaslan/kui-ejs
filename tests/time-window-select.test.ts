// TimeWindowSelect (kui-react parity, modules/ui/TimeWindowSelect.tsx) and the controlled
// Popover it sits in. The draft state is DOM-free (scripts/time-window-logic.js) and is driven
// here the way kui-react's tests drive the component; the markup is checked through
// ejs.renderFile. Browser behaviour was exercised separately with puppeteer.
import { describe, it, expect, beforeAll } from 'vitest';
import ejs from 'ejs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const UI = path.join(ROOT, 'modules/ui');
const require_ = createRequire(import.meta.url);

type Fn = (...a: any[]) => any;
type Logic = Record<string, any>;
let L: Logic;
beforeAll(() => {
  L = require_(path.join(UI, 'TimeWindowSelect/scripts/time-window-logic.js'));
});

const render = (file: string, locals: Record<string, unknown>) => ejs.renderFile(path.join(UI, file), locals);
const NOW = Date.parse('2026-10-17T10:07:30.000Z');
const CAL = [
  'current.hour', 'current.day', 'current.week', 'current.isoWeek', 'current.month', 'current.quarter', 'current.halfYear', 'current.year',
  'previous.hour', 'previous.day', 'previous.week', 'previous.isoWeek', 'previous.month', 'previous.quarter', 'previous.halfYear', 'previous.year',
  'dayBeforeYesterday', 'thisDayLastWeek',
];
const PRESETS = ['5m', '15m', '30m', '1h', '6h', '12h', '24h', '3d', '7d', '30d'];
const M = {
  label: 'Time window', realtime: 'Realtime', history: 'History', last: 'Last', soFar: 'So far',
  periods: { 'current.day': 'Today', 'previous.month': 'Previous month' },
};
const draft = (value: unknown, extra: Record<string, unknown> = {}) => {
  const d = L.createTimeWindowDraft({ value, presets: PRESETS, calendarPeriods: CAL, now: () => NOW, ...extra });
  d.begin();
  return d as Record<string, Fn> & { state: Record<string, any> };
};

describe('TimeWindowSelect markup', () => {
  it('a button names the window; the panel is a closed, controlled popover on the right tab', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h', aggregation: 'max', interval: '1h', timezone: 'Asia/Tokyo' } });
    expect(html).toContain('<div id="tws" class="relative inline-block" data-popover-controlled>');
    expect(html).toMatch(/id="tws-trigger"\s+type="button"\s+aria-haspopup="dialog"\s+aria-expanded="false"\s+aria-label="Change time window: Realtime · Last 24h · max 1h · Asia\/Tokyo"/);
    expect(html).toContain('class="inline-flex h-8 max-w-full items-center gap-2 rounded-md border border-border bg-surface-base px-3 text-sm text-text-primary hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"');
    expect(html).toContain('<span class="truncate" data-kui-tws-summary>Realtime · Last 24h · max 1h · Asia/Tokyo</span>');
    expect(html).toMatch(/id="tws-panel"\s+role="dialog"\s+aria-label="Time window"\s+tabindex="-1"\s+hidden\s+data-state="closed"/);
    expect(html).toContain('class="absolute z-[70] min-w-[12rem] rounded-lg border border-border bg-surface-raised shadow-xl focus-visible:outline-none top-full left-0 mt-2 w-[26rem] max-w-[calc(100vw-2rem)] p-3"');
    expect(html).toMatch(/id="tws-tab-realtime" type="button" role="tab" aria-selected="true" aria-controls="tws-panel-realtime" tabindex="0"\s+class="flex-1 rounded-md px-3 py-1\.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg shadow-sm"/);
    expect(html).toMatch(/id="tws-tab-history" type="button" role="tab" aria-selected="false" aria-controls="tws-panel-history" tabindex="-1"/);
    expect(html).toMatch(/id="tws-panel-realtime" role="tabpanel" aria-labelledby="tws-tab-realtime" class="space-y-3" data-kui-tws-panel="realtime">/);
    expect(html).toMatch(/id="tws-panel-history" role="tabpanel" aria-labelledby="tws-tab-history" class="space-y-3" data-kui-tws-panel="history" hidden>/);
  });

  it('presets in order, the active one checked; amount / unit start from the value', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '7d' } });
    const chips = [...html.matchAll(/role="radio" aria-checked="(true|false)" class="([^"]*)" data-kui-tws-preset="([^"]+)"/g)];
    expect(chips.map((c) => c[3])).toEqual(PRESETS);
    expect(chips.filter((c) => c[1] === 'true').map((c) => c[3])).toEqual(['7d']);
    expect(chips.find((c) => c[3] === '7d')![2]).toBe('h-7 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg');
    expect(chips.find((c) => c[3] === '1h')![2]).toBe('h-7 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-surface-sunken text-text-secondary hover:text-text-primary');
    expect(html).toMatch(/<input id="tws-rt-amount" type="number" inputmode="numeric" min="1" aria-label="Amount" class="h-8 [^"]* w-20" value="7" data-kui-tws-amount="rt">/);
    expect(html).toMatch(/<option value="d" selected>days<\/option>/);
    expect(html).toMatch(/<input id="tws-h-amount" [^>]*data-kui-tws-amount="h" disabled>/);
    expect(html).toMatch(/class="space-y-2 rounded-md border p-2 border-primary" data-kui-tws-option="rt-last"/);
  });

  it('defaults: 12 intervals, 6 aggregations, all zones, current periods under Realtime and past ones under History', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: null });
    const sel = (label: string) => new RegExp(`<select aria-label="${label}"[^>]*>([\\s\\S]*?)</select>`).exec(html)![1];
    expect([...sel('Interval').matchAll(/<option value="([^"]+)"/g)].map((x) => x[1])).toEqual(['auto', '1m', '5m', '10m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '7d']);
    expect(sel('Interval')).toContain('<option value="auto" selected>Interval: auto</option>');
    expect([...sel('Aggregation').matchAll(/<option value="([^"]+)"/g)].map((x) => x[1])).toEqual(['avg', 'min', 'max', 'sum', 'count', 'none']);
    expect(sel('Aggregation')).toContain('<option value="avg" selected>Aggregate: avg</option>');
    expect(sel('Time zone')).toMatch(/^\s*<option value="" selected>Zone: default<\/option>\s*<option value="UTC">UTC<\/option>/);
    const current = /<select id="tws-current"[^>]*>([\s\S]*?)<\/select>/.exec(html)!;
    expect(current[0]).toContain('aria-label="Current period"');
    expect(current[0]).toMatch(/data-kui-tws-current disabled>/);
    expect([...current[1].matchAll(/<option value="([^"]+)"/g)].map((x) => x[1])).toEqual(CAL.slice(0, 8));
    const past = /<select id="tws-past"[^>]*>([\s\S]*?)<\/select>/.exec(html)!;
    expect([...past[1].matchAll(/<option value="([^"]+)"/g)].map((x) => x[1])).toEqual(CAL.slice(8));
    expect(past[1]).toContain('<option value="previous.day">Yesterday</option>');
    // no value: the fallback is the last 24h, and the trigger names the component
    expect(html).toContain('data-kui-tws-summary>Time window</span>');
    expect(html).toMatch(/aria-checked="true" class="[^"]*" data-kui-tws-preset="24h"/);
    // no interval: no bucket estimate
    expect(html).toMatch(/role="status" data-kui-tws-buckets hidden><\/p>/);
  });

  it('a fixed range opens on History with zoned, bounded inputs; an inverted one cannot be applied', async () => {
    const html = await render('TimeWindowSelect.ejs', {
      idPrefix: 'tws', calendarPeriods: [],
      value: { mode: 'absolute', from: '2026-10-16T00:00:00.000Z', to: '2026-10-17T00:00:00.000Z', timezone: 'Europe/Istanbul', interval: '1h' },
    });
    expect(html).toMatch(/aria-selected="true" aria-controls="tws-panel-history"/);
    expect(html).toMatch(/data-kui-tws-range>/);
    expect(html).toContain('<span data-kui-tws-from-label>From (Europe/Istanbul)</span>');
    expect(html).toContain('<span data-kui-tws-to-label>To (Europe/Istanbul)</span>');
    expect(html).toMatch(/<input id="tws-from" type="datetime-local" class="h-8 [^"]* w-full" data-kui-tws-from value="2026-10-16T03:00" max="2026-10-17T03:00">/);
    expect(html).toMatch(/<input id="tws-to" type="datetime-local" class="h-8 [^"]* w-full" data-kui-tws-to value="2026-10-17T03:00" min="2026-10-16T03:00">/);
    expect(html).toContain('data-kui-tws-summary>History · 2026-10-16 03:00 – 2026-10-17 03:00 · 1h · Europe/Istanbul</span>');
    expect(html).toMatch(/<p class="text-xs text-text-secondary" role="status" data-kui-tws-buckets>≈ 24 buckets<\/p>/);
    expect(html).not.toContain('data-kui-tws-option="rt-current"');
    expect(html).not.toContain('data-kui-tws-option="h-period"');
    expect(html).toMatch(/data-kui-tws-update>Update<\/button>/);
    const inverted = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'absolute', from: '2026-10-18T00:00:00.000Z', to: '2026-10-17T00:00:00.000Z' } });
    expect(inverted).toMatch(/data-kui-tws-update disabled>Update<\/button>/);
  });

  it('a current period opens on Realtime with its select and "so far" enabled; a past one on History', async () => {
    const cur = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'calendar', period: 'current.month', soFar: true } });
    expect(cur).toContain('data-kui-tws-summary>Realtime · This month (so far)</span>');
    expect(cur).toMatch(/data-kui-tws-radio="rt-current" checked>/);
    expect(cur).toMatch(/<select id="tws-current" aria-label="Current period" class="h-8 [^"]*" data-kui-tws-current>/);
    expect(cur).toMatch(/<option value="current.month" selected>This month<\/option>/);
    expect(cur).toMatch(/data-kui-tws-so-far checked>/);
    const past = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'calendar', period: 'previous.month' } });
    expect(past).toContain('data-kui-tws-summary>History · Previous month</span>');
    expect(past).toMatch(/data-kui-tws-radio="h-period" checked>/);
    expect(past).toMatch(/<option value="previous.month" selected>Previous month<\/option>/);
    expect(past).toMatch(/role="status" data-kui-tws-buckets hidden><\/p>/);
  });

  it('warns above maxBuckets; options hide the selects; messages override labels and period names', async () => {
    const warn = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h', interval: '1m' } });
    expect(warn).toMatch(/<p class="text-xs text-warning" role="status" data-kui-tws-buckets>≈ 1440 buckets: the server will use a coarser interval<\/p>/);
    const ok = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h', interval: '1m' }, maxBuckets: 2000 });
    expect(ok).toMatch(/<p class="text-xs text-text-secondary" role="status" data-kui-tws-buckets>≈ 1440 buckets<\/p>/);
    const bare = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: null, showInterval: false, showAggregation: false, showTimezone: false, calendarPeriods: [] });
    expect(bare).not.toContain('<select aria-label="Aggregation"');
    expect(bare).not.toContain('<select aria-label="Interval"');
    expect(bare).not.toContain('<select aria-label="Time zone"');
    expect(bare).not.toContain('role="status"');
    expect(bare).not.toContain('border-t border-border pt-3');
    const de = await render('TimeWindowSelect.ejs', {
      idPrefix: 'tws', value: { mode: 'calendar', period: 'current.day' },
      messages: { realtime: 'Echtzeit', update: 'Anwenden', open: 'Zeitfenster ändern', periods: { 'current.day': 'Heute' } },
    });
    expect(de).toContain('aria-label="Zeitfenster ändern: Echtzeit · Heute"');
    expect(de).toContain('data-kui-tws-update>Anwenden</button>');
    expect(de).toContain('<option value="current.week">This week</option>');
  });

  it('className goes on the trigger; ids are unique per instance when no idPrefix is given', async () => {
    expect(await render('TimeWindowSelect.ejs', { idPrefix: 'tws', className: 'w-full' })).toMatch(/focus-visible:ring-border-focus w-full"\s+data-kui-tws-trigger/);
    const id = (h: string) => /id="(tws-[a-z0-9]+)-trigger"/.exec(h)![1];
    expect(id(await render('TimeWindowSelect.ejs', {}))).not.toBe(id(await render('TimeWindowSelect.ejs', {})));
  });
});

describe('TimeWindowSelect draft (the client state)', () => {
  it('edits are a draft until Update; opening again starts from the applied value', () => {
    const d = draft({ mode: 'relative', last: '24h' });
    d.selectPreset('7d');
    expect(d.state.value).toEqual({ mode: 'relative', last: '24h' });
    expect(d.view().activePreset).toBe('7d');
    d.begin(); // Cancel / Escape close; the next open restarts
    expect(d.view().activePreset).toBe('24h');
    d.selectPreset('7d');
    expect(d.apply()).toEqual({ mode: 'relative', last: '7d' });
    expect(d.state.value).toEqual({ mode: 'relative', last: '7d' });
  });

  it('Realtime: any last N, and the current period with "so far"', () => {
    const d = draft({ mode: 'relative', last: '24h' });
    d.setRealtimeDuration('', 'h');
    expect(d.view().canApply).toBe(false); // "Last" needs a valid amount (kui-react ac977b0)
    d.setRealtimeDuration('45', 'h');
    d.setRealtimeDuration('45', 'm');
    expect(d.apply()).toEqual({ mode: 'relative', last: '45m' });
    d.begin();
    expect(d.view()).toMatchObject({ amount: '45', unit: 'm' });
    expect(PRESETS).not.toContain(d.view().activePreset); // no chip lights up
    d.selectCurrent();
    expect(d.view()).toMatchObject({ rtKind: 'current', currentPeriod: 'current.hour' });
    d.setCurrentPeriod('current.month');
    d.setSoFar(true);
    expect(d.apply()).toEqual({ mode: 'calendar', period: 'current.month', soFar: true });
    d.begin();
    d.setCurrentPeriod('current.year'); // so far is kept
    expect(d.state.draft).toEqual({ mode: 'calendar', period: 'current.year', soFar: true });
  });

  it('History: last N is anchored when applied; a past period; settings travel with the window', () => {
    let t = NOW;
    const d = L.createTimeWindowDraft({ value: { mode: 'relative', last: '24h', aggregation: 'sum' }, presets: PRESETS, calendarPeriods: CAL, now: () => t });
    d.begin();
    d.switchTab('history');
    expect(d.view()).toMatchObject({ tab: 'history', hKind: 'range', showRange: true });
    expect(d.state.draft).toEqual({ mode: 'absolute', from: '2026-10-16T10:07:00.000Z', to: '2026-10-17T10:07:00.000Z', aggregation: 'sum' });
    d.selectHistoryLast();
    d.setHistoryDuration('2', 'd');
    expect(d.view().bucketCount).toBeNull();
    t = NOW + 60_000; // the clock is read at Update, not when the tab was opened
    expect(d.apply()).toEqual({ mode: 'absolute', from: new Date(t - 2 * 86_400_000).toISOString(), to: new Date(t).toISOString(), aggregation: 'sum' });
    d.begin();
    expect(d.view().tab).toBe('history');
    d.selectPast();
    expect(d.view()).toMatchObject({ hKind: 'period', pastPeriod: 'previous.hour' });
    d.setPastPeriod('previous.month');
    expect(d.apply()).toEqual({ mode: 'calendar', period: 'previous.month', aggregation: 'sum' });
  });

  it("History: a fixed range is typed in the window's zone; an inverted range cannot be applied", () => {
    const d = draft({ mode: 'absolute', from: '2026-10-16T00:00:00.000Z', to: '2026-10-17T00:00:00.000Z', timezone: 'Europe/Istanbul' });
    expect(d.view()).toMatchObject({ tab: 'history', from: '2026-10-16T03:00', to: '2026-10-17T03:00', timezone: 'Europe/Istanbul' });
    d.setFrom('2026-10-16T09:00');
    expect(d.apply()).toEqual({ mode: 'absolute', from: '2026-10-16T06:00:00.000Z', to: '2026-10-17T00:00:00.000Z', timezone: 'Europe/Istanbul' });
    d.begin();
    d.setFrom('2026-10-18T09:00');
    expect(d.view().canApply).toBe(false);
    expect(d.apply()).toBeNull();
    d.setFrom(''); // a cleared input changes nothing
    expect(d.state.draft.from).toBe('2026-10-18T06:00:00.000Z');
  });

  it('says how many buckets an interval makes; the zone, interval and aggregation are draft too', () => {
    const d = draft({ mode: 'relative', last: '24h', interval: '5m' });
    expect(d.view().bucketCount).toBe(288);
    d.setInterval('1m');
    expect(d.view().bucketCount).toBe(1440);
    d.setInterval('auto');
    expect(d.view().bucketCount).toBeNull();
    d.setTimezone('Asia/Tokyo');
    d.setAggregation('max');
    expect(d.state.draft).toEqual({ mode: 'relative', last: '24h', interval: 'auto', timezone: 'Asia/Tokyo', aggregation: 'max' });
    d.setTimezone('');
    expect(d.state.draft).not.toHaveProperty('timezone');
    d.selectPreset('1h'); // a new window keeps the settings
    expect(d.state.draft).toEqual({ mode: 'relative', last: '1h', interval: 'auto', aggregation: 'max' });
  });

  it('arrow keys move between the tabs; Realtime again falls back to the last 24h', () => {
    const d = draft({ mode: 'relative', last: '1h' });
    d.otherTab('realtime');
    expect(d.view().tab).toBe('history');
    d.otherTab('history');
    expect(d.view().tab).toBe('realtime');
    expect(d.state.draft).toEqual({ mode: 'relative', last: '24h' });
  });

  it('with no 24h preset the fallback is the first preset', () => {
    const d = L.createTimeWindowDraft({ value: null, presets: ['1h', '7d'], calendarPeriods: [] });
    d.begin();
    expect(d.state.draft).toEqual({ mode: 'relative', last: '1h' });
  });
});

describe('TimeWindowSelect: what a board lets viewers change', () => {
  it('with one kind of window there is no tab list, only that kind', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h' }, tabs: ['realtime'] });
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('role="tab"');
    expect(html).toMatch(/<div id="tws-panel-realtime" class="space-y-3" data-kui-tws-panel="realtime">/);
    expect(html).not.toContain('role="tabpanel"');
    expect(html).toContain('data-kui-tws-radio="rt-current"');
    expect(html).not.toContain('data-kui-tws-panel="history"');
    expect(html).not.toContain('data-kui-tws-radio="h-range"');
    expect(html).toContain('&#34;tabs&#34;:[&#34;realtime&#34;]');
  });

  it('a window of a kind the board does not offer opens on the kind it does', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h', aggregation: 'max' }, tabs: ['history'] });
    expect(html).not.toContain('role="tablist"');
    expect(html).toMatch(/<div id="tws-panel-history" class="space-y-3" data-kui-tws-panel="history">/);
    expect(html).not.toContain('data-kui-tws-panel="realtime"');
    expect(html).toMatch(/data-kui-tws-radio="h-range" checked>/);
    expect(html).toMatch(/data-kui-tws-range>/); // the range inputs show
    expect(html).toContain('<span class="truncate" data-kui-tws-summary>Realtime · Last 24h · max</span>'); // the applied value is untouched

    const d = draft({ mode: 'relative', last: '24h', aggregation: 'max' }, { tabs: ['history'] });
    expect(d.view()).toMatchObject({ tab: 'history', hKind: 'range', showRange: true });
    // Exactly an absolute window: the relative value's `last` must not ride along (kui-react ea125f6).
    expect(d.apply()).toEqual({ mode: 'absolute', aggregation: 'max', from: '2026-10-16T10:07:00.000Z', to: new Date(NOW - (NOW % 60_000)).toISOString() });
  });

  it('a History window on a Realtime-only board starts from the fallback preset', async () => {
    const d = draft({ mode: 'calendar', period: 'previous.month' }, { tabs: ['realtime'] });
    expect(d.view()).toMatchObject({ tab: 'realtime', rtKind: 'last', activePreset: '24h' });
    expect(d.state.draft).toEqual({ mode: 'relative', last: '24h' });
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'calendar', period: 'previous.month' }, tabs: ['realtime'] });
    expect(html).toMatch(/role="radio" aria-checked="true" class="[^"]*" data-kui-tws-preset="24h"/);
  });

  it('both kinds by default and when tabs is empty', async () => {
    for (const tabs of [undefined, []]) {
      const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: null, tabs });
      expect(html).toContain('role="tablist"');
      expect(html).toMatch(/id="tws-panel-history" role="tabpanel" aria-labelledby="tws-tab-history"/);
      expect(draft(null, { tabs }).state.tab).toBe('realtime');
    }
  });

  it('hidden controls and a narrowed aggregation list', async () => {
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h' }, showInterval: false, showTimezone: false, aggregations: ['avg', 'max'] });
    expect(html).not.toContain('aria-label="Interval"');
    expect(html).not.toContain('aria-label="Time zone"');
    expect([...html.matchAll(/>(Aggregate: [^<]+)</g)].map((x) => x[1])).toEqual(['Aggregate: avg', 'Aggregate: max']);
  });
});

describe('TimeWindowSelect: review 2026-10-17 (kui-react ac977b0)', () => {
  it('back to Realtime from History resets to the "Last" choice, and what is shown is what Update stores', () => {
    const d = draft({ mode: 'calendar', period: 'current.day' });
    expect(d.view().rtKind).toBe('current');
    d.switchTab('history');
    d.switchTab('realtime');
    expect(d.view()).toMatchObject({ rtKind: 'last', activePreset: '24h', amount: '24', unit: 'h' });
    expect(d.apply()).toEqual({ mode: 'relative', last: '24h' });
  });

  it('a board without avg shows and applies an aggregation it offers', async () => {
    const d = draft({ mode: 'relative', last: '24h' }, { aggregations: ['max', 'sum'] });
    expect(d.view().aggregation).toBe('max');
    expect(d.apply()).toEqual({ mode: 'relative', last: '24h', aggregation: 'max' });
    // the window's own when offered; an unoffered one falls back to avg when avg is offered
    expect(draft({ mode: 'relative', last: '24h', aggregation: 'sum' }, { aggregations: ['max', 'sum'] }).apply()).toEqual({ mode: 'relative', last: '24h', aggregation: 'sum' });
    expect(draft({ mode: 'relative', last: '24h', aggregation: 'min' }, { aggregations: ['avg', 'max'] }).apply()).toEqual({ mode: 'relative', last: '24h' });
    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h' }, aggregations: ['max', 'sum'] });
    expect(html).toContain('<option value="max" selected>Aggregate: max</option>');
    expect(html).toContain('&#34;aggregations&#34;:[&#34;max&#34;,&#34;sum&#34;]');
  });

  it('a window longer than the consumer accepts cannot be applied, and says why', async () => {
    const d = draft({ mode: 'relative', last: '24h' });
    expect(d.view()).toMatchObject({ tooLong: false, canApply: true });
    d.setRealtimeDuration('400', 'h');
    d.setRealtimeDuration('400', 'd');
    expect(d.view()).toMatchObject({ tooLong: true, maxSpanDays: 366, canApply: false });
    expect(d.apply()).toBeNull();
    d.switchTab('history');
    d.selectHistoryLast();
    expect(d.view()).toMatchObject({ tooLong: true, canApply: false });
    d.selectRange(); // a fixed range over the cap
    d.setFrom('2025-01-01T00:00');
    expect(d.view()).toMatchObject({ tooLong: true, canApply: false });
    // maxSpanMs moves the cap
    const wide = draft({ mode: 'relative', last: '400d' }, { maxSpanMs: 500 * 86_400_000 });
    expect(wide.view()).toMatchObject({ tooLong: false, canApply: true });

    const html = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '400d' } });
    expect(html).toContain('<p class="text-xs text-error" role="alert" data-kui-tws-too-long>A window can be at most 366 days long</p>');
    expect(html).toMatch(/data-kui-tws-update disabled>Update<\/button>/);
    expect(html).toContain('&#34;maxSpanMs&#34;:31622400000');
    expect(html).toContain('&#34;tooLong&#34;:&#34;A window can be at most {days} days long&#34;');
    const ok = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'relative', last: '24h' } });
    expect(ok).toContain('<p class="text-xs text-error" role="alert" data-kui-tws-too-long hidden></p>');
    expect(ok).toMatch(/data-kui-tws-update>Update<\/button>/);
    const range = await render('TimeWindowSelect.ejs', { idPrefix: 'tws', value: { mode: 'absolute', from: '2025-01-01T00:00:00.000Z', to: '2026-10-17T00:00:00.000Z' }, maxSpanMs: 30 * 86_400_000 });
    expect(range).toContain('role="alert" data-kui-tws-too-long>A window can be at most 30 days long</p>');
    expect(range).toMatch(/data-kui-tws-update disabled>Update<\/button>/);
  });

  it('an invalid realtime amount disables Update instead of applying the old window', () => {
    const d = draft({ mode: 'relative', last: '24h' });
    d.setRealtimeDuration('0', 'h');
    expect(d.view().canApply).toBe(false);
    expect(d.apply()).toBeNull();
  });
});

describe('TimeWindowSelect helpers', () => {
  it('zoned datetime-local values round-trip, across a DST change', () => {
    expect(L.toZonedInput('2026-10-16T00:00:00.000Z', 'Europe/Istanbul')).toBe('2026-10-16T03:00');
    expect(L.fromZonedInput('2026-10-16T03:00', 'Europe/Istanbul')).toBe('2026-10-16T00:00:00.000Z');
    expect(L.fromZonedInput('2026-11-01T12:00', 'America/New_York')).toBe('2026-11-01T17:00:00.000Z');
    expect(L.fromZonedInput('2026-10-31T12:00', 'America/New_York')).toBe('2026-10-31T16:00:00.000Z');
    // A time in a DST gap moves forward in every zone (kui-react ac977b0).
    expect(L.fromZonedInput('2026-03-08T02:30', 'America/New_York')).toBe('2026-03-08T07:30:00.000Z');
    expect(L.fromZonedInput('2026-03-29T02:30', 'Europe/Berlin')).toBe('2026-03-29T01:30:00.000Z');
  });
  it('spans and the summary', () => {
    expect(L.windowSpanMs({ mode: 'relative', last: '3d' })).toBe(3 * 86_400_000);
    expect(L.windowSpanMs({ mode: 'calendar', period: 'previous.day' })).toBe(86_400_000);
    expect(L.windowSpanMs({ mode: 'calendar', period: 'thisDayLastWeek' })).toBe(86_400_000);
    expect(L.windowSpanMs({ mode: 'absolute', from: '2026-10-17T00:00:00Z', to: '2026-10-16T00:00:00Z' })).toBeNull();
    expect(L.summarize({ mode: 'calendar', period: 'current.day', soFar: true }, M)).toBe('Realtime · Today (so far)');
    expect(L.summarize({ mode: 'calendar', period: 'previous.month' }, M)).toBe('History · Previous month');
    expect(L.summarize(null, M)).toBe('Time window');
  });
  it('the server-side twin (_logic.ejs) agrees with the client file', async () => {
    const windows = [
      null,
      { mode: 'relative', last: '24h', aggregation: 'max', interval: '1h', timezone: 'Asia/Tokyo' },
      { mode: 'calendar', period: 'current.day', soFar: true },
      { mode: 'calendar', period: 'previous.quarter', interval: 'auto' },
      { mode: 'absolute', from: '2026-03-29T00:30:00.000Z', to: '2026-03-29T02:30:00.000Z', timezone: 'Europe/Berlin' },
    ];
    const out = await ejs.render(
      `<% var L = {}; include('${path.join(UI, 'TimeWindowSelect/_logic.ejs')}', { L: L }); var W = ${JSON.stringify(windows)}; var M = ${JSON.stringify(M)}; %>` +
      `<%- JSON.stringify({ s: W.map(function (w) { return L.summarize(w, M); }), t: W.map(L.tabOf), span: W.slice(1).map(L.windowSpanMs), z: L.toZonedInput('2026-11-01T06:30:00.000Z', 'America/New_York'), i: ['5m', '2h', 'auto'].map(L.intervalMs) }) %>`,
      {}, { filename: path.join(UI, 'TimeWindowSelect/x.ejs') },
    );
    expect(JSON.parse(out)).toEqual({
      s: windows.map((w) => L.summarize(w, M)),
      t: windows.map(L.tabOf),
      span: windows.slice(1).map(L.windowSpanMs),
      z: L.toZonedInput('2026-11-01T06:30:00.000Z', 'America/New_York'),
      i: ['5m', '2h', 'auto'].map(L.intervalMs),
    });
  });
});

describe('Popover: optional controlled open state', () => {
  it('uncontrolled by default: closed, no controlled marker', async () => {
    const html = await render('Popover.ejs', { id: 'p', trigger: '<button type="button">Open</button>', children: '<p>Hi</p>' });
    expect(html).toContain('<div id="p" class="relative inline-block">');
    expect(html).toMatch(/tabindex="-1"\s+hidden\s+data-state="closed"/);
  });
  it('open + onOpenChange: rendered in that state, marked controlled, with the handler name', async () => {
    const html = await render('Popover.ejs', { id: 'p', open: true, onOpenChange: 'onP', trigger: '<button type="button">Open</button>', children: '<p>Hi</p>' });
    expect(html).toContain('<div id="p" class="relative inline-block" data-popover-controlled data-on-open-change="onP">');
    expect(html).toMatch(/tabindex="-1"\s+data-state="open"/);
    expect(html).toContain("root.dispatchEvent(new CustomEvent('kui:popover-openchange'");
    const closed = await render('Popover.ejs', { id: 'p', open: false, trigger: '<button type="button">Open</button>' });
    expect(closed).toMatch(/data-popover-controlled>/);
    expect(closed).toMatch(/tabindex="-1"\s+hidden\s+data-state="closed"/);
  });
});
