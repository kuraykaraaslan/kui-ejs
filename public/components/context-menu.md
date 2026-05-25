# ContextMenu

- **id:** `context-menu`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ContextMenu.ejs`
- **status:** stable
- **since:** 2026-05

Right-click context menu. Wraps any element as a trigger. Supports item groups, keyboard shortcuts, separators, danger items, and disabled items. Positions itself via viewport-aware boundary detection, auto-flips when near screen edges. Full keyboard navigation: ↑↓ arrows, Enter, Escape.

## Design tokens consumed

- `--border`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Text editor — clipboard + format actions

```ejs
<%- include('modules/app/ContextMenu', {
  children: '<div class="p-8 text-center text-sm text-text-secondary border-2 border-dashed border-border rounded-xl">Right-click anywhere in this area</div>',
  items: [
    { label: 'Cut',       icon: '<i class="fa-solid fa-scissors text-xs"></i>', shortcut: '⌘X' },
    { label: 'Copy',      icon: '<i class="fa-solid fa-copy    text-xs"></i>', shortcut: '⌘C' },
    { label: 'Paste',     icon: '<i class="fa-solid fa-paste   text-xs"></i>', shortcut: '⌘V' },
    { type: 'separator' },
    { label: 'Copy link', icon: '<i class="fa-solid fa-link    text-xs"></i>', shortcut: '⌘⇧C' },
    { type: 'separator' },
    { label: 'Rename',    icon: '<i class="fa-solid fa-pen     text-xs"></i>' },
    { label: 'Delete',    icon: '<i class="fa-solid fa-trash   text-xs"></i>', shortcut: '⌫', danger: true },
  ]
}) %>
```

### File manager — groups + shortcut hint

```ejs
<%- include('modules/app/ContextMenu', {
  children: fileGridHtml,
  items: [
    { type: 'group', label: 'Actions' },
    { label: 'Open',     icon: '<i class="fa-solid fa-eye         text-xs"></i>' },
    { label: 'Download', icon: '<i class="fa-solid fa-download    text-xs"></i>', shortcut: '⌘D' },
    { label: 'Share',    icon: '<i class="fa-solid fa-share-nodes text-xs"></i>', shortcut: '⌘⇧S' },
    { type: 'separator' },
    { type: 'group', label: 'Organise' },
    { label: 'Move to…', icon: '<i class="fa-solid fa-arrow-right text-xs"></i>' },
    { label: 'Add tag',  icon: '<i class="fa-solid fa-tag         text-xs"></i>' },
    { type: 'separator' },
    { label: 'Delete',   icon: '<i class="fa-solid fa-trash       text-xs"></i>', danger: true },
  ]
}) %>
```

### Code branch — some items disabled

```ejs
<%- include('modules/app/ContextMenu', {
  children: branchRowHtml,
  items: [
    { label: 'View diff',        icon: '<i class="fa-solid fa-code-branch  text-xs"></i>' },
    { label: 'Copy branch name', icon: '<i class="fa-solid fa-copy         text-xs"></i>', shortcut: '⌘C' },
    { type: 'separator' },
    { label: 'Merge into main',  icon: '<i class="fa-solid fa-arrow-right  text-xs"></i>', disabled: true },
    { label: 'Cherry-pick',                                                                 disabled: true },
    { type: 'separator' },
    { label: 'Delete branch',    icon: '<i class="fa-solid fa-trash        text-xs"></i>', danger: true },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _id       = locals.id       || 'ctx-' + Math.random().toString(36).substr(2, 9);
  var _items    = locals.items    || [];
  var _disabled = !!locals.disabled;
  var _class    = locals.className || '';
%>
<div
  id="<%= _id %>-wrap"
  class="<%= _class %>"
  oncontextmenu="<%= _disabled ? 'return false' : "openContextMenu('" + _id + "', event); return false;" %>"
>
  <%- locals.children || '' %>
</div>

<div
  id="<%= _id %>"
  role="menu"
  aria-label="Context menu"
  style="position:fixed;z-index:9999;display:none;min-width:13rem"
  class="rounded-xl border border-border bg-surface-raised shadow-2xl py-1.5 outline-none"
>
  <% _items.forEach(function(item) { %>
    <% if (item.type === 'separator') { %>
      <div role="separator" aria-orientation="horizontal" class="my-1 mx-2 border-t border-border"></div>

    <% } else if (item.type === 'group') { %>
      <p role="presentation" class="px-3 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-widest text-text-disabled select-none">
        <%= item.label %>
      </p>

    <% } else {
         var _isDanger   = !!item.danger;
         var _isDisabled = !!item.disabled;
         var _colorClass = _isDanger
           ? 'text-error hover:bg-error-subtle focus-visible:bg-error-subtle'
           : 'text-text-primary hover:bg-surface-overlay focus-visible:bg-surface-overlay';
         var _iconColor  = _isDanger ? 'text-error' : 'text-text-secondary';
    %>
      <button
        type="button"
        role="menuitem"
        tabindex="-1"
        <% if (_isDisabled) { %>disabled aria-disabled="true"<% } %>
        <% if (!_isDisabled && item.onClick) { %>onclick="(function(){ <%= item.onClick %> })(); closeContextMenu('<%= _id %>')"<% } else if (!_isDisabled) { %>onclick="closeContextMenu('<%= _id %>')"<% } %>
        class="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors select-none focus-visible:outline-none <%= _colorClass %><%= _isDisabled ? ' opacity-40 cursor-not-allowed pointer-events-none' : '' %>"
      >
        <% if (item.icon) { %>
          <span aria-hidden="true" class="w-4 flex items-center justify-center shrink-0 <%= _iconColor %>">
            <%- item.icon %>
          </span>
        <% } %>
        <span class="flex-1 truncate"><%= item.label %></span>
        <% if (item.shortcut) { %>
          <kbd class="shrink-0 ml-6 text-[11px] font-mono text-text-disabled"><%= item.shortcut %></kbd>
        <% } %>
      </button>
    <% } %>
  <% }); %>
</div>

<script>
(function () {
  /* ── One-time global setup ─────────────────────────────────────────────── */
  if (!window._kuiCtx) {
    window._kuiCtx = { active: null };

    document.addEventListener('mousedown', function (e) {
      var id = window._kuiCtx.active;
      if (!id) return;
      var menu = document.getElementById(id);
      if (menu && !menu.contains(e.target)) window.closeContextMenu(id);
    });

    window.addEventListener('scroll', function () {
      if (window._kuiCtx.active) window.closeContextMenu(window._kuiCtx.active);
    }, { capture: true, passive: true });

    document.addEventListener('keydown', function (e) {
      var id = window._kuiCtx.active;
      if (!id) return;
      var menu = document.getElementById(id);
      if (!menu || menu.style.display === 'none') return;

      if (e.key === 'Escape') { e.preventDefault(); window.closeContextMenu(id); return; }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var focusable = Array.from(menu.querySelectorAll('[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'));
        if (!focusable.length) return;
        var idx  = focusable.indexOf(document.activeElement);
        var next = e.key === 'ArrowDown'
          ? (idx + 1) % focusable.length
          : (idx <= 0 ? focusable.length - 1 : idx - 1);
        focusable[next].focus();
      }
    });

    window.openContextMenu = function (id, event) {
      if (window._kuiCtx.active && window._kuiCtx.active !== id) {
        window.closeContextMenu(window._kuiCtx.active);
      }
      var menu = document.getElementById(id);
      if (!menu) return false;

      /* Measure off-screen before final placement */
      menu.style.visibility = 'hidden';
      menu.style.display    = 'block';
      var mw  = menu.offsetWidth;
      var mh  = menu.offsetHeight;
      var vw  = window.innerWidth;
      var vh  = window.innerHeight;
      var GAP = 8;
      var x   = (event.clientX + mw > vw - GAP) ? Math.max(GAP, event.clientX - mw) : event.clientX;
      var y   = (event.clientY + mh > vh - GAP) ? Math.max(GAP, event.clientY - mh) : event.clientY;
      menu.style.left       = x + 'px';
      menu.style.top        = y + 'px';
      menu.style.visibility = 'visible';

      window._kuiCtx.active = id;
      var first = menu.querySelector('[role="menuitem"]:not([disabled]):not([aria-disabled="true"])');
      if (first) first.focus();
      return false;
    };

    window.closeContextMenu = function (id) {
      var menu = document.getElementById(id);
      if (menu) menu.style.display = 'none';
      if (window._kuiCtx.active === id) window._kuiCtx.active = null;
    };
  }
})();
</script>

```
