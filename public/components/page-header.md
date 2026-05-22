# PageHeader

- **id:** `page-header`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/PageHeader.ejs`
- **status:** stable
- **since:** 2026-05

Page title + subtitle + optional badge + action buttons. Supports 5 button variants (primary/secondary/outline/danger/ghost); rendered as a link with href or as a button.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--secondary-fg`
- `--secondary-hover`
- `--surface-overlay`
- `--text-inverse`
- `--text-primary`
- `--text-secondary`

## Variants

### With actions

```ejs
<%- include('modules/ui/PageHeader', {
  title: 'Users',
  subtitle: 'Manage your team members and their permissions.',
  badge: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info-subtle text-info border border-info">48 members</span>',
  actions: [
    { label: 'Export',        variant: 'outline' },
    { label: '+ Invite user', variant: 'primary', href: '/users/invite' },
  ]
}) %>
```

### Danger action

```ejs
<%- include('modules/ui/PageHeader', {
  title: 'Danger Zone',
  subtitle: 'Irreversible actions.',
  actions: [
    { label: 'Archive',        variant: 'outline' },
    { label: 'Delete project', variant: 'danger' },
  ]
}) %>
```

### Minimal

```ejs
<%- include('modules/ui/PageHeader', {
  title: 'Settings',
  subtitle: 'Configure your workspace preferences.'
}) %>
```

## Full EJS source

```ejs
<%
  var _title     = locals.title     || '';
  var _subtitle  = locals.subtitle  || '';
  var _badge     = locals.badge     || '';
  var _actions   = locals.actions   || [];
  var _className = locals.className || '';

  var vMap = {
    primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
    secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
    outline:   'border border-border text-text-primary hover:bg-surface-overlay',
    danger:    'bg-error text-text-inverse hover:opacity-90',
    ghost:     'bg-transparent text-text-primary hover:bg-surface-overlay',
  };
%>
<div class="flex items-start justify-between gap-4 pb-5 border-b border-border<%= _className ? ' ' + _className : '' %>">
  <div class="min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <h1 class="text-2xl font-bold text-text-primary leading-tight"><%= _title %></h1>
      <% if (_badge) { %><%- _badge %><% } %>
    </div>
    <% if (_subtitle) { %>
    <p class="text-sm text-text-secondary mt-0.5"><%= _subtitle %></p>
    <% } %>
  </div>

  <% if (_actions && _actions.length > 0) { %>
  <div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">
    <% _actions.forEach(function (action) { %>
    <%
      var actVariant = action.variant || 'primary';
      var actCls = 'inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed ' + (vMap[actVariant] || vMap.primary);
    %>
    <% if (action.href) { %>
    <a href="<%= action.href %>" class="<%= actCls %>"><%- action.label %></a>
    <% } else { %>
    <button type="button" <%= action.disabled ? 'disabled' : '' %><% if (action.onClick) { %> onclick="<%= action.onClick %>"<% } %> class="<%= actCls %>"><%- action.label %></button>
    <% } %>
    <% }); %>
  </div>
  <% } %>
</div>

```
