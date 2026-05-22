import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/SkipLink.ejs'), 'utf-8');

const skipLinkClasses = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

export function buildSkipLinkData(): ShowcaseItem[] {
  return [
    {
      id: 'skip-link',
      title: 'SkipLink + LiveRegion',
      category: 'Atom',
      abbr: 'Sl',
      description: 'SkipLink is visually hidden until focused, enabling keyboard users to bypass navigation. LiveRegion announces dynamic content to screen readers.',
      filePath: 'modules/ui/SkipLink.ejs',
      sourceCode,
      variants: [
        {
          title: 'SkipLink (focus to reveal)',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4 space-y-2">
  <p class="text-xs text-text-secondary">Tab into the area below to reveal the skip link:</p>
  <div class="border border-dashed border-border rounded-md p-4 space-y-2">
    <a href="#demo-main" class="${skipLinkClasses}">Skip to main content</a>
    <p class="text-sm text-text-primary" id="demo-main">Main content area</p>
  </div>
</div>`,
          code: `<%# Place at top of layout: %>
<%- include('modules/ui/SkipLink', { href: '#main-content' }) %>

<%# Linked target: %>
<main id="main-content">...</main>`,
        },
        {
          title: 'LiveRegion',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4 space-y-3">
  <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">Send announcement</button>
  <p class="text-xs text-text-secondary">(screen reader hears: "Announcement #1 sent")</p>
  <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">Announcement #1 sent</div>
</div>`,
          code: `<%# Polite live region — announces \`message\` to screen readers %>
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  <%= message %>
</div>`,
        },
      ],
    },
  ];
}
