# OAuthButtons

- **id:** `oauth-buttons`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/OAuthButtons.ejs`
- **status:** stable
- **since:** 0.1

Google, GitHub, Discord ve Microsoft OAuth butonları. providers dizisiyle hangi butonların gösterileceği seçilir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--surface-overlay`
- `--text-primary`

## Variants

### All providers

```ejs
<%- include('modules/domain/common/auth/OAuthButtons', {
  action: '/auth/oauth',
  providers: ['google', 'github', 'discord', 'microsoft']
}) %>
```

### Google + GitHub only

```ejs
<%- include('modules/domain/common/auth/OAuthButtons', {
  action: '/auth/oauth',
  providers: ['google', 'github']
}) %>
```

## Full EJS source

```ejs
<%
  var _providers = locals.providers || ['google', 'github', 'discord', 'microsoft'];
  var _action    = locals.action    || '#';
  var _method    = locals.method    || 'post';

  var providerMeta = {
    google:    { label: 'Continue with Google',    icon: 'fa-brands fa-google',    iconColor: 'text-[#EA4335]' },
    github:    { label: 'Continue with GitHub',    icon: 'fa-brands fa-github',    iconColor: 'text-text-primary' },
    discord:   { label: 'Continue with Discord',   icon: 'fa-brands fa-discord',   iconColor: 'text-[#5865F2]' },
    microsoft: { label: 'Continue with Microsoft', icon: 'fa-brands fa-microsoft', iconColor: 'text-[#00A4EF]' },
  };
%>
<div class="flex flex-col gap-2<%= locals.className ? ' ' + locals.className : '' %>">
  <% _providers.forEach(function (provider) { %>
  <%
    var meta = providerMeta[provider] || { label: 'Continue with ' + provider, icon: 'fa-brands fa-' + provider, iconColor: 'text-text-primary' };
  %>
  <form action="<%= _action %>" method="<%= _method %>">
    <input type="hidden" name="provider" value="<%= provider %>">
    <button type="submit"
      class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">
      <i class="<%= meta.icon %> <%= meta.iconColor %>" aria-hidden="true"></i>
      <%= meta.label %>
    </button>
  </form>
  <% }); %>
</div>

```
