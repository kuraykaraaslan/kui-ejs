/* ── Gantt zoom helpers (M1) ─────────────────────────────────────────── */
/* Public per-board API. Host can call .zoomIn() / .zoomOut() to step the
   scale tablist programmatically without picking the button. TODO M6 will
   add +/- keyboard bindings on root. */
(function () {
  window.KuiGantt = window.KuiGantt || {};
  window.KuiGantt.get = window.KuiGantt.get || function (id) {
    return window.KuiGantt[id] || null;
  };
  var ORDER = ['day', 'week', 'month', 'quarter', 'year'];
  function stepScale(delta) {
    var cur = root.getAttribute('data-gantt-scale');
    var idx = ORDER.indexOf(cur);
    if (idx < 0) idx = 1;
    var next = ORDER[Math.max(0, Math.min(ORDER.length - 1, idx + delta))];
    if (next === cur) return;
    var btn = root.querySelector('[data-kui-gantt-scale="' + next + '"]');
    if (btn) btn.click();
  }
  window.KuiGantt[GT_ID] = {
    zoomIn:  function () { stepScale(-1); },
    zoomOut: function () { stepScale( 1); },
    getScale: function () { return root.getAttribute('data-gantt-scale'); }
  };
})();
