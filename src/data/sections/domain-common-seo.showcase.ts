import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const seoFormSource    = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/seo/SeoForm.ejs'), 'utf-8');
const seoPreviewSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/seo/SeoPreview.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const baseInput = (opts: { id: string; label: string; placeholder?: string; value?: string; hint?: string }) =>
  `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>
  <input type="text" id="${opts.id}" placeholder="${opts.placeholder || ''}" ${opts.value ? `value="${opts.value}"` : ''}
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
  ${opts.hint ? `<p class="mt-1.5 text-sm text-text-secondary">${opts.hint}</p>` : ''}
</div>`;

function seoPreviewHtml(opts: {
  seoTitle?: string; seoDescription?: string; keywords?: string[];
  url: string; siteName?: string;
}): string {
  const TITLE_PH = 'Page title will appear here';
  const DESC_PH  = 'Meta description will appear here. Keep it between 120–160 characters for best results in search engines.';
  const title    = (opts.seoTitle    || '').trim() || TITLE_PH;
  const desc     = (opts.seoDescription || '').trim() || DESC_PH;
  const hasTitle = !!(opts.seoTitle    || '').trim();
  const hasDesc  = !!(opts.seoDescription || '').trim();
  const titleLen = (opts.seoTitle    || '').length;
  const descLen  = (opts.seoDescription || '').length;
  const kwCount  = (opts.keywords || []).length;

  return `<div class="rounded-xl border border-border bg-surface-raised p-4 space-y-3">
  <p class="text-xs font-semibold text-text-secondary uppercase tracking-wider">Google Preview</p>
  <div class="max-w-lg space-y-1">
    ${opts.siteName ? `<p class="text-xs text-text-secondary truncate">${opts.siteName}</p>` : ''}
    <p class="text-xs text-success-fg truncate">${opts.url}</p>
    <p class="text-base font-medium leading-snug truncate ${hasTitle ? 'text-blue-700' : 'text-text-disabled italic'}">${title}</p>
    <p class="text-sm leading-relaxed line-clamp-2 ${hasDesc ? 'text-text-secondary' : 'text-text-disabled italic'}">${desc}</p>
  </div>
  <div class="flex gap-4 pt-1 border-t border-border">
    <div class="text-center">
      <p class="text-sm font-semibold tabular-nums ${titleLen > 60 ? 'text-error' : 'text-text-primary'}">${titleLen}<span class="text-text-secondary font-normal">/60</span></p>
      <p class="text-xs text-text-secondary">Title</p>
    </div>
    <div class="text-center">
      <p class="text-sm font-semibold tabular-nums ${descLen > 160 ? 'text-error' : 'text-text-primary'}">${descLen}<span class="text-text-secondary font-normal">/160</span></p>
      <p class="text-xs text-text-secondary">Description</p>
    </div>
    <div class="text-center">
      <p class="text-sm font-semibold text-text-primary tabular-nums">${kwCount}</p>
      <p class="text-xs text-text-secondary">Keywords</p>
    </div>
  </div>
</div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonSeoData(): ShowcaseItem[] {
  return [
    // ── SeoForm ───────────────────────────────────────────────────────────────
    {
      id: 'seo-form',
      title: 'SeoForm',
      category: 'Domain',
      abbr: 'Sf',
      description: 'SEO metadata form: title (60 char limit), meta description (160 char limit), and keyword tag input with character counters.',
      filePath: 'modules/domain/common/seo/SeoForm.ejs',
      sourceCode: seoFormSource,
      variants: [
        {
          title: 'Empty',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    ${baseInput({ id: 'st1', label: 'SEO Title', placeholder: 'Page title for search engines', hint: '0/60' })}
    <div class="w-full">
      <label class="block text-sm font-medium text-text-primary mb-1.5">Meta Description</label>
      <textarea rows="3" placeholder="Short description shown in search results"
        class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm resize-y"></textarea>
      <p class="mt-1.5 text-sm text-text-secondary">0/160</p>
    </div>
    <div class="w-full">
      <label class="block text-sm font-medium text-text-primary mb-1.5">Keywords</label>
      <div class="flex flex-wrap gap-1.5 rounded-md border border-border bg-surface px-3 py-2 min-h-10">
        <input type="text" placeholder="Add keyword…" class="flex-1 min-w-32 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none">
      </div>
      <p class="mt-1.5 text-xs text-text-secondary">Press Enter or comma to add a keyword.</p>
    </div>
    <div class="flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save SEO</button></div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/seo/SeoForm', { action: '/content/1/seo' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Pre-filled',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    ${baseInput({ id: 'st2', label: 'SEO Title', value: 'Best Running Shoes 2025', hint: '23/60' })}
    <div class="w-full">
      <label class="block text-sm font-medium text-text-primary mb-1.5">Meta Description</label>
      <textarea rows="3" class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm resize-y">Discover the top-rated running shoes for every terrain and budget.</textarea>
      <p class="mt-1.5 text-sm text-text-secondary">64/160</p>
    </div>
    <div class="w-full">
      <label class="block text-sm font-medium text-text-primary mb-1.5">Keywords</label>
      <div class="flex flex-wrap gap-1.5 rounded-md border border-border bg-surface px-3 py-2 min-h-10">
        <span class="inline-flex items-center gap-1 rounded-full bg-primary-subtle text-primary px-2 py-0.5 text-xs font-medium">running</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-primary-subtle text-primary px-2 py-0.5 text-xs font-medium">shoes</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-primary-subtle text-primary px-2 py-0.5 text-xs font-medium">sports</span>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" class="inline-flex items-center justify-center rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Cancel</button>
      <button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save SEO</button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/seo/SeoForm', {
  action: '/content/1/seo',
  cancelHref: '/content/1',
  initial: {
    seoTitle: 'Best Running Shoes 2025',
    seoDescription: 'Discover the top-rated running shoes…',
    keywords: ['running', 'shoes', 'sports']
  }
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── SeoPreview ────────────────────────────────────────────────────────────
    {
      id: 'seo-preview',
      title: 'SeoPreview',
      category: 'Domain',
      abbr: 'Sp',
      description: 'Google search result preview card. Shows title, URL, and description with character count indicators. Empty fields render placeholder text.',
      filePath: 'modules/domain/common/seo/SeoPreview.ejs',
      sourceCode: seoPreviewSource,
      variants: [
        {
          title: 'Filled',
          previewHtml: `<div class="w-full max-w-lg p-4">
  ${seoPreviewHtml({
    seoTitle: 'Best Running Shoes 2025',
    seoDescription: 'Discover the top-rated running shoes for every terrain and budget. Free shipping on orders over $50.',
    keywords: ['running', 'shoes'],
    url: 'https://shop.example.com/running-shoes',
    siteName: 'Shop Example',
  })}
</div>`,
          code: `<%- include('modules/domain/common/seo/SeoPreview', {
  seo: { seoTitle: 'My Page Title', seoDescription: 'A clear meta description.', keywords: ['next', 'react'] },
  url: 'https://example.com/page'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty (placeholders)',
          previewHtml: `<div class="w-full max-w-lg p-4">
  ${seoPreviewHtml({ url: 'https://example.com/page' })}
</div>`,
          code: `<%- include('modules/domain/common/seo/SeoPreview', {
  seo: {},
  url: 'https://example.com/page'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
