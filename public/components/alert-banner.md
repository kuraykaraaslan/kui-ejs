# AlertBanner

- **id:** `alert-banner`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/AlertBanner.ejs`
- **status:** stable
- **since:** 0.1

Bilgi, uyarı, hata ve başarı mesajları için renk-kodlu banner. dismissible ve action desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Info

```ejs
<%- include('modules/ui/AlertBanner', {
  variant: 'info',
  title: 'Heads up',
  message: 'You can update your preferences at any time.'
}) %>
```

### Success

```ejs
<%- include('modules/ui/AlertBanner', {
  variant: 'success',
  title: 'Changes saved',
  message: 'Your profile has been updated successfully.'
}) %>
```

### Warning

```ejs
<%- include('modules/ui/AlertBanner', {
  variant: 'warning',
  title: 'Subscription expiring',
  message: 'Your plan expires in 3 days.',
  actionLabel: 'Renew plan'
}) %>
```

### Error

```ejs
<%- include('modules/ui/AlertBanner', {
  variant: 'error',
  title: 'Payment failed',
  message: 'We could not charge your card.',
  actionLabel: 'Update billing',
  actionHref: '/billing'
}) %>
```

### Dismissible

```ejs
<%- include('modules/ui/AlertBanner', {
  variant: 'info',
  message: 'This alert can be dismissed.',
  dismissible: true
}) %>
```

## Full EJS source

```ejs
<%
  var _v           = locals.variant     || 'info';
  var _title       = locals.title       || '';
  var _message     = locals.message     || '';
  var _dismissible = !!locals.dismissible;
  var _actionLabel = locals.actionLabel || '';
  var _actionHref  = locals.actionHref  || '';
  var _id          = locals.id          || 'alert-' + Math.random().toString(36).substr(2, 9);

  var variantMap = {
    success: { container: 'bg-success-subtle border-success text-success-fg', icon: 'fa-circle-check' },
    warning: { container: 'bg-warning-subtle border-warning text-warning-fg', icon: 'fa-triangle-exclamation' },
    error:   { container: 'bg-error-subtle border-error text-error-fg',       icon: 'fa-circle-xmark' },
    info:    { container: 'bg-info-subtle border-info text-info-fg',          icon: 'fa-circle-info' },
  };
  var vm = variantMap[_v] || variantMap.info;
%>
<div id="<%= _id %>" role="alert" class="flex items-start gap-3 rounded-lg border p-4 <%= vm.container %>">
  <i class="fa-solid <%= vm.icon %> mt-0.5 shrink-0 text-base" aria-hidden="true"></i>
  <div class="flex-1 text-sm min-w-0">
    <% if (_title) { %><p class="font-semibold"><%= _title %></p><% } %>
    <p class="<%= _title ? 'mt-0.5' : '' %>"><%= _message %></p>
    <% if (_actionLabel) { %>
    <div class="mt-2">
      <% if (_actionHref) { %>
      <a href="<%= _actionHref %>" class="text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"><%= _actionLabel %></a>
      <% } else { %>
      <button type="button" class="text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"><%= _actionLabel %></button>
      <% } %>
    </div>
    <% } %>
  </div>
  <% if (_dismissible) { %>
  <button
    type="button"
    aria-label="Dismiss"
    onclick="this.closest('[role=alert]').style.display='none'"
    class="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
  >
    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
  </button>
  <% } %>
</div>

```
