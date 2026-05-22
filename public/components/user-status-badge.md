# UserStatusBadge

- **id:** `user-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserStatusBadge.ejs`
- **status:** stable
- **since:** 2025-03

Color-coded badge for ACTIVE / INACTIVE / BANNED user statuses. Optional dot prop adds a leading status indicator.

## Variants

### All statuses

```ejs
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'ACTIVE' }) %>
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'INACTIVE' }) %>
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'BANNED' }) %>
```

### With dot

```ejs
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'ACTIVE', dot: true }) %>
```

## Full EJS source

```ejs
<%
  var _status = (locals.status || '').toUpperCase();
  var _size   = locals.size || 'md';
  var _dot    = !!locals.dot;

  var statusMeta = {
    ACTIVE:   { children: 'Active',   variant: 'success' },
    INACTIVE: { children: 'Inactive', variant: 'neutral' },
    BANNED:   { children: 'Banned',   variant: 'error' },
  };
  var meta = statusMeta[_status] || { children: locals.status || _status, variant: 'neutral' };
%>
<%- include('../../../ui/Badge', {
  variant:  meta.variant,
  size:     _size,
  dot:      _dot,
  children: meta.children
}) %>

```
