# SecuritySchemeBadge

- **id:** `api-doc-security-scheme-badge`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/SecuritySchemeBadge.ejs`
- **status:** stable
- **since:** 0.1

Rounded-full pill varyantı güvenlik rozeti — sidebar ve üst bilgi alanları için.

## Design tokens consumed

- `--info`
- `--info-fg`
- `--info-subtle`
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

### Pill variants

```ejs
<%- include('modules/domain/api-doc/SecuritySchemeBadge', { scheme: { name: 'BearerAuth', type: 'http' } }) %>
<%- include('modules/domain/api-doc/SecuritySchemeBadge', { scheme: { name: 'ApiKey', type: 'apiKey' } }) %>
```

## Full EJS source

```ejs
<%
  var _scheme    = locals.scheme || {};
  var _type      = locals.type || _scheme.type || 'apiKey';
  var _name      = locals.name || _scheme.name || null;
  var _size      = locals.size || 'md';
  var _className = locals.className || '';

  var schemeConfig = {
    apiKey:        { label: 'API Key',        icon: 'fa-solid fa-key',          style: 'bg-warning-subtle text-warning-fg' },
    http:          { label: 'HTTP',           icon: 'fa-solid fa-lock',         style: 'bg-info-subtle text-info-fg' },
    oauth2:        { label: 'OAuth 2.0',      icon: 'fa-solid fa-shield',       style: 'bg-primary-subtle text-primary' },
    openIdConnect: { label: 'OpenID Connect', icon: 'fa-solid fa-fingerprint',  style: 'bg-success-subtle text-success-fg' },
    mutualTLS:     { label: 'Mutual TLS',     icon: 'fa-solid fa-user-shield',  style: 'bg-surface-sunken text-text-secondary' },
  };

  var sizeClass   = _size === 'sm' ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-xs';
  var config      = schemeConfig[_type] || schemeConfig['apiKey'];
  var displayName = _name || config.label;
%>
<span class="inline-flex items-center gap-1 rounded-full font-medium <%= sizeClass %> <%= config.style %><%= _className ? ' ' + _className : '' %>">
  <i class="<%= config.icon %> text-[10px]" aria-hidden="true"></i>
  <%= displayName %>
</span>

```
