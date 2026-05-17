# DataTable

- **id:** `data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/DataTable.ejs`
- **status:** stable
- **since:** 0.1

Server-side paginated data table. Card wrapper, başlık slotu, toolbar slotu, tıklanabilir satır ve her zaman görünür pagination desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### With title & pagination

```ejs
<%- include('modules/ui/DataTable', {
  title: 'Users',
  subtitle: total + ' total',
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'joined', header: 'Joined', align: 'right' },
  ],
  rows: users,
  page: page,       // current page (1-based), from req.query
  total: total,     // total record count, from DB
  pageSize: 20,
  qs: qs,           // query string without 'page', from route
}) %>

<%-- In your Express route: --%>
<%
  // const page = parseInt(req.query.page) || 1;
  // const { users, total } = await UserService.list({ page, pageSize: 20 });
  // const qs = new URLSearchParams(req.query); qs.delete('page');
  // res.render('users/index', { users, total, page, qs: qs.toString() });
%>
```

### Clickable rows

```ejs
<%- include('modules/ui/DataTable', {
  columns: [...],
  rows: users,
  page: page,
  total: total,
  pageSize: 20,
  qs: qs,
  getRowHref: function(row) { return '/users/' + row.userId; }
}) %>
```

### Custom cell render

```ejs
<%- include('modules/ui/DataTable', {
  columns: [
    { key: 'name', header: 'User',
      render: function(row) {
        return '<div class="flex items-center gap-2">'
          + '<span class="h-7 w-7 rounded-full bg-primary-subtle text-primary text-xs flex items-center justify-center">'
          + row.name.charAt(0).toUpperCase()
          + '</span>'
          + '<span class="font-medium text-text-primary">' + row.name + '</span>'
          + '</div>';
      }
    },
    { key: 'status', header: 'Status',
      render: function(row) {
        var v = row.status === 'Active' ? 'bg-success-subtle text-success-fg'
               : row.status === 'Pending' ? 'bg-warning-subtle text-warning-fg'
               : 'bg-surface-overlay text-text-secondary';
        return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + v + '">'
          + row.status + '</span>';
      }
    },
  ],
  rows: users,
  page: page,
  total: total,
  pageSize: 20,
  qs: qs,
}) %>
```

### Empty state

```ejs
<%- include('modules/ui/DataTable', {
  columns: [...],
  rows: [],
  page: 1,
  total: 0,
  pageSize: 20,
  qs: qs,
  emptyMessage: 'No users found.'
}) %>
```

## Full EJS source

```ejs
<%
  var _columns      = locals.columns      || [];
  var _rows         = locals.rows         || [];
  var _page         = locals.page         || 1;
  var _total        = locals.total        || 0;
  var _pageSize     = locals.pageSize     || 20;
  var _totalPages   = Math.max(1, Math.ceil(_total / _pageSize));
  var _qs           = locals.qs           || '';
  var _emptyMessage = locals.emptyMessage || 'No results found.';
  var _title        = locals.title        || '';
  var _subtitle     = locals.subtitle     || '';
  var _headerRight  = locals.headerRight  || '';
  var _toolbar      = locals.toolbar      || '';
  var _getRowHref   = locals.getRowHref   || null;
  var _caption      = locals.caption      || '';

  var _pageUrl = function(p) {
    return '?' + (_qs ? _qs + '&' : '') + 'page=' + p;
  };

  var _rangeStart = _total === 0 ? 0 : (_page - 1) * _pageSize + 1;
  var _rangeEnd   = Math.min(_page * _pageSize, _total);

  var _alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  var _allPages = [];
  for (var _pi = 1; _pi <= _totalPages; _pi++) _allPages.push(_pi);
  var _visible = _allPages.filter(function(p) {
    return p === 1 || p === _totalPages || Math.abs(p - _page) <= 1;
  });
  var _withEllipsis = [];
  var _prevP = null;
  for (var _pj = 0; _pj < _visible.length; _pj++) {
    var _vp = _visible[_pj];
    if (_prevP !== null && _vp - _prevP > 1) _withEllipsis.push('ellipsis');
    _withEllipsis.push(_vp);
    _prevP = _vp;
  }

  var _navLink  = 'flex items-center justify-center rounded-md text-sm font-medium border border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  var _navDead  = 'flex items-center justify-center rounded-md text-sm font-medium border border-border text-text-disabled cursor-not-allowed opacity-50';
  var _navSm    = 'h-9 px-3';
  var _navSq    = 'h-9 w-9';
%>
<div class="rounded-xl border border-border bg-surface-raised shadow-sm overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">

  <% if (_title || _headerRight) { %>
  <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
    <div>
      <% if (_title) { %><h3 class="text-sm font-semibold text-text-primary"><%= _title %></h3><% } %>
      <% if (_subtitle) { %><p class="text-xs text-text-secondary mt-0.5"><%= _subtitle %></p><% } %>
    </div>
    <% if (_headerRight) { %><div class="shrink-0"><%- _headerRight %></div><% } %>
  </div>
  <% } %>

  <% if (_toolbar) { %>
  <div class="px-6 pt-4"><%- _toolbar %></div>
  <% } %>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <% if (_caption) { %><caption class="sr-only"><%= _caption %></caption><% } %>
      <thead class="bg-surface-sunken border-b border-border">
        <tr>
          <% _columns.forEach(function(col) { %>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider <%= _alignClass[col.align] || 'text-left' %><%= col.thClass ? ' ' + col.thClass : '' %>">
            <%= col.header %>
          </th>
          <% }); %>
        </tr>
      </thead>
      <tbody class="divide-y divide-border bg-surface-base">
        <% if (_rows.length === 0) { %>
        <tr>
          <td colspan="<%= _columns.length %>" class="px-6 py-10 text-center text-sm text-text-secondary">
            <%= _emptyMessage %>
          </td>
        </tr>
        <% } else { %>
          <% _rows.forEach(function(row) { %>
          <% var _href = _getRowHref ? _getRowHref(row) : null; %>
          <tr class="hover:bg-surface-overlay transition-colors<%= _href ? ' cursor-pointer' : '' %>"
              <%= _href ? 'onclick="location.href=\'' + _href.replace(/'/g, "\\'") + '\'"' : '' %>>
            <% _columns.forEach(function(col) { %>
            <td class="px-6 py-4 text-text-primary<%= col.align ? ' ' + (_alignClass[col.align] || '') : '' %><%= col.tdClass ? ' ' + col.tdClass : '' %>">
              <% if (col.render) { %>
                <%- col.render(row) %>
              <% } else { %>
                <%= row[col.key] !== undefined ? row[col.key] : '—' %>
              <% } %>
            </td>
            <% }); %>
          </tr>
          <% }); %>
        <% } %>
      </tbody>
    </table>
  </div>

  <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-border flex-wrap">
    <p class="text-xs text-text-secondary">
      <% if (_total > 0) { %>
        Showing <span class="font-medium text-text-primary"><%= _rangeStart %>–<%= _rangeEnd %></span>
        of <span class="font-medium text-text-primary"><%= _total %></span>
      <% } else { %>
        No results
      <% } %>
    </p>
    <nav aria-label="Pagination" class="flex items-center gap-1">
      <%
        var _first = _page > 1;
        var _prev  = _page > 1;
        var _next  = _page < _totalPages;
        var _last  = _page < _totalPages;
      %>
      <% if (_first) { %>
        <a href="<%- _pageUrl(1) %>" aria-label="First page" class="<%= _navLink %> <%= _navSm %>">«</a>
        <a href="<%- _pageUrl(_page - 1) %>" aria-label="Previous page" class="<%= _navLink %> <%= _navSm %>">‹</a>
      <% } else { %>
        <span class="<%= _navDead %> <%= _navSm %>" aria-disabled="true">«</span>
        <span class="<%= _navDead %> <%= _navSm %>" aria-disabled="true">‹</span>
      <% } %>

      <% _withEllipsis.forEach(function(item) { %>
        <% if (item === 'ellipsis') { %>
          <span class="<%= _navSq %> flex items-center justify-center text-text-disabled text-sm">…</span>
        <% } else if (item === _page) { %>
          <span aria-current="page" class="<%= _navSq %> flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-fg border border-primary"><%= item %></span>
        <% } else { %>
          <a href="<%- _pageUrl(item) %>" aria-label="Go to page <%= item %>" class="<%= _navLink %> <%= _navSq %>"><%= item %></a>
        <% } %>
      <% }); %>

      <% if (_next) { %>
        <a href="<%- _pageUrl(_page + 1) %>" aria-label="Next page" class="<%= _navLink %> <%= _navSm %>">›</a>
        <a href="<%- _pageUrl(_totalPages) %>" aria-label="Last page" class="<%= _navLink %> <%= _navSm %>">»</a>
      <% } else { %>
        <span class="<%= _navDead %> <%= _navSm %>" aria-disabled="true">›</span>
        <span class="<%= _navDead %> <%= _navSm %>" aria-disabled="true">»</span>
      <% } %>
    </nav>
  </div>

</div>

```
