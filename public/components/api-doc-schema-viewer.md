# SchemaViewer

- **id:** `api-doc-schema-viewer`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/SchemaViewer.ejs`
- **status:** stable
- **since:** 2025-04

JSON Schema nesnesini hiyerarşik olarak görselleştirir. İç içe nesneler details/summary ile genişletilebilir.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Object schema

```ejs
<%- include('modules/domain/api-doc/SchemaViewer', {
  schema: {
    type: 'object',
    required: ['id', 'name', 'price'],
    properties: {
      id:    { type: 'string', description: 'UUID identifier', readOnly: true },
      name:  { type: 'string', description: 'Display name' },
      price: { type: 'number' },
    }
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _schema = locals.schema || {};
  var _title  = locals.title  || null;
  var _name   = locals.name   || null;
  var _required = !!locals.required;
  var _depth  = typeof locals.depth === 'number' ? locals.depth : 0;
  var _defaultOpen = typeof locals.defaultOpen === 'boolean' ? locals.defaultOpen : (_depth === 0);
  var _renderRoot  = locals.renderRoot !== false; // top-level wrapper

  var TYPE_COLORS = {
    string:  'text-blue-600 dark:text-blue-400',
    number:  'text-purple-600 dark:text-purple-400',
    integer: 'text-purple-600 dark:text-purple-400',
    boolean: 'text-orange-600 dark:text-orange-400',
    array:   'text-yellow-600 dark:text-yellow-400',
    object:  'text-green-600 dark:text-green-400',
    'null':  'text-text-disabled',
  };

  function refName(ref) {
    if (!ref) return null;
    var parts = ref.split('/');
    return parts[parts.length - 1];
  }

  var type = _schema.type || (_schema.properties ? 'object' : (_schema.items ? 'array' : null));
  var typeLabel = _schema.enum ? 'enum' : (type || refName(_schema.$ref) || '?');
  var typeColor = TYPE_COLORS[type || ''] || 'text-text-secondary';

  var hasChildren =
    (type === 'object' && _schema.properties) ||
    (type === 'array'  && _schema.items);

  var enumValues = _schema.enum || null;

  var nodeUid = 'sv_' + Math.random().toString(36).slice(2, 10);
%>

<% if (_renderRoot) { %>
<div class="rounded-lg border border-border bg-surface-base text-sm overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_title) { %>
  <div class="px-3 py-2 border-b border-border bg-surface-raised text-xs font-semibold text-text-secondary uppercase tracking-wide">
    <%= _title %>
  </div>
  <% } %>
  <div class="p-3">
<% } %>

<div class="text-sm<%= _depth > 0 ? ' ml-4 border-l border-border pl-3' : '' %>">
  <div
    class="flex flex-wrap items-start gap-x-2 gap-y-0.5 py-1<%= hasChildren ? ' cursor-pointer select-none' : '' %>"
    <% if (hasChildren) { %>data-sv-toggle="<%= nodeUid %>"<% } %>
  >
    <% if (hasChildren) { %>
      <span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled shrink-0 mt-0.5" data-sv-icon="<%= nodeUid %>">
        <i class="fa-solid <%= _defaultOpen ? 'fa-chevron-down' : 'fa-chevron-right' %>" aria-hidden="true"></i>
      </span>
    <% } else { %>
      <span class="w-3 shrink-0"></span>
    <% } %>

    <% if (_name) { %>
      <span class="font-mono font-semibold text-text-primary">
        <%= _name %><% if (_required) { %><span class="text-error ml-0.5" title="required">*</span><% } %>
      </span>
    <% } %>

    <span class="font-mono text-xs <%= typeColor %>">
      <%= typeLabel %><% if (_schema.format) { %><span class="text-text-disabled ml-0.5">(<%= _schema.format %>)</span><% } %><% if (type === 'array' && _schema.items) { %><span class="text-text-disabled">[<span class="<%= TYPE_COLORS[_schema.items.type || ''] || 'text-text-secondary' %>"><%= _schema.items.type || '...' %></span>]</span><% } %>
    </span>

    <% if (_schema.nullable) { %><span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border bg-surface-overlay text-text-disabled border-border">nullable</span><% } %>
    <% if (_schema.readOnly) { %><span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border bg-surface-overlay text-text-disabled border-border">read-only</span><% } %>
    <% if (_schema.writeOnly) { %><span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border bg-surface-overlay text-text-disabled border-border">write-only</span><% } %>
    <% if (_schema.deprecated) { %><span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border bg-warning-subtle text-warning border-warning/30">deprecated</span><% } %>

    <% if (_schema.description) { %>
      <span class="text-text-secondary text-xs italic"><%= _schema.description %></span>
    <% } %>

    <% if (_schema.default !== undefined) { %>
      <span class="text-xs text-text-disabled">
        default: <code class="font-mono"><%= JSON.stringify(_schema.default) %></code>
      </span>
    <% } %>
  </div>

  <% if (enumValues && enumValues.length) { %>
    <div class="ml-6 mb-1 flex flex-wrap gap-1">
      <% enumValues.forEach(function(v) { %>
        <code class="rounded bg-surface-overlay px-1.5 py-0.5 text-xs font-mono text-text-primary"><%= JSON.stringify(v) %></code>
      <% }); %>
    </div>
  <% } %>

  <% if (_schema.minLength != null || _schema.maxLength != null || _schema.pattern) { %>
    <div class="ml-6 mb-1 flex flex-wrap gap-2 text-xs text-text-disabled">
      <% if (_schema.minLength != null) { %><span>minLength: <%= _schema.minLength %></span><% } %>
      <% if (_schema.maxLength != null) { %><span>maxLength: <%= _schema.maxLength %></span><% } %>
      <% if (_schema.pattern) { %><span>pattern: <code class="font-mono"><%= _schema.pattern %></code></span><% } %>
    </div>
  <% } %>

  <% if (_schema.minimum != null || _schema.maximum != null || _schema.multipleOf != null) { %>
    <div class="ml-6 mb-1 flex flex-wrap gap-2 text-xs text-text-disabled">
      <% if (_schema.minimum != null) { %><span>min: <%= _schema.minimum %></span><% } %>
      <% if (_schema.maximum != null) { %><span>max: <%= _schema.maximum %></span><% } %>
      <% if (_schema.multipleOf != null) { %><span>multipleOf: <%= _schema.multipleOf %></span><% } %>
    </div>
  <% } %>

  <% if (_schema.allOf) { %>
    <div class="ml-6 mt-1">
      <span class="text-xs font-semibold text-text-disabled uppercase tracking-wide">allOf</span>
      <% _schema.allOf.forEach(function(s) { %>
        <%- include('./SchemaViewer', { schema: s, depth: _depth + 1, defaultOpen: false, renderRoot: false }) %>
      <% }); %>
    </div>
  <% } %>
  <% if (_schema.anyOf) { %>
    <div class="ml-6 mt-1">
      <span class="text-xs font-semibold text-text-disabled uppercase tracking-wide">anyOf</span>
      <% _schema.anyOf.forEach(function(s) { %>
        <%- include('./SchemaViewer', { schema: s, depth: _depth + 1, defaultOpen: false, renderRoot: false }) %>
      <% }); %>
    </div>
  <% } %>
  <% if (_schema.oneOf) { %>
    <div class="ml-6 mt-1">
      <span class="text-xs font-semibold text-text-disabled uppercase tracking-wide">oneOf</span>
      <% _schema.oneOf.forEach(function(s) { %>
        <%- include('./SchemaViewer', { schema: s, depth: _depth + 1, defaultOpen: false, renderRoot: false }) %>
      <% }); %>
    </div>
  <% } %>

  <% if (hasChildren) { %>
    <div data-sv-body="<%= nodeUid %>"<%= _defaultOpen ? '' : ' hidden' %>>
      <% if (type === 'object' && _schema.properties) {
        var reqList = _schema.required || [];
        Object.keys(_schema.properties).forEach(function(k) {
          var child = _schema.properties[k];
          var isReq = reqList.indexOf(k) !== -1;
      %>
        <%- include('./SchemaViewer', { schema: child, name: k, required: isReq, depth: _depth + 1, defaultOpen: false, renderRoot: false }) %>
      <% });
      } else if (type === 'array' && _schema.items) { %>
        <%- include('./SchemaViewer', { schema: _schema.items, depth: _depth + 1, defaultOpen: false, renderRoot: false }) %>
      <% } %>
    </div>
  <% } %>
</div>

<% if (_renderRoot) { %>
  </div>
</div>
<script>(function(){
  document.querySelectorAll('[data-sv-toggle]').forEach(function(trigger){
    if (trigger.dataset.svInit === '1') return;
    trigger.dataset.svInit = '1';
    trigger.addEventListener('click', function(e){
      // Avoid re-triggering when a nested toggle is clicked.
      var t = e.target.closest('[data-sv-toggle]');
      if (t !== trigger) return;
      var id   = trigger.getAttribute('data-sv-toggle');
      var body = document.querySelector('[data-sv-body="' + id + '"]');
      var icon = trigger.querySelector('[data-sv-icon="' + id + '"] i');
      if (!body) return;
      var open = !body.hasAttribute('hidden');
      if (open) {
        body.setAttribute('hidden', '');
        if (icon) { icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-right'); }
      } else {
        body.removeAttribute('hidden');
        if (icon) { icon.classList.remove('fa-chevron-right'); icon.classList.add('fa-chevron-down'); }
      }
    });
  });
})();</script>
<% } %>

```
