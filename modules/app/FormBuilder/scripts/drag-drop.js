/* ── FormBuilder HTML5 drag-and-drop (M1) ──────────────────────────────
 * Mirrors modules/app/FormBuilder/hooks/useDragDrop.ts in 01_NextJS_Components.
 * Two MIME types:
 *   application/x-fb-palette-type  – palette → canvas (creates a field)
 *   application/x-fb-canvas-index  – canvas reorder (moves an existing field)
 * TODO M2: pointer fallback for touch devices.
 * TODO M5: keyboard reorder (Ctrl+ArrowUp / Down) → emit aria-live announce.
 */
var MIME_PALETTE = 'application/x-fb-palette-type';
var MIME_CANVAS  = 'application/x-fb-canvas-index';

function bindAll() {
  bindPalette();
  bindRows();
  bindSlots();
  renderSettings();
}

function bindPalette() {
  Array.prototype.forEach.call(root.querySelectorAll('[data-fb-palette-type]'), function (btn) {
    var type = btn.getAttribute('data-fb-palette-type');
    btn.addEventListener('dragstart', function (e) {
      try {
        e.dataTransfer.setData(MIME_PALETTE, type);
        e.dataTransfer.effectAllowed = 'copy';
      } catch (err) { /* sandboxed */ }
    });
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      addField(type);
    });
  });
}

function bindRows() {
  Array.prototype.forEach.call(root.querySelectorAll('[data-field-id]'), function (li) {
    var id    = li.getAttribute('data-field-id');
    var index = parseInt(li.getAttribute('data-field-index'), 10);

    var selectBtn = li.querySelector('[data-fb-row-select]');
    if (selectBtn) selectBtn.addEventListener('click', function () { selectRow(id); });

    var handle = li.querySelector('[data-fb-row-handle]');
    if (handle) {
      handle.addEventListener('dragstart', function (e) {
        try {
          e.dataTransfer.setData(MIME_CANVAS, String(index));
          e.dataTransfer.effectAllowed = 'move';
        } catch (err) { /* sandboxed */ }
      });
    }

    var dup = li.querySelector('[data-fb-row-duplicate]');
    if (dup) dup.addEventListener('click', function (ev) { ev.stopPropagation(); duplicateField(id); });

    var del = li.querySelector('[data-fb-row-delete]');
    if (del) del.addEventListener('click', function (ev) { ev.stopPropagation(); removeField(id); });
  });
}

function bindSlots() {
  var list = root.querySelector('[data-fb-canvas-list]');
  if (!list) return;

  list.addEventListener('dragover', function (e) {
    var types = e.dataTransfer && e.dataTransfer.types ? e.dataTransfer.types : [];
    var has = [].indexOf.call(types, MIME_PALETTE) !== -1 || [].indexOf.call(types, MIME_CANVAS) !== -1;
    if (!has) return;
    e.preventDefault();
  });

  list.addEventListener('drop', function (e) {
    var slot = e.target && e.target.closest ? e.target.closest('[data-fb-slot]') : null;
    var index = slot ? parseInt(slot.getAttribute('data-fb-slot'), 10) : schema.fields.length;
    if (isNaN(index)) index = schema.fields.length;
    e.preventDefault();
    var paletteType = e.dataTransfer.getData(MIME_PALETTE);
    var canvasIdx   = e.dataTransfer.getData(MIME_CANVAS);
    if (paletteType) {
      addField(paletteType, index);
    } else if (canvasIdx !== '') {
      var from = parseInt(canvasIdx, 10);
      var to = from < index ? index - 1 : index;
      if (from !== to) reorderField(from, to);
    }
    clearActiveSlots();
  });

  list.addEventListener('dragover', function (e) {
    var slot = e.target && e.target.closest ? e.target.closest('[data-fb-slot]') : null;
    if (!slot) return;
    clearActiveSlots();
    slot.classList.remove('bg-transparent');
    slot.classList.add('bg-primary');
  });

  list.addEventListener('dragleave', function (e) {
    var slot = e.target && e.target.closest ? e.target.closest('[data-fb-slot]') : null;
    if (!slot) return;
    slot.classList.remove('bg-primary');
    slot.classList.add('bg-transparent');
  });
}

function clearActiveSlots() {
  Array.prototype.forEach.call(root.querySelectorAll('[data-fb-slot]'), function (s) {
    s.classList.remove('bg-primary');
    s.classList.add('bg-transparent');
  });
}
