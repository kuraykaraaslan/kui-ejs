import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const pickerPath   = path.join(process.cwd(), 'modules/ui/TimeWindowPicker.ejs');
const pickerSource = fs.readFileSync(pickerPath, 'utf-8');

function renderPicker(locals: Record<string, unknown>): string {
  return ejs.render(pickerSource, locals, { filename: pickerPath });
}

// A tiny readout so the change event is visible in the preview.
function demo(id: string, locals: Record<string, unknown>): string {
  return `<div class="space-y-2" id="${id}">${renderPicker(locals)}<pre class="text-xs text-text-secondary" data-readout>${JSON.stringify(locals.value ?? null)}</pre></div>
<script>(function(){var r=document.getElementById('${id}');if(!r)return;r.addEventListener('kui:timewindow-change',function(e){r.querySelector('[data-readout]').textContent=JSON.stringify(e.detail);});})();</script>`;
}

export function buildTimeWindowPickerData(): ShowcaseItem[] {
  return [
    {
      id: 'time-window-picker',
      title: 'TimeWindowPicker',
      category: 'Molecule',
      abbr: 'Tw',
      description:
        'Relative presets ("1h", "7d"), an absolute UTC range and the interval / aggregation that go with a window. The value is a structural `TimeWindowValue` (ISO strings, UTC); every change dispatches a `kui:timewindow-change` DOM event (detail = the next value) and calls the global function named by `onChange`. Every label is overridable through `messages`. Inline dashboard / telemetry sibling of DateRangePicker.',
      filePath: 'modules/ui/TimeWindowPicker.ejs',
      sourceCode: pickerSource,
      since: '2026-10',
      relatedTo: ['date-range-picker', 'time-picker'],
      designTokens: ['--primary', '--border', '--surface-base', '--surface-sunken', '--text-secondary', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['radiogroup', 'group'],
        notes: 'Presets form a radiogroup; the date inputs and the selects carry accessible names from `messages`.',
      },
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          previewHtml: demo('tw-demo-wrap', { idPrefix: 'tw-demo', value: { mode: 'relative', last: '24h' } }),
          code: `<%- include('modules/ui/TimeWindowPicker', { value: { mode: 'relative', last: '24h' }, onChange: 'onWindowChange' }) %>
<script>
  document.addEventListener('kui:timewindow-change', (e) => console.log(e.detail));
</script>`,
        },
        {
          title: 'Presets only',
          layout: 'stack' as const,
          previewHtml: demo('tw-compact-wrap', {
            idPrefix: 'tw-compact', value: { mode: 'relative', last: '24h' },
            presets: ['1h', '24h', '7d'], allowAbsolute: false, showInterval: false, showAggregation: false,
          }),
          code: `<%- include('modules/ui/TimeWindowPicker', {
  value: { mode: 'relative', last: '24h' },
  presets: ['1h', '24h', '7d'],
  allowAbsolute: false, showInterval: false, showAggregation: false,
}) %>`,
        },
      ],
    },
  ];
}
