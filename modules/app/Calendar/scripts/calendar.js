/* ─── window.__KuiCalendar — view state + nav ─────────────────────────────────
 * Parallel of the React useState/useCallback wiring in
 *   /home/kuray/01_NextJS_Components/modules/app/Calendar/index.tsx
 *
 * One global object shared across every Calendar instance on the page.
 */
window.__KuiCalendar = window.__KuiCalendar || (function () {
  function readDate(root) {
    var iso = root.getAttribute('data-current-date');
    if (iso) return new Date(iso);
    return new Date();
  }
  function writeDate(root, d) {
    root.setAttribute('data-current-date', d.toISOString());
  }
  function view(root) { return root.getAttribute('data-view') || 'month'; }
  function setView(root, v) {
    root.setAttribute('data-view', v);
    // Fire an event the caller can listen to for URL sync (mirror onViewChange).
    root.dispatchEvent(new CustomEvent('kui-calendar:view-change', { detail: { view: v }, bubbles: true }));
  }

  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }

  function step(root, direction) {
    var v = view(root);
    var d = readDate(root);
    var next;
    if (direction === 'today') { next = new Date(); }
    else if (v === 'month' || v === 'agenda' || v === 'resource') {
      next = addMonths(d, direction === 'next' ? 1 : -1);
    } else if (v === 'week') {
      next = addDays(d, direction === 'next' ? 7 : -7);
    } else {
      next = addDays(d, direction === 'next' ? 1 : -1);
    }
    writeDate(root, next);
    root.dispatchEvent(new CustomEvent('kui-calendar:date-change', { detail: { date: next, direction: direction }, bubbles: true }));
  }

  function bindNav(root) {
    root.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-kui-cal-nav]');
      if (btn && root.contains(btn)) {
        step(root, btn.getAttribute('data-kui-cal-nav'));
        return;
      }
      var viewBtn = ev.target.closest('[data-kui-cal-view]');
      if (viewBtn && root.contains(viewBtn)) {
        setView(root, viewBtn.getAttribute('data-kui-cal-view'));
        return;
      }
    });
  }

  function boot(id) {
    var root = document.getElementById(id);
    if (!root || root.__kuiBooted) return;
    root.__kuiBooted = true;
    if (!root.getAttribute('data-current-date')) writeDate(root, new Date());
    bindNav(root);
    // TODO M2: wire drag-create / drag-move / resize handlers here.
    // TODO M3: hydrate RRULE-expanded events.
    // TODO M5: render mini-calendar + agenda after boot.
  }

  return { boot: boot, step: step, setView: setView };
})();
