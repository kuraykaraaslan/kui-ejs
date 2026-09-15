# ScrollArea

- **id:** `scroll-area`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/ScrollArea.ejs`
- **status:** stable
- **since:** 2026-09

Scrollable container with a themed, thin scrollbar (Firefox scrollbar-color + WebKit pseudo-elements) instead of the bulky native default. Supports vertical, horizontal, or both-axis scrolling.

## Design tokens consumed

- `--border`
- `--border-strong`

## Variants

### Vertical list

```ejs
<%- include('modules/ui/ScrollArea', {
  className: 'h-40 w-64 border border-border p-3',
  children: itemListHtml
}) %>
```

### Horizontal

```ejs
<%- include('modules/ui/ScrollArea', {
  orientation: 'horizontal',
  className: 'w-full border border-border p-3',
  children: cardsRowHtml
}) %>
```

## Full EJS source

```ejs
<%
  var _orientation = locals.orientation || 'vertical';
  var _className   = locals.className || '';

  var overflowClasses = {
    vertical:   'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both:       'overflow-auto',
  };
  var _overflow = overflowClasses[_orientation] || overflowClasses.vertical;
%>
<div
  class="relative rounded-md <%= _overflow %> [scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full<%= _className ? ' ' + _className : '' %>"
><% if (locals.children) { %><%- locals.children %><% } %></div>

```
