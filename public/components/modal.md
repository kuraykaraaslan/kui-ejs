# Modal

- **id:** `modal`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Modal.ejs`
- **status:** stable
- **since:** 2025-02

Odak kapanı dialog. Backdrop, ESC tuşu ile kapatma, ARIA labelledby/describedby ve sm/md/lg boyutu.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (md)

```ejs
<%- include('modules/ui/Modal', {
  id: 'confirm-modal',
  title: 'Confirm action',
  description: 'This action cannot be undone.',
  children: '<p>Are you sure you want to delete this item?</p>',
  footer: '<button onclick="closeModal('confirm-modal')">Cancel</button>'
}) %>

<!-- Trigger -->
<button onclick="openModal('confirm-modal')">Open modal</button>
```

### Small (sm)

```ejs
<%- include('modules/ui/Modal', {
  id: 'quick-note',
  title: 'Quick note',
  size: 'sm',
  children: '<p>A compact modal for short confirmations.</p>',
  footer: '<button onclick="closeModal('quick-note')">Got it</button>'
}) %>
```

### Large (lg)

```ejs
<%- include('modules/ui/Modal', {
  id: 'edit-profile',
  title: 'Edit profile',
  size: 'lg',
  children: '...',
  footer: '...'
}) %>
```

### No footer

```ejs
<%- include('modules/ui/Modal', {
  id: 'shortcuts',
  title: 'Keyboard shortcuts',
  description: 'Press ESC to close at any time.',
  children: '...'
}) %>
```

## Full EJS source

```ejs
<%
  var _id          = locals.id          || 'modal-' + Math.random().toString(36).substr(2, 9);
  var _title       = locals.title       || '';
  var _description = locals.description || '';
  var _open        = !!locals.open;
  var _sz          = locals.size        || 'md';
  var _fullscreen  = !!locals.fullscreen;
  var _scrollable  = !!locals.scrollable;
  var _closeOnBackdropClick = locals.closeOnBackdropClick !== false;

  var overlayClass = _open ? 'opacity-100' : 'opacity-0 pointer-events-none';
  var sc = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };
  var sizeClass = _fullscreen ? '' : (sc[_sz] || 'max-w-md');
  var titleId = _id + '-title';
  var descId  = _description ? (_id + '-desc') : '';
%>
<div
  id="<%= _id %>"
  class="fixed inset-0 z-[100] flex p-4 transition-opacity duration-200 <%= _fullscreen ? 'items-stretch justify-stretch' : 'items-center justify-center' %> <%= overlayClass %>"
  role="dialog"
  aria-modal="true"
  aria-labelledby="<%= titleId %>"
  <% if (descId) { %>aria-describedby="<%= descId %>"<% } %>
>
  <div
    class="absolute inset-0 bg-black/50"
    aria-hidden="true"
    <% if (_closeOnBackdropClick) { %>onclick="closeModal('<%= _id %>')"<% } %>
  ></div>
  <div
    id="<%= _id %>-panel"
    tabindex="-1"
    class="relative z-[101] w-full border border-border bg-surface-raised shadow-xl flex flex-col focus-visible:outline-none<%= _fullscreen ? ' rounded-none max-w-none max-h-none h-full' : ' rounded-xl ' + sizeClass %>"
  >
    <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
      <div>
        <h2 id="<%= titleId %>" class="text-base font-semibold text-text-primary"><%= _title %></h2>
        <% if (_description) { %>
        <p id="<%= descId %>" class="text-sm text-text-secondary mt-0.5"><%= _description %></p>
        <% } %>
      </div>
      <button
        type="button"
        aria-label="Close dialog"
        onclick="closeModal('<%= _id %>')"
        class="shrink-0 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
      >
        <span class="w-4 h-4 inline-flex items-center justify-center" style="font-size:1rem"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>
      </button>
    </div>
    <% if (locals.children) { %>
    <div class="px-6 py-4 flex-1<%= _scrollable ? ' overflow-y-auto' : '' %>"><%- locals.children %></div>
    <% } %>
    <% if (locals.footer) { %>
    <div class="px-6 py-4 border-t border-border flex justify-end gap-2 shrink-0"><%- locals.footer %></div>
    <% } %>
  </div>
</div>

<script>
(function () {
  var FOCUSABLE = 'button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])';

  function openModal(id) {
    var el = document.getElementById(id);
    var panel = document.getElementById(id + '-panel');
    if (!el || !panel) return;
    el.classList.remove('opacity-0', 'pointer-events-none');
    el.classList.add('opacity-100');
    var first = panel.querySelectorAll(FOCUSABLE)[0];
    if (first) first.focus(); else panel.focus();
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('opacity-0', 'pointer-events-none');
    el.classList.remove('opacity-100');
  }

  window.openModal  = window.openModal  || openModal;
  window.closeModal = window.closeModal || closeModal;

  var modalId = '<%= _id %>';
  document.addEventListener('keydown', function (e) {
    var el = document.getElementById(modalId);
    if (!el || el.classList.contains('opacity-0')) return;

    if (e.key === 'Escape') { closeModal(modalId); return; }

    if (e.key === 'Tab') {
      var panel = document.getElementById(modalId + '-panel');
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
