# FilterBar

- **id:** `filter-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FilterBar.ejs`
- **status:** stable
- **since:** 0.1

Select, multiselect, daterange ve text tabanlı filtre paneli. GET form submit ile URL tabanlı filtre desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Full filter set

```ejs
<%- include('modules/app/FilterBar', {
  action: req.path,
  method: 'get',
  fields: [
    { type: 'select', id: 'status',   label: 'Status',   options: [{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}] },
    { type: 'select', id: 'category', label: 'Category', options: categories.map(c => ({value: c.id, label: c.name})) },
    { type: 'daterange', id: 'date',  label: 'Date range' },
  ],
  values: req.query
}) %>
```

### Compact filters

```ejs
<%- include('modules/app/FilterBar', {
  action: req.path,
  fields: [
    { type: 'select', id: 'status', label: 'Status', options: statusOptions },
    { type: 'select', id: 'role',   label: 'Role',   options: roleOptions   },
  ],
  values: req.query
}) %>
```

## Full EJS source

```ejs
<%
  var _fields     = locals.fields     || [];
  var _values     = locals.values     || {};
  var _action     = locals.action     || '#';
  var _method     = locals.method     || 'get';
  var _applyLabel = locals.applyLabel || 'Apply';
  var _resetLabel = locals.resetLabel || 'Reset';
%>
<form action="<%= _action %>" method="<%= _method %>"
  class="flex flex-wrap items-end gap-3 p-4 bg-surface-raised border border-border rounded-xl<%= locals.className ? ' '+locals.className : '' %>">

  <% _fields.forEach(function(f) {
    var val = _values[f.id] || '';
  %>
  <div class="min-w-36 flex-1">
    <label for="filter-<%= f.id %>" class="block text-sm font-medium text-text-primary mb-1.5"><%= f.label %></label>

    <% if (f.type === 'select') { %>
    <div class="relative">
      <select id="filter-<%= f.id %>" name="<%= f.id %>"
        class="block w-full appearance-none rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary px-3 py-2 pr-8 text-sm transition-colors">
        <option value=""><%= f.placeholder || 'All' %></option>
        <% (f.options||[]).forEach(function(opt){ %>
        <option value="<%= opt.value %>"<%= val === opt.value ? ' selected' : '' %>><%= opt.label %></option>
        <% }); %>
      </select>
      <i class="fa-solid fa-chevron-down text-xs text-text-disabled pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true"></i>
    </div>

    <% } else if (f.type === 'multiselect') { %>
    <select id="filter-<%= f.id %>" name="<%= f.id %>[]" multiple
      class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-1.5 text-sm" size="3">
      <% (f.options||[]).forEach(function(opt){ %>
      <option value="<%= opt.value %>"><%= opt.label %></option>
      <% }); %>
    </select>

    <% } else if (f.type === 'daterange') { %>
    <div class="flex items-center gap-1.5">
      <input type="date" id="filter-<%= f.id %>-start" name="<%= f.id %>_start"
        class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-sm">
      <span class="text-text-disabled text-sm shrink-0">–</span>
      <input type="date" id="filter-<%= f.id %>-end" name="<%= f.id %>_end"
        class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-sm">
    </div>

    <% } else { %>
    <input type="text" id="filter-<%= f.id %>" name="<%= f.id %>" value="<%= val %>"
      placeholder="<%= f.placeholder || '' %>"
      class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary px-3 py-2 text-sm transition-colors">
    <% } %>
  </div>
  <% }); %>

  <div class="flex items-center gap-2 shrink-0 self-end pb-0.5">
    <button type="reset"
      class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus text-text-secondary hover:text-text-primary hover:bg-surface-overlay px-3 py-2 text-sm">
      <%= _resetLabel %>
    </button>
    <button type="submit"
      class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg hover:bg-primary-hover px-3 py-2 text-sm">
      <i class="fa-solid fa-filter text-xs" aria-hidden="true"></i>
      <%= _applyLabel %>
    </button>
  </div>
</form>

```
