import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Input.ejs'), 'utf-8');

const baseInput = 'block w-full rounded-md border bg-surface-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const defaultBorder = 'border-border hover:border-border-strong';
const errorBorder   = 'border-error ring-1 ring-error bg-error-subtle';

function field(opts: {
  id?: string;
  label?: string;
  type?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  iconLeft?: string;
  isPassword?: boolean;
}) {
  const {
    id = 'i-' + Math.random().toString(36).slice(2, 6),
    label, type = 'text', size = 'md', placeholder = '', required,
    disabled, hint, error, iconLeft, isPassword,
  } = opts;
  const sc = { sm: 'px-2.5 py-1.5 text-sm', md: 'px-3 py-2 text-sm', lg: 'px-4 py-3 text-base' }[size];
  const border = error ? errorBorder : defaultBorder;
  const pl = iconLeft ? ' pl-9' : '';
  return `<div class="w-full">
  ${label ? `<label for="${id}" class="block text-sm font-medium text-text-primary mb-1.5">${label}${required ? ' <span class="text-error">*</span>' : ''}</label>` : ''}
  <div class="relative">
    ${iconLeft ? `<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-disabled"><i class="${iconLeft}" aria-hidden="true"></i></div>` : ''}
    <input type="${isPassword ? 'password' : type}" id="${id}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''} class="${baseInput} ${border} ${sc}${pl}">
  </div>
  ${hint && !error ? `<p class="mt-1.5 text-sm text-text-secondary">${hint}</p>` : ''}
  ${error ? `<p class="mt-1.5 text-sm text-error">${error}</p>` : ''}
</div>`;
}

export function buildInputData(): ShowcaseItem[] {
  return [
    {
      id: 'input',
      title: 'Input',
      category: 'Atom',
      abbr: 'In',
      description: 'Text input field with label, hint, error, prefix icon, password toggle, and 3 size variants.',
      filePath: 'modules/ui/Input.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Email address', placeholder: 'you@example.com' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'email', label: 'Email address', placeholder: 'you@example.com' }) %>`,
        },
        {
          title: 'Required',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Full name', required: true, placeholder: 'Jane Doe' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'name', label: 'Full name', required: true, placeholder: 'Jane Doe' }) %>`,
        },
        {
          title: 'With hint',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Username', placeholder: 'john_doe', hint: 'Letters, numbers and underscores only' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'user', label: 'Username', hint: 'Letters, numbers and underscores only' }) %>`,
        },
        {
          title: 'Error state',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Email address', placeholder: 'you@example.com', error: 'Enter a valid email address' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'email', label: 'Email address', error: 'Enter a valid email address' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Account ID', placeholder: 'acc-00123', disabled: true })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'acc', label: 'Account ID', disabled: true }) %>`,
        },
        {
          title: 'Password',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Password', isPassword: true, placeholder: '••••••••' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'pw', label: 'Password', type: 'password', placeholder: '••••••••' }) %>`,
        },
        {
          title: 'Prefix icon',
          previewHtml: `<div class="p-4 max-w-sm mx-auto w-full">${field({ label: 'Search', placeholder: 'Search…', iconLeft: 'fa-solid fa-magnifying-glass' })}</div>`,
          code: `<%- include('modules/ui/Input', { id: 'search', label: 'Search', iconLeft: '<i class=\\"fa-solid fa-magnifying-glass\\"></i>', placeholder: 'Search…' }) %>`,
        },
        {
          title: 'Sizes',
          layout: 'stack' as const,
          previewHtml: `<div class="flex flex-col gap-3 p-4 max-w-sm mx-auto w-full">
  ${field({ label: 'Small',  size: 'sm', placeholder: 'sm size…' })}
  ${field({ label: 'Medium', size: 'md', placeholder: 'md size…' })}
  ${field({ label: 'Large',  size: 'lg', placeholder: 'lg size…' })}
</div>`,
          code: `<%- include('modules/ui/Input', { id: 'sm', label: 'Small',  size: 'sm' }) %>
<%- include('modules/ui/Input', { id: 'md', label: 'Medium', size: 'md' }) %>
<%- include('modules/ui/Input', { id: 'lg', label: 'Large',  size: 'lg' }) %>`,
        },
      ],
    },
  ];
}
