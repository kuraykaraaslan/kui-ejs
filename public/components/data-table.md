# DataTable

- **id:** `data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/DataTable.ejs`
- **status:** stable
- **since:** 2025-03

Table + SearchBar + Pagination in a single component. Client-side search and pagination with filtered result counter and rows-per-page selector.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
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
  var _columns         = locals.columns         || [];
  var _rows            = locals.rows            || [];
  var _caption         = locals.caption         || '';
  var _searchable      = locals.searchable !== undefined ? !!locals.searchable : true;
  var _searchPlaceholder = locals.searchPlaceholder || 'Search…';
  var _pageSize        = Number(locals.pageSize) || 10;
  var _pageSizeOptions = locals.pageSizeOptions || [5, 10, 25, 50];
  var _emptyMessage    = locals.emptyMessage    || 'No results found.';
  var _className       = locals.className       || '';
  var _id              = locals.id              || 'dt-' + Math.random().toString(36).substr(2, 9);

  var _alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  // Build a JSON-safe rows projection for client-side filter/sort (only key-based plain values).
  var _rowsData = _rows.map(function (row) {
    var obj = {};
    _columns.forEach(function (col) {
      if (col.render) return;
      var v = row[col.key];
      obj[col.key] = (v === undefined || v === null) ? '' : String(v);
    });
    return obj;
  });
%>
<div id="<%= _id %>" class="space-y-3<%= _className ? ' ' + _className : '' %>" data-dt-root>
  <% if (_searchable) { %>
  <div class="flex items-center gap-2 flex-wrap">
    <div class="relative flex items-center flex-1 min-w-40">
      <div class="pointer-events-none absolute left-3 text-sm text-text-disabled" aria-hidden="true">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <input
        id="<%= _id %>-search"
        type="search"
        role="searchbox"
        placeholder="<%= _searchPlaceholder %>"
        autocomplete="off"
        data-dt-search
        class="block w-full rounded-md border border-border bg-surface-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus hover:border-border-strong transition-colors py-2 text-sm pl-9 pr-3"
      >
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <label for="<%= _id %>-pagesize" class="text-xs text-text-secondary whitespace-nowrap">Rows per page:</label>
      <select
        id="<%= _id %>-pagesize"
        data-dt-pagesize
        class="rounded-md border border-border bg-surface-base px-2 py-1.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <% _pageSizeOptions.forEach(function (opt) { %>
        <option value="<%= opt %>"<%= opt === _pageSize ? ' selected' : '' %>><%= opt %></option>
        <% }); %>
      </select>
    </div>
  </div>
  <% } %>

  <div class="w-full overflow-x-auto rounded-lg border border-border">
    <table class="w-full text-sm">
      <% if (_caption) { %><caption class="sr-only"><%= _caption %></caption><% } %>
      <thead class="bg-surface-sunken border-b border-border">
        <tr>
          <% _columns.forEach(function (col) { %>
          <th
            scope="col"
            <% if (col.sortable) { %>aria-sort="none" data-dt-sort-key="<%= col.key %>"<% } %>
            class="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider <%= _alignClass[col.align] || 'text-left' %><%= col.sortable ? ' cursor-pointer select-none hover:text-text-primary transition-colors' : '' %>"
          >
            <span class="inline-flex items-center gap-1">
              <%= col.header %>
              <% if (col.sortable) { %>
                <span class="w-2.5 h-2.5 inline-flex items-center justify-center" data-dt-sort-icon aria-hidden="true">
                  <i class="fa-solid fa-sort" style="font-size:10px"></i>
                </span>
              <% } %>
            </span>
          </th>
          <% }); %>
        </tr>
      </thead>
      <tbody class="divide-y divide-border bg-surface-base" data-dt-body>
        <% if (_rows.length === 0) { %>
        <tr data-dt-empty>
          <td colspan="<%= _columns.length %>" class="px-4 py-10 text-center text-sm text-text-secondary">
            <%= _emptyMessage %>
          </td>
        </tr>
        <% } else { %>
          <% _rows.forEach(function (row, ri) { %>
          <tr class="hover:bg-surface-overlay transition-colors" data-dt-row="<%= ri %>">
            <% _columns.forEach(function (col) { %>
            <td class="px-4 py-3 text-text-primary<%= col.align ? ' ' + (_alignClass[col.align] || '') : '' %>"<% if (!col.render) { %> data-dt-key="<%= col.key %>"<% } %>>
              <% if (col.render) { %>
                <%- col.render(row) %>
              <% } else { %>
                <%= row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '' %>
              <% } %>
            </td>
            <% }); %>
          </tr>
          <% }); %>
        <% } %>
      </tbody>
    </table>
  </div>

  <div class="flex items-center justify-between gap-4 flex-wrap">
    <p class="text-xs text-text-secondary" data-dt-status></p>
    <nav aria-label="Pagination" class="flex items-center gap-1 flex-wrap" data-dt-pagination></nav>
  </div>
</div>

<script>
(function () {
  var root = document.getElementById('<%= _id %>');
  if (!root) return;

  var COLS         = <%- JSON.stringify(_columns.map(function (c) { return { key: c.key, sortable: !!c.sortable, hasRender: !!c.render }; })) %>;
  var ROWS_DATA    = <%- JSON.stringify(_rowsData) %>;
  var TOTAL_ROWS   = <%= _rows.length %>;
  var EMPTY_MSG    = <%- JSON.stringify(_emptyMessage) %>;
  var COL_COUNT    = <%= _columns.length %>;

  var searchEl     = root.querySelector('[data-dt-search]');
  var pageSizeEl   = root.querySelector('[data-dt-pagesize]');
  var bodyEl       = root.querySelector('[data-dt-body]');
  var statusEl     = root.querySelector('[data-dt-status]');
  var pagerEl      = root.querySelector('[data-dt-pagination]');
  var rowEls       = Array.prototype.slice.call(root.querySelectorAll('[data-dt-row]'));

  var state = {
    search:   '',
    page:     1,
    pageSize: <%= _pageSize %>,
    sortKey:  '',
    sortDir:  null
  };

  function filteredIndices() {
    if (!state.search.trim()) return ROWS_DATA.map(function (_, i) { return i; });
    var q = state.search.toLowerCase();
    var out = [];
    for (var i = 0; i < ROWS_DATA.length; i++) {
      var match = false;
      for (var c = 0; c < COLS.length; c++) {
        if (COLS[c].hasRender) continue;
        var v = ROWS_DATA[i][COLS[c].key] || '';
        if (v.toLowerCase().indexOf(q) !== -1) { match = true; break; }
      }
      if (match) out.push(i);
    }
    return out;
  }

  function sortedIndices(indices) {
    if (!state.sortKey || !state.sortDir) return indices;
    var key = state.sortKey;
    var dir = state.sortDir;
    return indices.slice().sort(function (a, b) {
      var av = ROWS_DATA[a][key] || '';
      var bv = ROWS_DATA[b][key] || '';
      var cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return dir === 'asc' ? cmp : -cmp;
    });
  }

  function renderRows() {
    var idx = sortedIndices(filteredIndices());
    var totalFiltered = idx.length;
    var totalPages    = Math.max(1, Math.ceil(totalFiltered / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var safePage = state.page;
    var start = totalFiltered === 0 ? 0 : (safePage - 1) * state.pageSize;
    var end   = Math.min(start + state.pageSize, totalFiltered);
    var pageIndices = idx.slice(start, end);
    var visible = {};
    pageIndices.forEach(function (i) { visible[i] = true; });

    // Hide all, then re-append in sorted order.
    var existingEmpty = bodyEl.querySelector('[data-dt-empty]');
    if (existingEmpty) existingEmpty.parentNode.removeChild(existingEmpty);
    rowEls.forEach(function (tr) { tr.style.display = 'none'; });

    if (pageIndices.length === 0) {
      var trEmpty = document.createElement('tr');
      trEmpty.setAttribute('data-dt-empty', '');
      var td = document.createElement('td');
      td.colSpan = COL_COUNT;
      td.className = 'px-4 py-10 text-center text-sm text-text-secondary';
      td.textContent = (totalFiltered === 0 && state.search)
        ? 'No results for "' + state.search + '"'
        : EMPTY_MSG;
      trEmpty.appendChild(td);
      bodyEl.appendChild(trEmpty);
    } else {
      pageIndices.forEach(function (rowIdx) {
        var tr = rowEls[rowIdx];
        if (!tr) return;
        tr.style.display = '';
        bodyEl.appendChild(tr);
      });
    }

    // Status
    var startDisp = totalFiltered === 0 ? 0 : start + 1;
    var endDisp   = end;
    statusEl.textContent = totalFiltered === 0
      ? 'No results'
      : 'Showing ' + startDisp + '–' + endDisp + ' of ' + totalFiltered
        + (state.search ? ' (filtered from ' + TOTAL_ROWS + ')' : '');

    renderPager(safePage, totalPages);
    renderSortIcons();
  }

  function renderPager(page, totalPages) {
    pagerEl.innerHTML = '';
    if (totalPages <= 1) return;

    var navBtn  = 'rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus px-3 py-1.5 text-sm';
    var enabled = ' border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary';
    var disabledCls = ' border-border text-text-disabled cursor-not-allowed opacity-50';

    function btn(label, target, isDisabled, aria) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', aria);
      b.className = navBtn + (isDisabled ? disabledCls : enabled);
      b.textContent = label;
      if (isDisabled) b.disabled = true;
      else b.addEventListener('click', function () { state.page = target; renderRows(); });
      return b;
    }

    pagerEl.appendChild(btn('‹', page - 1, page <= 1, 'Previous page'));

    var allPages = [];
    for (var p = 1; p <= totalPages; p++) allPages.push(p);
    var visible = allPages.filter(function (p) {
      return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
    });
    var withEll = [];
    var prevP = null;
    for (var k = 0; k < visible.length; k++) {
      var vp = visible[k];
      if (prevP !== null && vp - prevP > 1) withEll.push('ellipsis');
      withEll.push(vp);
      prevP = vp;
    }

    withEll.forEach(function (item) {
      if (item === 'ellipsis') {
        var s = document.createElement('span');
        s.className = 'text-text-disabled px-3 py-1.5 text-sm';
        s.textContent = '…';
        pagerEl.appendChild(s);
      } else {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Page ' + item);
        if (item === page) b.setAttribute('aria-current', 'page');
        b.className = 'rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus flex items-center justify-center w-9 h-9 text-sm '
          + (item === page
            ? 'bg-primary text-primary-fg border-primary'
            : 'border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary');
        b.textContent = item;
        b.addEventListener('click', function () { state.page = item; renderRows(); });
        pagerEl.appendChild(b);
      }
    });

    pagerEl.appendChild(btn('›', page + 1, page >= totalPages, 'Next page'));
  }

  function renderSortIcons() {
    root.querySelectorAll('[data-dt-sort-key]').forEach(function (th) {
      var key = th.getAttribute('data-dt-sort-key');
      var iconWrap = th.querySelector('[data-dt-sort-icon]');
      var isSorted = state.sortKey === key && state.sortDir;
      if (isSorted) {
        th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
      } else {
        th.setAttribute('aria-sort', 'none');
      }
      if (iconWrap) {
        var iconCls = isSorted
          ? (state.sortDir === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down')
          : 'fa-sort';
        iconWrap.innerHTML = '<i class="fa-solid ' + iconCls + '" style="font-size:10px"></i>';
      }
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', function (e) {
      state.search = e.target.value || '';
      state.page = 1;
      renderRows();
    });
  }
  if (pageSizeEl) {
    pageSizeEl.addEventListener('change', function (e) {
      state.pageSize = Number(e.target.value) || 10;
      state.page = 1;
      renderRows();
    });
  }
  root.querySelectorAll('[data-dt-sort-key]').forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.getAttribute('data-dt-sort-key');
      if (state.sortKey !== key) {
        state.sortKey = key;
        state.sortDir = 'asc';
      } else if (state.sortDir === 'asc') {
        state.sortDir = 'desc';
      } else {
        state.sortDir = null;
        state.sortKey = '';
      }
      state.page = 1;
      renderRows();
    });
  });

  renderRows();
})();
</script>

```
