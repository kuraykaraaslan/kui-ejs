# Select

- **id:** `select`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Select.ejs`
- **status:** stable
- **since:** 2025-02

Label + select + hint + error anatomy. appearance-none overrides the native dropdown style and renders a chevron icon.

## Used by

- `form-builder`

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/Select', {
  label: 'Role',
  placeholder: 'Select a role…',
  options: [
    { value: 'admin',  label: 'Admin'  },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]
}) %>
```

### With hint & selected value

```ejs
<%- include('modules/ui/Select', {
  label: 'Role',
  hint: 'Determines access level.',
  value: 'editor',
  options: ROLES
}) %>
```

### Error state

```ejs
<%- include('modules/ui/Select', {
  label: 'Plan',
  placeholder: 'Select a plan',
  required: true,
  error: 'Please select a plan.',
  options: PLANS
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/Select', { label: 'Plan', disabled: true, value: 'editor', options: ROLES }) %>
```

## Full EJS source

```ejs
<%
  var _id         = locals.id         || 'select-' + Math.random().toString(36).substr(2, 9);
  var _dis        = !!locals.disabled;
  var _req        = !!locals.required;
  var _opts       = locals.options    || [];
  var _searchable = !!locals.searchable;
  var _hasIcons   = _opts.some(function (o) { return !!o.icon; });
  var _useCombo   = _searchable || _hasIcons;

  var _val        = (locals.value !== undefined && locals.value !== null) ? String(locals.value) : '';

  var _hintId  = (locals.hint  && !locals.error) ? (_id + '-hint')  : '';
  var _errorId = locals.error ? (_id + '-error') : '';
  var _describedBy = [_hintId, _errorId].filter(function (x) { return !!x; }).join(' ');

  var _selected = null;
  for (var i = 0; i < _opts.length; i++) {
    if (String(_opts[i].value) === _val) { _selected = _opts[i]; break; }
  }
%>
<% if (_useCombo) { %>
  <%
    var comboClass = 'flex items-center gap-2 w-full rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer '
      + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ';
    comboClass += locals.error
      ? 'border-error ring-1 ring-error bg-error-subtle '
      : 'border-border bg-surface-base ';
    if (_dis) comboClass += 'opacity-50 cursor-not-allowed bg-surface-sunken ';
  %>
  <div
    class="space-y-1 <%= locals.className || '' %>"
    data-combobox-root
    data-combobox-id="<%= _id %>"
    data-combobox-searchable="<%= _searchable ? '1' : '0' %>"
  >
    <label id="<%= _id %>-label" class="block text-sm font-medium text-text-primary">
      <%= locals.label || '' %><% if (_req) { %><span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span><% } %>
    </label>

    <input type="hidden" name="<%= locals.name || _id %>" value="<%= _val %>" data-combobox-value />

    <div
      id="<%= _id %>"
      role="combobox"
      tabindex="<%= _dis ? '-1' : '0' %>"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-labelledby="<%= _id %>-label"
      <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
      aria-disabled="<%= _dis ? 'true' : 'false' %>"
      aria-required="<%= _req ? 'true' : 'false' %>"
      aria-invalid="<%= locals.error ? 'true' : 'false' %>"
      data-testid="select-<%= _id %>"
      data-combobox-trigger
      class="<%= comboClass %>"
    >
      <% if (_selected && _selected.icon) { %>
        <span class="shrink-0" data-combobox-selected-icon><%- _selected.icon %></span>
      <% } %>
      <span
        class="flex-1 <%= _selected ? '' : 'text-text-disabled' %>"
        data-combobox-display
      ><%= _selected ? _selected.label : (locals.placeholder || 'Select…') %></span>
      <span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled" aria-hidden="true">
        <i class="fa-solid fa-chevron-down" data-combobox-chevron style="font-size:12px"></i>
      </span>
    </div>

    <div
      class="z-20 w-full rounded-md border border-border bg-surface-raised shadow-lg overflow-hidden hidden"
      data-combobox-panel
    >
      <% if (_searchable) { %>
        <div class="p-2 border-b border-border">
          <input
            type="text"
            placeholder="Search…"
            data-combobox-search
            class="block w-full rounded-md border border-border bg-surface-base px-3 py-1.5 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          />
        </div>
      <% } %>
      <ul
        role="listbox"
        aria-labelledby="<%= _id %>-label"
        class="py-1 max-h-48 overflow-y-auto"
        data-combobox-list
      >
        <% if (locals.placeholder) { %>
          <li
            role="option"
            aria-selected="<%= _val === '' ? 'true' : 'false' %>"
            tabindex="0"
            data-combobox-option=""
            class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-text-disabled select-none hover:bg-surface-overlay focus-visible:outline-none focus-visible:bg-surface-overlay"
          ><%= locals.placeholder %></li>
        <% } %>
        <% _opts.forEach(function (opt) { %>
          <% var active = String(opt.value) === _val; %>
          <li
            role="option"
            aria-selected="<%= active ? 'true' : 'false' %>"
            tabindex="0"
            data-combobox-option="<%= opt.value %>"
            data-combobox-label="<%= opt.label %>"
            class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay <%= active ? 'text-primary font-medium' : '' %>"
          >
            <% if (opt.icon) { %><span class="shrink-0" aria-hidden="true"><%- opt.icon %></span><% } %>
            <span><%= opt.label %></span>
            <% if (active) { %>
              <span class="ml-auto w-3 h-3 inline-flex items-center justify-center text-primary" aria-hidden="true">
                <i class="fa-solid fa-check" style="font-size:12px"></i>
              </span>
            <% } %>
          </li>
        <% }); %>
        <li class="px-3 py-4 text-sm text-center text-text-secondary hidden" data-combobox-empty>No results found.</li>
      </ul>
    </div>

    <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= locals.hint %></p><% } %>
    <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= locals.error %></p><% } %>
  </div>

  <script>
  (function () {
    if (window.__kuiComboBound) return;
    window.__kuiComboBound = true;

    function closeAll(except) {
      document.querySelectorAll('[data-combobox-root]').forEach(function (root) {
        if (root === except) return;
        var panel   = root.querySelector('[data-combobox-panel]');
        var trigger = root.querySelector('[data-combobox-trigger]');
        var chev    = root.querySelector('[data-combobox-chevron]');
        if (panel)   panel.classList.add('hidden');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (chev) { chev.classList.remove('fa-chevron-up'); chev.classList.add('fa-chevron-down'); }
      });
    }

    document.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!(t instanceof Element)) return;

      var trigger = t.closest('[data-combobox-trigger]');
      if (trigger) {
        var root  = trigger.closest('[data-combobox-root]');
        if (!root || root.querySelector('[data-combobox-trigger]').getAttribute('aria-disabled') === 'true') return;
        var panel = root.querySelector('[data-combobox-panel]');
        var chev  = root.querySelector('[data-combobox-chevron]');
        var open  = panel.classList.contains('hidden');
        closeAll(root);
        panel.classList.toggle('hidden', !open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (chev) {
          chev.classList.toggle('fa-chevron-up', open);
          chev.classList.toggle('fa-chevron-down', !open);
        }
        if (open && root.dataset.comboboxSearchable === '1') {
          var s = root.querySelector('[data-combobox-search]');
          if (s) setTimeout(function () { s.focus(); }, 30);
        }
        return;
      }

      var opt = t.closest('[data-combobox-option]');
      if (opt) {
        var oRoot = opt.closest('[data-combobox-root]');
        if (!oRoot) return;
        var val = opt.getAttribute('data-combobox-option');
        var lbl = opt.getAttribute('data-combobox-label') || opt.textContent.trim();
        var hidden  = oRoot.querySelector('[data-combobox-value]');
        var display = oRoot.querySelector('[data-combobox-display]');
        var panel   = oRoot.querySelector('[data-combobox-panel]');
        var trig    = oRoot.querySelector('[data-combobox-trigger]');
        var chev    = oRoot.querySelector('[data-combobox-chevron]');
        if (hidden)  { hidden.value = val; hidden.dispatchEvent(new Event('change', { bubbles: true })); }
        if (display) {
          display.textContent = val === '' ? (display.textContent || 'Select…') : lbl;
          display.classList.toggle('text-text-disabled', val === '');
        }
        oRoot.querySelectorAll('[data-combobox-option]').forEach(function (li) {
          li.setAttribute('aria-selected', li === opt ? 'true' : 'false');
          li.classList.toggle('text-primary', li === opt && val !== '');
          li.classList.toggle('font-medium', li === opt && val !== '');
        });
        if (panel) panel.classList.add('hidden');
        if (trig)  trig.setAttribute('aria-expanded', 'false');
        if (chev) { chev.classList.remove('fa-chevron-up'); chev.classList.add('fa-chevron-down'); }
        return;
      }

      if (!t.closest('[data-combobox-root]')) closeAll(null);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeAll(null);
      var t = ev.target;
      if (!(t instanceof Element)) return;
      var trigger = t.closest('[data-combobox-trigger]');
      if (trigger && (ev.key === 'Enter' || ev.key === ' ')) {
        ev.preventDefault();
        trigger.click();
      }
      var opt = t.closest('[data-combobox-option]');
      if (opt && (ev.key === 'Enter' || ev.key === ' ')) {
        ev.preventDefault();
        opt.click();
      }
    });

    document.addEventListener('input', function (ev) {
      var t = ev.target;
      if (!(t instanceof Element)) return;
      if (!t.matches('[data-combobox-search]')) return;
      var root = t.closest('[data-combobox-root]');
      if (!root) return;
      var q = t.value.toLowerCase();
      var any = false;
      root.querySelectorAll('[data-combobox-option]').forEach(function (li) {
        var label = (li.getAttribute('data-combobox-label') || li.textContent || '').toLowerCase();
        var match = !q || label.indexOf(q) !== -1;
        li.classList.toggle('hidden', !match);
        if (match) any = true;
      });
      var empty = root.querySelector('[data-combobox-empty]');
      if (empty) empty.classList.toggle('hidden', any);
    });
  })();
  </script>
<% } else { %>
  <%
    var baseClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors appearance-none '
      + 'bg-surface-base text-text-primary '
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
    <div class="relative">
      <select
        id="<%= _id %>"
        class="<%= baseClass %> pr-8"
        <% if (_dis) { %>disabled<% } %>
        <% if (_req) { %>required<% } %>
        <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
        aria-invalid="<%= locals.error ? 'true' : 'false' %>"
        <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
        data-testid="select-<%= _id %>"
      >
        <% if (locals.placeholder) { %>
          <option value="" <%= _val === '' ? 'selected' : '' %>><%= locals.placeholder %></option>
        <% } %>
        <% _opts.forEach(function (opt) { %>
          <option value="<%= opt.value %>" <%= String(opt.value) === _val ? 'selected' : '' %>><%= opt.label %></option>
        <% }); %>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-disabled">
        <span class="w-3 h-3 inline-flex items-center justify-center" aria-hidden="true">
          <i class="fa-solid fa-chevron-down" style="font-size:12px"></i>
        </span>
      </div>
    </div>
    <% if (_hintId) { %><p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= locals.hint %></p><% } %>
    <% if (_errorId) { %><p id="<%= _errorId %>" class="text-xs text-error" role="alert"><%= locals.error %></p><% } %>
  </div>
<% } %>

```
