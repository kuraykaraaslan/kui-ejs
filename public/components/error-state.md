# ErrorState

- **id:** `error-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ErrorState.ejs`
- **status:** stable
- **since:** 2025-03

Hata durumu: uyarı banner'ı + merkezi boş durum kombinasyonu. retryHref ile yeniden deneme linki.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-fg`
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
  var _message    = locals.message    || '';
  var _retryLabel = locals.retryLabel || 'Try again';
  var _onRetry    = locals.onRetry    || '';
  var _alertId    = 'err-alert-' + Math.random().toString(36).substr(2, 9);
%>
<div class="space-y-4<%= locals.className ? ' '+locals.className : '' %>">
  <%# AlertBanner variant="error" title=_title message=_message action={_onRetry ? {label, onClick}: undefined} %>
  <div id="<%= _alertId %>" role="alert" class="flex items-start gap-3 rounded-lg border p-4 bg-error-subtle border-error text-error-fg">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0 text-base" aria-hidden="true"></i>
    <div class="flex-1 text-sm min-w-0">
      <p class="font-semibold"><%= _title %></p>
      <% if (_message) { %><p class="mt-0.5"><%= _message %></p><% } %>
      <% if (_onRetry) { %>
      <div class="mt-2">
        <button type="button" onclick="<%= _onRetry %>" class="text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">
          <%= _retryLabel %>
        </button>
      </div>
      <% } %>
    </div>
  </div>

  <% if (_onRetry) { %>
  <%# EmptyState — icon container matches EmptyState.ejs default class output, but recolored to error tokens %>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div class="h-12 w-12 rounded-full bg-error-subtle text-error-fg flex items-center justify-center text-2xl mb-4" aria-hidden="true">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <h3 class="text-sm font-semibold text-text-primary">Unable to load data</h3>
    <p class="mt-1 text-sm text-text-secondary max-w-xs">There was a problem loading this content.</p>
    <div class="mt-4">
      <%# Button variant="outline" size="sm" iconLeft={faRotateRight} %>
      <button type="button" onclick="<%= _onRetry %>" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
        <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-rotate-right" style="font-size:0.875rem"></i></span>
        <%= _retryLabel %>
      </button>
    </div>
  </div>
  <% } %>
</div>

```
