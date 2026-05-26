<script>
/* ─── window.__KuiNotificationCenter — store + DOM glue (M1) ─────────────────
 * Parallel of the React useState/useCallback wiring in
 *   /home/kuray/01_NextJS_Components/modules/app/NotificationCenter/index.tsx
 *
 * One global object shared across every NotificationCenter instance on the page.
 * Handles: open/close, mark-read, mark-all-read, outside click + Escape dismiss.
 *
 * TODO M2: filter tabs + grouping (mirror hooks/useGrouping.ts).
 * TODO M3: per-notification actions / snooze (mirror hooks/useSnooze.ts).
 * TODO M4: realtime adapter (mirror hooks/useRealtimeSync.ts).
 */
(function () {
  if (window.__KuiNotificationCenter) return;

  function $(id) { return document.getElementById(id); }
  function panelEl(id) { return $(id + '-panel'); }
  function bellBtn(rootId) {
    var root = $(rootId);
    return root ? root.querySelector('[data-kui-nc-bell]') : null;
  }
  function rowEl(rootId, notifId) {
    var root = $(rootId);
    if (!root) return null;
    return root.querySelector('[data-kui-nc-row][data-notif-id="' + notifId + '"]');
  }

  function dispatch(rootId, name, detail) {
    var root = $(rootId);
    if (!root) return;
    root.dispatchEvent(new CustomEvent('kui-nc:' + name, { detail: detail || {}, bubbles: true }));
  }

  function open(id) {
    var panel = panelEl(id);
    var btn   = bellBtn(id);
    if (!panel) return;
    panel.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    dispatch(id, 'open');
  }

  function close(id) {
    var panel = panelEl(id);
    var btn   = bellBtn(id);
    if (!panel) return;
    panel.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    dispatch(id, 'close');
  }

  function toggle(id) {
    var panel = panelEl(id);
    if (!panel) return;
    if (panel.classList.contains('hidden')) open(id);
    else close(id);
  }

  function markRead(rootId, notifId) {
    var row = rowEl(rootId, notifId);
    if (!row) return;
    if (row.getAttribute('data-read') === 'true') return;
    row.setAttribute('data-read', 'true');
    row.classList.remove('bg-primary-subtle/40');
    // Hide the unread dot.
    var dot = row.querySelector('[data-kui-nc-dot]');
    if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
    // Demote the title styling.
    var title = row.querySelector('[data-kui-nc-title]');
    if (title) {
      title.classList.remove('font-semibold', 'text-text-primary');
      title.classList.add('font-medium', 'text-text-secondary');
    }
    // Remove the mark-read affordance.
    var mark = row.querySelector('[data-kui-nc-mark]');
    if (mark && mark.parentNode) mark.parentNode.removeChild(mark);
    dispatch(rootId, 'mark-read', { id: notifId });
    if (window.__KuiNotificationUnread) window.__KuiNotificationUnread.refresh(rootId);
  }

  function markAllRead(rootId) {
    var root = $(rootId);
    if (!root) return;
    var rows = root.querySelectorAll('[data-kui-nc-row][data-read="false"]');
    for (var i = 0; i < rows.length; i++) {
      markRead(rootId, rows[i].getAttribute('data-notif-id'));
    }
    dispatch(rootId, 'mark-all-read');
  }

  // Outside-click + Escape dismiss — applies to every NC instance on the page.
  document.addEventListener('mousedown', function (e) {
    var roots = document.querySelectorAll('[data-kui-nc]');
    for (var i = 0; i < roots.length; i++) {
      var root  = roots[i];
      var panel = panelEl(root.id);
      if (!panel || panel.classList.contains('hidden')) continue;
      if (root.contains(e.target)) continue;
      close(root.id);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var roots = document.querySelectorAll('[data-kui-nc]');
    for (var i = 0; i < roots.length; i++) {
      var panel = panelEl(roots[i].id);
      if (panel && !panel.classList.contains('hidden')) close(roots[i].id);
    }
  });

  window.__KuiNotificationCenter = {
    open: open,
    close: close,
    toggle: toggle,
    markRead: markRead,
    markAllRead: markAllRead
  };
})();
</script>
