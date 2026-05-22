# UserAvatar

- **id:** `user-avatar`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserAvatar.ejs`
- **status:** stable
- **since:** 2025-03

Avatar that consumes the SafeUser type. Falls back to initials when no profile picture is set; supports online/away/busy/offline status dots.

## Variants

### Initials (no photo)

```ejs
<%- include('modules/domain/common/user/UserAvatar', {
  name: 'Alice Johnson',
  size: 'md'
}) %>
```

### Online / Away / Busy / Offline

```ejs
<%- include('modules/domain/common/user/UserAvatar', {
  name: user.name,
  src:  user.profilePicture,
  status: 'online'
}) %>
```

## Full EJS source

```ejs
<%
  var _name   = locals.name   || (locals.user && (locals.user.name || locals.user.email)) || 'User';
  var _src    = locals.src    || (locals.user && locals.user.profilePicture) || null;
  var _size   = locals.size   || 'md';
  var _status = locals.status || '';
%>
<%- include('../../../ui/Avatar', {
  name:      _name,
  src:       _src,
  size:      _size,
  status:    _status,
  className: locals.className || ''
}) %>
```
