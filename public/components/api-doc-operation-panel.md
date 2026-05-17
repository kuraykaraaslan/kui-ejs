# OperationPanel

- **id:** `api-doc-operation-panel`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/OperationPanel.ejs`
- **status:** stable
- **since:** 0.1

Tam API operasyonunu gösterir: Parametreler, Request Body, Responses ve Code Samples bölümleri details/summary ile katlanabilir.

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
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### GET operation with parameters

```ejs
<%- include('modules/domain/api-doc/OperationPanel', {
  operation: {
    operationId: 'list-products',
    operationKey: 'list-products',
    method: 'GET',
    tags: ['Products'],
    description: 'Returns a paginated list of products.',
    security: [{ BearerAuth: [] }],
    parameters: [
      { parameterId: 'p1', name: 'page', in: 'query', schema: { type: 'integer' } },
      { parameterId: 'p2', name: 'pageSize', in: 'query', schema: { type: 'integer' } },
      { parameterId: 'p3', name: 'category', in: 'query', schema: { type: 'string' } },
    ],
    responses: [
      { responseId: 'r1', statusCode: '200', description: 'OK' },
    ],
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _operation = locals.operation || {};
  var _params    = _operation.parameters  || [];
  var _responses = _operation.responses   || [];
  var _tags      = _operation.tags        || [];
  var _samples   = _operation.codeSamples || [];
  var _security  = _operation.security    || [];
  var _reqBody   = _operation.requestBody || null;

  var pathParams   = _params.filter(function(p) { return p.in === 'path';   });
  var queryParams  = _params.filter(function(p) { return p.in === 'query';  });
  var headerParams = _params.filter(function(p) { return p.in === 'header'; });
  var cookieParams = _params.filter(function(p) { return p.in === 'cookie'; });
  var reqBodyContent = _reqBody && _reqBody.content ? Object.entries(_reqBody.content) : [];

  var hasSamples = _samples.length > 0;

  /* Unique namespace for this tab group — based on operationId */
  var ns = 'opt-' + (_operation.operationId || ('x' + Math.random().toString(36).slice(2))).replace(/[^a-z0-9]/gi, '-');
%>

<style>
  #<%= ns %> > [type=radio] { display: none; }
  #<%= ns %> .op-panel { display: none; }
  #<%= ns %>-p:checked ~ .op-panels > .panel-p { display: block; }
  #<%= ns %>-b:checked ~ .op-panels > .panel-b { display: block; }
  #<%= ns %>-r:checked ~ .op-panels > .panel-r { display: block; }
  #<%= ns %>-c:checked ~ .op-panels > .panel-c { display: block; }
  #<%= ns %>-p:checked ~ .op-tabs label[for="<%= ns %>-p"],
  #<%= ns %>-b:checked ~ .op-tabs label[for="<%= ns %>-b"],
  #<%= ns %>-r:checked ~ .op-tabs label[for="<%= ns %>-r"],
  #<%= ns %>-c:checked ~ .op-tabs label[for="<%= ns %>-c"] {
    border-bottom-color: var(--primary);
    color: var(--primary);
  }
</style>

<div class="rounded-xl border border-border bg-surface-base overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">

  <!-- Operation header -->
  <div class="px-5 py-4 border-b border-border bg-surface-raised space-y-2">
    <% if (_operation.deprecated) { %>
    <div class="flex items-center gap-2 text-xs text-warning-fg bg-warning-subtle rounded px-3 py-1.5">
      <i class="fa-solid fa-triangle-exclamation text-xs shrink-0" aria-hidden="true"></i>
      This operation is deprecated.
    </div>
    <% } %>

    <% if (_operation.description) { %>
    <p class="text-sm text-text-secondary"><%= _operation.description %></p>
    <% } %>

    <div class="flex flex-wrap items-center gap-2">
      <% _tags.forEach(function(tag) { %>
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-surface-sunken text-text-secondary"><%= tag %></span>
      <% }); %>
      <% _security.forEach(function(scheme) {
        var schemeName = Object.keys(scheme)[0] || '';
      %>
        <span class="inline-flex items-center gap-1 rounded-full font-medium px-2 py-0.5 text-xs bg-info-subtle text-info-fg">
          <i class="fa-solid fa-lock text-[10px]" aria-hidden="true"></i>
          <%= schemeName %>
        </span>
      <% }); %>
    </div>
  </div>

  <!-- Tab system -->
  <div id="<%= ns %>">

    <!-- Radio inputs (hidden via CSS) — must be direct children before tab bar -->
    <input type="radio" id="<%= ns %>-p" name="<%= ns %>" checked>
    <input type="radio" id="<%= ns %>-b" name="<%= ns %>">
    <input type="radio" id="<%= ns %>-r" name="<%= ns %>">
    <% if (hasSamples) { %>
    <input type="radio" id="<%= ns %>-c" name="<%= ns %>">
    <% } %>

    <!-- Tab bar -->
    <div class="op-tabs flex border-b border-border bg-surface-raised overflow-x-auto">
      <label for="<%= ns %>-p"
             class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-text-secondary border-b-2 border-transparent -mb-px cursor-pointer whitespace-nowrap hover:text-text-primary transition-colors">
        Parameters
        <% if (_params.length) { %>
          <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-surface-sunken text-text-secondary"><%= _params.length %></span>
        <% } %>
      </label>

      <label for="<%= ns %>-b"
             class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-text-secondary border-b-2 border-transparent -mb-px cursor-pointer whitespace-nowrap hover:text-text-primary transition-colors">
        Request Body
        <% if (_reqBody) { %>
          <% if (_reqBody.required) { %>
            <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-error-subtle text-error-fg">required</span>
          <% } else { %>
            <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-primary-subtle text-primary">1</span>
          <% } %>
        <% } %>
      </label>

      <label for="<%= ns %>-r"
             class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-text-secondary border-b-2 border-transparent -mb-px cursor-pointer whitespace-nowrap hover:text-text-primary transition-colors">
        Responses
        <% if (_responses.length) { %>
          <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-surface-sunken text-text-secondary"><%= _responses.length %></span>
        <% } %>
      </label>

      <% if (hasSamples) { %>
      <label for="<%= ns %>-c"
             class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-text-secondary border-b-2 border-transparent -mb-px cursor-pointer whitespace-nowrap hover:text-text-primary transition-colors">
        Code Samples
      </label>
      <% } %>
    </div>

    <!-- Tab panels -->
    <div class="op-panels">

      <!-- Parameters -->
      <div class="op-panel panel-p px-5 py-4 space-y-4">
        <% if (!_params.length) { %>
          <p class="text-sm text-text-disabled text-center py-4">No parameters.</p>
        <% } %>
        <% if (pathParams.length > 0) { %>
          <section>
            <h4 class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Path</h4>
            <%- include('./ParameterTable', { parameters: pathParams }) %>
          </section>
        <% } %>
        <% if (queryParams.length > 0) { %>
          <section>
            <h4 class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Query</h4>
            <%- include('./ParameterTable', { parameters: queryParams }) %>
          </section>
        <% } %>
        <% if (headerParams.length > 0) { %>
          <section>
            <h4 class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Headers</h4>
            <%- include('./ParameterTable', { parameters: headerParams }) %>
          </section>
        <% } %>
        <% if (cookieParams.length > 0) { %>
          <section>
            <h4 class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Cookies</h4>
            <%- include('./ParameterTable', { parameters: cookieParams }) %>
          </section>
        <% } %>
      </div>

      <!-- Request Body -->
      <div class="op-panel panel-b px-5 py-4 space-y-3">
        <% if (!_reqBody) { %>
          <p class="text-sm text-text-disabled text-center py-4">No request body.</p>
        <% } else { %>
          <% if (_reqBody.description) { %>
            <p class="text-sm text-text-secondary"><%= _reqBody.description %></p>
          <% } %>
          <% reqBodyContent.forEach(function(entry) {
            var mime = entry[0];
            var obj  = entry[1];
          %>
            <div>
              <p class="text-xs font-mono text-text-disabled mb-2"><%= mime %></p>
              <% if (obj.schema) { %>
                <%- include('./SchemaViewer', { schema: obj.schema }) %>
              <% } %>
            </div>
          <% }); %>
        <% } %>
      </div>

      <!-- Responses -->
      <div class="op-panel panel-r px-5 py-4 space-y-2">
        <% if (!_responses.length) { %>
          <p class="text-sm text-text-disabled text-center py-4">No responses defined.</p>
        <% } %>
        <% _responses.forEach(function(res) { %>
          <%- include('./ResponseCard', { response: res, defaultOpen: res.statusCode && res.statusCode.startsWith('2') }) %>
        <% }); %>
      </div>

      <!-- Code Samples -->
      <% if (hasSamples) { %>
      <div class="op-panel panel-c p-4">
        <%- include('./CodeSamplePanel', { samples: _samples }) %>
      </div>
      <% } %>

    </div><!-- /op-panels -->
  </div><!-- /tab system -->
</div>

```
