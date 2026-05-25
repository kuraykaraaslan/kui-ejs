# ServerSelector

- **id:** `api-doc-server-selector`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ServerSelector.ejs`
- **status:** stable
- **since:** 2025-04

Dropdown for selecting the active API server, with environment badges (production, staging, development, sandbox).

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

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
  if (!_servers.length) { return; }

  var envVariant = {
    production:  'success',
    staging:     'warning',
    development: 'info',
    sandbox:     'neutral',
  };

  var active = _servers.find(function(s) { return s.serverId === _value; }) || _servers[0];
  var _ssid = 'ss_' + Math.random().toString(36).slice(2, 10);
%>
<div id="<%= _ssid %>" class="relative<%= locals.className ? ' ' + locals.className : '' %>">
  <button
    type="button"
    data-ss-trigger
    aria-haspopup="listbox"
    aria-expanded="false"
    class="flex items-center gap-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
  >
    <span class="w-3.5 h-3.5 inline-flex items-center justify-center text-text-disabled shrink-0">
      <i class="fa-solid fa-server" aria-hidden="true"></i>
    </span>
    <span class="flex-1 truncate text-left font-mono text-xs" data-ss-active-url><%= active.url %></span>
    <span data-ss-active-env class="shrink-0">
      <% if (active.environment) { %>
        <%- include('../../ui/Badge', { variant: envVariant[active.environment] || 'neutral', size: 'sm', children: active.environment }) %>
      <% } %>
    </span>
    <span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled shrink-0 transition-transform" data-ss-chevron>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </span>
  </button>

  <div data-ss-backdrop class="fixed inset-0 z-10 hidden" aria-hidden="true"></div>
  <ul
    data-ss-listbox
    role="listbox"
    class="absolute z-20 mt-1 w-full rounded-lg border border-border bg-surface-raised shadow-lg py-1 max-h-60 overflow-auto hidden"
  >
    <% _servers.forEach(function(server) {
      var selected = server.serverId === active.serverId;
    %>
    <li
      role="option"
      data-ss-option
      data-server-id="<%= server.serverId %>"
      data-url="<%= server.url %>"
      data-desc="<%= server.description || '' %>"
      data-env="<%= server.environment || '' %>"
      aria-selected="<%= selected ? 'true' : 'false' %>"
      class="flex items-start gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-surface-overlay transition-colors<%= selected ? ' bg-primary-subtle' : '' %>"
    >
      <div class="flex-1 min-w-0">
        <p class="font-mono text-xs text-text-primary truncate"><%= server.url %></p>
        <% if (server.description) { %>
          <p class="text-xs text-text-secondary mt-0.5 line-clamp-1"><%= server.description %></p>
        <% } %>
      </div>
      <% if (server.environment) { %>
        <span class="shrink-0 mt-0.5">
          <%- include('../../ui/Badge', { variant: envVariant[server.environment] || 'neutral', size: 'sm', children: server.environment }) %>
        </span>
      <% } %>
    </li>
    <% }); %>
  </ul>
</div>

<script>(function(){
  var root = document.getElementById('<%= _ssid %>');
  if (!root || root.dataset.ssInit === '1') return;
  root.dataset.ssInit = '1';

  var trigger  = root.querySelector('[data-ss-trigger]');
  var listbox  = root.querySelector('[data-ss-listbox]');
  var backdrop = root.querySelector('[data-ss-backdrop]');
  var chevron  = root.querySelector('[data-ss-chevron]');

  function setOpen(open) {
    if (!listbox || !backdrop || !trigger) return;
    listbox.classList.toggle('hidden', !open);
    backdrop.classList.toggle('hidden', !open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (chevron) chevron.classList.toggle('rotate-180', open);
  }

  if (trigger) trigger.addEventListener('click', function(){
    var isOpen = listbox && !listbox.classList.contains('hidden');
    setOpen(!isOpen);
  });
  if (backdrop) backdrop.addEventListener('click', function(){ setOpen(false); });

  root.querySelectorAll('[data-ss-option]').forEach(function(li){
    li.addEventListener('click', function(){
      root.querySelectorAll('[data-ss-option]').forEach(function(o){
        o.setAttribute('aria-selected', 'false');
        o.classList.remove('bg-primary-subtle');
      });
      li.setAttribute('aria-selected', 'true');
      li.classList.add('bg-primary-subtle');

      var url  = li.getAttribute('data-url')  || '';
      var urlEl  = root.querySelector('[data-ss-active-url]');
      if (urlEl)  urlEl.textContent  = url;
      setOpen(false);
    });
  });
})();</script>

```
