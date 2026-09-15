import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// The TimePicker isn't its own file — `kind: 'time'` is a branch inside the
// DateRangePicker shim (modules/ui/DateRangePicker.ejs) that renders a plain
// native `<input type="time">` with the standard label/hint/error markup.
// It previously only appeared inline inside the DateRangePicker showcase;
// this file promotes it to its own top-level, independently discoverable
// showcase + registry entry without touching DateRangePicker.ejs itself.
const timePickerPath   = path.join(process.cwd(), 'modules/ui/DateRangePicker.ejs');
const timePickerSource = fs.readFileSync(timePickerPath, 'utf-8');

function renderTimePicker(locals: Record<string, unknown>): string {
  return ejs.render(timePickerSource, { kind: 'time', ...locals }, { filename: timePickerPath });
}

const wrap = (inner: string) => `<div class="w-full max-w-xs p-2">${inner}</div>`;

export function buildTimePickerData(): ShowcaseItem[] {
  return [
    {
      id: 'time-picker',
      title: 'TimePicker',
      category: 'Molecule',
      abbr: 'Tp',
      description:
        'Native time input with the standard label/hint/error markup, reached via `include(\'modules/ui/DateRangePicker\', { kind: \'time\', ... })`. Lives inline in the DateRangePicker shim rather than its own file, but is functionally independent — this entry makes it discoverable on its own.',
      filePath: 'modules/ui/DateRangePicker.ejs',
      sourceCode: timePickerSource,
      since: '2026-09',
      variants: [
        {
          title: 'Default',
          previewHtml: wrap(renderTimePicker({
            id: 'tp-demo-default',
            label: 'Appointment time',
            hint: 'Business hours are 9am–6pm.',
            value: '14:30',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  kind: 'time',
  label: 'Appointment time',
  hint: 'Business hours are 9am–6pm.',
  value: '14:30',
}) %>`,
        },
        {
          title: 'Required + error',
          previewHtml: wrap(renderTimePicker({
            id: 'tp-demo-error',
            label: 'Pickup time',
            required: true,
            error: 'Please choose a pickup time.',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  kind: 'time',
  label: 'Pickup time',
  required: true,
  error: 'Please choose a pickup time.',
}) %>`,
        },
      ],
    },
  ];
}
