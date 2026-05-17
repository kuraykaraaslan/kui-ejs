# SessionExpiredBanner

- **id:** `session-expired-banner`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/SessionExpiredBanner.ejs`
- **status:** stable
- **since:** 0.1

Oturum süresi dolduğunda gösterilen uyarı banner'ı. "Sign in again" CTA butonu içerir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--primary-hover`
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
    <i class="fa-solid fa-clock text-warning shrink-0 mt-0.5 text-xl" aria-hidden="true"></i>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-text-primary">Session expired</p>
      <p class="text-sm text-text-secondary mt-0.5"><%= _message %></p>
    </div>
  </div>
  <% if (_loginUrl) { %>
  <a
    href="<%= _loginUrl %>"
    class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm shrink-0"
  >
    Sign in again
  </a>
  <% } %>
</div>

```
