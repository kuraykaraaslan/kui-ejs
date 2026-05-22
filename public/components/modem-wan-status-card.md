# WanStatusCard

- **id:** `modem-wan-status-card`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/WanStatusCard.ejs`
- **status:** stable
- **since:** 2025-05

WAN connection type, IP/gateway/DNS information, and ISP speed indicator. Color-coded based on status badge.

## Design tokens consumed

- `--border`
- `--error`
- `--info`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Connected (PPPoE)

```ejs
<%- include('modules/domain/modem/WanStatusCard', { wan: state.wan }) %>
```

### Disconnected

```ejs
<%- include('modules/domain/modem/WanStatusCard', {
  wan: { status: 'DISCONNECTED', connectionType: 'DHCP', ipAddress: null, gateway: null, dnsPrimary: null, mtu: 1500 }
}) %>
```

## Full EJS source

```ejs
<%
  var _wan = locals.wan || {};

  var statusMeta = {
    CONNECTED:    { dot: 'bg-success', ring: 'bg-success/10 border-success/30 text-success', label: 'Connected'    },
    DISCONNECTED: { dot: 'bg-error',   ring: 'bg-error/10 border-error/30 text-error',       label: 'Disconnected' },
    CONNECTING:   { dot: 'bg-warning', ring: 'bg-warning/10 border-warning/30 text-warning', label: 'Connecting'   },
    ERROR:        { dot: 'bg-error',   ring: 'bg-error/10 border-error/30 text-error',       label: 'Error'        },
  };
  var sm = statusMeta[_wan.status] || { dot: 'bg-text-secondary', ring: 'bg-surface-overlay border-border text-text-secondary', label: _wan.status };

  var fields = [
    { label: 'IP Address',   value: _wan.ipAddress    || '—' },
    { label: 'Gateway',      value: _wan.gateway      || '—' },
    { label: 'DNS Primary',  value: _wan.dnsPrimary   || '—' },
    { label: 'MTU',          value: _wan.mtu ? String(_wan.mtu) : '—' },
  ];
%>
<div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
        <i class="fa-solid fa-globe text-sm" aria-hidden="true"></i>
      </span>
      <div>
        <p class="text-sm font-semibold text-text-primary">WAN</p>
        <p class="text-xs text-text-secondary"><%= _wan.connectionType %></p>
      </div>
    </div>
    <span class="inline-flex items-center gap-1.5 rounded-full border text-xs px-2.5 py-1 font-medium <%= sm.ring %>">
      <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 <%= sm.dot %>"></span>
      <%= sm.label %>
    </span>
  </div>

  <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
    <% fields.forEach(function(f) { %>
    <div>
      <dt class="text-text-secondary"><%= f.label %></dt>
      <dd class="mt-0.5 font-mono font-medium text-text-primary"><%= f.value %></dd>
    </div>
    <% }); %>
  </dl>

  <% if (_wan.uplinkMbps || _wan.downlinkMbps) { %>
  <div class="flex gap-4 pt-1 border-t border-border text-xs text-text-secondary">
    <div class="flex items-center gap-1.5">
      <i class="fa-solid fa-arrow-up text-info" aria-hidden="true"></i>
      <span class="font-medium text-text-primary tabular-nums"><%= _wan.uplinkMbps %> Mbps</span>
    </div>
    <div class="flex items-center gap-1.5">
      <i class="fa-solid fa-arrow-down text-success" aria-hidden="true"></i>
      <span class="font-medium text-text-primary tabular-nums"><%= _wan.downlinkMbps %> Mbps</span>
    </div>
  </div>
  <% } %>
</div>

```
