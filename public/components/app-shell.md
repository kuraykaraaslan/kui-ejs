# AppShell

- **id:** `app-shell`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppShell.ejs`
- **status:** stable
- **since:** 2025-03

Full-screen layout wrapper with logo, sidebar and topbar slots. Sidebar renders as an aside on desktop and opens via a drawer on mobile.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Sidebar + topbar + content

```ejs
<%- include('modules/app/AppShell', {
  logoContent:  '<span class="text-sm font-bold text-primary">Acme</span>',
  sidebarContent: '<%- include("modules/app/AppSidebar", { navGroups: navGroups, activeId: activeId, searchable: true }) %>',
  topbarContent:  '<%- include("modules/app/AppTopBar", { children: topbarHtml }) %>',
  children: bodyHtml
}) %>
```

### Sadece topbar (sidebar yok)

```ejs
<%- include('modules/app/AppShell', {
  topbarContent: '<%- include("modules/app/AppTopBar", { children: topbarHtml }) %>',
  children: bodyHtml
}) %>
```

## Full EJS source

```ejs
<%
  var _id = locals.id || ('app-shell-' + Math.random().toString(36).substr(2,6));
  var _drawerId = _id + '-mobile';
  var _hasSidebar = !!(locals.sidebarContent);
  var _hasTopbar  = !!(locals.topbarContent);
  var _title = locals.mobileSidebarTitle || 'Navigation';
  var _collapsed = !!locals.sidebarCollapsed;
  var _logoContent = (_collapsed && locals.compactLogo)
    ? locals.compactLogo
    : (locals.logoContent || locals.compactLogo || '');
  var _logoIsCompact = _collapsed && !!locals.compactLogo;
%>
<div class="flex h-screen overflow-hidden bg-surface-base<%= locals.className ? ' '+locals.className : '' %>">

  <% if (_hasSidebar) { %>
  <aside class="relative hidden lg:flex flex-col h-full min-h-0 shrink-0 border-r border-border bg-surface-raised">
    <% if (_logoContent) { %>
    <div class="absolute inset-x-0 top-0 z-10 flex items-center h-14 border-b border-border bg-surface-raised overflow-hidden <%= _logoIsCompact ? 'justify-center px-2' : 'px-4' %>">
      <%- _logoContent %>
    </div>
    <% } %>
    <div class="flex min-h-0 flex-1<%= _logoContent ? ' pt-14' : '' %>">
      <%- locals.sidebarContent %>
    </div>
  </aside>
  <% } %>

  <div class="flex flex-1 flex-col min-w-0 min-h-0">
    <% if (_hasTopbar) { %>
    <header class="sticky top-0 z-30 flex items-center h-14 px-4 border-b border-border bg-surface-raised/90 backdrop-blur shrink-0">
      <% if (_hasSidebar) { %>
      <button type="button" onclick="openDrawer('<%= _drawerId %>')"
        aria-label="Open sidebar"
        class="inline-flex lg:hidden items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
      </button>
      <% } %>
      <div class="flex min-w-0 flex-1"><%- locals.topbarContent %></div>
    </header>
    <% } %>
    <main id="main-content" class="flex-1 overflow-y-auto p-4 sm:p-6">
      <%- locals.children || '' %>
    </main>
  </div>

  <% if (_hasSidebar) { %>
  <%- include('../ui/Drawer', { id: _drawerId, title: _title, side: 'left', open: false, className: '!w-72', children: locals.sidebarContent || '' }) %>
  <% } %>
</div>

```
