import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const tabButtonSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/TabButton.ejs'), 'utf-8');

function renderTabButton(locals: Record<string, unknown>): string {
  return ejs.render(tabButtonSource, locals, { filename: path.join(process.cwd(), 'modules/ui/TabButton.ejs') });
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildTabButtonData(): ShowcaseItem[] {
  return [
    {
      id:          'tab-button',
      title:       'TabButton',
      category:    'Organism',
      abbr:        'TB',
      description: 'Pill-style tab button with active/inactive coloring and an optional count badge.',
      filePath:    'modules/ui/TabButton.ejs',
      sourceCode:  tabButtonSource,
      variants: [
        {
          title:       'With counts',
          layout:      'stack',
          previewHtml: `<div class="flex items-center gap-1">
  ${renderTabButton({ active: true,  children: 'All',      count: 42 })}
  ${renderTabButton({ active: false, children: 'Active',   count: 18 })}
  ${renderTabButton({ active: false, children: 'Archived', count: 24 })}
</div>`,
          code: `<%- include('modules/ui/TabButton', { active: true,  children: 'All',      count: 42 }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Active',   count: 18 }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Archived', count: 24 }) %>`,
        },
        {
          title:       'Without count',
          layout:      'stack',
          previewHtml: `<div class="flex items-center gap-1">
  ${renderTabButton({ active: true,  children: 'Selected' })}
  ${renderTabButton({ active: false, children: 'Default' })}
</div>`,
          code: `<%- include('modules/ui/TabButton', { active: true,  children: 'Selected' }) %>
<%- include('modules/ui/TabButton', { active: false, children: 'Default' }) %>`,
        },
      ],
    },
  ];
}
