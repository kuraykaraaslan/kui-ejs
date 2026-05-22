# Card

- **id:** `card`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Card.ejs`
- **status:** stable
- **since:** 2025-02

İçerik kartı. raised/flat/outline varyantları; title, subtitle, headerRight, footer ve loading skeleton desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (raised)

```ejs
<%- include('modules/ui/Card', {
  title: 'Card title',
  subtitle: 'Optional subtitle',
  children: '<p>Card body content goes here.</p>',
  footer: '<div class="flex justify-end gap-2">...</div>'
}) %>
```

### Flat

```ejs
<%- include('modules/ui/Card', {
  title: 'Flat card',
  variant: 'flat',
  children: '<p>No shadow, transparent background.</p>'
}) %>
```

### Outline

```ejs
<%- include('modules/ui/Card', {
  title: 'Outline card',
  variant: 'outline',
  children: '<p>Border only, no background fill.</p>'
}) %>
```

### Hoverable

```ejs
<%- include('modules/ui/Card', {
  title: 'Hoverable card',
  hoverable: true,
  children: '<p>Hover to see the shadow lift effect.</p>'
}) %>
```

### Loading skeleton

```ejs
<%- include('modules/ui/Card', { loading: true }) %>
```

### With headerRight

```ejs
<%- include('modules/ui/Card', {
  title: 'Recent activity',
  subtitle: 'Last 7 days',
  headerRight: '<span class="text-xs font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded-full">Live</span>',
  children: '<p>Activity feed content here.</p>'
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || '';
  var _subtitle    = locals.subtitle    || '';
  var _headerRight = locals.headerRight || '';
  var _footer      = locals.footer      || '';
  var _v           = locals.variant     || 'raised';
  var _hoverable   = !!locals.hoverable;
  var _loading     = !!locals.loading;
  var _className   = locals.className   || '';
  var _onClick     = locals.onClick     || '';
  var _isInteractive = !!locals.isInteractive || !!_onClick;
  var _as          = locals.as          || (_isInteractive ? 'button' : 'div');
  var _isButton    = _as === 'button';

  // Hoverable auto-enables when interactive
  var hoverable = _hoverable || _isInteractive;

  var vc = {
    raised:  'bg-surface-raised shadow-sm',
    flat:    'bg-surface-base',
    outline: 'bg-transparent',
  }[_v] || 'bg-surface-raised shadow-sm';

  var hoverClass = hoverable
    ? 'transition-shadow hover:shadow-md hover:border-border-focus cursor-pointer'
    : '';

  var interactiveClass = _isInteractive
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus w-full'
    : '';

  var loadingClass = _loading ? 'pointer-events-none' : '';
%>
<<%= _as %>
  class="rounded-xl border border-border overflow-hidden text-left <%= vc %> <%= hoverClass %> <%= interactiveClass %> <%= loadingClass %><%= _className ? ' ' + _className : '' %>"
  <% if (_isButton) { %>type="button"<% } %>
  <% if (_onClick) { %>onclick="<%= _onClick %>"<% } %>
>
  <% if (_loading) { %>
  <div class="px-6 py-4 space-y-3 animate-pulse">
    <div class="h-4 bg-surface-sunken rounded w-2/3"></div>
    <div class="h-3 bg-surface-sunken rounded w-full"></div>
    <div class="h-3 bg-surface-sunken rounded w-4/5"></div>
    <div class="h-3 bg-surface-sunken rounded w-1/2"></div>
  </div>
  <% } else { %>
    <% if (_title || _headerRight) { %>
    <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
      <div>
        <% if (_title) { %><h3 class="text-sm font-semibold text-text-primary"><%= _title %></h3><% } %>
        <% if (_subtitle) { %><p class="text-xs text-text-secondary mt-0.5"><%= _subtitle %></p><% } %>
      </div>
      <% if (_headerRight) { %><div class="shrink-0"><%- _headerRight %></div><% } %>
    </div>
    <% } %>
    <% if (locals.children) { %>
    <div class="px-6 py-4"><%- locals.children %></div>
    <% } %>
    <% if (_footer) { %>
    <div class="px-6 py-3 border-t border-border bg-surface-base"><%- _footer %></div>
    <% } %>
  <% } %>
</<%= _as %>>

```
