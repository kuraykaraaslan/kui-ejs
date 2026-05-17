# ApiTagSection

- **id:** `api-doc-api-tag-section`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ApiTagSection.ejs`
- **status:** stable
- **since:** 0.1

Bir OpenAPI tag grubunu, altındaki endpoint satırlarıyla birlikte katlanabilir bölüm olarak gösterir.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Products tag section

```ejs
<%- include('modules/domain/api-doc/ApiTagSection', {
  tag: { tagId: 'tag-products', name: 'Products', description: 'Product catalogue — create, read, update, delete' },
  paths: [
    { pathItem: { pathItemId: 'pi-products', path: '/products', operations: [
      { operationId: 'list-products', operationKey: 'list-products', method: 'GET', summary: 'List products', parameters: [], responses: [] },
      { operationId: 'create-product', operationKey: 'create-product', method: 'POST', summary: 'Create product', parameters: [], responses: [] },
    ]}}
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _tag         = locals.tag         || {};
  var _paths       = locals.paths       || [];
  var _defaultOpen = locals.defaultOpen !== false;

  var totalOps = _paths.reduce(function(acc, p) {
    return acc + ((p.pathItem && p.pathItem.operations) ? p.pathItem.operations.length : 0);
  }, 0);
%>
<section class="rounded-xl border border-border overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">
  <details<%= _defaultOpen ? ' open' : '' %> class="group">
    <summary class="flex w-full items-center gap-3 px-5 py-4 text-left bg-surface-raised hover:bg-surface-overlay transition-colors cursor-pointer list-none focus:outline-none group-open:border-b group-open:border-border">

      <i class="fa-solid fa-chevron-down w-4 text-text-disabled shrink-0 group-open:rotate-0 -rotate-90 transition-transform text-xs" aria-hidden="true"></i>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-text-primary"><%= _tag.name || '' %></h3>
          <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-surface-sunken text-text-secondary"><%= totalOps %></span>
        </div>
        <% if (_tag.description) { %>
          <p class="text-xs text-text-secondary mt-0.5 line-clamp-1"><%= _tag.description %></p>
        <% } %>
      </div>

      <% if (_tag.externalDocs) { %>
        <a href="<%= _tag.externalDocs.url %>" target="_blank" rel="noopener noreferrer"
           onclick="event.stopPropagation()"
           class="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
           aria-label="External docs for <%= _tag.name %>">
          Docs
          <i class="fa-solid fa-external-link text-[10px]" aria-hidden="true"></i>
        </a>
      <% } %>
    </summary>

    <div class="p-4 space-y-2 bg-surface-base">
      <% _paths.forEach(function(p) {
        var pathItem = p.pathItem || {};
        var ops = pathItem.operations || [];
        ops.forEach(function(op) {
      %>
        <%- include('./EndpointRow', { path: pathItem.path || '', operation: op }) %>
      <%   });
        });
      %>
    </div>
  </details>
</section>

```
