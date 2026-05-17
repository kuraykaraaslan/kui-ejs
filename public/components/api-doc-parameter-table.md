# ParameterTable

- **id:** `api-doc-parameter-table`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ParameterTable.ejs`
- **status:** stable
- **since:** 0.1

API parametrelerini tablo biçiminde listeler. Konum rozeti, tip, zorunluluk ve açıklama sütunları içerir.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

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

  var locationVariant = { path: 'text-primary bg-primary-subtle', query: 'text-info-fg bg-info-subtle', header: 'text-warning-fg bg-warning-subtle', cookie: 'text-text-secondary bg-surface-overlay' };
%>
<div class="overflow-x-auto rounded-lg border border-border<%= locals.className ? ' ' + locals.className : '' %>">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-border bg-surface-raised">
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-1/4">Name</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-16">In</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-24">Type</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-20">Req</th>
        <th class="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Description</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      <% _parameters.forEach(function(param) {
        var schema   = param.schema || {};
        var typeStr  = schema.type || (schema.$ref ? schema.$ref.split('/').pop() : '—');
        var inStyle  = locationVariant[param.in] || 'text-text-secondary bg-surface-overlay';
      %>
      <tr class="bg-surface-base hover:bg-surface-raised transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5">
            <code class="font-mono text-xs font-semibold text-text-primary"><%= param.name %></code>
            <% if (param.deprecated) { %><span class="text-[10px] rounded bg-warning-subtle text-warning-fg px-1 py-0.5 border border-warning/30 font-medium">deprecated</span><% } %>
          </div>
        </td>
        <td class="px-4 py-3">
          <span class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium <%= inStyle %>"><%= param.in %></span>
        </td>
        <td class="px-4 py-3">
          <code class="font-mono text-xs text-text-secondary">
            <%= typeStr %><% if (schema.format) { %> <span class="text-text-disabled">(<%= schema.format %>)</span><% } %>
          </code>
        </td>
        <td class="px-4 py-3">
          <% if (param.required) { %>
            <span class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-error-subtle text-error-fg">req</span>
          <% } else { %>
            <span class="text-xs text-text-disabled">opt</span>
          <% } %>
        </td>
        <td class="px-4 py-3 text-xs text-text-secondary">
          <%= param.description || '—' %>
          <% if (schema.enum && schema.enum.length) { %>
            <div class="flex flex-wrap gap-1 mt-1">
              <% schema.enum.forEach(function(v) { %>
                <code class="rounded bg-surface-sunken px-1 py-0 text-[10px] font-mono text-text-secondary border border-border"><%= String(v) %></code>
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
