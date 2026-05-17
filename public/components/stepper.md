# Stepper

- **id:** `stepper`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Stepper.ejs`
- **status:** stable
- **since:** 0.1

Çok adımlı ilerleme göstergesi. complete/active/error/pending durumları; horizontal ve vertical yönelim.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--success`
- `--surface-base`
- `--text-disabled`
- `--text-inverse`
- `--text-primary`
- `--text-secondary`

## Variants

### Horizontal

```ejs
<%- include('modules/ui/Stepper', {
  steps: [
    { label: 'Account', state: 'complete' },
    { label: 'Profile', state: 'active' },
    { label: 'Payment', state: 'pending' },
    { label: 'Confirm', state: 'pending' },
  ]
}) %>
```

### Vertical

```ejs
<%- include('modules/ui/Stepper', {
  orientation: 'vertical',
  steps: [
    { label: 'Create account',   description: 'Enter your email and password.', state: 'complete' },
    { label: 'Verify email',     description: 'Check your inbox.',              state: 'complete' },
    { label: 'Set up profile',   description: 'Add your name and photo.',       state: 'active' },
    { label: 'Invite your team', description: 'Optional.',                      state: 'pending' },
  ]
}) %>
```

### With error state

```ejs
<%- include('modules/ui/Stepper', {
  steps: [
    { label: 'Upload',   state: 'complete' },
    { label: 'Validate', state: 'error' },
    { label: 'Process',  state: 'pending' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _steps       = locals.steps       || [];
  var _orientation = locals.orientation || 'horizontal';
  var _className   = locals.className   || '';

  var stateStyles = {
    complete: { circle: 'bg-success text-text-inverse border-success',         text: 'text-text-primary',           line: 'bg-success' },
    active:   { circle: 'bg-primary text-primary-fg border-primary',           text: 'text-text-primary font-semibold', line: 'bg-border' },
    error:    { circle: 'bg-error text-text-inverse border-error',             text: 'text-error',                  line: 'bg-border' },
    pending:  { circle: 'bg-surface-base text-text-disabled border-border',    text: 'text-text-disabled',          line: 'bg-border' },
  };
%>
<% if (_orientation === 'vertical') { %>
<ol class="flex flex-col gap-0<%= _className ? ' ' + _className : '' %>">
  <% _steps.forEach(function (step, i) { %>
  <%
    var state = step.state || 'pending';
    var s = stateStyles[state] || stateStyles.pending;
    var isLast = i === _steps.length - 1;
  %>
  <li class="flex gap-3 items-start">
    <div class="flex flex-col items-center shrink-0">
      <div class="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 <%= s.circle %>"
        aria-label="Step <%= i + 1 %>: <%= step.label %> — <%= state %>">
        <% if (state === 'complete') { %><i class="fa-solid fa-check text-xs" aria-hidden="true"></i>
        <% } else if (state === 'error') { %><i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
        <% } else { %><%= i + 1 %><% } %>
      </div>
      <% if (!isLast) { %><div class="w-0.5 flex-1 min-h-8 mt-1 <%= s.line %>"></div><% } %>
    </div>
    <div class="<%= isLast ? 'pb-0' : 'pb-6' %>">
      <p class="text-sm <%= s.text %>"><%= step.label %></p>
      <% if (step.description) { %><p class="text-xs text-text-secondary mt-0.5"><%= step.description %></p><% } %>
    </div>
  </li>
  <% }); %>
</ol>
<% } else { %>
<ol class="flex items-center<%= _className ? ' ' + _className : '' %>">
  <% _steps.forEach(function (step, i) { %>
  <%
    var state = step.state || 'pending';
    var s = stateStyles[state] || stateStyles.pending;
    var isLast = i === _steps.length - 1;
  %>
  <li class="flex items-center<%= !isLast ? ' flex-1' : '' %>">
    <div class="flex flex-col items-center gap-1 shrink-0">
      <div class="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold <%= s.circle %>"
        aria-label="Step <%= i + 1 %>: <%= step.label %> — <%= state %>">
        <% if (state === 'complete') { %><i class="fa-solid fa-check text-xs" aria-hidden="true"></i>
        <% } else if (state === 'error') { %><i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
        <% } else { %><%= i + 1 %><% } %>
      </div>
      <div class="text-center">
        <p class="text-xs whitespace-nowrap <%= s.text %>"><%= step.label %></p>
        <% if (step.description) { %><p class="text-xs text-text-secondary"><%= step.description %></p><% } %>
      </div>
    </div>
    <% if (!isLast) { %><div class="h-0.5 flex-1 mx-2 mt-[-1.25rem] <%= s.line %>"></div><% } %>
  </li>
  <% }); %>
</ol>
<% } %>

```
