import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppBreadcrumbs.ejs'), 'utf-8');

type Crumb = { label: string; href?: string };

const crumbTrail = (items: Crumb[]) => {
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    const node = isLast
      ? `<span class="text-text-primary font-medium px-1" aria-current="page">${item.label}</span>`
      : item.href
        ? `<a href="${item.href}" class="text-text-secondary hover:text-text-primary transition-colors rounded px-1">${item.label}</a>`
        : `<span class="text-text-secondary px-1">${item.label}</span>`;
    const sep = !isLast ? `<i class="fa-solid fa-chevron-right text-text-disabled" style="width:0.625rem;height:0.625rem" aria-hidden="true"></i>` : '';
    return `<span class="flex items-center gap-1">${node}${sep}</span>`;
  }).join('');
};

export function buildAppBreadcrumbsData(): ShowcaseItem[] {
  return [
    {
      id: 'app-breadcrumbs',
      title: 'AppBreadcrumbs',
      category: 'App',
      abbr: 'ABc',
      description: 'Sayfa başlığı + açıklama + breadcrumb navigasyonu birleşik blok. Masaüstünde tam yol; mobilde ilk + son + … kısayolu ve "Full path" dropdown menüsü.',
      filePath: 'modules/app/AppBreadcrumbs.ejs',
      sourceCode,
      variants: [
        {
          title: 'Title + description + breadcrumb',
          previewHtml: `<div class="p-4 w-full">
  <div class="w-full space-y-4 p-4 border border-border rounded-xl bg-surface-raised">
    <div>
      <div class="flex items-center gap-2 flex-wrap">
        <h1 class="text-2xl font-bold text-text-primary leading-tight">Edit invoice</h1>
        <span class="inline-flex items-center rounded-full font-medium bg-warning-subtle text-warning-fg px-2 py-0.5 text-xs">DRAFT</span>
      </div>
      <p class="text-sm text-text-secondary mt-0.5">Update line items, taxes, and payment terms.</p>
    </div>
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1 text-sm">
      ${crumbTrail([
        { label: 'Home', href: '/' },
        { label: 'Invoices', href: '/invoices' },
        { label: 'INV-1042', href: '/invoices/1042' },
        { label: 'Edit' },
      ])}
    </nav>
  </div>
</div>`,
          code: `<%- include('modules/app/AppBreadcrumbs', {
  title:       'Edit invoice',
  description: 'Update line items, taxes, and payment terms.',
  badgeContent: '<%- include("modules/ui/Badge", { variant: "warning", children: "DRAFT" }) %>',
  items: [
    { label: 'Home',     href: '/' },
    { label: 'Invoices', href: '/invoices' },
    { label: 'INV-1042', href: '/invoices/' + invoice.id },
    { label: 'Edit' }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Breadcrumb only',
          previewHtml: `<div class="p-4 w-full">
  <div class="w-full space-y-4 p-4 border border-border rounded-xl bg-surface-raised">
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1 text-sm">
      ${crumbTrail([
        { label: 'Dashboard', href: '/' },
        { label: 'Settings', href: '/settings' },
        { label: 'Security' },
      ])}
    </nav>
  </div>
</div>`,
          code: `<%- include('modules/app/AppBreadcrumbs', {
  items: [
    { label: 'Dashboard', href: '/' },
    { label: 'Settings',  href: '/settings' },
    { label: 'Security' }
  ]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
