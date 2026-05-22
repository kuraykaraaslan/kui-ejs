# AuthSchemeCard

- **id:** `api-doc-auth-scheme-card`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/AuthSchemeCard.ejs`
- **status:** stable
- **since:** 2026-05

Selectable card describing a single auth scheme (apiKey, http, oauth2, openIdConnect, mutualTLS).

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### OAuth 2.0 recommended scheme

```ejs
<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'OAuth 2.0',
  type: 'oauth2',
  recommended: true,
  description: 'Authorization Code flow with PKCE — preferred for user-facing apps.',
  metaItems: [
    { label: 'Client ID', value: 'prod_client_42' },
    { label: 'Scopes',    value: 'read write' },
  ],
  href: '/auth/oauth2'
}) %>
```

### API Key static scheme

```ejs
<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'X-API-Key',
  type: 'apiKey',
  description: 'Static header-based key for server-to-server integrations.'
}) %>
```

## Full EJS source

```ejs
<%
  var _name        = locals.name        || '';
  var _type        = locals.type        || 'apiKey';
  var _description = locals.description || null;
  var _recommended = !!locals.recommended;
  var _metaItems   = locals.metaItems   || null;
  var _href        = locals.href        || null;
  var _onSelect    = !!locals.onSelect;
  var _className   = locals.className   || '';

  var schemeIcon = {
    apiKey:        'fa-solid fa-key',
    http:          'fa-solid fa-lock',
    oauth2:        'fa-solid fa-shield',
    openIdConnect: 'fa-solid fa-fingerprint',
    mutualTLS:     'fa-solid fa-user-shield',
  };

  var iconClass = schemeIcon[_type] || schemeIcon.apiKey;
  var interactive = !!(_href || _onSelect);

  var baseClass = 'block rounded-xl border border-border bg-surface-raised p-4 text-left'
    + (interactive ? ' transition-shadow hover:shadow-md hover:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus' : '')
    + (_className ? ' ' + _className : '');
%>
<% if (_href) { %>
<a href="<%= _href %>" class="<%= baseClass %>">
<% } else if (_onSelect) { %>
<button type="button" class="<%= baseClass %> w-full">
<% } else { %>
<div class="<%= baseClass %>">
<% } %>

  <div class="flex items-start justify-between gap-3">
    <div class="flex items-start gap-3 min-w-0">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
        <span class="w-4 h-4 inline-flex items-center justify-center">
          <i class="<%= iconClass %>" aria-hidden="true"></i>
        </span>
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-text-primary truncate"><%= _name %></p>
        <div class="mt-1 flex flex-wrap items-center gap-1.5">
          <%- include('./SecuritySchemeBadge', { type: _type, size: 'sm' }) %>
          <% if (_recommended) { %>
          <%- include('../../ui/Badge', { variant: 'success', size: 'sm', children: 'Recommended' }) %>
          <% } %>
        </div>
      </div>
    </div>
    <% if (interactive) { %>
    <i class="fa-solid fa-arrow-right text-[13px] text-text-disabled mt-1" aria-hidden="true"></i>
    <% } %>
  </div>

  <% if (_description) { %>
  <p class="mt-3 text-sm text-text-secondary leading-relaxed"><%= _description %></p>
  <% } %>

  <% if (_metaItems && _metaItems.length > 0) { %>
  <dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
    <% _metaItems.forEach(function(item) { %>
    <div>
      <dt class="text-[10px] uppercase tracking-wider text-text-disabled"><%= item.label %></dt>
      <dd class="text-xs text-text-primary font-mono break-words"><%- item.value %></dd>
    </div>
    <% }); %>
  </dl>
  <% } %>

<% if (_href) { %>
</a>
<% } else if (_onSelect) { %>
</button>
<% } else { %>
</div>
<% } %>

```
