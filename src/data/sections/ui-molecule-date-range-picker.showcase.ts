import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/DatePicker/DateRangePicker.ejs'), 'utf-8');

const wrap = (inner: string) => `<div class="p-4 w-full max-w-md">${inner}</div>`;

function dateRangeEl(opts: {
  id?: string;
  label?: string;
  value?: { start?: string; end?: string };
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  locale?: 'tr' | 'en';
}) {
  const id = opts.id || `dr-${Math.random().toString(36).substr(2, 5)}`;
  const locale = opts.locale || 'tr';
  const placeholder = locale === 'en' ? 'MM/DD/YYYY' : 'GG.AA.YYYY';
  const format = locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY';
  const clearLabel = locale === 'en' ? 'Clear range' : 'Aralığı temizle';
  const startStr = opts.value?.start || '';
  const endStr = opts.value?.end || '';

  function fmtPreview(v?: string): string {
    if (!v) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return v;
    const [, y, mo, d] = m;
    return format.replace(/YYYY|YY|MM|M|DD|D/g, (tok) => {
      switch (tok) {
        case 'YYYY': return y;
        case 'YY': return y.slice(-2);
        case 'MM': return mo;
        case 'M':  return String(Number(mo));
        case 'DD': return d;
        case 'D':  return String(Number(d));
      }
      return tok;
    });
  }

  const sDisp = fmtPreview(startStr);
  const eDisp = fmtPreview(endStr);
  const hasVal = !!(startStr || endStr);
  const display = hasVal
    ? `${sDisp || placeholder}  →  ${eDisp || placeholder}`
    : `${placeholder}  →  ${placeholder}`;

  let triggerCls = 'group relative flex w-full items-center rounded-md border transition-colors '
    + 'bg-surface-base text-text-primary '
    + 'focus-within:ring-2 focus-within:ring-border-focus focus-within:border-border-focus ';
  if (opts.disabled) triggerCls += 'opacity-50 cursor-not-allowed bg-surface-sunken ';
  triggerCls += opts.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';

  return `<div id="${id}-root" class="space-y-1 w-full">
  ${opts.label ? `<span class="block text-sm font-medium text-text-primary">${opts.label}${opts.required ? '<span class="text-error ml-1" aria-hidden="true">*</span>' : ''}</span>` : ''}
  <div class="relative">
    <div class="${triggerCls}">
      <button type="button" id="${id}" class="flex-1 text-left px-3 py-2 text-sm bg-transparent rounded-l-md focus-visible:outline-none disabled:cursor-not-allowed" aria-haspopup="dialog" aria-expanded="false"${opts.disabled ? ' disabled' : ''}>
        <span class="${hasVal ? '' : 'text-text-disabled'}">${display}</span>
      </button>
      ${hasVal && !opts.disabled ? `<button type="button" aria-label="${clearLabel}" class="inline-flex h-7 w-7 items-center justify-center rounded-md mr-1 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"><i class="fa-solid fa-xmark" style="font-size:11px" aria-hidden="true"></i></button>` : ''}
      <span class="pointer-events-none mr-3 text-text-secondary" aria-hidden="true"><i class="fa-solid fa-calendar" style="font-size:13px"></i></span>
    </div>
  </div>
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
      description:
        'Two-month popover for picking a start → end date range. Shares the same Calendar core as DatePicker; locale-aware, fully keyboard navigable, with min/max/disabledDates. Pixel-identical React sibling at modules/ui/DatePicker/index.tsx.',
      filePath: 'modules/ui/DatePicker/DateRangePicker.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default (TR locale)',
          previewHtml: wrap(dateRangeEl({
            label: 'Raporlama dönemi',
            hint: 'Bitiş tarihi başlangıçtan sonra olmalı.',
            locale: 'tr',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Raporlama dönemi',
  hint: 'Bitiş tarihi başlangıçtan sonra olmalı.'
}) %>`,
        },
        {
          title: 'With value (EN locale)',
          previewHtml: wrap(dateRangeEl({
            label: 'Booking window',
            value: { start: '2026-06-01', end: '2026-06-15' },
            locale: 'en',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Booking window',
  locale: 'en',
  value: { start: '2026-06-01', end: '2026-06-15' }
}) %>`,
        },
        {
          title: 'Required + error',
          previewHtml: wrap(dateRangeEl({
            label: 'Campaign dates',
            required: true,
            error: 'Please pick both dates.',
            locale: 'en',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Campaign dates',
  locale: 'en',
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
            locale: 'en',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Locked range',
  locale: 'en',
  value: { start: '2026-01-01', end: '2026-01-31' },
  disabled: true
}) %>`,
        },
        {
          title: 'Locale: Türkçe + custom messages',
          previewHtml: wrap(dateRangeEl({
            label: 'Tatil tarihleri',
            value: { start: '2026-07-01', end: '2026-07-14' },
            locale: 'tr',
          })),
          code: `<%- include('modules/ui/DateRangePicker', {
  label: 'Tatil tarihleri',
  locale: 'tr',
  value: { start: '2026-07-01', end: '2026-07-14' },
  clear_label: 'Temizle'
}) %>`,
        },
      ],
    },
  ];
}
