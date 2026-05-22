# Drawer

- **id:** `drawer`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Drawer.ejs`
- **status:** stable
- **since:** 2025-02

Kenar paneli. left/right açılım, backdrop, ESC ve tabindex=-1 odak yönetimi ile birlikte gelir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`

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
<%
var _id    = locals.id    || 'drawer-' + Math.random().toString(36).substr(2, 9);
var _title = locals.title || '';
var _side  = locals.side  || 'right';
var _open  = locals.open  || false;

var wrapperPointer = _open ? '' : 'pointer-events-none';
var backdropOpacity = _open ? 'opacity-100' : 'opacity-0';

var panelBase = 'relative z-[101] flex flex-col w-80 max-w-full h-full bg-surface-raised border-border shadow-xl transition-transform duration-200 focus-visible:outline-none';
var panelSide = _side === 'right'
  ? 'ml-auto border-l'
  : 'mr-auto border-r';
var panelTranslate = _open
  ? 'translate-x-0'
  : (_side === 'right' ? 'translate-x-full' : '-translate-x-full');
%>

<div
  id="<%= _id %>"
  class="fixed inset-0 z-[100] flex <%= wrapperPointer %>"
  role="dialog"
  aria-modal="true"
  aria-label="<%= _title %>"
>
  <!-- Backdrop -->
  <div
    id="<%= _id %>-backdrop"
    class="absolute inset-0 bg-black/50 transition-opacity duration-200 <%= backdropOpacity %>"
    aria-hidden="true"
    onclick="closeDrawer('<%= _id %>')"
  ></div>

  <!-- Panel -->
  <div
    id="<%= _id %>-panel"
    tabindex="-1"
    class="<%= panelBase %> <%= panelSide %> <%= panelTranslate %><%= locals.className ? ' ' + locals.className : '' %>"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 px-4 py-4 border-b border-border shrink-0">
      <h2 class="text-base font-semibold text-text-primary"><%= _title %></h2>
      <button
        type="button"
        aria-label="Close drawer"
        onclick="closeDrawer('<%= _id %>')"
        class="text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
      >
        <span class="w-4 h-4 inline-flex items-center justify-center" style="font-size:1rem"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>
      </button>
    </div>

    <!-- Body -->
    <div class="flex-1 min-h-0 overflow-y-auto px-4 py-4">
      <%- locals.children || '' %>
    </div>

    <% if (locals.footer) { %>
    <!-- Footer -->
    <div class="px-4 py-4 border-t border-border shrink-0">
      <%- locals.footer %>
    </div>
    <% } %>
  </div>
</div>

<script>
(function () {
  var FOCUSABLE = 'button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])';
  var drawerId = '<%= _id %>';

  function openDrawer(id) {
    var el       = document.getElementById(id);
    var backdrop = document.getElementById(id + '-backdrop');
    var panel    = document.getElementById(id + '-panel');
    if (!el || !panel) return;
    el.classList.remove('pointer-events-none');
    if (backdrop) { backdrop.classList.remove('opacity-0'); backdrop.classList.add('opacity-100'); }
    panel.classList.remove('translate-x-full', '-translate-x-full');
    panel.classList.add('translate-x-0');
    var first = panel.querySelectorAll(FOCUSABLE)[0];
    if (first) first.focus(); else panel.focus();
  }

  function closeDrawer(id) {
    var el       = document.getElementById(id);
    var backdrop = document.getElementById(id + '-backdrop');
    var panel    = document.getElementById(id + '-panel');
    if (!el || !panel) return;
    var isRight = panel.classList.contains('ml-auto');
    el.classList.add('pointer-events-none');
    if (backdrop) { backdrop.classList.add('opacity-0'); backdrop.classList.remove('opacity-100'); }
    panel.classList.remove('translate-x-0');
    panel.classList.add(isRight ? 'translate-x-full' : '-translate-x-full');
  }

  window.openDrawer  = window.openDrawer  || openDrawer;
  window.closeDrawer = window.closeDrawer || closeDrawer;

  document.addEventListener('keydown', function (e) {
    var el = document.getElementById(drawerId);
    if (!el || el.classList.contains('pointer-events-none')) return;

    if (e.key === 'Escape') { closeDrawer(drawerId); return; }

    if (e.key === 'Tab') {
      var panel = document.getElementById(drawerId + '-panel');
      if (!panel) return;
      var focusable = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  });
})();
</script>

```
