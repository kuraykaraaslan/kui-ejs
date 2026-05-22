# RadioGroup

- **id:** `radio-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RadioGroup.ejs`
- **status:** stable
- **since:** 2025-02

fieldset + legend based radio group. WCAG-compliant keyboard navigation with an optional card-style variant.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--secondary`
- `--surface-base`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/RadioGroup', {
  name: 'notify',
  legend: 'Notification preference',
  options: [
    { value: 'email', label: 'Email', hint: 'Sent to your primary email' },
    { value: 'sms',   label: 'SMS' },
    { value: 'none',  label: 'None' },
  ]
}) %>
```

### With selected value

```ejs
<%- include('modules/ui/RadioGroup', {
  name: 'notify',
  legend: 'Notification preference',
  value: 'email',
  options: NOTIFY_OPTS
}) %>
```

### Card style

```ejs
<%- include('modules/ui/RadioGroup', {
  name: 'plan',
  legend: 'Choose plan',
  value: 'pro',
  cardStyle: true,
  options: [
    { value: 'free', label: 'Free', hint: '$0/mo · 3 projects' },
    { value: 'pro',  label: 'Pro',  hint: '$12/mo · Unlimited'  },
    { value: 'team', label: 'Team', hint: '$49/mo · 10 seats'   },
  ]
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/RadioGroup', { name: 'notify', legend: 'Notification preference', value: 'email', disabled: true, options: NOTIFY_OPTS }) %>
```

## Full EJS source

```ejs
<%
  var _name    = locals.name    || 'radio-' + Math.random().toString(36).substr(2, 9);
  var _opts    = locals.options || [];
  var _val     = (locals.value !== undefined && locals.value !== null) ? String(locals.value) : '';
  var _dis     = !!locals.disabled;
  var _variant = locals.variant || (locals.cardStyle ? 'card' : 'default');
  var _cols    = locals.columns || 1;

  var _gridClass = '';
  if (_cols === 1) {
    _gridClass = 'space-y-2';
  } else if (_cols === 2) {
    _gridClass = 'grid gap-2 grid-cols-1 sm:grid-cols-2';
  } else if (_cols === 3) {
    _gridClass = 'grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  } else {
    _gridClass = 'space-y-2';
  }
%>
<fieldset class="space-y-1 <%= locals.className || '' %>">
  <% if (locals.legend) { %>
    <legend class="mb-2 text-sm font-medium text-text-primary"><%= locals.legend %></legend>
  <% } %>
  <div class="<%= _gridClass %>">
    <% _opts.forEach(function (opt) { %>
      <%
        var active = (String(opt.value) === _val);
        var labelClass = 'flex items-start gap-2 ';
        labelClass += _dis ? 'cursor-not-allowed opacity-50 ' : 'cursor-pointer ';
        if (_variant === 'card') {
          labelClass += 'rounded-lg border border-border bg-surface-base p-3 transition-colors hover:border-border-focus ';
          if (active) labelClass += 'border-primary bg-primary/5 ';
          if (locals.error) labelClass += 'border-error ';
        }
        if (locals.optionClassName) labelClass += locals.optionClassName + ' ';

        var inputClass = 'mt-0.5 h-4 w-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus';
        if (locals.error) inputClass += ' border-error';
      %>
      <label class="<%= labelClass %>">
        <input
          type="radio"
          name="<%= _name %>"
          value="<%= opt.value %>"
          class="<%= inputClass %>"
          data-testid="radio-<%= _name %>-<%= opt.value %>"
          <%= active ? 'checked' : '' %>
          <%= _dis ? 'disabled' : '' %>
        >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <% if (opt.icon) { %>
              <span class="text-lg leading-none text-text-secondary"><%- opt.icon %></span>
            <% } %>
            <span class="text-sm text-text-primary"><%= opt.label %></span>
          </div>
          <% if (opt.hint) { %>
            <p class="mt-0.5 text-xs text-text-secondary"><%= opt.hint %></p>
          <% } %>
        </div>
      </label>
    <% }); %>
  </div>
  <% if (locals.error) { %>
    <p class="mt-1 text-xs text-error" role="alert"><%= locals.error %></p>
  <% } %>
</fieldset>

```
