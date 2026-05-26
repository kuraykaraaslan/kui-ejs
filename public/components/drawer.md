# Drawer

- **id:** `drawer`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Drawer.ejs`
- **status:** stable
- **since:** 2025-02

Side panel sliding in from the screen edge. Left / right placement with focus management and Escape close.

## Variants

### Right drawer

```ejs
<!-- Trigger -->
<button onclick="openDrawer('notif-drawer')">Notifications</button>

<%- include('modules/ui/Drawer', {
  id: 'notif-drawer',
  title: 'Notifications',
  side: 'right',
  children: '...'
}) %>
```

### Left drawer

```ejs
<%- include('modules/ui/Drawer', {
  id: 'nav-drawer',
  title: 'Navigation',
  side: 'left',
  children: '...'
}) %>
```

### With footer

```ejs
<%- include('modules/ui/Drawer', {
  id: 'edit-drawer',
  title: 'Edit item',
  children: '...',
  footer: '<div class="flex gap-2 justify-end">...</div>'
}) %>
```

## Full EJS source

```ejs
<%- include('./Overlays/Drawer/Drawer', locals) %>

```
