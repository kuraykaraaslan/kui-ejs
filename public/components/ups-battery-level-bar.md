# BatteryLevelBar

- **id:** `ups-battery-level-bar`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/BatteryLevelBar.ejs`
- **status:** stable
- **since:** 2025-05

Battery charge indicator with percent, color-coded bar (green/yellow/red), charge status, and runtime remaining.

## Design tokens consumed

- `--error`
- `--secondary`
- `--success`
- `--surface-sunken`
- `--text-secondary`
- `--warning`

## Variants

### Full charge

```ejs
<%- include('../../../modules/domain/ups/BatteryLevelBar', { percent: battery.percent, status: battery.status, runtimeMinutes: battery.runtimeMinutes }) %>
```

### Low battery

```ejs
<%- include('../../../modules/domain/ups/BatteryLevelBar', { percent: 12, status: 'DISCHARGING', runtimeMinutes: 6 }) %>
```

## Full EJS source

```ejs
<%
  var _percent        = locals.percent        || 0;
  var _status         = (locals.status || 'UNKNOWN').toUpperCase();
  var _runtimeMinutes = locals.runtimeMinutes || 0;
  var _size           = locals.size           || 'md';

  var barColor = _percent > 50 ? 'bg-success' : _percent > 20 ? 'bg-warning' : 'bg-error';
  var textColor = _percent > 50 ? 'text-success' : _percent > 20 ? 'text-warning' : 'text-error';

  var statusIcon = _status === 'CHARGING' ? 'fa-bolt' : _status === 'DISCHARGING' ? 'fa-battery-half' : _status === 'FULL' ? 'fa-battery-full' : 'fa-battery-quarter';
  var statusLabel = _status === 'CHARGING' ? 'Charging' : _status === 'DISCHARGING' ? 'Discharging' : _status === 'FULL' ? 'Full' : 'Unknown';

  var runtimeH = Math.floor(_runtimeMinutes / 60);
  var runtimeM = _runtimeMinutes % 60;
  var runtimeStr = runtimeH > 0 ? runtimeH + 'h ' + runtimeM + 'm' : runtimeM + 'm';

  var barH = _size === 'sm' ? 'h-1.5' : _size === 'lg' ? 'h-3' : 'h-2';
  var textSz = _size === 'lg' ? 'text-3xl' : _size === 'sm' ? 'text-sm' : 'text-xl';
%>
<div class="flex flex-col gap-2">
  <div class="flex items-end justify-between gap-3">
    <div class="flex items-baseline gap-1">
      <span class="<%= textSz %> font-bold <%= textColor %> leading-none"><%= _percent %>%</span>
      <span class="text-xs text-text-secondary leading-none">battery</span>
    </div>
    <div class="flex items-center gap-1.5 text-xs text-text-secondary">
      <i class="fa-solid <%= statusIcon %>" aria-hidden="true"></i>
      <span><%= statusLabel %></span>
    </div>
  </div>

  <div class="w-full <%= barH %> rounded-full bg-surface-sunken overflow-hidden">
    <div class="h-full rounded-full <%= barColor %> transition-all duration-500" style="width:<%= _percent %>%"></div>
  </div>

  <% if (_runtimeMinutes > 0) { %>
  <p class="text-xs text-text-secondary"><%= runtimeStr %> remaining</p>
  <% } %>
</div>

```
