import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/AccessibilityKit.ejs'), 'utf-8');

export function buildAppAccessibilityKitData(): ShowcaseItem[] {
  return [
    {
      id: 'accessibility-kit',
      title: 'AccessibilityKit',
      category: 'App',
      abbr: 'AK',
      description: 'A11y yardımcıları paketi: SkipLink, LiveRegion (Announcer) ve Tooltip primitive\'lerini tek partial üzerinden expose eder. `part` (skip|live|announcer|tooltip|all) ile parça seçilir; varsayılan kullanım sayfa başında SkipLink + LiveRegion\'u kurar ve `window.announce` API\'sini açar.',
      filePath: 'modules/app/AccessibilityKit.ejs',
      sourceCode,
      variants: [
        {
          title: 'SkipLink + LiveRegion (default)',
          previewHtml: `<div class="p-4 w-full max-w-2xl">
  <div class="relative rounded-xl border border-border bg-surface-raised p-6 overflow-hidden">
    <p class="text-xs uppercase tracking-wider text-text-disabled mb-3">Page head (Tab to reveal SkipLink)</p>
    <a href="#main-content"
      class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      Skip to main content
    </a>
    <div class="mt-4 p-3 rounded-md border border-dashed border-border bg-surface text-xs text-text-secondary">
      <code>&lt;div role="status" aria-live="polite" class="sr-only"&gt;&lt;/div&gt;</code>
      <p class="mt-1">LiveRegion mounts hidden; <code>window.announce('Saved!')</code> updates it.</p>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/AccessibilityKit') %>

<%# Anywhere in the page %>
<main id="main-content">…</main>

<script>
  // Later, after a state change:
  window.announce('Profile saved', 'polite');
</script>`,
          layout: 'stack',
        },
        {
          title: 'Tooltip part',
          previewHtml: `<div class="p-8 w-full flex items-center justify-center">
  <span class="relative inline-flex items-center">
    <span aria-describedby="tooltip-demo">
      <button type="button"
        class="inline-flex items-center justify-center gap-2 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium">
        <i class="fa-solid fa-circle-info text-xs"></i>Hover me
      </button>
    </span>
    <span id="tooltip-demo" role="tooltip"
      class="absolute z-[80] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md opacity-100 bg-surface-overlay text-text-primary border border-border bottom-full left-1/2 -translate-x-1/2 mb-2">
      Helpful hint
    </span>
  </span>
</div>`,
          code: `<%- include('modules/app/AccessibilityKit', {
  part: 'tooltip',
  content: 'Helpful hint',
  placement: 'top',
  children: \`<%- include('modules/ui/Button', { variant: 'outline', size: 'sm', children: 'Hover me' }) %>\`
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
