# ServerDataTable

- **id:** `server-data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/ServerDataTable.ejs`
- **status:** beta
- **since:** 2026-05

Server-side paginated table. Reads page/totalPages/total/pageSize from the Express route; supports title, toolbar, clickable rows, and empty/loading states.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

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
<%
  var _columns      = locals.columns      || [];
  var _rows         = locals.rows         || [];
  var _getRowHref   = locals.getRowHref   || null;
  var _page         = Number(locals.page) || 1;
  var _totalPages   = Math.max(1, Number(locals.totalPages) || 1);
  var _total        = locals.total != null ? Number(locals.total) : null;
  var _pageSize     = locals.pageSize != null ? Number(locals.pageSize) : null;
  var _loading      = !!locals.loading;
  var _emptyMessage = locals.emptyMessage || 'No results found.';
  var _title        = locals.title        || '';
  var _subtitle     = locals.subtitle     || '';
  var _headerRight  = locals.headerRight  || '';
  var _toolbar      = locals.toolbar      || '';
  var _className    = locals.className    || '';

  var _alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  var _rangeStart = (_total != null && _pageSize != null) ? (_page - 1) * _pageSize + 1 : null;
  var _rangeEnd   = (_total != null && _pageSize != null) ? Math.min(_page * _pageSize, _total) : null;
%>
<div class="rounded-xl border border-border bg-surface-raised shadow-sm overflow-hidden<%= _className ? ' ' + _className : '' %>">

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
  <div class="px-6 pt-4 pb-0"><%- _toolbar %></div>
  <% } %>

  <% if (_loading) { %>
    <div class="flex justify-center py-12">
      <%- include('Spinner', { size: 'lg' }) %>
    </div>
  <% } else { %>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border bg-surface-sunken">
            <% _columns.forEach(function(col) { %>
            <th scope="col"
                class="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider <%= _alignClass[col.align] || 'text-left' %><%= col.thClass ? ' ' + col.thClass : '' %>">
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
                <%= _href ? 'onclick="location.href=\'' + String(_href).replace(/'/g, "\\'") + '\'"' : '' %>>
              <% _columns.forEach(function(col) { %>
              <td class="px-6 py-4 text-text-primary<%= col.align ? ' ' + (_alignClass[col.align] || '') : '' %><%= col.tdClass ? ' ' + col.tdClass : '' %>">
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

    <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-border flex-wrap">
      <p class="text-xs text-text-secondary">
        <% if (_total != null && _rangeStart != null && _rangeEnd != null) { %>
          Showing <%= _rangeStart %>–<%= _rangeEnd %> of <%= _total %>
        <% } else if (_total != null) { %>
          <%= _total %> result<%= _total !== 1 ? 's' : '' %>
        <% } %>
      </p>
      <%- include('Pagination', { page: _page, totalPages: _totalPages, showFirstLast: true }) %>
    </div>
  <% } %>
</div>

```
