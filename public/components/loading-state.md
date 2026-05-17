# LoadingState

- **id:** `loading-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/LoadingState.ejs`
- **status:** stable
- **since:** 0.1

İskelet yükleme animasyonları. spinner / table / cards / list / detail / form variant'ları.

## Design tokens consumed

- `--border`
- `--surface-base`
- `--surface-raised`
- `--surface-sunken`

## Variants

### Spinner

```ejs
<%- include('modules/app/LoadingState', { variant: 'spinner' }) %>
```

### Table skeleton

```ejs
<%- include('modules/app/LoadingState', { variant: 'table', rows: 5, cols: 4 }) %>
```

### Cards skeleton

```ejs
<%- include('modules/app/LoadingState', { variant: 'cards', cards: 3 }) %>
```

### List skeleton

```ejs
<%- include('modules/app/LoadingState', { variant: 'list', rows: 4 }) %>
```

### Form skeleton

```ejs
<%- include('modules/app/LoadingState', { variant: 'form', rows: 3 }) %>
```

## Full EJS source

```ejs
<%
  var _variant = locals.variant || 'spinner';
  var _rows    = locals.rows    || 5;
  var _cols    = locals.cols    || 4;
  var _cards   = locals.cards   || 3;
%>

<% if (_variant === 'spinner') { %>
<div class="flex items-center justify-center py-16<%= locals.className ? ' '+locals.className : '' %>">
  <%- include('../ui/Spinner', { size: 'lg' }) %>
</div>

<% } else if (_variant === 'table') { %>
<div class="w-full overflow-x-auto rounded-lg border border-border<%= locals.className ? ' '+locals.className : '' %>" aria-busy="true" aria-label="Loading table">
  <table class="w-full text-sm">
    <thead class="bg-surface-sunken border-b border-border">
      <tr>
        <% for(var c=0;c<_cols;c++) { %><th class="px-4 py-3"><div class="h-3 rounded bg-border animate-pulse w-16"></div></th><% } %>
      </tr>
    </thead>
    <tbody class="divide-y divide-border bg-surface-base">
      <% for(var r=0;r<_rows;r++) { %>
      <tr>
        <% for(var c=0;c<_cols;c++) { %>
        <td class="px-4 py-3"><div class="h-3.5 rounded bg-surface-sunken animate-pulse" style="width:<%= 40+((r*13+c*7)%45) %>%"></div></td>
        <% } %>
      </tr>
      <% } %>
    </tbody>
  </table>
</div>

<% } else if (_variant === 'cards') { %>
<div class="grid gap-4<%= _cards>=3 ? ' grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ' grid-cols-1 sm:grid-cols-2' %><%= locals.className ? ' '+locals.className : '' %>">
  <% for(var i=0;i<_cards;i++) { %>
  <div class="rounded-xl border border-border bg-surface-raised p-5 space-y-3 animate-pulse">
    <div class="h-4 rounded bg-surface-sunken w-1/2"></div>
    <div class="h-3 rounded bg-surface-sunken w-3/4"></div>
    <div class="h-3 rounded bg-surface-sunken w-2/3"></div>
    <div class="h-8 rounded-md bg-surface-sunken w-1/3 mt-2"></div>
  </div>
  <% } %>
</div>

<% } else if (_variant === 'list') { %>
<ul class="divide-y divide-border<%= locals.className ? ' '+locals.className : '' %>" aria-busy="true" aria-label="Loading list">
  <% for(var i=0;i<_rows;i++) { %>
  <li class="flex items-center gap-3 py-3 px-4 animate-pulse">
    <div class="h-8 w-8 rounded-full bg-surface-sunken shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="h-3.5 rounded bg-surface-sunken w-1/3"></div>
      <div class="h-3 rounded bg-surface-sunken w-2/3"></div>
    </div>
    <div class="h-4 w-12 rounded bg-surface-sunken"></div>
  </li>
  <% } %>
</ul>

<% } else if (_variant === 'detail') { %>
<div class="space-y-6<%= locals.className ? ' '+locals.className : '' %>" aria-busy="true" aria-label="Loading detail">
  <div class="pb-4 border-b border-border space-y-3 animate-pulse">
    <div class="h-6 rounded bg-surface-sunken w-1/4"></div>
    <div class="h-4 rounded bg-surface-sunken w-1/2"></div>
    <div class="flex gap-2">
      <div class="h-5 w-14 rounded-full bg-surface-sunken"></div>
      <div class="h-5 w-14 rounded-full bg-surface-sunken"></div>
      <div class="h-5 w-14 rounded-full bg-surface-sunken"></div>
    </div>
  </div>
  <div class="grid sm:grid-cols-2 gap-4 animate-pulse">
    <% for(var i=0;i<4;i++) { %>
    <div class="space-y-2">
      <div class="h-3 rounded bg-surface-sunken w-1/4"></div>
      <div class="h-4 rounded bg-surface-sunken w-full"></div>
    </div>
    <% } %>
  </div>
  <div class="space-y-2 animate-pulse">
    <% for(var i=0;i<4;i++) { %><div class="h-3 rounded bg-surface-sunken w-full"></div><% } %>
    <div class="h-3 rounded bg-surface-sunken w-2/3"></div>
  </div>
</div>

<% } else if (_variant === 'form') { %>
<div class="space-y-5<%= locals.className ? ' '+locals.className : '' %>" aria-busy="true" aria-label="Loading form">
  <% for(var i=0;i<_rows;i++) { %>
  <div class="space-y-2 animate-pulse">
    <div class="h-3 rounded bg-surface-sunken w-1/4"></div>
    <div class="h-9 rounded-md bg-surface-sunken w-full"></div>
  </div>
  <% } %>
  <div class="flex justify-end gap-2 pt-2 animate-pulse">
    <div class="h-9 w-20 rounded-md bg-surface-sunken"></div>
    <div class="h-9 w-24 rounded-md bg-surface-sunken"></div>
  </div>
</div>
<% } %>

```
