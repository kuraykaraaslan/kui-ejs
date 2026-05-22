import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Textarea.ejs'), 'utf-8');

// Matches updated Textarea.ejs
const baseTA = 'block w-full rounded-md border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 py-2 text-sm';

function area(opts: {
  id?: string;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  resizeNone?: boolean;
  value?: string;
}) {
  const {
    id = 'ta-' + Math.random().toString(36).slice(2, 6),
    label, rows = 3, placeholder = '', required, disabled, hint, error, resizeNone, value = '',
  } = opts;
  const border = error
    ? 'border-error focus:border-error focus:ring-error/20'
    : 'border-border focus:border-primary hover:border-text-tertiary';
  return `<div class="w-full">
  ${label ? `<label for="${id}" class="block text-sm font-medium text-text-primary mb-1.5">${label}${required ? ' <span class="text-error">*</span>' : ''}</label>` : ''}
  <textarea id="${id}" rows="${rows}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''} class="${baseTA} ${border}${resizeNone ? ' resize-none' : ''}">${value}</textarea>
  ${hint && !error ? `<p class="mt-1.5 text-sm text-text-secondary">${hint}</p>` : ''}
  ${error ? `<p class="mt-1.5 text-sm text-error">${error}</p>` : ''}
</div>`;
}

export function buildTextareaData(): ShowcaseItem[] {
  return [
    {
      id: 'textarea',
      title: 'Textarea',
      category: 'Atom',
      abbr: 'Ta',
      description: 'Label + textarea + hint + error anatomy. Vertical resizing is enabled via resize-y and the parts are linked through aria-describedby.',
      filePath: 'modules/ui/Textarea.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Message', placeholder: 'Enter your message…' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'msg', label: 'Message', placeholder: 'Enter your message…' }) %>`,
        },
        {
          title: 'Required',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Description', required: true, placeholder: 'Required…' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'desc', label: 'Description', required: true }) %>`,
        },
        {
          title: 'With hint',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Bio', placeholder: 'Tell us about yourself', hint: 'Max 500 characters' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'bio', label: 'Bio', hint: 'Max 500 characters', placeholder: 'Tell us about yourself' }) %>`,
        },
        {
          title: 'Error state',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Notes', error: 'This field is required' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'notes', label: 'Notes', error: 'This field is required' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Read-only notes', disabled: true, value: 'This field cannot be edited.' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'ro', label: 'Read-only notes', disabled: true, value: 'This field cannot be edited.' }) %>`,
        },
        {
          title: 'Resize none',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Fixed height', rows: 4, placeholder: 'Cannot be resized…', resizeNone: true })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'fixed', label: 'Fixed height', resize: 'none', rows: 4 }) %>`,
        },
        {
          title: 'Custom rows',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${area({ label: 'Long-form content', rows: 6, placeholder: '6 rows tall…' })}</div>`,
          code: `<%- include('modules/ui/Textarea', { id: 'long', label: 'Long-form content', rows: 6 }) %>`,
        },
      ],
    },
  ];
}
