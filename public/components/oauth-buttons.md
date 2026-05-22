# OAuthButtons

- **id:** `oauth-buttons`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/auth/OAuthButtons.ejs`
- **status:** stable
- **since:** 2025-03

Google, GitHub, Discord ve Microsoft OAuth butonları. providers dizisiyle hangi butonların gösterileceği seçilir.

## Design tokens consumed

- `--primary`
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
  var _allowed   = { GOOGLE: 1, GITHUB: 1, DISCORD: 1, MICROSOFT: 1 };
  var _providers = (locals.providers || ['GOOGLE', 'GITHUB', 'DISCORD', 'MICROSOFT']).filter(function (p) {
    return !!_allowed[String(p).toUpperCase()];
  }).map(function (p) { return String(p).toUpperCase(); });
  var _action    = locals.action    || '#';
  var _method    = locals.method    || 'post';

  var providerMeta = {
    GOOGLE:    { label: 'Continue with Google',    icon: 'fa-brands fa-google',    iconClass: 'text-[#EA4335]' },
    GITHUB:    { label: 'Continue with GitHub',    icon: 'fa-brands fa-github',    iconClass: 'text-text-primary' },
    DISCORD:   { label: 'Continue with Discord',   icon: 'fa-brands fa-discord',   iconClass: 'text-[#5865F2]' },
    MICROSOFT: { label: 'Continue with Microsoft', icon: 'fa-brands fa-microsoft', iconClass: 'text-[#00A4EF]' }
  };
%>
<div class="flex flex-col gap-2<%= locals.className ? ' ' + locals.className : '' %>">
  <% _providers.forEach(function (provider) { %>
  <% var meta = providerMeta[provider]; %>
  <form action="<%= _action %>" method="<%= _method %>">
    <input type="hidden" name="provider" value="<%= provider %>">
    <%- include('../../../ui/Button', {
      type: 'submit',
      variant: 'outline',
      fullWidth: true,
      ariaLabel: meta.label,
      iconLeft: '<span class="' + meta.iconClass + '"><i class="' + meta.icon + '" aria-hidden="true"></i></span>',
      children: meta.label
    }) %>
  </form>
  <% }); %>
</div>

```
