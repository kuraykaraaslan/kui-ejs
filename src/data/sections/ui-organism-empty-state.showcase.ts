import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/EmptyState.ejs'), 'utf-8');

function emptyStateEl(opts: {
  title: string;
  description?: string;
  icon?: string;
  action?: string;
  className?: string;
}) {
  return `<div class="flex flex-col items-center justify-center text-center py-16 px-6${opts.className ? ' ' + opts.className : ''}">
  ${opts.icon ? `<div class="h-12 w-12 rounded-full bg-surface-sunken flex items-center justify-center text-text-disabled text-2xl mb-4" aria-hidden="true">${opts.icon}</div>` : ''}
  <h3 class="text-sm font-semibold text-text-primary">${opts.title}</h3>
  ${opts.description ? `<p class="mt-1 text-sm text-text-secondary max-w-xs">${opts.description}</p>` : ''}
  ${opts.action ? `<div class="mt-4">${opts.action}</div>` : ''}
</div>`;
}

const wrap = (inner: string) => `<div class="w-full max-w-md mx-auto rounded-lg border border-border bg-surface-base">${inner}</div>`;

const primaryBtn = '<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Add item</button>';
const outlineBtn = '<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Reset filters</button>';

export function buildEmptyStateData(): ShowcaseItem[] {
  return [
    {
      id: 'empty-state',
      title: 'EmptyState',
      category: 'Organism',
      abbr: 'Es',
      description: 'Empty-state message shown when there is no data. Supports icon, title, description, and action slots.',
      filePath: 'modules/ui/EmptyState.ejs',
      sourceCode,
      variants: [
        {
          title: 'Title only',
          previewHtml: wrap(emptyStateEl({
            title: 'No results',
          })),
          code: `<%- include('modules/ui/EmptyState', {
  title: 'No results'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With icon and description',
          previewHtml: wrap(emptyStateEl({
            title: 'No items yet',
            description: 'Get started by creating your first item.',
            icon: '<i class="fa-solid fa-folder-open" aria-hidden="true"></i>',
          })),
          code: `<%- include('modules/ui/EmptyState', {
  title: 'No items yet',
  description: 'Get started by creating your first item.',
  icon: '<i class="fa-solid fa-folder-open" aria-hidden="true"></i>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With primary action',
          previewHtml: wrap(emptyStateEl({
            title: 'Your inbox is empty',
            description: 'New messages will appear here as soon as they arrive.',
            icon: '<i class="fa-solid fa-inbox" aria-hidden="true"></i>',
            action: primaryBtn,
          })),
          code: `<%- include('modules/ui/EmptyState', {
  title: 'Your inbox is empty',
  description: 'New messages will appear here as soon as they arrive.',
  icon: '<i class="fa-solid fa-inbox" aria-hidden="true"></i>',
  action: '<button class="...">Add item</button>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Search empty',
          previewHtml: wrap(emptyStateEl({
            title: 'No matches found',
            description: 'Try adjusting your search or filter to find what you are looking for.',
            icon: '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>',
            action: outlineBtn,
          })),
          code: `<%- include('modules/ui/EmptyState', {
  title: 'No matches found',
  description: 'Try adjusting your search or filter.',
  icon: '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>',
  action: '<button class="...">Reset filters</button>'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
