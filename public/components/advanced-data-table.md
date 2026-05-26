# AdvancedDataTable

- **id:** `advanced-data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/partials/advanced.ejs`
- **status:** beta
- **since:** 2026-05

Enhanced table with row selection (with indeterminate header), expandable rows, and optional sticky header.

## Variants

### Basic (no extras)

```ejs
<%- include('modules/ui/AdvancedDataTable', {
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' }
  ],
  rows: [
    { name: 'Jane Doe',      role: 'Designer', status: 'Active' },
    { name: 'Carlos Mendes', role: 'Engineer', status: 'Active' },
    { name: 'Aisha Khan',    role: 'PM',       status: 'Invited' }
  ]
}) %>
```

### Selectable rows

```ejs
<%- include('modules/ui/AdvancedDataTable', {
  selectable: true,
  columns: [...],
  rows: [...]
}) %>

<!-- Listen for selection changes -->
<script>
document.getElementById('adt-id')
  .addEventListener('adt:selection', (e) => console.log(e.detail.count));
</script>
```

### Expandable rows

```ejs
<%- include('modules/ui/AdvancedDataTable', {
  columns: [...],
  rows: [
    { name: 'Jane Doe', role: 'Designer', status: 'Active',
      _expanded: '<div>Joined in 2023. Platform working group.</div>' },
    { name: 'Carlos Mendes', role: 'Engineer', status: 'Active' }
  ]
}) %>
```

### Selectable + sticky header

```ejs
<%- include('modules/ui/AdvancedDataTable', {
  selectable: true,
  stickyHeader: true,
  columns: [...],
  rows: [...]
}) %>
```

## Full EJS source

```ejs
<%# @deprecated — use `include('modules/ui/Table/Table', { mode: 'advanced' ... })`.
    Backwards-compatible shim — `AdvancedDataTable` now lives in
    `modules/ui/Table/`. %>
<%- include('./Table/Table', Object.assign({}, locals, { mode: 'advanced' })) %>

```
