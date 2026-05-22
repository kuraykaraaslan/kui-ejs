# CheckboxGroup

- **id:** `checkbox-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/CheckboxGroup.ejs`
- **status:** stable
- **since:** 2025-02

Chip-style multi-select group. Selected chips use bg-primary-subtle / border-primary tokens. Keyboard accessible.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--primary-subtle`
- `--surface-base`
- `--surface-overlay`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/ui/CheckboxGroup', {
  legend: 'Tech stack',
  options: [
    { value: 'react',      label: 'React'      },
    { value: 'vue',        label: 'Vue'        },
    { value: 'typescript', label: 'TypeScript' },
  ],
  selected: ['react', 'typescript']
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/CheckboxGroup', {
  legend: 'Permissions',
  options: [
    { value: 'read',   label: 'Read'   },
    { value: 'write',  label: 'Write'  },
    { value: 'delete', label: 'Delete' },
  ],
  selected: ['read'],
  disabled: true
}) %>
```

### Empty selection

```ejs
<%- include('modules/ui/CheckboxGroup', {
  legend: 'Tags',
  options: [
    { value: 'design',   label: 'Design'   },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend',  label: 'Backend'  },
  ],
  selected: []
}) %>
```

## Full EJS source

```ejs
<%
  var _opts    = locals.options  || [];
  var _sel     = locals.selected || [];
  var _dis     = !!locals.disabled;
  var _legend  = locals.legend   || '';
%>
<fieldset class="space-y-2 <%= locals.className || '' %>" data-testid="checkboxgroup">
  <legend class="text-sm font-medium text-text-primary mb-2"><%= _legend %></legend>
  <div class="flex flex-wrap gap-2">
    <% _opts.forEach(function(opt) { %>
      <%
        var optValue = (opt && typeof opt === 'object') ? opt.value : opt;
        var optLabel = (opt && typeof opt === 'object') ? opt.label : opt;
        var isSelected = _sel.indexOf(optValue) !== -1;
      %>
      <label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors focus-within:ring-2 focus-within:ring-border-focus <%= _dis ? 'cursor-not-allowed opacity-50' : 'cursor-pointer' %> <%= isSelected ? 'bg-primary-subtle border-primary text-primary' : 'bg-surface-base border-border text-text-primary hover:bg-surface-overlay' %>">
        <input
          type="checkbox"
          value="<%= optValue %>"
          data-testid="checkboxgroup-<%= optValue %>"
          class="sr-only"
          <%= isSelected ? 'checked' : '' %>
          <%= _dis ? 'disabled' : '' %>
        >
        <% if (isSelected) { %>
          <span aria-hidden="true" class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-check"></i></span>
        <% } %>
        <span><%= optLabel %></span>
      </label>
    <% }); %>
  </div>
  <% if (locals.error) { %>
    <p class="text-xs text-error mt-1" role="alert"><%= locals.error %></p>
  <% } %>
</fieldset>

```
