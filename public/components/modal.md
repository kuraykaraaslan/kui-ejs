# Modal

- **id:** `modal`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Modal.ejs`
- **status:** stable
- **since:** 2025-02

Focus-trapped dialog. Closes on Escape and backdrop click. Requires role="dialog" + aria-modal + aria-labelledby; supports sm/md/lg sizes.

## Variants

### Default (md)

```ejs
<%- include('modules/ui/Modal', {
  id: 'confirm-modal',
  title: 'Confirm action',
  description: 'This action cannot be undone.',
  children: '<p>Are you sure you want to delete this item?</p>',
  footer: '<button onclick="closeModal('confirm-modal')">Cancel</button>'
}) %>

<!-- Trigger -->
<button onclick="openModal('confirm-modal')">Open modal</button>
```

### Small (sm)

```ejs
<%- include('modules/ui/Modal', {
  id: 'quick-note',
  title: 'Quick note',
  size: 'sm',
  children: '<p>A compact modal for short confirmations.</p>',
  footer: '<button onclick="closeModal('quick-note')">Got it</button>'
}) %>
```

### Large (lg)

```ejs
<%- include('modules/ui/Modal', {
  id: 'edit-profile',
  title: 'Edit profile',
  size: 'lg',
  children: '...',
  footer: '...'
}) %>
```

### No footer

```ejs
<%- include('modules/ui/Modal', {
  id: 'shortcuts',
  title: 'Keyboard shortcuts',
  description: 'Press ESC to close at any time.',
  children: '...'
}) %>
```

## Full EJS source

```ejs
<%- include('./Overlays/Modal/Modal', locals) %>

```
