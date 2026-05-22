# TabButton

- **id:** `tab-button`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TabButton.ejs`
- **status:** stable
- **since:** 2026-05

Pill-style tab button with active/inactive coloring and an optional count badge.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-overlay`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### With counts

```ejs
<%- include('modules/ui/TabButton', { active: true,  children: 'All',      count: 42 }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Active',   count: 18 }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Archived', count: 24 }) %>
```

### Without count

```ejs
<%- include('modules/ui/TabButton', { active: true,  children: 'Selected' }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Default' }) %>
```

## Full EJS source

```ejs
<%
  var _active    = !!locals.active;
  var _children  = locals.children  || '';
  var _count     = (locals.count !== undefined && locals.count !== null) ? locals.count : null;
  var _onClick   = locals.onClick   || '';
  var _className = locals.className || '';

  var stateCls = _active
    ? 'bg-primary text-primary-fg shadow-sm'
    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay';

  var countCls = _active
    ? 'bg-primary-fg/20 text-primary-fg'
    : 'bg-surface-sunken text-text-disabled';
%>
<button
  type="button"
  <% if (_onClick) { %>onclick="<%= _onClick %>"<% } %>
  class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= stateCls %><%= _className ? ' ' + _className : '' %>"
>
  <%- _children %>
  <% if (_count !== null) { %>
  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none <%= countCls %>"><%= _count %></span>
  <% } %>
</button>

```
