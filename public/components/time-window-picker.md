# TimeWindowPicker

- **id:** `time-window-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/TimeWindowPicker.ejs`
- **status:** stable
- **since:** 2026-10

Relative presets ("1h", "7d"), an absolute UTC range and the interval / aggregation that go with a window. The value is a structural `TimeWindowValue` (ISO strings, UTC); every change dispatches a `kui:timewindow-change` DOM event (detail = the next value) and calls the global function named by `onChange`. Every label is overridable through `messages`. Inline dashboard / telemetry sibling of DateRangePicker.

## Accessibility

- WCAG: AA
- ARIA patterns: radiogroup, group

Presets form a radiogroup; the date inputs and the selects carry accessible names from `messages`.

## Design tokens consumed

- `--primary`
- `--border`
- `--surface-base`
- `--surface-sunken`
- `--text-secondary`
- `--border-focus`

## Variants

### Default

```ejs
<%- include('modules/ui/TimeWindowPicker', { value: { mode: 'relative', last: '24h' }, onChange: 'onWindowChange' }) %>
<script>
  document.addEventListener('kui:timewindow-change', (e) => console.log(e.detail));
</script>
```

### Presets only

```ejs
<%- include('modules/ui/TimeWindowPicker', {
  value: { mode: 'relative', last: '24h' },
  presets: ['1h', '24h', '7d'],
  allowAbsolute: false, showInterval: false, showAggregation: false,
}) %>
```

## Full EJS source

```ejs
<%
  // TimeWindowPicker — relative presets ("1h", "7d"), an absolute UTC range, and the
  // interval / aggregation that go with a window. The inline dashboard / telemetry
  // sibling of the day-granularity DateRangePicker (no presets, no times there).
  // Mirror of kui-react modules/ui/TimeWindowPicker.tsx.
  //
  // The value is a TimeWindowValue (ISO strings, UTC):
  //   { mode: 'relative', last: '1h', interval?, aggregation?, timezone? }
  //   { mode: 'absolute', from: ISO, to: ISO, interval?, aggregation?, timezone? }
  //
  // Locals:
  //   value         — initial TimeWindowValue, or null (no preset active)
  //   presets       — default ['15m','1h','6h','24h','7d','30d','90d','365d']
  //   intervals     — default ['auto','1m','5m','1h','1d']
  //   aggregations  — default ['avg','min','max','sum','count','none']
  //   allowAbsolute (true), showInterval (true), showAggregation (true)
  //   idPrefix      — prefix of the From / To input ids (auto-generated when omitted;
  //                   kui-react defaults to 'tw', which is not unique per page)
  //   onChange      — NAME of a global function called with the next TimeWindowValue
  //   messages      — partial of DEFAULT_TIME_WINDOW_MESSAGES below; `{value}` is replaced
  //   className
  //
  // Instead of onChange({...}) the component dispatches the DOM event
  // 'kui:timewindow-change' on its root (bubbles, detail: the next value).
  // Runtime: root.__timeWindow.getValue() / .setValue(value)
  var DEFAULT_MESSAGES = {
    label: 'Time window',
    presets: 'Quick ranges',
    custom: 'Custom',
    from: 'From (UTC)',
    to: 'To (UTC)',
    interval: 'Interval',
    intervalAuto: 'Interval: auto',
    intervalValue: 'Interval: {value}',
    aggregation: 'Aggregation',
    aggregationValue: 'Aggregate: {value}',
  };
  var _m = Object.assign({}, DEFAULT_MESSAGES, locals.messages || {});
  var _value = locals.value || null;
  var _presets = Array.isArray(locals.presets) ? locals.presets : ['15m', '1h', '6h', '24h', '7d', '30d', '90d', '365d'];
  var _intervals = Array.isArray(locals.intervals) ? locals.intervals : ['auto', '1m', '5m', '1h', '1d'];
  var _aggregations = Array.isArray(locals.aggregations) ? locals.aggregations : ['avg', 'min', 'max', 'sum', 'count', 'none'];
  var _allowAbsolute = locals.allowAbsolute === false ? false : true;
  var _showInterval = locals.showInterval === false ? false : true;
  var _showAggregation = locals.showAggregation === false ? false : true;
  var _prefix = locals.idPrefix || ('tw-' + Math.random().toString(36).substr(2, 6));
  var _absolute = !!_value && _value.mode === 'absolute';
  var _onChange = typeof locals.onChange === 'string' ? locals.onChange : '';

  var FIELD = 'h-8 rounded-md border border-border bg-surface-base px-2 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  var BTN = 'h-8 px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus';
  var ACTIVE = 'bg-primary text-primary-fg';
  var INACTIVE = 'bg-surface-base text-text-secondary hover:bg-surface-sunken';
  function toInput(iso) { return String(iso).slice(0, 16); }
  var _curInterval = (_value && _value.interval) || 'auto';
  var _curAgg = (_value && _value.aggregation) || 'avg';
%>
<div
  data-kui-timewindow
  data-kui-timewindow-config="<%= JSON.stringify({ value: _value, presets: _presets, onChange: _onChange, defaultLast: _presets.indexOf('24h') !== -1 ? '24h' : _presets[0] }) %>"
  class="flex flex-wrap items-center gap-2<%= locals.className ? ' ' + locals.className : '' %>"
  role="group"
  aria-label="<%= _m.label %>"
>
  <div class="inline-flex overflow-hidden rounded-md border border-border" role="radiogroup" aria-label="<%= _m.presets %>">
    <% _presets.forEach(function (p) {
      var active = !!_value && _value.mode === 'relative' && _value.last === p && !_absolute;
    %>
    <button type="button" role="radio" aria-checked="<%= active ? 'true' : 'false' %>" data-kui-timewindow-preset="<%= p %>"
      class="<%= BTN %> <%= active ? ACTIVE : INACTIVE %>"><%= p %></button>
    <% }); %>
    <% if (_allowAbsolute) { %>
    <button type="button" role="radio" aria-checked="<%= _absolute ? 'true' : 'false' %>" data-kui-timewindow-custom
      class="<%= BTN %> <%= _absolute ? ACTIVE : INACTIVE %>"><%= _m.custom %></button>
    <% } %>
  </div>

  <% if (_allowAbsolute) { %>
  <div class="flex items-center gap-1.5" data-kui-timewindow-range<%= _absolute ? '' : ' hidden' %>>
    <input id="<%= _prefix %>-from" type="datetime-local" aria-label="<%= _m.from %>" class="<%= FIELD %>" data-kui-timewindow-from
      <% if (_absolute) { %>value="<%= toInput(_value.from) %>" max="<%= toInput(_value.to) %>"<% } %>>
    <span aria-hidden="true" class="text-text-secondary">–</span>
    <input id="<%= _prefix %>-to" type="datetime-local" aria-label="<%= _m.to %>" class="<%= FIELD %>" data-kui-timewindow-to
      <% if (_absolute) { %>value="<%= toInput(_value.to) %>" min="<%= toInput(_value.from) %>"<% } %>>
  </div>
  <% } %>

  <% if (_showInterval) { %>
  <select aria-label="<%= _m.interval %>" class="<%= FIELD %>" data-kui-timewindow-interval>
    <% _intervals.forEach(function (i) { %>
    <option value="<%= i %>"<%= i === _curInterval ? ' selected' : '' %>><%= i === 'auto' ? _m.intervalAuto : _m.intervalValue.replace('{value}', i) %></option>
    <% }); %>
  </select>
  <% } %>
  <% if (_showAggregation) { %>
  <select aria-label="<%= _m.aggregation %>" class="<%= FIELD %>" data-kui-timewindow-aggregation>
    <% _aggregations.forEach(function (a) { %>
    <option value="<%= a %>"<%= a === _curAgg ? ' selected' : '' %>><%= _m.aggregationValue.replace('{value}', a) %></option>
    <% }); %>
  </select>
  <% } %>
</div>
<script>
(function () {
  var roots = document.querySelectorAll('[data-kui-timewindow]');
  var ACTIVE = <%- JSON.stringify(ACTIVE.split(' ')) %>;
  var INACTIVE = <%- JSON.stringify(INACTIVE.split(' ')) %>;

  function toInput(iso) { return String(iso).slice(0, 16); }
  function fromInput(v) { return new Date(v + ':00.000Z').toISOString(); }

  function mount(root) {
    if (root.__timeWindow) return;
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-kui-timewindow-config') || '{}'); } catch (e) { cfg = {}; }
    var value = cfg.value || null;
    var absolute = !!value && value.mode === 'absolute';
    var presets = root.querySelectorAll('[data-kui-timewindow-preset]');
    var custom = root.querySelector('[data-kui-timewindow-custom]');
    var range = root.querySelector('[data-kui-timewindow-range]');
    var from = root.querySelector('[data-kui-timewindow-from]');
    var to = root.querySelector('[data-kui-timewindow-to]');
    var intervalSel = root.querySelector('[data-kui-timewindow-interval]');
    var aggSel = root.querySelector('[data-kui-timewindow-aggregation]');

    function paintBtn(btn, on) {
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      (on ? INACTIVE : ACTIVE).forEach(function (c) { btn.classList.remove(c); });
      (on ? ACTIVE : INACTIVE).forEach(function (c) { btn.classList.add(c); });
    }
    function paint() {
      for (var i = 0; i < presets.length; i++) {
        var last = presets[i].getAttribute('data-kui-timewindow-preset');
        paintBtn(presets[i], !!value && value.mode === 'relative' && value.last === last && !absolute);
      }
      if (custom) paintBtn(custom, absolute);
      if (range) range.hidden = !(absolute && value && value.mode === 'absolute');
      if (absolute && value && value.mode === 'absolute' && from && to) {
        from.value = toInput(value.from); from.max = toInput(value.to);
        to.value = toInput(value.to); to.min = toInput(value.from);
      }
      if (intervalSel) intervalSel.value = (value && value.interval) || 'auto';
      if (aggSel) aggSel.value = (value && value.aggregation) || 'avg';
    }
    function emit(next) {
      value = next;
      paint();
      root.dispatchEvent(new CustomEvent('kui:timewindow-change', { bubbles: true, detail: next }));
      if (cfg.onChange && typeof window[cfg.onChange] === 'function') window[cfg.onChange](next);
    }
    function extras() {
      return value ? { interval: value.interval, aggregation: value.aggregation, timezone: value.timezone } : {};
    }
    function merge(base, patch) {
      var out = {};
      Object.keys(base).forEach(function (k) { if (base[k] !== undefined) out[k] = base[k]; });
      Object.keys(patch).forEach(function (k) { if (patch[k] !== undefined) out[k] = patch[k]; });
      return out;
    }

    for (var i = 0; i < presets.length; i++) {
      presets[i].addEventListener('click', function (e) {
        absolute = false;
        emit(merge({ mode: 'relative', last: e.currentTarget.getAttribute('data-kui-timewindow-preset') }, extras()));
      });
    }
    if (custom) custom.addEventListener('click', function () {
      absolute = true;
      if (!value || value.mode !== 'absolute') {
        var end = new Date(); end.setMinutes(0, 0, 0);
        emit(merge({ mode: 'absolute', from: new Date(end.getTime() - 24 * 3600000).toISOString(), to: end.toISOString() }, extras()));
      } else {
        paint();
      }
    });
    if (from) from.addEventListener('change', function () {
      if (from.value && value && value.mode === 'absolute') emit(merge(value, { from: fromInput(from.value) }));
    });
    if (to) to.addEventListener('change', function () {
      if (to.value && value && value.mode === 'absolute') emit(merge(value, { to: fromInput(to.value) }));
    });
    function setExtra(patch) {
      var base = value || { mode: 'relative', last: cfg.defaultLast };
      emit(merge(base, patch));
    }
    if (intervalSel) intervalSel.addEventListener('change', function () { setExtra({ interval: intervalSel.value }); });
    if (aggSel) aggSel.addEventListener('change', function () { setExtra({ aggregation: aggSel.value }); });

    root.__timeWindow = {
      getValue: function () { return value; },
      setValue: function (v) { value = v || null; absolute = !!value && value.mode === 'absolute'; paint(); },
    };
  }
  for (var r = 0; r < roots.length; r++) mount(roots[r]);
})();
</script>

```
