# HttpMethodBadge

- **id:** `api-doc-http-method-badge`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/HttpMethodBadge.ejs`
- **status:** stable
- **since:** 0.1

HTTP metodunu renk kodlu rozet olarak gösterir. GET yeşil, POST mavi, DELETE kırmızı, vb.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-sunken`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### All methods

```ejs
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'POST' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'DELETE' }) %>
```

### Sizes

```ejs
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'sm' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'md' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'lg' }) %>
```

## Full EJS source

```ejs
<%
  var _method = (locals.method || '').toUpperCase();
  var _size   = locals.size || 'md';

  var methodStyles = {
    GET:     'bg-success-subtle text-success-fg border-success/30',
    POST:    'bg-primary-subtle text-primary border-primary/30',
    PUT:     'bg-warning-subtle text-warning-fg border-warning/30',
    PATCH:   'bg-warning-subtle text-warning-fg border-warning/30',
    DELETE:  'bg-error-subtle text-error-fg border-error/30',
    HEAD:    'bg-surface-sunken text-text-secondary border-border',
    OPTIONS: 'bg-surface-sunken text-text-secondary border-border',
    TRACE:   'bg-surface-sunken text-text-secondary border-border',
  };

  var sizeClass = _size === 'sm' ? 'text-[10px] px-1.5 py-0 min-w-[38px]'
                : _size === 'lg' ? 'text-sm px-3 py-1 min-w-[60px]'
                :                  'text-xs px-2 py-0.5 min-w-[48px]';

  var style = methodStyles[_method] || 'bg-surface-sunken text-text-secondary border-border';
%>
<span class="inline-flex items-center justify-center rounded font-mono font-bold border uppercase tracking-wide shrink-0 <%= sizeClass %> <%= style %><%= locals.className ? ' ' + locals.className : '' %>">
  <%= _method %>
</span>

```
