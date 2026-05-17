# Toast

- **id:** `toast`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Toast.ejs`
- **status:** stable
- **since:** 0.1

Kısa süreli bildirim kartı. success/warning/error/info/loading varyantları; title, message ve action desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--info`
- `--info-subtle`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Success

```ejs
<%- include('modules/ui/Toast', {
  variant: 'success',
  title: 'File uploaded',
  message: 'report.pdf has been uploaded successfully.'
}) %>
```

### Error

```ejs
<%- include('modules/ui/Toast', {
  variant: 'error',
  title: 'Upload failed',
  message: 'The file exceeds the 10 MB size limit.',
  actionLabel: 'Try again'
}) %>
```

### Warning

```ejs
<%- include('modules/ui/Toast', {
  variant: 'warning',
  message: 'Session expires in 5 minutes.'
}) %>
```

### Info

```ejs
<%- include('modules/ui/Toast', {
  variant: 'info',
  title: 'New update',
  message: 'Version 2.4 is available. Refresh to apply.'
}) %>
```

### Loading

```ejs
<%- include('modules/ui/Toast', {
  variant: 'loading',
  message: 'Saving your changes…',
  persistent: true
}) %>
```

## Full EJS source

```ejs
<%
  var _v           = locals.variant     || 'info';
  var _title       = locals.title       || '';
  var _message     = locals.message     || '';
  var _actionLabel = locals.actionLabel || '';
  var _actionHref  = locals.actionHref  || '';
  var _persistent  = !!locals.persistent;

  var variantMap = {
    success: { container: 'bg-success-subtle border-success', iconColor: 'text-success-fg', icon: 'fa-circle-check' },
    warning: { container: 'bg-warning-subtle border-warning', iconColor: 'text-warning',    icon: 'fa-triangle-exclamation' },
    error:   { container: 'bg-error-subtle border-error',     iconColor: 'text-error',      icon: 'fa-circle-xmark' },
    info:    { container: 'bg-info-subtle border-info',       iconColor: 'text-info',        icon: 'fa-circle-info' },
    loading: { container: 'bg-surface-raised border-border',  iconColor: 'text-text-secondary', icon: 'fa-spinner fa-spin' },
  };
  var vm = variantMap[_v] || variantMap.info;
%>
<div class="relative w-80 rounded-xl border shadow-lg overflow-hidden pointer-events-auto <%= vm.container %>">
  <div class="flex items-start gap-3 px-4 pt-4 pb-3">
    <i class="fa-solid <%= vm.icon %> mt-0.5 shrink-0 <%= vm.iconColor %>" aria-hidden="true"></i>
    <div class="flex-1 min-w-0">
      <% if (_title) { %><p class="text-sm font-semibold text-text-primary leading-snug"><%= _title %></p><% } %>
      <p class="text-sm text-text-secondary leading-snug<%= _title ? ' mt-0.5' : '' %>"><%= _message %></p>
      <% if (_actionLabel) { %>
      <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
        <% if (_actionHref) { %>
        <a href="<%= _actionHref %>" class="text-xs font-semibold rounded underline underline-offset-2 text-text-primary hover:opacity-70"><%= _actionLabel %></a>
        <% } else { %>
        <button type="button" class="text-xs font-semibold rounded underline underline-offset-2 text-text-primary hover:opacity-70"><%= _actionLabel %></button>
        <% } %>
      </div>
      <% } %>
    </div>
    <% if (!_persistent) { %>
    <button
      type="button"
      aria-label="Dismiss"
      onclick="this.closest('.rounded-xl').style.display='none'"
      class="shrink-0 mt-0.5 rounded text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <i class="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
    </button>
    <% } %>
  </div>
</div>

```
