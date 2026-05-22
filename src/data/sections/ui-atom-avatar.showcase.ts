import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Avatar.ejs'), 'utf-8');

const initials = (cls: string, label: string) =>
  `<span aria-label="${label}" class="${cls} rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center border border-primary-subtle select-none shrink-0">${label.trim().split(/\s+/).map((w: string) => w[0]).slice(0,2).join('').toUpperCase()}</span>`;

const dot = (color: string) =>
  `<span class="absolute bottom-0 right-0 rounded-full border-2 border-surface-base ${color} h-2.5 w-2.5"></span>`;

export function buildAvatarData(): ShowcaseItem[] {
  return [
    {
      id: 'avatar',
      title: 'Avatar',
      category: 'Atom',
      abbr: 'Av',
      description: 'User profile photo or initials indicator. 5 sizes with optional status dot. When no image is provided, initials render on a bg-primary-subtle / text-primary tile.',
      filePath: 'modules/ui/Avatar.ejs',
      sourceCode,
      variants: [
        {
          title: 'Initials (sizes)',
          previewHtml: `<div class="flex flex-wrap items-end justify-center gap-3 p-4">
  ${initials('h-6 w-6 text-xs',    'Jane Doe')}
  ${initials('h-8 w-8 text-xs',    'Jane Doe')}
  ${initials('h-10 w-10 text-sm',  'Jane Doe')}
  ${initials('h-12 w-12 text-base','Jane Doe')}
  ${initials('h-16 w-16 text-lg',  'Jane Doe')}
</div>`,
          code: `<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'xs' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'sm' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'md' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'lg' }) %>
<%- include('modules/ui/Avatar', { name: 'Jane Doe', size: 'xl' }) %>`,
        },
        {
          title: 'With label',
          previewHtml: `<div class="flex items-center gap-3 p-4">
  ${initials('h-10 w-10 text-sm', 'John Smith')}
  <div>
    <p class="text-sm font-medium text-text-primary">John Smith</p>
    <p class="text-xs text-text-secondary">john@example.com</p>
  </div>
</div>`,
          code: `<div class="flex items-center gap-3">
  <%- include('modules/ui/Avatar', { name: 'John Smith' }) %>
  <div>
    <p class="text-sm font-medium text-text-primary">John Smith</p>
    <p class="text-xs text-text-secondary">john@example.com</p>
  </div>
</div>`,
        },
        {
          title: 'Status dot',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-4 p-4">
  <span class="relative inline-flex shrink-0">${initials('h-10 w-10 text-sm','Alice')}${dot('bg-success')}</span>
  <span class="relative inline-flex shrink-0">${initials('h-10 w-10 text-sm','Bob')}${dot('bg-warning')}</span>
  <span class="relative inline-flex shrink-0">${initials('h-10 w-10 text-sm','Carol')}${dot('bg-error')}</span>
  <span class="relative inline-flex shrink-0">${initials('h-10 w-10 text-sm','Dave')}${dot('bg-text-disabled')}</span>
</div>`,
          code: `<%- include('modules/ui/Avatar', { name: 'Alice', status: 'online' }) %>
<%- include('modules/ui/Avatar', { name: 'Bob',   status: 'away' }) %>
<%- include('modules/ui/Avatar', { name: 'Carol', status: 'busy' }) %>
<%- include('modules/ui/Avatar', { name: 'Dave',  status: 'offline' }) %>`,
        },
        {
          title: 'Image source',
          previewHtml: `<div class="flex items-center gap-4 p-4">
  <img src="https://i.pravatar.cc/80?img=47" alt="Jane Doe" class="h-10 w-10 rounded-full object-cover border border-border shrink-0" />
  <img src="https://i.pravatar.cc/80?img=47" alt="Jane Doe" class="h-10 w-10 rounded-full object-cover border border-border shrink-0" />
  <div>
    <p class="text-sm font-medium text-text-primary">Image source</p>
    <p class="text-xs text-text-secondary">Same sizing and status rules apply</p>
  </div>
</div>`,
          code: `<%- include('modules/ui/Avatar', { src: '/avatars/jane.jpg', name: 'Jane Doe' }) %>`,
        },
      ],
    },
  ];
}
