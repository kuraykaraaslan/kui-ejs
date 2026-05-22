# Form

- **id:** `form`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Form.ejs`
- **status:** stable
- **since:** 2025-03

Form layout wrapper with title, description, error and actions slots. `columns` prop renders fields in a 1 or 2 column grid.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Single column

```ejs
<%- include('modules/app/Form', {
  title:       'Edit Profile',
  description: 'Update your personal information.',
  action:      '/account/profile',
  actionsContent: `
    <%- include('modules/ui/Button', { variant: 'outline', children: 'Cancel', href: '/account' }) %>
    <%- include('modules/ui/Button', { type: 'submit', children: 'Save changes' }) %>
  `,
  children: `
    <%- include('modules/ui/Input',    { label: 'Name',  name: 'name',  value: user.name }) %>
    <%- include('modules/ui/Input',    { label: 'Email', name: 'email', type: 'email', value: user.email }) %>
    <%- include('modules/ui/Textarea', { label: 'Bio',   name: 'bio',   value: user.bio }) %>
  `
}) %>
```

### Two column

```ejs
<%- include('modules/app/Form', {
  title:   'Personal Details',
  columns: 2,
  action:  '/account/details',
  actionsContent: `<%- include('modules/ui/Button', { type: 'submit', children: 'Save' }) %>`,
  children: `
    <%- include('modules/ui/Input', { label: 'First Name', name: 'firstName' }) %>
    <%- include('modules/ui/Input', { label: 'Last Name',  name: 'lastName'  }) %>
    <%- include('modules/ui/Input', { label: 'Email',      name: 'email', type: 'email' }) %>
    <%- include('modules/ui/Input', { label: 'Phone',      name: 'phone', type: 'tel' }) %>
  `
}) %>
```

## Full EJS source

```ejs
<%
  var _action  = locals.action  || '#';
  var _method  = locals.method  || 'post';
  var _columns = locals.columns || 1;
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-6<%= locals.className ? ' '+locals.className : '' %>">
  <% if (locals.title || locals.description) { %>
  <div>
    <% if (locals.title) { %><h2 class="text-lg font-semibold text-text-primary"><%= locals.title %></h2><% } %>
    <% if (locals.description) { %><p class="text-sm text-text-secondary mt-0.5"><%= locals.description %></p><% } %>
  </div>
  <% } %>

  <% if (locals.error) { %>
  <%- include('../ui/AlertBanner', { variant: 'error', message: locals.error }) %>
  <% } %>

  <div class="grid gap-4<%= _columns === 2 ? ' sm:grid-cols-2' : ' grid-cols-1' %>">
    <%- locals.children || '' %>
  </div>

  <% if (locals.actionsContent) { %>
  <div class="flex items-center justify-end gap-3 pt-2 border-t border-border">
    <%- locals.actionsContent %>
  </div>
  <% } %>
</form>

```
