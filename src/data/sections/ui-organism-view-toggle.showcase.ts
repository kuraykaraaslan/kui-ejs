import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const viewToggleSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ViewToggle.ejs'), 'utf-8');

function renderViewToggle(locals: Record<string, unknown>): string {
  return ejs.render(viewToggleSource, locals, { filename: path.join(process.cwd(), 'modules/ui/ViewToggle.ejs') });
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildViewToggleData(): ShowcaseItem[] {
  return [
    {
      id:          'view-toggle',
      title:       'ViewToggle',
      category:    'Organism',
      abbr:        'VT',
      description: 'Yatay / dikey görünüm geçiş kontrolü; iki durumlu ikonlu seçici. viewtoggle:change CustomEvent yayar.',
      filePath:    'modules/ui/ViewToggle.ejs',
      sourceCode:  viewToggleSource,
      variants: [
        {
          title:       'Default (EN labels)',
          layout:      'stack',
          previewHtml: `<div class="flex items-center justify-center p-4">
  ${renderViewToggle({ id: 'view-toggle-demo-default', value: 'horizontal' })}
</div>`,
          code: `<%- include('modules/ui/ViewToggle', { value: 'horizontal' }) %>`,
        },
        {
          title:       'Custom labels (TR)',
          layout:      'stack',
          previewHtml: `<div class="flex items-center justify-center p-4">
  ${renderViewToggle({
            id:        'view-toggle-demo-custom',
            value:     'vertical',
            ariaLabel: 'Görünüm seçenekleri',
            labels:    { horizontal: 'Yatay', vertical: 'Dikey' },
          })}
</div>`,
          code: `<%- include('modules/ui/ViewToggle', {
  value:     'vertical',
  ariaLabel: 'Görünüm seçenekleri',
  labels:    { horizontal: 'Yatay', vertical: 'Dikey' },
}) %>`,
        },
      ],
    },
  ];
}
