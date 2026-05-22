import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Checkbox.ejs'), 'utf-8');

// Matches updated Checkbox.ejs
function checkbox(opts: {
  id?: string;
  label?: string;
  hint?: string;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const {
    id = 'cb-' + Math.random().toString(36).slice(2, 7),
    label, hint, checked = false, disabled = false, error = false,
    size = 'md',
  } = opts;
  const boxClass = { sm: 'w-3.5 h-3.5 text-xs', md: 'w-4 h-4 text-sm', lg: 'w-5 h-5 text-base' }[size];
  const disClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return `<div class="flex items-start">
  <div class="flex items-center h-5">
    <input id="${id}" type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} class="rounded border-border text-primary focus:ring-primary/20 bg-surface ${boxClass} ${disClass}">
  </div>
  ${label || hint ? `<div class="ml-3 text-sm">
    ${label ? `<label for="${id}" class="font-medium text-text-primary ${disClass}">${label}</label>` : ''}
    ${hint ? `<p class="text-text-secondary mt-0.5 ${error ? 'text-error' : ''}">${hint}</p>` : ''}
  </div>` : ''}
</div>`;
}

export function buildCheckboxData(): ShowcaseItem[] {
  return [
    {
      id: 'checkbox',
      title: 'Checkbox',
      category: 'Atom',
      abbr: 'Cb',
      description: 'Label + checkbox + optional hint / error message. aria-describedby is wired up and border-error is applied on the error state.',
      filePath: 'modules/ui/Checkbox.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="flex justify-center p-4">${checkbox({ label: 'Accept terms and conditions' })}</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Accept terms and conditions' }) %>`,
        },
        {
          title: 'Checked',
          previewHtml: `<div class="flex justify-center p-4">${checkbox({ label: 'Remember me', checked: true })}</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Remember me', checked: true }) %>`,
        },
        {
          title: 'With hint',
          previewHtml: `<div class="flex justify-center p-4">${checkbox({ label: 'Subscribe to newsletter', hint: 'We send at most one email per week' })}</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Subscribe to newsletter', hint: 'We send at most one email per week' }) %>`,
        },
        {
          title: 'Error state',
          previewHtml: `<div class="flex justify-center p-4">${checkbox({ label: 'Accept terms', hint: 'You must accept the terms to continue', error: true })}</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb', label: 'Accept terms', hint: 'You must accept the terms', error: true }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: `<div class="flex flex-col items-start gap-3 p-4">
  ${checkbox({ label: 'Option A (disabled)', disabled: true })}
  ${checkbox({ label: 'Option B (disabled, checked)', checked: true, disabled: true })}
</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb1', label: 'Option A', disabled: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb2', label: 'Option B', checked: true, disabled: true }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-col items-start gap-3 p-4">
  ${checkbox({ size: 'sm', label: 'Small',  checked: true })}
  ${checkbox({ size: 'md', label: 'Medium', checked: true })}
  ${checkbox({ size: 'lg', label: 'Large',  checked: true })}
</div>`,
          code: `<%- include('modules/ui/Checkbox', { id: 'cb1', label: 'Small',  size: 'sm', checked: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb2', label: 'Medium', size: 'md', checked: true }) %>
<%- include('modules/ui/Checkbox', { id: 'cb3', label: 'Large',  size: 'lg', checked: true }) %>`,
        },
      ],
    },
  ];
}
