# DatePicker

- **id:** `date-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DatePicker.ejs`
- **status:** stable
- **since:** 2025-02

Native date input with label + hint + error anatomy. Supports min/max constraints and a disabled state.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/DatePicker', {
  label: 'Appointment date',
  hint: 'Select a future date.'
}) %>
```

### With value

```ejs
<%- include('modules/ui/DatePicker', {
  label: 'Start date',
  value: '2026-06-15'
}) %>
```

### Error state

```ejs
<%- include('modules/ui/DatePicker', {
  label: 'Due date',
  required: true,
  error: 'Please select a date.'
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/DatePicker', {
  label: 'Locked date',
  value: '2026-01-01',
  disabled: true
}) %>
```

### With min / max

```ejs
<%- include('modules/ui/DatePicker', {
  label: 'Booking date',
  hint: 'Available: Jun 1–30, 2026',
  min: '2026-06-01',
  max: '2026-06-30'
}) %>
```

## Full EJS source

```ejs
<%
  var _id   = locals.id   || 'date-' + Math.random().toString(36).substr(2, 9);
  var _dis  = !!locals.disabled;
  var _req  = !!locals.required;
  var _val  = locals.value || '';

  var _hintId  = (locals.hint  && !locals.error) ? (_id + '-hint')  : '';
  var _errorId = locals.error ? (_id + '-error') : '';
  var _describedBy = [_hintId, _errorId].filter(function (x) { return !!x; }).join(' ');

  var baseClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors '
    + 'text-text-primary bg-surface-base '
    + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus '
    + 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken ';
  baseClass += locals.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';
%>
<div class="space-y-1 <%= locals.className || '' %>">
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary">
    <%= locals.label || '' %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %>
  </label>
  <input
    id="<%= _id %>"
    type="date"
    class="<%= baseClass %>"
    <% if (_dis) { %>disabled<% } %>
    <% if (_req) { %>required<% } %>
    <% if (_val) { %>value="<%= _val %>"<% } %>
    <% if (locals.min) { %>min="<%= locals.min %>"<% } %>
    <% if (locals.max) { %>max="<%= locals.max %>"<% } %>
    <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
    aria-invalid="<%= locals.error ? 'true' : 'false' %>"
    <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
    data-testid="datepicker-<%= _id %>"
  >
  <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= locals.hint %></p><% } %>
  <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= locals.error %></p><% } %>
</div>

```
