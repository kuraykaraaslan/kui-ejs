# RadioGroup

- **id:** `radio-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RadioGroup.ejs`
- **status:** stable
- **since:** 0.1

fieldset + legend tabanlı radio grubu. WCAG uyumlu klavye navigasyonu, cardStyle varyantı ile görsel plan seçimi.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
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
  var _val     = locals.value   || '';
  var _dis     = !!locals.disabled;
  var _cardStyle = !!locals.cardStyle;
%>
<fieldset class="<%= locals.className || '' %>">
  <% if (locals.legend) { %>
    <legend class="text-sm font-medium text-text-primary mb-3"><%= locals.legend %></legend>
  <% } %>
  <div class="space-y-2">
    <% _opts.forEach(function(opt) { %>
      <% if (_cardStyle) { %>
        <label class="flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors <%= _dis ? 'opacity-50 cursor-not-allowed' : '' %> <%= (_val === opt.value) ? 'border-primary bg-primary-subtle' : 'border-border bg-surface hover:bg-surface-overlay' %>">
          <input
            type="radio"
            name="<%= _name %>"
            value="<%= opt.value %>"
            class="mt-0.5 h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary/20"
            <%= (_val === opt.value) ? 'checked' : '' %>
            <%= _dis ? 'disabled' : '' %>
          >
          <div>
            <span class="text-sm font-medium <%= (_val === opt.value) ? 'text-primary' : 'text-text-primary' %>"><%= opt.label %></span>
            <% if (opt.hint) { %><p class="text-xs text-text-secondary mt-0.5"><%= opt.hint %></p><% } %>
          </div>
        </label>
      <% } else { %>
        <label class="flex items-start gap-2 cursor-pointer <%= _dis ? 'opacity-50 cursor-not-allowed' : '' %>">
          <input
            type="radio"
            name="<%= _name %>"
            value="<%= opt.value %>"
            class="mt-0.5 h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary/20"
            <%= (_val === opt.value) ? 'checked' : '' %>
            <%= _dis ? 'disabled' : '' %>
          >
          <div>
            <span class="text-sm text-text-primary"><%= opt.label %></span>
            <% if (opt.hint) { %><p class="text-xs text-text-secondary"><%= opt.hint %></p><% } %>
          </div>
        </label>
      <% } %>
    <% }); %>
  </div>
  <% if (locals.error) { %>
    <p class="mt-2 text-xs text-error" role="alert"><%= locals.error %></p>
  <% } %>
</fieldset>

```
