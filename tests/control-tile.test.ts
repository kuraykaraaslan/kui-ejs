// ControlTile family, Toggle / RangeSlider async states, TimeWindowPicker and MapCanvas
// (kui-react parity). The state machine is DOM-free and runs under fake timers; the markup
// is checked through ejs.renderFile. Browser behaviour was exercised separately with puppeteer.
import { describe, it, expect, beforeAll, afterEach, beforeEach, vi } from 'vitest';
import ejs from 'ejs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const UI = path.join(ROOT, 'modules/ui');
const require_ = createRequire(import.meta.url);

type Fn = (...a: any[]) => any;
let logic: Record<string, Fn>;
let createAsyncControl: Fn;
beforeAll(() => {
  logic = require_(path.join(UI, 'ControlTile/scripts/control-logic.js'));
  createAsyncControl = require_(path.join(UI, 'ControlTile/scripts/async-control.js')).createAsyncControl;
});

describe('control-logic', () => {
  it('asBoolean', () => {
    expect([true, false, 1, 0, 'on', 'OFF', ' yes ', 'No', 2, 'maybe', null, undefined].map((v) => logic.asBoolean(v)))
      .toEqual([true, false, true, false, true, false, true, false, null, null, null, null]);
  });
  it('asNumber: blank and non-finite are not numbers', () => {
    expect(['5', ' 2.5 ', '', '  ', 'x', Number.NaN, Infinity, 3, null].map((v) => logic.asNumber(v)))
      .toEqual([5, 2.5, null, null, null, null, null, 3, null]);
  });
  it('toRange: defaults, inverted bounds, bad step', () => {
    expect(logic.toRange({})).toEqual({ min: 0, max: 100, step: 1 });
    expect(logic.toRange({ min: 10, max: 5, step: -1 })).toEqual({ min: 10, max: 11, step: 1 });
    expect(logic.toRange({ min: '5', max: '30', step: '0.5' })).toEqual({ min: 5, max: 30, step: 0.5 });
  });
  it('validateSetpoint', () => {
    const r = logic.toRange({ min: 5, max: 30 });
    expect(logic.validateSetpoint('', r)).toEqual({ ok: false, reason: 'empty' });
    expect(logic.validateSetpoint('abc', r)).toEqual({ ok: false, reason: 'nan' });
    expect(logic.validateSetpoint('31', r)).toEqual({ ok: false, reason: 'range' });
    expect(logic.validateSetpoint('21.5', r)).toEqual({ ok: true, value: 21.5 });
  });
  it('snapToStep never sends 20.000000004', () => {
    const r = logic.toRange({ min: 0, max: 1, step: 0.1 });
    expect(logic.snapToStep(0.30000000000000004, r)).toBe(0.3);
    expect(logic.snapToStep(7, logic.toRange({ min: 5, max: 30, step: 5 }))).toBe(5);
    expect(logic.snapToStep(8, logic.toRange({ min: 5, max: 30, step: 5 }))).toBe(10);
    expect(logic.snapToStep(99, r)).toBe(1);
  });
  it('the server-side twin (_logic.ejs) agrees with the client file', async () => {
    const out = await ejs.render(
      `<% var L = {}; include('${path.join(UI, 'ControlTile/_logic.ejs')}', { L: L }); %>` +
      `<%- JSON.stringify({ b: ['on', 1, 'x', true].map(L.asBoolean), n: ['5', '', 'x', 2].map(L.asNumber), r: L.toRange({ min: 10, max: 5 }), f: L.formatValue(2.345, 1) }) %>`,
      {}, { filename: path.join(UI, 'ControlTile/x.ejs') },
    );
    expect(JSON.parse(out)).toEqual({
      b: ['on', 1, 'x', true].map(logic.asBoolean),
      n: ['5', '', 'x', 2].map(logic.asNumber),
      r: logic.toRange({ min: 10, max: 5 }),
      f: logic.formatValue(2.345, 1),
    });
  });
});

describe('createAsyncControl (kui-react useAsyncControl)', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  const flush = async () => { await vi.advanceTimersByTimeAsync(0); };

  it('pending shows the requested value, then confirmed, then idle', async () => {
    const seen: any[] = [];
    const ctl = createAsyncControl({ value: 1, commit: () => Promise.resolve(), onChange: (s: any) => seen.push(s) });
    ctl.set(5);
    expect(ctl.snapshot()).toMatchObject({ state: 'pending', displayValue: 5 });
    expect(seen.at(-1).state).toBe('pending');
    await flush();
    expect(ctl.snapshot().state).toBe('confirmed');
    await vi.advanceTimersByTimeAsync(2000);
    expect(ctl.snapshot().state).toBe('idle');
    // the optimistic value holds until the bound value changes underneath it
    expect(ctl.snapshot().displayValue).toBe(5);
    ctl.setValue(2);
    expect(ctl.snapshot().displayValue).toBe(2);
  });

  it('a rejected commit rolls the display back and exposes the message; retry repeats it', async () => {
    const commit = vi.fn().mockRejectedValueOnce(new Error('Device offline')).mockResolvedValue(undefined);
    const ctl = createAsyncControl({ value: 1, commit });
    ctl.set(5);
    await flush();
    expect(ctl.snapshot()).toMatchObject({ state: 'failed', error: 'Device offline', displayValue: 1 });
    ctl.retry();
    await flush();
    expect(commit).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenLastCalledWith(5);
    expect(ctl.snapshot().state).toBe('confirmed');
  });

  it('a non-Error rejection: strings keep their text, anything else has no message', async () => {
    const a = createAsyncControl({ value: 0, commit: () => Promise.reject('nope') });
    a.set(1); await flush();
    expect(a.snapshot().error).toBe('nope');
    const b = createAsyncControl({ value: 0, commit: () => Promise.reject(42) });
    b.set(1); await flush();
    expect(b.snapshot().error).toBeNull();
  });

  it('a synchronous throw in commit is a failure, not a crash', async () => {
    const ctl = createAsyncControl({ value: 0, commit: () => { throw new Error('boom'); } });
    ctl.set(1); await flush();
    expect(ctl.snapshot()).toMatchObject({ state: 'failed', error: 'boom' });
  });

  it('with `reported`, a resolved commit stays pending until it matches', async () => {
    const ctl = createAsyncControl({ value: false, reported: false, commit: () => Promise.resolve() });
    ctl.set(true);
    await flush();
    expect(ctl.snapshot().state).toBe('pending');
    ctl.setReported(true);
    expect(ctl.snapshot().state).toBe('confirmed');
  });

  it('a report that never matches becomes a mismatch after timeoutMs', async () => {
    const ctl = createAsyncControl({ value: false, reported: false, timeoutMs: 2500, commit: () => Promise.resolve() });
    ctl.set(true);
    await flush();
    await vi.advanceTimersByTimeAsync(2499);
    expect(ctl.snapshot().state).toBe('pending');
    await vi.advanceTimersByTimeAsync(1);
    expect(ctl.snapshot().state).toBe('mismatch');
    expect(ctl.snapshot().displayValue).toBe(true);
  });

  it('reported === null (reports, value unknown) waits; undefined means no report', async () => {
    const waiting = createAsyncControl({ value: 1, reported: null, commit: () => Promise.resolve() });
    waiting.set(2); await flush();
    expect(waiting.snapshot().state).toBe('pending');
    const silent = createAsyncControl({ value: 1, commit: () => Promise.resolve() });
    silent.set(2); await flush();
    expect(silent.snapshot().state).toBe('confirmed');
  });

  it('a superseded commit result is ignored', async () => {
    const resolvers: Array<() => void> = [];
    const ctl = createAsyncControl({ value: 0, commit: () => new Promise<void>((r) => resolvers.push(r)) });
    ctl.set(1);
    ctl.set(2);
    resolvers[0]();
    await flush();
    expect(ctl.snapshot()).toMatchObject({ state: 'pending', displayValue: 2 });
    resolvers[1]();
    await flush();
    expect(ctl.snapshot().state).toBe('confirmed');
  });

  it('confirmedMs: 0 keeps "confirmed"', async () => {
    const ctl = createAsyncControl({ value: 0, confirmedMs: 0, commit: () => Promise.resolve() });
    ctl.set(1); await flush();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(ctl.snapshot().state).toBe('confirmed');
  });

  it('confirm: set parks the value until accept(); dismiss() drops it', async () => {
    const commit = vi.fn().mockResolvedValue(undefined);
    const ctl = createAsyncControl({ value: 0, confirm: true, commit });
    ctl.set(9);
    expect(ctl.snapshot().awaiting).toEqual({ value: 9 });
    expect(commit).not.toHaveBeenCalled();
    ctl.dismiss();
    expect(ctl.snapshot().awaiting).toBeNull();
    ctl.set(9);
    ctl.accept();
    expect(commit).toHaveBeenCalledWith(9);
  });

  it('destroy stops late results and timers from emitting', async () => {
    const onChange = vi.fn();
    let done: () => void = () => {};
    const ctl = createAsyncControl({ value: 0, onChange, commit: () => new Promise<void>((r) => { done = r; }) });
    ctl.set(1);
    onChange.mockClear();
    ctl.destroy();
    done();
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });
});

// Markup only: the inlined runtime scripts mention the same data-* names, so they are cut out.
const stripScripts = (html: string) => html.replace(/<script>[\s\S]*?<\/script>/g, '');
const render = async (rel: string, locals: Record<string, unknown>) => stripScripts(await ejs.renderFile(path.join(UI, rel), locals));
const cfgOf = (html: string, attr = 'data-kui-control-config') =>
  JSON.parse(new RegExp(`${attr}="([^"]*)"`).exec(html)![1].replace(/&#34;/g, '"').replace(/&amp;/g, '&'));

describe('Control* markup', () => {
  it('ControlTile: title, slot, aria-live status line, read-only notice', async () => {
    const html = await render('ControlTile/ControlTile.ejs', { title: 'Heater', readOnly: true, body: '<p id="slot">x</p>' });
    expect(html).toContain('<h3 class="mb-2 text-sm font-semibold text-text-primary">Heater</h3>');
    expect(html).toContain('id="slot"');
    expect(html).toMatch(/aria-live="polite" data-kui-control-status/);
    expect(html).toContain('You do not have permission to use this control.');
    expect(html).toContain('rounded-lg border border-border bg-surface-raised p-3');
  });
  it('ControlSwitch: toggle named by the title, label follows the value, unknown hint', async () => {
    const on = await render('ControlTile/ControlSwitch.ejs', { id: 's1', title: 'Heater', value: 'on' });
    expect(on).toContain('data-kui-control="switch"');
    expect(on).toContain('>On</span>');
    expect(on).toMatch(/data-kui-control-hint hidden/);
    const unknown = await render('ControlTile/ControlSwitch.ejs', { id: 's2', title: 'Heater', value: 'what', onLabel: 'Open', offLabel: 'Closed', unknownLabel: 'No signal' });
    expect(unknown).toContain('>Closed</span>');
    expect(unknown).toMatch(/data-kui-control-hint>No signal</);
    expect(cfgOf(unknown).onLabel).toBe('Open');
  });
  it('ControlSwitch: readOnly/disabled disable the input', async () => {
    const html = await render('ControlTile/ControlSwitch.ejs', { id: 's3', title: 'x', value: true, readOnly: true });
    expect(html).toMatch(/<input[^>]*role="switch"[^>]*disabled/s);
    expect(html).toContain('You do not have permission');
  });
  it('ControlSlider: range value line, min/max labels, live (hidden) reported line', async () => {
    const html = await render('ControlTile/ControlSlider.ejs', { id: 'sl', title: 'Fan', value: 40, min: 0, max: 100, step: 5, unit: '%', decimals: 1 });
    expect(html).toContain('data-kui-control="slider"');
    expect(html).toMatch(/data-kui-control-value>40\.0 %</);
    expect(html).toMatch(/data-kui-control-reported hidden/);
    expect(html).toMatch(/type="range"[\s\S]*value="40"/);
    expect(cfgOf(html).step).toBe(5);
  });
  it('ControlSetpoint: input with accessible name, unit, Apply button, current value', async () => {
    const html = await render('ControlTile/ControlSetpoint.ejs', { id: 'sp', title: 'Target', value: 21, unit: '°C', decimals: 1, min: 5, max: 30 });
    expect(html).toMatch(/aria-label="Target"[^>]*aria-invalid="false"/);
    expect(html).toMatch(/inputmode="decimal"/);
    expect(html).toContain('Current: 21.0 °C');
    expect(html).toMatch(/<button data-kui-control-apply\s+type="submit"/);
    expect(html).toMatch(/Apply/);
  });
  it('ControlButton: no ask panel for none; confirm and typed add one', async () => {
    const none = await render('ControlTile/ControlButton.ejs', { id: 'b0', label: 'Reboot' });
    expect(none).not.toContain('data-kui-control-ask');
    const typed = await render('ControlTile/ControlButton.ejs', { id: 'b1', label: 'Reboot', confirm: 'typed', confirmText: 'reboot' });
    expect(typed).toMatch(/data-kui-control-ask hidden/);
    expect(typed).toContain('Type &quot;reboot&quot; to confirm');
    expect(typed).toMatch(/<button data-kui-control-go[\s\S]*?disabled/);
    const plain = await render('ControlTile/ControlButton.ejs', { id: 'b2', confirm: 'confirm' });
    expect(plain).not.toContain('data-kui-control-typed class');
    expect(plain).toContain('Are you sure?');
  });
  it('messages override every string; loadRuntime:false leaves the script out', async () => {
    const html = await render('ControlTile/ControlSwitch.ejs', { id: 'm', title: 't', value: true, messages: { pending: 'Wird gesendet', retry: 'Nochmal' }, loadRuntime: false });
    expect(cfgOf(html, 'data-kui-messages')).toMatchObject({ pending: 'Wird gesendet', retry: 'Nochmal', confirmed: 'Done' });
    expect(await ejs.renderFile(path.join(UI, 'ControlTile/ControlSwitch.ejs'), { id: 'm', value: true, loadRuntime: false })).not.toContain('createAsyncControl');
    expect(await ejs.renderFile(path.join(UI, 'ControlTile/ControlSwitch.ejs'), { id: 'm', value: true })).toContain('createAsyncControl');
  });
});

describe('Toggle async states', () => {
  it('pending: input disabled + aria-busy, spinner in the thumb, progress cursor', async () => {
    const html = await render('Toggle.ejs', { id: 't', label: 'x', pending: true });
    expect(html).toMatch(/<input[^>]*aria-busy="true"/s);
    expect(html).toMatch(/<input[^>]*\sdisabled/s);
    expect(html).toContain('data-toggle-spinner');
    expect(html).toContain('cursor-progress');
  });
  it('mismatch: warning ring + aria-invalid; describedBy is passed through', async () => {
    const html = await render('Toggle.ejs', { id: 't', label: 'x', mismatch: true, describedBy: 'hint' });
    expect(html).toContain('ring-2 ring-warning ring-offset-1 ring-offset-surface-base');
    expect(html).toMatch(/aria-invalid="true"/);
    expect(html).toMatch(/aria-describedby="hint"/);
  });
  it('idle: none of the async attributes', async () => {
    const html = await render('Toggle.ejs', { id: 't', label: 'x' });
    expect(html).not.toMatch(/<input[^>]*aria-busy/s);
    expect(html).not.toContain('aria-invalid="true"');
    expect(html).not.toContain('data-toggle-spinner aria');
  });
});

describe('RangeSlider commit / pending', () => {
  it('pending disables the single input and sets aria-busy', async () => {
    const html = await render('RangeSlider.ejs', { id: 'r', label: 'Fan', value: 3, pending: true });
    expect(html).toMatch(/data-rangeslider-handle="single"/);
    expect(html).toMatch(/<input[^>]*aria-busy="true"[^>]*data-rangeslider-handle="single"/s);
  });
  it('commit config: idle ms (default 400) and the handler name travel as data attributes', async () => {
    const html = await render('RangeSlider.ejs', { id: 'r', value: 3, commitIdleMs: 250, onCommit: 'writeFan' });
    expect(html).toContain('data-commit-idle-ms="250"');
    expect(html).toContain('data-on-commit="writeFan"');
    expect(await render('RangeSlider.ejs', { id: 'r2' })).toContain('data-commit-idle-ms="400"');
  });
});

describe('TimeWindowPicker', () => {
  it('presets are a radiogroup; the active preset is checked and primary', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: { mode: 'relative', last: '7d' } });
    expect(html).toContain('role="radiogroup"');
    expect(html).toMatch(/aria-checked="true" data-kui-timewindow-preset="7d"\s+class="[^"]*bg-primary text-primary-fg"/);
    expect(html.match(/aria-checked="true"/g)).toHaveLength(1);
    expect(html).toContain('Interval: auto');
    expect(html).toContain('Aggregate: avg');
    expect(html).toContain('focus-visible:ring-border-focus');
  });
  it('absolute mode: Custom is active, UTC inputs are filled and bounded', async () => {
    const html = await render('TimeWindowPicker.ejs', {
      idPrefix: 'tw', value: { mode: 'absolute', from: '2026-10-05T12:00:00.000Z', to: '2026-10-06T12:00:00.000Z', interval: '5m', aggregation: 'max' },
    });
    expect(html).toMatch(/data-kui-timewindow-custom\s+class="[^"]*bg-primary/);
    expect(html).toContain('id="tw-from"');
    expect(html).toMatch(/value="2026-10-05T12:00" max="2026-10-06T12:00"/);
    expect(html).toMatch(/value="2026-10-06T12:00" min="2026-10-05T12:00"/);
    expect(html).toMatch(/<option value="5m" selected>Interval: 5m/);
    expect(html).toMatch(/<option value="max" selected>Aggregate: max/);
    expect(html).not.toMatch(/data-kui-timewindow-range hidden/);
  });
  it('options hide the Custom button, interval and aggregation; messages are English by default and overridable', async () => {
    const html = await render('TimeWindowPicker.ejs', {
      value: null, presets: ['1h'], allowAbsolute: false, showInterval: false, showAggregation: false, messages: { label: 'Zeitfenster' },
    });
    expect(html).not.toContain('data-kui-timewindow-custom');
    expect(html).not.toContain('<select');
    expect(html).toContain('aria-label="Zeitfenster"');
    expect(html.match(/aria-checked="true"/g)).toBeNull();
  });
  it('unique ids per instance when no idPrefix is given', async () => {
    const id = (h: string) => /id="(tw-[a-z0-9]+)-from"/.exec(h)![1];
    expect(id(await render('TimeWindowPicker.ejs', {}))).not.toBe(id(await render('TimeWindowPicker.ejs', {})));
  });
});

describe('TimeWindowPicker: calendar periods, custom durations, time zone', () => {
  const checked = (h: string) => [...h.matchAll(/role="radio" aria-checked="true"[^>]*>([^<]*)</g)].map((x) => x[1]);
  it('offers no Last, Calendar or zone option unless asked (backward compatible)', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: null });
    expect(html).not.toContain('data-kui-timewindow-duration');
    expect(html).not.toContain('data-kui-timewindow-calendar');
    expect(html).not.toContain('aria-label="Time zone"');
    expect(html.match(/role="radio"/g)).toHaveLength(9);
  });
  it('a calendar value opens the Calendar segment with the period selected and "so far" checked', async () => {
    const html = await render('TimeWindowPicker.ejs', {
      idPrefix: 'tw', value: { mode: 'calendar', period: 'current.day', soFar: true }, calendarPeriods: ['current.day', 'previous.month'],
    });
    expect(checked(html)).toEqual(['Calendar']);
    expect(html).toMatch(/aria-checked="true" data-kui-timewindow-calendar\s+class="h-8 px-2\.5 text-xs font-medium [^"]*bg-primary text-primary-fg"/);
    expect(html).not.toMatch(/data-kui-timewindow-calendar-panel hidden/);
    expect(html).toContain('<select id="tw-period" aria-label="Calendar period"');
    expect(html).toMatch(/<option value="current.day" selected>Today<\/option>/);
    expect(html).toMatch(/<option value="previous.month">Previous month<\/option>/);
    expect(html).toContain('class="flex items-center gap-1.5 text-xs text-text-secondary"');
    expect(html).toMatch(/id="tw-so-far" type="checkbox" class="rounded border-border focus-visible:ring-2 focus-visible:ring-border-focus" data-kui-timewindow-so-far checked>/);
    expect(html).toMatch(/So far\s*<\/label>/);
  });
  it('"so far" is disabled and greyed for a past period; period names come from messages; an unlisted period is kept', async () => {
    const html = await render('TimeWindowPicker.ejs', {
      idPrefix: 'tw', value: { mode: 'calendar', period: 'previous.day' }, calendarPeriods: ['current.day'], messages: { periods: { 'previous.day': 'Gestern' } },
    });
    expect(html).toMatch(/data-kui-timewindow-so-far disabled>/);
    expect(html).toContain('text-xs text-text-disabled');
    expect(html).toMatch(/<option value="current.day">Today<\/option>/);
    expect(html).toMatch(/<option value="previous.day" selected>Gestern<\/option>/);
  });
  it('calendarPeriods: true offers all 18 periods in order, with English names', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: { mode: 'calendar', period: 'current.hour' }, calendarPeriods: true });
    const sel = /<select id="tw-period"[\s\S]*?<\/select>/.exec(html)![0];
    const opts = [...sel.matchAll(/<option value="([^"]+)"[^>]*>([^<]*)</g)].map((x) => `${x[1]}=${x[2]}`);
    expect(opts).toEqual([
      'current.hour=This hour', 'current.day=Today', 'current.week=This week', 'current.isoWeek=This week (Mon)',
      'current.month=This month', 'current.quarter=This quarter', 'current.halfYear=This half year', 'current.year=This year',
      'previous.hour=Previous hour', 'previous.day=Yesterday', 'previous.week=Previous week', 'previous.isoWeek=Previous week (Mon)',
      'previous.month=Previous month', 'previous.quarter=Previous quarter', 'previous.halfYear=Previous half year', 'previous.year=Previous year',
      'dayBeforeYesterday=Day before yesterday', 'thisDayLastWeek=This day last week',
    ]);
    expect(cfgOf(html, 'data-kui-timewindow-config').calendarPeriods).toHaveLength(18);
  });
  it('a relative value that is not a preset opens on Last, prefilled', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: { mode: 'relative', last: '3d' }, allowDuration: true });
    expect(checked(html)).toEqual(['Last']);
    expect(html).not.toMatch(/data-kui-timewindow-duration-panel hidden/);
    expect(html).toMatch(/<input id="tw-amount" type="number" inputmode="numeric" min="1" aria-label="Amount" class="h-8 [^"]* w-20" data-kui-timewindow-amount value="3">/);
    expect(html).toContain('<select id="tw-unit" aria-label="Unit"');
    expect(html).toMatch(/<option value="m">minutes<\/option>\s*<option value="h">hours<\/option>\s*<option value="d" selected>days<\/option>/);
  });
  it('a preset value keeps the preset checked and the Last panel hidden (unit defaults to hours)', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: { mode: 'relative', last: '1h' }, allowDuration: true, calendarPeriods: ['current.day'] });
    expect(checked(html)).toEqual(['1h']);
    expect(html).toMatch(/data-kui-timewindow-duration-panel hidden/);
    expect(html).toMatch(/data-kui-timewindow-calendar-panel hidden/);
    expect(html).toMatch(/<option value="h" selected>hours/);
  });
  it('the zone select: "Zone: default" first, UTC next, the current zone selected even when unknown', async () => {
    const html = await render('TimeWindowPicker.ejs', { idPrefix: 'tw', value: { mode: 'relative', last: '1h', timezone: 'Mars/Olympus' }, showTimezone: true });
    const sel = /<select aria-label="Time zone"[\s\S]*?<\/select>/.exec(html)![0];
    const values = [...sel.matchAll(/<option value="([^"]*)"/g)].map((x) => x[1]);
    expect(values.slice(0, 2)).toEqual(['', 'UTC']);
    expect(values).toContain('Asia/Tokyo');
    expect(values[values.length - 1]).toBe('Mars/Olympus');
    expect(sel).toMatch(/<option value="">Zone: default<\/option>/);
    expect(sel).toMatch(/<option value="Mars\/Olympus" selected>/);
    // Between the interval and the aggregation selects, as in kui-react.
    expect(html.indexOf('aria-label="Interval"')).toBeLessThan(html.indexOf('aria-label="Time zone"'));
    expect(html.indexOf('aria-label="Time zone"')).toBeLessThan(html.indexOf('aria-label="Aggregation"'));
  });
});

describe('MapCanvas', () => {
  const raw = (rel: string, locals: Record<string, unknown>) => ejs.renderFile(path.join(UI, rel), locals);
  it('is a card-less region that fills its parent, with the English loading label', async () => {
    const html = await raw('MapView/MapCanvas.ejs', { id: 'mc' });
    expect(html).toContain('role="region" aria-label="Map" class="h-full w-full"');
    expect(html).toContain('isolation: isolate');
    expect(html).toContain('Loading map…');
    expect(html).not.toContain('rounded-xl');
    expect(html).not.toMatch(/yükleniyor/);
  });
  it('carries tiles, fit padding (default 32), marker callback name and aria label', async () => {
    const html = await raw('MapView/MapCanvas.ejs', {
      id: 'mc', ariaLabel: 'Gateways', loadingLabel: 'Please wait', onMarkerClick: 'pick',
      tiles: { url: 'https://tiles.example/{z}/{x}/{y}.png', attribution: 'x' },
    });
    expect(html).toContain('aria-label="Gateways"');
    expect(html).toContain('Please wait');
    expect(html).toContain('"https://tiles.example/{z}/{x}/{y}.png"');
    expect(html).toContain('fitBoundsPadding: 32');
    expect(html).toContain('var onClickName = "pick"');
    expect(await raw('MapView/MapCanvas.ejs', { id: 'mc', fitBoundsPadding: false })).toContain('fitBoundsPadding: null');
  });
  it('MapView takes tiles + loadingLabel too', async () => {
    const html = await raw('MapView/MapView.ejs', { id: 'mv', loadingLabel: 'Hold on', tiles: { light: { url: 'a', attribution: '' }, dark: { url: 'b', attribution: '' } } });
    expect(html).toContain('Hold on');
    expect(html).toContain('"light":{"url":"a"');
  });
});
