# ConnectionStatusBadge

- **id:** `modem-connection-status-badge`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/ConnectionStatusBadge.ejs`
- **status:** stable
- **since:** 2025-05

Color-coded badge for router/modem connection states. CONNECTED · DISCONNECTED · CONNECTING (pulse) · ERROR · ENABLED · DISABLED · ACTIVE · INACTIVE.

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

### Connection states

```ejs
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISCONNECTED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTING' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ERROR' }) %>
```

### Enabled / Active states

```ejs
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ENABLED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISABLED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ACTIVE' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'INACTIVE' }) %>
```

### Custom label

```ejs
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTED',    label: 'Online'    }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISCONNECTED', label: 'No signal' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTING',   label: 'Dialing…'  }) %>
```

## Full EJS source

```ejs
<%
  var _status = (locals.status || '').toUpperCase();
  var _size   = locals.size   || 'md';
  var _label  = locals.label  || null;

  var meta = {
    CONNECTED:    { label: 'Connected',    dot: 'bg-success',        text: 'text-success',        bg: 'bg-success/10',      border: 'border-success/30',  pulse: false },
    DISCONNECTED: { label: 'Disconnected', dot: 'bg-error',          text: 'text-error',          bg: 'bg-error/10',        border: 'border-error/30',    pulse: false },
    CONNECTING:   { label: 'Connecting',   dot: 'bg-warning',        text: 'text-warning',        bg: 'bg-warning/10',      border: 'border-warning/30',  pulse: true  },
    ERROR:        { label: 'Error',        dot: 'bg-error',          text: 'text-error',          bg: 'bg-error/10',        border: 'border-error/30',    pulse: false },
    ENABLED:      { label: 'Enabled',      dot: 'bg-success',        text: 'text-success',        bg: 'bg-success/10',      border: 'border-success/30',  pulse: false },
    DISABLED:     { label: 'Disabled',     dot: 'bg-text-secondary', text: 'text-text-secondary', bg: 'bg-surface-overlay', border: 'border-border',      pulse: false },
    ACTIVE:       { label: 'Active',       dot: 'bg-success',        text: 'text-success',        bg: 'bg-success/10',      border: 'border-success/30',  pulse: false },
    INACTIVE:     { label: 'Inactive',     dot: 'bg-text-secondary', text: 'text-text-secondary', bg: 'bg-surface-overlay', border: 'border-border',      pulse: false },
  };
  var m = meta[_status] || { label: _status, dot: 'bg-info', text: 'text-info', bg: 'bg-info/10', border: 'border-info/30', pulse: false };
  var displayLabel = _label || m.label;
  var sizeClass = _size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
%>
<span class="inline-flex items-center gap-1.5 rounded-full border font-medium <%= sizeClass %> <%= m.text %> <%= m.bg %> <%= m.border %><%= locals.className ? ' ' + locals.className : '' %>"
      role="status">
  <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 <%= m.dot %><%= m.pulse ? ' animate-pulse' : '' %>" aria-hidden="true"></span>
  <%= displayLabel %>
</span>

```
