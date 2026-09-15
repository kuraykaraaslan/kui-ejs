import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Separator.ejs'), 'utf-8');

export function buildSeparatorData(): ShowcaseItem[] {
  return [
    {
      id: 'separator',
      title: 'Separator',
      category: 'Atom',
      abbr: 'Se',
      description: 'Visual divider between sections of content. Supports horizontal and vertical orientation, and an optional centered label for horizontal dividers.',
      filePath: 'modules/ui/Separator.ejs',
      sourceCode,
      variants: [
        {
          title: 'Horizontal',
          previewHtml: `<div class="p-4 w-full max-w-sm space-y-3 text-sm text-text-primary">
  <p>Section one content</p>
  <div role="none" class="shrink-0 bg-border h-px w-full"></div>
  <p>Section two content</p>
</div>`,
          code: `<p>Section one content</p>
<%- include('modules/ui/Separator') %>
<p>Section two content</p>`,
        },
        {
          title: 'Vertical + labeled',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4 space-y-4">
  <div class="flex h-6 items-center gap-3 text-sm text-text-primary">
    <span>Profile</span>
    <div role="none" class="shrink-0 bg-border h-full w-px"></div>
    <span>Settings</span>
    <div role="none" class="shrink-0 bg-border h-full w-px"></div>
    <span>Billing</span>
  </div>
  <div role="none" class="flex items-center gap-3 text-xs font-medium text-text-secondary max-w-sm">
    <span class="h-px flex-1 bg-border"></span>
    OR
    <span class="h-px flex-1 bg-border"></span>
  </div>
</div>`,
          code: `<span>Profile</span>
<%- include('modules/ui/Separator', { orientation: 'vertical' }) %>
<span>Settings</span>

<%- include('modules/ui/Separator', { label: 'OR' }) %>`,
        },
      ],
    },
  ];
}
