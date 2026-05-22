# StatCard

- **id:** `stat-card`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/StatCard.ejs`
- **status:** stable
- **since:** 2026-05

Compact metric display card with value, label, and optional accent color.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Variants

```ejs
<%- include('modules/ui/StatCard', { label: 'Total Users', value: 1284 }) %>
<%- include('modules/ui/StatCard', { label: 'Active',      value: 947,  accent: 'text-success' }) %>
<%- include('modules/ui/StatCard', { label: 'Transferred', value: 38,   accent: 'text-info' }) %>
<%- include('modules/ui/StatCard', { label: 'Cancelled',   value: 12,   accent: 'text-error' }) %>
```

### Default (no accent)

```ejs
<%- include('modules/ui/StatCard', { label: 'Sessions',    value: 1842 }) %>
<%- include('modules/ui/StatCard', { label: 'Bounce rate', value: '24%' }) %>
```

## Full EJS source

```ejs
<%
  var _label     = locals.label     || '';
  var _value     = (locals.value !== undefined && locals.value !== null) ? locals.value : '';
  var _accent    = locals.accent    || 'text-text-primary';
  var _className = locals.className || '';
%>
<div class="bg-surface-raised border border-border rounded-xl px-5 py-4 flex flex-col gap-1<%= _className ? ' ' + _className : '' %>">
  <span class="text-2xl font-black tabular-nums <%= _accent %>"><%= _value %></span>
  <span class="text-xs text-text-secondary"><%= _label %></span>
</div>

```
