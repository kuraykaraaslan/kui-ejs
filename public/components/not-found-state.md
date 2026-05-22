# NotFoundState

- **id:** `not-found-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/NotFoundState.ejs`
- **status:** stable
- **since:** 2025-03

Not-found / empty record state with optional go-back action.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/app/NotFoundState') %>
```

### With back link

```ejs
<%- include('modules/app/NotFoundState', {
  title:       'User not found',
  description: 'This user account doesn't exist or may have been deleted.',
  backHref:    '/users',
  backLabel:   'Back to users'
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || 'Page not found';
  var _description = locals.description || "The page you're looking for doesn't exist or has been moved.";
  var _goBackLabel = locals.goBackLabel || 'Go back';
  // Accept either a JS handler string OR a plain href via the same prop.
  var _onGoBack    = locals.onGoBack    || '';
  var _isHref      = _onGoBack && typeof _onGoBack === 'string' && (
    _onGoBack.charAt(0) === '/' ||
    _onGoBack.charAt(0) === '#' ||
    _onGoBack.indexOf('http://') === 0 ||
    _onGoBack.indexOf('https://') === 0 ||
    _onGoBack.indexOf('mailto:') === 0
  );
%>
<%# EmptyState parity: matches EmptyState.ejs class output %>
<div class="flex flex-col items-center justify-center text-center py-16 px-6<%= locals.className ? ' '+locals.className : '' %>">
  <div class="h-12 w-12 rounded-full bg-surface-sunken flex items-center justify-center text-text-disabled text-2xl mb-4" aria-hidden="true">
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  <h3 class="text-base font-semibold text-text-primary"><%= _title %></h3>
  <% if (_description) { %>
  <p class="mt-1 text-sm text-text-secondary max-w-xs"><%= _description %></p>
  <% } %>
  <% if (_onGoBack) { %>
  <div class="mt-5">
    <%# Button variant="outline" size="sm" iconLeft={faArrowLeft} %>
    <% if (_isHref) { %>
    <a href="<%= _onGoBack %>" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
      <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-left" style="font-size:0.875rem"></i></span>
      <%= _goBackLabel %>
    </a>
    <% } else { %>
    <button type="button" onclick="<%= _onGoBack %>" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
      <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-left" style="font-size:0.875rem"></i></span>
      <%= _goBackLabel %>
    </button>
    <% } %>
  </div>
  <% } %>
</div>

```
