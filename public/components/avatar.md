# Avatar

- **id:** `avatar`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Avatar.ejs`
- **status:** stable
- **since:** 0.1

Kullanıcı profil fotoğrafı veya baş harfleri gösterici. 5 boyut, opsiyonel status dot.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-subtle`
- `--success`
- `--surface-base`
- `--text-disabled`
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
var _sz     = locals.size   || 'md';
var _name   = locals.name   || '';
var _src    = locals.src    || null;
var _status = locals.status || null;

var initials = _name.trim().split(/\s+/).map(function(w){ return w[0] || ''; }).slice(0, 2).join('').toUpperCase() || '?';

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
%>
<span class="<%= _status ? 'relative inline-flex shrink-0' : 'inline-flex shrink-0' %>">
  <% if (_src) { %>
    <img src="<%= _src %>" alt="<%= _name %>" class="<%= sc %> rounded-full object-cover border border-border<%= locals.className ? ' ' + locals.className : '' %>" />
  <% } else { %>
    <span aria-label="<%= _name %>" class="<%= sc %> rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center border border-primary-subtle select-none<%= locals.className ? ' ' + locals.className : '' %>">
      <%= initials %>
    </span>
  <% } %>
  <% if (_status) { %>
    <span aria-label="<%= _status %>" class="absolute bottom-0 right-0 rounded-full border-2 border-surface-base <%= statusColor %> <%= dotSc %>"></span>
  <% } %>
</span>

```
