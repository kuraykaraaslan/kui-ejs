# GlobalSearch

- **id:** `global-search`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/GlobalSearch.ejs`
- **status:** stable
- **since:** 0.1

Kategori bazlı arama sonuçları listesi ile global arama alanı. Statik önizlemede açık sonuç paneli görünür.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Sonuçlarla (with results)

```ejs
<%- include('modules/app/GlobalSearch', {
  placeholder: 'Search…',
  query: req.query.q || '',
  results: searchResults,
  action: '/search'
}) %>
```

### Loading state

```ejs
<%- include('modules/app/GlobalSearch', {
  placeholder: 'Search…',
  query: req.query.q,
  loading: true
}) %>
```

## Full EJS source

```ejs
<%
  var _placeholder = locals.placeholder || 'Search…';
  var _results     = locals.results || [];
  var _query       = locals.query   || '';
  var _loading     = !!locals.loading;
  var _action      = locals.action || '#';
  var _name        = locals.inputName || 'q';
  var _id          = 'gs-' + Math.random().toString(36).substr(2,6);

  var grouped = {};
  _results.forEach(function(r){
    var cat = r.category || 'Results';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  });
  var cats = Object.keys(grouped);
  var hasResults = _results.length > 0 || _loading;
%>
<div id="<%= _id %>" class="relative w-full max-w-md<%= locals.className ? ' '+locals.className : '' %>">
  <form action="<%= _action %>" role="search">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-sm pointer-events-none" aria-hidden="true"></i>
      <input
        type="search"
        name="<%= _name %>"
        id="<%= _id %>-input"
        value="<%= _query %>"
        placeholder="<%= _placeholder %>"
        autocomplete="off"
        aria-haspopup="listbox"
        aria-expanded="<%= hasResults %>"
        class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pl-9 pr-4 py-2 text-sm transition-colors"
      >
    </div>
  </form>

  <% if (hasResults) { %>
  <div id="<%= _id %>-results"
    role="listbox"
    aria-label="Search results"
    class="absolute top-full mt-1.5 left-0 right-0 z-[70] rounded-lg border border-border bg-surface-raised shadow-xl overflow-hidden max-h-72 overflow-y-auto">
    <% if (_loading) { %>
    <div class="px-4 py-6 text-center text-sm text-text-secondary animate-pulse">Searching…</div>
    <% } else { %>
      <% cats.forEach(function(cat){ %>
      <div>
        <p class="px-3 pt-2 pb-1 text-[10px] font-semibold text-text-disabled uppercase tracking-wider"><%= cat %></p>
        <% grouped[cat].forEach(function(r){ %>
        <a href="<%= r.href || '#' %>"
          class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-overlay text-text-primary focus-visible:outline-none focus-visible:bg-primary-subtle">
          <% if (r.icon) { %><i class="<%= r.icon %> shrink-0 text-text-disabled text-sm" aria-hidden="true"></i><% } %>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate"><%= r.label %></p>
            <% if (r.description) { %><p class="text-xs text-text-secondary truncate"><%= r.description %></p><% } %>
          </div>
        </a>
        <% }); %>
      </div>
      <% }); %>
    <% } %>
  </div>
  <% } %>
</div>

```
