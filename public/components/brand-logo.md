# BrandLogo

- **id:** `brand-logo`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/BrandLogo.ejs`
- **status:** stable
- **since:** 2026-05

Square brand mark with rounded corners. Renders a single letter or short token on a primary-coloured tile. 5 sizes (sm → 2xl).

## Design tokens consumed

- `--primary`
- `--primary-fg`

## Variants

### Default sizes

```ejs
<%- include('modules/ui/BrandLogo', { size: 'sm',  children: 'A' }) %>
<%- include('modules/ui/BrandLogo', { size: 'md',  children: 'B' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg',  children: 'C' }) %>
<%- include('modules/ui/BrandLogo', { size: 'xl',  children: 'D' }) %>
<%- include('modules/ui/BrandLogo', { size: '2xl', children: 'E' }) %>
```

### Custom content

```ejs
<%- include('modules/ui/BrandLogo', { size: 'lg', children: 'KU' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg', className: 'bg-secondary', children: 'N' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg', className: 'bg-success',   children: '✓' }) %>
```

## Full EJS source

```ejs
<%
var _size = locals.size || 'md';
var _cls  = locals.className || '';

var sizeMap = {
  'sm':  'h-8 w-8 text-sm',
  'md':  'h-12 w-12 text-lg',
  'lg':  'h-16 w-16 text-2xl',
  'xl':  'h-20 w-20 text-3xl',
  '2xl': 'h-24 w-24 text-4xl',
};
var _sc = sizeMap[_size] || sizeMap['md'];
%>
<span class="flex items-center justify-center rounded-2xl bg-primary text-primary-fg font-bold shadow-sm <%= _sc %><%= _cls ? ' ' + _cls : '' %>">
  <%- locals.children %>
</span>

```
