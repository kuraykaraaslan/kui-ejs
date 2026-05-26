// Open / close / nav wiring for the command palette.
// Parity with hooks/useShortcuts.ts. M1 scope.
(function () {
  // Re-define filter + nav handlers; preserve back-compat names from
  // the legacy AppCommandBar.ejs so existing inline handlers keep firing.
  function openCmdBar(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    var input = document.getElementById(id + '-input');
    if (input) { input.value = ''; window.cmdBarFilter(id, ''); setTimeout(function(){ input.focus(); }, 10); }
    document.body.style.overflow = 'hidden';
  }

  function closeCmdBar(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setActive(list, items, nextIdx) {
    items.forEach(function (el, i) {
      var on = i === nextIdx;
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) {
        el.classList.add('bg-surface-overlay');
        el.focus({ preventScroll: false });
      } else {
        el.classList.remove('bg-surface-overlay');
      }
    });
    if (items[nextIdx]) {
      var input = document.getElementById(list.id.replace('-list', '-input'));
      if (input) input.setAttribute('aria-activedescendant', items[nextIdx].id);
    }
  }

  window.cmdBarFilter = function (id, query) {
    var q = String(query || '').trim();
    var list = document.getElementById(id + '-list');
    if (!list) return;
    var items = list.querySelectorAll('[data-cmd-item]');
    var categories = list.querySelectorAll('.cmd-category');
    var visible = [];
    var fuzzy = window.__KuiCmdFuzzy;

    items.forEach(function (el) {
      var show = true;
      if (q && fuzzy) {
        var s = fuzzy.scoreItem(el, q);
        if (!s) { show = false; }
        else { fuzzy.highlightLabel(el, s.matches); }
      } else if (q) {
        var lbl = el.getAttribute('data-label') || '';
        show = lbl.indexOf(q.toLowerCase()) !== -1;
      } else if (fuzzy) {
        fuzzy.highlightLabel(el, []);
      }
      el.style.display = show ? '' : 'none';
      el.setAttribute('aria-selected', 'false');
      el.classList.remove('bg-surface-overlay');
      if (show) visible.push(el);
    });

    categories.forEach(function (cat) {
      var any = Array.prototype.some.call(
        cat.querySelectorAll('[data-cmd-item]'),
        function (el) { return el.style.display !== 'none'; }
      );
      cat.style.display = any ? '' : 'none';
    });

    var empty = document.getElementById(id + '-empty');
    if (empty) {
      var showEmpty = visible.length === 0 && q.length > 0;
      empty.classList.toggle('hidden', !showEmpty);
      var qSpan = empty.querySelector('[data-cmd-empty-q]');
      if (qSpan) qSpan.textContent = query;
    }

    // Mark the first visible item active for combobox semantics.
    if (visible.length) {
      visible.forEach(function (el, i) { el.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); });
      visible[0].classList.add('bg-surface-overlay');
      var input = document.getElementById(id + '-input');
      if (input) input.setAttribute('aria-activedescendant', visible[0].id);
    } else {
      var input2 = document.getElementById(id + '-input');
      if (input2) input2.removeAttribute('aria-activedescendant');
    }
  };

  window.cmdBarKeyNav = function (e, id) {
    var list = document.getElementById(id + '-list');
    if (!list) return;
    if (e.key === 'Escape') { closeCmdBar(id); return; }
    var items = Array.prototype.filter.call(
      list.querySelectorAll('[data-cmd-item]'),
      function (el) { return el.style.display !== 'none'; }
    );
    if (!items.length) return;
    var idx = items.findIndex(function (el) { return el.getAttribute('aria-selected') === 'true'; });
    if (idx < 0) idx = 0;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(list, items, (idx + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(list, items, (idx - 1 + items.length) % items.length); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(list, items, 0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(list, items, items.length - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var active = items[idx] || items[0];
      if (active) {
        active.click();
        closeCmdBar(id);
      }
    }
  };

  // Trigger / close / ⌘K wiring (registered once globally).
  if (!window.__KuiCmdShortcutsBound) {
    window.__KuiCmdShortcutsBound = true;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-cmd-trigger]');
      if (trigger) { openCmdBar(trigger.getAttribute('data-cmd-trigger')); return; }
      var closeBtn = e.target.closest('[data-cmd-close]');
      if (closeBtn) { closeCmdBar(closeBtn.getAttribute('data-cmd-close')); return; }
      var sug = e.target.closest('[data-cmd-suggest]');
      if (sug) {
        var modal = sug.closest('[id^="cmd-bar-"]');
        if (modal) {
          var input = document.getElementById(modal.id + '-input');
          if (input) {
            input.value = sug.getAttribute('data-suggest-label') || '';
            window.cmdBarFilter(modal.id, input.value);
            input.focus();
          }
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        var bars = document.querySelectorAll('[id^="cmd-bar-"]');
        bars.forEach(function (bar) {
          if (bar.tagName !== 'DIV') return;
          var isOpen = !bar.classList.contains('hidden');
          if (isOpen) closeCmdBar(bar.id); else openCmdBar(bar.id);
        });
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('[id^="cmd-bar-"]').forEach(function (bar) {
          if (!bar.classList.contains('hidden')) closeCmdBar(bar.id);
        });
      }
    });
  }
})();
