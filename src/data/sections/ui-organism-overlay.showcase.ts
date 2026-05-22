import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const modalSource  = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Modal.ejs'), 'utf-8');
const drawerSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Drawer.ejs'), 'utf-8');

// ─── Modal panel static preview ───────────────────────────────────────────────

function modalPanelEl(opts: {
  title: string;
  description?: string;
  children?: string;
  footer?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass: Record<string, string> = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };
  const sc = sizeClass[opts.size || 'md'];
  return `<div class="relative w-full ${sc} border border-border bg-surface-raised shadow-xl rounded-xl flex flex-col overflow-hidden">
  <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
    <div>
      <h2 class="text-base font-semibold text-text-primary">${opts.title}</h2>
      ${opts.description ? `<p class="text-sm text-text-secondary mt-0.5">${opts.description}</p>` : ''}
    </div>
    <button type="button" aria-label="Close dialog" class="shrink-0 text-text-disabled hover:text-text-primary transition-colors rounded">
      <i class="fa-solid fa-xmark" style="width:1rem;height:1rem" aria-hidden="true"></i>
    </button>
  </div>
  ${opts.children ? `<div class="px-6 py-4 flex-1">${opts.children}</div>` : ''}
  ${opts.footer ? `<div class="px-6 py-4 border-t border-border flex justify-end gap-2 shrink-0">${opts.footer}</div>` : ''}
</div>`;
}

// ─── Drawer panel static preview ──────────────────────────────────────────────

function drawerPanelEl(opts: {
  title: string;
  children?: string;
  footer?: string;
  side?: 'right' | 'left';
}) {
  return `<div class="relative flex flex-col w-72 bg-surface-raised border border-border shadow-xl rounded-lg overflow-hidden" style="min-height:220px">
  <div class="flex items-center justify-between gap-3 px-4 py-4 border-b border-border shrink-0">
    <h2 class="text-base font-semibold text-text-primary">${opts.title}</h2>
    <button type="button" aria-label="Close drawer" class="text-text-disabled hover:text-text-primary transition-colors rounded">
      <i class="fa-solid fa-xmark" style="width:1rem;height:1rem" aria-hidden="true"></i>
    </button>
  </div>
  <div class="flex-1 overflow-y-auto px-4 py-4">
    ${opts.children || '<p class="text-sm text-text-secondary">Drawer body content goes here.</p>'}
  </div>
  ${opts.footer ? `<div class="px-4 py-4 border-t border-border shrink-0">${opts.footer}</div>` : ''}
</div>`;
}

const wrapMd   = (inner: string) => `<div class="p-4 w-full max-w-md">${inner}</div>`;
const wrapSm   = (inner: string) => `<div class="p-4 w-full max-w-xs">${inner}</div>`;

export function buildOrganismOverlayData(): ShowcaseItem[] {
  return [
    // ── Modal ─────────────────────────────────────────────────────────────────
    {
      id: 'modal',
      title: 'Modal',
      category: 'Organism',
      abbr: 'Md',
      description: 'Focus-trapped dialog. Closes on Escape and backdrop click. Requires role="dialog" + aria-modal + aria-labelledby; supports sm/md/lg sizes.',
      filePath: 'modules/ui/Modal.ejs',
      sourceCode: modalSource,
      variants: [
        {
          title: 'Default (md)',
          previewHtml: wrapMd(modalPanelEl({
            title: 'Confirm action',
            description: 'This action cannot be undone.',
            children: '<p class="text-sm text-text-secondary">Are you sure you want to delete this item? All associated data will be permanently removed.</p>',
            footer: '<button type="button" class="px-4 py-2 text-sm rounded-md border border-border text-text-secondary hover:bg-surface-overlay">Cancel</button><button type="button" class="px-4 py-2 text-sm rounded-md bg-error text-white hover:opacity-90">Delete</button>',
          })),
          code: `<%- include('modules/ui/Modal', {
  id: 'confirm-modal',
  title: 'Confirm action',
  description: 'This action cannot be undone.',
  children: '<p>Are you sure you want to delete this item?</p>',
  footer: '<button onclick="closeModal(\'confirm-modal\')">Cancel</button>'
}) %>

<!-- Trigger -->
<button onclick="openModal('confirm-modal')">Open modal</button>`,
          layout: 'stack',
        },
        {
          title: 'Small (sm)',
          previewHtml: wrapSm(modalPanelEl({
            title: 'Quick note',
            size: 'sm',
            children: '<p class="text-sm text-text-secondary">A compact modal for short confirmations or alerts.</p>',
            footer: '<button type="button" class="px-4 py-2 text-sm rounded-md bg-primary text-primary-fg hover:bg-primary-hover">Got it</button>',
          })),
          code: `<%- include('modules/ui/Modal', {
  id: 'quick-note',
  title: 'Quick note',
  size: 'sm',
  children: '<p>A compact modal for short confirmations.</p>',
  footer: '<button onclick="closeModal(\'quick-note\')">Got it</button>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Large (lg)',
          previewHtml: `<div class="p-4 w-full max-w-lg">${modalPanelEl({
            title: 'Edit profile',
            size: 'lg',
            children: `<div class="space-y-4">
  <div><label class="block text-sm font-medium text-text-primary mb-1">Name</label><input type="text" value="Jane Doe" class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"></div>
  <div><label class="block text-sm font-medium text-text-primary mb-1">Email</label><input type="email" value="jane@example.com" class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"></div>
</div>`,
            footer: '<button type="button" class="px-4 py-2 text-sm rounded-md border border-border text-text-secondary hover:bg-surface-overlay">Cancel</button><button type="button" class="px-4 py-2 text-sm rounded-md bg-primary text-primary-fg hover:bg-primary-hover">Save changes</button>',
          })}</div>`,
          code: `<%- include('modules/ui/Modal', {
  id: 'edit-profile',
  title: 'Edit profile',
  size: 'lg',
  children: '...',
  footer: '...'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'No footer',
          previewHtml: wrapMd(modalPanelEl({
            title: 'Keyboard shortcuts',
            description: 'Press ESC to close at any time.',
            children: `<ul class="space-y-2 text-sm">
  <li class="flex justify-between"><span class="text-text-secondary">Open search</span><kbd class="px-1.5 py-0.5 text-xs rounded bg-surface-sunken border border-border font-mono">⌘K</kbd></li>
  <li class="flex justify-between"><span class="text-text-secondary">Close modal</span><kbd class="px-1.5 py-0.5 text-xs rounded bg-surface-sunken border border-border font-mono">ESC</kbd></li>
  <li class="flex justify-between"><span class="text-text-secondary">New item</span><kbd class="px-1.5 py-0.5 text-xs rounded bg-surface-sunken border border-border font-mono">⌘N</kbd></li>
</ul>`,
          })),
          code: `<%- include('modules/ui/Modal', {
  id: 'shortcuts',
  title: 'Keyboard shortcuts',
  description: 'Press ESC to close at any time.',
  children: '...'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── Drawer ────────────────────────────────────────────────────────────────
    {
      id: 'drawer',
      title: 'Drawer',
      category: 'Organism',
      abbr: 'Dr',
      description: 'Side panel sliding in from the screen edge. Left / right placement with focus management and Escape close.',
      filePath: 'modules/ui/Drawer.ejs',
      sourceCode: drawerSource,
      variants: [
        {
          title: 'Right drawer',
          previewHtml: wrapMd(drawerPanelEl({
            title: 'Notifications',
            children: `<ul class="space-y-3">
  <li class="flex gap-3"><div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div><div><p class="text-sm font-medium text-text-primary">New comment on your post</p><p class="text-xs text-text-secondary">2 min ago</p></div></li>
  <li class="flex gap-3"><div class="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0"></div><div><p class="text-sm font-medium text-text-primary">Payment confirmed</p><p class="text-xs text-text-secondary">1 hour ago</p></div></li>
  <li class="flex gap-3"><div class="w-2 h-2 rounded-full bg-border mt-1.5 shrink-0"></div><div><p class="text-sm font-medium text-text-primary">Weekly report ready</p><p class="text-xs text-text-secondary">Yesterday</p></div></li>
</ul>`,
          })),
          code: `<!-- Trigger -->
<button onclick="openDrawer('notif-drawer')">Notifications</button>

<%- include('modules/ui/Drawer', {
  id: 'notif-drawer',
  title: 'Notifications',
  side: 'right',
  children: '...'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Left drawer',
          previewHtml: wrapMd(drawerPanelEl({
            title: 'Navigation',
            side: 'left',
            children: `<nav><ul class="space-y-1">
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary-subtle"><i class="fa-solid fa-house w-4" aria-hidden="true"></i>Home</a></li>
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-overlay"><i class="fa-solid fa-users w-4" aria-hidden="true"></i>Users</a></li>
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-overlay"><i class="fa-solid fa-gear w-4" aria-hidden="true"></i>Settings</a></li>
</ul></nav>`,
          })),
          code: `<%- include('modules/ui/Drawer', {
  id: 'nav-drawer',
  title: 'Navigation',
  side: 'left',
  children: '...'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With footer',
          previewHtml: wrapMd(drawerPanelEl({
            title: 'Edit item',
            children: `<div class="space-y-3"><div><label class="block text-sm font-medium text-text-primary mb-1">Name</label><input type="text" value="Product Alpha" class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"></div></div>`,
            footer: '<div class="flex gap-2 justify-end"><button type="button" class="px-3 py-1.5 text-sm rounded-md border border-border text-text-secondary hover:bg-surface-overlay">Cancel</button><button type="button" class="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-fg">Save</button></div>',
          })),
          code: `<%- include('modules/ui/Drawer', {
  id: 'edit-drawer',
  title: 'Edit item',
  children: '...',
  footer: '<div class="flex gap-2 justify-end">...</div>'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
