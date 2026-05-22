# ParameterTable

- **id:** `api-doc-parameter-table`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ParameterTable.ejs`
- **status:** stable
- **since:** 2025-04

Table displaying API parameters with location (path/query/header/cookie), type, required flag, and description.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Query parameters

```ejs
<%- include('modules/domain/api-doc/ParameterTable', {
  parameters: [
    { parameterId: 'p1', name: 'page',     in: 'query', schema: { type: 'integer' }, description: 'Page number (1-based)' },
    { parameterId: 'p2', name: 'pageSize', in: 'query', required: true, schema: { type: 'integer' }, description: 'Items per page' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _parameters = locals.parameters || [];
  if (!_parameters.length) { return; }

  var locationVariant = {
    path:   'primary',
    query:  'info',
    header: 'warning',
    cookie: 'neutral',
  };
%>
<div class="overflow-x-auto rounded-lg border border-border<%= locals.className ? ' ' + locals.className : '' %>">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-border bg-surface-raised">
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-1/4">Name</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-20">In</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-24">Type</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-20">Required</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Description</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      <% _parameters.forEach(function(param) {
        var schema   = param.schema || {};
        var typeStr  = schema.type || (schema.$ref ? schema.$ref.split('/').pop() : '—');
        var inVar    = locationVariant[param.in] || 'neutral';
      %>
      <tr class="bg-surface-base hover:bg-surface-raised transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5">
            <code class="font-mono text-xs font-semibold text-text-primary"><%= param.name %></code>
            <% if (param.deprecated) { %>
              <%- include('../../ui/Badge', { variant: 'warning', size: 'sm', children: 'deprecated' }) %>
            <% } %>
          </div>
        </td>
        <td class="px-4 py-3">
          <%- include('../../ui/Badge', { variant: inVar, size: 'sm', children: param.in }) %>
        </td>
        <td class="px-4 py-3">
          <code class="font-mono text-xs text-text-secondary">
            <%= typeStr %><% if (schema.format) { %> <span class="text-text-disabled">(<%= schema.format %>)</span><% } %>
          </code>
        </td>
        <td class="px-4 py-3">
          <% if (param.required) { %>
            <%- include('../../ui/Badge', { variant: 'error', size: 'sm', children: 'required' }) %>
          <% } else { %>
            <span class="text-xs text-text-disabled">optional</span>
          <% } %>
        </td>
        <td class="px-4 py-3 text-xs text-text-secondary">
          <div class="flex items-start gap-1.5">
            <span class="line-clamp-2"><%= param.description || '—' %></span>
            <% if (schema.example !== undefined) { %>
              <%- include('../../ui/Tooltip', {
                content: '<span class="font-mono text-xs">e.g. ' + String(schema.example) + '</span>',
                placement: 'top',
                children: '<span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled shrink-0 mt-0.5 cursor-help"><i class="fa-solid fa-circle-info" aria-label="Example value"></i></span>'
              }) %>
            <% } %>
          </div>
          <% if (schema.enum && schema.enum.length) { %>
            <div class="flex flex-wrap gap-1 mt-1">
              <% schema.enum.forEach(function(v) { %>
                <code class="rounded bg-surface-sunken px-1 py-0 text-[10px] font-mono text-text-secondary"><%= String(v) %></code>
              <% }); %>
            </div>
          <% } %>
        </td>
      </tr>
      <% }); %>
    </tbody>
  </table>
</div>

```
