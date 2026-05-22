import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const statCardSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/StatCard.ejs'), 'utf-8');

function renderStatCard(locals: Record<string, unknown>): string {
  return ejs.render(statCardSource, locals, { filename: path.join(process.cwd(), 'modules/ui/StatCard.ejs') });
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildStatCardData(): ShowcaseItem[] {
  return [
    {
      id:          'stat-card',
      title:       'StatCard',
      category:    'Organism',
      abbr:        'Sc',
      description: 'Küçük metrik gösterim kartı; değer, etiket ve opsiyonel vurgu rengi (accent) ile.',
      filePath:    'modules/ui/StatCard.ejs',
      sourceCode:  statCardSource,
      variants: [
        {
          title:       'Variants',
          layout:      'stack',
          previewHtml: `<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
  ${renderStatCard({ label: 'Total Users',  value: 1284 })}
  ${renderStatCard({ label: 'Active',       value: 947,  accent: 'text-success' })}
  ${renderStatCard({ label: 'Transferred',  value: 38,   accent: 'text-info' })}
  ${renderStatCard({ label: 'Cancelled',    value: 12,   accent: 'text-error' })}
</div>`,
          code: `<%- include('modules/ui/StatCard', { label: 'Total Users', value: 1284 }) %>
<%- include('modules/ui/StatCard', { label: 'Active',      value: 947,  accent: 'text-success' }) %>
<%- include('modules/ui/StatCard', { label: 'Transferred', value: 38,   accent: 'text-info' }) %>
<%- include('modules/ui/StatCard', { label: 'Cancelled',   value: 12,   accent: 'text-error' }) %>`,
        },
        {
          title:       'Default (no accent)',
          layout:      'stack',
          previewHtml: `<div class="grid grid-cols-2 gap-3 max-w-sm">
  ${renderStatCard({ label: 'Sessions',   value: 1842 })}
  ${renderStatCard({ label: 'Bounce rate', value: '24%' })}
</div>`,
          code: `<%- include('modules/ui/StatCard', { label: 'Sessions',    value: 1842 }) %>
<%- include('modules/ui/StatCard', { label: 'Bounce rate', value: '24%' }) %>`,
        },
      ],
    },
  ];
}
