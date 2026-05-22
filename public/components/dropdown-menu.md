# DropdownMenu

- **id:** `dropdown-menu`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/DropdownMenu.ejs`
- **status:** stable
- **since:** 2026-05

Accessible dropdown using role="menu" + role="menuitem". Closes on Escape and outside click. Supports left/right alignment, icons, separators, danger and disabled items, and arrow-key navigation.

## Design tokens consumed

- `--border`
- `--error`
- `--error-subtle`
- `--primary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`

## Variants

### Default (left aligned)

```ejs
<%- include('modules/ui/DropdownMenu', {
  id: 'actions-menu',
  trigger: '<button>Actions</button>',
  items: [
    { label: 'View', icon: '<i class="fa-solid fa-eye"></i>' },
    { label: 'Edit', icon: '<i class="fa-solid fa-pen"></i>' },
    { label: 'Duplicate', icon: '<i class="fa-solid fa-copy"></i>' }
  ]
}) %>
```

### With separator & danger

```ejs
<%- include('modules/ui/DropdownMenu', {
  id: 'row-menu',
  align: 'right',
  trigger: '<button aria-label="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>',
  items: [
    { label: 'Open', icon: '...' },
    { label: 'Rename', icon: '...' },
    { label: 'Archive', icon: '...', disabled: true },
    { type: 'separator' },
    { label: 'Delete', icon: '...', danger: true }
  ]
}) %>
```

### With header

```ejs
<%- include('modules/ui/DropdownMenu', {
  id: 'account-menu',
  trigger: '<button>Account</button>',
  header: '<div class="px-3 py-2">...</div>',
  items: [
    { label: 'Profile', icon: '...' },
    { label: 'Settings', icon: '...' },
    { type: 'separator' },
    { label: 'Sign out', icon: '...', danger: true }
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _id        = locals.id        || 'dropdown-' + Math.random().toString(36).substr(2, 9);
  var _align     = locals.align     || 'left';
  var _items     = locals.items     || [];
  var _trigger   = locals.trigger   || '';
  var _header    = locals.header    || '';
  var _className = locals.className || '';

  var alignClass = _align === 'right' ? 'right-0' : 'left-0';
%>
<div
  id="<%= _id %>"
  class="relative inline-block<%= _className ? ' ' + _className : '' %>"
>
  <div
    id="<%= _id %>-trigger"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="<%= _id %>-menu"
    onclick="toggleDropdownMenu('<%= _id %>')"
  >
    <%- _trigger %>
  </div>
  <div
    id="<%= _id %>-menu"
    role="menu"
    aria-labelledby="<%= _id %>-trigger"
    hidden
    class="absolute z-[60] mt-1 min-w-[10rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1 <%= alignClass %>"
  >
    <% if (_header) { %>
    <div class="border-b border-border mb-1">
      <%- _header %>
    </div>
    <% } %>
    <% _items.forEach(function (item, i) { %>
      <% if (item.type === 'separator') { %>
        <div role="separator" class="my-1 border-t border-border"></div>
      <% } else {
           var isDanger   = !!item.danger;
           var isDisabled = !!item.disabled;
           var stateClass = isDanger
             ? 'text-error hover:bg-error-subtle'
             : 'text-text-primary hover:bg-surface-overlay';
           var disClass = isDisabled ? ' opacity-50 cursor-not-allowed' : '';
      %>
        <button
          role="menuitem"
          type="button"
          <% if (isDisabled) { %>disabled<% } %>
          <% if (item.onClick) { %>onclick="<%= item.onClick %>; closeDropdownMenu('<%= _id %>')"<% } else { %>onclick="closeDropdownMenu('<%= _id %>')"<% } %>
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay <%= stateClass %><%= disClass %>"
        >
          <% if (item.icon) { %><span aria-hidden="true"><%- item.icon %></span><% } %>
          <%= item.label %>
        </button>
      <% } %>
    <% }); %>
  </div>
</div>

<script>
(function () {
  function getEls(id) {
    return {
      root:    document.getElementById(id),
      trigger: document.getElementById(id + '-trigger'),
      menu:    document.getElementById(id + '-menu'),
    };
  }

  function openDropdownMenu(id) {
    var e = getEls(id);
    if (!e.root || !e.menu || !e.trigger) return;
    e.menu.hidden = false;
    e.trigger.setAttribute('aria-expanded', 'true');
    var first = e.menu.querySelector('[role="menuitem"]:not([disabled])');
    if (first) first.focus();
  }

  function closeDropdownMenu(id) {
    var e = getEls(id);
    if (!e.root || !e.menu || !e.trigger) return;
    e.menu.hidden = true;
    e.trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdownMenu(id) {
    var e = getEls(id);
    if (!e.menu) return;
    if (e.menu.hidden) openDropdownMenu(id); else closeDropdownMenu(id);
  }

  window.openDropdownMenu   = window.openDropdownMenu   || openDropdownMenu;
  window.closeDropdownMenu  = window.closeDropdownMenu  || closeDropdownMenu;
  window.toggleDropdownMenu = window.toggleDropdownMenu || toggleDropdownMenu;

  var dropdownId = '<%= _id %>';
  var root = document.getElementById(dropdownId);
  if (!root) return;

  document.addEventListener('mousedown', function (ev) {
    var menu = document.getElementById(dropdownId + '-menu');
    if (!menu || menu.hidden) return;
    if (!root.contains(ev.target)) closeDropdownMenu(dropdownId);
  });

  document.addEventListener('keydown', function (ev) {
    var menu = document.getElementById(dropdownId + '-menu');
    if (!menu || menu.hidden) return;
    if (ev.key === 'Escape') { closeDropdownMenu(dropdownId); return; }

    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      var items = Array.prototype.slice.call(menu.querySelectorAll('[role="menuitem"]:not([disabled])'));
      if (!items.length) return;
      ev.preventDefault();
      var idx = items.indexOf(document.activeElement);
      var next = ev.key === 'ArrowDown'
        ? (idx + 1) % items.length
        : (idx <= 0 ? items.length - 1 : idx - 1);
      items[next].focus();
    }
  });
})();
</script>

```
