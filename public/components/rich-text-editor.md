# RichTextEditor

- **id:** `rich-text-editor`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/RichTextEditor/index.ejs`
- **status:** stable
- **since:** 2026-05

Quill 2.x WYSIWYG with token-tinted snow theme. Production features: controlled value (via `kui-rte:set-html` event), imperative API via `window.KuiRte.get(id)`, name+hidden-form-sync, drag-and-drop image upload (with `imageUploadFn` global override), paste sanitization (Word / GDocs cleanup), char + word counter with maxLength, autosave to localStorage, markdown shortcuts, color + highlight, sub/sup, indent/outdent, horizontal rule, tables, emoji picker, @-mentions, /-slash command menu, selection bubble menu, image resize/align overlay, fullscreen mode. Pixel-identical React sibling at modules/app/RichTextEditor/index.tsx.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Empty + counter

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'article-body',
  name: 'body',
  label: 'Article body',
  showCounter: true,
  showWordCount: true
}) %>
```

### Pre-populated

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'release-notes',
  name: 'releaseNotes',
  label: 'Release notes',
  value: '<h1>Release notes</h1><p>...</p>'
}) %>
```

### Read-only

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'archived',
  name: 'archived',
  label: 'Archived document',
  value: savedHtml,
  readOnly: true
}) %>
```

### Max length (200 chars)

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'short-summary',
  name: 'summary',
  label: 'Short summary',
  maxLength: 200,
  showCounter: true
}) %>
```

### Mentions + slash commands

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'comment',
  name: 'comment',
  label: 'Comment',
  mentions: [
    { id: 'u1', label: 'Jane Doe', description: 'Designer' },
    { id: 'u2', label: 'John Smith', description: 'Engineer' }
  ],
  slashItems: [
    { id: 'h1',   label: 'Heading 1',   command: 'header:1' },
    { id: 'list', label: 'Bullet list', command: 'list:bullet' },
    { id: 'hr',   label: 'Divider',     command: 'hr' }
  ]
}) %>
```

### Imperative ref API

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'reply', name: 'reply', value: '<p>Hello</p>'
}) %>

<script>
  var api = window.KuiRte.get('reply');
  api.focus();
  api.insertHTML('<p>Hi!</p>');
  var text = api.getText();
</script>
```

### Form integration

```ejs
<form action="/api/post" method="post">
  <%- include('modules/app/RichTextEditor', {
    id: 'post', name: 'body', value: savedHtml
  }) %>
  <button type="submit">Save</button>
</form>
```

### Autosave

```ejs
<%- include('modules/app/RichTextEditor', {
  id: 'draft', name: 'draft', autosaveKey: 'my-draft'
}) %>
```

## Full EJS source

```ejs
<%
  // ─── RichTextEditor (EJS, split) ───────────────────────────────────────────
  //
  // Folder-scoped sibling of /home/kuray/01_NextJS_Components/modules/app/
  // RichTextEditor/. File-for-file parallels (one .js per .tsx/.ts):
  //   sanitize.js          ← sanitize.ts
  //   markdown.js          ← markdown.ts
  //   store.js             ← store.ts (plain-JS state container)
  //   quill-helpers.js     ← quill-helpers.ts
  //   quill-setup.js       ← useQuillSetup.ts
  //   editor-actions.js    ← useEditorActions.ts
  //   trigger-keyboard.js  ← useTriggerKeyboard.ts
  //   bubble-menu.js       ← BubbleMenu.tsx
  //   emoji-picker.js      ← EmojiPicker.tsx
  //   suggestion-popup.js  ← SuggestionPopup.tsx
  //   image-overlay.js     ← ImageOverlay.tsx
  //   popup-overlays.js    ← PopupOverlays.tsx
  //   bindings.js          ← (toolbar standalone wiring + modal wiring)
  //   client.js            ← bootstrap (parallel of React index.tsx)
  //   _toolbar.ejs         ← Toolbar.tsx
  //   _modals.ejs          ← ImageInsertModal.tsx + TableInsertModal.tsx
  //   index.ejs            ← this file (orchestrator)
  //
  // The .js files are concatenated once per page via EJS `include`
  // (each module attaches its functions onto window.__KuiRte so the
  // 14 files share scope across instances).

  var _id          = locals.id          || ('rte-' + Math.random().toString(36).substr(2, 6));
  var _name        = locals.name        || _id;
  var _label       = locals.label       || '';
  var _hint        = locals.hint        || '';
  var _error       = locals.error       || '';
  var _value       = locals.value       || '';
  var _placeholder = locals.placeholder || 'Write something…';
  var _readOnly    = !!locals.readOnly;
  var _minHeight   = Number(locals.minHeight) > 0 ? Number(locals.minHeight) : 180;
  var _className   = locals.className   || '';
  var _maxLength   = Number(locals.maxLength) > 0 ? Number(locals.maxLength) : 0;
  var _showCounter   = !!locals.showCounter;
  var _showWordCount = !!locals.showWordCount;
  var _autosaveKey   = locals.autosaveKey   || '';
  var _sanitizeOnPaste = locals.sanitizeOnPaste === false ? false : true;
  var _imageUploadFn = locals.imageUploadFn || '';
  var _mentions      = locals.mentions   || null;
  var _slashItems    = locals.slashItems || null;

  var _hintId      = _hint  ? (_id + '-hint')  : '';
  var _errorId     = _error ? (_id + '-error') : '';
  var _describedBy = [_hintId, _errorId].filter(Boolean).join(' ');

%>
<div class="flex flex-col gap-1.5<%= _className ? ' ' + _className : '' %>"
  data-kui-rte-wrap="<%= _id %>">
  <% if (_label) { %>
  <label for="<%= _id %>" class="text-sm font-medium text-text-primary"><%= _label %></label>
  <% } %>

  <div
    id="<%= _id %>"
    data-kui-rte
    <% if (_maxLength) { %>data-max-length="<%= _maxLength %>"<% } %>
    <% if (_autosaveKey) { %>data-autosave-key="<%= _autosaveKey %>"<% } %>
    <% if (_sanitizeOnPaste) { %>data-sanitize="1"<% } %>
    <% if (_imageUploadFn) { %>data-image-upload-fn="<%= _imageUploadFn %>"<% } %>
    <% if (_mentions) { %>data-mentions="<%= JSON.stringify(_mentions) %>"<% } %>
    <% if (_slashItems) { %>data-slash="<%= JSON.stringify(_slashItems) %>"<% } %>
    <% if (_describedBy) { %>aria-describedby="<%= _describedBy %>"<% } %>
    aria-invalid="<%= _error ? 'true' : 'false' %>"
    class="rounded-md border <%= _error ? 'border-error' : 'border-border' %> bg-surface-base overflow-hidden focus-within:ring-2 focus-within:ring-border-focus<%= _readOnly ? ' bg-surface-sunken' : '' %>"
  >
    <%- include('./_toolbar', { _id: _id, _readOnly: _readOnly }) %>

    <div class="relative">
      <div id="<%= _id %>-skel" class="kui-rte-skel" aria-hidden="true">
        <span style="width:33%"></span><span style="width:66%"></span><span style="width:50%"></span>
      </div>
      <textarea
        id="<%= _id %>-html-src"
        aria-label="HTML source"
        spellcheck="false"
        class="hidden block w-full font-mono text-xs leading-relaxed p-3 bg-surface-base text-text-primary outline-none resize-none focus-visible:outline-none"
        style="min-height: <%= _minHeight %>px"
      ></textarea>
      <div id="<%= _id %>-editor" class="kui-rte-content" style="min-height: <%= _minHeight %>px"></div>
    </div>

    <% if (_showCounter || _showWordCount || _maxLength) { %>
    <div id="<%= _id %>-counter" class="kui-rte-counter">
      <% if (_showWordCount) { %><span data-rte-words>0 words</span><% } %>
      <% if (_showCounter || _maxLength) { %><span data-rte-chars>0<% if (_maxLength) { %> / <%= _maxLength %><% } %></span><% } %>
    </div>
    <% } %>
  </div>

  <input type="hidden" name="<%= _name %>" id="<%= _id %>-value" value="<%= _value %>" />

  <% if (_hint && !_error) { %>
  <p id="<%= _hintId %>" class="text-xs text-text-secondary"><%= _hint %></p>
  <% } %>
  <% if (_error) { %>
  <p id="<%= _errorId %>" role="alert" class="text-xs text-error"><%= _error %></p>
  <% } %>
</div>

<%- include('./_modals', { _id: _id }) %>

<script>
if (!window.__KuiRteLoaded) {
  window.__KuiRteLoaded = true;
  <%- include('./sanitize.js') %>
  <%- include('./markdown.js') %>
  <%- include('./store.js') %>
  <%- include('./quill-helpers.js') %>
  <%- include('./quill-setup.js') %>
  <%- include('./editor-actions.js') %>
  <%- include('./trigger-keyboard.js') %>
  <%- include('./bubble-menu.js') %>
  <%- include('./emoji-picker.js') %>
  <%- include('./suggestion-popup.js') %>
  <%- include('./image-overlay.js') %>
  <%- include('./popup-overlays.js') %>
  <%- include('./bindings.js') %>
  <%- include('./client.js') %>
}
(function () {
  function go() {
    if (!window.__KuiRte || !window.__KuiRte.boot) return setTimeout(go, 30);
    window.__KuiRte.boot({
      id: <%- include('../../ui/_script-json', { value: _id }) %>,
      initialHtml: <%- include('../../ui/_script-json', { value: _value }) %>,
      readOnly: <%- include('../../ui/_script-json', { value: !!_readOnly }) %>,
      placeholder: <%- include('../../ui/_script-json', { value: _placeholder }) %>,
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
</script>

```
