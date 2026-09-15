import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ScrollArea.ejs'), 'utf-8');

function itemsHtml(count: number): string {
  var out = '';
  for (var i = 1; i <= count; i++) {
    out += `<li class="rounded-md bg-surface-raised px-3 py-2">Item ${i}</li>`;
  }
  return out;
}

function cardsHtml(count: number): string {
  var out = '';
  for (var i = 1; i <= count; i++) {
    out += `<div class="h-16 w-24 shrink-0 rounded-md bg-surface-raised flex items-center justify-center text-sm text-text-primary">Card ${i}</div>`;
  }
  return out;
}

export function buildScrollAreaData(): ShowcaseItem[] {
  return [
    {
      id: 'scroll-area',
      title: 'ScrollArea',
      category: 'Atom',
      abbr: 'SA',
      description: 'Scrollable container with a themed, thin scrollbar (Firefox scrollbar-color + WebKit pseudo-elements) instead of the bulky native default. Supports vertical, horizontal, or both-axis scrolling.',
      filePath: 'modules/ui/ScrollArea.ejs',
      sourceCode,
      variants: [
        {
          title: 'Vertical list',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4">
  <div class="h-40 w-64 rounded-md border border-border p-3 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full">
    <ul class="space-y-2 text-sm text-text-primary">${itemsHtml(20)}</ul>
  </div>
</div>`,
          code: `<%- include('modules/ui/ScrollArea', {
  className: 'h-40 w-64 border border-border p-3',
  children: itemListHtml
}) %>`,
        },
        {
          title: 'Horizontal',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4">
  <div class="w-full rounded-md border border-border p-3 overflow-x-auto overflow-y-hidden [scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full">
    <div class="flex gap-3">${cardsHtml(10)}</div>
  </div>
</div>`,
          code: `<%- include('modules/ui/ScrollArea', {
  orientation: 'horizontal',
  className: 'w-full border border-border p-3',
  children: cardsRowHtml
}) %>`,
        },
      ],
    },
  ];
}
