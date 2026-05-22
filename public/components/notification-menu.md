# NotificationMenu

- **id:** `notification-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/notification/NotificationMenu.ejs`
- **status:** stable
- **since:** 2026-05

Bell icon button with unread count badge. Opens a dropdown panel showing notification items grouped by read/unread state with variant color dots, timestamps, and mark-all-read / view-all actions.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--info`
- `--primary`
- `--primary-fg`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### With unread notifications

```ejs
<%- include('modules/domain/common/notification/NotificationMenu', {
  items: notifications,
  align: 'right',
  onMarkAllRead: 'markAllRead',
  viewAllHref: '/notifications'
}) %>
```

### Empty state

```ejs
<%- include('modules/domain/common/notification/NotificationMenu', {
  items: [],
  align: 'right'
}) %>
```

## Full EJS source

```ejs
<%
  var _id          = locals.id          || 'notif-menu-' + Math.random().toString(36).substr(2, 9);
  var _items       = locals.items       || [];
  var _align       = locals.align       || 'right';
  var _onMarkAllRead = locals.onMarkAllRead || ''; // optional href or JS handler string
  var _onViewAll     = locals.onViewAll     || '';
  var _markAllHref   = locals.markAllHref   || '';
  var _viewAllHref   = locals.viewAllHref   || '';
  var _className   = locals.className   || '';

  var unreadCount = 0;
  _items.forEach(function (n) { if (!n.read) unreadCount++; });

  var variantDot = {
    info:    'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    error:   'bg-error',
  };

  var alignClass = _align === 'right' ? 'right-0' : 'left-0';
%>
<div id="<%= _id %>" class="relative<%= _className ? ' ' + _className : '' %>">
  <!-- Trigger -->
  <button
    type="button"
    aria-label="Notifications<%= unreadCount > 0 ? ', ' + unreadCount + ' unread' : '' %>"
    aria-haspopup="dialog"
    aria-expanded="false"
    onclick="toggleNotifMenu('<%= _id %>')"
    class="relative flex items-center justify-center w-8 h-8 rounded-md text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
  >
    <i class="fa-solid fa-bell w-4 h-4" aria-hidden="true"></i>
    <% if (unreadCount > 0) { %>
      <span class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full bg-error text-primary-fg text-[10px] font-bold leading-none pointer-events-none">
        <%= unreadCount > 9 ? '9+' : unreadCount %>
      </span>
    <% } %>
  </button>

  <!-- Panel -->
  <div
    id="<%= _id %>-panel"
    role="dialog"
    aria-label="Notifications"
    class="hidden absolute top-full mt-2 z-50 w-80 rounded-xl border border-border bg-surface-raised shadow-xl overflow-hidden <%= alignClass %>"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-text-primary">Notifications</span>
        <% if (unreadCount > 0) { %>
          <span class="px-1.5 py-0.5 rounded-full bg-error text-primary-fg text-[10px] font-bold leading-none">
            <%= unreadCount %>
          </span>
        <% } %>
      </div>
      <% if (unreadCount > 0 && (_onMarkAllRead || _markAllHref)) { %>
        <% if (_markAllHref) { %>
          <a href="<%= _markAllHref %>" class="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">Mark all read</a>
        <% } else { %>
          <button
            type="button"
            onclick="(<%= _onMarkAllRead %>)();"
            class="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
          >Mark all read</button>
        <% } %>
      <% } %>
    </div>

    <!-- List -->
    <div class="max-h-80 overflow-y-auto divide-y divide-border">
      <% if (_items.length === 0) { %>
        <div class="flex flex-col items-center justify-center py-10 gap-2 text-text-disabled">
          <i class="fa-solid fa-bell w-6 h-6" aria-hidden="true"></i>
          <p class="text-sm">No notifications</p>
        </div>
      <% } else { %>
        <% _items.forEach(function (item) { %>
          <% var dotCls = item.read ? 'bg-transparent' : (variantDot[item.variant || 'info'] || variantDot.info); %>
          <% var titleCls = item.read ? 'text-text-secondary' : 'text-text-primary font-medium'; %>
          <% var btnExtra = !item.read ? ' bg-primary-subtle/40' : ''; %>
          <button
            type="button"
            data-notif-id="<%= item.id %>"
            <% if (item.onClick) { %>onclick="(<%= item.onClick %>)(); closeNotifMenu('<%= _id %>');"<% } else { %>onclick="closeNotifMenu('<%= _id %>')"<% } %>
            class="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:bg-surface-overlay<%= btnExtra %>"
          >
            <span class="mt-1.5 shrink-0 w-2 h-2 rounded-full <%= dotCls %>" aria-hidden="true"></span>
            <div class="flex-1 min-w-0">
              <p class="text-sm truncate <%= titleCls %>"><%= item.title %></p>
              <% if (item.description) { %>
                <p class="text-xs text-text-secondary mt-0.5 line-clamp-2"><%= item.description %></p>
              <% } %>
              <p class="text-[11px] text-text-disabled mt-1"><%= item.timestamp %></p>
            </div>
          </button>
        <% }); %>
      <% } %>
    </div>

    <!-- Footer -->
    <% if (_onViewAll || _viewAllHref) { %>
      <div class="border-t border-border">
        <% if (_viewAllHref) { %>
          <a href="<%= _viewAllHref %>" class="block w-full py-2.5 text-xs text-primary font-medium hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus text-center">View all notifications</a>
        <% } else { %>
          <button
            type="button"
            onclick="(<%= _onViewAll %>)(); closeNotifMenu('<%= _id %>');"
            class="w-full py-2.5 text-xs text-primary font-medium hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >View all notifications</button>
        <% } %>
      </div>
    <% } %>
  </div>
</div>

<script>
(function () {
  function toggleNotifMenu(id) {
    var panel = document.getElementById(id + '-panel');
    var root  = document.getElementById(id);
    if (!panel || !root) return;
    var btn = root.querySelector('[aria-haspopup="dialog"]');
    var isOpen = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden', isOpen);
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  }
  function closeNotifMenu(id) {
    var panel = document.getElementById(id + '-panel');
    var root  = document.getElementById(id);
    if (!panel || !root) return;
    var btn = root.querySelector('[aria-haspopup="dialog"]');
    panel.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  window.toggleNotifMenu = window.toggleNotifMenu || toggleNotifMenu;
  window.closeNotifMenu  = window.closeNotifMenu  || closeNotifMenu;

  document.addEventListener('click', function (e) {
    document.querySelectorAll('[id^="notif-menu-"]').forEach(function (root) {
      if (root.id.indexOf('-panel') !== -1) return;
      if (root.contains(e.target)) return;
      var panel = document.getElementById(root.id + '-panel');
      var btn = root.querySelector('[aria-haspopup="dialog"]');
      if (panel) panel.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[id^="notif-menu-"]').forEach(function (root) {
      if (root.id.indexOf('-panel') !== -1) return;
      var panel = document.getElementById(root.id + '-panel');
      var btn = root.querySelector('[aria-haspopup="dialog"]');
      if (panel) panel.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
</script>

```
