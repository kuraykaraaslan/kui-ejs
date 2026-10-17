import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import { renderPartial } from '../render-partial';

const appShellSource   = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppShell.ejs'), 'utf-8');
const appSidebarSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppSidebar.ejs'), 'utf-8');
const appTopBarSource  = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppTopBar.ejs'), 'utf-8');

// ─── Preview helpers ──────────────────────────────────────────────────────────

const miniSidebar = (collapsed = false) => `
<aside class="flex flex-col bg-surface-raised border-r border-border ${collapsed ? 'w-10' : 'w-32'} shrink-0 transition-all">
  <div class="flex items-center ${collapsed ? 'justify-center h-9 border-b border-border' : 'h-9 px-3 border-b border-border'}">
    ${collapsed ? '<i class="fa-solid fa-grid-2 text-primary text-xs"></i>' : '<span class="text-xs font-bold text-primary">Acme</span>'}
  </div>
  <div class="flex items-center ${collapsed ? 'justify-center' : 'justify-end'} px-1.5 py-1.5 border-b border-border">
    <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay" aria-label="${collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">
      <i class="fa-solid fa-chevron-left${collapsed ? ' rotate-180' : ''} text-[10px]"></i>
    </button>
  </div>
  ${collapsed ? '' : `<div class="px-2 py-1.5 border-b border-border">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-2 top-1/2 -translate-y-1/2 text-text-disabled text-[10px]"></i>
      <div class="w-full rounded border border-border bg-surface-base pl-5 pr-2 py-1 text-[9px] text-text-disabled">Search…</div>
    </div>
  </div>`}
  <nav class="flex-1 px-1.5 py-2 space-y-0.5 text-xs">
    <a href="#" class="flex items-center ${collapsed ? 'justify-center py-1.5 rounded hover:bg-surface-overlay' : 'gap-1.5 px-2 py-1.5 rounded bg-primary-subtle text-primary font-medium'}">
      <i class="fa-solid fa-house text-[10px]"></i>${collapsed ? '' : '<span>Dashboard</span>'}
    </a>
    <a href="#" class="flex items-center ${collapsed ? 'justify-center py-1.5 rounded text-text-disabled hover:bg-surface-overlay' : 'gap-1.5 px-2 py-1.5 rounded text-text-secondary hover:bg-surface-overlay'}">
      <i class="fa-solid fa-chart-bar text-[10px]"></i>${collapsed ? '' : '<span>Analytics</span>'}
    </a>
    <a href="#" class="flex items-center ${collapsed ? 'justify-center py-1.5 rounded text-text-disabled hover:bg-surface-overlay' : 'gap-1.5 px-2 py-1.5 rounded text-text-secondary hover:bg-surface-overlay'}">
      <i class="fa-solid fa-users text-[10px]"></i>${collapsed ? '' : '<span>Team</span>'}
    </a>
    <a href="#" class="flex items-center ${collapsed ? 'justify-center py-1.5 rounded text-text-disabled hover:bg-surface-overlay' : 'gap-1.5 px-2 py-1.5 rounded text-text-secondary hover:bg-surface-overlay'}">
      <i class="fa-solid fa-gear text-[10px]"></i>${collapsed ? '' : '<span>Settings</span>'}
    </a>
  </nav>
  <div class="border-t border-border px-1.5 py-2">
    <div class="flex items-center ${collapsed ? 'justify-center py-1' : 'gap-1.5 px-2 py-1'}">
      <span class="h-5 w-5 rounded-full bg-primary-subtle text-primary text-[9px] flex items-center justify-center font-bold shrink-0">JD</span>
      ${collapsed ? '' : '<div class="min-w-0"><p class="text-[10px] font-medium text-text-primary truncate">Jane Doe</p><p class="text-[9px] text-text-secondary">Admin</p></div>'}
    </div>
  </div>
</aside>`;

const miniTopbar = `
<header class="flex items-center h-9 px-3 border-b border-border bg-surface-raised/90 gap-2 shrink-0">
  <div class="flex-1 relative">
    <i class="fa-solid fa-magnifying-glass absolute left-2 top-1/2 -translate-y-1/2 text-text-disabled text-[10px]"></i>
    <div class="w-full h-5 rounded bg-surface-sunken/60 pl-6 text-[9px] text-text-disabled flex items-center">Search…</div>
  </div>
  <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay" aria-label="Notifications"><i class="fa-solid fa-bell text-[10px]"></i></button>
  <span class="h-5 w-5 rounded-full bg-primary-subtle text-primary text-[9px] flex items-center justify-center font-bold">JD</span>
</header>`;

const miniContent = `
<div class="flex-1 p-3 space-y-2 overflow-hidden">
  <div class="h-3 rounded bg-surface-sunken/60 w-1/3 animate-none"></div>
  <div class="h-2 rounded bg-surface-sunken/40 w-full"></div>
  <div class="h-2 rounded bg-surface-sunken/40 w-5/6"></div>
  <div class="h-14 rounded-lg bg-surface-sunken/40 mt-2"></div>
</div>`;

// ─── Sidebar preview helpers ─────────────────────────────────────────────────

const sidebarNavGroup = (label: string, items: {icon: string; label: string; active?: boolean; badge?: number}[], collapsed = false) => `
<div>
  ${!collapsed ? `<p class="text-[9px] font-semibold uppercase tracking-widest text-text-disabled px-2 mb-1">${label}</p>` : ''}
  <div class="space-y-0.5">
    ${items.map(i => `
    <a href="#" ${i.active ? 'aria-current="page"' : ''} class="flex items-center gap-2 ${collapsed ? 'justify-center px-1.5 py-1.5' : 'px-2.5 py-1.5'} rounded-lg text-xs transition-colors ${i.active ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'}">
      <i class="${i.icon} shrink-0 text-[11px] w-4 text-center leading-none"></i>
      ${!collapsed ? `<span class="flex-1 truncate">${i.label}</span>` : ''}
      ${!collapsed && i.badge ? `<span class="text-[9px] font-medium bg-primary-subtle text-primary px-1 rounded-full">${i.badge}</span>` : ''}
    </a>`).join('')}
  </div>
</div>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppShellData(): ShowcaseItem[] {
  return [
    // ── AppShell ──────────────────────────────────────────────────────────────
    {
      id: 'app-shell',
      title: 'AppShell',
      category: 'App',
      abbr: 'As',
      description: 'Full-screen layout wrapper with logo, sidebar and topbar slots. Sidebar renders as an aside on desktop and opens via a drawer on mobile.',
      filePath: 'modules/app/AppShell.ejs',
      sourceCode: appShellSource,
      variants: [
        {
          title: 'Sidebar + topbar + content',
          previewHtml: `<div class="flex overflow-hidden bg-surface-base rounded-xl border border-border" style="height:220px;min-width:320px">
  ${miniSidebar()}
  <div class="flex flex-1 flex-col min-w-0">
    ${miniTopbar}
    ${miniContent}
  </div>
</div>`,
          code: `<%- include('modules/app/AppShell', {
  logoContent:  '<span class="text-sm font-bold text-primary">Acme</span>',
  sidebarContent: '<%- include("modules/app/AppSidebar", { navGroups: navGroups, activeId: activeId, searchable: true }) %>',
  topbarContent:  '<%- include("modules/app/AppTopBar", { children: topbarHtml }) %>',
  children: bodyHtml
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Sadece topbar (sidebar yok)',
          previewHtml: `<div class="flex flex-col overflow-hidden bg-surface-base rounded-xl border border-border" style="height:160px;min-width:320px">
  ${miniTopbar}
  ${miniContent}
</div>`,
          code: `<%- include('modules/app/AppShell', {
  topbarContent: '<%- include("modules/app/AppTopBar", { children: topbarHtml }) %>',
  children: bodyHtml
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── AppSidebar ────────────────────────────────────────────────────────────
    {
      id: 'app-sidebar',
      title: 'AppSidebar',
      category: 'App',
      abbr: 'Sb',
      description: 'Collapsible side navigation. Accepts navGroups or navItems with a built-in collapse toggle. The searchable prop adds an inline filter; a headerContent slot (above the nav groups) and a footer slot can host a workspace switcher, a user block or any content. Item badges take a count or any badge HTML.',
      filePath: 'modules/app/AppSidebar.ejs',
      sourceCode: appSidebarSource,
      variants: [
        {
          title: 'Açık (grouped nav + footer)',
          previewHtml: `<div class="flex bg-surface-raised border border-border rounded-xl overflow-hidden" style="height:300px;width:200px">
  <div class="flex flex-col flex-1 w-56">
    <div class="flex items-center justify-end px-2 py-2 border-b border-border">
      <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay" aria-label="Collapse sidebar"><i class="fa-solid fa-chevron-left text-xs"></i></button>
    </div>
    <nav class="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
      ${sidebarNavGroup('Main', [{icon:'fa-solid fa-house',label:'Dashboard',active:true},{icon:'fa-solid fa-chart-bar',label:'Analytics',badge:3},{icon:'fa-solid fa-folder',label:'Projects'},{icon:'fa-solid fa-circle-check',label:'Tasks',badge:12}])}
      ${sidebarNavGroup('Settings', [{icon:'fa-solid fa-users',label:'Team'},{icon:'fa-solid fa-credit-card',label:'Billing'},{icon:'fa-solid fa-gear',label:'Settings'}])}
    </nav>
    <div class="border-t border-border px-2 py-2">
      <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg">
        <span class="h-6 w-6 rounded-full bg-primary-subtle text-primary text-[10px] flex items-center justify-center font-bold shrink-0">JD</span>
        <div class="min-w-0">
          <p class="text-xs font-medium text-text-primary truncate">Jane Doe</p>
          <p class="text-[10px] text-text-secondary">Admin</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/AppSidebar', {
  navGroups: [
    { label: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house', href: '/' },
      { id: 'analytics', label: 'Analytics',  icon: 'fa-solid fa-chart-bar', badge: 3, href: '/analytics' },
    ]},
    { label: 'Settings', items: [
      { id: 'team',     label: 'Team',     icon: 'fa-solid fa-users', href: '/team' },
      { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear',  href: '/settings' },
    ]},
  ],
  activeId: currentPage,
  footerContent: userMenuHtml
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Arama filtreli sidebar',
          previewHtml: `<div class="flex bg-surface-raised border border-border rounded-xl overflow-hidden" style="height:300px;width:200px">
  <div class="flex flex-col flex-1 w-56">
    <div class="flex items-center justify-end px-2 py-2 border-b border-border">
      <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay" aria-label="Collapse sidebar"><i class="fa-solid fa-chevron-left text-xs"></i></button>
    </div>
    <div class="px-3 py-2 border-b border-border">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled text-xs"></i>
        <div class="w-full rounded-md border border-border bg-surface-base pl-7 pr-3 py-1.5 text-xs text-text-disabled">Search…</div>
      </div>
    </div>
    <nav class="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
      ${sidebarNavGroup('Main', [{icon:'fa-solid fa-house',label:'Dashboard',active:true},{icon:'fa-solid fa-chart-bar',label:'Analytics',badge:3},{icon:'fa-solid fa-folder',label:'Projects'},{icon:'fa-solid fa-circle-check',label:'Tasks',badge:12}])}
      ${sidebarNavGroup('Settings', [{icon:'fa-solid fa-users',label:'Team'},{icon:'fa-solid fa-credit-card',label:'Billing'},{icon:'fa-solid fa-gear',label:'Settings'}])}
    </nav>
  </div>
</div>`,
          code: `<%- include('modules/app/AppSidebar', {
  navGroups: navGroups,
  activeId: currentPage,
  searchable: true
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Daraltılmış (icon-only)',
          previewHtml: `<div class="flex bg-surface-raised border border-border rounded-xl overflow-hidden" style="height:300px;width:56px">
  <div class="flex flex-col flex-1 w-14">
    <div class="flex items-center justify-center px-2 py-2 border-b border-border">
      <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay" aria-label="Expand sidebar"><i class="fa-solid fa-chevron-left rotate-180 text-xs"></i></button>
    </div>
    <nav class="flex-1 px-1.5 py-3 space-y-0.5">
      <a href="#" class="flex justify-center py-2 rounded-lg bg-primary-subtle text-primary" title="Dashboard"><i class="fa-solid fa-house text-sm"></i></a>
      <a href="#" class="flex justify-center py-2 rounded-lg text-text-secondary hover:bg-surface-overlay" title="Analytics"><i class="fa-solid fa-chart-bar text-sm"></i></a>
      <a href="#" class="flex justify-center py-2 rounded-lg text-text-secondary hover:bg-surface-overlay" title="Projects"><i class="fa-solid fa-folder text-sm"></i></a>
      <a href="#" class="flex justify-center py-2 rounded-lg text-text-secondary hover:bg-surface-overlay" title="Tasks"><i class="fa-solid fa-circle-check text-sm"></i></a>
    </nav>
    <div class="border-t border-border flex justify-center px-2 py-2">
      <span class="h-6 w-6 rounded-full bg-primary-subtle text-primary text-[10px] flex items-center justify-center font-bold">JD</span>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/AppSidebar', {
  navGroups: navGroups,
  activeId:  currentPage,
  collapsed: true
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Header + node badges',
          previewHtml: `<div class="flex justify-center py-4"><div class="border border-border rounded-xl overflow-hidden bg-surface-raised flex" style="height:320px">${renderPartial('modules/app/AppSidebar.ejs', {
            id: 'sb-header-demo',
            activeId: 'dashboard',
            searchable: false,
            headerContent: ({ collapsed }: { collapsed: boolean }) => (collapsed
              ? '<span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-semibold">AC</span>'
              : '<div class="flex items-center gap-2 px-1"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-semibold">AC</span><span class="text-xs font-semibold text-text-primary truncate">Acme Corp</span></div>'),
            navGroups: [{
              label: 'Main',
              items: [
                { id: 'dashboard', label: 'Dashboard', icon: '<i class="fa-solid fa-house"></i>' },
                { id: 'analytics', label: 'Analytics', icon: '<i class="fa-solid fa-chart-bar"></i>', badge: 3 },
                { id: 'team', label: 'Team', icon: '<i class="fa-solid fa-users"></i>', badge: '<span class="inline-flex items-center gap-1 rounded-full font-medium bg-warning-subtle text-warning-fg px-1.5 py-0 text-[10px]"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-warning" aria-hidden="true"></span>Beta</span>' },
              ],
            }],
          })}</div></div>`,
          code: `<%- include('modules/app/AppSidebar', {
  navGroups: [{ label: 'Main', items: [
    { id: 'analytics', label: 'Analytics', badge: 3 },              // a count
    { id: 'team', label: 'Team', badge: '<span class="…">Beta</span>' }, // any badge HTML
  ] }],
  headerContent: function (ctx) { return workspaceSwitcherHtml(ctx.collapsed); }  // above the nav groups
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── AppTopBar ─────────────────────────────────────────────────────────────
    {
      id: 'app-top-bar',
      title: 'AppTopBar',
      category: 'App',
      abbr: 'At',
      description: 'Top bar wrapper passed into AppShell\'s header slot. The logo slot anchors the left side while children (GlobalSearch, UserMenu, Button, etc.) are arranged in a flex row. Named regions start (after the logo) and end (pushed to the far end) take HTML or ordered { id, node, order, hidden } items, for controls other modules contribute.',
      filePath: 'modules/app/AppTopBar.ejs',
      sourceCode: appTopBarSource,
      variants: [
        {
          title: 'Arama + actions + kullanıcı',
          previewHtml: `<div class="p-3 w-full"><div class="flex items-center gap-3 w-full bg-surface-raised rounded-lg border border-border px-4 py-2.5">
  <div class="flex-1 relative">
    <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled text-xs"></i>
    <div class="h-7 rounded-md bg-surface text-text-disabled text-xs flex items-center pl-7 border border-border">Search everything…</div>
  </div>
  <button class="p-1.5 rounded-md text-text-secondary hover:bg-surface-overlay relative" aria-label="Notifications">
    <i class="fa-solid fa-bell text-sm"></i>
    <span class="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-error border-2 border-surface-raised"></span>
  </button>
  <button class="p-1.5 rounded-md text-text-secondary hover:bg-surface-overlay" aria-label="Settings"><i class="fa-solid fa-gear text-sm"></i></button>
  <span class="h-7 w-7 rounded-full bg-primary-subtle text-primary text-xs flex items-center justify-center font-bold">JD</span>
</div></div>`,
          code: `<%- include('modules/app/AppTopBar', {
  children: \`
    <%- include('modules/app/GlobalSearch', { placeholder: 'Search everything…' }) %>
    <button class="p-1.5 rounded-md text-text-secondary hover:bg-surface-overlay">
      <i class="fa-solid fa-bell" aria-hidden="true"></i>
    </button>
    <%- include('modules/domain/common/user/UserMenu', { name: user.name, role: user.role }) %>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Logo + action + kullanıcı',
          previewHtml: `<div class="p-3 w-full"><div class="flex items-center gap-3 w-full bg-surface-raised rounded-lg border border-border px-4 py-2.5">
  <span class="text-sm font-bold text-primary shrink-0">Acme Dashboard</span>
  <div class="flex-1"></div>
  <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-fg text-xs font-medium hover:bg-primary-hover">
    <i class="fa-solid fa-plus text-[10px]"></i>New
  </button>
  <span class="h-7 w-7 rounded-full bg-primary-subtle text-primary text-xs flex items-center justify-center font-bold">JD</span>
</div></div>`,
          code: `<%- include('modules/app/AppTopBar', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme Dashboard</span>',
  children: \`
    <div class="flex-1"></div>
    <%- include('modules/ui/Button', { children: 'New', iconLeft: '<i class="fa-solid fa-plus"></i>' }) %>
    <%- include('modules/domain/common/user/UserMenu', { name: user.name }) %>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Regions: start + ordered end items',
          previewHtml: `<div class="border border-border rounded-xl overflow-hidden"><div class="flex items-center h-14 px-4 bg-surface-raised">${renderPartial('modules/app/AppTopBar.ejs', {
            logoContent: '<span class="font-black text-primary text-lg">Acme</span>',
            start: '<span class="inline-flex items-center gap-1 rounded-full font-medium bg-surface-sunken text-text-secondary px-1.5 py-0 text-[10px]">Production</span>',
            end: [
              { id: 'user', order: 100, node: '<span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-semibold">JD</span>' },
              { id: 'notifications', order: 10, node: '<button type="button" aria-label="Notifications" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-transparent text-text-primary hover:bg-surface-overlay p-1.5 text-sm"><i class="fa-solid fa-bell" aria-hidden="true"></i></button>' },
              { id: 'help', node: '<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-transparent text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">Help</button>' },
              { id: 'calls', order: 20, hidden: true, node: '<button type="button">Calls</button>' },
            ],
          })}</div></div>`,
          code: `<%# Contributed controls arrive as ordered items; hidden ones are left out. %>
<%- include('modules/app/AppTopBar', {
  logoContent: logoHtml,
  start: environmentBadgeHtml,
  end: [
    { id: 'notifications', order: 10, node: bellHtml },
    { id: 'calls', order: 20, node: presenceHtml, hidden: !telephonyEnabled },
    { id: 'user', order: 100, node: userMenuHtml },
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
