# TimePicker

- **id:** `time-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DateRangePicker.ejs`
- **status:** stable
- **since:** 2026-09

Native time input with the standard label/hint/error markup, reached via `include('modules/ui/DateRangePicker', { kind: 'time', ... })`. Lives inline in the DateRangePicker shim rather than its own file, but is functionally independent — this entry makes it discoverable on its own.

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
<%- include('modules/ui/DateRangePicker', {
  kind: 'time',
  label: 'Appointment time',
  hint: 'Business hours are 9am–6pm.',
  value: '14:30',
}) %>
```

### Required + error

```ejs
<%- include('modules/ui/DateRangePicker', {
  kind: 'time',
  label: 'Pickup time',
  required: true,
  error: 'Please choose a pickup time.',
}) %>
```

## Full EJS source

```ejs
<%# modules/ui/DateRangePicker.ejs — thin shim %>
<%#
  Backwards-compatible entry point. The real DateRangePicker lives at
  `modules/ui/DatePicker/DateRangePicker.ejs`; the TimePicker (kind === 'time')
  flow stays inline here because the time picker belongs to milestone M4.

  When the caller passes `kind: 'time'` we keep the legacy native-input
  behaviour — otherwise we delegate to the new popover.
%>
<% if (locals.kind === 'time') { %>
  <%
    var _id    = locals.id || 'time-' + Math.random().toString(36).substr(2, 9);
    var _label = locals.label || '';
    var _hint  = locals.hint  || '';
    var _error = locals.error || '';
    var _dis   = !!locals.disabled;
    var _req   = !!locals.required;
    var _className = locals.className || '';
    var _timeVal = locals.value || '';
    var _step    = locals.step  || 60;

    var _hintId  = (_hint  && !_error) ? (_id + '-hint')  : '';
    var _errorId = _error ? (_id + '-error') : '';
    var _describedBy = [_hintId, _errorId].filter(function (x) { return !!x; }).join(' ');

    var inputClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors '
      + 'text-text-primary bg-surface-base '
      + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus '
      + 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken ';
    inputClass += _error
      ? 'border-error ring-1 ring-error bg-error-subtle'
      : 'border-border';
  %>
  <div class="space-y-1<%= _className ? ' ' + _className : '' %>">
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary">
      <%= _label %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %>
    </label>
    <input
      id="<%= _id %>"
      type="time"
      value="<%= _timeVal %>"
      step="<%= _step %>"
      class="<%= inputClass %>"
      <% if (_dis) { %>disabled<% } %>
      <% if (_req) { %>required<% } %>
      <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
      aria-invalid="<%= _error ? 'true' : 'false' %>"
      <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
      data-testid="timepicker-<%= _id %>"
    />
    <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= _hint %></p><% } %>
    <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= _error %></p><% } %>
  </div>
<% } else { %>
  <%- include('./DatePicker/DateRangePicker', locals) %>
<% } %>

```
