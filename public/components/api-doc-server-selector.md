# ServerSelector

- **id:** `api-doc-server-selector`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ServerSelector.ejs`
- **status:** stable
- **since:** 0.1

API sunucu listesini gösterir. Aktif sunucu URL ve ortam etiketi ile öne çıkar, diğerleri details/summary ile listelenir.

## Design tokens consumed

- `--border`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Production selected

```ejs
<%- include('modules/domain/api-doc/ServerSelector', {
  servers: [
    { serverId: 'srv-prod', url: 'https://api.commerce.io/v2', description: 'Production', environment: 'production' },
    { serverId: 'srv-stg',  url: 'https://staging-api.commerce.io/v2', description: 'Staging', environment: 'staging' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _servers  = locals.servers || [];
  var _value    = locals.value   || (_servers[0] && _servers[0].serverId) || '';
  var _onChange = locals.onChange || null;
  if (!_servers.length) { return; }

  var envVariant = {
    production:  'bg-success-subtle text-success-fg',
    staging:     'bg-warning-subtle text-warning-fg',
    development: 'bg-info-subtle text-info-fg',
    sandbox:     'bg-surface-overlay text-text-secondary',
  };

  var active = _servers.find(function(s) { return s.serverId === _value; }) || _servers[0];
%>
<div class="relative<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2">
    <i class="fa-solid fa-server text-text-disabled text-xs shrink-0" aria-hidden="true"></i>
    <div class="flex-1 min-w-0">
      <p class="font-mono text-xs text-text-primary truncate"><%= active.url %></p>
      <% if (active.description) { %>
        <p class="text-[10px] text-text-secondary leading-tight"><%= active.description %></p>
      <% } %>
    </div>
    <% if (active.environment) { %>
      <span class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0 <%= envVariant[active.environment] || 'bg-surface-overlay text-text-secondary' %>">
        <%= active.environment %>
      </span>
    <% } %>
  </div>

  <% if (_servers.length > 1) { %>
  <details class="mt-1 group">
    <summary class="flex items-center gap-1.5 px-3 text-xs text-text-disabled hover:text-text-primary cursor-pointer list-none focus:outline-none">
      <i class="fa-solid fa-chevron-right text-[9px] group-open:rotate-90 transition-transform" aria-hidden="true"></i>
      All servers
    </summary>
    <ul class="mt-1 rounded-lg border border-border bg-surface-raised py-1 max-h-52 overflow-auto shadow-lg">
      <% _servers.forEach(function(server) { %>
      <li class="flex items-start gap-2 px-3 py-2 hover:bg-surface-overlay transition-colors<%= server.serverId === active.serverId ? ' bg-primary-subtle' : '' %>">
        <div class="flex-1 min-w-0">
          <p class="font-mono text-xs text-text-primary truncate"><%= server.url %></p>
          <% if (server.description) { %><p class="text-[10px] text-text-secondary mt-0.5"><%= server.description %></p><% } %>
        </div>
        <% if (server.environment) { %>
          <span class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0 mt-0.5 <%= envVariant[server.environment] || 'bg-surface-overlay text-text-secondary' %>">
            <%= server.environment %>
          </span>
        <% } %>
      </li>
      <% }); %>
    </ul>
  </details>
  <% } %>
</div>

```
