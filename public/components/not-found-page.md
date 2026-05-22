# NotFoundPage

- **id:** `not-found-page`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/NotFoundPage.ejs`
- **status:** stable
- **since:** 2025-05

Full-page 404 screen with a gradient "404" heading, icon slot, title, description, and home/back action buttons.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/NotFoundPage') %>
```

### Custom title & description

```ejs
<%- include('modules/domain/common/NotFoundPage', {
  title: 'Nothing here yet',
  description: 'This section is under construction. Check back soon.',
  homeLabel: 'Return home',
  backLabel: 'Previous page'
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || 'Page Not Found';
  var _description = locals.description || 'The page you\'re looking for has been removed, moved, or never existed.';
  var _homeHref    = locals.homeHref    || '/';
  var _homeLabel   = locals.homeLabel   || 'Go Home';
  var _backLabel   = locals.backLabel   || 'Go Back';
%>
<div class="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-base">

  <!-- big 404 -->
  <div
    class="select-none text-[120px] sm:text-[180px] font-black leading-none tabular-nums"
    style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;opacity:.15"
    aria-hidden="true"
  >404</div>

  <!-- icon -->
  <div
    class="flex h-20 w-20 -mt-8 mb-6 items-center justify-center rounded-2xl text-4xl"
    style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);box-shadow:0 8px 32px color-mix(in srgb,var(--primary) 30%,transparent)"
  >
    <i class="fa-solid fa-magnifying-glass text-white text-2xl" aria-hidden="true"></i>
  </div>

  <h1 class="text-2xl sm:text-3xl font-bold text-text-primary text-center"><%= _title %></h1>

  <p class="mt-3 max-w-md text-center text-text-secondary text-sm sm:text-base leading-relaxed">
    <%= _description %>
  </p>

  <!-- Actions -->
  <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
    <a
      href="<%= _homeHref %>"
      class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);box-shadow:0 4px 16px color-mix(in srgb,var(--primary) 30%,transparent)"
    >
      <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
      <%= _homeLabel %>
    </a>
    <button
      type="button"
      onclick="history.back()"
      class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-text-primary border border-border transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <%= _backLabel %>
    </button>
  </div>

  <!-- Decorative dots -->
  <div class="mt-16 flex items-center gap-2 opacity-20" aria-hidden="true">
    <span class="rounded-full bg-primary" style="width:5px;height:5px"></span>
    <span class="rounded-full bg-primary" style="width:7px;height:7px"></span>
    <span class="rounded-full bg-primary" style="width:10px;height:10px"></span>
    <span class="rounded-full bg-primary" style="width:7px;height:7px"></span>
    <span class="rounded-full bg-primary" style="width:5px;height:5px"></span>
  </div>
</div>

```
