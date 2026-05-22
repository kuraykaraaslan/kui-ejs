# EventLogRow

- **id:** `ups-event-log-row`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/EventLogRow.ejs`
- **status:** stable
- **since:** 2025-05

Event log table row with timestamp, severity indicator, event code, and message.

## Design tokens consumed

- `--error`
- `--info`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Event log

```ejs
<% events.forEach(function(ev, i) { %>
<%- include('../../../modules/domain/ups/EventLogRow', { event: ev, index: i }) %>
<% }); %>
```

## Full EJS source

```ejs
<%
  var _event = locals.event || {};
  var _index = locals.index || 0;

  var severityMeta = {
    INFO:     { dot: 'bg-info',    text: 'text-info',    label: 'Info'     },
    WARNING:  { dot: 'bg-warning', text: 'text-warning', label: 'Warning'  },
    CRITICAL: { dot: 'bg-error',   text: 'text-error',   label: 'Critical' },
  };
  var sm = severityMeta[_event.severity] || severityMeta.INFO;

  var ts = _event.timestamp ? new Date(_event.timestamp).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
%>
<tr class="<%= _index % 2 === 0 ? 'bg-surface-base' : 'bg-surface-raised' %> hover:bg-surface-overlay transition-colors">
  <td class="px-4 py-2.5 text-xs font-mono text-text-secondary whitespace-nowrap"><%= ts %></td>
  <td class="px-4 py-2.5">
    <span class="inline-flex items-center gap-1.5 text-xs font-medium <%= sm.text %>">
      <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 <%= sm.dot %>" aria-hidden="true"></span>
      <%= sm.label %>
    </span>
  </td>
  <td class="px-4 py-2.5 text-xs font-mono text-text-secondary"><%= _event.code || '—' %></td>
  <td class="px-4 py-2.5 text-xs text-text-primary"><%= _event.message || '—' %></td>
</tr>

```
