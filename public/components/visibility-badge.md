# VisibilityBadge

- **id:** `visibility-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/status/VisibilityBadge.ejs`
- **status:** stable
- **since:** 2025-03

Badge for PUBLIC / PRIVATE / UNLISTED visibility states with eye/lock icons. PUBLIC is green, PRIVATE is red, UNLISTED is neutral.

## Variants

### All states

```ejs
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PRIVATE' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'UNLISTED' }) %>
```

### Sizes

```ejs
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'sm' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'md' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'lg' }) %>
```

## Full EJS source

```ejs
<%
  var _visibility = (locals.visibility || '').toUpperCase();
  var _size       = locals.size       || 'md';
  var _showIcon   = locals.showIcon   !== false;

  var visibilityMeta = {
    PUBLIC:   { children: 'Public',   variant: 'success', icon: '<i class="fa-solid fa-eye" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
    PRIVATE:  { children: 'Private',  variant: 'error',   icon: '<i class="fa-solid fa-lock" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
    UNLISTED: { children: 'Unlisted', variant: 'neutral', icon: '<i class="fa-solid fa-eye-slash" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
  };
  var meta = visibilityMeta[_visibility] || { children: locals.visibility || _visibility, variant: 'neutral', icon: '' };
  var label = (_showIcon && meta.icon ? meta.icon + ' ' : '') + meta.children;
%>
<%- include('../../../ui/Badge', {
  variant:  meta.variant,
  size:     _size,
  children: label,
  className: 'gap-1' + (locals.className ? ' ' + locals.className : '')
}) %>

```
