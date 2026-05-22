# PublishStatusBadge

- **id:** `publish-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/status/PublishStatusBadge.ejs`
- **status:** stable
- **since:** 2025-03

DRAFT / PUBLISHED / ARCHIVED içerik durumları için Font Awesome ikonlu rozet. showIcon=false ile ikon gizlenebilir.

## Variants

### All statuses

```ejs
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'DRAFT' }) %>
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'PUBLISHED' }) %>
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'ARCHIVED' }) %>
```

### Without icon, small

```ejs
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'DRAFT', showIcon: false, size: 'sm' }) %>
```

## Full EJS source

```ejs
<%
  var _status   = (locals.status   || '').toUpperCase();
  var _size     = locals.size     || 'md';
  var _showIcon = locals.showIcon !== false;

  var statusMeta = {
    DRAFT:     { children: 'Draft',     variant: 'warning', icon: '<i class="fa-solid fa-pen-to-square" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
    PUBLISHED: { children: 'Published', variant: 'success', icon: '<i class="fa-solid fa-globe" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
    ARCHIVED:  { children: 'Archived',  variant: 'neutral', icon: '<i class="fa-solid fa-box-archive" style="width:.75rem;height:.75rem" aria-hidden="true"></i>' },
  };
  var meta = statusMeta[_status] || { children: locals.status || _status, variant: 'neutral', icon: '' };
  var label = (_showIcon && meta.icon ? meta.icon + ' ' : '') + meta.children;
%>
<%- include('../../../ui/Badge', {
  variant:  meta.variant,
  size:     _size,
  children: label,
  className: 'gap-1'
}) %>

```
