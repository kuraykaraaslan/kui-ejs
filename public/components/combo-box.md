# ComboBox

- **id:** `combo-box`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ComboBox/ComboBox.ejs`
- **status:** beta
- **since:** 2026-05

Searchable autocomplete single-select with keyboard navigation, described options, and a clearable button.

## Design tokens consumed

- `--border`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-sunken`
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

### Async loading (debounced)

```ejs
<%- include('modules/ui/ComboBox', {
  id: 'cb-async',
  label: 'Search',
  options: [],
  placeholder: 'Type to search…',
  hint: 'Debounced 300ms, AbortController cancels in-flight.'
}) %>

<script>
  // Wire an async resolver to the combobox root.
  var root = document.getElementById('cb-async');
  ComboBoxAsync.register(root, async function (query, signal) {
    var res = await fetch('/api/suggest?q=' + encodeURIComponent(query), { signal });
    var data = await res.json();
    // Render <li data-combobox-option> nodes into root.querySelector('[data-combobox-list]')
    return data;
  });
</script>
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
  // ComboBox (split entrypoint) — mirrors NextJS modules/ui/ComboBox/index.tsx.
  // Includes _trigger + _listbox partials and emits an init script that wires
  // filter.js / async.js / keyboard.js helpers.
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

  <%- include('./partials/_trigger', {
    _id: _id,
    _value: _value,
    _placeholder: _placeholder,
    _dis: _dis,
    _req: _req,
    _error: _error,
    _clearable: _clearable,
    hintId: hintId,
    errorId: errorId,
    describedBy: describedBy,
    listboxId: listboxId,
    labelId: labelId,
    inputId: inputId,
    selectedLabel: selectedLabel,
    rootStateClass: rootStateClass,
    rootDisabledClass: rootDisabledClass
  }) %>

  <%- include('./partials/_listbox', {
    _id: _id,
    _options: _options,
    _value: _value,
    listboxId: listboxId,
    _noResultsText: _noResultsText
  }) %>

  <% if (_hint && !_error) { %><p id="<%= hintId %>" class="text-xs text-text-secondary"><%= _hint %></p><% } %>
  <% if (_error) { %><p id="<%= errorId %>" class="text-xs text-error" role="alert"><%= _error %></p><% } %>
</div>

<%
  // Inline the helper scripts on the first include so consumers don't have to
  // remember to <script> them. Idempotent — the helpers self-guard.
%>
<script><%- include('./scripts/filter.js') %></script>
<script><%- include('./scripts/async.js') %></script>
<script><%- include('./scripts/keyboard.js') %></script>

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
  var loadingEl  = root.querySelector('[data-combobox-loading]');
  var sentinelEl = root.querySelector('[data-combobox-sentinel]');
  var optionEls  = Array.prototype.slice.call(root.querySelectorAll('[data-combobox-option]'));
  if (!shell || !input || !list) return;

  var open = false;
  var highlighted = -1;
  var disabled = shell.getAttribute('aria-disabled') === 'true';

  function getSelectedValue() { return root.dataset.value || ''; }
  function setSelectedValue(v) {
    root.dataset.value = v;
    if (clearBtn) clearBtn.classList.toggle('hidden', !v || disabled);
  }

  function updateCaret() {
    if (!caret) return;
    caret.classList.toggle('fa-chevron-up', open);
    caret.classList.toggle('fa-chevron-down', !open);
  }

  function setOpen(next) {
    open = next;
    shell.setAttribute('aria-expanded', open ? 'true' : 'false');
    list.classList.toggle('hidden', !open);
    updateCaret();
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
    if (window.ComboBoxAsync && window.ComboBoxAsync.has(root)) return; // async owns visibility
    if (window.__cbFilter) window.__cbFilter.applyFilter(optionEls, input.value, emptyEl);
  }

  function visibleOptions() {
    return optionEls.filter(function (el) { return !el.classList.contains('hidden'); });
  }

  function moveHighlight(dir) {
    var vis = visibleOptions();
    var currentEl = highlighted >= 0 ? optionEls[highlighted] : null;
    var currentVis = currentEl ? vis.indexOf(currentEl) : -1;
    var nextVis = window.__cbKeyboard ? window.__cbKeyboard.nextHighlight(vis, currentVis, dir) : -1;
    if (nextVis === -1) return;
    highlighted = optionEls.indexOf(vis[nextVis]);
    refreshHighlight();
  }

  function jumpHighlight(where) {
    var vis = visibleOptions();
    var idx = window.__cbKeyboard ? window.__cbKeyboard.edgeHighlight(vis, where) : -1;
    if (idx === -1) return;
    highlighted = optionEls.indexOf(vis[idx]);
    refreshHighlight();
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

  function setLoading(state) {
    if (loadingEl) loadingEl.classList.toggle('hidden', !state);
    if (emptyEl)   emptyEl.classList.toggle('hidden', state);
  }

  function runAsync() {
    if (!window.ComboBoxAsync || !window.ComboBoxAsync.has(root)) return;
    window.ComboBoxAsync.search(root, input.value, {
      onStart:  function () { setLoading(true); },
      onResult: function () { /* result render handled by host registration */ },
      onError:  function () { /* no-op */ },
      onFinish: function () { setLoading(false); },
    });
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
    runAsync();
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); moveHighlight(1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); if (!open) setOpen(true); moveHighlight(-1); return; }
    if (e.key === 'Home')      { e.preventDefault(); if (!open) setOpen(true); jumpHighlight('first'); return; }
    if (e.key === 'End')       { e.preventDefault(); if (!open) setOpen(true); jumpHighlight('last'); return; }
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

  // TODO M1: wire IntersectionObserver against sentinelEl to call onLoadMore.
  // Hosts may attach their handler via root.addEventListener('combobox:loadmore', ...).
  if (sentinelEl && typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0] || !entries[0].isIntersecting) return;
      root.dispatchEvent(new CustomEvent('combobox:loadmore'));
    }, { root: list, rootMargin: '40px' });
    io.observe(sentinelEl);
  }

  document.addEventListener('mousedown', function (e) {
    if (root.contains(e.target)) return;
    if (open) setOpen(false);
  });

  setSelectedValue(getSelectedValue());
})();
</script>

```
