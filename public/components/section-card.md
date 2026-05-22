# SectionCard

- **id:** `section-card`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/SectionCard.ejs`
- **status:** stable
- **since:** 2026-05

Titled content card with rounded-xl + border + bg-surface-raised + p-6. Header is separated by an underline; children slot accepts arbitrary content.

## Design tokens consumed

- `--border`
- `--primary`
- `--surface-raised`
- `--text-primary`

## Variants

### Basic — title + content

```ejs
<%- include('modules/app/SectionCard', {
  title: 'Account details',
  children: `
    <div class="space-y-2 text-sm text-text-secondary">
      <p><span class="text-text-primary font-medium">Name:</span> <%= user.name %></p>
      <p><span class="text-text-primary font-medium">Email:</span> <%= user.email %></p>
      <p><span class="text-text-primary font-medium">Role:</span> <%= user.role %></p>
    </div>
  `
}) %>
```

### Form section

```ejs
<%- include('modules/app/SectionCard', {
  title: 'Notification preferences',
  children: `
    <div class="space-y-3">
      <%- include('modules/ui/Toggle', { label: 'Email updates',      checked: prefs.email }) %>
      <%- include('modules/ui/Toggle', { label: 'Push notifications', checked: prefs.push  }) %>
      <%- include('modules/ui/Toggle', { label: 'Weekly digest',      checked: prefs.weekly }) %>
    </div>
  `
}) %>
```

## Full EJS source

```ejs
<%
  var _title     = locals.title     || '';
  var _className = locals.className || '';
%>
<div class="rounded-xl border border-border bg-surface-raised p-6 space-y-4<%= _className ? ' ' + _className : '' %>">
  <h3 class="text-sm font-semibold text-text-primary border-b border-border pb-3"><%= _title %></h3>
  <%- locals.children || '' %>
</div>

```
