import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/MultiSelect.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="p-4 w-full max-w-sm">${inner}</div>`;

type MsOption = { value: string; label: string; disabled?: boolean };

function multiSelectEl(opts: {
  id?: string;
  label?: string;
  options: MsOption[];
  value?: string[];
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  open?: boolean;
}) {
  const id = opts.id || `ms-${Math.random().toString(36).substr(2, 5)}`;
  const labelId = `${id}-label`;
  const value = opts.value || [];
  const placeholder = opts.placeholder || 'Select…';

  const shellStateClass = opts.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border bg-surface-base';
  const shellDisabledClass = opts.disabled ? ' opacity-50 cursor-not-allowed bg-surface-sunken' : '';

  const chips = value.map((v) => {
    const opt = opts.options.find((o) => o.value === v);
    const label = opt ? opt.label : v;
    return `<span data-multiselect-chip data-value="${v}" class="inline-flex items-center gap-1 rounded-full bg-primary-subtle text-primary text-xs font-medium px-2 py-0.5">
        ${label}
        <button type="button" aria-label="Remove ${label}" data-multiselect-chip-remove class="hover:opacity-70 focus-visible:outline-none">
          <i class="fa-solid fa-xmark" style="width:0.625rem;height:0.625rem" aria-hidden="true"></i>
        </button>
      </span>`;
  }).join('');

  const optionItems = opts.options.map((opt) => {
    const checked = value.includes(opt.value);
    return `<li role="option" aria-selected="${checked ? 'true' : 'false'}" aria-disabled="${opt.disabled ? 'true' : 'false'}" tabindex="${opt.disabled ? -1 : 0}" data-multiselect-option data-value="${opt.value}" data-label="${opt.label}"${opt.disabled ? ' data-disabled="true"' : ''} class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay${checked ? ' text-primary font-medium' : ''}${opt.disabled ? ' opacity-50 cursor-not-allowed' : ''}">
        <span aria-hidden="true" data-multiselect-box class="h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 text-[10px] ${checked ? 'bg-primary border-primary text-primary-fg' : 'border-border bg-surface-base'}">
          <i class="fa-solid fa-check${checked ? '' : ' hidden'}" style="width:0.625rem;height:0.625rem" aria-hidden="true"></i>
        </span>
        ${opt.label}
      </li>`;
  }).join('');

  const popoverHidden = opts.open ? '' : ' hidden';
  const expanded = opts.open ? 'true' : 'false';

  return `<div id="${id}-root" class="space-y-1" data-multiselect-root>
  <label id="${labelId}" class="block text-sm font-medium text-text-primary">${opts.label || ''}</label>
  <div class="relative">
    <div role="combobox" tabindex="${opts.disabled ? -1 : 0}" aria-haspopup="listbox" aria-expanded="${expanded}" aria-labelledby="${labelId}" aria-disabled="${opts.disabled ? 'true' : 'false'}" id="${id}" data-multiselect-shell class="min-h-[2.5rem] w-full rounded-md border px-3 py-1.5 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus flex flex-wrap gap-1 items-center ${shellStateClass}${shellDisabledClass}">
      <span data-multiselect-placeholder class="text-text-disabled${value.length > 0 ? ' hidden' : ''}">${placeholder}</span>
      <span data-multiselect-chips class="contents">${chips}</span>
      <i data-multiselect-caret class="fa-solid fa-chevron-${opts.open ? 'up' : 'down'} ml-auto text-text-disabled" style="width:0.75rem;height:0.75rem" aria-hidden="true"></i>
    </div>
    <div data-multiselect-popover class="absolute z-20 w-full rounded-md border border-border bg-surface-raised shadow-lg overflow-hidden top-full left-0 mt-1${popoverHidden}">
      ${opts.searchable ? `<div class="p-2 border-b border-border">
        <input type="text" data-multiselect-search placeholder="Search…" class="block w-full rounded-md border border-border bg-surface-base px-3 py-1.5 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"/>
      </div>` : ''}
      <ul role="listbox" aria-labelledby="${labelId}" aria-multiselectable="true" data-multiselect-list class="py-1 max-h-48 overflow-y-auto">
        ${optionItems}
      </ul>
    </div>
  </div>
  ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
  ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
</div>`;
}

const SKILLS: MsOption[] = [
  { value: 'react',      label: 'React'      },
  { value: 'vue',        label: 'Vue'        },
  { value: 'angular',    label: 'Angular'    },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs',     label: 'Node.js'    },
];

const ROLES: MsOption[] = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest',  label: 'Guest', disabled: true },
];

export function buildMultiSelectData(): ShowcaseItem[] {
  return [
    {
      id: 'multi-select',
      title: 'MultiSelect',
      category: 'Molecule',
      abbr: 'Ms',
      description: 'Chip tabanlı çoklu seçim popover. Searchable filtre, klavye navigasyonu ve disabled option desteği ile birlikte gelir.',
      filePath: 'modules/ui/MultiSelect.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default with selections',
          previewHtml: wrap(multiSelectEl({
            label: 'Skills',
            options: SKILLS,
            value: ['react', 'typescript'],
            hint: 'Pick the technologies you know.',
          })),
          code: `<%- include('modules/ui/MultiSelect', {
  label: 'Skills',
  options: [
    { value: 'react',      label: 'React'      },
    { value: 'vue',        label: 'Vue'        },
    { value: 'typescript', label: 'TypeScript' },
  ],
  value: ['react', 'typescript'],
  hint: 'Pick the technologies you know.'
}) %>`,
        },
        {
          title: 'Searchable open',
          previewHtml: wrap(multiSelectEl({
            label: 'Skills',
            options: SKILLS,
            value: ['react'],
            searchable: true,
            open: true,
          })),
          code: `<%- include('modules/ui/MultiSelect', {
  label: 'Skills',
  options: SKILLS,
  value: ['react'],
  searchable: true
}) %>`,
        },
        {
          title: 'Empty placeholder',
          previewHtml: wrap(multiSelectEl({
            label: 'Roles',
            options: ROLES,
            placeholder: 'Choose roles…',
          })),
          code: `<%- include('modules/ui/MultiSelect', {
  label: 'Roles',
  options: ROLES,
  placeholder: 'Choose roles…'
}) %>`,
        },
        {
          title: 'Error state',
          previewHtml: wrap(multiSelectEl({
            label: 'Roles',
            options: ROLES,
            error: 'Please pick at least one role.',
          })),
          code: `<%- include('modules/ui/MultiSelect', {
  label: 'Roles',
  options: ROLES,
  error: 'Please pick at least one role.'
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrap(multiSelectEl({
            label: 'Skills',
            options: SKILLS,
            value: ['react', 'typescript'],
            disabled: true,
          })),
          code: `<%- include('modules/ui/MultiSelect', {
  label: 'Skills',
  options: SKILLS,
  value: ['react', 'typescript'],
  disabled: true
}) %>`,
        },
      ],
    },
  ];
}
