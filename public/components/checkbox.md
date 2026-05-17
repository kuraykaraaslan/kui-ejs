# Checkbox

- **id:** `checkbox`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Checkbox.ejs`
- **status:** stable
- **since:** 0.1

Tekil boolean seçim kontrolü. Label, hint ve disabled durumları; 3 boyut destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--secondary`
- `--surface-base`
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
  var _sz = locals.size || 'md';
  var _ch = locals.checked ? 'checked' : '';
  var _dis = locals.disabled ? 'disabled' : '';
  var _id = locals.id || 'checkbox-' + Math.random().toString(36).substr(2, 9);
  
  var sc = {
    sm: 'w-3.5 h-3.5 text-xs',
    md: 'w-4 h-4 text-sm',
    lg: 'w-5 h-5 text-base',
  }[_sz] || 'w-4 h-4 text-sm';
%>
<div class="flex items-start <%= locals.className || '' %>">
  <div class="flex items-center h-5">
    <input id="<%= _id %>" type="checkbox" <%= _ch %> <%= _dis %>
      class="rounded border-border text-primary focus:ring-2 focus:ring-border-focus bg-surface-base <%= sc %> <%= _dis ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' %>"
      <% if(locals.onchange) { %>onchange="<%= locals.onchange %>"<% } %>
    >
  </div>
  <% if (locals.label || locals.hint) { %>
    <div class="ml-3 text-sm">
      <% if (locals.label) { %>
        <label for="<%= _id %>" class="font-medium text-text-primary <%= _dis ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' %>"><%= locals.label %></label>
      <% } %>
      <% if (locals.hint) { %>
        <p class="text-text-secondary mt-0.5 <%= locals.error ? 'text-error' : '' %>"><%= locals.hint %></p>
      <% } %>
    </div>
  <% } %>
</div>

```
