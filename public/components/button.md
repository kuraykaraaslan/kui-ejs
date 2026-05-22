# Button

- **id:** `button`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Button.ejs`
- **status:** stable
- **since:** 2025-01

Temel interaktif element. 5 görsel stil (variant) ve 5 boyut (size) destekler. disabled, loading ve selected durumları yerleşiktir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--secondary-fg`
- `--secondary-hover`
- `--surface-overlay`
- `--text-inverse`
- `--text-primary`

## Variants

### Primary

```ejs
<%- include('modules/ui/Button', { children: 'Primary' }) %>
```

### Secondary

```ejs
<%- include('modules/ui/Button', { variant: 'secondary', children: 'Secondary' }) %>
```

### Ghost

```ejs
<%- include('modules/ui/Button', { variant: 'ghost', children: 'Ghost' }) %>
```

### Danger

```ejs
<%- include('modules/ui/Button', { variant: 'danger', children: 'Danger' }) %>
```

### Outline

```ejs
<%- include('modules/ui/Button', { variant: 'outline', children: 'Outline' }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Button', { disabled: true, children: 'Disabled' }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Button', { size: 'xs', children: 'XS' }) %>
<%- include('modules/ui/Button', { size: 'sm', children: 'SM' }) %>
<%- include('modules/ui/Button', { size: 'md', children: 'MD' }) %>
<%- include('modules/ui/Button', { size: 'lg', children: 'LG' }) %>
<%- include('modules/ui/Button', { size: 'xl', children: 'XL' }) %>
```

### Icon left / right

```ejs
<%- include('modules/ui/Button', { iconLeft: '<i class="fa-solid fa-download"></i>', children: 'Download' }) %>
<%- include('modules/ui/Button', { variant: 'outline', iconRight: '<i class="fa-solid fa-arrow-right"></i>', children: 'Next' }) %>
```

### Icon only

```ejs
<%- include('modules/ui/Button', { ariaLabel: 'Delete item', children: '<i class="fa-solid fa-trash"></i>' }) %>
<%- include('modules/ui/Button', { variant: 'outline', ariaLabel: 'Edit item', children: '<i class="fa-solid fa-pen"></i>' }) %>
```

### Selected / active state

```ejs
<%- include('modules/ui/Button', { variant: 'outline', selected: true,  children: 'Selected' }) %>
<%- include('modules/ui/Button', { variant: 'outline', selected: false, children: 'Default' }) %>
```

### Loading state

```ejs
<%- include('modules/ui/Button', { loading: true, children: 'Saving…' }) %>
<%- include('modules/ui/Button', { variant: 'outline', loading: true, children: 'Loading details' }) %>
```

### As Link (element override)

```ejs
<%- include('modules/ui/Button', { element: 'a', href: '/docs', children: 'Go to docs' }) %>
<%- include('modules/ui/Button', { element: 'a', href: 'https://example.com', target: '_blank', variant: 'outline', children: 'Open in new tab' }) %>
<%- include('modules/ui/Button', { element: 'a', href: '/next', variant: 'secondary', iconRight: '<i class="fa-solid fa-arrow-right"></i>', children: 'Next page' }) %>
<%- include('modules/ui/Button', { element: 'a', href: '#', disabled: true, children: 'Disabled link' }) %>
```

### Full width

```ejs
<%- include('modules/ui/Button', { fullWidth: true, children: 'Full-width primary' }) %>
<%- include('modules/ui/Button', { variant: 'outline', fullWidth: true, children: 'Full-width outline' }) %>
```

## Full EJS source

```ejs
<%
var _el      = locals.element  || 'button';
var _v       = locals.variant  || 'primary';
var _sz      = locals.size     || 'md';
var _tp      = locals.type     || 'button';
var _loading = locals.loading  || false;
var _dis     = locals.disabled || _loading;
var _sel     = locals.selected || false;
var _iconOnly = !!locals.iconOnly;
var _isBtn   = _el === 'button';
var _isLink  = _el === 'a';

var vc = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
  ghost:     'bg-transparent text-text-primary hover:bg-surface-overlay',
  danger:    'bg-error text-text-inverse hover:opacity-90',
  outline:   'border border-border text-text-primary hover:bg-surface-overlay',
}[_v] || 'bg-primary text-primary-fg hover:bg-primary-hover';

var sc = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
}[_sz] || 'px-4 py-2 text-sm';

var iconOnlySc = {
  xs: 'p-1 text-xs',
  sm: 'p-1.5 text-sm',
  md: 'p-2 text-sm',
  lg: 'p-2.5 text-base',
  xl: 'p-3 text-lg',
}[_sz] || 'p-2 text-sm';

var sizeClass = _iconOnly ? iconOnlySc : sc;

var selClass  = _sel ? ' ring-2 ring-border-focus' : '';
var disClass  = (_dis && !_isBtn) ? ' opacity-50 pointer-events-none cursor-not-allowed' : '';
%><<%= _el %>
  <% if (_isBtn) { %>type="<%= _tp %>"<% } %>
  <% if (_isLink && locals.href) { %>href="<%= locals.href %>"<% } %>
  <% if (_isLink && locals.target) { %>target="<%= locals.target %>"<% } %>
  <% if (_isLink && locals.target === '_blank') { %>rel="<%= locals.rel || 'noopener noreferrer' %>"<% } %>
  class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed <%= vc %> <%= sizeClass %><%= locals.fullWidth ? ' w-full' : '' %><%= selClass %><%= disClass %><%= locals.className ? ' ' + locals.className : '' %>"
  <% if (_dis && _isBtn)  { %>disabled<% } %>
  <% if (_dis && _isLink) { %>aria-disabled="true" tabindex="-1"<% } %>
  <% if (_loading) { %>aria-busy="true"<% } %>
  <% if (locals.ariaLabel) { %>aria-label="<%= locals.ariaLabel %>"<% } %>
  <% if (_sel || locals.ariaPressed !== undefined) { %>aria-pressed="<%= _sel ? 'true' : locals.ariaPressed %>"<% } %>
>
  <% if (_loading) { %>
    <span aria-hidden="true" class="inline-block rounded-full border-current border-t-transparent animate-spin shrink-0 h-4 w-4 border-2"></span>
  <% } else if (locals.iconLeft) { %>
    <span aria-hidden="true" class="shrink-0"><%- locals.iconLeft %></span>
  <% } %>
  <% if (locals.children) { %><%= locals.children %><% } %>
  <% if (!_loading && locals.iconRight) { %><span aria-hidden="true" class="shrink-0"><%- locals.iconRight %></span><% } %>
</<%= _el %>>

```
