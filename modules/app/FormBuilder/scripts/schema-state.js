/* ── FormBuilder schema state + DOM re-render (M1) ─────────────────────
 * Pixel-identical behaviour to modules/app/FormBuilder/hooks/useSchemaState.ts.
 * Mutating helpers all flow through `commit()` which re-renders the canvas
 * + settings panel + count badge.
 * TODO M2: hook validation rule updates into commit().
 * TODO M3: emit a schema-change event for an external logic editor.
 */
var selectedId = null;
var seq = 0;

var FIELD_TYPE_META = {
  text:        { label: 'Text',        icon: 'fa-font',         defaults: function () { return { type: 'text',     name: 'text',     label: 'Text field',    placeholder: '', helperText: '', required: false }; } },
  email:       { label: 'Email',       icon: 'fa-at',           defaults: function () { return { type: 'email',    name: 'email',    label: 'Email',         placeholder: 'name@example.com', helperText: '', required: false }; } },
  number:      { label: 'Number',      icon: 'fa-hashtag',      defaults: function () { return { type: 'number',   name: 'number',   label: 'Number',        placeholder: '0', helperText: '', required: false }; } },
  textarea:    { label: 'Textarea',    icon: 'fa-align-left',   defaults: function () { return { type: 'textarea', name: 'message',  label: 'Message',       placeholder: '', helperText: '', required: false }; } },
  select:      { label: 'Select',      icon: 'fa-caret-down',   defaults: function () { return { type: 'select',   name: 'select',   label: 'Select option', helperText: '', required: false, options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] }; } },
  multiselect: { label: 'Multiselect', icon: 'fa-square-check', defaults: function () { return { type: 'multiselect', name: 'multi', label: 'Multiselect',  helperText: '', required: false, options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] }; } },
  radio:       { label: 'Radio',       icon: 'fa-circle-dot',   defaults: function () { return { type: 'radio',    name: 'radio',    label: 'Choose one',    helperText: '', required: false, options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }; } },
  checkbox:    { label: 'Checkbox',    icon: 'fa-square-check', defaults: function () { return { type: 'checkbox', name: 'checkbox', label: 'I agree',       helperText: '', required: false }; } },
  date:        { label: 'Date',        icon: 'fa-calendar',     defaults: function () { return { type: 'date',     name: 'date',     label: 'Date',          helperText: '', required: false }; } },
  file:        { label: 'File',        icon: 'fa-paperclip',    defaults: function () { return { type: 'file',     name: 'file',     label: 'Attachment',    helperText: '', required: false }; } },
  signature:   { label: 'Signature',   icon: 'fa-signature',    defaults: function () { return { type: 'signature', name: 'signature', label: 'Signature',   helperText: '', required: false }; } },
  rating:      { label: 'Rating',      icon: 'fa-star',         defaults: function () { return { type: 'rating',   name: 'rating',   label: 'Rating',        helperText: '', required: false }; } }
};

function nextFieldId(prefix) {
  seq += 1;
  return (prefix || 'fld') + '-' + Date.now().toString(36) + '-' + seq.toString(36);
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function addField(type, atIndex) {
  var meta = FIELD_TYPE_META[type];
  if (!meta) return null;
  var seed = meta.defaults();
  seed.id = nextFieldId(type);
  var fields = schema.fields.slice();
  var idx = typeof atIndex === 'number' ? Math.max(0, Math.min(atIndex, fields.length)) : fields.length;
  fields.splice(idx, 0, seed);
  schema.fields = fields;
  commit();
  selectedId = seed.id;
  renderSettings();
  return seed.id;
}

function removeField(id) {
  schema.fields = schema.fields.filter(function (f) { return f.id !== id; });
  if (selectedId === id) selectedId = null;
  commit();
  renderSettings();
}

function duplicateField(id) {
  var idx = schema.fields.findIndex(function (f) { return f.id === id; });
  if (idx === -1) return;
  var src = schema.fields[idx];
  var clone = JSON.parse(JSON.stringify(src));
  clone.id = nextFieldId(src.type);
  clone.name = (src.name || '') + '_copy';
  clone.label = (src.label || '') + ' (copy)';
  schema.fields = schema.fields.slice(0, idx + 1).concat([clone]).concat(schema.fields.slice(idx + 1));
  selectedId = clone.id;
  commit();
  renderSettings();
}

function reorderField(from, to) {
  var fields = schema.fields.slice();
  if (from < 0 || from >= fields.length) return;
  var moved = fields.splice(from, 1)[0];
  var clamped = Math.max(0, Math.min(to, fields.length));
  fields.splice(clamped, 0, moved);
  schema.fields = fields;
  commit();
}

function updateField(id, patch) {
  schema.fields = schema.fields.map(function (f) {
    if (f.id !== id) return f;
    var next = {};
    Object.keys(f).forEach(function (k) { next[k] = f[k]; });
    Object.keys(patch).forEach(function (k) { next[k] = patch[k]; });
    return next;
  });
  commit();
}

function commit() {
  // Toolbar count + title
  var count = schema.fields.length;
  var countEl = root.querySelector('[data-fb-count]');
  if (countEl) countEl.textContent = '(' + count + ' field' + (count === 1 ? '' : 's') + ')';

  // Re-render canvas list.
  var list = root.querySelector('[data-fb-canvas-list]');
  if (!list) return;
  var html = '<div aria-hidden="true" data-fb-slot="0" class="fb-drop-indicator mx-1 h-0.5 rounded-full transition-colors bg-transparent"></div>';
  schema.fields.forEach(function (field, i) {
    html += renderRow(field, i);
    html += '<div aria-hidden="true" data-fb-slot="' + (i + 1) + '" class="fb-drop-indicator mx-1 h-0.5 rounded-full transition-colors bg-transparent"></div>';
  });
  if (schema.fields.length === 0) {
    html += '<li aria-hidden="true" data-fb-empty class="fb-canvas-empty text-sm text-text-disabled italic text-center py-10 border border-dashed border-border rounded-md">Drag a field from the palette to start building.</li>';
  }
  list.innerHTML = html;
  bindRows();
}

function renderRow(field, index) {
  var meta = FIELD_TYPE_META[field.type] || FIELD_TYPE_META.text;
  var selected = selectedId === field.id;
  var rowClass = 'fb-row group relative rounded-md border bg-surface-base transition-colors '
    + (selected ? 'border-border-focus ring-2 ring-border-focus/40' : 'border-border hover:border-border-strong');
  var requiredMark = field.required ? '<span class="text-error" aria-label="required">*</span>' : '';
  var helper = field.helperText
    ? '<span class="block text-xs text-text-secondary truncate mt-0.5">' + escapeHtml(field.helperText) + '</span>'
    : '';
  return ''
    + '<li role="listitem" data-field-id="' + escapeHtml(field.id) + '" data-field-index="' + index + '"' + (selected ? ' aria-current="true"' : '') + ' class="' + rowClass + '">'
      + '<button type="button" data-fb-row-select class="w-full flex items-start gap-2 px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-md">'
        + '<span draggable="true" role="button" tabindex="-1" aria-label="Drag handle" data-fb-row-handle class="fb-row-handle shrink-0 grid place-items-center w-6 h-6 rounded text-text-secondary cursor-grab active:cursor-grabbing hover:bg-surface-overlay">'
          + '<i class="fa-solid fa-grip-vertical w-3 h-3" aria-hidden="true"></i>'
        + '</span>'
        + '<span class="flex-1 min-w-0">'
          + '<span class="flex items-center gap-1.5 text-xs uppercase tracking-wide text-text-secondary">'
            + '<i class="fa-solid ' + meta.icon + ' w-3 h-3" aria-hidden="true"></i>'
            + '<span>' + escapeHtml(meta.label) + '</span>'
            + requiredMark
          + '</span>'
          + '<span class="block text-sm font-medium text-text-primary truncate">' + escapeHtml(field.label || 'Untitled') + '</span>'
          + helper
        + '</span>'
      + '</button>'
      + '<div class="absolute right-1 top-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">'
        + '<button type="button" data-fb-row-duplicate aria-label="Duplicate" title="Duplicate" class="grid place-items-center w-6 h-6 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="fa-solid fa-clone w-3 h-3" aria-hidden="true"></i></button>'
        + '<button type="button" data-fb-row-delete aria-label="Delete" title="Delete" class="grid place-items-center w-6 h-6 rounded text-text-secondary hover:text-error hover:bg-error-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="fa-solid fa-trash w-3 h-3" aria-hidden="true"></i></button>'
      + '</div>'
    + '</li>';
}

function renderSettings() {
  var body = root.querySelector('[data-fb-settings-body]');
  if (!body) return;
  var field = schema.fields.find(function (f) { return f.id === selectedId; });
  if (!field) {
    body.innerHTML = '<p data-fb-settings-empty class="text-sm text-text-disabled italic px-3 py-6 text-center">Select a field to edit its settings.</p>';
    return;
  }
  var showPlaceholder = field.type !== 'checkbox' && field.type !== 'date' && field.type !== 'file';
  var showDefault     = field.type !== 'file' && field.type !== 'checkbox';
  var WITH_OPTIONS = ['select','multiselect','radio','checkbox'];
  var hasOptions = WITH_OPTIONS.indexOf(field.type) !== -1;
  var inputClass = 'w-full rounded-md border border-border bg-surface-base px-2 py-1.5 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

  var html = ''
    + row('Label', '<input type="text" data-fb-settings-key="label" value="' + escapeHtml(field.label) + '" class="' + inputClass + '" />')
    + row('Name (form key)', '<input type="text" data-fb-settings-key="name" value="' + escapeHtml(field.name) + '" class="' + inputClass + '" />');
  if (showPlaceholder) html += row('Placeholder', '<input type="text" data-fb-settings-key="placeholder" value="' + escapeHtml(field.placeholder || '') + '" class="' + inputClass + '" />');
  html += row('Helper text', '<input type="text" data-fb-settings-key="helperText" value="' + escapeHtml(field.helperText || '') + '" class="' + inputClass + '" />');
  if (showDefault) {
    var defVal = (typeof field.defaultValue === 'string') ? field.defaultValue : '';
    html += row('Default value', '<input type="text" data-fb-settings-key="defaultValue" value="' + escapeHtml(defVal) + '" class="' + inputClass + '" />');
  }
  html += '<label class="inline-flex items-center gap-2 text-sm text-text-primary"><input type="checkbox" data-fb-settings-key="required"' + (field.required ? ' checked' : '') + ' class="rounded border-border-strong text-primary focus-visible:ring-2 focus-visible:ring-border-focus" /><span>Required</span></label>';

  if (hasOptions) {
    var opts = field.options || [];
    var listHtml = '<ul role="list" class="flex flex-col gap-1.5">';
    opts.forEach(function (opt, i) {
      listHtml += ''
        + '<li class="flex items-center gap-1.5" data-fb-opt-row="' + i + '">'
          + '<input type="text" aria-label="Option label" value="' + escapeHtml(opt.label) + '" data-fb-opt-field="label" class="' + inputClass + ' flex-1" />'
          + '<input type="text" aria-label="Option value" value="' + escapeHtml(opt.value) + '" data-fb-opt-field="value" class="' + inputClass + ' w-24" />'
          + '<button type="button" data-fb-opt-remove aria-label="Remove" class="grid place-items-center w-7 h-7 rounded text-text-secondary hover:text-error hover:bg-error-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="fa-solid fa-xmark w-3 h-3" aria-hidden="true"></i></button>'
        + '</li>';
    });
    listHtml += '</ul>';
    html += '<div class="flex flex-col gap-1.5"><span class="text-xs font-medium text-text-secondary">Options</span>' + listHtml
      + '<button type="button" data-fb-opt-add class="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-sm bg-surface-base border border-border text-text-primary hover:bg-surface-overlay hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="fa-solid fa-plus w-3 h-3" aria-hidden="true"></i><span>Add option</span></button>'
      + '</div>';
  }
  body.innerHTML = html;
  bindSettings();
}

function row(label, control) {
  return '<label class="flex flex-col gap-1 text-sm text-text-primary"><span class="text-xs font-medium text-text-secondary">' + escapeHtml(label) + '</span>' + control + '</label>';
}

function bindSettings() {
  var body = root.querySelector('[data-fb-settings-body]');
  if (!body) return;
  Array.prototype.forEach.call(body.querySelectorAll('[data-fb-settings-key]'), function (el) {
    el.addEventListener('input', function () {
      var key = el.getAttribute('data-fb-settings-key');
      var v = el.type === 'checkbox' ? el.checked : (key === 'name' ? el.value.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 64) : el.value);
      if (key === 'name') el.value = v;
      var patch = {};
      patch[key] = v;
      updateField(selectedId, patch);
    });
  });
  // Options editor
  Array.prototype.forEach.call(body.querySelectorAll('[data-fb-opt-row]'), function (row) {
    var i = parseInt(row.getAttribute('data-fb-opt-row'), 10);
    Array.prototype.forEach.call(row.querySelectorAll('[data-fb-opt-field]'), function (input) {
      input.addEventListener('input', function () {
        var field = schema.fields.find(function (f) { return f.id === selectedId; });
        if (!field || !field.options) return;
        var key = input.getAttribute('data-fb-opt-field');
        var opts = field.options.slice();
        var next = {};
        Object.keys(opts[i]).forEach(function (k) { next[k] = opts[i][k]; });
        next[key] = input.value;
        opts[i] = next;
        updateField(selectedId, { options: opts });
      });
    });
    var rm = row.querySelector('[data-fb-opt-remove]');
    if (rm) rm.addEventListener('click', function () {
      var field = schema.fields.find(function (f) { return f.id === selectedId; });
      if (!field || !field.options) return;
      var opts = field.options.filter(function (_, j) { return j !== i; });
      updateField(selectedId, { options: opts });
    });
  });
  var addBtn = body.querySelector('[data-fb-opt-add]');
  if (addBtn) addBtn.addEventListener('click', function () {
    var field = schema.fields.find(function (f) { return f.id === selectedId; });
    if (!field) return;
    var opts = (field.options || []).slice();
    var idx = opts.length + 1;
    opts.push({ label: 'Option ' + idx, value: 'option_' + idx });
    updateField(selectedId, { options: opts });
  });
}

function selectRow(id) {
  selectedId = id;
  commit();
  renderSettings();
}

function render() { commit(); renderSettings(); }

/* ── Toolbar: export / import ───────────────────────────────────────── */
var exportBtn = root.querySelector('[data-fb-action="export"]');
if (exportBtn) exportBtn.addEventListener('click', function () {
  try {
    var blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = ((schema.title || 'form-schema').replace(/\s+/g, '-').toLowerCase()) + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) { /* ignore */ }
});
var importBtn = root.querySelector('[data-fb-action="import"]');
var importFile = root.querySelector('[data-fb-import-file]');
if (importBtn && importFile) {
  importBtn.addEventListener('click', function () { importFile.click(); });
  importFile.addEventListener('change', function () {
    var f = importFile.files && importFile.files[0];
    if (!f) return;
    f.text().then(function (txt) {
      try {
        var parsed = JSON.parse(txt);
        if (parsed && Array.isArray(parsed.fields)) {
          schema = parsed;
          selectedId = null;
          render();
        }
      } catch (e) { /* silently ignore in M1 — TODO M2: toast */ }
      importFile.value = '';
    });
  });
}
