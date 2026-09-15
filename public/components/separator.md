# Separator

- **id:** `separator`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Separator.ejs`
- **status:** stable
- **since:** 2026-09

Visual divider between sections of content. Supports horizontal and vertical orientation, and an optional centered label for horizontal dividers.

## Design tokens consumed

- `--border`
- `--secondary`
- `--text-secondary`

## Variants

### Horizontal

```ejs
<p>Section one content</p>
<%- include('modules/ui/Separator') %>
<p>Section two content</p>
```

### Vertical + labeled

```ejs
<span>Profile</span>
<%- include('modules/ui/Separator', { orientation: 'vertical' }) %>
<span>Settings</span>

<%- include('modules/ui/Separator', { label: 'OR' }) %>
```

## Full EJS source

```ejs
<%
  var _orientation = locals.orientation || 'horizontal';
  var _decorative  = (locals.decorative === undefined) ? true : !!locals.decorative;
  var _label       = locals.label     || '';
  var _className   = locals.className || '';
  var _role        = _decorative ? 'none' : 'separator';
%>
<% if (_label && _orientation === 'horizontal') { %>
  <div role="<%= _role %>" <% if (!_decorative) { %>aria-orientation="horizontal"<% } %> class="flex items-center gap-3 text-xs font-medium text-text-secondary<%= _className ? ' ' + _className : '' %>">
    <span class="h-px flex-1 bg-border"></span>
    <%= _label %>
    <span class="h-px flex-1 bg-border"></span>
  </div>
<% } else { %>
  <div
    role="<%= _role %>"
    <% if (!_decorative) { %>aria-orientation="<%= _orientation %>"<% } %>
    class="shrink-0 bg-border <%= _orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px' %><%= _className ? ' ' + _className : '' %>"
  ></div>
<% } %>

```
