# EndpointRow

- **id:** `api-doc-endpoint-row`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/EndpointRow.ejs`
- **status:** stable
- **since:** 2025-04

Collapsible row representing a single API endpoint — shows the method badge, path, summary, and expands to an OperationPanel.

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
<div class="rounded-xl border border-border overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">
  <details<%= _defaultOpen ? ' open' : '' %> class="group">
    <summary class="flex w-full items-center gap-3 px-4 py-3 text-left bg-surface-raised hover:bg-surface-overlay transition-colors cursor-pointer list-none focus:outline-none group-open:border-b group-open:border-border">

      <%- include('./HttpMethodBadge', { method: _operation.method || 'GET' }) %>

      <code class="flex-1 truncate font-mono text-sm text-text-primary"><%= _path %></code>

      <div class="flex items-center gap-2 shrink-0">
        <% if (_operation.summary) { %>
          <span class="hidden sm:block text-xs text-text-secondary truncate max-w-[240px]"><%= _operation.summary %></span>
        <% } %>
        <% if (hasSecurity) { %>
          <span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled">
            <i class="fa-solid fa-lock" aria-label="Requires authentication"></i>
          </span>
        <% } %>
        <% if (isDeprecated) { %>
          <span class="w-3.5 h-3.5 inline-flex items-center justify-center text-warning">
            <i class="fa-solid fa-triangle-exclamation" aria-label="Deprecated"></i>
          </span>
        <% } %>
        <span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled group-open:rotate-180 transition-transform">
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </span>
      </div>
    </summary>

    <%- include('./OperationPanel', { operation: _operation, className: 'rounded-none border-0' }) %>
  </details>
</div>

```
