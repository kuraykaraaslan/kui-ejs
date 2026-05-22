# AppTopBar

- **id:** `app-top-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppTopBar.ejs`
- **status:** stable
- **since:** 2025-03

AppShell'in header slotuna geçilen üst çubuk wrapper'ı. logoContent slotu sol tarafa; children sağ tarafa flex satırda sıralanır.

## Variants

### Arama + actions + kullanıcı

```ejs
<%- include('modules/app/AppTopBar', {
  children: `
    <%- include('modules/app/GlobalSearch', { placeholder: 'Search everything…' }) %>
    <button class="p-1.5 rounded-md text-text-secondary hover:bg-surface-overlay">
      <i class="fa-solid fa-bell" aria-hidden="true"></i>
    </button>
    <%- include('modules/domain/common/user/UserMenu', { name: user.name, role: user.role }) %>
  `
}) %>
```

### Logo + action + kullanıcı

```ejs
<%- include('modules/app/AppTopBar', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme Dashboard</span>',
  children: `
    <div class="flex-1"></div>
    <%- include('modules/ui/Button', { children: 'New', iconLeft: '<i class="fa-solid fa-plus"></i>' }) %>
    <%- include('modules/domain/common/user/UserMenu', { name: user.name }) %>
  `
}) %>
```

## Full EJS source

```ejs
<div class="flex items-center gap-3 flex-1<%= locals.className ? ' '+locals.className : '' %>">
  <% if (locals.logoContent) { %>
  <div class="shrink-0"><%- locals.logoContent %></div>
  <% } %>
  <%- locals.children || '' %>
</div>

```
