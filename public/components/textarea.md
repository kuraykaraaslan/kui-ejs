# Textarea

- **id:** `textarea`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Textarea.ejs`
- **status:** stable
- **since:** 2025-02

Çok satırlı metin giriş alanı. Label, hint, error ve disabled durumları; resize kontrolü destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
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
  var _id   = locals.id   || 'textarea-' + Math.random().toString(36).substr(2, 9);
  var _rows = locals.rows || 4;
  var _dis  = !!locals.disabled;
  var _req  = !!locals.required;
  var _val  = (locals.value !== undefined && locals.value !== null) ? String(locals.value) : '';

  var _hintId  = (locals.hint  && !locals.error) ? (_id + '-hint')  : '';
  var _errorId = locals.error ? (_id + '-error') : '';
  var _describedBy = [_hintId, _errorId].filter(function (x) { return !!x; }).join(' ');

  var baseClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors resize-y '
    + 'text-text-primary placeholder:text-text-disabled '
    + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus '
    + 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken ';
  baseClass += locals.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border bg-surface-base';
%>
<div class="space-y-1 <%= locals.className || '' %>">
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary">
    <%= locals.label || '' %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %>
  </label>
  <textarea
    id="<%= _id %>"
    rows="<%= _rows %>"
    class="<%= baseClass %>"
    <% if (locals.placeholder) { %>placeholder="<%= locals.placeholder %>"<% } %>
    <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
    <% if (_dis) { %>disabled<% } %>
    <% if (_req) { %>required<% } %>
    aria-invalid="<%= locals.error ? 'true' : 'false' %>"
    <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
    data-testid="textarea-<%= _id %>"
  ><%= _val %></textarea>
  <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= locals.hint %></p><% } %>
  <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= locals.error %></p><% } %>
</div>

```
