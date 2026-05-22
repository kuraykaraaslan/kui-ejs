import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const detailHeaderSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/DetailHeader.ejs'), 'utf-8');
const errorStateSource   = fs.readFileSync(path.join(process.cwd(), 'modules/app/ErrorState.ejs'), 'utf-8');
const notFoundSource     = fs.readFileSync(path.join(process.cwd(), 'modules/app/NotFoundState.ejs'), 'utf-8');
const loadingStateSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/LoadingState.ejs'), 'utf-8');
const splashSource       = fs.readFileSync(path.join(process.cwd(), 'modules/app/SplashScreen.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const badge = (label: string, variant: string) => {
  const cls: Record<string, string> = {
    success: 'bg-success-subtle text-success-fg',
    error:   'bg-error-subtle text-error-fg',
    warning: 'bg-warning-subtle text-warning-fg',
    neutral: 'bg-surface-sunken text-text-secondary',
    primary: 'bg-primary-subtle text-primary',
  };
  return `<span class="inline-flex items-center rounded-full font-medium ${cls[variant] || cls.neutral} px-2 py-0.5 text-xs">${label}</span>`;
};

const actionBtn = (label: string, variant = 'outline', icon?: string) => {
  const cls = variant === 'primary'
    ? 'bg-primary text-primary-fg hover:bg-primary-hover'
    : variant === 'danger'
    ? 'bg-error text-white hover:bg-error/90'
    : 'border border-border text-text-primary hover:bg-surface-overlay';
  return `<button class="inline-flex items-center gap-1.5 rounded-md ${cls} px-3 py-1.5 text-sm font-medium">${icon ? `<i class="${icon} text-xs"></i>` : ''}${label}</button>`;
};

const tab = (label: string, active = false) =>
  `<button role="tab" aria-selected="${active}"
    class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong'}">
    ${label}
  </button>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppContentData(): ShowcaseItem[] {
  return [
    // ── DetailHeader ──────────────────────────────────────────────────────────
    {
      id: 'detail-header',
      title: 'DetailHeader',
      category: 'App',
      abbr: 'Dh',
      description: 'Page header for detail/record views: title, subtitle, status badge, action buttons, and optional tab navigation.',
      filePath: 'modules/app/DetailHeader.ejs',
      sourceCode: detailHeaderSource,
      variants: [
        {
          title: 'With actions, no tabs',
          previewHtml: `<div class="w-full">
  <div class="border-b border-border bg-surface-raised rounded-t-xl">
    <div class="px-6 pt-6 pb-4">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-2xl font-bold text-text-primary leading-tight">Invoice #1042</h1>
            ${badge('PAID', 'success')}
          </div>
          <p class="text-sm text-text-secondary mt-0.5">Created 3 days ago · Due Jan 15, 2026</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${actionBtn('Edit', 'outline', 'fa-solid fa-pencil')}
          ${actionBtn('Delete', 'danger', 'fa-solid fa-trash')}
        </div>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/DetailHeader', {
  title:         'Invoice #1042',
  subtitle:      'Created 3 days ago · Due Jan 15, 2026',
  status:        'PAID',
  statusVariant: 'success',
  actionsContent: \`
    <%- include('modules/ui/Button', { variant: 'outline', iconLeft: '<i class="fa-solid fa-pencil"></i>', children: 'Edit' }) %>
    <%- include('modules/ui/Button', { variant: 'danger',  iconLeft: '<i class="fa-solid fa-trash"></i>',  children: 'Delete' }) %>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With tabs',
          previewHtml: `<div class="w-full">
  <div class="border-b border-border bg-surface-raised rounded-t-xl">
    <div class="px-6 pt-6 pb-0">
      <div class="flex items-start justify-between gap-4 pb-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-text-primary">Project Alpha</h1>
            ${badge('ACTIVE', 'success')}
          </div>
          <p class="text-sm text-text-secondary mt-0.5">Started Jan 2026 · 5 members</p>
        </div>
        <div class="flex items-center gap-2">
          ${actionBtn('Settings', 'outline', 'fa-solid fa-gear')}
        </div>
      </div>
      <div role="tablist" class="flex -mb-px">
        ${tab('Overview', true)}${tab('Tasks')}${tab('Members')}${tab('Settings')}
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/DetailHeader', {
  title:    'Project Alpha',
  subtitle: 'Started Jan 2026 · 5 members',
  status:   'ACTIVE',
  statusVariant: 'success',
  tabs: [
    { value: 'overview', label: 'Overview' },
    { value: 'tasks',    label: 'Tasks'    },
    { value: 'members',  label: 'Members'  },
    { value: 'settings', label: 'Settings' },
  ],
  activeTab: req.query.tab || 'overview',
  actionsContent: \`<%- include('modules/ui/Button', { variant: 'outline', iconLeft: '<i class="fa-solid fa-gear"></i>', children: 'Settings' }) %>\`
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── ErrorState ────────────────────────────────────────────────────────────
    {
      id: 'error-state',
      title: 'ErrorState',
      category: 'App',
      abbr: 'Er',
      description: 'Error state pairing an inline alert banner with a centered empty state. Optional retry action.',
      filePath: 'modules/app/ErrorState.ejs',
      sourceCode: errorStateSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 w-full max-w-lg">
  <div class="space-y-4">
    <div role="alert" class="flex items-start gap-3 rounded-lg border p-4 bg-error-subtle border-error">
      <i class="fa-solid fa-triangle-exclamation mt-0.5 shrink-0 text-error"></i>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-text-primary">Something went wrong</p>
        <p class="text-sm text-text-secondary mt-0.5">Failed to load user data. Please check your connection.</p>
      </div>
    </div>
    <div class="flex flex-col items-center py-8 text-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-error-subtle mb-4">
        <i class="fa-solid fa-triangle-exclamation text-error text-lg"></i>
      </div>
      <p class="text-sm font-medium text-text-primary">Unable to load data</p>
      <p class="text-sm text-text-secondary mt-1">There was a problem loading this content.</p>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/ErrorState', {
  message: 'Failed to load user data. Please check your connection.'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With retry link',
          previewHtml: `<div class="p-4 w-full max-w-lg">
  <div class="space-y-4">
    <div role="alert" class="flex items-start gap-3 rounded-lg border p-4 bg-error-subtle border-error">
      <i class="fa-solid fa-triangle-exclamation mt-0.5 shrink-0 text-error"></i>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-text-primary">Database connection failed</p>
        <p class="text-sm text-text-secondary mt-0.5">Could not connect to the database. Please try again.</p>
      </div>
      <a href="#" class="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium">
        <i class="fa-solid fa-rotate-right text-xs"></i>Try again
      </a>
    </div>
    <div class="flex flex-col items-center py-8 text-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-error-subtle mb-4">
        <i class="fa-solid fa-triangle-exclamation text-error text-lg"></i>
      </div>
      <p class="text-sm font-medium text-text-primary">Unable to load data</p>
      <a href="#" class="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium">
        <i class="fa-solid fa-rotate-right text-xs"></i>Try again
      </a>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/ErrorState', {
  title:      'Database connection failed',
  message:    'Could not connect to the database. Please try again.',
  retryHref:  req.originalUrl,
  retryLabel: 'Try again'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── NotFoundState ─────────────────────────────────────────────────────────
    {
      id: 'not-found-state',
      title: 'NotFoundState',
      category: 'App',
      abbr: 'Ns',
      description: 'Not-found / empty record state with optional go-back action.',
      filePath: 'modules/app/NotFoundState.ejs',
      sourceCode: notFoundSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 w-full">
  <div class="flex flex-col items-center py-12 px-4 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken mb-4">
      <i class="fa-solid fa-magnifying-glass text-text-secondary text-lg"></i>
    </div>
    <h2 class="text-base font-semibold text-text-primary">Page not found</h2>
    <p class="text-sm text-text-secondary mt-2 max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
  </div>
</div>`,
          code: `<%- include('modules/app/NotFoundState') %>`,
          layout: 'stack',
        },
        {
          title: 'With back link',
          previewHtml: `<div class="p-4 w-full">
  <div class="flex flex-col items-center py-12 px-4 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken mb-4">
      <i class="fa-solid fa-magnifying-glass text-text-secondary text-lg"></i>
    </div>
    <h2 class="text-base font-semibold text-text-primary">User not found</h2>
    <p class="text-sm text-text-secondary mt-2 max-w-xs">This user account doesn't exist or may have been deleted.</p>
    <a href="#" class="mt-5 inline-flex items-center gap-1.5 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium">
      <i class="fa-solid fa-arrow-left text-xs"></i>Back to users
    </a>
  </div>
</div>`,
          code: `<%- include('modules/app/NotFoundState', {
  title:       'User not found',
  description: 'This user account doesn\'t exist or may have been deleted.',
  backHref:    '/users',
  backLabel:   'Back to users'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── LoadingState ──────────────────────────────────────────────────────────
    {
      id: 'loading-state',
      title: 'LoadingState',
      category: 'App',
      abbr: 'Lo',
      description: 'Skeleton loading animations. Variants: spinner / table / cards / list / detail / form.',
      filePath: 'modules/app/LoadingState.ejs',
      sourceCode: loadingStateSource,
      variants: [
        {
          title: 'Spinner',
          previewHtml: `<div class="p-4 w-full flex items-center justify-center py-16">
  <div class="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin"></div>
</div>`,
          code: `<%- include('modules/app/LoadingState', { variant: 'spinner' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Table skeleton',
          previewHtml: `<div class="p-4 w-full">
  <div class="w-full overflow-x-auto rounded-lg border border-border">
    <table class="w-full text-sm">
      <thead class="bg-surface-sunken border-b border-border">
        <tr>${['', '', '', ''].map(() => `<th class="px-4 py-3"><div class="h-3 rounded bg-border animate-pulse w-16"></div></th>`).join('')}</tr>
      </thead>
      <tbody class="divide-y divide-border bg-surface-base">
        ${[80, 55, 70, 45, 65].map(w => `<tr>${['', '', '', ''].map((_, ci) => `<td class="px-4 py-3"><div class="h-3.5 rounded bg-surface-sunken animate-pulse" style="width:${w - ci * 8}%"></div></td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`,
          code: `<%- include('modules/app/LoadingState', { variant: 'table', rows: 5, cols: 4 }) %>`,
          layout: 'stack',
        },
        {
          title: 'Cards skeleton',
          previewHtml: `<div class="p-4 w-full">
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-3">
    ${[1, 2, 3].map(() => `<div class="rounded-xl border border-border bg-surface-raised p-5 space-y-3 animate-pulse">
      <div class="h-4 rounded bg-surface-sunken w-1/2"></div>
      <div class="h-3 rounded bg-surface-sunken w-3/4"></div>
      <div class="h-3 rounded bg-surface-sunken w-2/3"></div>
      <div class="h-8 rounded-md bg-surface-sunken w-1/3 mt-2"></div>
    </div>`).join('')}
  </div>
</div>`,
          code: `<%- include('modules/app/LoadingState', { variant: 'cards', cards: 3 }) %>`,
          layout: 'stack',
        },
        {
          title: 'List skeleton',
          previewHtml: `<div class="p-4 w-full max-w-lg">
  <ul class="divide-y divide-border">
    ${[1, 2, 3, 4].map(() => `<li class="flex items-center gap-3 py-3 px-4 animate-pulse">
      <div class="h-8 w-8 rounded-full bg-surface-sunken shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3.5 rounded bg-surface-sunken w-1/3"></div>
        <div class="h-3 rounded bg-surface-sunken w-2/3"></div>
      </div>
      <div class="h-4 w-12 rounded bg-surface-sunken"></div>
    </li>`).join('')}
  </ul>
</div>`,
          code: `<%- include('modules/app/LoadingState', { variant: 'list', rows: 4 }) %>`,
          layout: 'stack',
        },
        {
          title: 'Form skeleton',
          previewHtml: `<div class="p-4 w-full max-w-md">
  <div class="space-y-5">
    ${[1, 2, 3].map(() => `<div class="space-y-2 animate-pulse">
      <div class="h-3 rounded bg-surface-sunken w-1/4"></div>
      <div class="h-9 rounded-md bg-surface-sunken w-full"></div>
    </div>`).join('')}
    <div class="flex justify-end gap-2 pt-2 animate-pulse">
      <div class="h-9 w-20 rounded-md bg-surface-sunken"></div>
      <div class="h-9 w-24 rounded-md bg-surface-sunken"></div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/LoadingState', { variant: 'form', rows: 3 }) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── SplashScreen ──────────────────────────────────────────────────────────
    {
      id: 'splash-screen',
      title: 'SplashScreen',
      category: 'App',
      abbr: 'Ss',
      description: 'Full-screen overlay shown during app initialisation. Accepts a logo slot, optional progress bar, and fades out when visible=false.',
      filePath: 'modules/app/SplashScreen.ejs',
      sourceCode: splashSource,
      variants: [
        {
          title: 'Logo + progress + message',
          previewHtml: `<div class="p-4 w-full">
  <div class="relative flex flex-col items-center justify-center gap-6 bg-surface-base rounded-xl border border-border py-16 px-8">
    <div class="flex items-center justify-center">
      <span class="text-4xl font-black text-primary">Acme</span>
    </div>
    <span aria-hidden="true" class="inline-block rounded-full border-border border-t-primary animate-spin h-8 w-8 border-[3px]"></span>
    <span class="sr-only">Loading…</span>
    <div class="w-48 h-1 rounded-full bg-surface-sunken overflow-hidden">
      <div class="h-full rounded-full bg-primary transition-all duration-300 ease-out" style="width:65%"></div>
    </div>
    <p class="text-sm text-text-secondary animate-pulse">Loading your workspace…</p>
  </div>
</div>`,
          code: `<%- include('modules/app/SplashScreen', {
  logoContent: '<span class="text-4xl font-black text-primary">Acme</span>',
  message:  'Loading your workspace…',
  progress: loadProgress
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Spinner only',
          previewHtml: `<div class="p-4 w-full">
  <div class="relative flex flex-col items-center justify-center bg-surface-base rounded-xl border border-border py-16">
    <span aria-hidden="true" class="inline-block rounded-full border-border border-t-primary animate-spin h-12 w-12 border-4"></span>
    <span class="sr-only">Loading…</span>
  </div>
</div>`,
          code: `<%- include('modules/app/SplashScreen') %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
