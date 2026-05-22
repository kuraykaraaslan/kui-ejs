# FormField

- **id:** `form-field`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FormField.ejs`
- **status:** stable
- **since:** 2026-05

Form alanı wrapper'ı: label + slot + hint + error. Computed `id`, `aria-describedby` ve `aria-invalid` değerlerini sarmalayan `data-form-field` üzerinden expose eder. NextJS'deki react-hook-form karşıtının statik EJS muadili.

## Design tokens consumed

- `--error`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### With hint

```ejs
<%- include('modules/app/FormField', {
  name:  'email',
  label: 'Email',
  hint:  "We'll never share your email.",
  children: `<input id="email" name="email" type="email"
    placeholder="you@example.com"
    class="block w-full rounded-md border border-border bg-surface text-text-primary px-3 py-2 text-sm" />`
}) %>
```

### Required with error

```ejs
<%- include('modules/app/FormField', {
  name:     'password',
  label:    'Password',
  required: true,
  error:    'Password must be at least 8 characters.',
  children: `<input id="password" name="password" type="password"
    aria-invalid="true"
    class="block w-full rounded-md border border-error bg-surface text-text-primary px-3 py-2 text-sm" />`
}) %>
```

## Full EJS source

```ejs
<%
  // ─── FormField (EJS) ────────────────────────────────────────────────────────
  //
  // NextJS counterpart uses react-hook-form: it pulls `errors[name]` from the
  // form context and exposes id/aria attributes via a render-prop child.
  //
  // EJS has no form context and no render-prop pattern, so:
  //   • Callers pass static `error` / `hint` props per render (no live validation).
  //   • The caller embeds the input markup directly inside `children`; this
  //     template wraps it in a slot whose root element carries the computed
  //     `id`, `aria-describedby`, and `aria-invalid` attributes via a
  //     `data-form-field` data-attribute pattern. Real inputs should mirror
  //     these on themselves (e.g. `id="<%= name %>"`) — the surrounding wrapper
  //     exposes them for tests / scripts that walk the DOM.
  //
  //   <%- include('FormField', {
  //         name: 'email', label: 'Email', error: errors.email,
  //         children: `<input id="email" name="email" aria-invalid="${!!errors.email}" …>`
  //       }) %>
  //
  // The computed `_inputId` (== `name`) is mirrored onto the slot wrapper as
  // `data-input-id` so consumers can locate the input without re-deriving it.

  var _name      = locals.name      || locals.id || ('field-' + Math.random().toString(36).substr(2, 6));
  var _label     = locals.label     || '';
  var _hint      = locals.hint      || '';
  var _error     = locals.error     || '';
  var _required  = !!locals.required;
  var _className = locals.className || '';

  var _inputId     = _name;
  var _hintId      = _hint  ? (_inputId + '-hint')  : '';
  var _errorId     = _error ? (_inputId + '-error') : '';
  var _describedBy = [_hintId, _errorId].filter(Boolean).join(' ');
%>
<div class="flex flex-col gap-1.5<%= _className ? ' ' + _className : '' %>">
  <label
    for="<%= _inputId %>"
    class="text-sm font-medium text-text-primary<%= _required ? " after:content-['*'] after:ml-0.5 after:text-error" : '' %>"
  >
    <%= _label %>
  </label>

  <div
    data-form-field
    data-input-id="<%= _inputId %>"
    <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
    aria-invalid="<%= _error ? 'true' : 'false' %>"
  >
    <%- locals.children || '' %>
  </div>

  <% if (_hint && !_error) { %>
  <p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= _hint %></p>
  <% } %>

  <% if (_error) { %>
  <p id="<%= _errorId %>" role="alert" class="text-xs text-error"><%= _error %></p>
  <% } %>
</div>

```
