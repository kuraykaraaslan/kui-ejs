# SecuritySchemeBadge

- **id:** `api-doc-security-scheme-badge`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/SecuritySchemeBadge.ejs`
- **status:** stable
- **since:** 2025-04

Rounded-full pill varyantı güvenlik rozeti — sidebar ve üst bilgi alanları için.

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`
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
  var _size      = locals.size || 'sm';
  var _className = locals.className || '';

  var schemeConfig = {
    apiKey:        { label: 'API Key',        icon: 'fa-solid fa-key',          variant: 'warning' },
    http:          { label: 'HTTP',           icon: 'fa-solid fa-lock',         variant: 'info'    },
    oauth2:        { label: 'OAuth 2.0',      icon: 'fa-solid fa-shield',       variant: 'primary' },
    openIdConnect: { label: 'OpenID Connect', icon: 'fa-solid fa-fingerprint',  variant: 'success' },
    mutualTLS:     { label: 'mTLS',           icon: 'fa-solid fa-user-shield',  variant: 'neutral' },
  };

  // Mirror Badge.ejs variant/size class maps exactly so the chip output is
  // identical to a plain Badge include but lets us embed an inline icon.
  var vc = {
    success: 'bg-success-subtle text-success-fg',
    error:   'bg-error-subtle text-error-fg',
    warning: 'bg-warning-subtle text-warning-fg',
    info:    'bg-info-subtle text-info-fg',
    neutral: 'bg-surface-sunken text-text-secondary',
    primary: 'bg-primary-subtle text-primary',
  };
  var sc = {
    sm: 'px-1.5 py-0 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  var config      = schemeConfig[_type] || schemeConfig['apiKey'];
  var displayName = _name || config.label;
  var variantClass = vc[config.variant] || vc.neutral;
  var sizeClass    = sc[_size] || sc.md;
%>
<span class="inline-flex items-center gap-1 rounded-full font-medium <%= variantClass %> <%= sizeClass %><%= _className ? ' ' + _className : '' %>">
  <i class="<%= config.icon %> w-3 h-3" aria-hidden="true"></i>
  <%= displayName %>
</span>

```
