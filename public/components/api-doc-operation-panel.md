# OperationPanel

- **id:** `api-doc-operation-panel`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/OperationPanel.ejs`
- **status:** stable
- **since:** 2025-04

Tam API operasyonunu gösterir: Parametreler, Request Body, Responses ve Code Samples bölümleri details/summary ile katlanabilir.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--text-disabled`
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
  var _externalDocs = _operation.externalDocs || null;

  var pathParams   = _params.filter(function(p) { return p.in === 'path';   });
  var queryParams  = _params.filter(function(p) { return p.in === 'query';  });
  var headerParams = _params.filter(function(p) { return p.in === 'header'; });
  var cookieParams = _params.filter(function(p) { return p.in === 'cookie'; });
  var reqBodyContent = _reqBody && _reqBody.content ? Object.entries(_reqBody.content) : [];

  var hasSamples = _samples.length > 0;
%>

<div class="rounded-xl border border-border bg-surface-base overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">

  <!-- Operation header -->
  <div class="px-5 py-4 border-b border-border bg-surface-raised space-y-2">
    <% if (_operation.deprecated) { %>
    <div class="flex items-center gap-2 text-xs text-warning-fg bg-warning-subtle rounded px-3 py-1.5">
      <span class="w-3.5 h-3.5 inline-flex items-center justify-center shrink-0">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      </span>
      This operation is deprecated.
    </div>
    <% } %>

    <% if (_operation.description) { %>
    <p class="text-sm text-text-secondary"><%= _operation.description %></p>
    <% } %>

    <div class="flex flex-wrap items-center gap-2">
      <% _tags.forEach(function(tag) { %>
        <%- include('../../ui/Badge', { variant: 'neutral', size: 'sm', children: tag }) %>
      <% }); %>
      <% _security.forEach(function(scheme) {
        var schemeName = Object.keys(scheme)[0] || '';
      %>
        <%- include('./SecuritySchemeBadge', { type: 'http', name: schemeName, size: 'sm' }) %>
      <% }); %>
    </div>

    <% if (_externalDocs) { %>
      <a
        href="<%= _externalDocs.url %>"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        External docs
        <span class="w-3 h-3 inline-flex items-center justify-center">
          <i class="fa-solid fa-external-link" aria-hidden="true"></i>
        </span>
      </a>
    <% } %>
  </div>

  <%
    // Build tab content as HTML strings so we can pass them to TabGroup.
    function renderParamsTab() {
      var html = '<div class="space-y-4 p-4">';
      if (!_params.length) {
        html += '<p class="text-sm text-text-disabled text-center py-4">No parameters.</p>';
      }
      ['path','query','header','cookie'].forEach(function(group) {
        var list = group === 'path' ? pathParams
                 : group === 'query' ? queryParams
                 : group === 'header' ? headerParams
                 : cookieParams;
        if (!list.length) return;
        var label = group.charAt(0).toUpperCase() + group.slice(1);
        if (group === 'cookie') label = 'Cookies';
        if (group === 'header') label = 'Headers';
        html += '<section>';
        html += '<h4 class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">' + label + '</h4>';
        html += include('./ParameterTable', { parameters: list });
        html += '</section>';
      });
      html += '</div>';
      return html;
    }

    function renderBodyTab() {
      var html = '<div class="p-4 space-y-4">';
      if (!_reqBody) {
        html += '<p class="text-sm text-text-disabled text-center py-4">No request body.</p>';
      } else {
        if (_reqBody.required) {
          html += '<div>' + include('../../ui/Badge', { variant: 'error', size: 'sm', children: 'required' }) + '</div>';
        }
        if (_reqBody.description) {
          html += '<p class="text-sm text-text-secondary">' + _reqBody.description + '</p>';
        }
        reqBodyContent.forEach(function(entry) {
          var mime = entry[0], obj = entry[1];
          html += '<div>';
          html += '<p class="text-xs font-mono text-text-disabled mb-2">' + mime + '</p>';
          if (obj.schema) html += include('./SchemaViewer', { schema: obj.schema });
          html += '</div>';
        });
      }
      html += '</div>';
      return html;
    }

    function renderResponsesTab() {
      var html = '<div class="p-4 space-y-2">';
      if (!_responses.length) {
        html += '<p class="text-sm text-text-disabled text-center py-4">No responses defined.</p>';
      } else {
        _responses.forEach(function(res) {
          html += include('./ResponseCard', { response: res, defaultOpen: res.statusCode && String(res.statusCode).startsWith('2') });
        });
      }
      html += '</div>';
      return html;
    }

    function renderSamplesTab() {
      return '<div class="p-4">' + include('./CodeSamplePanel', { samples: _samples }) + '</div>';
    }

    var _tabs = [
      {
        id: 'params',
        label: 'Parameters',
        badge: _params.length ? include('../../ui/Badge', { variant: 'neutral', size: 'sm', children: String(_params.length) }) : null,
        content: renderParamsTab(),
      },
      {
        id: 'body',
        label: 'Request Body',
        badge: _reqBody ? include('../../ui/Badge', { variant: 'primary', size: 'sm', children: '1' }) : null,
        content: renderBodyTab(),
      },
      {
        id: 'responses',
        label: 'Responses',
        badge: _responses.length ? include('../../ui/Badge', { variant: 'neutral', size: 'sm', children: String(_responses.length) }) : null,
        content: renderResponsesTab(),
      },
    ];
    if (hasSamples) {
      _tabs.push({ id: 'samples', label: 'Code Samples', content: renderSamplesTab() });
    }
  %>

  <%- include('../../ui/TabGroup', { tabs: _tabs, label: 'Operation details' }) %>
</div>

```
