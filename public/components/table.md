# Table

- **id:** `table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table.ejs`
- **status:** stable
- **since:** 0.1

Semantik HTML tablosu. thead/tbody, sütun hizalaması ve boş durum mesajı desteği.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Table', {
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'joined', header: 'Joined', align: 'right' },
  ],
  rows: users
}) %>
```

### Compact — 2 columns

```ejs
<%- include('modules/ui/Table', {
  columns: [
    { key: 'key',   header: 'Setting' },
    { key: 'value', header: 'Value', align: 'right' },
  ],
  rows: settings
}) %>
```

### Empty state

```ejs
<%- include('modules/ui/Table', {
  columns: [...],
  rows: [],
  emptyMessage: 'No users found. Invite someone to get started.'
}) %>
```

## Full EJS source

```ejs
<%
  var _columns      = locals.columns      || [];
  var _rows         = locals.rows         || [];
  var _caption      = locals.caption      || '';
  var _emptyMessage = locals.emptyMessage || 'No results found.';
  var _className    = locals.className    || '';

  var alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };
%>
<div class="w-full overflow-x-auto rounded-lg border border-border<%= _className ? ' ' + _className : '' %>">
  <table class="w-full text-sm">
    <% if (_caption) { %><caption class="sr-only"><%= _caption %></caption><% } %>
    <thead class="bg-surface-sunken border-b border-border">
      <tr>
        <% _columns.forEach(function (col) { %>
        <th scope="col" class="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider <%= alignClass[col.align] || 'text-left' %>">
          <%= col.header %>
        </th>
        <% }); %>
      </tr>
    </thead>
    <tbody class="divide-y divide-border bg-surface-base">
      <% if (_rows.length === 0) { %>
      <tr>
        <td colspan="<%= _columns.length %>" class="px-4 py-8 text-center text-text-secondary"><%= _emptyMessage %></td>
      </tr>
      <% } else { %>
        <% _rows.forEach(function (row) { %>
        <tr class="hover:bg-surface-overlay transition-colors">
          <% _columns.forEach(function (col) { %>
          <td class="px-4 py-3 text-text-primary<%= col.align ? ' ' + (alignClass[col.align] || '') : '' %>">
            <%= row[col.key] !== undefined ? row[col.key] : '' %>
          </td>
          <% }); %>
        </tr>
        <% }); %>
      <% } %>
    </tbody>
  </table>
</div>

```
