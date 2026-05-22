# InlineAlert

- **id:** `inline-alert`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/InlineAlert.ejs`
- **status:** stable
- **since:** 2026-05

Form alanlarının yanında veya kart içlerinde kullanılan kısa uyarı şeridi. success / error / warning / info variant'ları; ikon + tek satır mesaj.

## Design tokens consumed

- `--error`
- `--error-subtle`
- `--info`
- `--info-subtle`
- `--primary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--text-primary`
- `--warning`
- `--warning-subtle`

## Variants

### All variants

```ejs
<%- include('modules/app/InlineAlert', { variant: 'success', message: 'Settings saved successfully.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'error',   message: 'Failed to save. Check your input and try again.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'warning', message: 'Your subscription expires in 3 days.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'info',    message: 'A new version is available — refresh to update.' }) %>
```

### Below a form field

```ejs
<div class="space-y-2">
  <%- include('modules/ui/Input', { label: 'Email address', type: 'email', value: form.email, error: !!errors.email }) %>
  <% if (errors.email) { %>
    <%- include('modules/app/InlineAlert', { variant: 'error', message: errors.email }) %>
  <% } %>
</div>
```

## Full EJS source

```ejs
<%
  var _v         = locals.variant   || 'success';
  var _message   = locals.message   || '';
  var _className = locals.className || '';

  var variantMap = {
    success: { container: 'bg-success-subtle border-success text-success-fg',   icon: 'fa-check' },
    error:   { container: 'bg-error-subtle border-error text-error',            icon: 'fa-xmark' },
    warning: { container: 'bg-warning-subtle border-warning text-text-primary', icon: 'fa-triangle-exclamation' },
    info:    { container: 'bg-info-subtle border-info text-text-primary',       icon: 'fa-circle-info' },
  };
  var vm = variantMap[_v] || variantMap.success;
%>
<div class="rounded-lg border px-4 py-2.5 text-sm font-medium flex items-center gap-1.5 <%= vm.container %><%= _className ? ' ' + _className : '' %>">
  <span aria-hidden="true" class="w-3.5 h-3.5 inline-flex items-center justify-center shrink-0">
    <i class="fa-solid <%= vm.icon %>" style="font-size:14px"></i>
  </span>
  <span><%= _message %></span>
</div>

```
