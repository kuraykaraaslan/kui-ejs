# Select

- **id:** `select`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Select.ejs`
- **status:** stable
- **since:** 0.1

Label + select + hint + error anatomy. appearance-none ile native dropdown stilini override eder, chevron ikonu ile.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Select', {
  label: 'Role',
  placeholder: 'Select a role…',
  options: [
    { value: 'admin',  label: 'Admin'  },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]
}) %>
```

### With hint & selected value

```ejs
<%- include('modules/ui/Select', {
  label: 'Role',
  hint: 'Determines access level.',
  value: 'editor',
  options: ROLES
}) %>
```

### Error state

```ejs
<%- include('modules/ui/Select', {
  label: 'Plan',
  placeholder: 'Select a plan',
  required: true,
  error: 'Please select a plan.',
  options: PLANS
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/Select', { label: 'Plan', disabled: true, value: 'editor', options: ROLES }) %>
```

## Full EJS source

```ejs
<%
  var _id     = locals.id     || 'select-' + Math.random().toString(36).substr(2, 9);
  var _dis    = locals.disabled  ? 'disabled' : '';
  var _req    = locals.required  ? 'required' : '';
  var _opts   = locals.options   || [];
  var _sz     = locals.size      || 'md';

  var sc = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }[_sz] || 'px-3 py-2 text-sm';

  var baseClass = 'block w-full rounded-md border bg-surface-base text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken transition-colors';
  var stateClass = locals.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border hover:border-border-strong';
%>
<div class="w-full <%= locals.className || '' %>">
  <% if (locals.label) { %>
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1.5">
      <%= locals.label %><% if (locals.required) { %> <span class="text-error">*</span><% } %>
    </label>
  <% } %>
  <div class="relative">
    <select
      id="<%= _id %>"
      class="<%= baseClass %> <%= stateClass %> <%= sc %> pr-8"
      <%= _dis %>
      <%= _req %>
      <% if (locals.name)  { %>name="<%= locals.name %>"<% } %>
      <% if (locals.value !== undefined) { %>
        onchange="this.dataset.value=this.value"
        data-value="<%= locals.value %>"
      <% } %>
    >
      <% if (locals.placeholder) { %>
        <option value=""><%= locals.placeholder %></option>
      <% } %>
      <% _opts.forEach(function(opt) { %>
        <option value="<%= opt.value %>" <%= (locals.value !== undefined && locals.value == opt.value) ? 'selected' : '' %>><%= opt.label %></option>
      <% }); %>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-disabled">
      <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
    </div>
  </div>
  <% if (locals.hint || locals.error) { %>
    <p class="mt-1.5 text-sm <%= locals.error ? 'text-error' : 'text-text-secondary' %>">
      <%= locals.error || locals.hint %>
    </p>
  <% } %>
</div>

```
