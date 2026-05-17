# DatePicker

- **id:** `date-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DatePicker.ejs`
- **status:** stable
- **since:** 0.1

Native date input ile label + hint + error anatomy. min/max kısıtlaması ve disabled desteği ile birlikte gelir.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
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
  var _dis  = locals.disabled ? 'disabled' : '';
  var _req  = locals.required ? 'required' : '';

  var baseClass = "block w-full rounded-md border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken transition-colors px-3 py-2 text-sm";
  var stateClass = locals.error
    ? "border-error focus:border-error focus:ring-error/20"
    : "border-border focus:border-primary hover:border-text-tertiary";
%>
<div class="w-full <%= locals.className || '' %>">
  <% if (locals.label) { %>
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1.5">
      <%= locals.label %><% if (locals.required) { %> <span class="text-error">*</span><% } %>
    </label>
  <% } %>
  <input
    id="<%= _id %>"
    type="date"
    class="<%= baseClass %> <%= stateClass %>"
    <%= _dis %>
    <%= _req %>
    <% if (locals.value) { %>value="<%= locals.value %>"<% } %>
    <% if (locals.min)   { %>min="<%= locals.min %>"<% } %>
    <% if (locals.max)   { %>max="<%= locals.max %>"<% } %>
    <% if (locals.name)  { %>name="<%= locals.name %>"<% } %>
    aria-invalid="<%= locals.error ? 'true' : 'false' %>"
  >
  <% if (locals.hint || locals.error) { %>
    <p class="mt-1.5 text-sm <%= locals.error ? 'text-error' : 'text-text-secondary' %>">
      <%= locals.error || locals.hint %>
    </p>
  <% } %>
</div>

```
