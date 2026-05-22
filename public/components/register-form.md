# RegisterForm

- **id:** `register-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/RegisterForm.ejs`
- **status:** stable
- **since:** 2025-03

Registration form with email, password, and confirm-password fields. Real-time password match validation and server-error support.

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`

## Variants

### Default

```ejs
<%- include('modules/domain/common/auth/RegisterForm', {
  action: '/auth/register',
  method: 'post'
}) %>
```

### With field errors

```ejs
<%- include('modules/domain/common/auth/RegisterForm', {
  action: '/auth/register',
  errors: {
    email: 'Enter a valid email address.',
    password: 'Password must be at least 8 characters.'
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _action = locals.action || '#';
  var _method = locals.method || 'post';
  var _error  = locals.error  || '';
  var _errors = locals.errors || {};
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <%- include('../../../ui/Input', {
    id: 'register-email',
    label: 'Email',
    type: 'email',
    name: 'email',
    required: true,
    placeholder: 'you@example.com',
    iconLeft: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>',
    error: _errors.email
  }) %>

  <%- include('../../../ui/Input', {
    id: 'register-password',
    label: 'Password',
    type: 'password',
    name: 'password',
    required: true,
    hint: 'Minimum 8 characters',
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>',
    error: _errors.password
  }) %>

  <%- include('../../../ui/Input', {
    id: 'register-confirm-password',
    label: 'Confirm Password',
    type: 'password',
    name: 'confirmPassword',
    required: true,
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>',
    error: _errors.confirmPassword
  }) %>

  <%- include('../../../ui/Button', {
    type: 'submit',
    fullWidth: true,
    children: 'Create Account'
  }) %>
</form>

```
