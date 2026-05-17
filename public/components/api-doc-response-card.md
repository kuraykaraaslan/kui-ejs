# ResponseCard

- **id:** `api-doc-response-card`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ResponseCard.ejs`
- **status:** stable
- **since:** 0.1

Tek bir API yanıtını katlanabilir kart içinde gösterir. Durum kodu rozeti, açıklama ve şema içerir.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### 200 OK response

```ejs
<%- include('modules/domain/api-doc/ResponseCard', {
  response: {
    responseId: 'r-200',
    statusCode: '200',
    description: 'Token issued',
    content: { 'application/json': { schema: { type: 'object' } } }
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _response    = locals.response    || {};
  var _defaultOpen = locals.defaultOpen !== false;
  var code = String(_response.statusCode || '');
  var n    = parseInt(code, 10);

  var badgeStyle;
  if      (n >= 200 && n < 300) badgeStyle = 'bg-success-subtle text-success-fg';
  else if (n >= 300 && n < 400) badgeStyle = 'bg-info-subtle text-info-fg';
  else if (n >= 400 && n < 500) badgeStyle = 'bg-warning-subtle text-warning-fg';
  else if (n >= 500)            badgeStyle = 'bg-error-subtle text-error-fg';
  else                          badgeStyle = 'bg-surface-overlay text-text-secondary';

  var contentEntries = _response.content ? Object.entries(_response.content) : [];
  var headers        = _response.headers  ? Object.entries(_response.headers)  : [];
%>
<details class="rounded-lg border border-border overflow-hidden group<%= locals.className ? ' ' + locals.className : '' %>"<%= _defaultOpen ? ' open' : '' %>>
  <summary class="flex w-full items-center gap-3 px-4 py-3 text-left bg-surface-raised hover:bg-surface-overlay transition-colors cursor-pointer list-none focus:outline-none">
    <span class="inline-flex items-center rounded-full font-medium px-2 py-0.5 text-xs <%= badgeStyle %> shrink-0"><%= code %></span>
    <span class="flex-1 text-sm text-text-primary"><%= _response.description || '' %></span>
    <% if (contentEntries.length > 0) { %>
      <span class="text-xs text-text-disabled font-mono shrink-0 hidden sm:block"><%= contentEntries[0][0] %></span>
    <% } %>
    <i class="fa-solid fa-chevron-down text-[10px] text-text-disabled shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true"></i>
  </summary>

  <div class="border-t border-border bg-surface-base">
    <% if (headers.length > 0) { %>
    <div class="px-4 py-3 border-b border-border">
      <p class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Response Headers</p>
      <div class="space-y-1.5">
        <% headers.forEach(function(entry) {
          var hKey = entry[0];
          var hdr  = entry[1];
        %>
          <div class="flex items-start gap-3 text-xs">
            <code class="font-mono text-text-primary shrink-0"><%= hKey %></code>
            <% if (hdr.schema && hdr.schema.type) { %><span class="rounded-full bg-surface-overlay text-text-secondary text-[10px] px-1.5 py-0.5"><%= hdr.schema.type %></span><% } %>
            <% if (hdr.description) { %><span class="text-text-secondary"><%= hdr.description %></span><% } %>
          </div>
        <% }); %>
      </div>
    </div>
    <% } %>

    <% if (contentEntries.length > 0) { %>
      <div class="p-4 space-y-3">
        <% contentEntries.forEach(function(entry) {
          var mime   = entry[0];
          var obj    = entry[1];
        %>
          <div>
            <p class="text-xs font-mono text-text-disabled mb-2"><%= mime %></p>
            <% if (obj.schema) { %>
              <%- include('./SchemaViewer', { schema: obj.schema }) %>
            <% } %>
          </div>
        <% }); %>
      </div>
    <% } else { %>
      <p class="px-4 py-3 text-xs text-text-disabled">No response body.</p>
    <% } %>
  </div>
</details>

```
