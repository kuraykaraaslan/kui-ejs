// modules/ui/CodeEditor/scripts/codemirror-loader.js
//
// CodeMirror engine bootstrapper for the EJS CodeEditor — M1 fallback.
//
// CodeMirror 6 is NOT yet a project dependency. This script wires the
// textarea-based fallback so the API contract works today: it keeps the
// hidden form input in sync, maintains the gutter's active-line cursor,
// emits a `kui-codeeditor:change` CustomEvent on every input, and syncs
// vertical scroll between the textarea and the gutter.
//
// TODO M1+: once @codemirror/state + @codemirror/view + the language
//           bundles ship as deps, swap the textarea for a CM6 EditorView
//           inside the same wrapper. Keep window.KuiCodeEditor.attach as
//           the public surface so this file is the single swap point.
// TODO M2:  Tab indent / outdent, Cmd+/ comment toggle, Cmd+F find dialog,
//           bracket auto-close, multi-cursor (Cmd+click).
// TODO M3:  diagnostics + autocomplete bridging.

(function () {
  if (window.KuiCodeEditor) return;

  function attach(root, opts) {
    opts = opts || {};
    var id = opts.id || root.getAttribute('data-kui-codeeditor');
    if (!id) return;

    var ta = root.querySelector('[data-kui-codeeditor-textarea]');
    if (!ta) return;
    var gutter = root.querySelector('[data-kui-codeeditor-gutter]');
    var hidden = root.querySelector('[data-kui-codeeditor-input]');

    function updateGutter() {
      if (!gutter) return;
      var lines = ta.value.split('\n');
      var count = Math.max(lines.length, 1);
      // Rebuild gutter only when line count changes — avoids reflow churn.
      var current = gutter.childElementCount;
      if (current !== count) {
        gutter.innerHTML = '';
        for (var i = 1; i <= count; i++) {
          var d = document.createElement('div');
          d.className = 'tabular-nums';
          d.textContent = String(i);
          gutter.appendChild(d);
        }
      }
      // Active line highlight.
      var sel = ta.selectionStart || 0;
      var activeLine = ta.value.slice(0, sel).split('\n').length;
      var kids = gutter.children;
      for (var k = 0; k < kids.length; k++) {
        if (k + 1 === activeLine) {
          kids[k].className = 'tabular-nums text-text-primary font-semibold';
        } else {
          kids[k].className = 'tabular-nums';
        }
      }
    }

    function syncScroll() {
      if (gutter) gutter.scrollTop = ta.scrollTop;
    }

    function onInput() {
      if (hidden) hidden.value = ta.value;
      updateGutter();
      try {
        root.dispatchEvent(new CustomEvent('kui-codeeditor:change', {
          detail: { value: ta.value, id: id },
          bubbles: true,
        }));
      } catch (_e) { /* noop — older browsers */ }
    }

    ta.addEventListener('input',   onInput);
    ta.addEventListener('keyup',   updateGutter);
    ta.addEventListener('click',   updateGutter);
    ta.addEventListener('focus',   updateGutter);
    ta.addEventListener('scroll',  syncScroll);

    updateGutter();
  }

  window.KuiCodeEditor = { attach: attach };
})();
