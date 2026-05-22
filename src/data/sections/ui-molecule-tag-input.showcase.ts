import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/TagInput.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="p-4 w-full max-w-md">${inner}</div>`;

function tagInputEl(opts: {
  id?: string;
  label?: string;
  value?: string[];
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const id = opts.id || `ti-${Math.random().toString(36).substr(2, 5)}`;
  const value = opts.value || [];
  const placeholder = opts.placeholder || 'Type and press Enter or comma…';

  let shellClass = 'flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border px-3 py-2 transition-colors cursor-text focus-within:ring-2 focus-within:ring-border-focus focus-within:border-border-focus';
  if (opts.disabled) shellClass += ' opacity-50 cursor-not-allowed bg-surface-sunken border-border';
  else shellClass += ' bg-surface-base border-border';
  if (opts.error) shellClass += ' border-error ring-1 ring-error bg-error-subtle';

  const chips = value.map((tag) => `<span data-taginput-chip data-value="${tag}" title="Double-click to edit" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-subtle text-primary">
        <span data-taginput-chip-label>${tag}</span>
        ${!opts.disabled ? `<button type="button" aria-label="Remove ${tag}" data-taginput-chip-remove class="hover:opacity-70 focus-visible:outline-none rounded-full">
          <i class="fa-solid fa-xmark" style="width:0.625rem;height:0.625rem" aria-hidden="true"></i>
        </button>` : ''}
      </span>`).join('');

  const inputEl = !opts.disabled
    ? `<input id="${id}" type="text" data-taginput-input${value.length === 0 ? ` placeholder="${placeholder}"` : ''} class="flex-1 min-w-24 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"/>`
    : '';

  return `<div id="${id}-root" class="space-y-1" data-taginput-root>
  <label for="${id}" class="block text-sm font-medium text-text-primary">${opts.label || ''}</label>
  <div data-taginput-shell class="${shellClass}">
    <span data-taginput-chips class="contents">${chips}</span>
    ${inputEl}
  </div>
  ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
  ${!opts.hint && !opts.error && value.length > 0 ? '<p class="text-xs text-text-disabled">Double-click a tag to edit it</p>' : ''}
  ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
</div>`;
}

export function buildTagInputData(): ShowcaseItem[] {
  return [
    {
      id: 'tag-input',
      title: 'TagInput',
      category: 'Molecule',
      abbr: 'Ti',
      description: 'Chip oluşturan free-text input. Enter veya virgül ile yeni etiket, çift tıkla düzenleme ve Backspace ile silme desteği.',
      filePath: 'modules/ui/TagInput.ejs',
      sourceCode,
      variants: [
        {
          title: 'With initial tags',
          previewHtml: wrap(tagInputEl({
            label: 'Tags',
            value: ['design', 'frontend', 'accessibility'],
          })),
          code: `<%- include('modules/ui/TagInput', {
  label: 'Tags',
  value: ['design', 'frontend', 'accessibility']
}) %>`,
        },
        {
          title: 'Empty with hint',
          previewHtml: wrap(tagInputEl({
            label: 'Keywords',
            hint: 'Press Enter or comma to add a keyword.',
          })),
          code: `<%- include('modules/ui/TagInput', {
  label: 'Keywords',
  hint: 'Press Enter or comma to add a keyword.'
}) %>`,
        },
        {
          title: 'Error state',
          previewHtml: wrap(tagInputEl({
            label: 'Tags',
            value: ['only-one'],
            error: 'Please add at least 3 tags.',
          })),
          code: `<%- include('modules/ui/TagInput', {
  label: 'Tags',
  value: ['only-one'],
  error: 'Please add at least 3 tags.'
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrap(tagInputEl({
            label: 'Locked tags',
            value: ['react', 'typescript'],
            disabled: true,
          })),
          code: `<%- include('modules/ui/TagInput', {
  label: 'Locked tags',
  value: ['react', 'typescript'],
  disabled: true
}) %>`,
        },
      ],
    },
  ];
}
