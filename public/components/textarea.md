# Textarea

- **id:** `textarea`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Textarea.ejs`
- **status:** stable
- **since:** 0.1

Çok satırlı metin giriş alanı. Label, hint, error ve disabled durumları; resize kontrolü destekler.

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
<%- include('modules/ui/Textarea', { id: 'msg', label: 'Message', placeholder: 'Enter your message…' }) %>
```

### Required

```ejs
<%- include('modules/ui/Textarea', { id: 'desc', label: 'Description', required: true }) %>
```

### With hint

```ejs
<%- include('modules/ui/Textarea', { id: 'bio', label: 'Bio', hint: 'Max 500 characters', placeholder: 'Tell us about yourself' }) %>
```

### Error state

```ejs
<%- include('modules/ui/Textarea', { id: 'notes', label: 'Notes', error: 'This field is required' }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Textarea', { id: 'ro', label: 'Read-only notes', disabled: true, value: 'This field cannot be edited.' }) %>
```

### Resize none

```ejs
<%- include('modules/ui/Textarea', { id: 'fixed', label: 'Fixed height', resize: 'none', rows: 4 }) %>
```

### Custom rows

```ejs
<%- include('modules/ui/Textarea', { id: 'long', label: 'Long-form content', rows: 6 }) %>
```

## Full EJS source

```ejs
<%
  var _sz  = locals.size     || 'md';
  var _dis = locals.disabled ? 'disabled' : '';
  var _id  = locals.id || 'textarea-' + Math.random().toString(36).substr(2, 9);
  var _rows = locals.rows || 4;

  var sc = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }[_sz] || 'px-3 py-2 text-sm';

  var baseInputClass = 'block w-full rounded-md border bg-surface-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  var stateClass = locals.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border hover:border-border-strong';
%>
<div class="w-full <%= locals.className || '' %>">
  <% if (locals.label) { %>
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1.5">
      <%= locals.label %> <% if (locals.required) { %><span class="text-error">*</span><% } %>
    </label>
  <% } %>
  <textarea 
    id="<%= _id %>" 
    rows="<%= _rows %>"
    class="<%= baseInputClass %> <%= stateClass %> <%= sc %><%= locals.resize === 'none' ? ' resize-none' : '' %>"
    <% if (locals.placeholder) { %>placeholder="<%= locals.placeholder %>"<% } %>
    <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
    <%= _dis %>
    <% if (locals.required) { %>required<% } %>
  ><% if (locals.value) { %><%= locals.value %><% } %></textarea>
  <% if (locals.hint || locals.error) { %>
    <p class="mt-1.5 text-sm <%= locals.error ? 'text-error' : 'text-text-secondary' %>">
      <%= locals.error || locals.hint %>
    </p>
  <% } %>
</div>

```
