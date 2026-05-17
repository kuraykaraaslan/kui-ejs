# PowerLoadGauge

- **id:** `ups-power-load-gauge`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/PowerLoadGauge.ejs`
- **status:** stable
- **since:** 0.1

Load percentage gauge with watts/VA display and color-coded bar (green < 50%, yellow 50-80%, red > 80%).

## Design tokens consumed

- `--error`
- `--secondary`
- `--success`
- `--surface-sunken`
- `--text-secondary`
- `--warning`

## Variants

### Normal load

```ejs
<%- include('../../../modules/domain/ups/PowerLoadGauge', { loadPercent: output.loadPercent, watts: output.watts, va: output.va, capacity: ups }) %>
```

### Critical load

```ejs
<%- include('../../../modules/domain/ups/PowerLoadGauge', { loadPercent: 87, watts: 2349, va: 2610 }) %>
```

## Full EJS source

```ejs
<%
  var _loadPercent = locals.loadPercent || 0;
  var _watts       = locals.watts       || 0;
  var _va          = locals.va          || 0;
  var _capacity    = locals.capacity    || { watts: 2700, va: 3000 };

  var barColor  = _loadPercent > 80 ? 'bg-error'   : _loadPercent > 50 ? 'bg-warning' : 'bg-success';
  var textColor = _loadPercent > 80 ? 'text-error'  : _loadPercent > 50 ? 'text-warning' : 'text-success';
%>
<div class="flex flex-col gap-2">
  <div class="flex items-end justify-between">
    <div class="flex items-baseline gap-1">
      <span class="text-2xl font-bold leading-none <%= textColor %>"><%= _loadPercent %>%</span>
      <span class="text-xs text-text-secondary">load</span>
    </div>
    <span class="text-xs text-text-secondary font-mono"><%= _watts %> W / <%= _va %> VA</span>
  </div>
  <div class="w-full h-2.5 rounded-full bg-surface-sunken overflow-hidden">
    <div class="h-full rounded-full <%= barColor %> transition-all duration-500" style="width:<%= _loadPercent %>%"></div>
  </div>
  <p class="text-xs text-text-secondary">of <%= _capacity.watts %> W capacity</p>
</div>

```
