# StatusCodeBadge

- **id:** `api-doc-status-code-badge`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/StatusCodeBadge.ejs`
- **status:** stable
- **since:** 0.1

HTTP durum kodunu semantik renge göre renklendiren rozet. 2xx yeşil, 3xx mavi, 4xx sarı, 5xx kırmızı.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-overlay`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Success & redirect codes

```ejs
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '200' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '201' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '204' }) %>
```

### Client & server error codes

```ejs
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '400' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '401' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '404' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '500' }) %>
```

## Full EJS source

```ejs
<%
  var _code      = String(locals.code || '');
  var _showLabel = locals.showLabel !== false;
  var n          = parseInt(_code, 10);

  var statusLabels = {
    '200':'OK','201':'Created','202':'Accepted','204':'No Content',
    '301':'Moved Permanently','302':'Found',
    '400':'Bad Request','401':'Unauthorized','403':'Forbidden',
    '404':'Not Found','405':'Method Not Allowed','409':'Conflict',
    '422':'Unprocessable Entity','429':'Too Many Requests',
    '500':'Internal Server Error','502':'Bad Gateway','503':'Service Unavailable',
  };

  var style;
  if      (n >= 200 && n < 300) style = 'bg-success-subtle text-success-fg border-success/30';
  else if (n >= 300 && n < 400) style = 'bg-info-subtle text-info-fg border-info/30';
  else if (n >= 400 && n < 500) style = 'bg-warning-subtle text-warning-fg border-warning/30';
  else if (n >= 500)            style = 'bg-error-subtle text-error-fg border-error/30';
  else                          style = 'bg-surface-overlay text-text-secondary border-border';

  var label = _showLabel ? (statusLabels[_code] || '') : '';
%>
<span class="inline-flex items-center gap-1.5 rounded border font-mono font-semibold text-xs px-2 py-0.5 <%= style %><%= locals.className ? ' ' + locals.className : '' %>">
  <span><%= _code %></span>
  <% if (label) { %><span class="font-sans font-normal opacity-75"><%= label %></span><% } %>
</span>

```
