# Badge

- **id:** `badge`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Badge.ejs`
- **status:** stable
- **since:** 2025-01

Status, category or label indicator. 6 semantic variants, 3 sizes, dot and dismissible support.

## Used by

- `kanban-board`

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-sunken`
- `--text-disabled`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Success

```ejs
<%- include('modules/ui/Badge', { variant: 'success', children: 'Active' }) %>
```

### Error

```ejs
<%- include('modules/ui/Badge', { variant: 'error', children: 'Inactive' }) %>
```

### Warning

```ejs
<%- include('modules/ui/Badge', { variant: 'warning', children: 'Pending' }) %>
```

### Info

```ejs
<%- include('modules/ui/Badge', { variant: 'info', children: 'New' }) %>
```

### Neutral

```ejs
<%- include('modules/ui/Badge', { variant: 'neutral', children: 'Design' }) %>
```

### Primary

```ejs
<%- include('modules/ui/Badge', { variant: 'primary', children: 'Frontend' }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Badge', { variant: 'primary', size: 'sm', children: 'Small' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', size: 'md', children: 'Medium' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', size: 'lg', children: 'Large' }) %>
```

### Dot badge

```ejs
<%- include('modules/ui/Badge', { variant: 'success', dot: true, children: 'Online' }) %>
<%- include('modules/ui/Badge', { variant: 'warning', dot: true, children: 'Away' }) %>
<%- include('modules/ui/Badge', { variant: 'error', dot: true, children: 'Busy' }) %>
<%- include('modules/ui/Badge', { variant: 'neutral', dot: true, children: 'Offline' }) %>
```

### Dismissible

```ejs
<%- include('modules/ui/Badge', { variant: 'primary', dismissible: true, children: 'React' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', dismissible: true, children: 'TypeScript' }) %>
```

## Full EJS source

```ejs
<%
var _v  = locals.variant || 'neutral';
var _sz = locals.size    || 'md';

var vc = {
  success: 'bg-success-subtle text-success-fg',
  error:   'bg-error-subtle text-error-fg',
  warning: 'bg-warning-subtle text-warning-fg',
  info:    'bg-info-subtle text-info-fg',
  neutral: 'bg-surface-sunken text-text-secondary',
  primary: 'bg-primary-subtle text-primary',
}[_v] || 'bg-surface-sunken text-text-secondary';

var sc = {
  sm: 'px-1.5 py-0 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}[_sz] || 'px-2 py-0.5 text-xs';

var dc = {
  success: 'bg-success', error: 'bg-error', warning: 'bg-warning',
  info: 'bg-info', neutral: 'bg-text-disabled', primary: 'bg-primary',
}[_v] || 'bg-text-disabled';
%>
<span class="inline-flex items-center gap-1 rounded-full font-medium <%= vc %> <%= sc %><%= locals.className ? ' ' + locals.className : '' %>">
  <% if (locals.dot) { %>
    <span class="h-1.5 w-1.5 rounded-full shrink-0 <%= dc %>" aria-hidden="true"></span>
  <% } %>
  <%= locals.children %>
  <% if (locals.dismissible) { %>
    <button type="button" aria-label="Remove" <% if (locals.onDismissHandler) { %>onclick="<%= locals.onDismissHandler %>"<% } %> class="ml-0.5 leading-none hover:opacity-70 transition-opacity focus-visible:outline-none rounded-full">
      <i class="fa-solid fa-xmark" style="font-size:.625rem" aria-hidden="true"></i>
    </button>
  <% } %>
</span>

```
