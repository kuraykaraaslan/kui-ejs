# ServerDataTable

- **id:** `server-data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/partials/server.ejs`
- **status:** beta
- **since:** 2026-05

Server-side paginated table. Reads page/totalPages/total/pageSize from the Express route; supports title, toolbar, clickable rows, and empty/loading states.

## Variants

### With title & pagination

```ejs
<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  subtitle: total + ' total',
  columns: [
    { key: 'orderId',  header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'status',   header: 'Status' },
    { key: 'total',    header: 'Total', align: 'right' },
  ],
  rows: orders,
  page: page,
  totalPages: totalPages,
  total: total,
  pageSize: 20,
}) %>

<%-- In your Express route: --%>
<%
  // const page = parseInt(req.query.page) || 1;
  // const { orders, total } = await OrderService.list({ page, pageSize: 20 });
  // res.render('orders/index', { orders, total, page, totalPages: Math.ceil(total / 20) });
%>
```

### Clickable rows + header action

```ejs
<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  headerRight: '<a href="/orders/new" class="...">+ New order</a>',
  columns: [...],
  rows: orders,
  page: page,
  totalPages: totalPages,
  total: total,
  pageSize: 20,
  getRowHref: function(row) { return '/orders/' + row.orderId.replace('#', ''); }
}) %>
```

### Loading

```ejs
<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  columns: [...],
  rows: [],
  loading: true
}) %>
```

### Empty state

```ejs
<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  columns: [...],
  rows: [],
  page: 1,
  totalPages: 1,
  total: 0,
  pageSize: 20,
  emptyMessage: 'No orders yet. Your first sale will appear here.'
}) %>
```

## Full EJS source

```ejs
<%# @deprecated — use `include('modules/ui/Table/Table', { mode: 'server' ... })`.
    Backwards-compatible shim — `ServerDataTable` now lives in
    `modules/ui/Table/`. %>
<%- include('./Table/Table', Object.assign({}, locals, { mode: 'server' })) %>

```
