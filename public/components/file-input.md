# FileInput

- **id:** `file-input`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/FileInput.ejs`
- **status:** stable
- **since:** 0.1

Drag-and-drop görünümlü dosya yükleme alanı. accept filtresi, multiple ve disabled desteği.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Single file

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Profile photo',
  hint: 'PNG or JPG, max 2 MB',
  accept: 'image/*'
}) %>
```

### Multiple files

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Attachments',
  hint: 'Up to 5 MB each',
  multiple: true
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/FileInput', { label: 'Disabled upload', disabled: true }) %>
```

### With error

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Document',
  hint: 'PDF only',
  accept: '.pdf',
  error: 'Please upload a valid PDF file.'
}) %>
```

## Full EJS source

```ejs
<%
  var _id       = locals.id       || 'file-' + Math.random().toString(36).substr(2, 9);
  var _multiple = locals.multiple  ? 'multiple' : '';
  var _accept   = locals.accept    || '';
  var _dis      = locals.disabled  ? 'disabled' : '';
%>
<div class="w-full <%= locals.className || '' %>">
  <% if (locals.label) { %>
    <label class="block text-sm font-medium text-text-primary mb-1.5">
      <%= locals.label %><% if (locals.required) { %> <span class="text-error">*</span><% } %>
    </label>
  <% } %>
  <label
    for="<%= _id %>"
    class="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed px-6 py-8 transition-colors cursor-pointer <%= locals.disabled ? 'opacity-50 cursor-not-allowed border-border bg-surface-sunken' : 'border-border bg-surface hover:border-primary hover:bg-primary-subtle/30' %>"
  >
    <div class="flex flex-col items-center gap-2 text-center">
      <i class="fa-solid fa-cloud-arrow-up text-2xl <%= locals.disabled ? 'text-text-tertiary' : 'text-text-secondary' %>" aria-hidden="true"></i>
      <div>
        <p class="text-sm font-medium text-text-primary">
          <span class="text-primary">Click to upload</span> or drag and drop
        </p>
        <% if (locals.hint) { %>
          <p class="text-xs text-text-secondary mt-0.5"><%= locals.hint %></p>
        <% } %>
        <% if (_accept) { %>
          <p class="text-xs text-text-tertiary mt-0.5">Accepted: <%= _accept %></p>
        <% } %>
      </div>
    </div>
    <input
      id="<%= _id %>"
      type="file"
      class="sr-only"
      <%= _multiple %>
      <%= _dis %>
      <% if (_accept) { %>accept="<%= _accept %>"<% } %>
      <% if (locals.name)  { %>name="<%= locals.name %>"<% } %>
    >
  </label>
  <% if (locals.error) { %>
    <p class="mt-1.5 text-sm text-error"><%= locals.error %></p>
  <% } %>
</div>

```
