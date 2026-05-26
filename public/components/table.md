# Table

- **id:** `table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/partials/plain.ejs`
- **status:** stable
- **since:** 2025-02

Responsive table. scope="col" headers, hover row highlight, empty-state message, and custom cell render support.

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
<%# Backwards-compatible shim — the implementation now lives in
    `modules/ui/Table/`. Existing `include('modules/ui/Table', ...)` keeps
    working unchanged. %>
<%- include('./Table/Table', Object.assign({}, locals, { mode: 'plain' })) %>

```
