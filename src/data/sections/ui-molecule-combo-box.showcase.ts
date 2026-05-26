import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ComboBox/ComboBox.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="p-4 w-full max-w-sm">${inner}</div>`;

type CbOption = { value: string; label: string; description?: string; disabled?: boolean };

function comboBoxEl(opts: {
  id?: string;
  label?: string;
  options: CbOption[];
  value?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  open?: boolean;
  highlightedIndex?: number;
  noResultsText?: string;
  loading?: boolean;
}) {
  const id = opts.id || `cb-${Math.random().toString(36).substr(2, 5)}`;
  const labelId = `${id}-label`;
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const clearable = opts.clearable !== false;
  const placeholder = opts.placeholder || 'Search or select...';
  const selectedOption = opts.options.find((o) => o.value === opts.value);
  const selectedLabel = selectedOption ? selectedOption.label : '';

  const rootStateClass = opts.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';
  const rootDisabledClass = opts.disabled ? ' cursor-not-allowed bg-surface-sunken opacity-50' : '';

  const optionItems = opts.options.map((opt, index) => {
    const isSelected = opt.value === opts.value;
    const isHighlighted = opts.highlightedIndex === index;
    return `<li id="${id}-option-${index}" role="option" aria-selected="${isSelected ? 'true' : 'false'}" data-combobox-option data-value="${opt.value}" data-label="${opt.label}" data-description="${opt.description || ''}" data-index="${index}"${opt.disabled ? ' data-disabled="true"' : ''}>
        <button type="button"${opt.disabled ? ' disabled' : ''} class="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none hover:bg-surface-overlay${isSelected ? ' font-medium text-primary' : ''}${isHighlighted ? ' bg-surface-overlay' : ''}${opt.disabled ? ' cursor-not-allowed opacity-50' : ''}">
          <span class="min-w-0 flex-1">
            <span class="block truncate">${opt.label}</span>
            ${opt.description ? `<span class="block truncate text-xs text-text-secondary">${opt.description}</span>` : ''}
          </span>
        </button>
      </li>`;
  }).join('');

  const listHidden = opts.open ? '' : ' hidden';

  return `<div id="${id}" class="space-y-1" data-combobox-root data-value="${opts.value || ''}">
  <label id="${labelId}" for="${inputId}" class="block text-sm font-medium text-text-primary">
    ${opts.label || ''}${opts.required ? '<span class="ml-1 text-error" aria-hidden="true">*</span>' : ''}
  </label>
  <div role="combobox" aria-expanded="${opts.open ? 'true' : 'false'}" aria-haspopup="listbox" aria-controls="${listboxId}" aria-labelledby="${labelId}" aria-disabled="${opts.disabled ? 'true' : 'false'}" aria-invalid="${opts.error ? 'true' : 'false'}" data-combobox-shell class="flex min-h-10 w-full items-center gap-2 rounded-md border bg-surface-base px-3 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-border-focus ${rootStateClass}${rootDisabledClass}">
    <input id="${inputId}" type="text" role="searchbox"${opts.disabled ? ' disabled' : ''}${opts.required ? ' required' : ''} value="${selectedLabel}" placeholder="${placeholder}" aria-autocomplete="list" autocomplete="off" data-combobox-input class="w-full bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"/>
    ${clearable ? `<button type="button" aria-label="Clear selection" data-combobox-clear class="rounded px-1 text-text-disabled transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus${(!opts.value || opts.disabled) ? ' hidden' : ''}"><i class="fa-solid fa-xmark" aria-hidden="true" style="width:0.75rem;height:0.75rem"></i></button>` : ''}
    <i aria-hidden="true" data-combobox-caret class="fa-solid fa-chevron-${opts.open ? 'up' : 'down'} select-none text-text-disabled" style="width:0.75rem;height:0.75rem"></i>
  </div>
  <ul id="${listboxId}" role="listbox" data-combobox-list class="z-20 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface-raised py-1 shadow-lg${listHidden}">
    ${opts.loading
      ? `<li class="px-3 py-2"><div class="h-3 w-full animate-pulse rounded bg-surface-overlay"></div></li>
         <li class="px-3 py-2"><div class="h-3 w-full animate-pulse rounded bg-surface-overlay"></div></li>
         <li class="px-3 py-2"><div class="h-3 w-full animate-pulse rounded bg-surface-overlay"></div></li>`
      : optionItems}
    <li data-combobox-empty class="hidden px-3 py-3 text-sm text-text-secondary">${opts.noResultsText || 'No results found.'}</li>
  </ul>
  ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
  ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
</div>`;
}

const COUNTRIES: CbOption[] = [
  { value: 'tr', label: 'Türkiye',        description: 'TR · +90' },
  { value: 'de', label: 'Germany',        description: 'DE · +49' },
  { value: 'fr', label: 'France',         description: 'FR · +33' },
  { value: 'us', label: 'United States',  description: 'US · +1'  },
  { value: 'jp', label: 'Japan',          description: 'JP · +81' },
];

const FRAMEWORKS: CbOption[] = [
  { value: 'next',    label: 'Next.js'    },
  { value: 'nuxt',    label: 'Nuxt'       },
  { value: 'remix',   label: 'Remix'      },
  { value: 'astro',   label: 'Astro'      },
  { value: 'sveltek', label: 'SvelteKit', disabled: true },
];

export function buildComboBoxData(): ShowcaseItem[] {
  return [
    {
      id: 'combo-box',
      title: 'ComboBox',
      category: 'Molecule',
      abbr: 'Cm',
      description: 'Searchable autocomplete single-select with keyboard navigation, described options, and a clearable button.',
      filePath: 'modules/ui/ComboBox/ComboBox.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: wrap(comboBoxEl({
            label: 'Country',
            options: COUNTRIES,
            placeholder: 'Search countries…',
            hint: 'Start typing to filter.',
          })),
          code: `<%- include('modules/ui/ComboBox', {
  label: 'Country',
  placeholder: 'Search countries…',
  hint: 'Start typing to filter.',
  options: [
    { value: 'tr', label: 'Türkiye',       description: 'TR · +90' },
    { value: 'de', label: 'Germany',       description: 'DE · +49' },
    { value: 'us', label: 'United States', description: 'US · +1'  },
  ]
}) %>`,
        },
        {
          title: 'With selected value',
          previewHtml: wrap(comboBoxEl({
            label: 'Country',
            options: COUNTRIES,
            value: 'tr',
          })),
          code: `<%- include('modules/ui/ComboBox', {
  label: 'Country',
  value: 'tr',
  options: COUNTRIES
}) %>`,
        },
        {
          title: 'Open with highlight',
          previewHtml: wrap(comboBoxEl({
            label: 'Framework',
            options: FRAMEWORKS,
            value: 'next',
            open: true,
            highlightedIndex: 1,
          })),
          code: `<%- include('modules/ui/ComboBox', {
  label: 'Framework',
  value: 'next',
  options: FRAMEWORKS
}) %>`,
        },
        {
          title: 'Error state',
          previewHtml: wrap(comboBoxEl({
            label: 'Country',
            options: COUNTRIES,
            required: true,
            error: 'Please select a country.',
          })),
          code: `<%- include('modules/ui/ComboBox', {
  label: 'Country',
  required: true,
  error: 'Please select a country.',
  options: COUNTRIES
}) %>`,
        },
        {
          title: 'Async loading (debounced)',
          previewHtml: wrap(comboBoxEl({
            label: 'Search',
            options: [],
            open: true,
            loading: true,
            placeholder: 'Type to search…',
            hint: 'Debounced 300ms, AbortController cancels in-flight, 5-min cache.',
          })),
          code: `<%- include('modules/ui/ComboBox', {
  id: 'cb-async',
  label: 'Search',
  options: [],
  placeholder: 'Type to search…',
  hint: 'Debounced 300ms, AbortController cancels in-flight.'
}) %>

<script>
  // Wire an async resolver to the combobox root.
  var root = document.getElementById('cb-async');
  ComboBoxAsync.register(root, async function (query, signal) {
    var res = await fetch('/api/suggest?q=' + encodeURIComponent(query), { signal });
    var data = await res.json();
    // Render <li data-combobox-option> nodes into root.querySelector('[data-combobox-list]')
    return data;
  });
</script>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrap(comboBoxEl({
            label: 'Country',
            options: COUNTRIES,
            value: 'de',
            disabled: true,
          })),
          code: `<%- include('modules/ui/ComboBox', {
  label: 'Country',
  value: 'de',
  disabled: true,
  options: COUNTRIES
}) %>`,
        },
      ],
    },
  ];
}
