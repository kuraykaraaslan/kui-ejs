import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ButtonGroup.ejs'), 'utf-8');

const btnBase = 'font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm';

function group(opts: {
  items: { value: string; label: string; disabled?: boolean }[];
  active: string;
  variant?: 'outline' | 'primary' | 'secondary' | 'ghost';
  size?: string;
}) {
  const { items, active, variant = 'outline' } = opts;
  const vc = {
    outline:   { wrap: 'inline-flex rounded-md overflow-hidden border border-border divide-x divide-border', on: 'bg-surface-overlay font-semibold text-text-primary', off: 'bg-surface-base hover:bg-surface-overlay text-text-primary' },
    primary:   { wrap: 'inline-flex rounded-md overflow-hidden', on: 'bg-primary text-primary-fg rounded-none',    off: 'bg-primary/20 hover:bg-primary/40 text-primary-fg rounded-none' },
    secondary: { wrap: 'inline-flex rounded-md overflow-hidden', on: 'bg-secondary text-secondary-fg rounded-none', off: 'bg-secondary/20 hover:bg-secondary/40 text-secondary-fg rounded-none' },
    ghost:     { wrap: 'inline-flex rounded-md overflow-hidden', on: 'bg-surface-overlay font-semibold text-text-primary rounded-none', off: 'hover:bg-surface-overlay text-text-primary rounded-none' },
  }[variant];

  const btns = items.map((item, i) => {
    const isActive = item.value === active;
    const roundL = variant !== 'outline' && i === 0 ? ' rounded-l-md' : '';
    const roundR = variant !== 'outline' && i === items.length - 1 ? ' rounded-r-md' : '';
    return `<button type="button" aria-pressed="${isActive}" ${item.disabled ? 'disabled' : ''} class="${btnBase} ${isActive ? vc.on : vc.off}${roundL}${roundR}">${item.label}</button>`;
  }).join('\n    ');

  return `<div role="group" class="${vc.wrap}">\n    ${btns}\n  </div>`;
}

const calItems = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function buildButtonGroupData(): ShowcaseItem[] {
  return [
    {
      id: 'button-group',
      title: 'ButtonGroup',
      category: 'Atom',
      abbr: 'BG',
      description: 'Segmented button group for mutually-exclusive options. Supports 4 variants, 4 sizes and disabled items.',
      filePath: 'modules/ui/ButtonGroup.ejs',
      sourceCode,
      variants: [
        {
          title: 'Outline (default)',
          previewHtml: `<div class="flex justify-center p-4">${group({ items: calItems, active: 'week' })}</div>`,
          code: `<%- include('modules/ui/ButtonGroup', {
  value: 'week',
  items: [
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
  ],
}) %>`,
        },
        {
          title: 'Primary',
          previewHtml: `<div class="flex justify-center p-4">${group({ items: calItems, active: 'week', variant: 'primary' })}</div>`,
          code: `<%- include('modules/ui/ButtonGroup', { variant: 'primary', value: 'week', items: [...] }) %>`,
        },
        {
          title: 'Secondary',
          previewHtml: `<div class="flex justify-center p-4">${group({ items: calItems, active: 'week', variant: 'secondary' })}</div>`,
          code: `<%- include('modules/ui/ButtonGroup', { variant: 'secondary', value: 'week', items: [...] }) %>`,
        },
        {
          title: 'Ghost',
          previewHtml: `<div class="flex justify-center p-4">${group({ items: calItems, active: 'week', variant: 'ghost' })}</div>`,
          code: `<%- include('modules/ui/ButtonGroup', { variant: 'ghost', value: 'week', items: [...] }) %>`,
        },
        {
          title: 'Sizes',
          layout: 'stack' as const,
          previewHtml: `<div class="flex flex-col items-center gap-3 p-4">
  <div role="group" class="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
    ${ ['A','B','C'].map((l,i) => `<button type="button" aria-pressed="${i===0}" class="font-medium transition-colors focus-visible:outline-none px-2 py-1 text-xs ${i===0 ? 'bg-surface-overlay font-semibold text-text-primary' : 'bg-surface-base hover:bg-surface-overlay text-text-primary'}">${l}</button>`).join('') }
  </div>
  <div role="group" class="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
    ${ ['A','B','C'].map((l,i) => `<button type="button" aria-pressed="${i===0}" class="font-medium transition-colors focus-visible:outline-none px-3 py-1.5 text-sm ${i===0 ? 'bg-surface-overlay font-semibold text-text-primary' : 'bg-surface-base hover:bg-surface-overlay text-text-primary'}">${l}</button>`).join('') }
  </div>
  <div role="group" class="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
    ${ ['A','B','C'].map((l,i) => `<button type="button" aria-pressed="${i===0}" class="font-medium transition-colors focus-visible:outline-none px-4 py-2 text-sm ${i===0 ? 'bg-surface-overlay font-semibold text-text-primary' : 'bg-surface-base hover:bg-surface-overlay text-text-primary'}">${l}</button>`).join('') }
  </div>
  <div role="group" class="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
    ${ ['A','B','C'].map((l,i) => `<button type="button" aria-pressed="${i===0}" class="font-medium transition-colors focus-visible:outline-none px-5 py-2.5 text-base ${i===0 ? 'bg-surface-overlay font-semibold text-text-primary' : 'bg-surface-base hover:bg-surface-overlay text-text-primary'}">${l}</button>`).join('') }
  </div>
</div>`,
          code: `<%- include('modules/ui/ButtonGroup', { size: 'xs', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'sm', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'md', value: 'a', items: [...] }) %>
<%- include('modules/ui/ButtonGroup', { size: 'lg', value: 'a', items: [...] }) %>`,
        },
        {
          title: 'With disabled item',
          previewHtml: `<div class="flex justify-center p-4">${group({
            items: [
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month', disabled: true },
            ],
            active: 'week',
          })}</div>`,
          code: `<%- include('modules/ui/ButtonGroup', {
  value: 'week',
  items: [
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month', disabled: true },
  ],
}) %>`,
        },
        {
          title: 'Icon-style labels',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-4 p-4">
  <div role="group" class="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
    <button type="button" aria-pressed="false" class="${btnBase} bg-surface-base hover:bg-surface-overlay text-text-primary"><i class="fa-solid fa-list"></i></button>
    <button type="button" aria-pressed="true"  class="${btnBase} bg-surface-overlay font-semibold text-text-primary"><i class="fa-solid fa-grip"></i></button>
    <button type="button" aria-pressed="false" class="${btnBase} bg-surface-base hover:bg-surface-overlay text-text-primary"><i class="fa-solid fa-map"></i></button>
  </div>
  <div role="group" class="inline-flex rounded-md overflow-hidden">
    <button type="button" aria-pressed="false" class="${btnBase} bg-secondary/20 hover:bg-secondary/40 text-secondary-fg rounded-l-md"><i class="fa-solid fa-align-left"></i></button>
    <button type="button" aria-pressed="true"  class="${btnBase} bg-secondary text-secondary-fg"><i class="fa-solid fa-align-center"></i></button>
    <button type="button" aria-pressed="false" class="${btnBase} bg-secondary/20 hover:bg-secondary/40 text-secondary-fg rounded-r-md"><i class="fa-solid fa-align-right"></i></button>
  </div>
</div>`,
          code: `<%- include('modules/ui/ButtonGroup', {
  value: 'grid',
  items: [
    { value: 'list', label: '<i class="fa-solid fa-list"></i>' },
    { value: 'grid', label: '<i class="fa-solid fa-grip"></i>' },
    { value: 'map',  label: '<i class="fa-solid fa-map"></i>' },
  ],
}) %>`,
        },
      ],
    },
  ];
}
