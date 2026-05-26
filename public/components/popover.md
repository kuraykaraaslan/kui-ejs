# Popover

- **id:** `popover`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Popover.ejs`
- **status:** stable
- **since:** 2026-05

Anchor-based contextual panel. Closes on outside click and Escape key. Supports top/bottom/left/right placement.

## Variants

### Info popover (bottom)

```ejs
<%- include('modules/ui/Popover', {
  id: 'pro-info',
  trigger: '<button>What is Pro?</button>',
  placement: 'bottom',
  children: '<div class="p-4 w-64">...</div>'
}) %>
```

### Inline form (right)

```ejs
<%- include('modules/ui/Popover', {
  id: 'note-popover',
  trigger: '<button>Add note</button>',
  placement: 'right',
  children: '<div class="p-4 w-72">...</div>'
}) %>
```

### List menu (top)

```ejs
<%- include('modules/ui/Popover', {
  id: 'account-popover',
  trigger: '<button>Account</button>',
  placement: 'top',
  children: '<ul class="py-1 w-56">...</ul>'
}) %>
```

## Full EJS source

```ejs
<%- include('./Overlays/Popover/Popover', locals) %>

```
