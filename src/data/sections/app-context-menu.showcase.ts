import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const ctxTemplatePath = path.join(process.cwd(), 'modules/app/ContextMenu.ejs');
const sourceCode = fs.readFileSync(ctxTemplatePath, 'utf-8');

function renderCtx(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: ctxTemplatePath });
}

function icon(name: string): string {
  return `<i class="fa-solid fa-${name} text-xs" aria-hidden="true"></i>`;
}

/* Render the live partial — right-click on the trigger opens the menu at the cursor. */
function ctxPreview(children: string, items: unknown[]): string {
  return `<div class="p-4 flex flex-col items-start gap-2 w-full">${renderCtx({ children, items })}</div>`;
}

export function buildContextMenuData(): ShowcaseItem[] {
  return [
    {
      id: 'context-menu',
      title: 'ContextMenu',
      category: 'App',
      abbr: 'CM',
      since: '2026-05',
      description:
        'Right-click context menu. Wraps any element as a trigger. Supports item groups, keyboard shortcuts, separators, danger items, and disabled items. Positions itself via viewport-aware boundary detection, auto-flips when near screen edges. Full keyboard navigation: ↑↓ arrows, Enter, Escape.',
      filePath: 'modules/app/ContextMenu.ejs',
      sourceCode,
      variants: [
        {
          title: 'Text editor — clipboard + format actions',
          layout: 'stack',
          previewHtml: ctxPreview(
            `<div class="w-full rounded-xl border-2 border-dashed border-border bg-surface-raised p-8 text-center text-sm text-text-secondary select-none cursor-default hover:border-border-strong hover:bg-surface-overlay transition-colors">
              Right-click anywhere in this area
            </div>`,
            [
              { label: 'Cut',       icon: icon('scissors'), shortcut: '⌘X' },
              { label: 'Copy',      icon: icon('copy'),     shortcut: '⌘C' },
              { label: 'Paste',     icon: icon('paste'),    shortcut: '⌘V' },
              { type: 'separator' },
              { label: 'Copy link', icon: icon('link'),     shortcut: '⌘⇧C' },
              { type: 'separator' },
              { label: 'Rename',    icon: icon('pen') },
              { label: 'Delete',    icon: icon('trash'),    shortcut: '⌫', danger: true },
            ],
          ),
          code: `<%- include('modules/app/ContextMenu', {
  children: '<div class="p-8 text-center text-sm text-text-secondary border-2 border-dashed border-border rounded-xl">Right-click anywhere in this area</div>',
  items: [
    { label: 'Cut',       icon: '<i class="fa-solid fa-scissors text-xs"></i>', shortcut: '⌘X' },
    { label: 'Copy',      icon: '<i class="fa-solid fa-copy    text-xs"></i>', shortcut: '⌘C' },
    { label: 'Paste',     icon: '<i class="fa-solid fa-paste   text-xs"></i>', shortcut: '⌘V' },
    { type: 'separator' },
    { label: 'Copy link', icon: '<i class="fa-solid fa-link    text-xs"></i>', shortcut: '⌘⇧C' },
    { type: 'separator' },
    { label: 'Rename',    icon: '<i class="fa-solid fa-pen     text-xs"></i>' },
    { label: 'Delete',    icon: '<i class="fa-solid fa-trash   text-xs"></i>', shortcut: '⌫', danger: true },
  ]
}) %>`,
        },
        {
          title: 'File manager — groups + shortcut hint',
          layout: 'stack',
          previewHtml: (() => {
            const fileItems = [
              { type: 'group', label: 'Actions' },
              { label: 'Open',     icon: icon('eye') },
              { label: 'Download', icon: icon('download'),    shortcut: '⌘D' },
              { label: 'Share',    icon: icon('share-nodes'), shortcut: '⌘⇧S' },
              { type: 'separator' },
              { type: 'group', label: 'Organise' },
              { label: 'Move to…', icon: icon('arrow-right') },
              { label: 'Add tag',  icon: icon('tag') },
              { type: 'separator' },
              { label: 'Delete',   icon: icon('trash'),       danger: true },
            ];
            const files = ['Report Q1.pdf', 'Design System.fig', 'README.md'];
            const cards = files.map(name => {
              const fa = name.endsWith('.fig') ? 'folder' : 'file';
              const card = `<div class="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-surface-base cursor-default select-none text-center hover:bg-surface-overlay transition-colors">
                <i class="fa-solid fa-${fa} text-2xl text-primary" aria-hidden="true"></i>
                <span class="text-xs text-text-secondary truncate w-full">${name}</span>
              </div>`;
              return renderCtx({ children: card, items: fileItems });
            }).join('');
            return `<div class="grid grid-cols-3 gap-3 p-4 bg-surface-raised rounded-xl border border-border w-full">${cards}</div>`;
          })(),
          code: `<% files.forEach(function(file) { %>
  <%- include('modules/app/ContextMenu', {
    children: fileCardHtml(file),
    items: [
      { type: 'group', label: 'Actions' },
      { label: 'Open',     icon: '<i class="fa-solid fa-eye         text-xs"></i>' },
      { label: 'Download', icon: '<i class="fa-solid fa-download    text-xs"></i>', shortcut: '⌘D' },
      { label: 'Share',    icon: '<i class="fa-solid fa-share-nodes text-xs"></i>', shortcut: '⌘⇧S' },
      { type: 'separator' },
      { type: 'group', label: 'Organise' },
      { label: 'Move to…', icon: '<i class="fa-solid fa-arrow-right text-xs"></i>' },
      { label: 'Add tag',  icon: '<i class="fa-solid fa-tag         text-xs"></i>' },
      { type: 'separator' },
      { label: 'Delete',   icon: '<i class="fa-solid fa-trash       text-xs"></i>', danger: true },
    ]
  }) %>
<% }); %>`,
        },
        {
          title: 'Code branch — some items disabled',
          layout: 'stack',
          previewHtml: ctxPreview(
            `<div class="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border bg-surface-raised cursor-default select-none w-fit hover:bg-surface-overlay transition-colors">
              <i class="fa-solid fa-code-branch text-primary" aria-hidden="true"></i>
              <span class="text-sm font-medium text-text-primary">feature/context-menu</span>
              <span class="text-xs text-text-disabled">(right-click)</span>
            </div>`,
            [
              { label: 'View diff',        icon: icon('code-branch') },
              { label: 'Copy branch name', icon: icon('copy'),        shortcut: '⌘C' },
              { type: 'separator' },
              { label: 'Merge into main',  icon: icon('arrow-right'), disabled: true },
              { label: 'Cherry-pick',                                  disabled: true },
              { type: 'separator' },
              { label: 'Delete branch',    icon: icon('trash'),        danger: true },
            ],
          ),
          code: `<%- include('modules/app/ContextMenu', {
  children: branchRowHtml,
  items: [
    { label: 'View diff',        icon: '<i class="fa-solid fa-code-branch  text-xs"></i>' },
    { label: 'Copy branch name', icon: '<i class="fa-solid fa-copy         text-xs"></i>', shortcut: '⌘C' },
    { type: 'separator' },
    { label: 'Merge into main',  icon: '<i class="fa-solid fa-arrow-right  text-xs"></i>', disabled: true },
    { label: 'Cherry-pick',                                                                 disabled: true },
    { type: 'separator' },
    { label: 'Delete branch',    icon: '<i class="fa-solid fa-trash        text-xs"></i>', danger: true },
  ]
}) %>`,
        },
      ],
    },
  ];
}
