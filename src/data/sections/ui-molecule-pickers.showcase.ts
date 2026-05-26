import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const datePickerSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/DatePicker/DatePicker.ejs'), 'utf-8');
const fileInputSource  = fs.readFileSync(path.join(process.cwd(), 'modules/ui/FileInput.ejs'), 'utf-8');
const colorPickerPath  = path.join(process.cwd(), 'modules/ui/ColorPicker.ejs');
const colorPickerSource = fs.readFileSync(colorPickerPath, 'utf-8');
function renderColorPicker(locals: Record<string, unknown>): string {
  return ejs.render(colorPickerSource, locals, { filename: colorPickerPath });
}

const wrapW = (inner: string) => `<div class="flex items-start justify-center p-4 w-full max-w-xs">${inner}</div>`;
const wrapFull = (inner: string) => `<div class="p-4 w-full max-w-sm">${inner}</div>`;

function datePickerEl(opts: {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  required?: boolean;
  locale?: 'tr' | 'en';
  format?: string;
  placeholder?: string;
  clearLabel?: string;
}) {
  const id = `dp-${Math.random().toString(36).substr(2, 5)}`;
  const locale = opts.locale || 'tr';
  const placeholder = opts.placeholder || (locale === 'en' ? 'MM/DD/YYYY' : 'GG.AA.YYYY');
  const format = opts.format || (locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY');
  const clearLabel = opts.clearLabel || (locale === 'en' ? 'Clear date' : 'Tarihi temizle');

  // Static SSR preview of the new popover trigger (the live JS bundle does
  // not run inside the showcase iframe).
  let triggerCls = 'group relative flex w-full items-center rounded-md border transition-colors '
    + 'bg-surface-base text-text-primary '
    + 'focus-within:ring-2 focus-within:ring-border-focus focus-within:border-border-focus ';
  if (opts.disabled) triggerCls += 'opacity-50 cursor-not-allowed bg-surface-sunken ';
  triggerCls += opts.error
    ? 'border-error ring-1 ring-error bg-error-subtle'
    : 'border-border';

  // Format the value preview client-side-of-render — simple replace tokens.
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
  const displayText = fmtPreview(opts.value);

  return `<div class="w-full space-y-1">
  ${opts.label ? `<label for="${id}" class="block text-sm font-medium text-text-primary">${opts.label}${opts.required ? '<span class="text-error ml-1" aria-hidden="true">*</span>' : ''}</label>` : ''}
  <div class="relative">
    <div class="${triggerCls}">
      <button type="button" id="${id}" class="flex-1 text-left px-3 py-2 text-sm bg-transparent rounded-l-md focus-visible:outline-none disabled:cursor-not-allowed" aria-haspopup="dialog" aria-expanded="false"${opts.disabled ? ' disabled' : ''}>
        <span class="${displayText ? '' : 'text-text-disabled'}">${displayText || placeholder}</span>
      </button>
      ${displayText && !opts.disabled ? `<button type="button" aria-label="${clearLabel}" class="inline-flex h-7 w-7 items-center justify-center rounded-md mr-1 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"><i class="fa-solid fa-xmark" style="font-size:11px" aria-hidden="true"></i></button>` : ''}
      <span class="pointer-events-none mr-3 text-text-secondary" aria-hidden="true"><i class="fa-solid fa-calendar" style="font-size:13px"></i></span>
    </div>
  </div>
  ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
  ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
</div>`;
}

function fileInputEl(opts: { label?: string; hint?: string; accept?: string; multiple?: boolean; disabled?: boolean; error?: string }) {
  const id = `fi-${Math.random().toString(36).substr(2, 5)}`;
  return `<div class="w-full">
  ${opts.label ? `<label class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>` : ''}
  <label for="${id}" class="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed px-6 py-8 transition-colors cursor-pointer ${opts.disabled ? 'opacity-50 cursor-not-allowed border-border bg-surface-sunken' : 'border-border bg-surface hover:border-primary hover:bg-primary-subtle/30'}">
    <div class="flex flex-col items-center gap-2 text-center">
      <i class="fa-solid fa-cloud-arrow-up text-2xl ${opts.disabled ? 'text-text-tertiary' : 'text-text-secondary'}" aria-hidden="true"></i>
      <div>
        <p class="text-sm font-medium text-text-primary"><span class="text-primary">Click to upload</span> or drag and drop</p>
        ${opts.hint ? `<p class="text-xs text-text-secondary mt-0.5">${opts.hint}</p>` : ''}
        ${opts.accept ? `<p class="text-xs text-text-tertiary mt-0.5">Accepted: ${opts.accept}</p>` : ''}
      </div>
    </div>
    <input id="${id}" type="file" class="sr-only"${opts.multiple ? ' multiple' : ''}${opts.disabled ? ' disabled' : ''}${opts.accept ? ` accept="${opts.accept}"` : ''}>
  </label>
  ${opts.error ? `<p class="mt-1.5 text-sm text-error">${opts.error}</p>` : ''}
</div>`;
}

export function buildMoleculePickersData(): ShowcaseItem[] {
  return [
    {
      id: 'date-picker',
      title: 'DatePicker',
      category: 'Molecule',
      abbr: 'Dp',
      description:
        'Popover-based date picker with a locale-aware calendar grid (TR / EN), quick month / year jump from the header, min / max / disabledDates support, and full keyboard navigation (Arrow / PageUp/Down / Shift+Page / Home / End / Enter / Esc). Pixel-identical React sibling at modules/ui/DatePicker/index.tsx.',
      filePath: 'modules/ui/DatePicker/DatePicker.ejs',
      sourceCode: datePickerSource,
      variants: [
        {
          title: 'Default (TR locale)',
          previewHtml: wrapW(datePickerEl({ label: 'Randevu tarihi', hint: 'İleri bir tarih seçin.', locale: 'tr' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Randevu tarihi',
  hint: 'İleri bir tarih seçin.'
}) %>`,
        },
        {
          title: 'With value',
          previewHtml: wrapW(datePickerEl({ label: 'Start date', value: '2026-06-15', locale: 'en' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Start date',
  locale: 'en',
  value: '2026-06-15'
}) %>`,
        },
        {
          title: 'Error state',
          previewHtml: wrapW(datePickerEl({ label: 'Due date', error: 'Please select a date.', required: true, locale: 'en' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Due date',
  locale: 'en',
  required: true,
  error: 'Please select a date.'
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapW(datePickerEl({ label: 'Locked date', value: '2026-01-01', disabled: true, locale: 'en' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Locked date',
  locale: 'en',
  value: '2026-01-01',
  disabled: true
}) %>`,
        },
        {
          title: 'With min / max',
          previewHtml: wrapW(datePickerEl({ label: 'Booking date', hint: 'Available: Jun 1–30, 2026', min: '2026-06-01', max: '2026-06-30', locale: 'en' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Booking date',
  locale: 'en',
  hint: 'Available: Jun 1–30, 2026',
  min: '2026-06-01',
  max: '2026-06-30'
}) %>`,
        },
        {
          title: 'Locale: Türkçe + custom messages',
          previewHtml: wrapW(datePickerEl({ label: 'Randevu tarihi', value: '2026-05-26', locale: 'tr', clearLabel: 'Temizle' })),
          code: `<%- include('modules/ui/DatePicker', {
  label: 'Randevu tarihi',
  locale: 'tr',
  value: '2026-05-26',
  clear_label: 'Temizle'
}) %>`,
        },
      ],
    },
    {
      id: 'file-input',
      title: 'FileInput',
      category: 'Molecule',
      abbr: 'Fi',
      description: 'Drag-and-drop file upload with validation, file list, and individual remove actions.',
      filePath: 'modules/ui/FileInput.ejs',
      sourceCode: fileInputSource,
      variants: [
        {
          title: 'Single file',
          previewHtml: wrapFull(fileInputEl({ label: 'Profile photo', hint: 'PNG or JPG, max 2 MB', accept: 'image/*' })),
          code: `<%- include('modules/ui/FileInput', {
  label: 'Profile photo',
  hint: 'PNG or JPG, max 2 MB',
  accept: 'image/*'
}) %>`,
        },
        {
          title: 'Multiple files',
          previewHtml: wrapFull(fileInputEl({ label: 'Attachments', hint: 'Up to 5 MB each', multiple: true })),
          code: `<%- include('modules/ui/FileInput', {
  label: 'Attachments',
  hint: 'Up to 5 MB each',
  multiple: true
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapFull(fileInputEl({ label: 'Disabled upload', disabled: true })),
          code: `<%- include('modules/ui/FileInput', { label: 'Disabled upload', disabled: true }) %>`,
        },
        {
          title: 'With error',
          previewHtml: wrapFull(fileInputEl({ label: 'Document', hint: 'PDF only', accept: '.pdf', error: 'Please upload a valid PDF file.' })),
          code: `<%- include('modules/ui/FileInput', {
  label: 'Document',
  hint: 'PDF only',
  accept: '.pdf',
  error: 'Please upload a valid PDF file.'
}) %>`,
        },
      ],
    },
    {
      id: 'color-picker',
      title: 'ColorPicker',
      category: 'Molecule',
      abbr: 'Cp',
      description:
        'Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. Pixel-identical React sibling at modules/ui/ColorPicker.tsx. Used by RichTextEditor for text + highlight colors.',
      filePath: 'modules/ui/ColorPicker.ejs',
      sourceCode: colorPickerSource,
      since: '2026-05',
      variants: [
        {
          title: 'Default',
          previewHtml: wrapW(renderColorPicker({ id: 'cp-demo-default', label: 'Brand color', value: '#3b82f6', showNoColor: true })),
          code: `<%- include('modules/ui/ColorPicker', {
  id: 'brand',
  name: 'brand',
  label: 'Brand color',
  value: '#3b82f6',
  showNoColor: true
}) %>`,
        },
        {
          title: 'Compact (swatches only)',
          previewHtml: wrapW(renderColorPicker({ id: 'cp-demo-compact', value: '#22c55e', showHexInput: false, showNativePicker: false })),
          code: `<%- include('modules/ui/ColorPicker', {
  id: 'compact',
  value: '#22c55e',
  showHexInput: false,
  showNativePicker: false
}) %>`,
        },
        {
          title: 'Hex + native picker only (no swatches)',
          previewHtml: wrapW(renderColorPicker({ id: 'cp-demo-native', label: 'Background', swatches: [], showHexInput: true, showNativePicker: true, showNoColor: true })),
          code: `<%- include('modules/ui/ColorPicker', {
  id: 'bg',
  label: 'Background',
  swatches: [],
  showHexInput: true,
  showNativePicker: true,
  showNoColor: true
}) %>`,
        },
      ],
    },
  ];
}
