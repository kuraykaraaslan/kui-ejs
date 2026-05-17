# Breadcrumb

- **id:** `breadcrumb`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Breadcrumb.ejs`
- **status:** stable
- **since:** 0.1

Hiyerarşik navigasyon izi. Font Awesome chevron separator, aria-current="page" son öğede.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',        href: '/' },
    { label: 'Products',    href: '/products' },
    { label: 'Laptop Pro 15' }
  ]
}) %>
```

### Single level

```ejs
<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',     href: '/' },
    { label: 'Settings' }
  ]
}) %>
```

### Deep hierarchy

```ejs
<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',       href: '/' },
    { label: 'Docs',       href: '/docs' },
    { label: 'Components', href: '/docs/components' },
    { label: 'UI',         href: '/docs/components/ui' },
    { label: 'Button' }
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _items     = locals.items     || [];
  var _className = locals.className || '';
%>
<nav aria-label="Breadcrumb"<%= _className ? ' class="' + _className + '"' : '' %>>
  <ol class="flex flex-wrap items-center gap-1 text-sm">
    <% _items.forEach(function (item, i) { %>
    <%
      var isLast = i === _items.length - 1;
    %>
    <li class="flex items-center gap-1">
      <% if (!isLast && item.href) { %>
      <a href="<%= item.href %>" class="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"><%= item.label %></a>
      <i class="fa-solid fa-chevron-right text-xs text-text-disabled" aria-hidden="true"></i>
      <% } else { %>
      <span class="<%= isLast ? 'text-text-primary font-medium' : 'text-text-secondary' %>"<%= isLast ? ' aria-current="page"' : '' %>><%= item.label %></span>
      <% if (!isLast) { %><i class="fa-solid fa-chevron-right text-xs text-text-disabled" aria-hidden="true"></i><% } %>
      <% } %>
    </li>
    <% }); %>
  </ol>
</nav>

```
