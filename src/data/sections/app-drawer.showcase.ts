import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppDrawer.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const navItem = (label: string, iconCls: string, active = false, badge?: number) =>
  `<button type="button" class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${active ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-overlay'}">
    <span class="flex items-center gap-2">
      <span aria-hidden="true"><i class="fa-solid ${iconCls}" style="width:0.875rem;height:0.875rem"></i></span>
      ${label}
    </span>
    ${badge != null ? `<span class="inline-flex items-center justify-center rounded-md bg-surface-overlay text-text-secondary text-xs font-medium px-1.5 py-0.5">${badge}</span>` : ''}
  </button>`;

const drawerFrame = (side: 'left' | 'right', searchable: boolean, body: string) => {
  const panelSide = side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r';
  return `<div class="p-4 w-full">
  <div class="relative w-full max-w-3xl mx-auto h-[420px] rounded-xl border border-border overflow-hidden bg-black/40">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="relative flex h-full">
      <div class="${panelSide} flex flex-col w-80 max-w-full h-full bg-surface-raised shadow-xl">
        <div class="flex items-center justify-between gap-3 px-4 py-4 border-b border-border shrink-0">
          <h2 class="text-base font-semibold text-text-primary">Navigation</h2>
          <button type="button" aria-label="Close drawer" class="text-text-disabled hover:text-text-primary">
            <i class="fa-solid fa-xmark" style="width:1rem;height:1rem" aria-hidden="true"></i>
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          ${searchable ? `<div class="relative flex items-center mb-4">
            <span aria-hidden="true" class="absolute left-3 text-text-disabled pointer-events-none">
              <i class="fa-solid fa-magnifying-glass" style="width:0.875rem;height:0.875rem"></i>
            </span>
            <input type="text" placeholder="Search navigation…"
              class="block w-full rounded-md border border-border bg-surface-base px-3 py-2 pl-8 text-sm text-text-primary placeholder:text-text-disabled" />
          </div>` : ''}
          ${body}
        </div>
      </div>
    </div>
  </div>
</div>`;
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppDrawerData(): ShowcaseItem[] {
  return [
    {
      id: 'app-drawer',
      title: 'AppDrawer',
      category: 'App',
      abbr: 'AD',
      description: 'Sayfa kenarından açılan modal navigasyon panel: tetik butonu, arka plan, kapanış, focus trap, Escape ile kapanma. `navGroups` ile gruplanmış öğeler, opsiyonel arama kutusu (filterAppDrawer) ve `appdrawer:select` custom event.',
      filePath: 'modules/app/AppDrawer.ejs',
      sourceCode,
      variants: [
        {
          title: 'Left side with search + groups',
          previewHtml: drawerFrame('left', true, `<div class="space-y-4">
            <div>
              <p class="text-xs font-semibold text-text-disabled uppercase tracking-wider mb-1 px-1">Main</p>
              <div class="space-y-0.5">
                ${navItem('Dashboard', 'fa-gauge', true)}
                ${navItem('Projects', 'fa-folder', false, 4)}
                ${navItem('Tasks', 'fa-list-check', false, 12)}
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-text-disabled uppercase tracking-wider mb-1 px-1">Account</p>
              <div class="space-y-0.5">
                ${navItem('Settings', 'fa-gear')}
                ${navItem('Sign out', 'fa-right-from-bracket')}
              </div>
            </div>
          </div>`),
          code: `<%- include('modules/app/AppDrawer', {
  id:       'main-nav',
  title:    'Navigation',
  side:     'left',
  activeId: 'dashboard',
  navGroups: [
    { label: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', iconClass: 'fa-gauge' },
      { id: 'projects',  label: 'Projects',  iconClass: 'fa-folder',     badge: 4  },
      { id: 'tasks',     label: 'Tasks',     iconClass: 'fa-list-check', badge: 12 }
    ]},
    { label: 'Account', items: [
      { id: 'settings', label: 'Settings',  iconClass: 'fa-gear' },
      { id: 'signout',  label: 'Sign out',  iconClass: 'fa-right-from-bracket' }
    ]}
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Right side, no search',
          previewHtml: drawerFrame('right', false, `<div class="space-y-0.5">
            ${navItem('Profile', 'fa-user')}
            ${navItem('Billing', 'fa-credit-card')}
            ${navItem('API keys', 'fa-key')}
            ${navItem('Team', 'fa-users')}
          </div>`),
          code: `<%- include('modules/app/AppDrawer', {
  id:         'account-drawer',
  title:      'Account',
  side:       'right',
  searchable: false,
  navItems: [
    { id: 'profile', label: 'Profile', iconClass: 'fa-user' },
    { id: 'billing', label: 'Billing', iconClass: 'fa-credit-card' },
    { id: 'keys',    label: 'API keys', iconClass: 'fa-key' },
    { id: 'team',    label: 'Team',    iconClass: 'fa-users' }
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
