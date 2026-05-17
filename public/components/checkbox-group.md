# CheckboxGroup

- **id:** `checkbox-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/CheckboxGroup.ejs`
- **status:** stable
- **since:** 0.1

Chip görünümlü çoklu seçim grubu. Seçili chip bg-primary-subtle / border-primary renk tokenları ile işaretlenir.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-subtle`
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
%>
<fieldset class="<%= locals.className || '' %>">
  <% if (locals.legend) { %>
    <legend class="text-sm font-medium text-text-primary mb-3"><%= locals.legend %></legend>
  <% } %>
  <div class="flex flex-wrap gap-2">
    <% _opts.forEach(function(opt) { %>
      <%
        var isSelected = _sel.indexOf(opt.value) !== -1 || _sel.indexOf(opt) !== -1;
      %>
      <label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors focus-within:ring-2 focus-within:ring-primary/20 cursor-pointer <%= _dis ? 'opacity-50 cursor-not-allowed' : '' %> <%= isSelected ? 'bg-primary-subtle border-primary text-primary' : 'bg-surface border-border text-text-primary hover:bg-surface-overlay' %>">
        <input
          type="checkbox"
          value="<%= opt.value || opt %>"
          class="sr-only"
          <%= isSelected ? 'checked' : '' %>
          <%= _dis ? 'disabled' : '' %>
        >
        <% if (isSelected) { %>
          <i class="fa-solid fa-check text-xs" aria-hidden="true"></i>
        <% } %>
        <span><%= opt.label || opt %></span>
      </label>
    <% }); %>
  </div>
  <% if (locals.error) { %>
    <p class="mt-2 text-xs text-error" role="alert"><%= locals.error %></p>
  <% } %>
</fieldset>

```
