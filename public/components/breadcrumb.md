# Breadcrumb

- **id:** `breadcrumb`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Breadcrumb.ejs`
- **status:** stable
- **since:** 2025-02

Hierarchical navigation trail wrapped in nav aria-label="Breadcrumb". Last item marked with aria-current="page" and aria-hidden separators.

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
  var _maxItems  = locals.maxItems  || 0;
  var _className = locals.className || '';

  var displayed = _items;
  var truncated = false;
  if (_maxItems && _items.length > _maxItems) {
    truncated = true;
    // first + ellipsis + last (_maxItems - 1) items
    var tail = _items.slice(_items.length - (_maxItems - 1));
    displayed = [_items[0], { label: '…', href: undefined, _isEllipsis: true }].concat(tail);
  }
%>
<nav aria-label="Breadcrumb"<%= _className ? ' class="' + _className + '"' : '' %>>
  <ol class="flex flex-wrap items-center gap-1 text-sm">
    <% displayed.forEach(function (item, i) { %>
    <%
      var isLast      = i === displayed.length - 1;
      var isEllipsis  = !!item._isEllipsis;
    %>
    <li class="flex items-center gap-1">
      <% if (!isLast && item.href && !isEllipsis) { %>
      <a href="<%= item.href %>" class="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"><%= item.label %></a>
      <span class="w-2.5 h-2.5 inline-flex items-center justify-center text-text-disabled" aria-hidden="true"><i class="fa-solid fa-chevron-right" style="font-size:10px"></i></span>
      <% } else { %>
      <span
        class="<%= isLast ? 'text-text-primary font-medium' : 'text-text-secondary' %><%= isEllipsis ? ' select-none' : '' %>"
        <% if (isLast) { %>aria-current="page"<% } %>
        <% if (isEllipsis) { %>aria-hidden="true"<% } %>
      ><%= item.label %></span>
      <% if (!isLast) { %><span class="w-2.5 h-2.5 inline-flex items-center justify-center text-text-disabled" aria-hidden="true"><i class="fa-solid fa-chevron-right" style="font-size:10px"></i></span><% } %>
      <% } %>
    </li>
    <% }); %>
  </ol>
</nav>

```
