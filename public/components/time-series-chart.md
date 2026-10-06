# TimeSeriesChart

- **id:** `time-series-chart`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Chart/scripts/time-series.js`
- **status:** beta
- **since:** 2026-10

The continuous time axis behind `LineChart` / `AreaChart` with `xAxis="time"`: timestamps (ISO strings or epoch ms) in `x`, uneven sampling, series with different instants on one axis, and drag-to-zoom (double-click or "Reset zoom" to leave). Zoom is local to the chart and never reaches the caller.

## Accessibility

- WCAG: AA
- ARIA patterns: img

role="img" with an aria-label; the tooltip and crosshair follow the nearest sample.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--border`
- `--text-secondary`
- `--surface-raised`

## Variants

### Line with drag-to-zoom

```ejs
<%- include('modules/ui/Chart/Chart', { type: 'line', xAxis: 'time', series: series, height: 240, yFormat: 'fmtCelsius' }) %>
<!-- yFormat is the NAME of a global function: window.fmtCelsius = (v) => v + '°C' -->
```

### Area, series sampled at different instants

```ejs
<%- include('modules/ui/Chart/Chart', { type: 'area', xAxis: 'time', series: [inlet, outlet], height: 240 }) %>
```

### Zoom disabled

```ejs
<%- include('modules/ui/Chart/Chart', { type: 'line', xAxis: 'time', series: series, zoom: false }) %>
```

## Full EJS source

```ejs
<%
  // ─── Chart (EJS) ───────────────────────────────────────────────────────────
  //
  // Pixel-identical sibling of kui-react's modules/ui/Chart (index.ts)
  //
  // Single entry point that dispatches to the per-type partials below.
  //
  // Locals (all types):
  //   id        — required base id; the actual <svg> gets `${id}-svg`.
  //   type      — 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'sparkline'
  //               | 'gauge' | 'heatmap'
  //               ('scatter' is M2 in EJS; renders as 'line' for M1).
  //   series    — Array<{ id, name, data: [{ x, y, color?, label? }] }>
  //   height    — px (default 240; 24 for sparkline)
  //   showLegend, showGrid, showTooltip — booleans (default true except tooltip)
  //   ariaLabel — optional override of role="img" aria-label
  //   className — extra classes on the outer wrapper
  //   loadHelpers — default true: the chart-helpers / renderer scripts are
  //               inlined (idempotent, they bail out when KuiChart already
  //               exists). Pass false when the host page already loads them
  //               once via <script src>.
  //
  // line / area — time axis + drag-zoom (kui-react TimeSeriesChart):
  //   xAxis     — 'band' (default) | 'time'.  `xScale` is an alias; xAxis wins.
  //               x is an ISO string or epoch ms. Series with different
  //               sampling instants share one axis. Drag selects a range,
  //               double-click or the reset button restores it. Zoom is local
  //               to the chart and never reported to the page. y rescales to
  //               the visible points. Area ignores it when `stacked`.
  //   zoom      — default true.   resetZoomLabel — default 'Reset zoom'.
  //   yFormat   — NAME of a global function (config travels as JSON), e.g.
  //               'fmtPercent' for window.fmtPercent = function (v) {...}.
  //   locale    — tick label locale (default: the browser's).
  //   smooth, strokeWidth, fillOpacity — as in kui-react.
  //
  // pie / donut: innerRadius (0..1).  area (band axis): fillOpacity (default 0.2).
  // sparkline: filled (area under the line, opacity 0.15).
  //
  // bar / area:
  //   stacked   — stack the series (negative values count as 0; stacked
  //               areas use straight segments).
  //
  // heatmap (kui-react HeatmapChart):
  //   cells — [{ x, y, value|null }] (a missing value is an empty cell),
  //   min, max, valueLabel ('Value'), color ('var(--primary)'),
  //   valueFormat — NAME of a global function.
  //   showLegend toggles the gradient legend; showTooltip the hover tooltip.
  //
  // gauge (kui-react GaugeChart) — rendered on the server, no script:
  //   value, min (0), max (100), bands [{ to, tone }], unit, label,
  //   format (a function, server side), needle, size 'sm'|'md'|'lg',
  //   stale, staleLabel ('stale').
  //
  // Not ported from kui-react's roadmap (phase 9 §9.1–§9.4 extras): 'linear'
  // scale, maxPoints down-sampling, Brush overview, calendar heatmap mode.
  //
  // TODO M2: scatter, brush, empty + skeleton states.
  // TODO M3: treemap / radar / funnel / sankey / candlestick / bubble.
  // TODO M4: brush + pan + synced tooltips + drilldown.
  // TODO M5: a11y data table + keyboard nav + PNG / SVG / CSV export.
  // TODO M6: annotations, forecast, streaming, threshold bands.

  var _id        = locals.id        || ('chart-' + Math.random().toString(36).substr(2, 6));
  var _type      = (locals.type     || 'line').toLowerCase();
  var _series    = Array.isArray(locals.series) ? locals.series : [];
  var _height    = typeof locals.height === 'number' ? locals.height : (_type === 'sparkline' ? 24 : 240);
  var _showLegend  = locals.showLegend  === false ? false : true;
  var _showGrid    = locals.showGrid    === false ? false : true;
  var _showTooltip = locals.showTooltip === false ? false : true;
  var _ariaLabel = locals.ariaLabel || (_type.charAt(0).toUpperCase() + _type.slice(1) + ' chart');
  var _className = locals.className || '';
  var _stacked   = !!locals.stacked;
  var _loadHelpers = locals.loadHelpers === false ? false : true;

  // Scatter in M1 EJS falls back to a line chart with markers — full
  // SVG scatter logic ships in M2.
  if (_type === 'scatter') _type = 'line';

  // `xAxis` wins over its `xScale` alias. Time applies to line + area only, and
  // never to a stacked area (same rule as kui-react).
  var _xAxis  = locals.xAxis || locals.xScale || 'band';
  var _isTime = _xAxis === 'time' && (_type === 'line' || (_type === 'area' && !_stacked));
  var _resetZoomLabel = locals.resetZoomLabel || 'Reset zoom';

  var _partial = '';
  var _clientKind = '';   // 'time' | 'heatmap' → rendered client side from data-kui-chart-config
  var _clientConfig = null;
  if (_type === 'gauge') _partial = 'partials/_gauge';
  else if (_type === 'heatmap') {
    _clientKind = 'heatmap';
    _clientConfig = {
      cells: Array.isArray(locals.cells) ? locals.cells : [], height: _height,
      min: locals.min, max: locals.max, valueFormat: locals.valueFormat,
      valueLabel: locals.valueLabel, showLegend: _showLegend, showTooltip: _showTooltip,
      ariaLabel: locals.ariaLabel, color: locals.color,
    };
  }
  else if (_isTime) {
    _clientKind = 'time';
    _clientConfig = {
      series: _series, variant: _type, height: _height, showGrid: _showGrid, showTooltip: _showTooltip,
      smooth: locals.smooth, strokeWidth: locals.strokeWidth, fillOpacity: locals.fillOpacity,
      zoom: locals.zoom, yFormat: locals.yFormat, locale: locals.locale, ariaLabel: locals.ariaLabel,
    };
  }
  else if (_type === 'line')      _partial = 'partials/_line';
  else if (_type === 'bar')  _partial = 'partials/_bar';
  else if (_type === 'area') _partial = 'partials/_area';
  else if (_type === 'pie')  _partial = 'partials/_pie';
  else if (_type === 'donut') _partial = 'partials/_donut';
  else if (_type === 'sparkline') _partial = 'partials/_sparkline';
%>
<% if (_type === 'gauge') { %>
<%- include('partials/_gauge', {
  value: locals.value, min: locals.min, max: locals.max, bands: locals.bands, unit: locals.unit,
  label: locals.label, format: locals.format, needle: locals.needle, size: locals.size,
  ariaLabel: locals.ariaLabel, stale: locals.stale, staleLabel: locals.staleLabel, className: _className,
}) %>
<% } else { %>
<% if (_loadHelpers) { %>
<script>
<%- include('./scripts/chart-helpers.js') %>
<% if (_clientKind === 'time') { %><%- include('./scripts/time-series.js') %><% } %>
<% if (_clientKind === 'heatmap') { %><%- include('./scripts/heatmap.js') %><% } %>
</script>
<% } %>
<div
  data-kui-chart="<%= _id %>"
  data-kui-chart-type="<%= _type %>"
  <% if (_clientKind) { %>data-kui-chart-kind="<%= _clientKind %>"
  data-kui-chart-config="<%= JSON.stringify(_clientConfig) %>"<% } %>
  class="kui-chart relative w-full<%= _className ? ' ' + _className : '' %>"
>
  <div
    data-kui-chart-canvas
    class="relative w-full"
    style="height: <%= _height %>px;"
  >
    <% if (_partial) { %>
    <%- include(_partial, {
      _id: _id,
      _series: _series,
      _height: _height,
      _showGrid: _showGrid,
      _showTooltip: _showTooltip,
      _ariaLabel: _ariaLabel,
      _stacked: _stacked,
      innerRadius: locals.innerRadius,
      fillOpacity: locals.fillOpacity,
      filled: locals.filled,
    }) %>
    <% } %>
  </div>
  <% if (_clientKind === 'time' && locals.zoom !== false) { %>
  <button
    type="button"
    data-kui-chart-reset
    hidden
    class="mt-1 rounded-sm text-xs text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  ><%= _resetZoomLabel %></button>
  <% } %>
  <% if (_showLegend && _type !== 'sparkline' && _type !== 'heatmap' && _series.length) { %>
  <ul
    class="kui-chart-legend mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5"
    style="font-size: 12px;"
    role="list"
  >
    <% if (_type === 'pie' || _type === 'donut') { %>
      <% (_series[0] && _series[0].data || []).forEach(function (p, i) {
        var sw = 'var(--primary)';
        var palette = ['var(--primary)','var(--secondary)','var(--success)','var(--warning)','var(--error)','var(--info)','var(--primary-active)','var(--text-secondary)'];
        sw = p.color || palette[i % palette.length];
      %>
      <li class="flex items-center gap-2 text-text-secondary">
        <span aria-hidden="true" class="inline-block w-2.5 h-2.5 rounded-sm" style="background-color: <%= sw %>; border: 1px solid var(--border);"></span>
        <span><%= p.label || p.x %></span>
      </li>
      <% }); %>
    <% } else { %>
      <% _series.forEach(function (s, i) {
        var palette = ['var(--primary)','var(--secondary)','var(--success)','var(--warning)','var(--error)','var(--info)','var(--primary-active)','var(--text-secondary)'];
        var sw = s.color || palette[i % palette.length];
      %>
      <li class="flex items-center gap-2 text-text-secondary">
        <span aria-hidden="true" class="inline-block w-2.5 h-2.5 rounded-sm" style="background-color: <%= sw %>; border: 1px solid var(--border);"></span>
        <span><%= s.name %></span>
      </li>
      <% }); %>
    <% } %>
  </ul>
  <% } %>
</div>
<% if (_clientKind) { %>
<script>
(function () { if (window.KuiChart) window.KuiChart.autoInit(); })();
</script>
<% } %>
<% } %>

```
