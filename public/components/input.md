# Input

- **id:** `input`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Input.ejs`
- **status:** stable
- **since:** 0.1

Metin giriş alanı. Label, hint, error, prefix icon, password toggle ve 3 boyut destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Input', { id: 'email', label: 'Email address', placeholder: 'you@example.com' }) %>
```

### Required

```ejs
<%- include('modules/ui/Input', { id: 'name', label: 'Full name', required: true, placeholder: 'Jane Doe' }) %>
```

### With hint

```ejs
<%- include('modules/ui/Input', { id: 'user', label: 'Username', hint: 'Letters, numbers and underscores only' }) %>
```

### Error state

```ejs
<%- include('modules/ui/Input', { id: 'email', label: 'Email address', error: 'Enter a valid email address' }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Input', { id: 'acc', label: 'Account ID', disabled: true }) %>
```

### Password

```ejs
<%- include('modules/ui/Input', { id: 'pw', label: 'Password', type: 'password', placeholder: '••••••••' }) %>
```

### Prefix icon

```ejs
<%- include('modules/ui/Input', { id: 'search', label: 'Search', iconLeft: '<i class=\"fa-solid fa-magnifying-glass\"></i>', placeholder: 'Search…' }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Input', { id: 'sm', label: 'Small',  size: 'sm' }) %>
<%- include('modules/ui/Input', { id: 'md', label: 'Medium', size: 'md' }) %>
<%- include('modules/ui/Input', { id: 'lg', label: 'Large',  size: 'lg' }) %>
```

## Full EJS source

```ejs
<%
  var _sz = locals.size || 'md';
  var _dis = locals.disabled ? 'disabled' : '';
  var _id = locals.id || 'input-' + Math.random().toString(36).substr(2, 9);
  var _type = locals.type || 'text';
  
  var sc = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }[_sz] || 'px-3 py-2 text-sm';

  var baseInputClass = 'block w-full rounded-md border bg-surface-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  var stateClass = locals.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border hover:border-border-strong';

  var iconPaddingClass = locals.iconLeft ? 'pl-9' : '';
%>
<div class="w-full <%= locals.className || '' %>">
  <% if (locals.label) { %>
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1.5">
      <%= locals.label %> <% if (locals.required) { %><span class="text-error">*</span><% } %>
    </label>
  <% } %>
  <div class="relative">
    <% if (locals.iconLeft) { %>
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-disabled">
        <%- locals.iconLeft %>
      </div>
    <% } %>
    <input 
      type="<%= _type %>" 
      id="<%= _id %>" 
      class="<%= baseInputClass %> <%= stateClass %> <%= sc %> <%= iconPaddingClass %>"
      <% if (locals.placeholder) { %>placeholder="<%= locals.placeholder %>"<% } %>
      <% if (locals.value) { %>value="<%= locals.value %>"<% } %>
      <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
      <%= _dis %>
      <% if (locals.required) { %>required<% } %>
    >
  </div>
  <% if (locals.hint || locals.error) { %>
    <p class="mt-1.5 text-sm <%= locals.error ? 'text-error' : 'text-text-secondary' %>">
      <%= locals.error || locals.hint %>
    </p>
  <% } %>
</div>

```
