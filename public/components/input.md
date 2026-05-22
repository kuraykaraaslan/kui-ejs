# Input

- **id:** `input`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Input.ejs`
- **status:** stable
- **since:** 2025-02

Metin giriş alanı. Label, hint, error, prefix icon, password toggle ve 3 boyut destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-base`
- `--surface-overlay`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Input', { id: 'email', label: 'Email address', placeholder: 'you@example.com' }) %>
```

### Required

```ejs
<%- include('modules/ui/Input', { id: 'name', label: 'Full name', required: true, placeholder: 'Jane Doe' }) %>
```

### With hint

```ejs
<%- include('modules/ui/Input', { id: 'user', label: 'Username', hint: 'Letters, numbers and underscores only' }) %>
```

### Error state

```ejs
<%- include('modules/ui/Input', { id: 'email', label: 'Email address', error: 'Enter a valid email address' }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Input', { id: 'acc', label: 'Account ID', disabled: true }) %>
```

### Password

```ejs
<%- include('modules/ui/Input', { id: 'pw', label: 'Password', type: 'password', placeholder: '••••••••' }) %>
```

### Prefix icon

```ejs
<%- include('modules/ui/Input', { id: 'search', label: 'Search', iconLeft: '<i class=\"fa-solid fa-magnifying-glass\"></i>', placeholder: 'Search…' }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Input', { id: 'sm', label: 'Small',  size: 'sm' }) %>
<%- include('modules/ui/Input', { id: 'md', label: 'Medium', size: 'md' }) %>
<%- include('modules/ui/Input', { id: 'lg', label: 'Large',  size: 'lg' }) %>
```

## Full EJS source

```ejs
<%
  var _id   = locals.id   || 'input-' + Math.random().toString(36).substr(2, 9);
  var _type = locals.type || 'text';
  var _val  = (locals.value !== undefined && locals.value !== null) ? String(locals.value) : '';
  var _dis  = !!locals.disabled;
  var _req  = !!locals.required;
  var _ro   = !!locals.readOnly;

  var _isPassword = (_type === 'password');
  var _isNumber   = (_type === 'number');

  var _state = locals.error ? 'error' : (locals.success ? 'success' : 'default');

  var _hasPrefix = !!locals.iconLeft;
  var _hasClear  = !!locals.clearable && _val.length > 0 && !_ro && !_isPassword;
  var _hasSuffix = !!locals.iconRight || _hasClear || _isPassword;

  var _hintId    = (locals.hint    && !locals.error && !locals.success) ? (_id + '-hint')    : '';
  var _errorId   = locals.error    ? (_id + '-error')   : '';
  var _successId = (locals.success && !locals.error) ? (_id + '-success') : '';
  var _describedBy = [_hintId, _errorId, _successId].filter(function (x) { return !!x; }).join(' ');

  var inputBaseClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors '
    + 'text-text-primary placeholder:text-text-disabled '
    + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus '
    + 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken '
    + 'read-only:bg-surface-sunken read-only:cursor-default ';

  if (_state === 'error') {
    inputBaseClass += 'border-error ring-1 ring-error bg-error-subtle ';
  } else if (_state === 'success') {
    inputBaseClass += 'border-success ring-1 ring-success bg-success-subtle ';
  } else {
    inputBaseClass += 'border-border bg-surface-base ';
  }
  if (_hasPrefix) inputBaseClass += 'pl-9 ';
  if (_hasSuffix || _isNumber) inputBaseClass += 'pr-9 ';

  if (_isNumber) {
    inputBaseClass += '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ';
  }

  var _charCount = _val.length;
  var _showCount = !!locals.showCount && !!locals.maxLength;
%>
<div class="space-y-1 <%= locals.className || '' %>">
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary">
    <%= locals.label || '' %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %><% if (_ro) { %><span class="ml-2 text-xs font-normal text-text-disabled">(read-only)</span><% } %>
  </label>

  <div class="relative">
    <% if (_hasPrefix) { %>
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none">
        <%- locals.iconLeft %>
      </span>
    <% } %>

    <input
      id="<%= _id %>"
      type="<%= _isPassword ? 'password' : _type %>"
      class="<%= inputBaseClass %>"
      <% if (locals.placeholder) { %>placeholder="<%= locals.placeholder %>"<% } %>
      <% if (_val) { %>value="<%= _val %>"<% } %>
      <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
      <% if (_dis) { %>disabled<% } %>
      <% if (_req) { %>required<% } %>
      <% if (_ro)  { %>readonly<% } %>
      <% if (locals.maxLength) { %>maxlength="<%= locals.maxLength %>"<% } %>
      <% if (locals.step !== undefined) { %>step="<%= locals.step %>"<% } %>
      <% if (locals.min  !== undefined) { %>min="<%= locals.min %>"<% } %>
      <% if (locals.max  !== undefined) { %>max="<%= locals.max %>"<% } %>
      aria-invalid="<%= _state === 'error' ? 'true' : 'false' %>"
      <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
      data-testid="input-<%= _id %>"
    >

    <% if (_isPassword && !_ro) { %>
      <button
        type="button"
        aria-label="Show password"
        data-input-password-toggle="<%= _id %>"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none text-sm"
      >
        <span class="w-3.5 h-3.5 inline-flex items-center justify-center">
          <i class="fa-solid fa-eye" data-pw-icon style="font-size:14px"></i>
        </span>
      </button>
    <% } %>

    <% if (_hasClear) { %>
      <button
        type="button"
        aria-label="Clear"
        data-input-clear="<%= _id %>"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none"
      >
        <span class="w-3 h-3 inline-flex items-center justify-center">
          <i class="fa-solid fa-xmark" style="font-size:12px"></i>
        </span>
      </button>
    <% } %>

    <% if (locals.iconRight && !_hasClear && !_isPassword) { %>
      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none">
        <%- locals.iconRight %>
      </span>
    <% } %>

    <% if (_isNumber && !_ro) { %>
      <div class="absolute right-0 top-0 h-full flex flex-col border-l border-border overflow-hidden rounded-r-md">
        <button
          type="button"
          aria-label="Increment"
          tabindex="-1"
          data-input-step="up"
          data-input-target="<%= _id %>"
          class="flex-1 px-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none border-b border-border leading-none flex items-center justify-center"
        >
          <span class="w-2 h-2 inline-flex items-center justify-center">
            <i class="fa-solid fa-chevron-up" style="font-size:8px"></i>
          </span>
        </button>
        <button
          type="button"
          aria-label="Decrement"
          tabindex="-1"
          data-input-step="down"
          data-input-target="<%= _id %>"
          class="flex-1 px-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none leading-none flex items-center justify-center"
        >
          <span class="w-2 h-2 inline-flex items-center justify-center">
            <i class="fa-solid fa-chevron-down" style="font-size:8px"></i>
          </span>
        </button>
      </div>
    <% } %>
  </div>

  <div class="flex items-center justify-between gap-2">
    <div class="flex-1">
      <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= locals.hint %></p><% } %>
      <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= locals.error %></p><% } %>
      <% if (_successId) { %><p id="<%= _successId %>" class="text-xs text-success-fg"><%= locals.success %></p><% } %>
    </div>
    <% if (_showCount) { %>
      <p class="text-xs shrink-0 <%= _charCount >= locals.maxLength ? 'text-error' : 'text-text-disabled' %>">
        <%= _charCount %>/<%= locals.maxLength %>
      </p>
    <% } %>
  </div>
</div>

<% if (_isPassword || _isNumber || locals.clearable) { %>
<script>
(function () {
  if (window.__kuiInputBound) return;
  window.__kuiInputBound = true;

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!(t instanceof Element)) return;

    var pwBtn = t.closest('[data-input-password-toggle]');
    if (pwBtn) {
      var pwId = pwBtn.getAttribute('data-input-password-toggle');
      var pwInput = document.getElementById(pwId);
      if (!pwInput) return;
      var isHidden = pwInput.type === 'password';
      pwInput.type = isHidden ? 'text' : 'password';
      var icon = pwBtn.querySelector('[data-pw-icon]');
      if (icon) {
        icon.classList.toggle('fa-eye', !isHidden);
        icon.classList.toggle('fa-eye-slash', isHidden);
      }
      pwBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      return;
    }

    var clearBtn = t.closest('[data-input-clear]');
    if (clearBtn) {
      var cId = clearBtn.getAttribute('data-input-clear');
      var cInput = document.getElementById(cId);
      if (!cInput) return;
      cInput.value = '';
      cInput.dispatchEvent(new Event('input', { bubbles: true }));
      cInput.dispatchEvent(new Event('change', { bubbles: true }));
      cInput.focus();
      return;
    }

    var stepBtn = t.closest('[data-input-step]');
    if (stepBtn) {
      var dir = stepBtn.getAttribute('data-input-step');
      var sId = stepBtn.getAttribute('data-input-target');
      var sInput = document.getElementById(sId);
      if (!sInput) return;
      if (dir === 'up') { sInput.stepUp(); } else { sInput.stepDown(); }
      sInput.dispatchEvent(new Event('input', { bubbles: true }));
      sInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
})();
</script>
<% } %>

```
