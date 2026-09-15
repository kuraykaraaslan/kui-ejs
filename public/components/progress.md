# Progress

- **id:** `progress`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Progress.ejs`
- **status:** stable
- **since:** 2026-09

Progress indicator in bar or circle shape. Server-rendered only — the bar fill width and circle stroke-dasharray/dashoffset are computed from `value` at render time. Variant maps to semantic tokens (primary/success/warning/error); `showLabel` renders the current percentage.

## Design tokens consumed

- `--error`
- `--primary`
- `--secondary`
- `--success`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Bar — variants

```ejs
<%- include('modules/ui/Progress', {
  value: 72,
  variant: 'primary',
  showLabel: true,
  label: 'Upload progress',
}) %>
```

### Circle shape

```ejs
<%- include('modules/ui/Progress', {
  value: 66,
  shape: 'circle',
  size: 'lg',
  showLabel: true,
  label: 'Profile completeness',
}) %>
```

## Full EJS source

```ejs
<%
  var _rawValue  = Number(locals.value);
  var _value     = isNaN(_rawValue) ? 0 : Math.min(100, Math.max(0, _rawValue));
  var _variant   = locals.variant   || 'primary';
  var _size      = locals.size      || 'md';
  var _shape     = locals.shape     || 'bar';
  var _showLabel = !!locals.showLabel;
  var _label     = locals.label     || 'Progress';
  var _className = locals.className || '';

  var barFillClass = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error:   'bg-error',
  }[_variant] || 'bg-primary';

  var circleStrokeClass = {
    primary: 'stroke-[var(--primary)]',
    success: 'stroke-[var(--success)]',
    warning: 'stroke-[var(--warning)]',
    error:   'stroke-[var(--error)]',
  }[_variant] || 'stroke-[var(--primary)]';

  var barHeightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[_size] || 'h-2.5';

  var circleDiameter = { sm: 40, md: 56, lg: 80 }[_size] || 56;
  var circleStrokeWidth = { sm: 4, md: 5, lg: 6 }[_size] || 5;
  var circleTextClass = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }[_size] || 'text-xs';

  var _radius = (circleDiameter - circleStrokeWidth) / 2;
  var _circumference = 2 * Math.PI * _radius;
  var _dashOffset = _circumference * (1 - _value / 100);
%>
<% if (_shape === 'circle') { %>
  <div
    role="progressbar"
    aria-valuenow="<%= _value %>"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="<%= _label %>"
    class="relative inline-flex items-center justify-center<%= _className ? ' ' + _className : '' %>"
    style="width: <%= circleDiameter %>px; height: <%= circleDiameter %>px;"
  >
    <svg width="<%= circleDiameter %>" height="<%= circleDiameter %>" viewBox="0 0 <%= circleDiameter %> <%= circleDiameter %>" class="-rotate-90">
      <circle
        cx="<%= circleDiameter / 2 %>"
        cy="<%= circleDiameter / 2 %>"
        r="<%= _radius %>"
        fill="none"
        stroke-width="<%= circleStrokeWidth %>"
        class="stroke-[var(--surface-sunken)]"
      ></circle>
      <circle
        cx="<%= circleDiameter / 2 %>"
        cy="<%= circleDiameter / 2 %>"
        r="<%= _radius %>"
        fill="none"
        stroke-width="<%= circleStrokeWidth %>"
        stroke-linecap="round"
        class="<%= circleStrokeClass %> transition-[stroke-dashoffset] duration-300"
        style="stroke-dasharray: <%= _circumference %>; stroke-dashoffset: <%= _dashOffset %>;"
      ></circle>
    </svg>
    <% if (_showLabel) { %>
      <span class="absolute inset-0 flex items-center justify-center font-medium tabular-nums text-text-primary <%= circleTextClass %>"><%= Math.round(_value) %>%</span>
    <% } %>
  </div>
<% } else { %>
  <div class="w-full<%= _className ? ' ' + _className : '' %>">
    <% if (_showLabel) { %>
      <div class="mb-1 flex items-center justify-between text-xs text-text-secondary">
        <span class="sr-only"><%= _label %></span>
        <span aria-hidden="true" class="ml-auto tabular-nums"><%= Math.round(_value) %>%</span>
      </div>
    <% } %>
    <div
      role="progressbar"
      aria-valuenow="<%= _value %>"
      aria-valuemin="0"
      aria-valuemax="100"
      <% if (!_showLabel) { %>aria-label="<%= _label %>"<% } %>
      class="w-full overflow-hidden rounded-full bg-surface-sunken <%= barHeightClass %>"
    >
      <div class="h-full rounded-full transition-[width] duration-300 <%= barFillClass %>" style="width: <%= _value %>%;"></div>
    </div>
  </div>
<% } %>

```
