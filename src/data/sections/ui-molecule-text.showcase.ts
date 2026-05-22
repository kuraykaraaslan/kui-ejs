import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const searchBarSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/SearchBar.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="flex items-center justify-center p-4">${inner}</div>`;
const wrapW = (inner: string) => `<div class="flex items-center justify-center p-4 w-full max-w-xs">${inner}</div>`;

function searchBar(extra = '') {
  return `<div class="relative flex items-center w-full">
  <div class="pointer-events-none absolute left-3 text-sm text-text-tertiary" aria-hidden="true">
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  <input type="search" role="searchbox" placeholder="Search…" autocomplete="off" ${extra}
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors py-2 text-sm pl-9 pr-3">
</div>`;
}

function searchBarWithValue(value: string) {
  return `<div class="relative flex items-center w-full">
  <div class="pointer-events-none absolute left-3 text-sm text-text-tertiary" aria-hidden="true">
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  <input type="search" role="searchbox" value="${value}" autocomplete="off"
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors py-2 text-sm pl-9 pr-8">
  <button type="button" aria-label="Clear search"
    class="absolute right-2 text-text-tertiary hover:text-text-primary transition-colors focus:outline-none rounded">
    <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
  </button>
</div>`;
}

export function buildMoleculeTextData(): ShowcaseItem[] {
  return [
    {
      id: 'search-bar',
      title: 'SearchBar',
      category: 'Molecule',
      abbr: 'Sb',
      description: 'role="searchbox" with search icon and clear button. Works in controlled and uncontrolled modes.',
      filePath: 'modules/ui/SearchBar.ejs',
      sourceCode: searchBarSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapW(searchBar('placeholder="Search components…"')),
          code: `<%- include('modules/ui/SearchBar', { placeholder: 'Search components…' }) %>`,
        },
        {
          title: 'With value (clear button)',
          previewHtml: wrapW(searchBarWithValue('Button')),
          code: `<%- include('modules/ui/SearchBar', { value: 'Button' }) %>`,
        },
        {
          title: 'Small size',
          previewHtml: wrapW(`<div class="relative flex items-center w-full">
  <div class="pointer-events-none absolute left-2.5 text-xs text-text-tertiary" aria-hidden="true">
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  <input type="search" role="searchbox" placeholder="Search…" autocomplete="off"
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors py-1.5 text-sm pl-8 pr-3">
</div>`),
          code: `<%- include('modules/ui/SearchBar', { size: 'sm', placeholder: 'Search…' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapW(searchBar('disabled placeholder="Search is disabled"')),
          code: `<%- include('modules/ui/SearchBar', { placeholder: 'Search is disabled', disabled: true }) %>`,
        },
      ],
    },
  ];
}
