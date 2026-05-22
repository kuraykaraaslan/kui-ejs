# SystemStatusCard

- **id:** `modem-system-status-card`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/SystemStatusCard.ejs`
- **status:** stable
- **since:** 2025-05

Cihaz modeli, CPU/RAM ilerleme çubukları, sıcaklık, uptime ve firmware versiyonu. Sıcaklık eşiğine göre renk değişir (>55 warning, >70 error).

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--success`
- `--surface-raised`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Normal load

```ejs
<%- include('modules/domain/modem/SystemStatusCard', {
  hostname:  system.hostname,
  model:     system.model,
  firmware:  system.firmware,
  resources: system.resources,
  time:      system.time,
}) %>
```

### High load (warning)

```ejs
<%- include('modules/domain/modem/SystemStatusCard', {
  hostname:  system.hostname,
  model:     system.model,
  firmware:  system.firmware,
  resources: { cpuPercent: 75, memoryPercent: 76, memoryUsedMb: 390, memoryTotalMb: 512, temperatureCelsius: 67 },
  time:      system.time,
}) %>
```

## Full EJS source

```ejs
<%
  var _resources = locals.resources || {};
  var _model     = locals.model     || {};
  var _firmware  = locals.firmware  || {};
  var _time      = locals.time      || {};
  var _hostname  = locals.hostname  || 'Router';

  function fmtUptime(s) {
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    if (d > 0) return d + 'd ' + h + 'h ' + m + 'm';
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  }

  var cpuPct = _resources.cpuPercent    || 0;
  var memPct = _resources.memoryPercent || 0;
  var temp   = _resources.temperatureCelsius !== undefined ? _resources.temperatureCelsius : null;
  var uptime = fmtUptime(_time.uptimeSeconds || 0);

  var cpuColor  = cpuPct > 80 ? 'bg-error'   : cpuPct > 60 ? 'bg-warning'   : 'bg-success';
  var memColor  = memPct > 80 ? 'bg-error'   : memPct > 60 ? 'bg-warning'   : 'bg-primary';
  var tempColor = temp !== null && temp > 70  ? 'text-error' : temp !== null && temp > 55 ? 'text-warning' : 'text-success';
%>
<div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-sm font-semibold text-text-primary"><%= _hostname %></p>
      <p class="text-xs text-text-secondary mt-0.5"><%= _model.manufacturer %> <%= _model.model %> · HW <%= _model.hardware %></p>
    </div>
    <% if (temp !== null) { %>
    <div class="text-right">
      <p class="text-lg font-bold tabular-nums <%= tempColor %>"><%= temp %>°C</p>
      <p class="text-xs text-text-secondary">Temp</p>
    </div>
    <% } %>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-medium text-text-primary">CPU</span>
        <span class="tabular-nums text-text-secondary"><%= cpuPct %>%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden">
        <div class="h-full rounded-full transition-all <%= cpuColor %>" style="width:<%= cpuPct %>%"
             role="progressbar" aria-valuenow="<%= cpuPct %>" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-medium text-text-primary">Memory</span>
        <span class="tabular-nums text-text-secondary"><%= _resources.memoryUsedMb %>/<%= _resources.memoryTotalMb %> MB</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden">
        <div class="h-full rounded-full transition-all <%= memColor %>" style="width:<%= memPct %>%"
             role="progressbar" aria-valuenow="<%= memPct %>" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>

  <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
    <span class="text-text-secondary">
      Uptime <span class="font-medium text-text-primary"><%= uptime %></span>
    </span>
    <span class="text-text-secondary font-mono"><%= _firmware.currentVersion %></span>
  </div>
</div>

```
