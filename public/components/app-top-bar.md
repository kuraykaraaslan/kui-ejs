# AppTopBar

- **id:** `app-top-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppTopBar.ejs`
- **status:** stable
- **since:** 2025-03

Top bar wrapper passed into AppShell's header slot. The logo slot anchors the left side while children (GlobalSearch, UserMenu, Button, etc.) are arranged in a flex row. Named regions start (after the logo) and end (pushed to the far end) take HTML or ordered { id, node, order, hidden } items, for controls other modules contribute.

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

### Regions: start + ordered end items

```ejs
<%# Contributed controls arrive as ordered items; hidden ones are left out. %>
<%- include('modules/app/AppTopBar', {
  logoContent: logoHtml,
  start: environmentBadgeHtml,
  end: [
    { id: 'notifications', order: 10, node: bellHtml },
    { id: 'calls', order: 20, node: presenceHtml, hidden: !telephonyEnabled },
    { id: 'user', order: 100, node: userMenuHtml },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  // Regions (parity with kui-react AppTopBar): `start` sits right after the logo, `end` is
  // pushed to the far end. Each takes an HTML string or ordered { id, node (HTML), order,
  // hidden } items (like CSS order: missing is 0, ties keep array order), so top-bar
  // controls can come from other modules. No region wrapper is rendered when unused.
  var _region = function (region) {
    if (!region) return '';
    if (!Array.isArray(region)) return String(region);
    return region
      .map(function (it, i) { return { it: it, i: i, o: (typeof it.order === 'number' && isFinite(it.order)) ? it.order : 0 }; })
      .filter(function (e) { return e.it && !e.it.hidden; })
      .sort(function (a, b) { return a.o - b.o || a.i - b.i; })
      .map(function (e) { return e.it.node || ''; })
      .join('');
  };
  var _start = _region(locals.start);
  var _end   = _region(locals.end);
%>
<div class="flex items-center gap-3 flex-1<%= locals.className ? ' '+locals.className : '' %>">
  <% if (locals.logoContent) { %>
  <div class="shrink-0"><%- locals.logoContent %></div>
  <% } %>
  <% if (_start) { %><div data-region="start" class="flex items-center gap-2"><%- _start %></div><% } %>
  <%- locals.children || '' %>
  <% if (_end) { %><div data-region="end" class="flex items-center gap-2 ml-auto shrink-0"><%- _end %></div><% } %>
</div>

```
