import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Button.ejs'), 'utf-8');

const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed';
const pad  = 'px-4 py-2 text-sm';
const wrap = (inner: string) => `<div class="flex items-center justify-center p-4">${inner}</div>`;
const btn  = (cls: string, label: string, extra = '') =>
  `<button type="button" ${extra} class="${base} ${cls} ${pad}">${label}</button>`;
const link = (cls: string, label: string, href = '#', extra = '') =>
  `<a href="${href}" ${extra} class="${base} ${cls} ${pad}">${label}</a>`;
const spinner = (sz: string) =>
  `<span aria-hidden="true" class="inline-block rounded-full border-current border-t-transparent animate-spin shrink-0 ${sz}"></span>`;

export function buildButtonData(): ShowcaseItem[] {
  return [
    {
      id: 'button',
      title: 'Button',
      category: 'Atom',
      abbr: 'Bt',
      description: 'Core interactive element. Supports 5 visual styles (variants) and 5 sizes. disabled, loading and selected states are built-in.',
      filePath: 'modules/ui/Button.ejs',
      sourceCode,
      variants: [
        {
          title: 'Primary',
          previewHtml: wrap(btn('bg-primary text-primary-fg hover:bg-primary-hover', 'Primary')),
          code: `<%- include('modules/ui/Button', { children: 'Primary' }) %>`,
        },
        {
          title: 'Secondary',
          previewHtml: wrap(btn('bg-secondary text-secondary-fg hover:bg-secondary-hover', 'Secondary')),
          code: `<%- include('modules/ui/Button', { variant: 'secondary', children: 'Secondary' }) %>`,
        },
        {
          title: 'Ghost',
          previewHtml: wrap(btn('bg-transparent text-text-primary hover:bg-surface-overlay', 'Ghost')),
          code: `<%- include('modules/ui/Button', { variant: 'ghost', children: 'Ghost' }) %>`,
        },
        {
          title: 'Danger',
          previewHtml: wrap(btn('bg-error text-text-inverse hover:opacity-90', 'Danger')),
          code: `<%- include('modules/ui/Button', { variant: 'danger', children: 'Danger' }) %>`,
        },
        {
          title: 'Outline',
          previewHtml: wrap(btn('border border-border text-text-primary hover:bg-surface-overlay', 'Outline')),
          code: `<%- include('modules/ui/Button', { variant: 'outline', children: 'Outline' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrap(btn('bg-primary text-primary-fg', 'Disabled', 'disabled')),
          code: `<%- include('modules/ui/Button', { disabled: true, children: 'Disabled' }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover px-2 py-1 text-xs">XS</button>
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm">SM</button>
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">MD</button>
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover px-5 py-2.5 text-base">LG</button>
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover px-6 py-3 text-lg">XL</button>
</div>`,
          code: `<%- include('modules/ui/Button', { size: 'xs', children: 'XS' }) %>
<%- include('modules/ui/Button', { size: 'sm', children: 'SM' }) %>
<%- include('modules/ui/Button', { size: 'md', children: 'MD' }) %>
<%- include('modules/ui/Button', { size: 'lg', children: 'LG' }) %>
<%- include('modules/ui/Button', { size: 'xl', children: 'XL' }) %>`,
        },
        {
          title: 'Icon left / right',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover ${pad}">
    <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-download"></i></span>Download
  </button>
  <button type="button" class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad}">
    Next<span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-right"></i></span>
  </button>
  <button type="button" class="${base} bg-secondary text-secondary-fg hover:bg-secondary-hover ${pad}">
    <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-envelope"></i></span>Send<span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
  </button>
</div>`,
          code: `<%- include('modules/ui/Button', { iconLeft: '<i class="fa-solid fa-download"></i>', children: 'Download' }) %>
<%- include('modules/ui/Button', { variant: 'outline', iconRight: '<i class="fa-solid fa-arrow-right"></i>', children: 'Next' }) %>`,
        },
        {
          title: 'Icon only',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" aria-label="Delete item" class="${base} bg-primary text-primary-fg hover:bg-primary-hover ${pad}"><i class="fa-solid fa-trash"></i></button>
  <button type="button" aria-label="Edit item"   class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad}"><i class="fa-solid fa-pen"></i></button>
  <button type="button" aria-label="Share"        class="${base} bg-transparent text-text-primary hover:bg-surface-overlay ${pad}"><i class="fa-solid fa-share-nodes"></i></button>
  <button type="button" aria-label="Delete"       class="${base} bg-error text-text-inverse hover:opacity-90 ${pad}"><i class="fa-solid fa-xmark"></i></button>
</div>`,
          code: `<%- include('modules/ui/Button', { ariaLabel: 'Delete item', children: '<i class="fa-solid fa-trash"></i>' }) %>
<%- include('modules/ui/Button', { variant: 'outline', ariaLabel: 'Edit item', children: '<i class="fa-solid fa-pen"></i>' }) %>`,
        },
        {
          title: 'Selected / active state',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" aria-pressed="true"  class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad} ring-2 ring-inset ring-border-focus">Selected</button>
  <button type="button" aria-pressed="false" class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad}">Default</button>
  <button type="button" aria-pressed="false" class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad}">Default</button>
</div>`,
          code: `<%- include('modules/ui/Button', { variant: 'outline', selected: true,  children: 'Selected' }) %>
<%- include('modules/ui/Button', { variant: 'outline', selected: false, children: 'Default' }) %>`,
        },
        {
          title: 'Loading state',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" disabled aria-busy="true" class="${base} bg-primary text-primary-fg ${pad}">
    ${spinner('h-4 w-4 border-2')}Saving…
  </button>
  <button type="button" disabled aria-busy="true" class="${base} border border-border text-text-primary ${pad}">
    ${spinner('h-4 w-4 border-2')}Loading details
  </button>
</div>`,
          code: `<%- include('modules/ui/Button', { loading: true, children: 'Saving…' }) %>
<%- include('modules/ui/Button', { variant: 'outline', loading: true, children: 'Loading details' }) %>`,
        },
        {
          title: 'As Link (element override)',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  ${link('bg-primary text-primary-fg hover:bg-primary-hover', 'Go to docs', '/docs')}
  ${link('border border-border text-text-primary hover:bg-surface-overlay', 'Open in new tab', 'https://example.com', 'target="_blank" rel="noopener noreferrer"')}
  ${link('bg-secondary text-secondary-fg hover:bg-secondary-hover', '<span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-right"></i></span>Next page', '/next')}
  ${link('bg-primary text-primary-fg opacity-50 pointer-events-none cursor-not-allowed', 'Disabled link', '#', 'aria-disabled="true" tabindex="-1"')}
</div>`,
          code: `<%- include('modules/ui/Button', { element: 'a', href: '/docs', children: 'Go to docs' }) %>
<%- include('modules/ui/Button', { element: 'a', href: 'https://example.com', target: '_blank', variant: 'outline', children: 'Open in new tab' }) %>
<%- include('modules/ui/Button', { element: 'a', href: '/next', variant: 'secondary', iconRight: '<i class="fa-solid fa-arrow-right"></i>', children: 'Next page' }) %>
<%- include('modules/ui/Button', { element: 'a', href: '#', disabled: true, children: 'Disabled link' }) %>`,
        },
        {
          title: 'Full width',
          layout: 'stack' as const,
          previewHtml: `<div class="w-full space-y-2 p-4">
  <button type="button" class="${base} bg-primary text-primary-fg hover:bg-primary-hover ${pad} w-full">Full-width primary</button>
  <button type="button" class="${base} border border-border text-text-primary hover:bg-surface-overlay ${pad} w-full">Full-width outline</button>
</div>`,
          code: `<%- include('modules/ui/Button', { fullWidth: true, children: 'Full-width primary' }) %>
<%- include('modules/ui/Button', { variant: 'outline', fullWidth: true, children: 'Full-width outline' }) %>`,
        },
      ],
    },
  ];
}
