# AppCommandBar

- **id:** `app-command-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppCommandBar.ejs`
- **status:** beta
- **since:** 2025-04

Keyboard-first command palette. Opens with ⌘K; an items prop accepts custom commands while a default navigation/actions/recent set is included.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--info`
- `--info-fg`
- `--info-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Varsayılan komutlar (açık panel)

```ejs
<%- include('modules/app/AppCommandBar') %>
```

### Özel items + trigger butonu

```ejs
<%- include('modules/app/AppCommandBar', {
  placeholder: 'Search commands…',
  items: [
    { icon: 'fa-solid fa-basket-shopping', label: 'View Orders',   shortcut: 'G O', category: 'Navigation', href: '/orders' },
    { icon: 'fa-solid fa-box',             label: 'Inventory',     shortcut: 'G I', category: 'Navigation', href: '/inventory' },
    { icon: 'fa-solid fa-tag',             label: 'New Sale',      shortcut: 'C N', category: 'Actions' },
    { icon: 'fa-solid fa-file-export',     label: 'Export Report', shortcut: 'C E', category: 'Actions' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Order #1042',      category: 'Recent', href: '/orders/1042' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Customer: Acme Co', category: 'Recent', href: '/customers/acme' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _id       = locals.id       || 'cmd-bar-' + Math.random().toString(36).substr(2, 9);
  var _items    = locals.items    || [];
  var _placeholder = locals.placeholder || 'Type a command or search…';

  // Defaults: 5 Navigation + 4 Actions + 3 Recent = 12 items.
  // NOTE: Recent items use `faClock` (fa-clock), NOT fa-clock-rotate-left.
  var defaultItems = [
    { icon: 'fa-solid fa-house',        label: 'Go to Dashboard',  shortcut: 'G D', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-folder',       label: 'Go to Projects',   shortcut: 'G P', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-users',        label: 'Go to Team',       shortcut: 'G T', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-gear',         label: 'Go to Settings',   shortcut: 'G S', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-chart-bar',    label: 'Go to Analytics',  shortcut: 'G A', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-plus',         label: 'New Project',      shortcut: '⌘N',  category: 'Actions' },
    { icon: 'fa-solid fa-envelope',     label: 'Send Invite',      shortcut: '⌘I',  category: 'Actions' },
    { icon: 'fa-solid fa-file-export',  label: 'Export Data',      shortcut: '⌘E',  category: 'Actions' },
    { icon: 'fa-solid fa-lock',         label: 'Lock Screen',      shortcut: '⌘L',  category: 'Actions' },
    { icon: 'fa-solid fa-clock',        label: 'Project Alpha',    category: 'Recent' },
    { icon: 'fa-solid fa-clock',        label: 'Q3 Report',        category: 'Recent' },
    { icon: 'fa-solid fa-clock',        label: 'Design Review',    category: 'Recent' }
  ];

  var _allItems = _items.length ? _items : defaultItems;

  var categories = [];
  _allItems.forEach(function(item) {
    if (categories.indexOf(item.category) === -1) categories.push(item.category);
  });

  // Badge-equivalent class output (neutral, sm)
  var _badgeNeutralSm = 'inline-flex items-center gap-1 rounded-full font-medium bg-surface-sunken text-text-secondary px-1.5 py-0 text-[10px]';
%>
<!-- AppCommandBar Trigger -->
<% if (locals.trigger) { %>
  <span data-cmd-trigger="<%= _id %>"><%- locals.trigger %></span>
<% } else { %>
  <%# Fallback trigger: <Button variant="outline" size="sm" iconRight={<Badge>⌘K</Badge>}>Quick actions…</Button> %>
  <button
    type="button"
    data-cmd-trigger="<%= _id %>"
    class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm"
    aria-label="Open command palette"
  >
    Quick actions…
    <span aria-hidden="true" class="shrink-0">
      <span class="<%= _badgeNeutralSm %>">⌘K</span>
    </span>
  </button>
<% } %>

<!-- Modal -->
<div
  id="<%= _id %>"
  role="dialog"
  aria-modal="true"
  aria-labelledby="<%= _id %>-title"
  class="fixed inset-0 z-[100] hidden"
>
  <!-- Backdrop -->
  <div
    class="absolute inset-0 bg-black/40 backdrop-blur-sm"
    data-cmd-close="<%= _id %>"
    aria-hidden="true"
  ></div>

  <!-- Panel -->
  <div class="relative mx-auto mt-16 w-full max-w-lg rounded-xl border border-border bg-surface-raised shadow-2xl overflow-hidden">
    <!-- Header: title -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
      <h2 id="<%= _id %>-title" class="text-base font-semibold text-text-primary">Command Palette</h2>
      <button
        type="button"
        data-cmd-close="<%= _id %>"
        class="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-secondary hover:bg-surface-overlay"
        aria-label="Close"
      >Esc</button>
    </div>

    <div class="px-4 py-4 space-y-4">
      <!-- Search input -->
      <div class="relative flex items-center">
        <span aria-hidden="true" class="absolute left-3 text-text-disabled pointer-events-none">
          <i class="fa-solid fa-magnifying-glass" style="font-size:0.875rem"></i>
        </span>
        <input
          id="<%= _id %>-input"
          type="search"
          placeholder="<%= _placeholder %>"
          autocomplete="off"
          class="block w-full rounded-md border border-border bg-surface-base pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus transition-colors"
          oninput="cmdBarFilter('<%= _id %>', this.value)"
          onkeydown="cmdBarKeyNav(event, '<%= _id %>')"
          aria-autocomplete="list"
          aria-controls="<%= _id %>-list"
        />
      </div>

      <!-- AlertBanner pro-tip -->
      <div role="alert" class="flex items-start gap-3 rounded-lg border p-4 bg-info-subtle border-info text-info-fg">
        <i class="fa-solid fa-circle-info mt-0.5 shrink-0 text-base" aria-hidden="true"></i>
        <div class="flex-1 text-sm min-w-0">
          <p>Pro tip: Press ⌘K from anywhere to open this palette.</p>
        </div>
      </div>

      <!-- Results -->
      <div id="<%= _id %>-list" role="listbox" class="max-h-72 overflow-y-auto -mx-4">
        <% categories.forEach(function(cat) {
          var catItems = _allItems.filter(function(i) { return i.category === cat; });
        %>
        <div class="cmd-category" data-category="<%= cat %>">
          <div class="flex items-center gap-2 mb-1 px-4 pt-2">
            <%# Badge-equivalent: variant=neutral, size=sm %>
            <span class="inline-flex items-center gap-1 rounded-full font-medium bg-surface-sunken text-text-secondary px-1.5 py-0 text-[10px]"><%= cat %></span>
          </div>
          <% catItems.forEach(function(item, idx) { %>
          <% var tag = item.href ? 'a' : 'button'; %>
          <<%= tag %>
            <%= item.href ? 'href="' + item.href + '"' : 'type="button"' %>
            role="option"
            tabindex="-1"
            data-cmd-item
            data-label="<%= item.label.toLowerCase() %>"
            class="cmd-item flex w-full items-center justify-between gap-3 px-4 py-2 text-sm transition-colors text-text-primary hover:bg-surface-overlay focus:bg-surface-overlay outline-none"
          >
            <span class="flex items-center gap-2 min-w-0">
              <% if (item.icon) { %><i class="<%= item.icon %> w-4 text-center text-text-disabled shrink-0" style="font-size:0.875rem" aria-hidden="true"></i><% } %>
              <span class="truncate"><%= item.label %></span>
            </span>
            <% if (item.shortcut) { %>
            <%# Badge-equivalent: variant=neutral, size=sm %>
            <span class="inline-flex items-center gap-1 rounded-full font-medium bg-surface-sunken text-text-secondary px-1.5 py-0 text-[10px] shrink-0"><%= item.shortcut %></span>
            <% } %>
          </<%= tag %>>
          <% }); %>
        </div>
        <% }); %>

        <!-- Empty state -->
        <p id="<%= _id %>-empty" class="hidden text-sm text-text-secondary text-center py-4">
          No commands found for ""
        </p>
      </div>
    </div>
  </div>
</div>

<script>
(function () {
  function openCmdBar(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    var input = document.getElementById(id + '-input');
    if (input) { input.value = ''; cmdBarFilter(id, ''); setTimeout(function(){ input.focus(); }, 10); }
    document.body.style.overflow = 'hidden';
  }

  function closeCmdBar(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  window.cmdBarFilter = window.cmdBarFilter || function(id, query) {
    var q = String(query || '').trim().toLowerCase();
    var list = document.getElementById(id + '-list');
    if (!list) return;
    var items = list.querySelectorAll('[data-cmd-item]');
    var categories = list.querySelectorAll('.cmd-category');
    var anyVisible = false;
    items.forEach(function(el) {
      var label = el.getAttribute('data-label') || '';
      var show = !q || label.indexOf(q) !== -1;
      el.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    categories.forEach(function(cat) {
      var visibleItems = Array.from(cat.querySelectorAll('[data-cmd-item]')).some(function(el) { return el.style.display !== 'none'; });
      cat.style.display = visibleItems ? '' : 'none';
    });
    var empty = document.getElementById(id + '-empty');
    if (empty) {
      empty.classList.toggle('hidden', anyVisible || !q);
      if (!anyVisible && q) empty.textContent = 'No commands found for "' + query + '"';
    }
  };

  window.cmdBarKeyNav = window.cmdBarKeyNav || function(e, id) {
    var list = document.getElementById(id + '-list');
    if (!list) return;
    if (e.key === 'Escape') { closeCmdBar(id); return; }
    var items = Array.from(list.querySelectorAll('[data-cmd-item]')).filter(function(el) { return el.style.display !== 'none'; });
    if (!items.length) return;
    var current = list.querySelector('[data-cmd-item]:focus');
    var idx = items.indexOf(current);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); items[(idx - 1 + items.length) % items.length].focus(); }
    if (e.key === 'Enter' && current) { e.preventDefault(); current.click(); closeCmdBar(id); }
  };

  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-cmd-trigger]');
    if (trigger) { openCmdBar(trigger.getAttribute('data-cmd-trigger')); return; }
    var closeBtn = e.target.closest('[data-cmd-close]');
    if (closeBtn) { closeCmdBar(closeBtn.getAttribute('data-cmd-close')); return; }
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      var bars = document.querySelectorAll('[id^="cmd-bar-"]');
      bars.forEach(function(bar) {
        if (bar.tagName !== 'DIV') return;
        var isOpen = !bar.classList.contains('hidden');
        if (isOpen) closeCmdBar(bar.id); else openCmdBar(bar.id);
      });
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('[id^="cmd-bar-"]').forEach(function(bar) {
        if (!bar.classList.contains('hidden')) closeCmdBar(bar.id);
      });
    }
  });
})();
</script>

```
