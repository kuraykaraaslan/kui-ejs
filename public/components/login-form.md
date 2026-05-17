# LoginForm

- **id:** `login-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/LoginForm.ejs`
- **status:** stable
- **since:** 0.1

Email + şifre formu. Remember me checkbox, hata banner ve action/method desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--secondary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/auth/LoginForm', {
  action: '/auth/login',
  method: 'post'
}) %>
```

### With error

```ejs
<%- include('modules/domain/common/auth/LoginForm', {
  action: '/auth/login',
  error: 'Invalid email or password. Please try again.'
}) %>
```

## Full EJS source

```ejs
<%
  var _action = locals.action || '#';
  var _method = locals.method || 'post';
  var _error  = locals.error  || '';
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <%- include('../../../ui/Input', {
    id: 'login-email',
    label: 'Email',
    type: 'email',
    name: 'email',
    required: true,
    placeholder: 'you@example.com',
    value: locals.emailValue || '',
    iconLeft: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>'
  }) %>

  <%- include('../../../ui/Input', {
    id: 'login-password',
    label: 'Password',
    type: 'password',
    name: 'password',
    required: true,
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>'
  }) %>

  <label class="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
    <input type="checkbox" name="rememberMe" value="1"
      class="h-4 w-4 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-border-focus">
    Remember me
  </label>

  <%- include('../../../ui/Button', {
    type: 'submit',
    fullWidth: true,
    children: 'Sign In'
  }) %>
</form>
```
