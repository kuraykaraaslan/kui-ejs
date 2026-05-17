# AlertItem

- **id:** `modem-alert-item`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/AlertItem.ejs`
- **status:** stable
- **since:** 0.1

Router bildirimi satırı. INFO · WARNING · CRITICAL şiddet seviyeleri. Okunmamış uyarılar mavi nokta ile işaretlenir.

## Design tokens consumed

- `--error`
- `--info`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### All severities (unread)

```ejs
<% state.alerts.forEach(function(alert) { %>
<%- include('modules/domain/modem/AlertItem', { alert: alert }) %>
<% }); %>
```

### Read vs unread

```ejs
<%- include('modules/domain/modem/AlertItem', { alert: { ...alert, read: false } }) %>
<%- include('modules/domain/modem/AlertItem', { alert: { ...alert, read: true  } }) %>
```

### Unread-only filter

```ejs
<% state.alerts.filter(function(a){ return !a.read; }).forEach(function(alert) { %>
<%- include('modules/domain/modem/AlertItem', { alert: alert }) %>
<% }); %>
```

## Full EJS source

```ejs
<%
  var _alert = locals.alert || {};

  var severityMeta = {
    INFO:     { icon: 'fa-solid fa-circle-info',          iconColor: 'text-info',    bg: 'bg-info/5',    border: 'border-info/20'    },
    WARNING:  { icon: 'fa-solid fa-triangle-exclamation', iconColor: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' },
    CRITICAL: { icon: 'fa-solid fa-circle-xmark',         iconColor: 'text-error',   bg: 'bg-error/5',   border: 'border-error/20'   },
  };
  var sm = severityMeta[_alert.severity] || severityMeta.INFO;

  function fmtTime(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' +
             d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch(e) { return iso; }
  }
%>
<div class="flex items-start gap-3 rounded-lg border p-3.5 <%= sm.bg %> <%= sm.border %><%= _alert.read ? ' opacity-60' : '' %><%= locals.className ? ' ' + locals.className : '' %>">
  <i class="<%= sm.icon %> <%= sm.iconColor %> text-base mt-0.5 shrink-0" aria-hidden="true"></i>
  <div class="flex-1 min-w-0">
    <p class="text-xs font-medium text-text-primary leading-relaxed"><%= _alert.message %></p>
    <p class="text-xs text-text-secondary mt-0.5"><%= fmtTime(_alert.timestamp) %></p>
  </div>
  <% if (!_alert.read) { %>
  <span class="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" aria-label="Unread"></span>
  <% } %>
</div>

```
