import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/location/CountrySelector.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Country = { iso2: string; name: string };

function flag(iso2: string, dim = false): string {
  return `<span class="inline-flex items-center justify-center h-3.5 min-w-[1.25rem] px-1 rounded-[2px] bg-surface-overlay text-[9px] font-mono font-bold text-text-secondary shadow-sm shrink-0${dim ? ' hidden' : ''}">${iso2}</span>`;
}

function trigger(opts: {
  label?: string | null;
  selected?: Country | null;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  open?: boolean;
}): string {
  const placeholder = opts.placeholder || 'Select country…';
  const label = opts.label === null ? '' : (opts.label || 'Country');
  const errorClass = opts.error ? 'border-error ring-1 ring-error' : 'border-border';
  return `<div class="space-y-1">
    ${label ? `<label class="block text-sm font-medium text-text-primary">${label}${opts.required ? '<span class="text-error ml-1" aria-hidden="true">*</span>' : ''}</label>` : ''}
    <button type="button" ${opts.disabled ? 'disabled' : ''}
      aria-haspopup="listbox" aria-expanded="${opts.open ? 'true' : 'false'}"
      aria-invalid="${opts.error ? 'true' : 'false'}"
      class="inline-flex items-center justify-between gap-2 w-full rounded-md border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed ${errorClass}">
      <span class="flex items-center gap-2 min-w-0">
        ${opts.selected ? `${flag(opts.selected.iso2)}<span class="truncate">${opts.selected.name}</span>` : `${flag('', true)}<span class="text-text-disabled truncate">${placeholder}</span>`}
      </span>
      <i class="fa-solid fa-chevron-down w-3 h-3 text-text-disabled shrink-0" aria-hidden="true"></i>
    </button>
    ${opts.hint && !opts.error ? `<p class="text-xs text-text-secondary">${opts.hint}</p>` : ''}
    ${opts.error ? `<p class="text-xs text-error" role="alert">${opts.error}</p>` : ''}
  </div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonCountrySelectorData(): ShowcaseItem[] {
  return [
    {
      id: 'country-selector',
      title: 'CountrySelector',
      category: 'Domain',
      abbr: 'Co',
      description: 'ISO2 kodlu ülke listesi üzerinden aranabilir, klavye erişilebilir özel select. Form gönderimi için gizli input, hata/hint/required durumları ve fixed pozisyonlu açılır panel içerir.',
      filePath: 'modules/domain/common/location/CountrySelector.ejs',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="w-full max-w-sm p-4">
  ${trigger({ selected: { iso2: 'TR', name: 'Türkiye' } })}
</div>`,
          code: `<%- include('modules/domain/common/location/CountrySelector', {
  name: 'countryCode',
  value: 'TR',
  countries: countryList
}) %>`,
        },
        {
          title: 'With hint & error',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-4">
  ${trigger({ selected: null, hint: 'Used for shipping address.' })}
  ${trigger({ selected: null, error: 'Please select a country.', required: true })}
</div>`,
          code: `<%- include('modules/domain/common/location/CountrySelector', {
  name: 'countryCode',
  countries: countryList,
  hint: 'Used for shipping address.'
}) %>
<%- include('modules/domain/common/location/CountrySelector', {
  name: 'countryCode',
  countries: countryList,
  error: 'Please select a country.',
  required: true
}) %>`,
        },
        {
          title: 'No label',
          previewHtml: `<div class="w-full max-w-sm p-4">
  ${trigger({ selected: { iso2: 'US', name: 'United States' }, label: null })}
</div>`,
          code: `<%- include('modules/domain/common/location/CountrySelector', {
  name: 'countryCode',
  value: 'US',
  countries: countryList,
  label: ''
}) %>`,
        },
      ],
    },
  ];
}
