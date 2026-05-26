# CodeEditor

- **id:** `code-editor`
- **layer:** ui
- **category:** App
- **filePath:** `modules/ui/CodeEditor/CodeEditor.ejs`
- **status:** stable
- **since:** 2026-05

Engine-agnostic code editor primitive. M1 ships a lightweight CodeMirror-style fallback engine (textarea + line-number gutter + active-line + theme + readonly + placeholder) so the public API is stable today. Future milestones: Monaco (VSCode) lazy engine, find/replace, multi-cursor, diagnostics (markers), custom autocomplete + hover, minimap, code folding, vim/emacs keymap. Pixel-identical React sibling at modules/ui/CodeEditor/index.tsx. Used by RulesetEditor M3 + RichTextEditor code-block insert (planned).

## Accessibility

- WCAG: AA
- ARIA patterns: textbox
- Keyboard:
  - `Tab` — Move focus into / out of the editor
  - `Arrow keys` — Move caret + sync active line gutter
  - `Ctrl/Cmd + Z` — Browser-native undo (M1 textarea fallback)

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-strong`
- `--border-focus`
- `--error`

## Variants

### JavaScript readonly

```ejs
<%- include('modules/ui/CodeEditor', {
  id: 'example',
  label: 'example.js',
  language: 'js',
  theme: 'light',
  value: source,
  readonly: true,
  showLineNumbers: true
}) %>
```

### Markdown editable

```ejs
<%- include('modules/ui/CodeEditor', {
  id: 'readme',
  name: 'readme',
  label: 'README.md',
  language: 'markdown',
  theme: 'dark',
  value: src,
  placeholder: 'Start typing markdown…'
}) %>
```

## Full EJS source

```ejs
<%
  // ─── CodeEditor (EJS) ──────────────────────────────────────────────────────
  //
  // Pixel-identical sibling of
  // /home/kuray/01_NextJS_Components/modules/ui/CodeEditor/index.tsx.
  //
  // M1 implements: engine flag (default codemirror — falls back to a textarea
  // engine when CodeMirror 6 is not present), language data attribute, light/
  // dark/high-contrast theme, readonly, placeholder, line-number gutter.
  //
  // Locals:
  //   id            — required, used as <textarea> id (auto-generated otherwise)
  //   name          — hidden input name for form integration
  //   label         — visible label above the editor
  //   hint          — helper text under the editor
  //   error         — error text — switches border to error tone
  //   value         — initial source code
  //   language      — js|ts|json|html|css|sql|python|yaml|markdown|plaintext
  //   theme         — 'light' | 'dark' | 'high-contrast' (default 'light')
  //   engine        — 'codemirror' | 'monaco' (default 'codemirror')
  //   readonly      — boolean, default false
  //   placeholder   — placeholder text when value is empty
  //   minHeight     — px (default 200)
  //   showLineNumbers — default true
  //   className     — extra classes on wrapper
  //
  // Listen for `kui-codeeditor:change` on the wrapper —
  //   event.detail = { value: string, id: string }
  //
  // TODO M2: surface Toolbar (partials/_toolbar) when showToolbar=true,
  //          find/replace, multi-cursor, comment toggle, format-on-save,
  //          opt-in Monaco loader.
  // TODO M3: diagnostics (markers gutter), autocomplete, hover tooltips.
  // TODO M4: minimap, vim keymap, code folding.
  // TODO M5: a11y + i18n messages.

  var _id          = locals.id            || ('ce-' + Math.random().toString(36).substr(2, 6));
  var _name        = locals.name          || '';
  var _label       = locals.label         || '';
  var _hint        = locals.hint          || '';
  var _error       = locals.error         || '';
  var _value       = locals.value         || '';
  var _language    = locals.language      || 'plaintext';
  var _theme       = locals.theme         || 'light';
  var _engine      = locals.engine        || 'codemirror';
  var _readonly    = !!locals.readonly;
  var _placeholder = locals.placeholder   || '';
  var _minHeight   = Number(locals.minHeight) > 0 ? Number(locals.minHeight) : 200;
  var _showLineNumbers = locals.showLineNumbers === false ? false : true;
  var _className   = locals.className     || '';

  var _themeRootClass = ({
    light: 'kui-codeeditor-theme-light bg-surface-base text-text-primary border-border',
    dark: 'kui-codeeditor-theme-dark bg-surface-sunken text-text-primary border-border-strong',
    'high-contrast': 'kui-codeeditor-theme-hc bg-surface-base text-text-primary border-border-focus',
  })[_theme] || 'bg-surface-base text-text-primary border-border';

  var _lineCount = _value ? (_value.split('\n').length) : 1;
%>
<div
  data-kui-codeeditor="<%= _id %>"
  data-engine="<%= _engine %>"
  data-language="<%= _language %>"
  data-theme="<%= _theme %>"
  class="w-full<%= _className ? ' ' + _className : '' %>"
>
  <% if (_label) { %>
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary mb-1"><%= _label %></label>
  <% } %>

  <%# TODO M2: include partials/_toolbar with language+theme+readonly when showToolbar=true. %>

  <div
    data-kui-codeeditor-engine="<%= _engine === 'monaco' ? 'monaco-fallback' : 'codemirror-fallback' %>"
    data-language="<%= _language %>"
    data-theme="<%= _theme %>"
    <% if (_readonly) { %>data-readonly<% } %>
    class="relative flex w-full overflow-hidden rounded-md border font-mono text-sm focus-within:ring-2 focus-within:ring-border-focus <%= _themeRootClass %><%= _error ? ' border-error focus-within:ring-error' : '' %>"
    style="min-height: <%= _minHeight %>px"
  >
    <% if (_showLineNumbers) { %>
    <%- include('partials/_gutter', { _lineCount: _lineCount, _activeLine: 1, _minHeight: _minHeight }) %>
    <% } %>
    <textarea
      id="<%= _id %>"
      data-kui-codeeditor-textarea
      <% if (_readonly) { %>readonly aria-readonly="true"<% } %>
      spellcheck="false"
      wrap="off"
      autocapitalize="off"
      autocorrect="off"
      autocomplete="off"
      aria-multiline="true"
      placeholder="<%= _placeholder %>"
      class="flex-1 min-w-0 resize-none bg-transparent px-3 py-2 leading-5 font-mono text-sm tabular-nums caret-text-primary placeholder:text-text-disabled focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed<%= _readonly ? ' cursor-default' : '' %>"
      style="min-height: <%= _minHeight %>px"
    ><%= _value %></textarea>
  </div>

  <% if (_name) { %>
  <input type="hidden" data-kui-codeeditor-input name="<%= _name %>" value="<%= _value %>" />
  <% } %>

  <% if (_hint || _error) { %>
  <p class="mt-1 text-xs <%= _error ? 'text-error' : 'text-text-secondary' %>"><%= _error || _hint %></p>
  <% } %>
</div>

<script>
(function () {
  // Lazy-load the engine bootstrapper once per page.
  if (!window.KuiCodeEditor) {
    <%- include('scripts/codemirror-loader.js') %>
  }
  <% if (_engine === 'monaco') { %>
  if (!window.KuiCodeEditorMonaco) {
    <%- include('scripts/monaco-loader.js') %>
  }
  <% } %>

  var id = <%- JSON.stringify(_id) %>;
  if (window.__kuiCodeEditorInit && window.__kuiCodeEditorInit[id]) return;
  window.__kuiCodeEditorInit = window.__kuiCodeEditorInit || {};
  window.__kuiCodeEditorInit[id] = true;

  function init() {
    var root = document.querySelector('[data-kui-codeeditor="' + id + '"]');
    if (!root || !window.KuiCodeEditor) return;
    window.KuiCodeEditor.attach(root, { id: id });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

```
