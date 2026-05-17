# UserProfileForm

- **id:** `user-profile-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserProfileForm.ejs`
- **status:** stable
- **since:** 0.1

Display name, username (regex), bio (300 char), avatar URL alanları. cancelHref prop'u ile iptal butonu.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--surface-overlay`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/user/UserProfileForm', {
  action: '/account/profile',
  initial: {
    name:     user.name,
    username: user.username,
    biography: user.biography,
    profilePicture: user.profilePicture
  }
}) %>
```

### Pre-filled

```ejs
<%- include('modules/domain/common/user/UserProfileForm', {
  action: '/account/profile',
  cancelHref: '/account',
  initial: { name: 'Alice Johnson', username: 'alicejohnson', ... }
}) %>
```

## Full EJS source

```ejs
<%
  var _action   = locals.action   || '#';
  var _method   = locals.method   || 'post';
  var _error    = locals.error    || '';
  var _errors   = locals.errors   || {};
  var _initial  = locals.initial  || {};
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <%- include('../../../ui/Input', {
    id:    'profile-name',
    label: 'Display Name',
    type:  'text',
    name:  'name',
    placeholder: 'Jane Doe',
    value: _initial.name || '',
    error: _errors.name
  }) %>

  <%- include('../../../ui/Input', {
    id:    'profile-username',
    label: 'Username',
    type:  'text',
    name:  'username',
    placeholder: 'janedoe',
    value: _initial.username || '',
    hint:  'Lowercase letters, numbers and underscores. 3–32 characters.',
    error: _errors.username
  }) %>

  <%- include('../../../ui/Textarea', {
    id:    'profile-bio',
    label: 'Bio',
    name:  'biography',
    rows:  3,
    placeholder: 'Tell us about yourself…',
    value: _initial.biography || '',
    error: _errors.biography
  }) %>

  <%- include('../../../ui/Input', {
    id:    'profile-picture',
    label: 'Profile Picture URL',
    type:  'url',
    name:  'profilePicture',
    placeholder: 'https://example.com/avatar.jpg',
    value: _initial.profilePicture || '',
    iconLeft: '<i class="fa-solid fa-link text-xs" aria-hidden="true"></i>',
    error: _errors.profilePicture
  }) %>

  <div class="flex justify-end gap-2 pt-2">
    <% if (locals.cancelHref) { %>
    <a href="<%= locals.cancelHref %>"
      class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">
      Cancel
    </a>
    <% } %>
    <%- include('../../../ui/Button', {
      type: 'submit',
      children: 'Save Profile'
    }) %>
  </div>
</form>

```
