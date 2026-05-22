import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/PageHeader.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

const V_MAP: Record<Variant, string> = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
  outline:   'border border-border text-text-primary hover:bg-surface-overlay',
  danger:    'bg-error text-text-inverse hover:opacity-90',
  ghost:     'bg-transparent text-text-primary hover:bg-surface-overlay',
};

type Action = { label: string; variant?: Variant; href?: string; disabled?: boolean };

function actionHtml(action: Action): string {
  const cls = `inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed ${V_MAP[action.variant || 'primary']}`;
  if (action.href) {
    return `<a href="${action.href}" class="${cls}">${action.label}</a>`;
  }
  return `<button type="button"${action.disabled ? ' disabled' : ''} class="${cls}">${action.label}</button>`;
}

function pageHeaderEl(opts: { title: string; subtitle?: string; badgeHtml?: string; actions?: Action[] }) {
  const subtitle = opts.subtitle
    ? `<p class="text-sm text-text-secondary mt-0.5">${opts.subtitle}</p>`
    : '';
  const badge = opts.badgeHtml || '';
  const actions = (opts.actions && opts.actions.length > 0)
    ? `<div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">${opts.actions.map(actionHtml).join('')}</div>`
    : '';

  return `<div class="flex items-start justify-between gap-4 pb-5 border-b border-border">
    <div class="min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <h1 class="text-2xl font-bold text-text-primary leading-tight">${opts.title}</h1>
        ${badge}
      </div>
      ${subtitle}
    </div>
    ${actions}
  </div>`;
}

const badgeInfo = (text: string) =>
  `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info-subtle text-info border border-info">${text}</span>`;

const wrap = (inner: string) => `<div class="p-4 w-full">${inner}</div>`;

// ─── Export ───────────────────────────────────────────────────────────────────

export function buildPageHeaderData(): ShowcaseItem[] {
  return [
    {
      id: 'page-header',
      title: 'PageHeader',
      category: 'Organism',
      abbr: 'Ph',
      description: 'Sayfa başlığı + subtitle + opsiyonel badge + action butonları. 5 buton varyantı (primary/secondary/outline/danger/ghost); href ile link veya button olarak render edilir.',
      filePath: 'modules/ui/PageHeader.ejs',
      sourceCode,
      variants: [
        {
          title: 'With actions',
          previewHtml: wrap(pageHeaderEl({
            title: 'Users',
            subtitle: 'Manage your team members and their permissions.',
            badgeHtml: badgeInfo('48 members'),
            actions: [
              { label: 'Export',          variant: 'outline' },
              { label: '+ Invite user',   variant: 'primary' },
            ],
          })),
          code: `<%- include('modules/ui/PageHeader', {
  title: 'Users',
  subtitle: 'Manage your team members and their permissions.',
  badge: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info-subtle text-info border border-info">48 members</span>',
  actions: [
    { label: 'Export',        variant: 'outline' },
    { label: '+ Invite user', variant: 'primary', href: '/users/invite' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Danger action',
          previewHtml: wrap(pageHeaderEl({
            title: 'Danger Zone',
            subtitle: 'Irreversible actions. Proceed with caution.',
            actions: [
              { label: 'Archive',        variant: 'outline' },
              { label: 'Delete project', variant: 'danger' },
            ],
          })),
          code: `<%- include('modules/ui/PageHeader', {
  title: 'Danger Zone',
  subtitle: 'Irreversible actions.',
  actions: [
    { label: 'Archive',        variant: 'outline' },
    { label: 'Delete project', variant: 'danger' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Minimal',
          previewHtml: wrap(pageHeaderEl({
            title: 'Settings',
            subtitle: 'Configure your workspace preferences.',
          })),
          code: `<%- include('modules/ui/PageHeader', {
  title: 'Settings',
  subtitle: 'Configure your workspace preferences.'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
