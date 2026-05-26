<script>
/* ─── window.__KuiNotificationUnread — badge bookkeeping (M1) ───────────────
 * Parallel of hooks/useUnreadCount.ts. Counts [data-kui-nc-row][data-read="false"]
 * within a given NC root and re-renders the bell badge + header pill in place.
 */
(function () {
  if (window.__KuiNotificationUnread) return;

  function $(id) { return document.getElementById(id); }

  function refresh(rootId) {
    var root = $(rootId);
    if (!root) return;
    var unread = root.querySelectorAll('[data-kui-nc-row][data-read="false"]').length;
    var display = unread > 99 ? '99+' : String(unread);

    // ── Bell badge (rendered or removed). ───────────────────────────────────
    var bell  = root.querySelector('[data-kui-nc-bell]');
    if (bell) {
      var badge = bell.querySelector('span[aria-label$="unread notifications"]');
      if (unread > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] inline-flex items-center justify-center px-1 rounded-full text-[10px] font-semibold leading-none bg-error text-text-inverse border-2 border-surface-base tabular-nums';
          bell.appendChild(badge);
        }
        badge.setAttribute('aria-label', unread + ' unread notifications');
        badge.textContent = display;
      } else if (badge && badge.parentNode) {
        badge.parentNode.removeChild(badge);
      }
    }

    // ── Header pill next to the panel title. ────────────────────────────────
    var panel = $(rootId + '-panel');
    if (panel) {
      var pill = panel.querySelector('h2 + span');
      if (unread > 0) {
        if (!pill) {
          var header = panel.querySelector('h2');
          if (header && header.parentNode) {
            pill = document.createElement('span');
            pill.className = 'inline-flex items-center px-1.5 h-5 rounded-full bg-error text-text-inverse text-[10px] font-semibold tabular-nums';
            header.parentNode.appendChild(pill);
          }
        }
        if (pill) pill.textContent = display;
      } else if (pill && pill.parentNode) {
        pill.parentNode.removeChild(pill);
      }

      // ── "Mark all" button — disable when nothing is unread. ──────────────
      var markAll = panel.querySelector('[data-kui-nc-mark-all]');
      if (markAll) {
        if (unread === 0) markAll.setAttribute('disabled', 'disabled');
        else markAll.removeAttribute('disabled');
      }
    }
  }

  window.__KuiNotificationUnread = { refresh: refresh };
})();
</script>
