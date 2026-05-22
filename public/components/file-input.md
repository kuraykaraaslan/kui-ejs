# FileInput

- **id:** `file-input`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/FileInput.ejs`
- **status:** stable
- **since:** 2025-02

Drag-and-drop file upload with validation, file list, and individual remove actions.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--primary-active`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--surface-base`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Single file

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Profile photo',
  hint: 'PNG or JPG, max 2 MB',
  accept: 'image/*'
}) %>
```

### Multiple files

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Attachments',
  hint: 'Up to 5 MB each',
  multiple: true
}) %>
```

### Disabled

```ejs
<%- include('modules/ui/FileInput', { label: 'Disabled upload', disabled: true }) %>
```

### With error

```ejs
<%- include('modules/ui/FileInput', {
  label: 'Document',
  hint: 'PDF only',
  accept: '.pdf',
  error: 'Please upload a valid PDF file.'
}) %>
```

## Full EJS source

```ejs
<%
  var _id        = locals.id        || 'file-' + Math.random().toString(36).substr(2, 9);
  var _multiple  = !!locals.multiple;
  var _accept    = locals.accept    || '';
  var _dis       = !!locals.disabled;
  var _maxBytes  = (typeof locals.maxSizeBytes === 'number') ? locals.maxSizeBytes : 0;
  var _allowed   = Array.isArray(locals.allowedTypes) ? locals.allowedTypes : [];
  var _uploadLbl = locals.uploadLabel || 'Upload';
  var _hasUpload = !!locals.onUpload; // expects a window.* function name string
%>
<div class="w-full space-y-2<%= locals.className ? ' ' + locals.className : '' %>" data-fi-root="<%= _id %>">
  <% if (locals.label) { %>
    <label for="<%= _id %>" class="block text-sm font-medium text-text-primary">
      <%= locals.label %><% if (locals.required) { %> <span class="text-error">*</span><% } %>
    </label>
  <% } %>

  <div
    data-fi-dropzone
    class="relative rounded-lg border-2 border-dashed border-border bg-surface-base transition-colors flex flex-col items-center justify-center gap-2 px-6 py-8 text-center<%= _dis ? ' opacity-50 cursor-not-allowed' : '' %>"
  >
    <span class="w-8 h-8 inline-flex items-center justify-center text-text-disabled" aria-hidden="true">
      <i class="fa-solid fa-folder-open" style="font-size:2rem"></i>
    </span>
    <p class="text-sm text-text-secondary">
      Drag &amp; drop files here, or
      <button
        type="button"
        data-fi-browse
        <% if (_dis) { %>disabled<% } %>
        class="text-primary underline underline-offset-2 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded disabled:cursor-not-allowed"
      >browse</button>
    </p>
    <% if (locals.hint) { %>
      <p class="text-xs text-text-disabled"><%= locals.hint %></p>
    <% } %>
    <input
      id="<%= _id %>"
      type="file"
      class="sr-only"
      data-fi-input
      <% if (_multiple) { %>multiple<% } %>
      <% if (_dis)      { %>disabled<% } %>
      <% if (_accept)   { %>accept="<%= _accept %>"<% } %>
      <% if (locals.name) { %>name="<%= locals.name %>"<% } %>
    >
  </div>

  <ul class="space-y-1.5 hidden" data-fi-list aria-label="Selected files"></ul>

  <% if (_hasUpload) { %>
  <div class="flex justify-end hidden" data-fi-upload-wrap>
    <button
      type="button"
      data-fi-upload-btn
      class="rounded-md px-4 py-2 text-sm font-medium text-primary-fg bg-primary hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    ><%= _uploadLbl %></button>
  </div>
  <% } %>

  <p class="text-sm text-error hidden" data-fi-error role="alert"></p>
  <p class="text-sm text-success-fg hidden" data-fi-success role="status">Files uploaded successfully.</p>

  <% if (locals.error) { %>
    <p class="text-sm text-error" role="alert"><%= locals.error %></p>
  <% } %>
</div>

<script>
(function () {
  var root = document.querySelector('[data-fi-root="<%= _id %>"]');
  if (!root || root.__fiBound) return;
  root.__fiBound = true;

  var dropzone   = root.querySelector('[data-fi-dropzone]');
  var input      = root.querySelector('[data-fi-input]');
  var browseBtn  = root.querySelector('[data-fi-browse]');
  var list       = root.querySelector('[data-fi-list]');
  var uploadWrap = root.querySelector('[data-fi-upload-wrap]');
  var uploadBtn  = root.querySelector('[data-fi-upload-btn]');
  var errEl      = root.querySelector('[data-fi-error]');
  var okEl       = root.querySelector('[data-fi-success]');

  var multiple   = <%- JSON.stringify(_multiple) %>;
  var maxBytes   = <%- JSON.stringify(_maxBytes) %>;
  var allowed    = <%- JSON.stringify(_allowed) %>;
  var disabled   = <%- JSON.stringify(_dis) %>;
  var uploadCb   = <%- JSON.stringify(locals.onUpload || '') %>; // global function name
  var uploadLbl  = <%- JSON.stringify(_uploadLbl) %>;

  var entries = []; // [{ file, error?, status: 'idle'|'uploading'|'success'|'error', progress: 0..100, message?: string }]
  var uploadState = 'idle';

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function validate(file) {
    if (maxBytes && file.size > maxBytes) return 'File exceeds ' + fmtBytes(maxBytes) + ' limit';
    if (allowed.length && allowed.indexOf(file.type) === -1) return 'File type not allowed';
    return '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function renderList() {
    if (entries.length === 0) {
      list.classList.add('hidden');
      list.innerHTML = '';
      if (uploadWrap) uploadWrap.classList.add('hidden');
      return;
    }
    list.classList.remove('hidden');
    if (uploadWrap) uploadWrap.classList.remove('hidden');

    list.innerHTML = entries.map(function (entry, i) {
      var hasErr  = !!entry.error;
      var rowCls  = hasErr
        ? 'flex items-center gap-3 rounded-md border px-3 py-2 text-sm border-error bg-error-subtle text-error-fg'
        : 'flex items-center gap-3 rounded-md border px-3 py-2 text-sm border-border bg-surface-raised text-text-primary';

      var status  = '';
      if (entry.status === 'uploading') {
        status = '<div class="w-full mt-1 h-1 rounded-full bg-surface-sunken overflow-hidden"><div class="h-full bg-primary transition-all" style="width:' + (entry.progress || 0) + '%"></div></div>';
      } else if (entry.status === 'success') {
        status = '<p class="text-xs text-success-fg mt-0.5" role="status">' + escapeHtml(entry.message || 'Uploaded') + '</p>';
      } else if (entry.status === 'error') {
        status = '<p class="text-xs text-error mt-0.5" role="alert">' + escapeHtml(entry.message || 'Upload failed') + '</p>';
      }

      return '<li class="' + rowCls + '">'
        + '<span class="flex-1 truncate min-w-0">'
          + '<span class="font-medium">' + escapeHtml(entry.file.name) + '</span>'
          + '<span class="ml-2 text-xs text-text-secondary">' + fmtBytes(entry.file.size) + '</span>'
          + status
        + '</span>'
        + (hasErr ? '<span class="text-xs text-error shrink-0">' + escapeHtml(entry.error) + '</span>' : '')
        + '<button type="button" aria-label="Remove ' + escapeHtml(entry.file.name) + '" data-fi-remove="' + i + '"'
          + ' class="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">'
          + '<span class="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true"><i class="fa-solid fa-xmark" style="font-size:12px"></i></span>'
        + '</button>'
      + '</li>';
    }).join('');

    // Wire remove buttons
    var removeBtns = list.querySelectorAll('[data-fi-remove]');
    removeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-fi-remove'), 10);
        entries.splice(idx, 1);
        if (input) input.value = '';
        renderList();
      });
    });
  }

  function addFiles(fileList) {
    if (!fileList) return;
    var added = Array.prototype.slice.call(fileList).map(function (f) {
      var err = validate(f);
      return { file: f, error: err, status: 'idle', progress: 0 };
    });
    entries = multiple ? entries.concat(added) : added;
    uploadState = 'idle';
    if (errEl) errEl.classList.add('hidden');
    if (okEl)  okEl.classList.add('hidden');
    if (uploadBtn) { uploadBtn.disabled = false; uploadBtn.textContent = uploadLbl; }
    renderList();
  }

  // ── browse + drag/drop ──
  if (browseBtn && !disabled) {
    browseBtn.addEventListener('click', function () { input.click(); });
  }
  if (input) {
    input.addEventListener('change', function (e) { addFiles(e.target.files); });
  }
  if (dropzone && !disabled) {
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropzone.classList.add('border-primary', 'bg-primary-subtle');
    });
    dropzone.addEventListener('dragleave', function () {
      dropzone.classList.remove('border-primary', 'bg-primary-subtle');
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.classList.remove('border-primary', 'bg-primary-subtle');
      addFiles(e.dataTransfer.files);
    });
  }

  // ── upload ──
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () {
      if (uploadState === 'uploading') return;
      var cb = uploadCb && typeof window[uploadCb] === 'function' ? window[uploadCb] : null;
      if (!cb) return;

      var validFiles = entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; });
      if (validFiles.length === 0) return;

      uploadState = 'uploading';
      uploadBtn.disabled    = true;
      uploadBtn.textContent = 'Uploading…';
      if (errEl) errEl.classList.add('hidden');
      if (okEl)  okEl.classList.add('hidden');

      entries.forEach(function (e) { if (!e.error) { e.status = 'uploading'; e.progress = 0; } });
      renderList();

      // Animate progress for visual feedback while the consumer-provided
      // upload callback runs (no XHR upload progress events available here).
      var progressTimer = setInterval(function () {
        entries.forEach(function (e) {
          if (e.status === 'uploading' && e.progress < 90) {
            e.progress = Math.min(90, e.progress + 10);
          }
        });
        renderList();
      }, 200);

      Promise.resolve(cb(validFiles)).then(function () {
        clearInterval(progressTimer);
        entries.forEach(function (e) {
          if (e.status === 'uploading') { e.status = 'success'; e.progress = 100; e.message = 'Uploaded'; }
        });
        uploadState = 'success';
        if (okEl) okEl.classList.remove('hidden');
        renderList();
        // Clear after a moment
        setTimeout(function () {
          entries = [];
          if (input) input.value = '';
          renderList();
        }, 1500);
      }).catch(function (err) {
        clearInterval(progressTimer);
        var msg = (err && err.message) ? err.message : 'Upload failed. Please try again.';
        entries.forEach(function (e) {
          if (e.status === 'uploading') { e.status = 'error'; e.message = msg; }
        });
        uploadState = 'error';
        if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
        uploadBtn.disabled    = false;
        uploadBtn.textContent = uploadLbl;
        renderList();
      });
    });
  }
})();
</script>

```
