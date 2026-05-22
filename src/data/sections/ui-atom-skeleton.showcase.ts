import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Skeleton.ejs'), 'utf-8');

const base = 'animate-pulse bg-surface-sunken';
const line = (width: string) => `<div class="${base} h-3 rounded ${width}"></div>`;
const avatar = (size = 'h-10 w-10') => `<div class="${base} rounded-full shrink-0 ${size}"></div>`;
const text = (lines: number) => {
  const rows: string[] = [];
  for (let i = 0; i < lines; i++) {
    rows.push(line(i === lines - 1 ? 'w-4/5' : 'w-full'));
  }
  return `<div class="space-y-2" aria-busy="true" aria-label="Loading content">${rows.join('')}</div>`;
};
const tableRow = (cols = 4) => {
  const widths = ['w-28', 'w-40', 'w-20', 'w-16'];
  const cells: string[] = [];
  for (let j = 0; j < cols; j++) {
    cells.push(`<td class="px-4 py-3"><div class="${base} h-4 rounded ${widths[j] || 'w-24'}"></div></td>`);
  }
  return `<tr class="border-b border-border">${cells.join('')}</tr>`;
};
const card = () => `<div class="bg-surface-raised border border-border rounded-xl p-6 space-y-4" aria-busy="true" aria-label="Loading content">
  <div class="flex items-center gap-3">
    ${avatar()}
    <div class="flex-1 space-y-2">${line('w-2/3')}${line('w-1/2')}</div>
  </div>
  ${text(3)}
  <div class="flex justify-between">
    <div class="${base} h-6 w-16 rounded"></div>
    <div class="${base} h-6 w-20 rounded"></div>
  </div>
</div>`;

export function buildSkeletonData(): ShowcaseItem[] {
  return [
    {
      id: 'skeleton',
      title: 'Skeleton',
      category: 'Atom',
      abbr: 'Sk',
      description: 'Animated placeholder shown before content loads. Uses animate-pulse bg-surface-sunken. aria-busy="true" ensures accessibility.',
      filePath: 'modules/ui/Skeleton.ejs',
      sourceCode,
      variants: [
        {
          title: 'Lines',
          previewHtml: `<div class="flex justify-center p-4"><div class="w-full max-w-xs space-y-2">${line('w-full')}${line('w-3/4')}${line('w-1/2')}</div></div>`,
          code: `<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-full' }) %>
<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
<%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/2' }) %>`,
        },
        {
          title: 'Text block',
          previewHtml: `<div class="flex justify-center p-4"><div class="w-full max-w-xs">${text(4)}</div></div>`,
          code: `<%- include('modules/ui/Skeleton', { variant: 'text', lines: 4 }) %>`,
        },
        {
          title: 'Card',
          previewHtml: `<div class="flex justify-center p-4"><div class="w-full max-w-sm">${card()}</div></div>`,
          code: `<%- include('modules/ui/Skeleton', { variant: 'card' }) %>`,
        },
        {
          title: 'Table rows',
          previewHtml: `<div class="flex justify-center p-4"><div class="w-full overflow-hidden rounded-lg border border-border"><table class="w-full"><tbody>${tableRow(4)}${tableRow(4)}${tableRow(4)}</tbody></table></div></div>`,
          code: `<table class="w-full"><tbody>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
  <%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %>
</tbody></table>`,
        },
        {
          title: 'Dashboard layout',
          layout: 'stack' as const,
          previewHtml: `<div class="w-full space-y-4 p-4" aria-busy="true">
  <div class="grid grid-cols-3 gap-3">
    <div class="rounded-lg border border-border p-4 space-y-2">${line('w-1/2')}<div class="h-5 bg-surface-sunken animate-pulse rounded w-3/4"></div>${line('w-1/3')}</div>
    <div class="rounded-lg border border-border p-4 space-y-2">${line('w-1/2')}<div class="h-5 bg-surface-sunken animate-pulse rounded w-3/4"></div>${line('w-1/3')}</div>
    <div class="rounded-lg border border-border p-4 space-y-2">${line('w-1/2')}<div class="h-5 bg-surface-sunken animate-pulse rounded w-3/4"></div>${line('w-1/3')}</div>
  </div>
  <div class="rounded-lg border border-border overflow-hidden"><table class="w-full"><tbody>${tableRow(4)}${tableRow(4)}${tableRow(4)}</tbody></table></div>
</div>`,
          code: `<%# Stat cards + table skeleton %>
<div class="space-y-4">
  <div class="grid grid-cols-3 gap-3">
    <% for (var i = 0; i < 3; i++) { %>
      <div class="border rounded-lg p-4 space-y-2">
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/2' }) %>
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
        <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/3' }) %>
      </div>
    <% } %>
  </div>
  <table><tbody><%- include('modules/ui/Skeleton', { variant: 'tableRow', cols: 4 }) %></tbody></table>
</div>`,
        },
        {
          title: 'Article layout',
          layout: 'stack' as const,
          previewHtml: `<div class="flex justify-center p-4"><div class="w-full max-w-md space-y-4" aria-busy="true">
  ${line('w-1/4')}
  <div class="space-y-2">
    <div class="h-6 bg-surface-sunken animate-pulse rounded w-full"></div>
    <div class="h-6 bg-surface-sunken animate-pulse rounded w-3/4"></div>
  </div>
  <div class="flex items-center gap-3">${avatar('h-8 w-8')}${line('w-24')}</div>
  <div class="h-40 bg-surface-sunken animate-pulse rounded-xl w-full"></div>
  ${text(4)}
</div></div>`,
          code: `<%# Blog post / article skeleton %>
<div class="space-y-4">
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-1/4' }) %>
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-full' }) %>
  <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-3/4' }) %>
  <div class="flex items-center gap-3">
    <%- include('modules/ui/Skeleton', { variant: 'avatar', size: 'sm' }) %>
    <%- include('modules/ui/Skeleton', { variant: 'line', width: 'w-24' }) %>
  </div>
  <div class="h-40 animate-pulse bg-surface-sunken rounded-xl"></div>
  <%- include('modules/ui/Skeleton', { variant: 'text', lines: 4 }) %>
</div>`,
        },
      ],
    },
  ];
}
