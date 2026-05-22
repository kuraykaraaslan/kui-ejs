import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/DateRangePicker.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="p-4 w-full max-w-md">${inner}</div>`;

function dateRangeEl(opts: {
  id?: string;
  label?: string;
  value?: { start?: string; end?: string };
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const id = opts.id || `dr-${Math.random().toString(36).substr(2, 5)}`;
  const startStr = opts.value?.start || '';
  const endStr = opts.value?.end || '';

  let inputClass = 'block w-full rounded-md border px-3 py-2 text-sm transition-colors '
    + 'text-text-primary bg-surface-base '
    + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus '
    + 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken ';
  inputClass += opts.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';

  return `<div id="${id}-root" class="space-y-1" data-daterange-root>
  <fieldset>
    <legend class="block text-sm font-medium text-text-primary mb-1">
      ${opts.label || ''}${opts.required ? '<span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span>' : ''}
    </legend>
    <div class="flex items-center gap-2">
      <div class="flex-1 space-y-0.5">
        <label for="${id}-start" class="sr-only">Start date</label>
        <input id="${id}-start" type="date" value="${startStr}"${opts.disabled ? ' disabled' : ''}${opts.required ? ' required' : ''}${endStr ? ` max="${endStr}"` : ''} aria-label="Start date" aria-invalid="${opts.error ? 'true' : 'false'}" data-daterange-start class="${inputClass}"/>
      </div>
      <span class="w-3.5 h-3.5 inline-flex items-center justify-center text-text-disabled shrink-0" aria-hidden="true">
        <i class="fa-solid fa-arrow-right" style="font-size:14px"></i>
      </span>
      <div class="flex-1 space-y-0.5">
        <label for="${id}-end" class="sr-only">End date</label>
        <input id="${id}-end" type="date" value="${endStr}"${opts.disabled ? ' disabled' : ''}${opts.required ? ' required' : ''}${startStr ? ` min="${startStr}"` : ''} aria-label="End date" aria-invalid="${opts.error ? 'true' : 'false'}" data-daterange-end class="${inputClass}"/>
      </div>
    </div>
  </fieldset>
  ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
  ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
</div>`;
}

export function buildDateRangePickerData(): ShowcaseItem[] {
  return [
    {
      id: 'date-range-picker',
      title: 'DateRangePicker',
      category: 'Molecule',
      abbr: 'Dr',
      description: 'fieldset tabanlı çift native date input. Start/end birbirini otomatik kısıtlar (min/max), erişilebilir sr-only labellarla gelir.',
      filePath: 'modules/ui/DateRangePicker.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: wrap(dateRangeEl({
            label: 'Reporting period',
            hint: 'End date must be after the start date.',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Reporting period',
  hint: 'End date must be after the start date.'
}) %>`,
        },
        {
          title: 'With value',
          previewHtml: wrap(dateRangeEl({
            label: 'Booking window',
            value: { start: '2026-06-01', end: '2026-06-15' },
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Booking window',
  value: { start: '2026-06-01', end: '2026-06-15' }
}) %>`,
        },
        {
          title: 'Required + error',
          previewHtml: wrap(dateRangeEl({
            label: 'Campaign dates',
            required: true,
            error: 'Please pick both dates.',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Campaign dates',
  required: true,
  error: 'Please pick both dates.'
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrap(dateRangeEl({
            label: 'Locked range',
            value: { start: '2026-01-01', end: '2026-01-31' },
            disabled: true,
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Locked range',
  value: { start: '2026-01-01', end: '2026-01-31' },
  disabled: true
}) %>`,
        },
      ],
    },
  ];
}
