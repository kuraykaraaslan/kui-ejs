import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Spinner.ejs'), 'utf-8');

const spinner = (cls: string) =>
  `<span aria-hidden="true" class="inline-block rounded-full border-border border-t-primary animate-spin ${cls}"></span>`;

const btnBase = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed';

export function buildSpinnerData(): ShowcaseItem[] {
  return [
    {
      id: 'spinner',
      title: 'Spinner',
      category: 'Atom',
      abbr: 'Sp',
      description: 'CSS border-based loading indicator. Does not require FontAwesome. 5 sizes, border-border / border-t-primary colour system.',
      filePath: 'modules/ui/Spinner.ejs',
      sourceCode,
      variants: [
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-4 p-4">
  ${spinner('h-3 w-3 border')}
  ${spinner('h-4 w-4 border-2')}
  ${spinner('h-6 w-6 border-2')}
  ${spinner('h-8 w-8 border-[3px]')}
  ${spinner('h-12 w-12 border-4')}
</div>`,
          code: `<%- include('modules/ui/Spinner', { size: 'xs' }) %>
<%- include('modules/ui/Spinner', { size: 'sm' }) %>
<%- include('modules/ui/Spinner', { size: 'md' }) %>
<%- include('modules/ui/Spinner', { size: 'lg' }) %>
<%- include('modules/ui/Spinner', { size: 'xl' }) %>`,
        },
        {
          title: 'In a Button',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <button type="button" disabled aria-busy="true" class="${btnBase} bg-primary text-primary-fg px-4 py-2 text-sm">
    ${spinner('h-4 w-4 border-2')}Saving…
  </button>
  <button type="button" disabled aria-busy="true" class="${btnBase} border border-border text-text-primary px-4 py-2 text-sm">
    ${spinner('h-4 w-4 border-2')}Loading details
  </button>
</div>`,
          code: `<%- include('modules/ui/Button', { variant: 'primary', loading: true, children: 'Saving…' }) %>
<%- include('modules/ui/Button', { variant: 'outline', loading: true, children: 'Loading details' }) %>`,
        },
      ],
    },
  ];
}
