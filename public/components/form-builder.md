# FormBuilder

- **id:** `form-builder`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FormBuilder/FormBuilder.ejs`
- **status:** beta
- **since:** 2026-05

Typeform / JotForm-style drag-to-build form designer. M1 ships the field palette (text / email / number / textarea / select / radio / checkbox / date / file — multiselect / signature / rating are palette stubs), a draggable canvas with reorder + duplicate + delete, a right-hand settings panel (label, name, placeholder, helper text, required, default value, options), JSON schema export / import, and a paired FormRenderer with required + email-format validation. Future milestones: full validation engine + custom validators (M2), conditional logic editor + runtime AST eval (M3), multi-page + save & resume (M4), schema I/O + webhooks + signature / rating (M5), full WAI-ARIA / keyboard parity + i18n + theming (M6). Pixel-identical React sibling at modules/app/FormBuilder/index.tsx.

## Depends on (include order)

- `button`
- `input`
- `checkbox`
- `select`
- `textarea`

## Accessibility

- WCAG: AA
- ARIA patterns: application, list, listitem, radiogroup, alert
- Keyboard:
  - `Tab` — Move focus across palette / canvas / settings
  - `Enter / Space` — Activate palette item to append a field
  - `Drag (mouse)` — Drag from palette → drop into canvas; reorder by dragging the grip handle

Builder root is role="application" with aria-label. Canvas list is role="list"; each draggable card is role="listitem" with aria-current when selected. FormRenderer adds aria-required + aria-invalid + aria-describedby per field, and surfaces validation messages with role="alert". Keyboard reorder + LiveRegion announcements land in M6.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-strong`
- `--border-focus`
- `--primary`
- `--primary-hover`
- `--primary-active`
- `--primary-fg`
- `--error`
- `--error-subtle`

## Variants

### Builder (drag + edit)

```ejs
<%- include('modules/app/FormBuilder', {
  id: 'contact-builder',
  schema: {
    id: 'contact',
    title: 'Contact form',
    fields: [
      { id: 'f1', type: 'text',  name: 'name',  label: 'Your name', required: true },
      { id: 'f2', type: 'email', name: 'email', label: 'Email',     required: true }
    ]
  }
}) %>

<script>
  // Read or replace the live schema:
  var api = window.KuiFormBuilder['contact-builder'];
  console.log(api.getSchema());
</script>
```

### Builder + live FormRenderer

```ejs
<%- include('modules/app/FormBuilder', { id: 'b', schema: schema }) %>
<%- include('modules/app/FormRenderer', { id: 'r', schema: schema }) %>

<script>
  document.getElementById('r').addEventListener('KuiFormRenderer:r:submit', function (e) {
    fetch('/api/submit', { method: 'POST', body: JSON.stringify(e.detail.values) });
  });
</script>
```

### Standalone renderer (required + email validation)

```ejs
<%- include('modules/app/FormRenderer', {
  id: 'contact-form',
  schema: schema
}) %>

<script>
  document.getElementById('contact-form')
    .addEventListener('KuiFormRenderer:contact-form:submit', function (e) {
      console.log('values', e.detail.values);
    });
</script>
```

## Full EJS source

```ejs
<%
  // ── FormBuilder EJS (M1 — Field palette + canvas + settings) ─────────
  // Pixel-identical to modules/app/FormBuilder/index.tsx in 01_NextJS_Components.
  // HTML5 native drag-and-drop palette → canvas + canvas reorder + duplicate
  // + delete + JSON schema export / import. Per-field settings panel on right.
  // TODO M2: validation rules editor inside FieldSettings.
  // TODO M3: visual conditional-logic editor (LogicEditor.ejs).
  // TODO M4: multi-page tabs (PagesPanel.ejs).
  // TODO M5: PreviewToggle.ejs swapping editor ↔ FormRenderer.
  // TODO M6: full keyboard reorder + LiveRegion announcements.
  var _id     = locals.id     || 'fb-' + Math.random().toString(36).substr(2, 9);
  var _schema = locals.schema || { id: 'form', title: 'Untitled form', description: '', fields: [] };
  if (!_schema.fields) _schema.fields = [];

  var FIELD_TYPES_M1 = [
    { type: 'text',        label: 'Text',        icon: 'fa-font',         disabled: false },
    { type: 'email',       label: 'Email',       icon: 'fa-at',           disabled: false },
    { type: 'number',      label: 'Number',      icon: 'fa-hashtag',      disabled: false },
    { type: 'textarea',    label: 'Textarea',    icon: 'fa-align-left',   disabled: false },
    { type: 'select',      label: 'Select',      icon: 'fa-caret-down',   disabled: false },
    { type: 'multiselect', label: 'Multiselect', icon: 'fa-square-check', disabled: true  },
    { type: 'radio',       label: 'Radio',       icon: 'fa-circle-dot',   disabled: false },
    { type: 'checkbox',    label: 'Checkbox',    icon: 'fa-square-check', disabled: false },
    { type: 'date',        label: 'Date',        icon: 'fa-calendar',     disabled: false },
    { type: 'file',        label: 'File',        icon: 'fa-paperclip',    disabled: false },
    { type: 'signature',   label: 'Signature',   icon: 'fa-signature',    disabled: true  },
    { type: 'rating',      label: 'Rating',      icon: 'fa-star',         disabled: true  }
  ];
%>
<div
  id="<%= _id %>"
  role="application"
  aria-label="Form builder"
  data-form-builder-id="<%= _id %>"
  class="fb-root flex flex-col gap-3 p-3 rounded-lg bg-surface-overlay border border-border"
>
  <!-- ── Toolbar ───────────────────────────────────────────────────── -->
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium text-text-primary" data-fb-title><%= _schema.title || 'Untitled form' %></span>
    <span class="text-xs text-text-secondary" data-fb-count>(<%= _schema.fields.length %> field<%= _schema.fields.length === 1 ? '' : 's' %>)</span>
    <span class="flex-1"></span>
    <button type="button" data-fb-action="import"
      class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm bg-surface-base border border-border text-text-primary hover:bg-surface-overlay hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-file-import w-3.5 h-3.5" aria-hidden="true"></i>
      <span>Import JSON</span>
    </button>
    <input type="file" accept="application/json,.json" data-fb-import-file class="hidden" />
    <button type="button" data-fb-action="export"
      class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm bg-surface-base border border-border text-text-primary hover:bg-surface-overlay hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-file-export w-3.5 h-3.5" aria-hidden="true"></i>
      <span>Export JSON</span>
    </button>
  </div>

  <!-- ── Three-pane workspace ──────────────────────────────────────── -->
  <div class="flex gap-3 items-stretch min-h-[24rem]">
    <!-- Palette -->
    <aside aria-label="Fields" class="fb-palette w-56 shrink-0 rounded-lg border border-border bg-surface-raised flex flex-col">
      <h3 class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary border-b border-border">Fields</h3>
      <ul role="list" class="flex flex-col gap-1 p-2 overflow-y-auto">
        <% FIELD_TYPES_M1.forEach(function (m) { %>
          <li role="listitem">
            <button type="button"
              draggable="<%= m.disabled ? 'false' : 'true' %>"
              data-fb-palette-type="<%= m.type %>"
              <%= m.disabled ? 'disabled aria-disabled="true"' : '' %>
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm bg-surface-base border border-border text-text-primary hover:bg-surface-overlay hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <i class="fa-solid <%= m.icon %> w-4 h-4 text-text-secondary" aria-hidden="true"></i>
              <span class="truncate"><%= m.label %></span>
              <% if (m.disabled) { %><span class="ml-auto text-[10px] uppercase text-text-disabled">soon</span><% } %>
            </button>
          </li>
        <% }); %>
      </ul>
    </aside>

    <!-- Canvas -->
    <section aria-label="Form" class="fb-canvas flex-1 min-w-0 rounded-lg border border-border bg-surface-raised flex flex-col">
      <header class="px-3 py-2 border-b border-border">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-text-secondary">Form</h3>
      </header>
      <ul role="list" aria-label="Form fields" data-fb-canvas-list class="fb-canvas-list flex-1 flex flex-col gap-1.5 p-3 min-h-[12rem] overflow-y-auto">
        <div aria-hidden="true" data-fb-slot="0" class="fb-drop-indicator mx-1 h-0.5 rounded-full transition-colors bg-transparent"></div>
        <% _schema.fields.forEach(function (field, i) { %>
          <%- include('./partials/_field-card', { field: field, index: i }) %>
          <div aria-hidden="true" data-fb-slot="<%= i + 1 %>" class="fb-drop-indicator mx-1 h-0.5 rounded-full transition-colors bg-transparent"></div>
        <% }); %>
        <% if (_schema.fields.length === 0) { %>
          <li aria-hidden="true" data-fb-empty class="fb-canvas-empty text-sm text-text-disabled italic text-center py-10 border border-dashed border-border rounded-md">
            Drag a field from the palette to start building.
          </li>
        <% } %>
      </ul>
    </section>

    <!-- Settings panel -->
    <aside aria-label="Settings" class="fb-settings w-72 shrink-0 rounded-lg border border-border bg-surface-raised flex flex-col">
      <h3 class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary border-b border-border">Settings</h3>
      <div data-fb-settings-body class="flex flex-col gap-3 p-3 overflow-y-auto">
        <p data-fb-settings-empty class="text-sm text-text-disabled italic px-3 py-6 text-center">Select a field to edit its settings.</p>
      </div>
    </aside>
  </div>
</div>

<script>
(function () {
  var FB_ID  = '<%= _id %>';
  var root   = document.getElementById(FB_ID);
  if (!root) return;
  var schema = <%- JSON.stringify(_schema) %>;

  /* ── Shared state ─────────────────────────────────────────────────── */
  <%- include('./scripts/schema-state.js') %>

  /* ── HTML5 drag-and-drop ──────────────────────────────────────────── */
  <%- include('./scripts/drag-drop.js') %>

  /* ── Init + public API ────────────────────────────────────────────── */
  bindAll();
  window.KuiFormBuilder = window.KuiFormBuilder || {};
  window.KuiFormBuilder[FB_ID] = {
    getSchema: function () { return JSON.parse(JSON.stringify(schema)); },
    setSchema: function (next) { schema = next || { id: 'form', fields: [] }; render(); }
  };
  // TODO M3: window.KuiFormBuilder[FB_ID].setLogic(rules)
})();
</script>

```
