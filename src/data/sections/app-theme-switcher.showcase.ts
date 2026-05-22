import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/ThemeSwitcher.ejs'), 'utf-8');

const triggerBtn = (label: string, icon: string) =>
  `<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
    <span class="w-4 flex items-center justify-center shrink-0" aria-hidden="true">
      <i class="fa-solid ${icon} w-4 h-4"></i>
    </span>
    <span>${label}</span>
    <i class="fa-solid fa-chevron-down w-3 h-3 text-text-disabled" aria-hidden="true"></i>
  </button>`;

const menuItem = (label: string, icon: string, active = false) =>
  `<button class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left ${active ? 'bg-primary-subtle text-primary font-medium' : 'text-text-primary hover:bg-surface-overlay'}">
    <i class="fa-solid ${icon} w-4 h-4 text-text-secondary" aria-hidden="true"></i>
    <span>${label}</span>
    ${active ? '<i class="fa-solid fa-check ml-auto text-primary" aria-hidden="true"></i>' : ''}
  </button>`;

export function buildThemeSwitcherData(): ShowcaseItem[] {
  return [
    {
      id: 'theme-switcher',
      title: 'ThemeSwitcher',
      category: 'App',
      abbr: 'TS',
      description: 'Light / Dark / System tema seçici dropdown. localStorage\'a yazar; "system" seçildiğinde prefers-color-scheme medyasını dinler. DropdownMenu üzerine bina edilir; trigger içinde aktif moda göre ikon değişir.',
      filePath: 'modules/app/ThemeSwitcher.ejs',
      sourceCode,
      variants: [
        {
          title: 'Closed trigger — system mode',
          previewHtml: `<div class="p-4 w-full flex justify-center">
  ${triggerBtn('System', 'fa-display')}
</div>`,
          code: `<%- include('modules/app/ThemeSwitcher') %>`,
          layout: 'stack',
        },
        {
          title: 'Open menu — dark active',
          previewHtml: `<div class="p-4 w-full flex justify-center">
  <div class="relative inline-block">
    ${triggerBtn('Dark', 'fa-moon')}
    <div class="absolute right-0 top-full mt-1 z-20 min-w-[10rem] rounded-md border border-border bg-surface-raised shadow-lg py-1">
      ${menuItem('Light',  'fa-sun')}
      ${menuItem('Dark',   'fa-moon', true)}
      ${menuItem('System', 'fa-display')}
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/ThemeSwitcher', {
  id: 'header-theme-switcher',
  className: 'shrink-0'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
