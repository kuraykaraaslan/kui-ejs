# ComboBox

- **id:** `combo-box`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ComboBox.ejs`
- **status:** beta
- **since:** 2026-05

Searchable autocomplete + tek seçim. Klavye navigasyonu, açıklamalı option ve clearable buton desteği.

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
<%- include('modules/ui/ComboBox', {
  label: 'Country',
  placeholder: 'Search countries…',
  hint: 'Start typing to filter.',
  options: [
    { value: 'tr', label: 'Türkiye',       description: 'TR · +90' },
    { value: 'de', label: 'Germany',       description: 'DE · +49' },
    { value: 'us', label: 'United States', description: 'US · +1'  },
  ]
}) %>
```

### With selected value

```ejs
<%- include('modules/ui/ComboBox', {
  label: 'Country',
  value: 'tr',
  options: COUNTRIES
}) %>
```

### Open with highlight

```ejs
<%- include('modules/ui/ComboBox', {
  label: 'Framework',
  value: 'next',
  options: FRAMEWORKS
}) %>
```

### Error state

```ejs
<%- include('modules/ui/ComboBox', {
  label: 'Country',
  required: true,
  error: 'Please select a country.',
  options: COUNTRIES
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/ComboBox', {
  label: 'Country',
  value: 'de',
  disabled: true,
  options: COUNTRIES
}) %>
```

## Full EJS source

```ejs
<%
  var _id            = locals.id            || 'combobox-' + Math.random().toString(36).substr(2, 9);
  var _label         = locals.label         || '';
  var _options       = locals.options       || [];
  var _value         = locals.value         || '';
  var _placeholder   = locals.placeholder   || 'Search or select...';
  var _hint          = locals.hint          || '';
  var _error         = locals.error         || '';
  var _dis           = !!locals.disabled;
  var _req           = !!locals.required;
  var _clearable     = locals.clearable !== false;
  var _noResultsText = locals.noResultsText || 'No results found.';
  var _className     = locals.className     || '';

  var hintId       = _hint  ? (_id + '-hint')  : '';
  var errorId      = _error ? (_id + '-error') : '';
  var describedBy  = [hintId, errorId].filter(Boolean).join(' ');
  var listboxId    = _id + '-listbox';
  var labelId      = _id + '-label';
  var inputId      = _id + '-input';

  var selectedOption = null;
  for (var i = 0; i < _options.length; i++) {
    if (_options[i].value === _value) { selectedOption = _options[i]; break; }
  }
  var selectedLabel = selectedOption ? selectedOption.label : '';

  var rootStateClass = _error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';
  var rootDisabledClass = _dis ? ' cursor-not-allowed bg-surface-sunken opacity-50' : '';
%>
<div
  id="<%= _id %>"
  class="space-y-1<%= _className ? ' ' + _className : '' %>"
  data-combobox-root
  data-value="<%= _value %>"
>
  <label id="<%= labelId %>" for="<%= inputId %>" class="block text-sm font-medium text-text-primary">
    <%= _label %><% if (_req) { %><span class="ml-1 text-error" aria-hidden="true">*</span><% } %>
  </label>

  <div
    role="combobox"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-controls="<%= listboxId %>"
    aria-labelledby="<%= labelId %>"
    aria-disabled="<%= _dis ? 'true' : 'false' %>"
    aria-invalid="<%= _error ? 'true' : 'false' %>"
    data-combobox-shell
    class="flex min-h-10 w-full items-center gap-2 rounded-md border bg-surface-base px-3 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-border-focus <%= rootStateClass %><%= rootDisabledClass %>"
  >
    <input
      id="<%= inputId %>"
      type="text"
      role="searchbox"
      <% if (_dis) { %>disabled<% } %>
      <% if (_req) { %>required<% } %>
      value="<%= selectedLabel %>"
      placeholder="<%= _placeholder %>"
      <% if (describedBy) { %>aria-describedby="<%= describedBy %>"<% } %>
      aria-autocomplete="list"
      autocomplete="off"
      data-combobox-input
      class="w-full bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"
    />

    <% if (_clearable) { %>
      <button
        type="button"
        aria-label="Clear selection"
        data-combobox-clear
        class="rounded px-1 text-text-disabled transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus<%= (!_value || _dis) ? ' hidden' : '' %>"
      >x</button>
    <% } %>

    <span aria-hidden="true" data-combobox-caret class="select-none text-xs text-text-disabled">v</span>
  </div>

  <ul
    id="<%= listboxId %>"
    role="listbox"
    data-combobox-list
    class="z-20 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface-raised py-1 shadow-lg hidden"
  >
    <% _options.forEach(function(option, index) {
      var isSelected = option.value === _value;
    %>
      <li
        id="<%= _id %>-option-<%= index %>"
        role="option"
        aria-selected="<%= isSelected ? 'true' : 'false' %>"
        data-combobox-option
        data-value="<%= option.value %>"
        data-label="<%= option.label %>"
        data-description="<%= option.description || '' %>"
        data-index="<%= index %>"
        <% if (option.disabled) { %>data-disabled="true"<% } %>
      >
        <button
          type="button"
          <% if (option.disabled) { %>disabled<% } %>
          class="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none hover:bg-surface-overlay<%= isSelected ? ' font-medium text-primary' : '' %><%= option.disabled ? ' cursor-not-allowed opacity-50' : '' %>"
        >
          <% if (option.icon) { %><span class="mt-0.5 shrink-0" aria-hidden="true"><%- option.icon %></span><% } %>
          <span class="min-w-0 flex-1">
            <span class="block truncate"><%= option.label %></span>
            <% if (option.description) { %>
              <span class="block truncate text-xs text-text-secondary"><%= option.description %></span>
            <% } %>
          </span>
        </button>
      </li>
    <% }); %>
    <li data-combobox-empty class="hidden px-3 py-3 text-sm text-text-secondary"><%= _noResultsText %></li>
  </ul>

  <% if (_hint && !_error) { %><p id="<%= hintId %>" class="text-xs text-text-secondary"><%= _hint %></p><% } %>
  <% if (_error) { %><p id="<%= errorId %>" class="text-xs text-error" role="alert"><%= _error %></p><% } %>
</div>

<script>
(function () {
  var rootId = '<%= _id %>';
  var root = document.getElementById(rootId);
  if (!root || root.dataset.cbInit === '1') return;
  root.dataset.cbInit = '1';

  var shell      = root.querySelector('[data-combobox-shell]');
  var input      = root.querySelector('[data-combobox-input]');
  var list       = root.querySelector('[data-combobox-list]');
  var caret      = root.querySelector('[data-combobox-caret]');
  var clearBtn   = root.querySelector('[data-combobox-clear]');
  var emptyEl    = root.querySelector('[data-combobox-empty]');
  var optionEls  = Array.prototype.slice.call(root.querySelectorAll('[data-combobox-option]'));
  if (!shell || !input || !list) return;

  var open = false;
  var highlighted = -1;
  var disabled = shell.getAttribute('aria-disabled') === 'true';

  function getSelectedValue() { return root.dataset.value || ''; }
  function setSelectedValue(v) { root.dataset.value = v; if (clearBtn) clearBtn.classList.toggle('hidden', !v || disabled); }

  function setOpen(next) {
    open = next;
    shell.setAttribute('aria-expanded', open ? 'true' : 'false');
    list.classList.toggle('hidden', !open);
    if (caret) caret.textContent = open ? '^' : 'v';
    if (!open) {
      highlighted = -1;
      var sel = getSelectedValue();
      var match = null;
      for (var i = 0; i < optionEls.length; i++) {
        if (optionEls[i].dataset.value === sel) { match = optionEls[i]; break; }
      }
      input.value = match ? match.dataset.label : '';
      refreshHighlight();
    }
  }

  function refreshHighlight() {
    optionEls.forEach(function (el, i) {
      var btn = el.querySelector('button');
      if (!btn) return;
      if (i === highlighted) btn.classList.add('bg-surface-overlay');
      else btn.classList.remove('bg-surface-overlay');
    });
  }

  function applyFilter() {
    var q = input.value.trim().toLowerCase();
    var anyVisible = false;
    optionEls.forEach(function (el) {
      var label = (el.dataset.label || '').toLowerCase();
      var desc  = (el.dataset.description || '').toLowerCase();
      var visible = !q || label.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
      el.classList.toggle('hidden', !visible);
      if (visible) anyVisible = true;
    });
    if (emptyEl) emptyEl.classList.toggle('hidden', anyVisible);
  }

  function visibleOptions() {
    return optionEls.filter(function (el) { return !el.classList.contains('hidden'); });
  }

  function moveHighlight(dir) {
    var vis = visibleOptions();
    if (vis.length === 0) return;
    var currentEl = highlighted >= 0 ? optionEls[highlighted] : null;
    var currentVis = currentEl ? vis.indexOf(currentEl) : -1;
    for (var i = 0; i < vis.length; i++) {
      currentVis = (currentVis + dir + vis.length) % vis.length;
      if (!vis[currentVis].dataset.disabled) {
        highlighted = optionEls.indexOf(vis[currentVis]);
        refreshHighlight();
        return;
      }
    }
  }

  function selectOption(el) {
    if (!el || el.dataset.disabled) return;
    setSelectedValue(el.dataset.value);
    input.value = el.dataset.label;
    optionEls.forEach(function (o) {
      var sel = o === el;
      o.setAttribute('aria-selected', sel ? 'true' : 'false');
      var btn = o.querySelector('button');
      if (btn) {
        if (sel) btn.classList.add('font-medium', 'text-primary');
        else btn.classList.remove('font-medium', 'text-primary');
      }
    });
    setOpen(false);
  }

  shell.addEventListener('click', function () {
    if (disabled) return;
    input.focus();
    setOpen(true);
  });

  input.addEventListener('focus', function () { if (!disabled) setOpen(true); });
  input.addEventListener('input', function () {
    setOpen(true);
    highlighted = -1;
    applyFilter();
    refreshHighlight();
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); moveHighlight(1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); if (!open) setOpen(true); moveHighlight(-1); return; }
    if (e.key === 'Enter') {
      if (!open || highlighted < 0) return;
      e.preventDefault();
      selectOption(optionEls[highlighted]);
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key === 'Tab') { setOpen(false); }
  });

  optionEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () { highlighted = optionEls.indexOf(el); refreshHighlight(); });
    el.addEventListener('mousedown',  function (e) { e.preventDefault(); });
    el.addEventListener('click',      function () { selectOption(el); });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (disabled) return;
      setSelectedValue('');
      input.value = '';
      optionEls.forEach(function (o) {
        o.setAttribute('aria-selected', 'false');
        var btn = o.querySelector('button');
        if (btn) btn.classList.remove('font-medium', 'text-primary');
      });
      setOpen(false);
      input.focus();
    });
  }

  document.addEventListener('mousedown', function (e) {
    if (root.contains(e.target)) return;
    if (open) setOpen(false);
  });

  setSelectedValue(getSelectedValue());
})();
</script>

```
