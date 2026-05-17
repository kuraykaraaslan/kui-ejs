# AppCommandBar

- **id:** `app-command-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppCommandBar.ejs`
- **status:** stable
- **since:** 0.1

Ctrl+K ile açılan komut paleti. items dizisi ile özel komutlar; varsayılan Navigation/Actions/Recent grupları dahili. Klavye navigasyonu (↑↓ + Enter) destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
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

  var defaultItems = [
    { icon: 'fa-solid fa-house',        label: 'Dashboard',       shortcut: 'G D', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-users',        label: 'Users',           shortcut: 'G U', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-chart-bar',    label: 'Analytics',       shortcut: 'G A', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-gear',         label: 'Settings',        shortcut: 'G S', category: 'Navigation', href: '#' },
    { icon: 'fa-solid fa-plus',         label: 'New Project',     shortcut: 'C N', category: 'Actions' },
    { icon: 'fa-solid fa-file-export',  label: 'Export Data',     shortcut: 'C E', category: 'Actions' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Recent: Dashboard', category: 'Recent', href: '#' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Recent: Users',     category: 'Recent', href: '#' },
  ];

  var _allItems = _items.length ? _items : defaultItems;

  var categories = [];
  _allItems.forEach(function(item) {
    if (categories.indexOf(item.category) === -1) categories.push(item.category);
  });
%>
<!-- AppCommandBar Trigger -->
<% if (locals.trigger) { %>
  <span data-cmd-trigger="<%= _id %>"><%- locals.trigger %></span>
<% } else { %>
  <button
    type="button"
    data-cmd-trigger="<%= _id %>"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface-raised text-text-secondary text-sm hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    aria-label="Open command bar (Ctrl K)"
  >
    <i class="fa-solid fa-magnifying-glass text-xs" aria-hidden="true"></i>
    <span class="hidden sm:inline text-sm text-text-disabled">Search commands…</span>
    <kbd class="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-text-secondary ml-1">
      <span>Ctrl</span><span>K</span>
    </kbd>
  </button>
<% } %>

<!-- Modal -->
<div
  id="<%= _id %>"
  role="dialog"
  aria-modal="true"
  aria-label="Command bar"
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
    <!-- Search input -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
      <i class="fa-solid fa-magnifying-glass text-text-disabled shrink-0" aria-hidden="true"></i>
      <input
        id="<%= _id %>-input"
        type="search"
        placeholder="<%= _placeholder %>"
        autocomplete="off"
        class="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"
        oninput="cmdBarFilter('<%= _id %>', this.value)"
        onkeydown="cmdBarKeyNav(event, '<%= _id %>')"
        aria-autocomplete="list"
        aria-controls="<%= _id %>-list"
      />
      <button
        type="button"
        data-cmd-close="<%= _id %>"
        class="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-secondary hover:bg-surface-overlay"
        aria-label="Close"
      >Esc</button>
    </div>

    <!-- Results -->
    <div id="<%= _id %>-list" role="listbox" class="max-h-72 overflow-y-auto py-2">
      <% categories.forEach(function(cat) {
        var catItems = _allItems.filter(function(i) { return i.category === cat; });
      %>
      <div class="cmd-category" data-category="<%= cat %>">
        <p class="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-disabled"><%= cat %></p>
        <% catItems.forEach(function(item, idx) { %>
        <% var tag = item.href ? 'a' : 'button'; %>
        <<%= tag %>
          <%= item.href ? 'href="' + item.href + '"' : 'type="button"' %>
          role="option"
          tabindex="-1"
          data-cmd-item
          data-label="<%= item.label.toLowerCase() %>"
          class="cmd-item flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors text-text-primary hover:bg-surface-overlay focus:bg-surface-overlay outline-none"
        >
          <i class="<%= item.icon %> w-4 text-center text-text-disabled shrink-0 text-xs" aria-hidden="true"></i>
          <span class="flex-1 truncate"><%= item.label %></span>
          <% if (item.shortcut) { %>
          <span class="flex items-center gap-0.5 shrink-0">
            <% item.shortcut.split(' ').forEach(function(key) { %>
            <kbd class="rounded border border-border bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-text-secondary"><%= key %></kbd>
            <% }); %>
          </span>
          <% } %>
        </<%= tag %>>
        <% }); %>
      </div>
      <% }); %>

      <!-- Empty state -->
      <div id="<%= _id %>-empty" class="hidden px-4 py-8 text-center text-sm text-text-secondary">
        No results for your search.
      </div>
    </div>

    <!-- Footer hint -->
    <div class="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-text-disabled">
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> Navigate</span>
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↵</kbd> Select</span>
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">Esc</kbd> Close</span>
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
    var q = query.trim().toLowerCase();
    var list = document.getElementById(id + '-list');
    if (!list) return;
    var items = list.querySelectorAll('[data-cmd-item]');
    var categories = list.querySelectorAll('.cmd-category');
    var anyVisible = false;
    items.forEach(function(el) {
      var label = el.getAttribute('data-label') || '';
      var show = !q || label.includes(q);
      el.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    categories.forEach(function(cat) {
      var visibleItems = Array.from(cat.querySelectorAll('[data-cmd-item]')).some(function(el) { return el.style.display !== 'none'; });
      cat.style.display = visibleItems ? '' : 'none';
    });
    var empty = document.getElementById(id + '-empty');
    if (empty) empty.classList.toggle('hidden', anyVisible);
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
