# Label

- **id:** `label`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Label.ejs`
- **status:** stable
- **since:** 2026-09

Standalone form label with an optional required indicator and disabled state, for pairing with custom controls that do not manage their own label.

## Design tokens consumed

- `--error`
- `--primary`
- `--text-disabled`
- `--text-primary`

## Variants

### Basic + required

```ejs
<%- include('modules/ui/Label', { for: 'name', label: 'Full name' }) %>
<%- include('modules/ui/Label', { for: 'email', label: 'Email address', required: true }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Label', { for: 'handle', label: 'Handle (disabled)', disabled: true }) %>
<input id="handle" disabled placeholder="@handle" />
```

## Full EJS source

```ejs
<%
  var _for       = locals.for       || '';
  var _label     = locals.label     || '';
  var _required  = !!locals.required;
  var _disabled  = !!locals.disabled;
  var _className = locals.className || '';
%>
<label
  <% if (_for) { %>for="<%= _for %>"<% } %>
  class="block text-sm font-medium text-text-primary select-none<%= _disabled ? ' text-text-disabled cursor-not-allowed' : '' %><%= _className ? ' ' + _className : '' %>"
><%= _label %><% if (_required) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %></label>

```
