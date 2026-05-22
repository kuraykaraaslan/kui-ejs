# SkipLink + LiveRegion

- **id:** `skip-link`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/SkipLink.ejs`
- **status:** stable
- **since:** 2025-01

SkipLink is visually hidden until focused, enabling keyboard users to bypass navigation. LiveRegion announces dynamic content to screen readers.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`

## Variants

### SkipLink (focus to reveal)

```ejs
<%# Place at top of layout: %>
<%- include('modules/ui/SkipLink', { href: '#main-content' }) %>

<%# Linked target: %>
<main id="main-content">...</main>
```

### LiveRegion

```ejs
<%# Polite live region — announces `message` to screen readers %>
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  <%= message %>
</div>
```

## Full EJS source

```ejs
<%
  var _href      = locals.href      || '#main-content';
  var _label     = locals.label     || 'Skip to main content';
  var _className = locals.className || '';
%>
<a
  href="<%= _href %>"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus<%= _className ? ' ' + _className : '' %>"
>
  <%= _label %>
</a>

```
