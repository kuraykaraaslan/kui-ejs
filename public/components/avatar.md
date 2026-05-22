# Avatar

- **id:** `avatar`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Avatar.ejs`
- **status:** stable
- **since:** 2025-01

User profile photo or initials indicator. 5 sizes with optional status dot. When no image is provided, initials render on a bg-primary-subtle / text-primary tile.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-base`
- `--surface-sunken`
- `--text-disabled`
- `--text-secondary`
- `--warning`

## Variants

### Initials (sizes)

```ejs
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'xs' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'sm' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'md' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'lg' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'xl' }) %>
```

### With label

```ejs
<div class="flex items-center gap-3">
  <%- include('modules/ui/Avatar', { name: 'John Smith' }) %>
  <div>
    <p class="text-sm font-medium text-text-primary">John Smith</p>
    <p class="text-xs text-text-secondary">john@example.com</p>
  </div>
</div>
```

### Status dot

```ejs
<%- include('modules/ui/Avatar', { name: 'Alice', status: 'online' }) %>
<%- include('modules/ui/Avatar', { name: 'Bob',   status: 'away' }) %>
<%- include('modules/ui/Avatar', { name: 'Carol', status: 'busy' }) %>
<%- include('modules/ui/Avatar', { name: 'Dave',  status: 'offline' }) %>
```

### Image source

```ejs
<%- include('modules/ui/Avatar', { src: '/avatars/jane.jpg', name: 'Jane Doe' }) %>
```

## Full EJS source

```ejs
<%
var _variant = locals.variant || 'single';
var _sz      = locals.size    || 'md';
var _name    = locals.name    || '';
var _src     = locals.src     || null;
var _status  = locals.status  || null;

var sc = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}[_sz] || 'h-10 w-10 text-sm';

var statusColor = {
  online: 'bg-success', offline: 'bg-text-disabled', away: 'bg-warning', busy: 'bg-error',
}[_status] || '';

var dotSc = {
  xs: 'h-1.5 w-1.5', sm: 'h-2 w-2', md: 'h-2.5 w-2.5', lg: 'h-3 w-3', xl: 'h-4 w-4',
}[_sz] || 'h-2.5 w-2.5';

function _initials(n) {
  return (n || '').trim().split(/\s+/).map(function(w){ return w[0] || ''; }).slice(0, 2).join('').toUpperCase() || '?';
}
%>
<% if (_variant === 'group') {
  var _avatars = locals.avatars || [];
  var _max     = (typeof locals.max === 'number') ? locals.max : 4;
  var _visible = _avatars.slice(0, _max);
  var _overflow = _avatars.length - _max;
%>
<div class="flex -space-x-2" aria-label="<%= _avatars.length %> users">
  <% _visible.forEach(function(a) { %>
    <span class="inline-flex shrink-0">
      <% if (a.src) { %>
        <img src="<%= a.src %>" alt="<%= a.name %>" class="<%= sc %> rounded-full object-cover border border-border shrink-0 ring-2 ring-surface-base" />
      <% } else { %>
        <span aria-label="<%= a.name %>" class="<%= sc %> rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center shrink-0 border border-primary-subtle select-none ring-2 ring-surface-base">
          <%= _initials(a.name) %>
        </span>
      <% } %>
    </span>
  <% }); %>
  <% if (_overflow > 0) { %>
    <span aria-label="<%= _overflow %> more" class="<%= sc %> rounded-full bg-surface-sunken text-text-secondary font-semibold text-xs flex items-center justify-center shrink-0 ring-2 ring-surface-base border border-border select-none">+<%= _overflow %></span>
  <% } %>
</div>
<% } else { %>
<span class="<%= _status ? 'relative inline-flex shrink-0' : 'inline-flex shrink-0' %>">
  <% if (_src) { %>
    <img src="<%= _src %>" alt="<%= _name %>" class="<%= sc %> rounded-full object-cover border border-border shrink-0<%= locals.className ? ' ' + locals.className : '' %>" />
  <% } else { %>
    <span aria-label="<%= _name %>" class="<%= sc %> rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center shrink-0 border border-primary-subtle select-none<%= locals.className ? ' ' + locals.className : '' %>">
      <%= _initials(_name) %>
    </span>
  <% } %>
  <% if (_status) { %>
    <span aria-label="<%= _status %>" class="absolute bottom-0 right-0 rounded-full border-2 border-surface-base <%= statusColor %> <%= dotSc %>"></span>
  <% } %>
</span>
<% } %>

```
