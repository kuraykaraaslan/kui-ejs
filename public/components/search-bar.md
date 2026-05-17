# SearchBar

- **id:** `search-bar`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/SearchBar.ejs`
- **status:** stable
- **since:** 0.1

role="searchbox" + arama ikonu + temizle butonu. Controlled veya uncontrolled modda kullanılabilir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--primary`
- `--surface-base`
- `--text-disabled`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/ui/SearchBar', { placeholder: 'Search components…' }) %>
```

### With value (clear button)

```ejs
<%- include('modules/ui/SearchBar', { value: 'Button' }) %>
```

### Small size

```ejs
<%- include('modules/ui/SearchBar', { size: 'sm', placeholder: 'Search…' }) %>
```

### Disabled

```ejs
<%- include('modules/ui/SearchBar', { placeholder: 'Search is disabled', disabled: true }) %>
```

## Full EJS source

```ejs
<%
  var _id          = locals.id          || 'search-' + Math.random().toString(36).substr(2, 9);
  var _placeholder = locals.placeholder || 'Search…';
  var _val         = locals.value       || '';
  var _sz          = locals.size        || 'md';

  var sc = {
    sm: 'py-1.5 text-sm pl-8 pr-3',
    md: 'py-2 text-sm pl-9 pr-3',
    lg: 'py-3 text-base pl-10 pr-4',
  }[_sz] || 'py-2 text-sm pl-9 pr-3';

  var iconSc = { sm: 'left-2.5 text-xs', md: 'left-3 text-sm', lg: 'left-3.5 text-base' }[_sz] || 'left-3 text-sm';
%>
<div class="relative flex items-center w-full <%= locals.className || '' %>">
  <div class="pointer-events-none absolute <%= iconSc %> text-text-disabled" aria-hidden="true">
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  <input
    id="<%= _id %>"
    type="search"
    role="searchbox"
    value="<%= _val %>"
    placeholder="<%= _placeholder %>"
    autocomplete="off"
    <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
    class="block w-full rounded-md border border-border bg-surface-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus hover:border-border-strong transition-colors <%= sc %> <%= _val ? 'pr-8' : '' %>"
  >
  <% if (_val) { %>
    <button
      type="button"
      onclick="this.previousElementSibling.value='';this.style.display='none'"
      aria-label="Clear search"
      class="absolute right-2 text-text-disabled hover:text-text-primary transition-colors focus:outline-none rounded"
    >
      <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
    </button>
  <% } %>
</div>

```
