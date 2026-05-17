# ChangePasswordForm

- **id:** `change-password-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/ChangePasswordForm.ejs`
- **status:** stable
- **since:** 0.1

Mevcut şifre + yeni şifre + doğrulama formu. Alan bazlı hata mesajları.

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`

## Variants

### Default

```ejs
<%- include('modules/domain/common/auth/ChangePasswordForm', {
  action: '/account/change-password'
}) %>
```

### With mismatch error

```ejs
<%- include('modules/domain/common/auth/ChangePasswordForm', {
  action: '/account/change-password',
  errors: { confirmPassword: "Passwords don't match." }
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
    id: 'current-password',
    label: 'Current Password',
    type: 'password',
    name: 'currentPassword',
    required: true,
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>',
    error: _errors.currentPassword
  }) %>

  <%- include('../../../ui/Input', {
    id: 'new-password',
    label: 'New Password',
    type: 'password',
    name: 'newPassword',
    required: true,
    hint: 'Minimum 8 characters',
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>',
    error: _errors.newPassword
  }) %>

  <%- include('../../../ui/Input', {
    id: 'confirm-password',
    label: 'Confirm New Password',
    type: 'password',
    name: 'confirmPassword',
    required: true,
    iconLeft: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>',
    error: _errors.confirmPassword
  }) %>

  <%- include('../../../ui/Button', {
    type: 'submit',
    fullWidth: true,
    children: 'Update Password'
  }) %>
</form>

```
