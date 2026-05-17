# Charts

- **id:** `charts`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/charts/Charts.ejs`
- **status:** beta
- **since:** 0.1

Chart.js chart bileşenleri Card içinde: Bar, Line, Doughnut, Radar ve Polar Area.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Bar — Revenue vs Expenses

```ejs
<%- include('modules/domain/common/charts/Charts', {
  chartId: 'revenue-bar',
  type: 'bar',
  title: 'Revenue vs Expenses',
  subtitle: 'Monthly comparison (USD)',
  data: barData,
  options: { scales: { y: { beginAtZero: true } } }
}) %>
```

### Line — User Activity

```ejs
<%- include('modules/domain/common/charts/Charts', {
  chartId: 'user-activity-line',
  type: 'line',
  title: 'User Activity',
  subtitle: 'Daily active users vs new signups',
  data: lineData
}) %>
```

### Doughnut — Sales by Category

```ejs
<%- include('modules/domain/common/charts/Charts', {
  chartId: 'sales-doughnut',
  type: 'doughnut',
  title: 'Sales by Category',
  data: doughnutData,
  options: { cutout: '65%', plugins: { legend: { position: 'bottom' } } }
}) %>
```

### Radar — Product Comparison

```ejs
<%- include('modules/domain/common/charts/Charts', {
  chartId: 'product-radar',
  type: 'radar',
  title: 'Product Comparison',
  data: radarData,
  options: { scales: { r: { beginAtZero: true, max: 100 } } }
}) %>
```

### Polar Area — Regional Sales

```ejs
<%- include('modules/domain/common/charts/Charts', {
  chartId: 'regional-polar',
  type: 'polarArea',
  title: 'Regional Sales',
  data: polarData
}) %>
```

## Full EJS source

```ejs
<%
/*
  Charts.ejs — Chart.js chart wrapper
  Props:
    chartId    {string}  unique canvas id
    type       {string}  'bar' | 'line' | 'doughnut' | 'radar' | 'polarArea'
    title      {string}  card title
    subtitle   {string?} card subtitle
    data       {object}  Chart.js data object (JSON-serializable)
    options    {object?} Chart.js options override (JSON-serializable)
*/
const _opts = typeof options !== 'undefined' ? options : {};
%>
<div class="rounded-xl border border-border bg-surface-raised p-5 shadow-sm">
  <div class="mb-4">
    <h3 class="text-sm font-semibold text-text-primary"><%= title %></h3>
    <% if (typeof subtitle !== 'undefined' && subtitle) { %>
      <p class="mt-0.5 text-xs text-text-secondary"><%= subtitle %></p>
    <% } %>
  </div>
  <canvas id="<%= chartId %>"></canvas>
</div>
<script>
(function () {
  var canvas = document.getElementById('<%= chartId %>');
  if (!canvas || !window.Chart) return;
  new Chart(canvas, {
    type: '<%- type %>',
    data: <%- JSON.stringify(data) %>,
    options: Object.assign({ responsive: true, plugins: { legend: { position: 'top' } } }, <%- JSON.stringify(_opts) %>)
  });
})();
</script>

```
