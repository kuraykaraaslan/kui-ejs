# ButtonGroup

- **id:** `button-group`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/ButtonGroup.ejs`
- **status:** stable
- **since:** 0.1

Birbirini dışlayan seçenekler için segmentli buton grubu. 4 variant, 4 boyut ve disabled item desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--secondary-fg`
- `--surface-base`
- `--surface-overlay`
- `--text-primary`

## Variants

### Outline (default)

```ejs
<%- include('modules/ui/ButtonGroup', {
  value: 'week',
  items: [
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
  ],
}) %>
```

### Primary

```ejs
<%- include('modules/ui/ButtonGroup', { variant: 'primary', value: 'week', items: [...] }) %>
```

### Secondary

```ejs
<%- include('modules/ui/ButtonGroup', { variant: 'secondary', value: 'week', items: [...] }) %>
```

### Ghost

```ejs
<%- include('modules/ui/ButtonGroup', { variant: 'ghost', value: 'week', items: [...] }) %>
```

### Sizes

```ejs
<%- include('modules/ui/ButtonGroup', { size: 'xs', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'sm', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'md', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'lg', value: 'a', items: [...] }) %>
```

### With disabled item

```ejs
<%- include('modules/ui/ButtonGroup', {
  value: 'week',
  items: [
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month', disabled: true },
  ],
}) %>
```

### Icon-style labels

```ejs
<%- include('modules/ui/ButtonGroup', {
  value: 'grid',
  items: [
    { value: 'list', label: '<i class="fa-solid fa-list"></i>' },
    { value: 'grid', label: '<i class="fa-solid fa-grip"></i>' },
    { value: 'map',  label: '<i class="fa-solid fa-map"></i>' },
  ],
}) %>
```

## Full EJS source

```ejs
<%
var _v     = locals.variant || 'outline';
var _sz    = locals.size    || 'md';
var _items = locals.items   || [];
var _value = locals.value   || (_items[0] && _items[0].value) || '';

var sc = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}[_sz] || 'px-4 py-2 text-sm';

var vc = {
  outline: {
    wrap:     'inline-flex rounded-md overflow-hidden border border-border divide-x divide-border',
    active:   'bg-surface-overlay font-semibold text-text-primary',
    inactive: 'bg-surface-base hover:bg-surface-overlay text-text-primary',
  },
  primary: {
    wrap:     'inline-flex rounded-md overflow-hidden',
    active:   'bg-primary text-primary-fg',
    inactive: 'bg-primary/20 hover:bg-primary/40 text-primary-fg',
  },
  secondary: {
    wrap:     'inline-flex rounded-md overflow-hidden',
    active:   'bg-secondary text-secondary-fg',
    inactive: 'bg-secondary/20 hover:bg-secondary/40 text-secondary-fg',
  },
  ghost: {
    wrap:     'inline-flex rounded-md overflow-hidden',
    active:   'bg-surface-overlay font-semibold text-text-primary',
    inactive: 'hover:bg-surface-overlay text-text-primary',
  },
}[_v] || {
  wrap: 'inline-flex rounded-md overflow-hidden border border-border divide-x divide-border',
  active: 'bg-surface-overlay font-semibold text-text-primary',
  inactive: 'bg-surface-base hover:bg-surface-overlay text-text-primary',
};
%>
<div role="group" class="<%= vc.wrap %><%= locals.className ? ' ' + locals.className : '' %>">
  <% _items.forEach(function(item, i) {
    var isActive = item.value === _value;
    var isFirst  = i === 0;
    var isLast   = i === _items.length - 1;
    var roundL = (_v !== 'outline' && isFirst) ? ' rounded-l-md' : '';
    var roundR = (_v !== 'outline' && isLast)  ? ' rounded-r-md' : '';
  %>
    <button
      type="button"
      aria-pressed="<%= isActive %>"
      <% if (item.disabled) { %>disabled<% } %>
      class="font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed <%= sc %> <%= isActive ? vc.active : vc.inactive %><%= roundL %><%= roundR %>"
    ><%= item.label %></button>
  <% }); %>
</div>

```
