# EndpointRow

- **id:** `api-doc-endpoint-row`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/EndpointRow.ejs`
- **status:** stable
- **since:** 0.1

Tek bir endpoint satırı — HTTP metod rozeti, path ve özet. Tıklandığında OperationPanel açılır.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### GET and POST rows

```ejs
<%- include('modules/domain/api-doc/EndpointRow', {
  path: '/products',
  operation: {
    operationId: 'list-products',
    operationKey: 'list-products',
    method: 'GET',
    summary: 'List products',
    security: [{ BearerAuth: [] }],
    parameters: [],
    responses: [],
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _operation  = locals.operation  || {};
  var _path       = locals.path       || '';
  var _defaultOpen = locals.defaultOpen || false;

  var hasSecurity  = _operation.security && _operation.security.length > 0;
  var isDeprecated = !!_operation.deprecated;
%>
<div id="<%= _operation.operationId ? 'op-' + _operation.operationId : '' %>" class="rounded-xl border border-border overflow-hidden scroll-mt-20<%= locals.className ? ' ' + locals.className : '' %>">
  <details<%= _defaultOpen ? ' open' : '' %> class="group">
    <summary class="flex w-full items-center gap-3 px-4 py-3 text-left bg-surface-raised hover:bg-surface-overlay transition-colors cursor-pointer list-none focus:outline-none group-open:border-b group-open:border-border">

      <%- include('./HttpMethodBadge', { method: _operation.method || 'GET' }) %>

      <code class="flex-1 truncate font-mono text-sm text-text-primary"><%= _path %></code>

      <div class="flex items-center gap-2 shrink-0">
        <% if (_operation.summary) { %>
          <span class="hidden sm:block text-xs text-text-secondary truncate max-w-xs"><%= _operation.summary %></span>
        <% } %>
        <% if (hasSecurity) { %>
          <i class="fa-solid fa-lock text-xs text-text-disabled" aria-label="Requires authentication"></i>
        <% } %>
        <% if (isDeprecated) { %>
          <i class="fa-solid fa-triangle-exclamation text-xs text-warning" aria-label="Deprecated"></i>
        <% } %>
        <i class="fa-solid fa-chevron-down text-[10px] text-text-disabled group-open:rotate-180 transition-transform" aria-hidden="true"></i>
      </div>
    </summary>

    <%- include('./OperationPanel', { operation: _operation, className: 'rounded-none border-0' }) %>
  </details>
</div>

```
