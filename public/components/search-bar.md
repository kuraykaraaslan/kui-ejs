# SearchBar

- **id:** `search-bar`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/SearchBar.ejs`
- **status:** stable
- **since:** 2025-02

role="searchbox" with search icon and clear button. Works in controlled and uncontrolled modes.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--surface-base`
- `--text-disabled`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/ui/SearchBar', { placeholder: 'Search..' }) %>
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
  var _id          = locals.id          || 'search';
  var _placeholder = locals.placeholder || 'Search…';
  var _val         = (locals.value !== undefined && locals.value !== null) ? String(locals.value) : '';
%>
<div class="relative flex items-center <%= locals.className || '' %>">
  <span
    aria-hidden="true"
    class="absolute left-3 text-text-disabled pointer-events-none w-3.5 h-3.5 inline-flex items-center justify-center"
  >
    <i class="fa-solid fa-magnifying-glass" style="font-size:14px"></i>
  </span>
  <input
    id="<%= _id %>"
    type="text"
    role="searchbox"
    value="<%= _val %>"
    placeholder="<%= _placeholder %>"
    autocomplete="off"
    data-testid="searchbar-<%= _id %>"
    class="block w-full rounded-md border border-border bg-surface-base px-3 py-2 pl-8 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus transition-colors <%= _val ? 'pr-8' : '' %>"
  >
  <% if (_val) { %>
    <button
      type="button"
      onclick="(function(b){var i=b.previousElementSibling;i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));b.style.display='none';})(this)"
      aria-label="Clear search"
      class="absolute right-2 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
    >
      <span class="w-3 h-3 inline-flex items-center justify-center">
        <i class="fa-solid fa-xmark" aria-hidden="true" style="font-size:12px"></i>
      </span>
    </button>
  <% } %>
</div>

```
