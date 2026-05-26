# FileInput

- **id:** `file-input`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/FileInput.ejs`
- **status:** stable
- **since:** 2025-02

Drag-and-drop file upload with validation, file list, and individual remove actions.

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
<%- include('./FileInput/FileInput', locals) %>

```
