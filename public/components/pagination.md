# Pagination

- **id:** `pagination`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Pagination.ejs`
- **status:** stable
- **since:** 2025-02

Sayfa gezinme kontrolü. Sayfa penceresi + ellipsis hesabı, first/last butonları ve boyut varyantları.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (page 3 of 10)

```ejs
<%- include('modules/ui/Pagination', {
  page: 3,
  totalPages: 10
}) %>
```

### With first/last buttons

```ejs
<%- include('modules/ui/Pagination', {
  page: 5,
  totalPages: 12,
  showFirstLast: true
}) %>
```

### First page (prev disabled)

```ejs
<%- include('modules/ui/Pagination', {
  page: 1,
  totalPages: 8
}) %>
```

### Small size

```ejs
<%- include('modules/ui/Pagination', {
  page: 2,
  totalPages: 6,
  size: 'sm'
}) %>
```

### Large size

```ejs
<%- include('modules/ui/Pagination', {
  page: 4,
  totalPages: 7,
  size: 'lg'
}) %>
```

## Full EJS source

```ejs
<%
  var _page          = locals.page          || 1;
  var _totalPages    = locals.totalPages    || 1;
  var _size          = locals.size          || 'md';
  var _showFirstLast = !!locals.showFirstLast;
  var _showJumpTo    = !!locals.showJumpTo;
  var _jumpAction    = locals.jumpAction    || '';
  var _id            = locals.id            || 'pg-' + Math.random().toString(36).substr(2, 9);
  var _className     = locals.className     || '';

  var sizeMap = {
    sm: { page: 'w-7 h-7 text-xs',      nav: 'px-2 py-1 text-xs' },
    md: { page: 'w-9 h-9 text-sm',      nav: 'px-3 py-1.5 text-sm' },
    lg: { page: 'w-10 h-10 text-base',  nav: 'px-4 py-2 text-base' },
  };
  var s = sizeMap[_size] || sizeMap.md;

  var allPages = [];
  for (var i = 1; i <= _totalPages; i++) allPages.push(i);

  var visible = allPages.filter(function (p) {
    return p === 1 || p === _totalPages || Math.abs(p - _page) <= 1;
  });

  var withEllipsis = [];
  var prevP = null;
  for (var j = 0; j < visible.length; j++) {
    var vp = visible[j];
    if (prevP !== null && vp - prevP > 1) withEllipsis.push('ellipsis');
    withEllipsis.push(vp);
    prevP = vp;
  }

  var navBtnBase = 'rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ' + s.nav;
  var navEnabled  = 'border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary';
  var navDisabled = 'border-border text-text-disabled cursor-not-allowed opacity-50';
%>
<nav aria-label="Pagination" class="flex items-center gap-1 flex-wrap<%= _className ? ' ' + _className : '' %>">
  <% if (_showFirstLast) { %>
  <button type="button" <%= _page <= 1 ? 'disabled' : '' %> aria-label="First page"
    class="<%= navBtnBase %> <%= _page <= 1 ? navDisabled : navEnabled %>">«</button>
  <% } %>

  <button type="button" <%= _page <= 1 ? 'disabled' : '' %> aria-label="Previous page"
    class="<%= navBtnBase %> <%= _page <= 1 ? navDisabled : navEnabled %>">‹</button>

  <% withEllipsis.forEach(function (item) { %>
    <% if (item === 'ellipsis') { %>
    <span class="text-text-disabled <%= s.nav %>">…</span>
    <% } else { %>
    <button
      type="button"
      aria-label="Page <%= item %>"
      <%= item === _page ? 'aria-current="page"' : '' %>
      class="rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus text-center <%= s.page %> <%= item === _page ? 'bg-primary text-primary-fg border-primary' : 'border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary' %>"
    ><%= item %></button>
    <% } %>
  <% }); %>

  <button type="button" <%= _page >= _totalPages ? 'disabled' : '' %> aria-label="Next page"
    class="<%= navBtnBase %> <%= _page >= _totalPages ? navDisabled : navEnabled %>">›</button>

  <% if (_showFirstLast) { %>
  <button type="button" <%= _page >= _totalPages ? 'disabled' : '' %> aria-label="Last page"
    class="<%= navBtnBase %> <%= _page >= _totalPages ? navDisabled : navEnabled %>">»</button>
  <% } %>

  <% if (_showJumpTo) { %>
  <form
    id="<%= _id %>-jump"
    <% if (_jumpAction) { %>action="<%= _jumpAction %>" method="get"<% } %>
    class="flex items-center gap-1.5 ml-2"
    onsubmit="return (function(form){
      var input = form.querySelector('input[name=page]');
      var n = parseInt(input.value, 10);
      if (isNaN(n) || n < 1 || n > <%= _totalPages %>) return false;
      var evt = new CustomEvent('pagination:jump', { detail: { page: n }, bubbles: true });
      form.dispatchEvent(evt);
      if (!form.getAttribute('action')) { input.value = ''; return false; }
      return true;
    })(this);"
  >
    <label for="<%= _id %>-jump-input" class="text-xs text-text-secondary whitespace-nowrap">Go to</label>
    <input
      id="<%= _id %>-jump-input"
      name="page"
      type="number"
      min="1"
      max="<%= _totalPages %>"
      aria-label="Jump to page, 1–<%= _totalPages %>"
      class="w-14 rounded-md border border-border bg-surface-base text-center text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus py-1 px-1"
    />
    <button
      type="submit"
      class="rounded-md border border-border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus px-2 py-1 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
    >Go</button>
  </form>
  <% } %>
</nav>

```
