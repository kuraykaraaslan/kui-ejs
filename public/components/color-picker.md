# ColorPicker

- **id:** `color-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ColorPicker.ejs`
- **status:** stable
- **since:** 2026-05

Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. Pixel-identical React sibling at modules/ui/ColorPicker.tsx. Used by RichTextEditor for text + highlight colors.

## Design tokens consumed

- `--border`
- `--border-focus`
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
<%- include('modules/ui/ColorPicker', {
  id: 'brand',
  name: 'brand',
  label: 'Brand color',
  value: '#3b82f6',
  showNoColor: true
}) %>
```

### Compact (swatches only)

```ejs
<%- include('modules/ui/ColorPicker', {
  id: 'compact',
  value: '#22c55e',
  showHexInput: false,
  showNativePicker: false
}) %>
```

### Hex + native picker only (no swatches)

```ejs
<%- include('modules/ui/ColorPicker', {
  id: 'bg',
  label: 'Background',
  swatches: [],
  showHexInput: true,
  showNativePicker: true,
  showNoColor: true
}) %>
```

## Full EJS source

```ejs
<%
  // ─── ColorPicker (EJS) ──────────────────────────────────────────────────────
  //
  // Pixel-identical sibling of
  // /home/kuray/01_NextJS_Components/modules/ui/ColorPicker.tsx — same DOM,
  // same Tailwind classes, same default swatches.
  //
  // Standalone trigger button + popover panel. Use as a stand-alone form
  // control or embed into custom toolbars.
  //
  // Locals:
  //   id            — required, used as button id (popover gets `${id}-pop`)
  //   name          — hidden input name for form integration
  //   label         — visible label above the trigger
  //   value         — initial hex color, '' or null for "no color"
  //   swatches      — array of hex strings (defaults to DEFAULT_COLOR_SWATCHES)
  //   showHexInput      — default true
  //   showNativePicker  — default true
  //   showNoColor       — default false
  //   align         — 'left' | 'right' (popover alignment)
  //   triggerLabel  — aria-label for the trigger button
  //   className     — extra classes on wrapper
  //   onChangeFn    — name of a global JS function called with (color|null, id)
  //
  // Page-level integration: listen for `kui-colorpicker:change` on the
  // wrapper (event.detail.value is hex string or null).

  var DEFAULT_SWATCHES = [
    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#ffffff',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#fca5a5', '#fdba74', '#fcd34d', '#fde047', '#bef264', '#86efac', '#6ee7b7', '#5eead4',
  ];

  var _id     = locals.id    || ('cp-' + Math.random().toString(36).substr(2, 6));
  var _name   = locals.name  || '';
  var _label  = locals.label || '';
  var _value  = locals.value || '';
  var _swatches = Array.isArray(locals.swatches) && locals.swatches.length ? locals.swatches : DEFAULT_SWATCHES;
  var _showHexInput     = locals.showHexInput === false ? false : true;
  var _showNativePicker = locals.showNativePicker === false ? false : true;
  var _showNoColor      = !!locals.showNoColor;
  var _align     = locals.align === 'right' ? 'right' : 'left';
  var _triggerLabel = locals.triggerLabel || _label || 'Pick a color';
  var _className = locals.className || '';
  var _onChangeFn = locals.onChangeFn || '';
  var _iconOnly  = !!locals.iconOnly;
  var _icon      = locals.icon || '';  // FontAwesome class name e.g. 'fa-palette'
%>
<div
  data-kui-colorpicker="<%= _id %>"
  class="relative inline-block<%= _className ? ' ' + _className : '' %>"
>
  <% if (_label && !_iconOnly) { %>
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1"><%= _label %></label>
  <% } %>
  <% if (_iconOnly) { %>
  <button
    type="button"
    id="<%= _id %>"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-label="<%= _triggerLabel %>"
    title="<%= _triggerLabel %>"
    class="kui-rte-btn relative inline-flex items-center justify-center w-8 h-8 sm:w-7 sm:h-7 rounded text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <% if (_icon) { %><i class="fa-solid <%= _icon %> w-3.5 h-3.5" aria-hidden="true" style="font-size:0.875rem"></i><% } %>
    <span
      data-cp-bar
      class="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-sm"
      style="background: <%= _value || 'transparent' %>"
      aria-hidden="true"
    ></span>
  </button>
  <% } else { %>
  <button
    type="button"
    id="<%= _id %>"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-label="<%= _triggerLabel %>"
    class="inline-flex items-center gap-2 rounded-md border border-border bg-surface-base px-2.5 py-1.5 text-sm text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <span
      data-cp-swatch
      class="w-4 h-4 rounded-sm border border-border shrink-0"
      aria-hidden="true"
    ></span>
    <span data-cp-label class="font-mono text-xs"><%= _value || 'none' %></span>
    <i class="fa-solid fa-chevron-down w-2.5 h-2.5 text-text-disabled" aria-hidden="true" style="font-size:0.625rem"></i>
  </button>
  <% } %>
  <div
    role="dialog"
    aria-label="Color picker"
    data-cp-popover
    class="hidden absolute top-full mt-1 z-50 w-64 p-3 rounded-lg border border-border bg-surface-raised shadow-lg <%= _align === 'right' ? 'right-0' : 'left-0' %>"
  >
    <div data-cp-grid class="grid grid-cols-8 gap-1 mb-3">
      <% _swatches.forEach(function (c) { %>
        <button
          type="button"
          aria-label="Color <%= c %>"
          title="<%= c %>"
          data-cp-color="<%= c %>"
          class="w-6 h-6 rounded-sm border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          style="background: <%= c %>"
        ></button>
      <% }); %>
    </div>
    <% if (_showHexInput || _showNativePicker || _showNoColor) { %>
    <div class="flex items-center gap-2">
      <% if (_showHexInput) { %>
      <input
        type="text"
        data-cp-hex
        spellcheck="false"
        value="<%= _value %>"
        placeholder="#000000"
        aria-label="Hex color"
        class="flex-1 min-w-0 font-mono text-xs px-2 py-1 rounded border border-border bg-surface-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      />
      <% } %>
      <% if (_showNativePicker) { %>
      <input
        type="color"
        data-cp-native
        value="<%= _value || '#000000' %>"
        aria-label="Native color picker"
        class="w-7 h-7 rounded border border-border bg-surface-base cursor-pointer p-0"
      />
      <% } %>
      <% if (_showNoColor) { %>
      <button
        type="button"
        data-cp-none
        aria-label="No color"
        title="No color"
        class="w-7 h-7 inline-flex items-center justify-center rounded border border-border bg-surface-base text-text-secondary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <i class="fa-solid fa-xmark w-3 h-3" aria-hidden="true" style="font-size:0.75rem"></i>
      </button>
      <% } %>
    </div>
    <% } %>
  </div>
  <% if (_name) { %>
  <input type="hidden" data-cp-input name="<%= _name %>" value="<%= _value %>" />
  <% } %>
</div>

<script>
(function () {
  var id = <%- JSON.stringify(_id) %>;
  var onChangeFn = <%- JSON.stringify(_onChangeFn) %>;
  if (window.__kuiColorPickerInit && window.__kuiColorPickerInit[id]) return;
  window.__kuiColorPickerInit = window.__kuiColorPickerInit || {};
  window.__kuiColorPickerInit[id] = true;

  function init() {
    var root = document.querySelector('[data-kui-colorpicker="' + id + '"]');
    if (!root) return;
    var btn   = root.querySelector('#' + id);
    var pop   = root.querySelector('[data-cp-popover]');
    var swEl  = root.querySelector('[data-cp-swatch]');
    var bar   = root.querySelector('[data-cp-bar]');
    var label = root.querySelector('[data-cp-label]');
    var hex   = root.querySelector('[data-cp-hex]');
    var nat   = root.querySelector('[data-cp-native]');
    var hidden= root.querySelector('[data-cp-input]');
    var noneBtn = root.querySelector('[data-cp-none]');
    if (!btn || !pop) return;

    var current = (hidden && hidden.value) || (hex && hex.value) || '';
    paintSwatch(current);

    function paintSwatch(v) {
      if (bar) {
        bar.style.background = v || 'transparent';
      }
      if (swEl) {
        if (v) {
          swEl.style.background = v;
          swEl.style.backgroundImage = '';
          swEl.style.backgroundSize = '';
          swEl.style.backgroundPosition = '';
        } else {
          swEl.style.background = 'transparent';
          swEl.style.backgroundImage = 'linear-gradient(45deg, var(--surface-sunken) 25%, transparent 25%, transparent 75%, var(--surface-sunken) 75%), linear-gradient(45deg, var(--surface-sunken) 25%, transparent 25%, transparent 75%, var(--surface-sunken) 75%)';
          swEl.style.backgroundSize = '8px 8px';
          swEl.style.backgroundPosition = '0 0, 4px 4px';
        }
      }
      if (label) {
        label.textContent = v || 'none';
      }
      // outline selected swatch
      Array.prototype.forEach.call(root.querySelectorAll('[data-cp-color]'), function (el) {
        if (v && el.getAttribute('data-cp-color').toLowerCase() === v.toLowerCase()) {
          el.classList.add('ring-2', 'ring-border-focus');
        } else {
          el.classList.remove('ring-2', 'ring-border-focus');
        }
      });
    }

    function normalizeHex(s) {
      if (!s) return null;
      s = String(s).trim();
      if (s[0] !== '#') s = '#' + s;
      if (/^#[0-9a-fA-F]{3}$/.test(s)) {
        s = '#' + s[1]+s[1] + s[2]+s[2] + s[3]+s[3];
      }
      return /^#[0-9a-fA-F]{6}$/.test(s) ? s.toLowerCase() : null;
    }

    function open()  { pop.classList.remove('hidden'); btn.setAttribute('aria-expanded', 'true'); }
    function close() { pop.classList.add('hidden');    btn.setAttribute('aria-expanded', 'false'); }
    function toggle(){ pop.classList.contains('hidden') ? open() : close(); }

    function commit(v) {
      current = v || '';
      paintSwatch(current);
      if (hidden) hidden.value = current;
      if (hex) hex.value = current;
      if (nat && current) nat.value = current;
      try { root.dispatchEvent(new CustomEvent('kui-colorpicker:change', { bubbles: true, detail: { value: current || null, id: id } })); } catch(e){}
      if (onChangeFn && typeof window[onChangeFn] === 'function') {
        try { window[onChangeFn](current || null, id); } catch(e){}
      }
    }

    btn.addEventListener('click', toggle);

    Array.prototype.forEach.call(root.querySelectorAll('[data-cp-color]'), function (el) {
      el.addEventListener('click', function () {
        commit(el.getAttribute('data-cp-color'));
        close();
      });
    });
    if (hex) {
      hex.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var n = normalizeHex(hex.value);
          if (n) { commit(n); close(); }
        }
      });
      hex.addEventListener('blur', function () {
        var n = normalizeHex(hex.value);
        if (n) commit(n);
      });
    }
    if (nat) {
      nat.addEventListener('input', function () { commit(nat.value); });
    }
    if (noneBtn) {
      noneBtn.addEventListener('click', function () { commit(''); close(); });
    }
    // outside click + esc
    document.addEventListener('mousedown', function (e) {
      if (pop.classList.contains('hidden')) return;
      if (!root.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !pop.classList.contains('hidden')) close();
    });

    // Expose API
    window.KuiColorPicker = window.KuiColorPicker || { _byId: {}, get: function (i) { return this._byId[i] || null; } };
    window.KuiColorPicker._byId[id] = {
      get: function () { return current || null; },
      set: function (v) { commit(v || ''); },
      open: open, close: close,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

```
