import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const appNavSource    = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppNav.ejs'), 'utf-8');
const navDrawerSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/NavDrawer.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const navLink = (label: string, active = false, href = '#') =>
  `<a href="${href}" ${active ? 'aria-current="page"' : ''}
    class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'}">${label}</a>`;

const outlineBtn = (label: string) =>
  `<button class="inline-flex items-center justify-center rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium">${label}</button>`;

const primaryBtn = (label: string) =>
  `<button class="inline-flex items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm font-medium">${label}</button>`;

const navItem = (label: string, active = false, href = '#') =>
  `<a href="${href}" ${active ? 'aria-current="page"' : ''}
    class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-overlay'}">${label}</a>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppNavData(): ShowcaseItem[] {
  return [
    // ── AppNav ────────────────────────────────────────────────────────────────
    {
      id: 'app-nav',
      title: 'AppNav',
      category: 'App',
      abbr: 'An',
      description: 'Horizontal navigation bar. Renders inline links on desktop and a hamburger that opens a NavDrawer on mobile. Provides logo, navItems and actions slots.',
      filePath: 'modules/app/AppNav.ejs',
      sourceCode: appNavSource,
      variants: [
        {
          title: 'Marketing bar (logo + links + CTA)',
          previewHtml: `<div class="w-full">
  <header class="w-full flex items-center gap-3 px-4 py-3 bg-surface-raised border-b border-border rounded-xl">
    <span class="text-sm font-bold text-primary shrink-0">Acme</span>
    <nav class="flex items-center gap-0.5 flex-1">
      ${navLink('Home', true)}${navLink('Features')}${navLink('Pricing')}${navLink('Docs')}
    </nav>
    <div class="flex items-center gap-2">
      ${outlineBtn('Sign in')}
      ${primaryBtn('Get started')}
    </div>
  </header>
</div>`,
          code: `<%- include('modules/app/AppNav', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  navItems: [
    { label: 'Home',     href: '/',         active: currentPath === '/' },
    { label: 'Features', href: '/features', active: currentPath === '/features' },
    { label: 'Pricing',  href: '/pricing',  active: currentPath === '/pricing' },
    { label: 'Docs',     href: '/docs',     active: currentPath === '/docs' },
  ],
  children: \`
    <%- include('modules/ui/Button', { variant: 'outline', children: 'Sign in', href: '/login' }) %>
    <%- include('modules/ui/Button', { children: 'Get started', href: '/register' }) %>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'App bar (links + UserMenu)',
          previewHtml: `<div class="w-full">
  <header class="w-full flex items-center gap-3 px-4 py-3 bg-surface-raised border-b border-border rounded-xl">
    <span class="text-sm font-bold text-text-primary shrink-0">Dashboard</span>
    <nav class="flex items-center gap-0.5 flex-1">
      ${navLink('Overview', true)}${navLink('Analytics')}${navLink('Projects')}${navLink('Team')}
    </nav>
    <div class="flex items-center gap-2">
      <button class="p-1.5 rounded-md text-text-secondary hover:bg-surface-overlay"><i class="fa-solid fa-bell text-sm"></i></button>
      <span class="h-7 w-7 rounded-full bg-primary-subtle text-primary text-xs flex items-center justify-center font-bold">JD</span>
    </div>
  </header>
</div>`,
          code: `<%- include('modules/app/AppNav', {
  logoContent: '<span class="text-sm font-bold text-text-primary">Dashboard</span>',
  navItems: [
    { label: 'Overview',  href: '/dashboard',           active: true },
    { label: 'Analytics', href: '/dashboard/analytics'  },
    { label: 'Projects',  href: '/dashboard/projects'   },
    { label: 'Team',      href: '/dashboard/team'       },
  ],
  children: \`
    <%- include('modules/domain/common/user/UserMenu', { name: user.name, role: user.role }) %>
  \`
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── NavDrawer ─────────────────────────────────────────────────────────────
    {
      id: 'nav-drawer',
      title: 'NavDrawer',
      category: 'App',
      abbr: 'Nd',
      description: 'Wrapper that wraps any trigger and children inside a drawer. Manages its own open/closed state. Used as AppNav\'s mobile menu and also works standalone.',
      filePath: 'modules/app/NavDrawer.ejs',
      sourceCode: navDrawerSource,
      variants: [
        {
          title: 'Sol nav (standalone)',
          previewHtml: `<div class="p-4 flex gap-4 w-full">
  <div class="w-64 rounded-xl border border-border bg-surface-raised overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <span class="text-sm font-semibold text-text-primary">Navigation</span>
      <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay"><i class="fa-solid fa-xmark text-sm"></i></button>
    </div>
    <nav class="flex flex-col gap-0.5 p-2">
      ${navItem('Home', true)}${navItem('Features')}${navItem('Pricing')}${navItem('Blog')}${navItem('Contact')}
    </nav>
  </div>
</div>`,
          code: `<%- include('modules/app/NavDrawer', {
  title: 'Navigation',
  side: 'left',
  navItems: [
    { label: 'Home',     href: '/',         active: currentPath === '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing',  href: '/pricing'  },
    { label: 'Blog',     href: '/blog'     },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Sağ panel (cart/settings)',
          previewHtml: `<div class="p-4 flex justify-end w-full">
  <div class="w-64 rounded-xl border border-border bg-surface-raised overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <span class="text-sm font-semibold text-text-primary">Cart (3)</span>
      <button class="p-1 rounded text-text-secondary hover:bg-surface-overlay"><i class="fa-solid fa-xmark text-sm"></i></button>
    </div>
    <div class="flex flex-col gap-0.5 p-3 space-y-2">
      ${[
        ['Product A', '$29.00'],
        ['Product B', '$49.00'],
        ['Product C', '$15.00'],
      ].map(([name, price]) => `
      <div class="flex items-center justify-between py-1.5">
        <span class="text-sm text-text-primary">${name}</span>
        <span class="text-sm font-medium text-text-primary">${price}</span>
      </div>`).join('')}
    </div>
    <div class="px-3 py-3 border-t border-border">
      <button class="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm font-medium">Checkout</button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/NavDrawer', {
  title: 'Cart (' + cartCount + ')',
  side: 'right',
  children: cartItemsHtml,
  footerContent: '<button ...>Checkout</button>'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
