# EmptyState

- **id:** `empty-state`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/EmptyState.ejs`
- **status:** stable
- **since:** 2026-05

Boş veri durumu için ikon, başlık, açıklama ve isteğe bağlı eylem düğmesi içeren merkezi yerleşim.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Title only

```ejs
<%- include('modules/ui/EmptyState', {
  title: 'No results'
}) %>
```

### With icon and description

```ejs
<%- include('modules/ui/EmptyState', {
  title: 'No items yet',
  description: 'Get started by creating your first item.',
  icon: '<i class="fa-solid fa-folder-open" aria-hidden="true"></i>'
}) %>
```

### With primary action

```ejs
<%- include('modules/ui/EmptyState', {
  title: 'Your inbox is empty',
  description: 'New messages will appear here as soon as they arrive.',
  icon: '<i class="fa-solid fa-inbox" aria-hidden="true"></i>',
  action: '<button class="...">Add item</button>'
}) %>
```

### Search empty

```ejs
<%- include('modules/ui/EmptyState', {
  title: 'No matches found',
  description: 'Try adjusting your search or filter.',
  icon: '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>',
  action: '<button class="...">Reset filters</button>'
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || '';
  var _description = locals.description || '';
  var _icon        = locals.icon        || '';
  var _action      = locals.action      || '';
  var _className   = locals.className   || '';
%>
<div class="flex flex-col items-center justify-center text-center py-16 px-6<%= _className ? ' ' + _className : '' %>">
  <% if (_icon) { %>
  <div class="h-12 w-12 rounded-full bg-surface-sunken flex items-center justify-center text-text-disabled text-2xl mb-4" aria-hidden="true">
    <%- _icon %>
  </div>
  <% } %>
  <h3 class="text-sm font-semibold text-text-primary"><%= _title %></h3>
  <% if (_description) { %>
  <p class="mt-1 text-sm text-text-secondary max-w-xs"><%= _description %></p>
  <% } %>
  <% if (_action) { %>
  <div class="mt-4"><%- _action %></div>
  <% } %>
</div>

```
