# ErrorState

- **id:** `error-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ErrorState.ejs`
- **status:** stable
- **since:** 0.1

Hata durumu: uyarı banner'ı + merkezi boş durum kombinasyonu. retryHref ile yeniden deneme linki.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/app/ErrorState', {
  message: 'Failed to load user data. Please check your connection.'
}) %>
```

### With retry link

```ejs
<%- include('modules/app/ErrorState', {
  title:      'Database connection failed',
  message:    'Could not connect to the database. Please try again.',
  retryHref:  req.originalUrl,
  retryLabel: 'Try again'
}) %>
```

## Full EJS source

```ejs
<%
  var _title      = locals.title      || 'Something went wrong';
  var _retryLabel = locals.retryLabel || 'Try again';
%>
<div class="space-y-4<%= locals.className ? ' '+locals.className : '' %>">
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-4 bg-error-subtle border-error">
    <i class="fa-solid fa-triangle-exclamation mt-0.5 shrink-0 text-error" aria-hidden="true"></i>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-text-primary"><%= _title %></p>
      <% if (locals.message) { %><p class="text-sm text-text-secondary mt-0.5"><%= locals.message %></p><% } %>
    </div>
    <% if (locals.retryHref) { %>
    <a href="<%= locals.retryHref %>"
      class="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i><%= _retryLabel %>
    </a>
    <% } %>
  </div>
  <div class="flex flex-col items-center py-10 px-4 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-error-subtle mb-4">
      <i class="fa-solid fa-triangle-exclamation text-error text-lg" aria-hidden="true"></i>
    </div>
    <p class="text-sm font-medium text-text-primary">Unable to load data</p>
    <p class="text-sm text-text-secondary mt-1">There was a problem loading this content.</p>
    <% if (locals.retryHref) { %>
    <a href="<%= locals.retryHref %>"
      class="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i><%= _retryLabel %>
    </a>
    <% } %>
  </div>
</div>

```
