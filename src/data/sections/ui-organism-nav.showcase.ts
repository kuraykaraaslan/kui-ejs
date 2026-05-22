import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const paginationSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Pagination.ejs'), 'utf-8');
const breadcrumbSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Breadcrumb.ejs'), 'utf-8');
const tabGroupSource   = fs.readFileSync(path.join(process.cwd(), 'modules/ui/TabGroup.ejs'), 'utf-8');
const stepperSource    = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Stepper.ejs'), 'utf-8');

// ─── Pagination ───────────────────────────────────────────────────────────────

function paginationEl(opts: {
  page: number;
  totalPages: number;
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
}) {
  const sizeMap: Record<string, { page: string; nav: string }> = {
    sm: { page: 'w-7 h-7 text-xs',      nav: 'px-2 py-1 text-xs' },
    md: { page: 'w-9 h-9 text-sm',      nav: 'px-3 py-1.5 text-sm' },
    lg: { page: 'w-10 h-10 text-base',  nav: 'px-4 py-2 text-base' },
  };
  const s = sizeMap[opts.size || 'md'];
  const navBase = `rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${s.nav}`;
  const enabled  = 'border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary';
  const disabled = 'border-border text-text-disabled cursor-not-allowed opacity-50';

  const allPages: number[] = [];
  for (let i = 1; i <= opts.totalPages; i++) allPages.push(i);
  const visible = allPages.filter(p => p === 1 || p === opts.totalPages || Math.abs(p - opts.page) <= 1);
  const withEllipsis: (number | 'ellipsis')[] = [];
  let prev: number | null = null;
  for (const vp of visible) {
    if (prev !== null && vp - prev > 1) withEllipsis.push('ellipsis');
    withEllipsis.push(vp);
    prev = vp;
  }

  const items = withEllipsis.map(item => {
    if (item === 'ellipsis') return `<span class="text-text-disabled ${s.nav}">…</span>`;
    const isActive = item === opts.page;
    return `<button type="button" aria-label="Page ${item}"${isActive ? ' aria-current="page"' : ''} class="rounded-md font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus flex items-center justify-center ${s.page} ${isActive ? 'bg-primary text-primary-fg border-primary' : 'border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary'}">${item}</button>`;
  }).join('\n  ');

  const first = opts.showFirstLast
    ? `<button type="button"${opts.page <= 1 ? ' disabled' : ''} aria-label="First page" class="${navBase} ${opts.page <= 1 ? disabled : enabled}">«</button>\n  ` : '';
  const last = opts.showFirstLast
    ? `\n  <button type="button"${opts.page >= opts.totalPages ? ' disabled' : ''} aria-label="Last page" class="${navBase} ${opts.page >= opts.totalPages ? disabled : enabled}">»</button>` : '';

  return `<nav aria-label="Pagination" class="flex items-center gap-1 flex-wrap">
  ${first}<button type="button"${opts.page <= 1 ? ' disabled' : ''} aria-label="Previous page" class="${navBase} ${opts.page <= 1 ? disabled : enabled}">‹</button>
  ${items}
  <button type="button"${opts.page >= opts.totalPages ? ' disabled' : ''} aria-label="Next page" class="${navBase} ${opts.page >= opts.totalPages ? disabled : enabled}">›</button>${last}
</nav>`;
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function breadcrumbEl(items: { label: string; href?: string }[]) {
  const lis = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const sep = !isLast ? `<i class="fa-solid fa-chevron-right text-xs text-text-disabled" aria-hidden="true"></i>` : '';
    const content = !isLast && item.href
      ? `<a href="${item.href}" class="text-text-secondary hover:text-text-primary transition-colors rounded">${item.label}</a>${sep}`
      : `<span class="${isLast ? 'text-text-primary font-medium' : 'text-text-secondary'}"${isLast ? ' aria-current="page"' : ''}>${item.label}</span>${sep}`;
    return `<li class="flex items-center gap-1">${content}</li>`;
  }).join('\n    ');
  return `<nav aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center gap-1 text-sm">
    ${lis}
  </ol>
</nav>`;
}

// ─── TabGroup ─────────────────────────────────────────────────────────────────

function tabGroupEl(opts: {
  tabs: { id: string; label: string; icon?: string; content: string; disabled?: boolean }[];
  activeTab?: string;
  id?: string;
}) {
  const active = opts.activeTab || opts.tabs[0]?.id || '';
  const gid = opts.id || 'tg-preview';

  const tabBtns = opts.tabs.map(tab => {
    const isActive = tab.id === active;
    const cls = tab.disabled
      ? 'opacity-40 cursor-not-allowed pointer-events-none border-transparent text-text-secondary'
      : isActive ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border';
    const icon = tab.icon ? `<i class="fa-solid ${tab.icon} text-sm" aria-hidden="true"></i>` : '';
    return `<button type="button" role="tab" id="${gid}-tab-${tab.id}" aria-selected="${isActive}" aria-controls="${gid}-panel-${tab.id}" tabindex="${isActive ? 0 : -1}" class="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${cls}">${icon}${tab.label}</button>`;
  }).join('\n    ');

  const panels = opts.tabs.map(tab => {
    const isActive = tab.id === active;
    return `<div id="${gid}-panel-${tab.id}" role="tabpanel" aria-labelledby="${gid}-tab-${tab.id}" tabindex="0" ${isActive ? '' : 'hidden '}class="py-4 focus-visible:outline-none">${tab.content}</div>`;
  }).join('\n  ');

  return `<div id="${gid}" class="w-full">
  <div role="tablist" class="flex border-b border-border">
    ${tabBtns}
  </div>
  ${panels}
</div>`;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

type StepState = 'complete' | 'active' | 'error' | 'pending';
interface StepItem { label: string; description?: string; state?: StepState }

function stepperEl(opts: { steps: StepItem[]; orientation?: 'horizontal' | 'vertical' }) {
  const stateStyles: Record<StepState, { circle: string; text: string; line: string }> = {
    complete: { circle: 'bg-success text-text-inverse border-success',      text: 'text-text-primary',           line: 'bg-success' },
    active:   { circle: 'bg-primary text-primary-fg border-primary',        text: 'text-text-primary font-semibold', line: 'bg-border' },
    error:    { circle: 'bg-error text-text-inverse border-error',          text: 'text-error',                  line: 'bg-border' },
    pending:  { circle: 'bg-surface-base text-text-disabled border-border', text: 'text-text-disabled',          line: 'bg-border' },
  };

  function icon(state: StepState, idx: number) {
    if (state === 'complete') return `<i class="fa-solid fa-check text-xs" aria-hidden="true"></i>`;
    if (state === 'error')    return `<i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>`;
    return String(idx + 1);
  }

  if (opts.orientation === 'vertical') {
    const lis = opts.steps.map((step, i) => {
      const state = (step.state || 'pending') as StepState;
      const s = stateStyles[state];
      const isLast = i === opts.steps.length - 1;
      const line = !isLast ? `<div class="w-0.5 flex-1 min-h-8 mt-1 ${s.line}"></div>` : '';
      const desc = step.description ? `<p class="text-xs text-text-secondary mt-0.5">${step.description}</p>` : '';
      return `<li class="flex gap-3 items-start">
    <div class="flex flex-col items-center shrink-0">
      <div class="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${s.circle}">${icon(state, i)}</div>
      ${line}
    </div>
    <div class="${isLast ? 'pb-0' : 'pb-6'}"><p class="text-sm ${s.text}">${step.label}</p>${desc}</div>
  </li>`;
    }).join('\n  ');
    return `<ol class="flex flex-col gap-0">\n  ${lis}\n</ol>`;
  }

  const lis = opts.steps.map((step, i) => {
    const state = (step.state || 'pending') as StepState;
    const s = stateStyles[state];
    const isLast = i === opts.steps.length - 1;
    const line = !isLast ? `<div class="h-0.5 flex-1 mx-2 mt-[-1.25rem] ${s.line}"></div>` : '';
    const desc = step.description ? `<p class="text-xs text-text-secondary">${step.description}</p>` : '';
    return `<li class="flex items-center${!isLast ? ' flex-1' : ''}">
    <div class="flex flex-col items-center gap-1 shrink-0">
      <div class="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${s.circle}">${icon(state, i)}</div>
      <div class="text-center"><p class="text-xs whitespace-nowrap ${s.text}">${step.label}</p>${desc}</div>
    </div>
    ${line}
  </li>`;
  }).join('\n  ');
  return `<ol class="flex items-center w-full">\n  ${lis}\n</ol>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

const wrapFull  = (inner: string) => `<div class="p-4 w-full">${inner}</div>`;
const wrapCentered = (inner: string) => `<div class="p-4 w-full flex justify-center">${inner}</div>`;

export function buildOrganismNavData(): ShowcaseItem[] {
  return [
    // ── Pagination ────────────────────────────────────────────────────────────
    {
      id: 'pagination',
      title: 'Pagination',
      category: 'Organism',
      abbr: 'Pg',
      description: 'Page navigation control. Collapses large page counts with ellipsis; accessible via aria-label and aria-current="page".',
      filePath: 'modules/ui/Pagination.ejs',
      sourceCode: paginationSource,
      variants: [
        {
          title: 'Default (page 3 of 10)',
          previewHtml: wrapCentered(paginationEl({ page: 3, totalPages: 10 })),
          code: `<%- include('modules/ui/Pagination', {
  page: 3,
  totalPages: 10
}) %>`,
        },
        {
          title: 'With first/last buttons',
          previewHtml: wrapCentered(paginationEl({ page: 5, totalPages: 12, showFirstLast: true })),
          code: `<%- include('modules/ui/Pagination', {
  page: 5,
  totalPages: 12,
  showFirstLast: true
}) %>`,
        },
        {
          title: 'First page (prev disabled)',
          previewHtml: wrapCentered(paginationEl({ page: 1, totalPages: 8 })),
          code: `<%- include('modules/ui/Pagination', {
  page: 1,
  totalPages: 8
}) %>`,
        },
        {
          title: 'Small size',
          previewHtml: wrapCentered(paginationEl({ page: 2, totalPages: 6, size: 'sm' })),
          code: `<%- include('modules/ui/Pagination', {
  page: 2,
  totalPages: 6,
  size: 'sm'
}) %>`,
        },
        {
          title: 'Large size',
          previewHtml: wrapCentered(paginationEl({ page: 4, totalPages: 7, size: 'lg' })),
          code: `<%- include('modules/ui/Pagination', {
  page: 4,
  totalPages: 7,
  size: 'lg'
}) %>`,
        },
      ],
    },

    // ── TabGroup ──────────────────────────────────────────────────────────────
    {
      id: 'tab-group',
      title: 'TabGroup',
      category: 'Organism',
      abbr: 'Tb',
      description: 'Accessible tab navigation following the role="tablist" / role="tab" / role="tabpanel" ARIA pattern. Arrow-key navigation; tabIndex=-1 on inactive tabs.',
      filePath: 'modules/ui/TabGroup.ejs',
      sourceCode: tabGroupSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapFull(tabGroupEl({
            id: 'tg-default',
            tabs: [
              { id: 'overview', label: 'Overview',  content: '<p class="text-sm text-text-secondary">Overview panel content.</p>' },
              { id: 'details',  label: 'Details',   content: '<p class="text-sm text-text-secondary">Details panel content.</p>' },
              { id: 'history',  label: 'History',   content: '<p class="text-sm text-text-secondary">History panel content.</p>' },
            ],
          })),
          code: `<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'overview', label: 'Overview', content: '<p>Overview panel content.</p>' },
    { id: 'details',  label: 'Details',  content: '<p>Details panel content.</p>' },
    { id: 'history',  label: 'History',  content: '<p>History panel content.</p>' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With icons',
          previewHtml: wrapFull(tabGroupEl({
            id: 'tg-icons',
            tabs: [
              { id: 'home',     label: 'Home',     icon: 'fa-house',     content: '<p class="text-sm text-text-secondary">Home content.</p>' },
              { id: 'users',    label: 'Users',    icon: 'fa-users',     content: '<p class="text-sm text-text-secondary">Users content.</p>' },
              { id: 'settings', label: 'Settings', icon: 'fa-gear',      content: '<p class="text-sm text-text-secondary">Settings content.</p>' },
            ],
          })),
          code: `<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'home',     label: 'Home',     icon: 'fa-house', content: '<p>Home content.</p>' },
    { id: 'users',    label: 'Users',    icon: 'fa-users', content: '<p>Users content.</p>' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear',  content: '<p>Settings content.</p>' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With disabled tab',
          previewHtml: wrapFull(tabGroupEl({
            id: 'tg-disabled',
            tabs: [
              { id: 'active',   label: 'Active',   content: '<p class="text-sm text-text-secondary">Active tab content.</p>' },
              { id: 'disabled', label: 'Disabled', content: '', disabled: true },
              { id: 'another',  label: 'Another',  content: '<p class="text-sm text-text-secondary">Another tab content.</p>' },
            ],
          })),
          code: `<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'active',   label: 'Active',   content: '<p>Active tab content.</p>' },
    { id: 'disabled', label: 'Disabled', content: '', disabled: true },
    { id: 'another',  label: 'Another',  content: '<p>Another tab content.</p>' },
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── Breadcrumb ────────────────────────────────────────────────────────────
    {
      id: 'breadcrumb',
      title: 'Breadcrumb',
      category: 'Organism',
      abbr: 'Bc',
      description: 'Hierarchical navigation trail wrapped in nav aria-label="Breadcrumb". Last item marked with aria-current="page" and aria-hidden separators.',
      filePath: 'modules/ui/Breadcrumb.ejs',
      sourceCode: breadcrumbSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapFull(breadcrumbEl([
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Laptop Pro 15' },
          ])),
          code: `<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',        href: '/' },
    { label: 'Products',    href: '/products' },
    { label: 'Laptop Pro 15' }
  ]
}) %>`,
        },
        {
          title: 'Single level',
          previewHtml: wrapFull(breadcrumbEl([
            { label: 'Home', href: '/' },
            { label: 'Settings' },
          ])),
          code: `<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',     href: '/' },
    { label: 'Settings' }
  ]
}) %>`,
        },
        {
          title: 'Deep hierarchy',
          previewHtml: wrapFull(breadcrumbEl([
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'Components', href: '/docs/components' },
            { label: 'UI', href: '/docs/components/ui' },
            { label: 'Button' },
          ])),
          code: `<%- include('modules/ui/Breadcrumb', {
  items: [
    { label: 'Home',       href: '/' },
    { label: 'Docs',       href: '/docs' },
    { label: 'Components', href: '/docs/components' },
    { label: 'UI',         href: '/docs/components/ui' },
    { label: 'Button' }
  ]
}) %>`,
        },
      ],
    },

    // ── Stepper ───────────────────────────────────────────────────────────────
    {
      id: 'stepper',
      title: 'Stepper',
      category: 'Organism',
      abbr: 'Sr',
      description: 'Multi-step progress indicator with complete, active, error, and pending states. Supports horizontal and vertical orientations.',
      filePath: 'modules/ui/Stepper.ejs',
      sourceCode: stepperSource,
      variants: [
        {
          title: 'Horizontal',
          previewHtml: wrapFull(stepperEl({
            steps: [
              { label: 'Account',  state: 'complete' },
              { label: 'Profile',  state: 'active' },
              { label: 'Payment',  state: 'pending' },
              { label: 'Confirm',  state: 'pending' },
            ],
          })),
          code: `<%- include('modules/ui/Stepper', {
  steps: [
    { label: 'Account', state: 'complete' },
    { label: 'Profile', state: 'active' },
    { label: 'Payment', state: 'pending' },
    { label: 'Confirm', state: 'pending' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Vertical',
          previewHtml: `<div class="p-4 w-full max-w-xs">${stepperEl({
            orientation: 'vertical',
            steps: [
              { label: 'Create account',    description: 'Enter your email and password.',  state: 'complete' },
              { label: 'Verify email',      description: 'Check your inbox.',               state: 'complete' },
              { label: 'Set up profile',    description: 'Add your name and photo.',         state: 'active' },
              { label: 'Invite your team',  description: 'Optional.',                        state: 'pending' },
            ],
          })}</div>`,
          code: `<%- include('modules/ui/Stepper', {
  orientation: 'vertical',
  steps: [
    { label: 'Create account',   description: 'Enter your email and password.', state: 'complete' },
    { label: 'Verify email',     description: 'Check your inbox.',              state: 'complete' },
    { label: 'Set up profile',   description: 'Add your name and photo.',       state: 'active' },
    { label: 'Invite your team', description: 'Optional.',                      state: 'pending' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With error state',
          previewHtml: wrapFull(stepperEl({
            steps: [
              { label: 'Upload',   state: 'complete' },
              { label: 'Validate', state: 'error' },
              { label: 'Process',  state: 'pending' },
            ],
          })),
          code: `<%- include('modules/ui/Stepper', {
  steps: [
    { label: 'Upload',   state: 'complete' },
    { label: 'Validate', state: 'error' },
    { label: 'Process',  state: 'pending' },
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
