# NotificationFilterTabs

- **id:** `notification-filter-tabs`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/notification/NotificationFilterTabs.ejs`
- **status:** stable
- **since:** 2026-05

Bildirim listesi için pill-tarzı filtre sekmeleri. Sayaç rozeti, aktif/pasif renkler ve role="tab" / aria-selected ile erişilebilir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (with counts)

```ejs
<%- include('modules/domain/common/notification/NotificationFilterTabs', {
  tabs: [
    { id: 'all',      label: 'All',      count: 24 },
    { id: 'unread',   label: 'Unread',   count: 5  },
    { id: 'mentions', label: 'Mentions', count: 2  },
    { id: 'system',   label: 'System',   count: 17 },
  ],
  activeId: 'all'
}) %>
```

### Active = Unread, no counts

```ejs
<%- include('modules/domain/common/notification/NotificationFilterTabs', {
  tabs: [
    { id: 'all',      label: 'All'      },
    { id: 'unread',   label: 'Unread'   },
    { id: 'archived', label: 'Archived' },
  ],
  activeId: 'unread'
}) %>
```

## Full EJS source

```ejs
<%
  var _tabs      = locals.tabs      || [];
  var _activeId  = locals.activeId  || (_tabs.length > 0 ? _tabs[0].id : '');
  var _id        = locals.id        || 'notif-filter-tabs-' + Math.random().toString(36).substr(2, 9);
  var _className = locals.className || '';
%>
<div
  id="<%= _id %>"
  role="tablist"
  aria-label="Notification filters"
  class="flex flex-wrap items-center gap-1 border-b border-border pb-3<%= _className ? ' ' + _className : '' %>"
>
  <% _tabs.forEach(function (tab) { %>
    <% var isActive = tab.id === _activeId; %>
    <button
      type="button"
      role="tab"
      id="<%= _id %>-tab-<%= tab.id %>"
      aria-selected="<%= isActive ? 'true' : 'false' %>"
      data-tab-id="<%= tab.id %>"
      onclick="activateNotifFilterTab('<%= _id %>', '<%= tab.id %>')"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= isActive ? 'bg-primary text-primary-fg' : 'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-sunken' %>"
    >
      <%= tab.label %>
      <% if (tab.count !== undefined && tab.count !== null) { %>
        <span
          data-count-pill
          class="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums <%= isActive ? 'bg-primary-fg/20' : 'bg-surface-base text-text-secondary' %>"
        ><%= tab.count %></span>
      <% } %>
    </button>
  <% }); %>
</div>

<script>
(function () {
  function activateNotifFilterTab(groupId, tabId) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('[role="tab"]').forEach(function (t) {
      var active = t.getAttribute('data-tab-id') === tabId;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      var activeCls = ['bg-primary', 'text-primary-fg'];
      var inactiveCls = ['bg-surface-overlay', 'text-text-secondary', 'hover:text-text-primary', 'hover:bg-surface-sunken'];
      activeCls.forEach(function (c) { t.classList.toggle(c, active); });
      inactiveCls.forEach(function (c) { t.classList.toggle(c, !active); });
      var pill = t.querySelector('[data-count-pill]');
      if (pill) {
        var pillActive = ['bg-primary-fg/20'];
        var pillInactive = ['bg-surface-base', 'text-text-secondary'];
        pillActive.forEach(function (c) { pill.classList.toggle(c, active); });
        pillInactive.forEach(function (c) { pill.classList.toggle(c, !active); });
      }
    });
    group.dispatchEvent(new CustomEvent('notif-filter-change', { detail: { tabId: tabId }, bubbles: true }));
  }
  window.activateNotifFilterTab = window.activateNotifFilterTab || activateNotifFilterTab;
})();
</script>

```
