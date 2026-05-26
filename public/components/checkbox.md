# Checkbox

- **id:** `checkbox`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Checkbox.ejs`
- **status:** stable
- **since:** 2025-02

Label + checkbox + optional hint / error message. aria-describedby is wired up and border-error is applied on the error state.

## Used by

- `form-builder`

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--secondary`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Accept terms and conditions' }) %>
```

### Checked

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Remember me', checked: true }) %>
```

### With hint

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Subscribe to newsletter', hint: 'We send at most one email per week' }) %>
```

### Error state

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Accept terms', hint: 'You must accept the terms', error: true }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb1', label: 'Option A', disabled: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb2', label: 'Option B', checked: true, disabled: true }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Checkbox', { id: 'cb1', label: 'Small',  size: 'sm', checked: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb2', label: 'Medium', size: 'md', checked: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb3', label: 'Large',  size: 'lg', checked: true }) %>
```

## Full EJS source

```ejs
<%
  var _ch    = locals.checked ? 'checked' : '';
  var _dis   = locals.disabled ? 'disabled' : '';
  var _id    = locals.id || 'checkbox-' + Math.random().toString(36).substr(2, 9);
  var _error = locals.error || '';
  var _hint  = locals.hint  || '';
  var _label = locals.label || '';
  var _indet = !!locals.indeterminate;

  var hintId  = _hint  ? (_id + '-hint')  : '';
  var errorId = _error ? (_id + '-error') : '';
  var describedBy = [hintId, errorId].filter(Boolean).join(' ');
%>
<div class="flex items-start gap-3 <%= locals.className || '' %>" data-testid="checkbox-<%= _id %>">
  <input id="<%= _id %>" type="checkbox" <%= _ch %> <%= _dis %>
    class="mt-0.5 h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed <%= _error ? 'border-error' : '' %>"
    <% if (describedBy) { %>aria-describedby="<%= describedBy %>"<% } %>
    <% if (_error) { %>aria-invalid="true"<% } %>
    <% if (_indet) { %>aria-checked="mixed"<% } %>
    <% if(locals.onchange) { %>onchange="<%= locals.onchange %>"<% } %>
  >
  <div>
    <% if (_label) { %>
      <label for="<%= _id %>" class="text-sm font-medium <%= _dis ? 'text-text-disabled' : 'text-text-primary' %> <%= _dis ? 'cursor-not-allowed' : 'cursor-pointer' %>"><%= _label %></label>
    <% } %>
    <% if (_hint && !_error) { %>
      <p id="<%= hintId %>" class="text-xs text-text-secondary mt-0.5"><%= _hint %></p>
    <% } %>
    <% if (_error) { %>
      <p id="<%= errorId %>" class="text-xs text-error mt-0.5" role="alert"><%= _error %></p>
    <% } %>
  </div>
</div>

```
