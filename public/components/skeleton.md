# Skeleton

- **id:** `skeleton`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Skeleton.ejs`
- **status:** stable
- **since:** 2025-01

İçerik yüklenmeden önce yer tutan animasyonlu placeholder. animate-pulse bg-surface-sunken kullanır. aria-busy="true" ile erişilebilirlik sağlanır.

## Design tokens consumed

- `--border`
- `--surface-raised`
- `--surface-sunken`

## Variants

### Lines

```ejs
<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-full' }) %>
<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/2' }) %>
```

### Text block

```ejs
<%- include('modules/ui/Skeleton', { variant: 'text', lines: 4 }) %>
```

### Card

```ejs
<%- include('modules/ui/Skeleton', { variant: 'card' }) %>
```

### Table rows

```ejs
<table class="w-full"><tbody>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
</tbody></table>
```

### Dashboard layout

```ejs
<%# Stat cards + table skeleton %>
<div class="space-y-4">
  <div class="grid grid-cols-3 gap-3">
    <% for (var i = 0; i < 3; i++) { %>
      <div class="border rounded-lg p-4 space-y-2">
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/2' }) %>
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/3' }) %>
      </div>
    <% } %>
  </div>
  <table><tbody><%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %></tbody></table>
</div>
```

### Article layout

```ejs
<%# Blog post / article skeleton %>
<div class="space-y-4">
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/4' }) %>
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-full' }) %>
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
  <div class="flex items-center gap-3">
    <%- include('modules/ui/Skeleton', { variant: 'avatar', size: 'sm' }) %>
    <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-24' }) %>
  </div>
  <div class="h-40 animate-pulse bg-surface-sunken rounded-xl"></div>
  <%- include('modules/ui/Skeleton', { variant: 'text', lines: 4 }) %>
</div>
```

## Full EJS source

```ejs
<%
  var _variant   = locals.variant   || 'line';
  var _className = locals.className || '';
  var _width     = locals.width     || 'w-full';
  var _size      = locals.size      || 'md';
  var _lines     = (typeof locals.lines === 'number') ? locals.lines : 3;
  var _cols      = (typeof locals.cols  === 'number') ? locals.cols  : 4;

  var base = 'animate-pulse bg-surface-sunken';

  var avatarSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[_size] || 'h-10 w-10';

  var colWidths = ['w-28', 'w-40', 'w-20', 'w-16'];
%>
<% if (_variant === 'line') { %>
  <div class="<%= base %> h-3 rounded <%= _width %><%= _className ? ' ' + _className : '' %>"></div>
<% } else if (_variant === 'avatar') { %>
  <div class="<%= base %> rounded-full shrink-0 <%= avatarSize %><%= _className ? ' ' + _className : '' %>"></div>
<% } else if (_variant === 'text') { %>
  <div class="space-y-2<%= _className ? ' ' + _className : '' %>" aria-busy="true" aria-label="Loading content">
    <% for (var i = 0; i < _lines; i++) { %>
      <div class="<%= base %> h-3 rounded <%= (i === _lines - 1) ? 'w-4/5' : 'w-full' %>"></div>
    <% } %>
  </div>
<% } else if (_variant === 'card') { %>
  <div class="bg-surface-raised border border-border rounded-xl p-6 space-y-4<%= _className ? ' ' + _className : '' %>" aria-busy="true" aria-label="Loading content">
    <div class="flex items-center gap-3">
      <div class="<%= base %> rounded-full shrink-0 h-10 w-10"></div>
      <div class="flex-1 space-y-2">
        <div class="<%= base %> h-3 rounded w-2/3"></div>
        <div class="<%= base %> h-3 rounded w-1/2"></div>
      </div>
    </div>
    <div class="space-y-2" aria-busy="true" aria-label="Loading content">
      <div class="<%= base %> h-3 rounded w-full"></div>
      <div class="<%= base %> h-3 rounded w-full"></div>
      <div class="<%= base %> h-3 rounded w-4/5"></div>
    </div>
    <div class="flex justify-between">
      <div class="<%= base %> h-6 w-16 rounded"></div>
      <div class="<%= base %> h-6 w-20 rounded"></div>
    </div>
  </div>
<% } else if (_variant === 'tableRow') { %>
  <tr class="border-b border-border<%= _className ? ' ' + _className : '' %>">
    <% for (var j = 0; j < _cols; j++) { %>
      <td class="px-4 py-3">
        <div class="<%= base %> h-4 rounded <%= colWidths[j] || 'w-24' %>"></div>
      </td>
    <% } %>
  </tr>
<% } %>

```
