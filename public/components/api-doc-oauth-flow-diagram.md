# OAuthFlowDiagram

- **id:** `api-doc-oauth-flow-diagram`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/OAuthFlowDiagram.ejs`
- **status:** stable
- **since:** 2026-05

OAuth 2.0 akışını görsel olarak özetler: User → Your App → Auth Server hattı, akış türüne özel numaralı adım listesi, endpoint URL'leri (authorize / token / refresh) ve mevcut scope tanımları.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-base`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Authorization Code flow

```ejs
<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'authorizationCode',
  authorizationUrl: 'https://auth.example.com/authorize',
  tokenUrl:         'https://auth.example.com/token',
  scopes: [
    { name: 'read',  description: 'Read access' },
    { name: 'write', description: 'Write access' },
  ]
}) %>
```

### Client Credentials flow

```ejs
<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'clientCredentials',
  tokenUrl: 'https://auth.example.com/token'
}) %>
```

## Full EJS source

```ejs
<%
  var _flow             = locals.flow             || 'authorizationCode';
  var _authorizationUrl = locals.authorizationUrl || null;
  var _tokenUrl         = locals.tokenUrl         || null;
  var _refreshUrl       = locals.refreshUrl       || null;
  var _scopes           = locals.scopes           || null;
  var _className        = locals.className        || '';

  var flowLabel = {
    authorizationCode: 'Authorization Code',
    implicit:          'Implicit',
    password:          'Password',
    clientCredentials: 'Client Credentials',
  };

  var flowSteps = {
    authorizationCode: [
      'User clicks "Sign in"',
      'Redirect to /authorize',
      'User grants consent',
      'Code returned to app',
      'Exchange code for token',
    ],
    implicit: [
      'User clicks "Sign in"',
      'Redirect to /authorize',
      'Token returned in URL fragment',
    ],
    password: [
      'App collects username + password',
      'POST credentials to /token',
      'Access token returned',
    ],
    clientCredentials: [
      'App authenticates with client ID + secret',
      'POST to /token',
      'Access token returned',
    ],
  };

  var steps = flowSteps[_flow] || [];
  var label = flowLabel[_flow] || _flow;
  var hasEndpoints = !!(_authorizationUrl || _tokenUrl || _refreshUrl);
%>
<div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4<%= _className ? ' ' + _className : '' %>">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider text-text-disabled">OAuth 2.0 Flow</p>
      <p class="text-base font-semibold text-text-primary mt-0.5"><%= label %></p>
    </div>
    <span class="inline-flex items-center gap-1 rounded-full font-medium px-1.5 py-0 text-[10px] bg-primary-subtle text-primary">
      <span class="w-3 h-3 inline-flex items-center justify-center">
        <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
      </span>
      <%= _flow %>
    </span>
  </div>

  <div class="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
    <div class="flex flex-col items-center gap-1 min-w-0">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <i class="fa-solid fa-user text-[13px]" aria-hidden="true"></i>
      </span>
      <span class="text-[10px] font-medium text-text-secondary truncate">User</span>
    </div>
    <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
    <div class="flex flex-col items-center gap-1 min-w-0">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <i class="fa-solid fa-server text-[13px]" aria-hidden="true"></i>
      </span>
      <span class="text-[10px] font-medium text-text-secondary truncate">Your App</span>
    </div>
    <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
    <div class="flex flex-col items-center gap-1 min-w-0">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <i class="fa-solid fa-shield-halved text-[13px]" aria-hidden="true"></i>
      </span>
      <span class="text-[10px] font-medium text-text-secondary truncate">Auth Server</span>
    </div>
  </div>

  <ol class="space-y-1.5">
    <% steps.forEach(function(step, i) { %>
    <li class="flex items-start gap-2 text-sm text-text-primary">
      <span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">
        <%= i + 1 %>
      </span>
      <span><%= step %></span>
    </li>
    <% }); %>
  </ol>

  <% if (hasEndpoints) { %>
  <dl class="border-t border-border pt-3 space-y-1.5">
    <% if (_authorizationUrl) { %>
    <div class="flex items-baseline gap-2">
      <dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Authorization URL</dt>
      <dd class="font-mono text-xs text-text-primary break-all"><%= _authorizationUrl %></dd>
    </div>
    <% } %>
    <% if (_tokenUrl) { %>
    <div class="flex items-baseline gap-2">
      <dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Token URL</dt>
      <dd class="font-mono text-xs text-text-primary break-all"><%= _tokenUrl %></dd>
    </div>
    <% } %>
    <% if (_refreshUrl) { %>
    <div class="flex items-baseline gap-2">
      <dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Refresh URL</dt>
      <dd class="font-mono text-xs text-text-primary break-all"><%= _refreshUrl %></dd>
    </div>
    <% } %>
  </dl>
  <% } %>

  <% if (_scopes && _scopes.length > 0) { %>
  <div class="border-t border-border pt-3">
    <p class="text-[10px] uppercase tracking-wider text-text-disabled mb-2">Available scopes</p>
    <ul class="space-y-1">
      <% _scopes.forEach(function(s) { %>
      <li class="flex items-start gap-2 text-xs">
        <i class="fa-solid fa-circle-check text-[11px] text-success mt-0.5 shrink-0" aria-hidden="true"></i>
        <div class="min-w-0">
          <code class="font-mono text-text-primary font-semibold"><%= s.name %></code>
          <% if (s.description) { %><span class="text-text-secondary"> &mdash; <%= s.description %></span><% } %>
        </div>
      </li>
      <% }); %>
    </ul>
  </div>
  <% } %>
</div>

```
