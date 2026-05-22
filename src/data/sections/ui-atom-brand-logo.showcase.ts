import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/BrandLogo.ejs'), 'utf-8');

const base = 'flex items-center justify-center rounded-2xl bg-primary text-primary-fg font-bold shadow-sm';

const logo = (sizeCls: string, content: string, extra = '') =>
  `<span class="${base} ${sizeCls}${extra ? ' ' + extra : ''}">${content}</span>`;

const sizeMap: Record<string, string> = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-lg',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-20 w-20 text-3xl',
  '2xl': 'h-24 w-24 text-4xl',
};

export function buildBrandLogoData(): ShowcaseItem[] {
  return [
    {
      id: 'brand-logo',
      title: 'BrandLogo',
      category: 'Atom',
      abbr: 'BL',
      description: 'Square brand mark with rounded corners. Renders a single letter or short token on a primary-coloured tile. 5 sizes (sm → 2xl).',
      filePath: 'modules/ui/BrandLogo.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default sizes',
          previewHtml: `<div class="flex items-end justify-center gap-3 p-4">
  ${logo(sizeMap.sm, 'A')}
  ${logo(sizeMap.md, 'B')}
  ${logo(sizeMap.lg, 'C')}
  ${logo(sizeMap.xl, 'D')}
  ${logo(sizeMap['2xl'], 'E')}
</div>`,
          code: `<%- include('modules/ui/BrandLogo', { size: 'sm',  children: 'A' }) %>
<%- include('modules/ui/BrandLogo', { size: 'md',  children: 'B' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg',  children: 'C' }) %>
<%- include('modules/ui/BrandLogo', { size: 'xl',  children: 'D' }) %>
<%- include('modules/ui/BrandLogo', { size: '2xl', children: 'E' }) %>`,
        },
        {
          title: 'Custom content',
          previewHtml: `<div class="flex items-center justify-center gap-3 p-4">
  ${logo(sizeMap.lg, 'KU')}
  ${logo(sizeMap.lg, 'N', 'bg-secondary')}
  ${logo(sizeMap.lg, '✓', 'bg-success')}
</div>`,
          code: `<%- include('modules/ui/BrandLogo', { size: 'lg', children: 'KU' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg', className: 'bg-secondary', children: 'N' }) %>
<%- include('modules/ui/BrandLogo', { size: 'lg', className: 'bg-success',   children: '✓' }) %>`,
        },
      ],
    },
  ];
}
