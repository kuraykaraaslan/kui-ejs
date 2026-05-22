import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/common/notification/NotificationListItem.ejs'),
  'utf-8'
);

const KIND_META: Record<string, { icon: string; tone: string }> = {
  order:   { icon: 'fa-bag-shopping',         tone: 'bg-primary-subtle text-primary' },
  message: { icon: 'fa-message',              tone: 'bg-info-subtle text-info' },
  system:  { icon: 'fa-bell',                 tone: 'bg-surface-overlay text-text-secondary' },
  alert:   { icon: 'fa-triangle-exclamation', tone: 'bg-warning-subtle text-warning' },
  success: { icon: 'fa-circle-check',         tone: 'bg-success-subtle text-success' },
  social:  { icon: 'fa-user',                 tone: 'bg-secondary/10 text-secondary' },
};

type ItemOpts = {
  kind: keyof typeof KIND_META;
  title: string;
  body?: string;
  timeLabel: string;
  read?: boolean;
  hasHref?: boolean;
  showMarkRead?: boolean;
};

function itemEl(o: ItemOpts): string {
  const meta = KIND_META[o.kind];
  const rootBase =
    'group relative flex items-start gap-3 border-b border-border last:border-b-0 px-4 py-3 transition-colors';
  const unreadBg = !o.read ? ' bg-primary-subtle/30' : '';
  const hover = o.hasHref ? ' hover:bg-surface-overlay' : '';
  const rootCls = rootBase + unreadBg + hover;
  const titleCls = o.read
    ? 'text-sm leading-snug text-text-secondary'
    : 'text-sm leading-snug font-semibold text-text-primary';
  const tag = o.hasHref ? 'a href="#"' : 'div';
  const closeTag = o.hasHref ? 'a' : 'div';
  const dot = !o.read
    ? '<span aria-hidden="true" class="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></span>'
    : '';
  const body = o.body
    ? `<p class="mt-0.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">${o.body}</p>`
    : '';
  const markRead = !o.read && o.showMarkRead
    ? `<button type="button" class="shrink-0 text-xs text-primary font-medium opacity-100 transition-opacity hover:underline rounded">Mark read</button>`
    : '';
  return `<${tag} class="${rootCls}">
  ${dot}
  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}" aria-hidden="true">
    <i class="fa-solid ${meta.icon} w-4 h-4" aria-hidden="true"></i>
  </span>
  <div class="min-w-0 flex-1">
    <p class="${titleCls}">${o.title}</p>
    ${body}
    <time class="mt-1 inline-block text-[11px] text-text-secondary tabular-nums">${o.timeLabel}</time>
  </div>
  ${markRead}
</${closeTag}>`;
}

function listShell(items: string): string {
  return `<div class="w-full max-w-md p-4">
  <div class="rounded-xl border border-border bg-surface-raised overflow-hidden">
    ${items}
  </div>
</div>`;
}

export function buildDomainCommonNotificationListItemData(): ShowcaseItem[] {
  return [
    {
      id: 'notification-list-item',
      title: 'NotificationListItem',
      category: 'Domain',
      abbr: 'NL',
      description:
        'Tek bildirim satırı. Tür ikon tonları (order/message/system/alert/success/social), okundu/okunmadı vurgusu, göreceli zaman ve isteğe bağlı "Mark read" butonu.',
      filePath: 'modules/domain/common/notification/NotificationListItem.ejs',
      sourceCode,
      variants: [
        {
          title: 'Mixed kinds (read + unread)',
          previewHtml: listShell(
            [
              itemEl({
                kind: 'order',
                title: 'Order #1042 has been shipped',
                body: 'Your package is on the way and should arrive by Friday.',
                timeLabel: '5m ago',
                read: false,
                hasHref: true,
              }),
              itemEl({
                kind: 'message',
                title: 'New message from Sarah',
                body: 'Hey! Just wanted to follow up on the proposal we discussed last week.',
                timeLabel: '1h ago',
                read: false,
                hasHref: true,
                showMarkRead: true,
              }),
              itemEl({
                kind: 'success',
                title: 'Backup completed successfully',
                timeLabel: '3h ago',
                read: true,
                hasHref: true,
              }),
              itemEl({
                kind: 'alert',
                title: 'Unusual sign-in attempt blocked',
                body: 'A sign-in attempt from a new device was prevented.',
                timeLabel: '2d ago',
                read: true,
              }),
            ].join('')
          ),
          code: `<%- include('modules/domain/common/notification/NotificationListItem', {
  kind: 'order',
  title: 'Order #1042 has been shipped',
  body: 'Your package is on the way and should arrive by Friday.',
  createdAt: new Date(Date.now() - 5 * 60 * 1000),
  read: false,
  href: '/orders/1042'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Single unread system notification',
          previewHtml: listShell(
            itemEl({
              kind: 'system',
              title: 'Scheduled maintenance tonight at 02:00 UTC',
              body: 'The dashboard will be briefly unavailable for ~10 minutes.',
              timeLabel: 'just now',
              read: false,
              showMarkRead: true,
            })
          ),
          code: `<%- include('modules/domain/common/notification/NotificationListItem', {
  kind: 'system',
  title: 'Scheduled maintenance tonight at 02:00 UTC',
  body: 'The dashboard will be briefly unavailable for ~10 minutes.',
  createdAt: new Date(),
  read: false,
  onMarkRead: 'function(){ /* mark read */ }'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
