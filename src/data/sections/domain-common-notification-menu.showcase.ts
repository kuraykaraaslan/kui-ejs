import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/common/notification/NotificationMenu.ejs'),
  'utf-8'
);

type MenuItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read: boolean;
  variant?: 'info' | 'success' | 'warning' | 'error';
};

const variantDot: Record<string, string> = {
  info:    'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

function menuEl(opts: { items: MenuItem[]; showFooter?: boolean; emptyMode?: boolean }): string {
  const unread = opts.items.filter((i) => !i.read).length;
  const headerBadge =
    unread > 0
      ? `<span class="px-1.5 py-0.5 rounded-full bg-error text-primary-fg text-[10px] font-bold leading-none">${unread}</span>`
      : '';
  const triggerBadge =
    unread > 0
      ? `<span class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full bg-error text-primary-fg text-[10px] font-bold leading-none pointer-events-none">${unread > 9 ? '9+' : unread}</span>`
      : '';
  const markAll =
    unread > 0
      ? `<button type="button" class="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">Mark all read</button>`
      : '';

  const listInner = opts.emptyMode
    ? `<div class="flex flex-col items-center justify-center py-10 gap-2 text-text-disabled">
        <i class="fa-solid fa-bell w-6 h-6" aria-hidden="true"></i>
        <p class="text-sm">No notifications</p>
      </div>`
    : opts.items
        .map((item) => {
          const dot = item.read ? 'bg-transparent' : variantDot[item.variant || 'info'];
          const titleCls = item.read ? 'text-text-secondary' : 'text-text-primary font-medium';
          const btnExtra = !item.read ? ' bg-primary-subtle/40' : '';
          const desc = item.description
            ? `<p class="text-xs text-text-secondary mt-0.5 line-clamp-2">${item.description}</p>`
            : '';
          return `<button type="button" class="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-overlay${btnExtra}">
        <span class="mt-1.5 shrink-0 w-2 h-2 rounded-full ${dot}" aria-hidden="true"></span>
        <div class="flex-1 min-w-0">
          <p class="text-sm truncate ${titleCls}">${item.title}</p>
          ${desc}
          <p class="text-[11px] text-text-disabled mt-1">${item.timestamp}</p>
        </div>
      </button>`;
        })
        .join('');

  const footer = opts.showFooter
    ? `<div class="border-t border-border">
        <button type="button" class="w-full py-2.5 text-xs text-primary font-medium hover:bg-surface-overlay transition-colors">View all notifications</button>
      </div>`
    : '';

  return `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true"
    class="relative flex items-center justify-center w-8 h-8 rounded-md text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors">
    <i class="fa-solid fa-bell w-4 h-4" aria-hidden="true"></i>
    ${triggerBadge}
  </button>
  <div role="dialog" aria-label="Notifications"
    class="absolute top-full mt-2 z-50 w-80 rounded-xl border border-border bg-surface-raised shadow-xl overflow-hidden right-0">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-text-primary">Notifications</span>
        ${headerBadge}
      </div>
      ${markAll}
    </div>
    <div class="max-h-80 overflow-y-auto divide-y divide-border">${listInner}</div>
    ${footer}
  </div>
</div>`;
}

export function buildDomainCommonNotificationMenuData(): ShowcaseItem[] {
  return [
    {
      id: 'notification-menu',
      title: 'NotificationMenu',
      category: 'Domain',
      abbr: 'NM',
      description:
        'Header bildirim çanı + açılır panel. Okunmamış sayacı, başlık rozeti, "Mark all read", öğe listesi ve "View all" alt bağlantısı. Esc / dış tıklama ile kapanır.',
      filePath: 'modules/domain/common/notification/NotificationMenu.ejs',
      sourceCode,
      variants: [
        {
          title: 'With unread notifications',
          previewHtml: `<div class="w-full max-w-md p-4 min-h-[28rem] flex justify-center">
  ${menuEl({
    items: [
      {
        id: '1',
        title: 'Your order #1042 was shipped',
        description: 'Tracking number AX-29481-TR. Expected delivery Friday.',
        timestamp: '5 min ago',
        read: false,
        variant: 'success',
      },
      {
        id: '2',
        title: 'New message from Sarah',
        description: 'Hey! Are you free for a quick call later today?',
        timestamp: '1 hour ago',
        read: false,
        variant: 'info',
      },
      {
        id: '3',
        title: 'Storage almost full',
        description: 'You are using 92% of your plan limit.',
        timestamp: '3 hours ago',
        read: false,
        variant: 'warning',
      },
      {
        id: '4',
        title: 'Backup completed',
        timestamp: 'Yesterday',
        read: true,
        variant: 'success',
      },
    ],
    showFooter: true,
  })}
</div>`,
          code: `<%- include('modules/domain/common/notification/NotificationMenu', {
  items: notifications,
  align: 'right',
  onMarkAllRead: 'markAllRead',
  viewAllHref: '/notifications'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: `<div class="w-full max-w-md p-4 min-h-[24rem] flex justify-center">
  ${menuEl({ items: [], emptyMode: true, showFooter: false })}
</div>`,
          code: `<%- include('modules/domain/common/notification/NotificationMenu', {
  items: [],
  align: 'right'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
