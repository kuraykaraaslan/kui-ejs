import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const addressFormSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/address/AddressForm.ejs'), 'utf-8');
const addressCardSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/address/AddressCard.ejs'), 'utf-8');
const addressSelectorSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/address/AddressSelector.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const baseInput = (opts: { id: string; label: string; type?: string; placeholder?: string; value?: string; required?: boolean }) =>
  `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">
    ${opts.label}${opts.required ? ' <span class="text-error">*</span>' : ''}
  </label>
  <input type="${opts.type || 'text'}" id="${opts.id}" placeholder="${opts.placeholder || ''}"
    ${opts.value ? `value="${opts.value}"` : ''}
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
</div>`;

function addressCardHtml(addr: {
  fullName?: string; phone?: string; addressLine1: string; addressLine2?: string;
  city?: string; state?: string; postalCode?: string; country?: string; countryCode?: string;
}, opts: { selected?: boolean; onEdit?: boolean; onDelete?: boolean } = {}): string {
  const cityLine    = [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ');
  const countryLine = [addr.country, addr.countryCode ? `(${addr.countryCode})` : ''].filter(Boolean).join(' ');
  const borderClass = opts.selected
    ? 'border-primary ring-2 ring-primary ring-offset-1'
    : 'border-border';
  return `<div class="relative rounded-lg border bg-surface-raised p-4 space-y-2 transition-colors ${borderClass}">
  ${opts.selected !== undefined ? `<span aria-hidden="true" class="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${opts.selected ? 'border-primary bg-primary' : 'border-border bg-surface-base'}">
    ${opts.selected ? '<span class="h-1.5 w-1.5 rounded-full bg-white"></span>' : ''}
  </span>` : ''}
  ${addr.fullName ? `<div class="flex items-center gap-2 text-sm font-medium text-text-primary"><i class="fa-solid fa-user w-3 h-3 text-text-disabled shrink-0" aria-hidden="true"></i>${addr.fullName}</div>` : ''}
  <div class="flex items-start gap-2 text-sm text-text-secondary">
    <i class="fa-solid fa-location-dot w-3 h-3 text-text-disabled shrink-0 mt-0.5" aria-hidden="true"></i>
    <div class="space-y-0.5">
      <p>${addr.addressLine1}</p>
      ${addr.addressLine2 ? `<p>${addr.addressLine2}</p>` : ''}
      ${cityLine ? `<p>${cityLine}</p>` : ''}
      ${countryLine ? `<p>${countryLine}</p>` : ''}
    </div>
  </div>
  ${addr.phone ? `<div class="flex items-center gap-2 text-sm text-text-secondary"><i class="fa-solid fa-phone w-3 h-3 text-text-disabled shrink-0" aria-hidden="true"></i>${addr.phone}</div>` : ''}
  ${(opts.onEdit || opts.onDelete) ? `<div class="flex gap-2 pt-2 border-t border-border">
    ${opts.onEdit ? '<button type="button" class="text-xs text-primary hover:opacity-80">Edit</button>' : ''}
    ${opts.onDelete ? '<button type="button" class="text-xs text-error hover:opacity-80">Delete</button>' : ''}
  </div>` : ''}
</div>`;
}

const DEMO_ADDR = {
  fullName: 'Jane Doe', phone: '+1 555 000 0000',
  addressLine1: '123 Main Street, Apt 4B', addressLine2: 'Near Central Park',
  city: 'New York', state: 'NY', postalCode: '10001', country: 'United States', countryCode: 'US',
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonAddressData(): ShowcaseItem[] {
  return [
    // ── AddressForm ───────────────────────────────────────────────────────────
    {
      id: 'address-form',
      title: 'AddressForm',
      category: 'Domain',
      abbr: 'Af',
      description: 'Full address form with full name, phone, address lines, city, state/district, postal code, and country. Pre-fillable via the initial prop.',
      filePath: 'modules/domain/common/address/AddressForm.ejs',
      sourceCode: addressFormSource,
      variants: [
        {
          title: 'Empty',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <h2 class="text-base font-semibold text-text-primary">New Address</h2>
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'af1', label: 'Full Name', required: true })}
      ${baseInput({ id: 'af2', label: 'Phone', type: 'tel' })}
    </div>
    ${baseInput({ id: 'af3', label: 'Address Line 1', required: true })}
    ${baseInput({ id: 'af4', label: 'Address Line 2 (optional)' })}
    <div class="grid grid-cols-3 gap-4">
      ${baseInput({ id: 'af5', label: 'City', required: true })}
      ${baseInput({ id: 'af6', label: 'State / District' })}
      ${baseInput({ id: 'af7', label: 'Postal Code' })}
    </div>
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'af8', label: 'Country', required: true })}
      ${baseInput({ id: 'af9', label: 'Country Code' })}
    </div>
    <div class="flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save</button></div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/address/AddressForm', {
  action: '/addresses/new'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Pre-filled',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <h2 class="text-base font-semibold text-text-primary">Edit Address</h2>
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'af10', label: 'Full Name', value: 'Jane Doe', required: true })}
      ${baseInput({ id: 'af11', label: 'Phone', value: '+1 555 000 0000', type: 'tel' })}
    </div>
    ${baseInput({ id: 'af12', label: 'Address Line 1', value: '123 Main Street, Apt 4B', required: true })}
    ${baseInput({ id: 'af13', label: 'Address Line 2 (optional)', value: 'Near Central Park' })}
    <div class="grid grid-cols-3 gap-4">
      ${baseInput({ id: 'af14', label: 'City', value: 'New York', required: true })}
      ${baseInput({ id: 'af15', label: 'State / District', value: 'NY' })}
      ${baseInput({ id: 'af16', label: 'Postal Code', value: '10001' })}
    </div>
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'af17', label: 'Country', value: 'United States', required: true })}
      ${baseInput({ id: 'af18', label: 'Country Code', value: 'US' })}
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" class="inline-flex items-center justify-center rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Cancel</button>
      <button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Update</button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/address/AddressForm', {
  action: '/addresses/1/edit',
  initial: existingAddress,
  submitLabel: 'Update',
  cancelHref: '/addresses'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── AddressCard ───────────────────────────────────────────────────────────
    {
      id: 'address-card',
      title: 'AddressCard',
      category: 'Domain',
      abbr: 'Ac',
      description: 'Read-only address display card with full name, phone, address lines, city, state, postal code, and country. Supports selected state and optional Edit/Delete actions.',
      filePath: 'modules/domain/common/address/AddressCard.ejs',
      sourceCode: addressCardSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="w-full max-w-sm p-4">${addressCardHtml(DEMO_ADDR, { onEdit: true, onDelete: true })}</div>`,
          code: `<%- include('modules/domain/common/address/AddressCard', {
  address: savedAddress,
  editHref: '/addresses/1/edit',
  deleteAction: '/addresses/1/delete'
}) %>`,
        },
        {
          title: 'Selectable list',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-3">
  ${addressCardHtml(DEMO_ADDR, { selected: true })}
  ${addressCardHtml({ addressLine1: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'United States', countryCode: 'US', fullName: 'John Smith' }, { selected: false })}
</div>`,
          code: `<%- include('modules/domain/common/address/AddressCard', {
  address: address,
  selected: selectedIdx === i
}) %>`,
        },
      ],
    },

    // ── AddressSelector ───────────────────────────────────────────────────────
    {
      id: 'address-selector',
      title: 'AddressSelector',
      category: 'Domain',
      abbr: 'As',
      description: 'Selectable list of saved addresses built on AddressCard. Supports add, edit, and delete callbacks.',
      filePath: 'modules/domain/common/address/AddressSelector.ejs',
      sourceCode: addressSelectorSource,
      variants: [
        {
          title: 'Multiple addresses',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-3">
  ${addressCardHtml(DEMO_ADDR, { selected: true })}
  ${addressCardHtml({ addressLine1: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'United States', countryCode: 'US', fullName: 'John Smith' }, { selected: false })}
  <button type="button" class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">+ Add new address</button>
</div>`,
          code: `<%- include('modules/domain/common/address/AddressSelector', {
  addresses: savedAddresses,
  selectedIndex: 0,
  addHref: '/addresses/new'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-3">
  <p class="text-sm text-text-secondary py-4 text-center">No saved addresses.</p>
  <a href="#" class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">+ Add new address</a>
</div>`,
          code: `<%- include('modules/domain/common/address/AddressSelector', {
  addresses: [],
  addHref: '/addresses/new'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
