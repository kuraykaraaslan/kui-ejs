# NotificationListItem

- **id:** `notification-list-item`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/notification/NotificationListItem.ejs`
- **status:** stable
- **since:** 2026-05

Tek bildirim satırı. Tür ikon tonları (order/message/system/alert/success/social), okundu/okunmadı vurgusu, göreceli zaman ve isteğe bağlı "Mark read" butonu.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--info`
- `--info-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--success-subtle`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Mixed kinds (read + unread)

```ejs
<%- include('modules/domain/common/notification/NotificationListItem', {
  kind: 'order',
  title: 'Order #1042 has been shipped',
  body: 'Your package is on the way and should arrive by Friday.',
  createdAt: new Date(Date.now() - 5 * 60 * 1000),
  read: false,
  href: '/orders/1042'
}) %>
```

### Single unread system notification

```ejs
<%- include('modules/domain/common/notification/NotificationListItem', {
  kind: 'system',
  title: 'Scheduled maintenance tonight at 02:00 UTC',
  body: 'The dashboard will be briefly unavailable for ~10 minutes.',
  createdAt: new Date(),
  read: false,
  onMarkRead: 'function(){ /* mark read */ }'
}) %>
```

## Full EJS source

```ejs
<%
  var _kind      = locals.kind      || 'system';
  var _title     = locals.title     || '';
  var _body      = locals.body      || '';
  var _createdAt = locals.createdAt || new Date();
  var _read      = !!locals.read;
  var _href      = locals.href      || '';
  var _className = locals.className || '';
  var _onMarkRead = locals.onMarkRead || ''; // optional JS handler string

  var KIND_META = {
    order:   { icon: 'fa-bag-shopping',         tone: 'bg-primary-subtle text-primary' },
    message: { icon: 'fa-message',              tone: 'bg-info-subtle text-info' },
    system:  { icon: 'fa-bell',                 tone: 'bg-surface-overlay text-text-secondary' },
    alert:   { icon: 'fa-triangle-exclamation', tone: 'bg-warning-subtle text-warning' },
    success: { icon: 'fa-circle-check',         tone: 'bg-success-subtle text-success' },
    social:  { icon: 'fa-user',                 tone: 'bg-secondary/10 text-secondary' },
  };
  var meta = KIND_META[_kind] || KIND_META.system;

  function timeAgo(date) {
    var d = (date instanceof Date) ? date : new Date(date);
    var diff = Date.now() - d.getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + 'd ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  var _dateIso = (function () {
    try { return new Date(_createdAt).toISOString(); } catch (e) { return ''; }
  })();
  var _timeLabel = timeAgo(_createdAt);

  var rootCls = 'group relative flex items-start gap-3 border-b border-border last:border-b-0 px-4 py-3 transition-colors';
  if (!_read) rootCls += ' bg-primary-subtle/30';
  if (_href) rootCls += ' hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus';
  if (_className) rootCls += ' ' + _className;
%>
<% if (_href) { %>
<a href="<%= _href %>" class="<%= rootCls %>">
<% } else { %>
<div class="<%= rootCls %>">
<% } %>

  <% if (!_read) { %>
    <span aria-hidden="true" class="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></span>
  <% } %>

  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full <%= meta.tone %>" aria-hidden="true">
    <i class="fa-solid <%= meta.icon %> w-4 h-4" aria-hidden="true"></i>
  </span>

  <div class="min-w-0 flex-1">
    <p class="text-sm leading-snug <%= _read ? 'text-text-secondary' : 'font-semibold text-text-primary' %>">
      <%= _title %>
    </p>
    <% if (_body) { %>
      <p class="mt-0.5 text-xs text-text-secondary line-clamp-2 leading-relaxed"><%= _body %></p>
    <% } %>
    <time class="mt-1 inline-block text-[11px] text-text-secondary tabular-nums" datetime="<%= _dateIso %>">
      <%= _timeLabel %>
    </time>
  </div>

  <% if (!_read && _onMarkRead) { %>
    <button
      type="button"
      onclick="event.preventDefault(); (<%= _onMarkRead %>)();"
      class="shrink-0 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:underline focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
    >
      Mark read
    </button>
  <% } %>

<% if (_href) { %>
</a>
<% } else { %>
</div>
<% } %>

```
