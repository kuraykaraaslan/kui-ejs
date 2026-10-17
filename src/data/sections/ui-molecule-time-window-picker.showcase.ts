import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const pickerPath   = path.join(process.cwd(), 'modules/ui/TimeWindowPicker.ejs');
const pickerSource = fs.readFileSync(pickerPath, 'utf-8');

function renderPicker(locals: Record<string, unknown>): string {
  return ejs.render(pickerSource, locals, { filename: pickerPath });
}

const selectPath   = path.join(process.cwd(), 'modules/ui/TimeWindowSelect.ejs');
const selectSource = fs.readFileSync(selectPath, 'utf-8');

function renderSelect(locals: Record<string, unknown>): string {
  return ejs.render(selectSource, locals, { filename: selectPath });
}

// A tiny readout so the change event is visible in the preview.
// The select's demos reserve room for the open panel, which the preview pane would clip,
// and wrap the readout so a long value does not push the trigger out of the centred pane.
function demo(id: string, locals: Record<string, unknown>, render: (l: Record<string, unknown>) => string = renderPicker): string {
  const select = render === renderSelect;
  return `<div class="space-y-2${select ? ' min-h-[34rem]' : ''}" id="${id}">${render(locals)}<pre class="text-xs text-text-secondary${select ? ' whitespace-pre-wrap break-all' : ''}" data-readout>${JSON.stringify(locals.value ?? null)}</pre></div>
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
        'Relative presets ("1h", "7d"), an optional custom "last N minutes / hours / days", calendar periods ("today", "previous month", optionally "so far"), an absolute UTC range, and the interval / aggregation / time zone that go with a window. The value is a structural `TimeWindowValue` (ISO strings, UTC); every change dispatches a `kui:timewindow-change` DOM event (detail = the next value) and calls the global function named by `onChange`. Every label, period names included, is overridable through `messages`. Inline dashboard / telemetry sibling of DateRangePicker.',
      filePath: 'modules/ui/TimeWindowPicker.ejs',
      sourceCode: pickerSource,
      since: '2026-10',
      relatedTo: ['date-range-picker', 'time-picker'],
      designTokens: ['--primary', '--border', '--surface-base', '--surface-sunken', '--text-secondary', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['radiogroup', 'group'],
        notes: 'Presets, Last, Calendar and Custom form one radiogroup; the inputs, the period select, the so-far checkbox (disabled for a past period) and the selects carry accessible names from `messages`.',
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
          title: 'Calendar periods, custom duration and time zone',
          layout: 'stack' as const,
          previewHtml: demo('tw-full-wrap', {
            idPrefix: 'tw-full', value: { mode: 'calendar', period: 'current.day', soFar: true },
            calendarPeriods: true, allowDuration: true, showTimezone: true,
          }),
          code: `<%- include('modules/ui/TimeWindowPicker', {
  value: { mode: 'calendar', period: 'current.day', soFar: true },
  calendarPeriods: true, // all 18 periods; or a list such as ['current.day', 'previous.month']
  allowDuration: true, showTimezone: true,
}) %>`,
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
    {
      id: 'time-window-select',
      title: 'TimeWindowSelect',
      category: 'Molecule',
      abbr: 'TW',
      description:
        'A time window behind one button, the dashboard way: the button names the window and opens a panel with Realtime (last N sliding, or the current calendar period, optionally so far) and History (last N anchored when applied, a fixed range typed in the window\'s zone, or a past period). Aggregation, grouping interval with a bucket estimate, and time zone apply to both. Edits are a draft until Update. Same `TimeWindowValue` as TimeWindowPicker: Update dispatches the same `kui:timewindow-change` DOM event and calls the global function named by `onChange`. The panel is a controlled Popover.',
      filePath: 'modules/ui/TimeWindowSelect.ejs',
      sourceCode: selectSource,
      since: '2026-10',
      relatedTo: ['time-window-picker', 'popover', 'date-range-picker'],
      designTokens: ['--primary', '--primary-fg', '--border', '--surface-base', '--surface-sunken', '--surface-raised', '--text-secondary', '--border-focus', '--warning'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['dialog', 'tablist', 'radiogroup', 'status'],
        notes: 'The trigger has aria-haspopup="dialog" and aria-expanded; Realtime / History are tabs (arrow keys); every input has an accessible name from `messages`; the bucket estimate is a status; Escape and Cancel discard the draft.',
      },
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          previewHtml: demo('tws-demo-wrap', { idPrefix: 'tws-demo', value: { mode: 'relative', last: '24h', interval: '5m', aggregation: 'avg' } }, renderSelect),
          code: `<%- include('modules/ui/TimeWindowSelect', { value: { mode: 'relative', last: '24h' }, onChange: 'onWindowChange' }) %>
<script>
  document.addEventListener('kui:timewindow-change', (e) => console.log(e.detail));
</script>`,
        },
        {
          title: 'History range in a chosen zone, no period options',
          layout: 'stack' as const,
          previewHtml: demo('tws-history-wrap', {
            idPrefix: 'tws-history', calendarPeriods: [],
            value: { mode: 'absolute', from: '2026-10-16T05:00:00.000Z', to: '2026-10-16T17:00:00.000Z', timezone: 'Europe/Istanbul', interval: '1h' },
          }, renderSelect),
          code: `<%- include('modules/ui/TimeWindowSelect', {
  value: { mode: 'absolute', from, to, timezone: 'Europe/Istanbul' },
  calendarPeriods: [],
}) %>`,
        },
      ],
    },
  ];
}
