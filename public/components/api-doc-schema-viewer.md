# SchemaViewer

- **id:** `api-doc-schema-viewer`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/SchemaViewer.ejs`
- **status:** stable
- **since:** 0.1

JSON Schema nesnesini hiyerarşik olarak görselleştirir. İç içe nesneler details/summary ile genişletilebilir.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`

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
  var _depth  = locals.depth  || 0;

  var typeColors = {
    string:  'text-success-fg',
    number:  'text-primary',
    integer: 'text-primary',
    boolean: 'text-secondary',
    array:   'text-warning-fg',
    object:  'text-text-secondary',
    'null':  'text-text-disabled',
  };

  function getTypeLabel(s) {
    if (!s) return '?';
    if (s.enum)  return 'enum';
    if (s.$ref)  return s.$ref.split('/').pop() || '?';
    var t = s.type || (s.properties ? 'object' : s.items ? 'array' : '?');
    if (t === 'array' && s.items) return 'array[' + (s.items.type || '?') + ']';
    return t;
  }

  function getTypeColor(s) {
    if (!s) return 'text-text-secondary';
    var t = s.type || (s.properties ? 'object' : s.items ? 'array' : null);
    return typeColors[t] || 'text-text-secondary';
  }

  var properties = (_schema.type === 'object' || _schema.properties) ? (_schema.properties || {}) : null;
  var required   = _schema.required || [];
  var isArray    = _schema.type === 'array';
  var enumVals   = _schema.enum || null;

  var pills = [];
  if (_schema.nullable)  pills.push('nullable');
  if (_schema.readOnly)  pills.push('read-only');
  if (_schema.writeOnly) pills.push('write-only');
  if (_schema.deprecated)pills.push('deprecated');

  var constraints = [];
  if (_schema.minLength != null)  constraints.push('min: ' + _schema.minLength);
  if (_schema.maxLength != null)  constraints.push('max: ' + _schema.maxLength);
  if (_schema.minimum   != null)  constraints.push('≥ ' + _schema.minimum);
  if (_schema.maximum   != null)  constraints.push('≤ ' + _schema.maximum);
  if (_schema.pattern)            constraints.push('pattern: ' + _schema.pattern);
%>
<div class="rounded-lg border border-border bg-surface-base text-sm overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_title) { %>
  <div class="px-3 py-2 border-b border-border bg-surface-raised text-xs font-semibold text-text-secondary uppercase tracking-wide">
    <%= _title %>
  </div>
  <% } %>
  <div class="p-3 space-y-0.5">
    <% if (enumVals && enumVals.length) { %>
      <div class="flex flex-wrap gap-1 py-1">
        <% enumVals.forEach(function(v) { %>
          <code class="rounded bg-surface-overlay px-1.5 py-0.5 text-xs font-mono text-text-primary border border-border"><%= JSON.stringify(v) %></code>
        <% }); %>
      </div>
    <% } %>

    <% if (isArray && _schema.items) { %>
      <div class="flex flex-wrap items-center gap-2 py-1 text-xs">
        <span class="font-mono <%= getTypeColor(_schema) %>">array</span>
        <span class="text-text-disabled">→ items:</span>
        <span class="font-mono <%= getTypeColor(_schema.items) %>"><%= getTypeLabel(_schema.items) %></span>
        <% if (_schema.items.description) { %><span class="text-text-secondary italic"><%= _schema.items.description %></span><% } %>
      </div>
    <% } %>

    <% if (properties) { %>
      <% Object.keys(properties).forEach(function(key) {
        var prop = properties[key];
        var isReq = required.indexOf(key) !== -1;
        var hasChildren = (prop.type === 'object' && prop.properties) || (prop.type === 'array' && prop.items && prop.items.properties);
        var typeLabel = getTypeLabel(prop);
        var typeColor = getTypeColor(prop);
        var propPills = [];
        if (prop.nullable)   propPills.push('nullable');
        if (prop.readOnly)   propPills.push('read-only');
        if (prop.writeOnly)  propPills.push('write-only');
        if (prop.deprecated) propPills.push('deprecated');
      %>
        <% if (hasChildren) { %>
        <details class="group ml-<%= _depth * 4 %>">
          <summary class="flex flex-wrap items-center gap-2 py-1 cursor-pointer list-none focus:outline-none">
            <i class="fa-solid fa-chevron-right text-[9px] text-text-disabled group-open:rotate-90 transition-transform" aria-hidden="true"></i>
            <span class="font-mono font-semibold text-text-primary text-xs">
              <%= key %><% if (isReq) { %><span class="text-error ml-0.5" title="required">*</span><% } %>
            </span>
            <span class="font-mono text-xs <%= typeColor %>"><%= typeLabel %></span>
            <% propPills.forEach(function(p) { %><span class="inline-block rounded px-1 py-0 text-[10px] border bg-surface-overlay text-text-disabled border-border"><%= p %></span><% }); %>
            <% if (prop.description) { %><span class="text-text-secondary text-xs italic"><%= prop.description %></span><% } %>
          </summary>
          <div class="ml-4 border-l border-border pl-3 mt-0.5">
            <%- include('./SchemaViewer', { schema: prop.type === 'array' ? prop.items : prop, depth: _depth + 1 }) %>
          </div>
        </details>
        <% } else { %>
        <div class="flex flex-wrap items-center gap-2 py-0.5 ml-<%= _depth * 4 %> pl-5 text-xs">
          <span class="font-mono font-semibold text-text-primary">
            <%= key %><% if (isReq) { %><span class="text-error ml-0.5" title="required">*</span><% } %>
          </span>
          <span class="font-mono <%= typeColor %>">
            <%= typeLabel %><% if (prop.format) { %><span class="text-text-disabled ml-0.5">(<%= prop.format %>)</span><% } %>
          </span>
          <% propPills.forEach(function(p) { %><span class="inline-block rounded px-1 py-0 text-[10px] border bg-surface-overlay text-text-disabled border-border"><%= p %></span><% }); %>
          <% if (prop.description) { %><span class="text-text-secondary italic truncate max-w-xs"><%= prop.description %></span><% } %>
          <% if (prop.default !== undefined) { %><span class="text-text-disabled">default: <code class="font-mono"><%= JSON.stringify(prop.default) %></code></span><% } %>
          <% if (prop.enum && prop.enum.length) { %>
            <% prop.enum.forEach(function(v) { %>
              <code class="rounded bg-surface-overlay px-1 py-0 text-[10px] font-mono border border-border"><%= JSON.stringify(v) %></code>
            <% }); %>
          <% } %>
        </div>
        <% } %>
      <% }); %>
    <% } %>

    <% if (!properties && !isArray && !enumVals) { %>
    <p class="py-1 text-xs text-text-disabled italic">
      <span class="font-mono <%= getTypeColor(_schema) %>"><%= getTypeLabel(_schema) %></span>
      <% if (_schema.description) { %> — <%= _schema.description %><% } %>
    </p>
    <% } %>

    <% if (constraints.length) { %>
    <div class="flex flex-wrap gap-2 pt-1 text-[10px] text-text-disabled">
      <% constraints.forEach(function(c) { %><span><%= c %></span><% }); %>
    </div>
    <% } %>
  </div>
</div>

```
