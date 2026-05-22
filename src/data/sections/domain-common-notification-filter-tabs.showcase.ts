import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/common/notification/NotificationFilterTabs.ejs'),
  'utf-8'
);

type Tab = { id: string; label: string; count?: number };

function tabsRow(tabs: Tab[], activeId: string): string {
  return `<div role="tablist" aria-label="Notification filters" class="flex flex-wrap items-center gap-1 border-b border-border pb-3">
  ${tabs
    .map((tab) => {
      const isActive = tab.id === activeId;
      const btnCls = isActive
        ? 'bg-primary text-primary-fg'
        : 'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-sunken';
      const pillCls = isActive ? 'bg-primary-fg/20' : 'bg-surface-base text-text-secondary';
      const pill =
        tab.count !== undefined
          ? `<span class="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${pillCls}">${tab.count}</span>`
          : '';
      return `<button type="button" role="tab" aria-selected="${isActive ? 'true' : 'false'}"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${btnCls}">
      ${tab.label}${pill}
    </button>`;
    })
    .join('\n  ')}
</div>`;
}

export function buildDomainCommonNotificationFilterTabsData(): ShowcaseItem[] {
  return [
    {
      id: 'notification-filter-tabs',
      title: 'NotificationFilterTabs',
      category: 'Domain',
      abbr: 'NF',
      description:
        'Pill-style filter tabs for a notification list. Includes count badges, active/inactive colors, and is accessible via role="tab" / aria-selected.',
      filePath: 'modules/domain/common/notification/NotificationFilterTabs.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default (with counts)',
          previewHtml: `<div class="w-full max-w-xl p-4">
  ${tabsRow(
    [
      { id: 'all', label: 'All', count: 24 },
      { id: 'unread', label: 'Unread', count: 5 },
      { id: 'mentions', label: 'Mentions', count: 2 },
      { id: 'system', label: 'System', count: 17 },
    ],
    'all'
  )}
</div>`,
          code: `<%- include('modules/domain/common/notification/NotificationFilterTabs', {
  tabs: [
    { id: 'all',      label: 'All',      count: 24 },
    { id: 'unread',   label: 'Unread',   count: 5  },
    { id: 'mentions', label: 'Mentions', count: 2  },
    { id: 'system',   label: 'System',   count: 17 },
  ],
  activeId: 'all'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Active = Unread, no counts',
          previewHtml: `<div class="w-full max-w-xl p-4">
  ${tabsRow(
    [
      { id: 'all', label: 'All' },
      { id: 'unread', label: 'Unread' },
      { id: 'archived', label: 'Archived' },
    ],
    'unread'
  )}
</div>`,
          code: `<%- include('modules/domain/common/notification/NotificationFilterTabs', {
  tabs: [
    { id: 'all',      label: 'All'      },
    { id: 'unread',   label: 'Unread'   },
    { id: 'archived', label: 'Archived' },
  ],
  activeId: 'unread'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
