# RangeSlider

- **id:** `range-slider`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RangeSlider.ejs`
- **status:** stable
- **since:** 2026-09

Numeric slider input, distinct from Slider (a carousel). Single mode renders one native `<input type="range">` with a server-computed token gradient fill. Range (dual-handle) mode overlays two native range inputs with a shared fill bar and a small inline script that clamps the handles against each other and keeps the fill in sync while dragging.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Single value

```ejs
<%- include('modules/ui/RangeSlider', {
  label: 'Volume',
  value: 65,
  min: 0,
  max: 100,
  name: 'volume',
}) %>
```

### Dual-handle range

```ejs
<%- include('modules/ui/RangeSlider', {
  label: 'Price range',
  range: true,
  value: [20, 80],
  min: 0,
  max: 100,
  nameMin: 'priceMin',
  nameMax: 'priceMax',
}) %>
```

## Full EJS source

```ejs
<%#
  modules/ui/RangeSlider.ejs — numeric slider input.

  Distinct from modules/ui/Slider.ejs, which is a carousel — this is a
  numeric <input type="range"> control. Named RangeSlider (not Slider) to
  avoid colliding with the carousel.
%>
<%
  var _id        = locals.id        || 'range-' + Math.random().toString(36).substr(2, 9);
  var _label     = locals.label     || '';
  var _hint      = locals.hint      || '';
  var _min       = (locals.min !== undefined) ? Number(locals.min) : 0;
  var _max       = (locals.max !== undefined) ? Number(locals.max) : 100;
  var _step      = (locals.step !== undefined) ? Number(locals.step) : 1;
  var _disabled  = !!locals.disabled;
  var _showValue = (locals.showValue === undefined) ? true : !!locals.showValue;
  var _isRange   = !!locals.range;
  var _className = locals.className || '';

  var _hintId = _hint ? (_id + '-hint') : '';

  var _rangeVal = Array.isArray(locals.value) ? locals.value : [_min, _max];
  var _lo = (_rangeVal[0] !== undefined) ? Number(_rangeVal[0]) : _min;
  var _hi = (_rangeVal[1] !== undefined) ? Number(_rangeVal[1]) : _max;
  var _singleVal = (!Array.isArray(locals.value) && locals.value !== undefined) ? Number(locals.value) : _min;

  var thumbClass = '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 '
    + '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer '
    + '[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-base '
    + '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary '
    + '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-base [&::-moz-range-thumb]:shadow '
    + 'disabled:[&::-webkit-slider-thumb]:bg-text-disabled disabled:[&::-moz-range-thumb]:bg-text-disabled';

  function pct(v) {
    if (_max === _min) return 0;
    return Math.min(100, Math.max(0, ((v - _min) / (_max - _min)) * 100));
  }
%>
<div id="<%= _id %>" data-rangeslider data-range="<%= _isRange ? 'true' : 'false' %>" data-min="<%= _min %>" data-max="<%= _max %>" class="w-full<%= _className ? ' ' + _className : '' %>">
  <% if (_label || _showValue) { %>
    <div class="mb-2 flex items-center justify-between gap-2">
      <% if (_label) { %><span class="text-sm font-medium text-text-primary"><%= _label %></span><% } %>
      <% if (_showValue) { %>
        <% if (_isRange) { %>
          <span class="text-xs tabular-nums text-text-secondary">
            <span data-rangeslider-value-min><%= _lo %></span> – <span data-rangeslider-value-max><%= _hi %></span>
          </span>
        <% } else { %>
          <span class="text-xs tabular-nums text-text-secondary" data-rangeslider-value-single><%= _singleVal %></span>
        <% } %>
      <% } %>
    </div>
  <% } %>

  <% if (_isRange) { %>
    <div class="relative h-4 flex items-center">
      <div class="absolute inset-x-0 h-1.5 rounded-full bg-surface-sunken"></div>
      <div
        data-rangeslider-fill
        class="absolute h-1.5 rounded-full bg-primary"
        style="left: <%= pct(_lo) %>%; right: <%= 100 - pct(_hi) %>%;"
      ></div>
      <input
        type="range"
        id="<%= _id %>-min"
        aria-label="<%= _label ? _label + ' minimum' : 'Minimum' %>"
        min="<%= _min %>"
        max="<%= _max %>"
        step="<%= _step %>"
        value="<%= _lo %>"
        <% if (locals.nameMin) { %>name="<%= locals.nameMin %>"<% } %>
        <% if (_disabled) { %>disabled<% } %>
        data-rangeslider-handle="min"
        class="pointer-events-none absolute inset-x-0 h-1.5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto disabled:cursor-not-allowed <%= thumbClass %>"
      >
      <input
        type="range"
        id="<%= _id %>-max"
        aria-label="<%= _label ? _label + ' maximum' : 'Maximum' %>"
        min="<%= _min %>"
        max="<%= _max %>"
        step="<%= _step %>"
        value="<%= _hi %>"
        <% if (locals.nameMax) { %>name="<%= locals.nameMax %>"<% } %>
        <% if (_disabled) { %>disabled<% } %>
        data-rangeslider-handle="max"
        class="pointer-events-none absolute inset-x-0 h-1.5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto disabled:cursor-not-allowed <%= thumbClass %>"
      >
    </div>
  <% } else { %>
    <input
      type="range"
      id="<%= _id %>-input"
      <% if (_label) { %>aria-label="<%= _label %>"<% } %>
      min="<%= _min %>"
      max="<%= _max %>"
      step="<%= _step %>"
      value="<%= _singleVal %>"
      <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
      <% if (_disabled) { %>disabled<% } %>
      <% if (_hintId) { %>aria-describedby="<%= _hintId %>"<% } %>
      data-rangeslider-handle="single"
      class="h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed <%= thumbClass %>"
      style="background-image: linear-gradient(to right, var(--primary) 0%, var(--primary) <%= pct(_singleVal) %>%, var(--surface-sunken) <%= pct(_singleVal) %>%, var(--surface-sunken) 100%);"
    >
  <% } %>

  <% if (_hintId) { %><p id="<%= _hintId %>" class="mt-1 text-xs text-text-secondary"><%= _hint %></p><% } %>
</div>

<script>
(function () {
  var rootId = '<%= _id %>';
  var root = document.getElementById(rootId);
  if (!root) return;

  var isRange = root.getAttribute('data-range') === 'true';
  var min = Number(root.getAttribute('data-min'));
  var max = Number(root.getAttribute('data-max'));

  function pct(v) {
    if (max === min) return 0;
    return Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));
  }

  if (!isRange) {
    var single = document.getElementById(rootId + '-input');
    var singleLabel = root.querySelector('[data-rangeslider-value-single]');
    if (!single) return;
    single.addEventListener('input', function () {
      var v = Number(single.value);
      single.style.backgroundImage = 'linear-gradient(to right, var(--primary) 0%, var(--primary) ' + pct(v) + '%, var(--surface-sunken) ' + pct(v) + '%, var(--surface-sunken) 100%)';
      if (singleLabel) singleLabel.textContent = String(v);
    });
    return;
  }

  var minHandle = document.getElementById(rootId + '-min');
  var maxHandle = document.getElementById(rootId + '-max');
  var fill      = root.querySelector('[data-rangeslider-fill]');
  var minLabel  = root.querySelector('[data-rangeslider-value-min]');
  var maxLabel  = root.querySelector('[data-rangeslider-value-max]');
  if (!minHandle || !maxHandle) return;

  function updateFill() {
    var lo = Number(minHandle.value);
    var hi = Number(maxHandle.value);
    if (fill) {
      fill.style.left  = pct(lo) + '%';
      fill.style.right = (100 - pct(hi)) + '%';
    }
    if (minLabel) minLabel.textContent = String(lo);
    if (maxLabel) maxLabel.textContent = String(hi);
  }

  minHandle.addEventListener('input', function () {
    if (Number(minHandle.value) > Number(maxHandle.value)) {
      minHandle.value = maxHandle.value;
    }
    updateFill();
  });

  maxHandle.addEventListener('input', function () {
    if (Number(maxHandle.value) < Number(minHandle.value)) {
      maxHandle.value = minHandle.value;
    }
    updateFill();
  });
})();
</script>

```
