import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Badge.ejs'), 'utf-8');

const base = 'inline-flex items-center gap-1 rounded-full font-medium';
const md   = 'px-2 py-0.5 text-xs';
const wrap = (inner: string) => `<div class="flex items-center justify-center p-4">${inner}</div>`;
const badge = (color: string, label: string) => `<span class="${base} ${color} ${md}">${label}</span>`;

export function buildBadgeData(): ShowcaseItem[] {
  return [
    {
      id: 'badge',
      title: 'Badge',
      category: 'Atom',
      abbr: 'Bg',
      description: 'Status, category or label indicator. 6 semantic variants, 3 sizes, dot and dismissible support.',
      filePath: 'modules/ui/Badge.ejs',
      sourceCode,
      variants: [
        {
          title: 'Success',
          previewHtml: wrap(badge('bg-success-subtle text-success-fg', 'Active')),
          code: `<%- include('modules/ui/Badge', { variant: 'success', children: 'Active' }) %>`,
        },
        {
          title: 'Error',
          previewHtml: wrap(badge('bg-error-subtle text-error-fg', 'Inactive')),
          code: `<%- include('modules/ui/Badge', { variant: 'error', children: 'Inactive' }) %>`,
        },
        {
          title: 'Warning',
          previewHtml: wrap(badge('bg-warning-subtle text-warning-fg', 'Pending')),
          code: `<%- include('modules/ui/Badge', { variant: 'warning', children: 'Pending' }) %>`,
        },
        {
          title: 'Info',
          previewHtml: wrap(badge('bg-info-subtle text-info-fg', 'New')),
          code: `<%- include('modules/ui/Badge', { variant: 'info', children: 'New' }) %>`,
        },
        {
          title: 'Neutral',
          previewHtml: wrap(badge('bg-surface-sunken text-text-secondary', 'Design')),
          code: `<%- include('modules/ui/Badge', { variant: 'neutral', children: 'Design' }) %>`,
        },
        {
          title: 'Primary',
          previewHtml: wrap(badge('bg-primary-subtle text-primary', 'Frontend')),
          code: `<%- include('modules/ui/Badge', { variant: 'primary', children: 'Frontend' }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <span class="${base} bg-primary-subtle text-primary px-1.5 py-0 text-[10px]">Small</span>
  <span class="${base} bg-primary-subtle text-primary px-2 py-0.5 text-xs">Medium</span>
  <span class="${base} bg-primary-subtle text-primary px-3 py-1 text-sm">Large</span>
</div>`,
          code: `<%- include('modules/ui/Badge', { variant: 'primary', size: 'sm', children: 'Small' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', size: 'md', children: 'Medium' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', size: 'lg', children: 'Large' }) %>`,
        },
        {
          title: 'Dot badge',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <span class="${base} bg-success-subtle text-success-fg ${md}"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-success" aria-hidden="true"></span>Online</span>
  <span class="${base} bg-warning-subtle text-warning-fg ${md}"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-warning" aria-hidden="true"></span>Away</span>
  <span class="${base} bg-error-subtle text-error-fg ${md}"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-error" aria-hidden="true"></span>Busy</span>
  <span class="${base} bg-surface-sunken text-text-secondary ${md}"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-text-disabled" aria-hidden="true"></span>Offline</span>
</div>`,
          code: `<%- include('modules/ui/Badge', { variant: 'success', dot: true, children: 'Online' }) %>
<%- include('modules/ui/Badge', { variant: 'warning', dot: true, children: 'Away' }) %>
<%- include('modules/ui/Badge', { variant: 'error', dot: true, children: 'Busy' }) %>
<%- include('modules/ui/Badge', { variant: 'neutral', dot: true, children: 'Offline' }) %>`,
        },
        {
          title: 'Dismissible',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-2 p-4">
  <span class="${base} bg-primary-subtle text-primary ${md}">React<button type="button" aria-label="Remove" class="ml-0.5 leading-none hover:opacity-70 transition-opacity focus-visible:outline-none rounded-full"><i class="fa-solid fa-xmark" style="width:.625rem;height:.625rem" aria-hidden="true"></i></button></span>
  <span class="${base} bg-primary-subtle text-primary ${md}">TypeScript<button type="button" aria-label="Remove" class="ml-0.5 leading-none hover:opacity-70 transition-opacity focus-visible:outline-none rounded-full"><i class="fa-solid fa-xmark" style="width:.625rem;height:.625rem" aria-hidden="true"></i></button></span>
  <span class="${base} bg-primary-subtle text-primary ${md}">Tailwind<button type="button" aria-label="Remove" class="ml-0.5 leading-none hover:opacity-70 transition-opacity focus-visible:outline-none rounded-full"><i class="fa-solid fa-xmark" style="width:.625rem;height:.625rem" aria-hidden="true"></i></button></span>
</div>`,
          code: `<%- include('modules/ui/Badge', { variant: 'primary', dismissible: true, children: 'React' }) %>
<%- include('modules/ui/Badge', { variant: 'primary', dismissible: true, children: 'TypeScript' }) %>`,
        },
      ],
    },
  ];
}
