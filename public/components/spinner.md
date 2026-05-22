# Spinner

- **id:** `spinner`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Spinner.ejs`
- **status:** stable
- **since:** 2025-01

CSS border tabanlı yükleme göstergesi. FontAwesome gerektirmez. 5 boyut, border-border / border-t-primary renk sistemi.

## Design tokens consumed

- `--border`

## Variants

### Sizes

```ejs
<%- include('modules/ui/Spinner', { size: 'xs' }) %>
<%- include('modules/ui/Spinner', { size: 'sm' }) %>
<%- include('modules/ui/Spinner', { size: 'md' }) %>
<%- include('modules/ui/Spinner', { size: 'lg' }) %>
<%- include('modules/ui/Spinner', { size: 'xl' }) %>
```

### In a Button

```ejs
<%- include('modules/ui/Button', { variant: 'primary', loading: true, children: 'Saving…' }) %>
<%- include('modules/ui/Button', { variant: 'outline', loading: true, children: 'Loading details' }) %>
```

## Full EJS source

```ejs
<%
var _sz = locals.size || 'md';
var sc = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-4',
}[_sz] || 'h-6 w-6 border-2';
%>
<span aria-hidden="true" class="inline-block rounded-full border-border border-t-primary animate-spin <%= sc %><%= locals.className ? ' ' + locals.className : '' %>"></span>
<span class="sr-only">Loading…</span>

```
