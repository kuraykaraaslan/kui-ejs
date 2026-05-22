# SessionExpiredBanner

- **id:** `session-expired-banner`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/SessionExpiredBanner.ejs`
- **status:** stable
- **since:** 2025-04

Warning banner shown when the user session has expired. Includes a "Sign in again" action button.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Default

```ejs
<%- include('modules/domain/common/auth/SessionExpiredBanner', {
  loginUrl: '/auth/login'
}) %>
```

### Custom message

```ejs
<%- include('modules/domain/common/auth/SessionExpiredBanner', {
  loginUrl: '/auth/login',
  message: 'You have been inactive for 30 minutes. Reconnect to continue your work.'
}) %>
```

## Full EJS source

```ejs
<%
  var _message  = locals.message  || 'Your session has expired. Please sign in again to continue.';
  var _loginUrl = locals.loginUrl || '/auth/login';
%>
<div
  role="alert"
  class="flex items-start sm:items-center justify-between gap-4 flex-wrap rounded-lg border border-warning bg-warning-subtle px-4 py-3<%= locals.className ? ' ' + locals.className : '' %>"
>
  <div class="flex items-start gap-3 min-w-0">
    <span class="w-5 h-5 text-warning shrink-0 mt-0.5 inline-flex items-center justify-center" aria-hidden="true">
      <i class="fa-solid fa-clock"></i>
    </span>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-text-primary">Session expired</p>
      <p class="text-sm text-text-secondary mt-0.5"><%= _message %></p>
    </div>
  </div>
  <% if (_loginUrl) { %>
  <%- include('../../../ui/Button', {
    element: 'a',
    href: _loginUrl,
    variant: 'primary',
    size: 'sm',
    className: 'shrink-0',
    children: 'Sign in again'
  }) %>
  <% } %>
</div>

```
