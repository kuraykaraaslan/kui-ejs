import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/DropdownMenu.ejs'), 'utf-8');

type Item =
  | { type: 'separator' }
  | { label: string; icon?: string; danger?: boolean; disabled?: boolean };

function menuItemsHtml(items: Item[]) {
  return items.map((item) => {
    if ('type' in item && item.type === 'separator') {
      return '<div role="separator" class="my-1 border-t border-border"></div>';
    }
    const it = item as Exclude<Item, { type: 'separator' }>;
    const stateClass = it.danger
      ? 'text-error hover:bg-error-subtle'
      : 'text-text-primary hover:bg-surface-overlay';
    const disClass = it.disabled ? ' opacity-50 cursor-not-allowed' : '';
    return `<button role="menuitem" type="button"${it.disabled ? ' disabled' : ''} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay ${stateClass}${disClass}">
      ${it.icon ? `<span aria-hidden="true">${it.icon}</span>` : ''}
      ${it.label}
    </button>`;
  }).join('\n    ');
}

function dropdownEl(opts: {
  trigger: string;
  items: Item[];
  align?: 'left' | 'right';
  header?: string;
}) {
  const alignClass = opts.align === 'right' ? 'right-0' : 'left-0';
  return `<div class="relative inline-block">
  <div aria-haspopup="menu" aria-expanded="true">
    ${opts.trigger}
  </div>
  <div role="menu" class="absolute z-[60] mt-1 min-w-[12rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1 ${alignClass}">
    ${opts.header ? `<div class="border-b border-border mb-1">${opts.header}</div>` : ''}
    ${menuItemsHtml(opts.items)}
  </div>
</div>`;
}

const trigger = (label: string) =>
  `<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
    ${label}
    <i class="fa-solid fa-chevron-down" aria-hidden="true" style="font-size:10px"></i>
  </button>`;

const iconTrigger =
  `<button type="button" aria-label="More options" class="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-text-secondary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
    <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
  </button>`;

const stage = (inner: string) =>
  `<div class="flex items-start justify-center gap-8 py-8 px-8" style="min-height:280px">${inner}</div>`;

export function buildDropdownMenuData(): ShowcaseItem[] {
  return [
    {
      id: 'dropdown-menu',
      title: 'DropdownMenu',
      category: 'Organism',
      abbr: 'Dm',
      description: 'role="menu" + ARIA durumlu açılır menü. Sol/sağ hizalama, ikon, ayraç, danger ve disabled öğeleri ile ok-tuşu navigasyonu.',
      filePath: 'modules/ui/DropdownMenu.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default (left aligned)',
          previewHtml: stage(dropdownEl({
            trigger: trigger('Actions'),
            items: [
              { label: 'View', icon: '<i class="fa-solid fa-eye" aria-hidden="true"></i>' },
              { label: 'Edit', icon: '<i class="fa-solid fa-pen" aria-hidden="true"></i>' },
              { label: 'Duplicate', icon: '<i class="fa-solid fa-copy" aria-hidden="true"></i>' },
            ],
          })),
          code: `<%- include('modules/ui/DropdownMenu', {
  id: 'actions-menu',
  trigger: '<button>Actions</button>',
  items: [
    { label: 'View', icon: '<i class="fa-solid fa-eye"></i>' },
    { label: 'Edit', icon: '<i class="fa-solid fa-pen"></i>' },
    { label: 'Duplicate', icon: '<i class="fa-solid fa-copy"></i>' }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With separator & danger',
          previewHtml: stage(dropdownEl({
            trigger: iconTrigger,
            align: 'right',
            items: [
              { label: 'Open', icon: '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>' },
              { label: 'Rename', icon: '<i class="fa-solid fa-pen" aria-hidden="true"></i>' },
              { label: 'Archive', icon: '<i class="fa-solid fa-box-archive" aria-hidden="true"></i>', disabled: true },
              { type: 'separator' },
              { label: 'Delete', icon: '<i class="fa-solid fa-trash" aria-hidden="true"></i>', danger: true },
            ],
          })),
          code: `<%- include('modules/ui/DropdownMenu', {
  id: 'row-menu',
  align: 'right',
  trigger: '<button aria-label="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>',
  items: [
    { label: 'Open', icon: '...' },
    { label: 'Rename', icon: '...' },
    { label: 'Archive', icon: '...', disabled: true },
    { type: 'separator' },
    { label: 'Delete', icon: '...', danger: true }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With header',
          previewHtml: stage(dropdownEl({
            trigger: trigger('Account'),
            header: '<div class="px-3 py-2"><p class="text-sm font-medium text-text-primary">Jane Doe</p><p class="text-xs text-text-secondary">jane@example.com</p></div>',
            items: [
              { label: 'Profile', icon: '<i class="fa-solid fa-user" aria-hidden="true"></i>' },
              { label: 'Settings', icon: '<i class="fa-solid fa-gear" aria-hidden="true"></i>' },
              { type: 'separator' },
              { label: 'Sign out', icon: '<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>', danger: true },
            ],
          })),
          code: `<%- include('modules/ui/DropdownMenu', {
  id: 'account-menu',
  trigger: '<button>Account</button>',
  header: '<div class="px-3 py-2">...</div>',
  items: [
    { label: 'Profile', icon: '...' },
    { label: 'Settings', icon: '...' },
    { type: 'separator' },
    { label: 'Sign out', icon: '...', danger: true }
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
