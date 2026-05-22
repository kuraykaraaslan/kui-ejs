# SecurityBadge

- **id:** `api-doc-security-badge`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/SecurityBadge.ejs`
- **status:** stable
- **since:** 2025-04

OpenAPI güvenlik şeması türünü gösteren rozet. apiKey, http (Bearer), oauth2, openIdConnect, mutualTLS.

## Design tokens consumed

- `--border`
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

### Scheme types

```ejs
<%- include('modules/domain/api-doc/SecurityBadge', { type: 'http',   name: 'BearerAuth' }) %>
<%- include('modules/domain/api-doc/SecurityBadge', { type: 'apiKey', name: 'ApiKey' }) %>
<%- include('modules/domain/api-doc/SecurityBadge', { type: 'oauth2', name: 'OAuth2' }) %>
```

## Full EJS source

```ejs
<%
  var _type      = locals.type || 'apiKey';
  var _name      = locals.name || null;
  var _className = locals.className || '';

  var schemeConfig = {
    apiKey:        { label: 'API Key',        icon: 'fa-solid fa-key',         style: 'bg-warning-subtle text-warning-fg border-warning/30' },
    http:          { label: 'HTTP',           icon: 'fa-solid fa-lock',        style: 'bg-info-subtle text-info-fg border-info/30' },
    oauth2:        { label: 'OAuth 2.0',      icon: 'fa-solid fa-shield',      style: 'bg-primary-subtle text-primary border-primary/30' },
    openIdConnect: { label: 'OpenID Connect', icon: 'fa-solid fa-fingerprint', style: 'bg-success-subtle text-success-fg border-success/30' },
    mutualTLS:     { label: 'Mutual TLS',     icon: 'fa-solid fa-id-card',     style: 'bg-surface-sunken text-text-secondary border-border' },
  };

  var config      = schemeConfig[_type] || schemeConfig['apiKey'];
  var displayName = _name || config.label;
%>
<span class="inline-flex items-center gap-1.5 rounded border text-xs font-medium px-2 py-0.5 <%= config.style %><%= _className ? ' ' + _className : '' %>">
  <i class="<%= config.icon %> text-[11px]" aria-hidden="true"></i>
  <span><%= displayName %></span>
</span>

```
