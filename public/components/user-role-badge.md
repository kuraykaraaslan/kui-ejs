# UserRoleBadge

- **id:** `user-role-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserRoleBadge.ejs`
- **status:** stable
- **since:** 0.1

ADMIN → red, AUTHOR → primary, USER → neutral renk eşlemesi ile rol rozeti.

## Variants

### All roles

```ejs
<%- include('modules/domain/common/user/UserRoleBadge', { role: 'ADMIN' }) %>
<%- include('modules/domain/common/user/UserRoleBadge', { role: 'AUTHOR' }) %>
<%- include('modules/domain/common/user/UserRoleBadge', { role: 'USER' }) %>
```

## Full EJS source

```ejs
<%
  var _role = (locals.role || '').toUpperCase();
  var _size = locals.size || 'md';

  var roleMeta = {
    ADMIN:  { children: 'Admin',  variant: 'error' },
    AUTHOR: { children: 'Author', variant: 'primary' },
    USER:   { children: 'User',   variant: 'neutral' },
  };
  var meta = roleMeta[_role] || { children: locals.role || _role, variant: 'neutral' };
%>
<%- include('../../../ui/Badge', {
  variant:  meta.variant,
  size:     _size,
  children: meta.children
}) %>

```
