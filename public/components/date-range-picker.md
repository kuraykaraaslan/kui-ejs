# DateRangePicker

- **id:** `date-range-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DateRangePicker.ejs`
- **status:** stable
- **since:** 2026-05

fieldset tabanlı çift native date input. Start/end birbirini otomatik kısıtlar (min/max), erişilebilir sr-only labellarla gelir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/DateRangePicker', {
  label: 'Reporting period',
  hint: 'End date must be after the start date.'
}) %>
```

### With value

```ejs
<%- include('modules/ui/DateRangePicker', {
  label: 'Booking window',
  value: { start: '2026-06-01', end: '2026-06-15' }
}) %>
```

### Required + error

```ejs
<%- include('modules/ui/DateRangePicker', {
  label: 'Campaign dates',
  required: true,
  error: 'Please pick both dates.'
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/DateRangePicker', {
  label: 'Locked range',
  value: { start: '2026-01-01', end: '2026-01-31' },
  disabled: true
}) %>
```

## Full EJS source

```ejs
<%
  var _kind  = locals.kind || 'range';
  var _id    = locals.id   || (_kind === 'time' ? 'time-' : 'daterange-') + Math.random().toString(36).substr(2, 9);
  var _label = locals.label || '';
  var _hint  = locals.hint  || '';
  var _error = locals.error || '';
  var _dis   = !!locals.disabled;
  var _req   = !!locals.required;
  var _className = locals.className || '';

  function toIso(v) {
    if (!v) return '';
    if (typeof v === 'string') return v;
    try {
      var d = (v instanceof Date) ? v : new Date(v);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) { return ''; }
  }

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
<% if (_kind === 'time') { %>
  <%
    var _timeVal  = locals.value || '';
    var _step     = locals.step  || 60;
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
  <%
    var _range   = locals.value || {};
    var startStr = toIso(_range.start);
    var endStr   = toIso(_range.end);
  %>
  <div
    id="<%= _id %>-root"
    class="space-y-1<%= _className ? ' ' + _className : '' %>"
    data-daterange-root
  >
    <fieldset>
      <legend class="block text-sm font-medium text-text-primary mb-1">
        <%= _label %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %>
      </legend>
      <div class="flex items-center gap-2">
        <div class="flex-1 space-y-0.5">
          <label for="<%= _id %>-start" class="sr-only">Start date</label>
          <input
            id="<%= _id %>-start"
            type="date"
            value="<%= startStr %>"
            <% if (_dis) { %>disabled<% } %>
            <% if (_req) { %>required<% } %>
            <% if (endStr) { %>max="<%= endStr %>"<% } %>
            aria-label="Start date"
            <% if (_hintId) { %>aria-describedby="<%= _hintId %>"<% } %>
            aria-invalid="<%= _error ? 'true' : 'false' %>"
            data-daterange-start
            class="<%= inputClass %>"
          />
        </div>
        <span class="w-3.5 h-3.5 inline-flex items-center justify-center text-text-disabled shrink-0" aria-hidden="true">
          <i class="fa-solid fa-arrow-right" style="font-size:14px"></i>
        </span>
        <div class="flex-1 space-y-0.5">
          <label for="<%= _id %>-end" class="sr-only">End date</label>
          <input
            id="<%= _id %>-end"
            type="date"
            value="<%= endStr %>"
            <% if (_dis) { %>disabled<% } %>
            <% if (_req) { %>required<% } %>
            <% if (startStr) { %>min="<%= startStr %>"<% } %>
            aria-label="End date"
            aria-invalid="<%= _error ? 'true' : 'false' %>"
            data-daterange-end
            class="<%= inputClass %>"
          />
        </div>
      </div>
    </fieldset>
    <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= _hint %></p><% } %>
    <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= _error %></p><% } %>
  </div>

  <script>
  (function () {
    var rootId = '<%= _id %>-root';
    var root = document.getElementById(rootId);
    if (!root || root.dataset.drInit === '1') return;
    root.dataset.drInit = '1';

    var startEl = root.querySelector('[data-daterange-start]');
    var endEl   = root.querySelector('[data-daterange-end]');
    if (!startEl || !endEl) return;

    startEl.addEventListener('change', function () {
      if (startEl.value) endEl.setAttribute('min', startEl.value);
      else endEl.removeAttribute('min');
      if (endEl.value && startEl.value && endEl.value < startEl.value) {
        endEl.value = '';
      }
    });

    endEl.addEventListener('change', function () {
      if (endEl.value) startEl.setAttribute('max', endEl.value);
      else startEl.removeAttribute('max');
    });
  })();
  </script>
<% } %>

```
