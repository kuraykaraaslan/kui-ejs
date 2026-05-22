# FilterBar

- **id:** `filter-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FilterBar.ejs`
- **status:** stable
- **since:** 2025-03

Select, multiselect, daterange ve text tabanlı filtre paneli. GET form submit ile URL tabanlı filtre desteği.

## Design tokens consumed

- `--border`
- `--surface-raised`

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
  var _applyLabel = locals.applyLabel || 'Apply';
  var _resetLabel = locals.resetLabel || 'Reset';
  var _className  = locals.className  || '';
  var _filterId   = locals.id || ('filterbar-' + Math.random().toString(36).slice(2, 8));
%>
<div
  id="<%= _filterId %>"
  class="flex flex-wrap items-end gap-3 p-4 bg-surface-raised border border-border rounded-xl<%= _className ? ' ' + _className : '' %>"
>
  <% _fields.forEach(function (f) {
       var val      = _values[f.id];
       var fieldId  = 'filter-' + f.id;
  %>
    <% if (f.type === 'select') { %>
      <div class="min-w-36 flex-1">
        <%- include('../ui/Select', {
          id:          fieldId,
          label:       f.label,
          options:     f.options || [],
          placeholder: f.placeholder || 'All',
          value:       (val == null ? '' : val),
        }) %>
      </div>

    <% } else if (f.type === 'multiselect') { %>
      <div class="min-w-44 flex-1">
        <%- include('../ui/MultiSelect', {
          id:          fieldId,
          label:       f.label,
          options:     f.options || [],
          value:       Array.isArray(val) ? val : [],
          placeholder: f.placeholder || 'Any',
        }) %>
      </div>

    <% } else if (f.type === 'daterange') { %>
      <div class="min-w-56 flex-1">
        <%- include('../ui/DateRangePicker', {
          id:    fieldId,
          label: f.label,
          value: val || { start: null, end: null },
        }) %>
      </div>

    <% } else if (f.type === 'tags') { %>
      <div class="min-w-44 flex-1">
        <%- include('../ui/TagInput', {
          id:          fieldId,
          label:       f.label,
          value:       Array.isArray(val) ? val : [],
          placeholder: f.placeholder || 'Add tag…',
        }) %>
      </div>
    <% } %>
  <% }); %>

  <div class="flex items-center gap-2 shrink-0 self-end pb-0.5">
    <span data-filterbar-reset>
      <%- include('../ui/Button', {
        variant: 'ghost',
        size:    'sm',
        children: _resetLabel,
      }) %>
    </span>
    <span data-filterbar-apply>
      <%- include('../ui/Button', {
        variant: 'primary',
        size:    'sm',
        children: _applyLabel,
      }) %>
    </span>
  </div>
</div>

<script>
(function () {
  var root = document.getElementById('<%= _filterId %>');
  if (!root) return;
  function fire(name) {
    root.dispatchEvent(new CustomEvent(name, { bubbles: true }));
  }
  var apply = root.querySelector('[data-filterbar-apply] button, [data-filterbar-apply] a');
  var reset = root.querySelector('[data-filterbar-reset] button, [data-filterbar-reset] a');
  if (apply) apply.addEventListener('click', function () { fire('filterbar:submit'); });
  if (reset) reset.addEventListener('click', function () { fire('filterbar:reset'); });
})();
</script>

```
