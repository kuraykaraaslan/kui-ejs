import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const userMenuSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserMenu.ejs'), 'utf-8');
const globalSearchSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/GlobalSearch.ejs'), 'utf-8');
const commandBarSource   = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppCommandBar.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resultItem = (label: string, description: string, icon: string, highlighted = false) =>
  `<a href="#" class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${highlighted ? 'bg-primary-subtle text-primary' : 'hover:bg-surface-overlay text-text-primary'}">
    <i class="${icon} shrink-0 text-text-disabled text-sm" aria-hidden="true"></i>
    <div class="min-w-0">
      <p class="text-sm font-medium truncate">${label}</p>
      <p class="text-xs text-text-secondary truncate">${description}</p>
    </div>
  </a>`;

const cmdItem = (icon: string, label: string, shortcut?: string, active = false) =>
  `<a href="#" role="option" class="cmd-item flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? 'bg-surface-overlay' : 'hover:bg-surface-overlay'} text-text-primary">
    <i class="${icon} w-4 text-center text-text-disabled shrink-0 text-xs" aria-hidden="true"></i>
    <span class="flex-1 truncate">${label}</span>
    ${shortcut ? `<span class="flex items-center gap-0.5 shrink-0">${shortcut.split(' ').map(k => `<kbd class="rounded border border-border bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">${k}</kbd>`).join('')}</span>` : ''}
  </a>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppUserData(): ShowcaseItem[] {
  return [
    // ── UserMenu ──────────────────────────────────────────────────────────────
    {
      id: 'user-menu',
      title: 'UserMenu',
      category: 'App',
      abbr: 'Um',
      description: 'User dropdown opened by a trigger showing avatar, name and role. Accepts a SafeUser prop; the dropdown header shows the name and email.',
      filePath: 'modules/domain/common/user/UserMenu.ejs',
      sourceCode: userMenuSource,
      variants: [
        {
          title: 'Varsayılan (isim + e-posta + rol)',
          previewHtml: `<div class="flex items-center justify-center p-8" style="padding-bottom:220px">
  <div class="relative inline-block">
    <button type="button"
      class="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary text-sm flex items-center justify-center font-bold shrink-0">JD</span>
      <div class="hidden sm:block text-left min-w-0">
        <p class="text-sm font-medium text-text-primary truncate max-w-[8rem]">Jane Doe</p>
        <p class="text-xs text-text-secondary truncate">Admin</p>
      </div>
      <i class="fa-solid fa-chevron-down w-3 h-3 text-text-disabled hidden sm:block text-xs" aria-hidden="true"></i>
    </button>
    <div class="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-surface-raised shadow-lg z-50 overflow-hidden">
      <div class="px-3 py-2.5 border-b border-border">
        <p class="text-sm font-semibold text-text-primary truncate">Jane Doe</p>
        <p class="text-xs text-text-secondary truncate">jane@acme.com</p>
      </div>
      <div class="py-1">
        <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors">
          <i class="fa-solid fa-user w-3.5 h-3.5 text-text-secondary text-xs shrink-0" aria-hidden="true"></i>Profile
        </a>
        <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors">
          <i class="fa-solid fa-gear w-3.5 h-3.5 text-text-secondary text-xs shrink-0" aria-hidden="true"></i>Settings
        </a>
      </div>
      <div class="py-1 border-t border-border">
        <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-subtle transition-colors">
          <i class="fa-solid fa-arrow-right-from-bracket w-3.5 h-3.5 shrink-0 text-xs" aria-hidden="true"></i>Sign out
        </a>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/user/UserMenu', {
  name: user.name,
  email: user.email,
  role: user.role,
  profileHref: '/profile',
  settingsHref: '/settings',
  signOutHref: '/auth/logout'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'POST sign-out (form submit)',
          previewHtml: `<div class="flex items-center justify-center p-8" style="padding-bottom:180px">
  <div class="relative inline-block">
    <button type="button"
      class="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-surface-overlay">
      <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary text-sm flex items-center justify-center font-bold shrink-0">JS</span>
      <div class="hidden sm:block text-left min-w-0">
        <p class="text-sm font-medium text-text-primary truncate max-w-[8rem]">John Smith</p>
        <p class="text-xs text-text-secondary truncate">Author</p>
      </div>
      <i class="fa-solid fa-chevron-down w-3 h-3 text-text-disabled hidden sm:block text-xs" aria-hidden="true"></i>
    </button>
    <div class="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-surface-raised shadow-lg z-50 overflow-hidden">
      <div class="px-3 py-2.5 border-b border-border">
        <p class="text-sm font-semibold text-text-primary truncate">John Smith</p>
        <p class="text-xs text-text-secondary truncate">john@acme.com</p>
      </div>
      <div class="py-1">
        <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors">
          <i class="fa-solid fa-user w-3.5 h-3.5 text-text-secondary text-xs shrink-0"></i>Profile
        </a>
      </div>
      <div class="py-1 border-t border-border">
        <form class="w-full">
          <button type="submit" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-subtle transition-colors text-left">
            <i class="fa-solid fa-arrow-right-from-bracket w-3.5 h-3.5 shrink-0 text-xs"></i>Sign out
          </button>
        </form>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/user/UserMenu', {
  name: user.name,
  email: user.email,
  role: user.role,
  signOutHref: '/auth/logout',
  signOutMethod: 'post'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── GlobalSearch ──────────────────────────────────────────────────────────
    {
      id: 'global-search',
      title: 'GlobalSearch',
      category: 'App',
      abbr: 'Gs',
      description: 'Command-palette-style global search field. Supports a categorised result list, keyboard navigation and result selection.',
      filePath: 'modules/app/GlobalSearch.ejs',
      sourceCode: globalSearchSource,
      variants: [
        {
          title: 'Sonuçlarla (with results)',
          previewHtml: `<div class="p-4 w-full max-w-md" style="padding-bottom:200px">
  <div class="relative w-full">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-sm pointer-events-none"></i>
      <input type="search" value="dash" placeholder="Search…" class="block w-full rounded-md border border-primary bg-surface text-text-primary pl-9 pr-4 py-2 text-sm ring-2 ring-primary/20">
    </div>
    <div class="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-lg border border-border bg-surface-raised shadow-xl overflow-hidden">
      <p class="px-3 pt-2 pb-1 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Pages</p>
      ${resultItem('Dashboard', 'Main overview', 'fa-solid fa-house', true)}
      ${resultItem('Analytics Dashboard', 'Charts & metrics', 'fa-solid fa-chart-bar')}
      <p class="px-3 pt-2 pb-1 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Settings</p>
      ${resultItem('Dashboard Settings', 'Customize your view', 'fa-solid fa-gear')}
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/GlobalSearch', {
  placeholder: 'Search…',
  query: req.query.q || '',
  results: searchResults,
  action: '/search'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Loading state',
          previewHtml: `<div class="p-4 w-full max-w-md" style="padding-bottom:100px">
  <div class="relative w-full">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-sm pointer-events-none"></i>
      <input type="search" value="user re" placeholder="Search…" class="block w-full rounded-md border border-primary bg-surface text-text-primary pl-9 pr-4 py-2 text-sm ring-2 ring-primary/20">
    </div>
    <div class="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-lg border border-border bg-surface-raised shadow-xl overflow-hidden">
      <div class="px-4 py-6 text-center text-sm text-text-secondary animate-pulse">Searching…</div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/GlobalSearch', {
  placeholder: 'Search…',
  query: req.query.q,
  loading: true
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── AppCommandBar ─────────────────────────────────────────────────────────
    {
      id: 'app-command-bar',
      title: 'AppCommandBar',
      category: 'App',
      abbr: 'Cb',
      description: 'Keyboard-first command palette. Opens with ⌘K; an items prop accepts custom commands while a default navigation/actions/recent set is included.',
      filePath: 'modules/app/AppCommandBar.ejs',
      sourceCode: commandBarSource,
      variants: [
        {
          title: 'Varsayılan komutlar (açık panel)',
          previewHtml: `<div class="p-4 w-full max-w-lg" style="padding-bottom:340px">
  <div class="relative mx-auto w-full max-w-lg rounded-xl border border-border bg-surface-raised shadow-2xl overflow-hidden">
    <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
      <i class="fa-solid fa-magnifying-glass text-text-disabled shrink-0 text-sm"></i>
      <input type="search" placeholder="Type a command or search…" value=""
        class="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none">
      <span class="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">Esc</span>
    </div>
    <div class="max-h-72 overflow-y-auto py-2">
      <p class="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-disabled">Navigation</p>
      ${cmdItem('fa-solid fa-house', 'Dashboard', 'G D', true)}
      ${cmdItem('fa-solid fa-users', 'Users', 'G U')}
      ${cmdItem('fa-solid fa-chart-bar', 'Analytics', 'G A')}
      <p class="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-disabled">Actions</p>
      ${cmdItem('fa-solid fa-plus', 'New Project', 'C N')}
      ${cmdItem('fa-solid fa-file-export', 'Export Data', 'C E')}
    </div>
    <div class="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-text-disabled">
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> Navigate</span>
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↵</kbd> Select</span>
      <span><kbd class="rounded border border-border px-1 py-0.5 font-mono text-[9px]">Esc</kbd> Close</span>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/AppCommandBar') %>`,
          layout: 'stack',
        },
        {
          title: 'Özel items + trigger butonu',
          previewHtml: `<div class="flex items-center justify-center p-6">
  <button type="button"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface-raised text-text-secondary text-sm hover:bg-surface-overlay transition-colors">
    <i class="fa-solid fa-magnifying-glass text-xs"></i>
    <span class="hidden sm:inline text-sm text-text-disabled">Search commands…</span>
    <kbd class="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-text-secondary ml-1">
      <span>Ctrl</span><span>K</span>
    </kbd>
  </button>
</div>`,
          code: `<%- include('modules/app/AppCommandBar', {
  placeholder: 'Search commands…',
  items: [
    { icon: 'fa-solid fa-basket-shopping', label: 'View Orders',   shortcut: 'G O', category: 'Navigation', href: '/orders' },
    { icon: 'fa-solid fa-box',             label: 'Inventory',     shortcut: 'G I', category: 'Navigation', href: '/inventory' },
    { icon: 'fa-solid fa-tag',             label: 'New Sale',      shortcut: 'C N', category: 'Actions' },
    { icon: 'fa-solid fa-file-export',     label: 'Export Report', shortcut: 'C E', category: 'Actions' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Order #1042',      category: 'Recent', href: '/orders/1042' },
    { icon: 'fa-solid fa-clock-rotate-left', label: 'Customer: Acme Co', category: 'Recent', href: '/customers/acme' },
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
