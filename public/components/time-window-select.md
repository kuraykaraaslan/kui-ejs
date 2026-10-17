# TimeWindowSelect

- **id:** `time-window-select`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/TimeWindowSelect.ejs`
- **status:** stable
- **since:** 2026-10

A time window behind one button, the dashboard way: the button names the window and opens a panel with Realtime (last N sliding, or the current calendar period, optionally so far) and History (last N anchored when applied, a fixed range typed in the window's zone, or a past period). Aggregation, grouping interval with a bucket estimate, and time zone apply to both. Edits are a draft until Update. Same `TimeWindowValue` as TimeWindowPicker: Update dispatches the same `kui:timewindow-change` DOM event and calls the global function named by `onChange`. The panel is a controlled Popover.

## Accessibility

- WCAG: AA
- ARIA patterns: dialog, tablist, radiogroup, status

The trigger has aria-haspopup="dialog" and aria-expanded; Realtime / History are tabs (arrow keys); every input has an accessible name from `messages`; the bucket estimate is a status; Escape and Cancel discard the draft.

## Design tokens consumed

- `--primary`
- `--primary-fg`
- `--border`
- `--surface-base`
- `--surface-sunken`
- `--surface-raised`
- `--text-secondary`
- `--border-focus`
- `--warning`

## Variants

### Default

```ejs
<%- include('modules/ui/TimeWindowSelect', { value: { mode: 'relative', last: '24h' }, onChange: 'onWindowChange' }) %>
<script>
  document.addEventListener('kui:timewindow-change', (e) => console.log(e.detail));
</script>
```

### History range in a chosen zone, no period options

```ejs
<%- include('modules/ui/TimeWindowSelect', {
  value: { mode: 'absolute', from, to, timezone: 'Europe/Istanbul' },
  calendarPeriods: [],
}) %>
```

## Full EJS source

```ejs
<%
  // TimeWindowSelect — a time window behind one button, the way dashboards (ThingsBoard and the
  // like) do it: the button names the window ("Realtime · Last 24h · avg 5m"), and a Popover
  // panel opens with two tabs. Mirror of kui-react modules/ui/TimeWindowSelect.tsx.
  //
  // - Realtime: the last N minutes / hours / days (presets or any amount) sliding with now, or
  //   the current calendar period (today, this month...), optionally "so far".
  // - History: the last N anchored when it is applied, a fixed range typed in the window's
  //   zone, or a past calendar period (yesterday, previous month...).
  // - Both: aggregation, grouping interval (with how many buckets that makes, and a warning
  //   above `maxBuckets`) and time zone.
  //
  // Edits are a draft until Update; Cancel, Escape and an outside click drop them. The value is
  // the same structural TimeWindowValue as TimeWindowPicker (relative / absolute / calendar),
  // so a consumer can swap one for the other.
  //
  // Locals:
  //   value           — the applied TimeWindowValue, or null
  //   presets         — default ['5m','15m','30m','1h','6h','12h','24h','3d','7d','30d']
  //   intervals       — default ['auto','1m','5m','10m','15m','30m','1h','2h','6h','12h','1d','7d']
  //   aggregations    — default ['avg','min','max','sum','count','none']
  //   calendarPeriods — default all 18 (see TimeWindowPicker); current.* show under Realtime,
  //                     the others under History; [] hides both period options
  //   showInterval (true), showAggregation (true), showTimezone (true)
  //   tabs            — which kinds of window may be picked, default ['realtime', 'history']. With
  //                     one, the panel shows only that kind and no tab list; a value of a kind not
  //                     offered opens on the offered kind, starting from its default (Realtime: the
  //                     fallback preset; History: the last 24h up to now, seconds zeroed)
  //   maxBuckets (500) — above this many buckets the panel says the server will coarsen the
  //                     interval (match the server's cap)
  //   idPrefix        — prefix of every id (`<idPrefix>-trigger`, `-from`, ...); auto-generated
  //                     when omitted (kui-react defaults to 'tws', which is not unique per page)
  //   onChange        — NAME of a global function called with the applied TimeWindowValue
  //   messages        — partial of the TimeWindowPicker messages plus the keys below
  //   className       — on the trigger button
  //
  // Update also dispatches 'kui:timewindow-change' (bubbles, detail: the value) on the root
  // `#<idPrefix>` — the same event as TimeWindowPicker.
  // Runtime: document.getElementById(idPrefix).__timeWindow.getValue() / .setValue(value)
  var S = {};
  include('./TimeWindowPicker/_shared', { S: S });
  var L = {};
  include('./TimeWindowSelect/_logic', { L: L });

  var SELECT_MESSAGES = {
    realtime: 'Realtime',
    history: 'History',
    last: 'Last',
    currentPeriod: 'Current period',
    pastPeriod: 'Period',
    fixedRange: 'Fixed range',
    fromIn: 'From ({zone})',
    toIn: 'To ({zone})',
    browserZone: 'browser',
    update: 'Update',
    cancel: 'Cancel',
    buckets: '≈ {count} buckets',
    bucketsTooMany: '≈ {count} buckets: the server will use a coarser interval',
    open: 'Change time window',
  };
  var _own = locals.messages || {};
  var _m = Object.assign({}, S.DEFAULT_MESSAGES, SELECT_MESSAGES, _own, { periods: Object.assign({}, S.DEFAULT_MESSAGES.periods, _own.periods || {}) });

  var _value = locals.value || null;
  var _presets = Array.isArray(locals.presets) ? locals.presets : ['5m', '15m', '30m', '1h', '6h', '12h', '24h', '3d', '7d', '30d'];
  var _intervals = Array.isArray(locals.intervals) ? locals.intervals : ['auto', '1m', '5m', '10m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '7d'];
  var _aggregations = Array.isArray(locals.aggregations) ? locals.aggregations : ['avg', 'min', 'max', 'sum', 'count', 'none'];
  var _calendarPeriods = Array.isArray(locals.calendarPeriods) ? locals.calendarPeriods : S.DEFAULT_CALENDAR_PERIODS;
  var _showInterval = locals.showInterval !== false;
  var _showAggregation = locals.showAggregation !== false;
  var _showTimezone = locals.showTimezone !== false;
  var _tabs = Array.isArray(locals.tabs) && locals.tabs.length > 0 ? locals.tabs : ['realtime', 'history'];
  var _maxBuckets = typeof locals.maxBuckets === 'number' ? locals.maxBuckets : 500;
  var _prefix = locals.idPrefix || ('tws-' + Math.random().toString(36).substr(2, 6));
  var _onChange = typeof locals.onChange === 'string' ? locals.onChange : '';

  var _fallback = { mode: 'relative', last: _presets.indexOf('24h') !== -1 ? '24h' : _presets[0] };
  var _currentPeriods = _calendarPeriods.filter(L.isCurrent);
  var _pastPeriods = _calendarPeriods.filter(function (p) { return !L.isCurrent(p); });

  // The panel is rendered in the state opening it starts from (kui-react `begin()`).
  var _v = _value || _fallback;
  var _d = _v;
  // A window of a kind not offered starts from a default of the offered kind (the client redoes this on open).
  // Only the settings carry over: the old kind's own keys must not ride along (kui-react ea125f6).
  if (_tabs.indexOf(L.tabOf(_v)) === -1) {
    _d = Object.assign({}, _tabs[0] === 'realtime' ? _fallback : L.lastDay(Date.now()));
    ['interval', 'aggregation', 'timezone'].forEach(function (k) { if (_v[k] !== undefined) _d[k] = _v[k]; });
  }
  var _dur = _v.mode === 'relative' ? L.DURATION.exec(_v.last) : null;
  var _amount = _dur ? _dur[1] : '1';
  var _unit = _dur ? _dur[2] : 'h';
  var _tab = _tabs.indexOf(L.tabOf(_v)) !== -1 ? L.tabOf(_v) : _tabs[0];
  var _rtKind = _v.mode === 'calendar' && L.isCurrent(_v.period) ? 'current' : 'last';
  var _hKind = _v.mode === 'calendar' ? 'period' : 'range';
  var _span = L.windowSpanMs(_d);
  var _step = _d.interval && _d.interval !== 'auto' ? L.intervalMs(_d.interval) : null;
  var _summary = L.summarize(_value, _m);

  var C = {
    prefix: _prefix, m: _m, value: _value, d: _d,
    presets: _presets, intervals: _intervals, aggregations: _aggregations,
    currentPeriods: _currentPeriods, pastPeriods: _pastPeriods,
    showInterval: _showInterval, showAggregation: _showAggregation, showTimezone: _showTimezone,
    maxBuckets: _maxBuckets, tabs: _tabs, tab: _tab, rtKind: _rtKind, hKind: _hKind, amount: _amount, unit: _unit,
    bucketCount: _span && _step ? Math.ceil(_span / _step) : null,
    zones: _showTimezone ? S.zoneChoices(_d.timezone) : [],
    durationUnits: S.DURATION_UNITS,
    toZonedInput: L.toZonedInput, isCurrent: L.isCurrent,
    summary: _summary, className: locals.className || '',
    config: {
      id: _prefix, value: _value, presets: _presets, calendarPeriods: _calendarPeriods, tabs: _tabs, maxBuckets: _maxBuckets, onChange: _onChange,
      messages: {
        label: _m.label, realtime: _m.realtime, history: _m.history, last: _m.last, soFar: _m.soFar, periods: _m.periods,
        fromIn: _m.fromIn, toIn: _m.toIn, browserZone: _m.browserZone, buckets: _m.buckets, bucketsTooMany: _m.bucketsTooMany, open: _m.open,
      },
    },
  };
  var _triggerHtml = include('./TimeWindowSelect/_trigger', { C: C });
  var _panelHtml = include('./TimeWindowSelect/_panel', { C: C });
%>
<%- include('./Overlays/Popover/Popover', {
  id: _prefix,
  trigger: _triggerHtml,
  children: _panelHtml,
  label: _m.label,
  placement: 'bottom',
  className: 'w-[26rem] max-w-[calc(100vw-2rem)] p-3',
  open: false,
}) %>
<script>
<%- include('./TimeWindowSelect/scripts/time-window-logic.js') %>
<%- include('./TimeWindowSelect/scripts/time-window-select.js') %>
(function () { if (window.KuiTimeWindowSelect) window.KuiTimeWindowSelect.autoInit(); })();
</script>

```
