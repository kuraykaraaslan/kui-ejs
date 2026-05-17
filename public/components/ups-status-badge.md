# UpsStatusBadge

- **id:** `ups-status-badge`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/UpsStatusBadge.ejs`
- **status:** stable
- **since:** 0.1

UPS power status badge: On Line, On Battery (pulse), Low Battery, Fault, Calibrating, Bypassed, Offline.

## Design tokens consumed

- `--border`
- `--error`
- `--info`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--text-secondary`
- `--warning`

## Variants

### All statuses

```ejs
<%- include('../../../modules/domain/ups/UpsStatusBadge', { status: 'ON_LINE' }) %>
```

## Full EJS source

```ejs
<%
  var _status = (locals.status || 'OFFLINE').toUpperCase();
  var _size   = locals.size   || 'md';

  var meta = {
    ON_LINE:     { label: 'On Line',     dot: 'bg-success',        text: 'text-success',        bg: 'bg-success/10',      border: 'border-success/30',  pulse: false },
    ON_BATTERY:  { label: 'On Battery',  dot: 'bg-warning',        text: 'text-warning',        bg: 'bg-warning/10',      border: 'border-warning/30',  pulse: true  },
    LOW_BATTERY: { label: 'Low Battery', dot: 'bg-error',          text: 'text-error',          bg: 'bg-error/10',        border: 'border-error/30',    pulse: true  },
    FAULT:       { label: 'Fault',       dot: 'bg-error',          text: 'text-error',          bg: 'bg-error/10',        border: 'border-error/30',    pulse: false },
    CALIBRATING: { label: 'Calibrating', dot: 'bg-info',           text: 'text-info',           bg: 'bg-info/10',         border: 'border-info/30',     pulse: true  },
    BYPASSED:    { label: 'Bypassed',    dot: 'bg-warning',        text: 'text-warning',        bg: 'bg-warning/10',      border: 'border-warning/30',  pulse: false },
    OFFLINE:     { label: 'Offline',     dot: 'bg-text-secondary', text: 'text-text-secondary', bg: 'bg-surface-overlay', border: 'border-border',      pulse: false },
  };
  var m   = meta[_status] || meta.OFFLINE;
  var cls = _size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
%>
<span class="inline-flex items-center gap-1.5 rounded-full border font-medium <%= cls %> <%= m.text %> <%= m.bg %> <%= m.border %>" role="status">
  <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 <%= m.dot %><%= m.pulse ? ' animate-pulse' : '' %>" aria-hidden="true"></span>
  <%= m.label %>
</span>

```
