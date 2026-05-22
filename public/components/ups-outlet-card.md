# OutletCard

- **id:** `ups-outlet-card`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/OutletCard.ejs`
- **status:** stable
- **since:** 2025-05

Outlet status card showing name, ON/OFF status badge, power draw, and protection indicator.

## Design tokens consumed

- `--border`
- `--info`
- `--primary`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Outlet states

```ejs
<%- include('../../../modules/domain/ups/OutletCard', { outlet: outlet }) %>
```

## Full EJS source

```ejs
<%
  var _outlet  = locals.outlet  || {};
  var _name    = _outlet.name   || 'Outlet';
  var _status  = (_outlet.status || 'OFF').toUpperCase();
  var _powerW  = _outlet.powerW || 0;
  var _protected = _outlet.protected !== false;

  var statusMeta = {
    ON:       { text: 'text-success', bg: 'bg-success/10', border: 'border-success/30', dot: 'bg-success',  label: 'On'       },
    OFF:      { text: 'text-text-secondary', bg: 'bg-surface-overlay', border: 'border-border', dot: 'bg-text-secondary', label: 'Off' },
    REBOOTING:{ text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', dot: 'bg-warning',  label: 'Rebooting' },
  };
  var sm = statusMeta[_status] || statusMeta.OFF;
%>
<div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
  <div class="flex items-start justify-between gap-2">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-plug text-text-secondary text-sm" aria-hidden="true"></i>
      <span class="text-sm font-semibold text-text-primary"><%= _name %></span>
    </div>
    <% if (_protected) { %>
    <span title="Protected" class="text-xs text-info">
      <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
    </span>
    <% } %>
  </div>

  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 rounded-full border font-medium text-xs px-2.5 py-1 <%= sm.text %> <%= sm.bg %> <%= sm.border %>">
      <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 <%= sm.dot %>" aria-hidden="true"></span>
      <%= sm.label %>
    </span>
    <% if (_powerW > 0) { %>
    <span class="text-xs font-mono text-text-secondary"><%= _powerW %> W</span>
    <% } %>
  </div>
</div>

```
