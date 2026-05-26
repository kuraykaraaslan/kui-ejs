# DataTable

- **id:** `data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/partials/paginated.ejs`
- **status:** stable
- **since:** 2025-03

Table + SearchBar + Pagination in a single component. Client-side search and pagination with filtered result counter and rows-per-page selector.

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
<%# Backwards-compatible shim — `DataTable` now lives in `modules/ui/Table/`.
    Defaults to `mode="paginated"` so existing consumers see no behavioral
    change. Use the new modes (`static` | `server`) via the unified
    `include('modules/ui/Table/Table', { mode: '…' })` API. %>
<%- include('./Table/Table', Object.assign({}, locals, { mode: locals.mode || 'paginated' })) %>

```
