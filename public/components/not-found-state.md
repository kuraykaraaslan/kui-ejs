# NotFoundState

- **id:** `not-found-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/NotFoundState.ejs`
- **status:** stable
- **since:** 0.1

Kayıt bulunamadı / içerik yok durumu. backHref ile geri dön linki.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/app/NotFoundState') %>
```

### With back link

```ejs
<%- include('modules/app/NotFoundState', {
  title:       'User not found',
  description: 'This user account doesn't exist or may have been deleted.',
  backHref:    '/users',
  backLabel:   'Back to users'
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || 'Page not found';
  var _description = locals.description || "The page you're looking for doesn't exist or has been moved.";
  var _backLabel   = locals.backLabel   || 'Go back';
%>
<div class="flex flex-col items-center py-12 px-4 text-center<%= locals.className ? ' '+locals.className : '' %>">
  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken mb-4">
    <i class="fa-solid fa-magnifying-glass text-text-secondary text-lg" aria-hidden="true"></i>
  </div>
  <h2 class="text-base font-semibold text-text-primary"><%= _title %></h2>
  <p class="text-sm text-text-secondary mt-2 max-w-xs"><%= _description %></p>
  <% if (locals.backHref) { %>
  <a href="<%= locals.backHref %>"
    class="mt-5 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
    <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i><%= _backLabel %>
  </a>
  <% } %>
</div>

```
