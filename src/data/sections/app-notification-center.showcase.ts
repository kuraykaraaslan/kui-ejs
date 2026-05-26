import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render through the top-level shim so include() inside resolves the split
// folder partials/scripts correctly. The displayed sourceCode is the
// orchestrator entry (NotificationCenter/NotificationCenter.ejs).
const ncTemplatePath = path.join(process.cwd(), 'modules/app/NotificationCenter.ejs');
const ncIndexPath    = path.join(process.cwd(), 'modules/app/NotificationCenter/NotificationCenter.ejs');
const renderSource   = fs.readFileSync(ncTemplatePath, 'utf-8');
const sourceCode     = fs.readFileSync(ncIndexPath,    'utf-8');

function renderNC(locals: Record<string, unknown>): string {
  return ejs.render(renderSource, locals, { filename: ncTemplatePath });
}

// Stable anchor so the demo time-ago strings stay deterministic per render.
const NOW = Date.now();
const minutes = (n: number) => new Date(NOW - n * 60 * 1000);
const hours   = (n: number) => new Date(NOW - n * 60 * 60 * 1000);
const days    = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000);

type DemoItem = {
  id: string;
  title: string;
  message?: string;
  createdAt: Date;
  read: boolean;
  source?: string;
  actor?: string;
  variant?: string;
};

function seedItems(): DemoItem[] {
  return [
    {
      id: 'n1',
      title: 'Ada Lovelace requested a review',
      message: 'feat: add notification inbox with unread badge + mark-all-read.',
      createdAt: minutes(4),
      read: false,
      source: 'GitHub',
      actor: 'Ada Lovelace',
      variant: 'mention',
    },
    {
      id: 'n2',
      title: 'Deployment succeeded',
      message: 'avantleap-web → production · build #2438 finished in 1m 42s.',
      createdAt: minutes(38),
      read: false,
      source: 'Vercel',
      variant: 'success',
    },
    {
      id: 'n3',
      title: 'Stripe payout scheduled',
      message: '$1,248.50 will be deposited on Friday, May 29.',
      createdAt: hours(3),
      read: false,
      source: 'Stripe',
      variant: 'info',
    },
    {
      id: 'n4',
      title: 'Disk usage is high on edge-2',
      message: '91% used. Add capacity or rotate logs.',
      createdAt: hours(7),
      read: true,
      source: 'Grafana',
      variant: 'warning',
    },
    {
      id: 'n5',
      title: 'Weekly summary is ready',
      message: '12 PRs merged, 4 incidents resolved, 31 design reviews.',
      createdAt: days(2),
      read: true,
      source: 'Linear',
      variant: 'system',
    },
  ];
}

function wrap(html: string): string {
  return `<div class="flex justify-end w-full px-4 py-6 bg-surface-raised rounded-lg border border-border">${html}</div>`;
}

export function buildAppNotificationCenterData(): ShowcaseItem[] {
  return [
    {
      id: 'notification-center',
      title: 'NotificationCenter',
      category: 'App',
      abbr: 'NC',
      since: '2026-05',
      status: 'beta',
      description:
        'Inbox / activity feed with a bell trigger + unread badge, a popover panel listing notifications newest-first, mark-as-read on hover or click, and a toolbar "Mark all as read". Pixel-identical React sibling at modules/app/NotificationCenter/index.tsx. M2-M6 add filter tabs / grouping / per-notification actions / realtime / preferences / full a11y. Sibling of the toast layer (NotificationSystem) — both can co-exist.',
      filePath: 'modules/app/NotificationCenter/NotificationCenter.ejs',
      sourceCode,
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: [
          'Button with aria-haspopup="dialog" + aria-expanded (bell)',
          'Region with aria-live="polite" (panel)',
          'Badge with aria-label="N unread notifications"',
        ],
        keyboardInteractions: [
          { keys: 'Enter / Space', action: 'Toggle the panel from the bell' },
          { keys: 'Escape',        action: 'Close the panel' },
          { keys: 'Tab',           action: 'Move through notification rows + mark-read buttons' },
        ],
        notes:
          'Full keyboard nav (J/K row nav, M = mark read, A = archive) and screen-reader announcement of new notifications arrive in M6.',
      },
      designTokens: [
        '--primary', '--primary-subtle',
        '--error', '--text-inverse',
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--border', '--border-focus',
        '--text-primary', '--text-secondary',
        '--success', '--success-subtle',
        '--warning', '--warning-subtle',
        '--info', '--info-subtle',
        '--error-subtle',
      ],
      variants: [
        {
          title: 'Bell + panel (default)',
          layout: 'stack',
          previewHtml: wrap(renderNC({
            id: 'nc-demo-default',
            items: seedItems(),
          })),
          code: `<%- include('modules/app/NotificationCenter', {
  id: 'inbox',
  items: items
}) %>`,
        },
        {
          title: 'Empty state',
          layout: 'stack',
          previewHtml: wrap(renderNC({
            id: 'nc-demo-empty',
            items: [],
          })),
          code: `<%- include('modules/app/NotificationCenter', {
  id: 'inbox-empty',
  items: []
}) %>`,
        },
        {
          title: 'High unread count — badge caps at 99+',
          layout: 'stack',
          previewHtml: wrap(renderNC({
            id: 'nc-demo-many',
            items: seedItems().concat(
              Array.from({ length: 122 }, (_, i): DemoItem => ({
                id: `bulk-${i}`,
                title: `System event ${i + 1}`,
                createdAt: days((i % 6) + 1),
                read: false,
                source: 'System',
                variant: 'info',
              })),
            ),
          })),
          code: `<%- include('modules/app/NotificationCenter', {
  id: 'inbox-many',
  items: many /* 100+ unread */
}) %>`,
        },
      ],
    },
  ];
}
