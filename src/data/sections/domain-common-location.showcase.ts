import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const locationPickerSource  = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/location/LocationPicker.ejs'), 'utf-8');
const geoPointDisplaySource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/location/GeoPointDisplay.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const baseInput = (opts: { id: string; label: string; placeholder?: string; value?: string }) =>
  `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>
  <input type="text" id="${opts.id}" placeholder="${opts.placeholder || ''}" ${opts.value ? `value="${opts.value}"` : ''}
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
</div>`;

function geoEl(lat: number, lng: number, label?: string, showLink = true, precision = 6): string {
  const latStr = lat.toFixed(precision);
  const lngStr = lng.toFixed(precision);
  const mapsUrl = `https://www.google.com/maps?q=${latStr},${lngStr}`;
  return `<div class="inline-flex items-center gap-2 text-sm">
  <i class="fa-solid fa-location-dot text-text-disabled shrink-0" aria-hidden="true"></i>
  <div class="min-w-0">
    ${label ? `<p class="text-xs text-text-secondary mb-0.5">${label}</p>` : ''}
    <p class="font-mono text-text-primary tabular-nums">${latStr}, ${lngStr}</p>
  </div>
  ${showLink ? `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-primary hover:text-primary-hover underline shrink-0">Map</a>` : ''}
</div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonLocationData(): ShowcaseItem[] {
  return [
    // ── LocationPicker ────────────────────────────────────────────────────────
    {
      id: 'location-picker',
      title: 'LocationPicker',
      category: 'Domain',
      abbr: 'Lp',
      description: 'Location form with country selector (countries-list), city, state, postal code, and optional lat/lng. 2-column grid layout.',
      filePath: 'modules/domain/common/location/LocationPicker.ejs',
      sourceCode: locationPickerSource,
      variants: [
        {
          title: 'Empty',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="w-full">
        <label class="block text-sm font-medium text-text-primary mb-1.5">Country</label>
        <div class="relative">
          <select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm pr-8">
            <option value="">Select country…</option>
            <option>Turkey</option><option>United States</option><option>Germany</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
            <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      ${baseInput({ id: 'lp1', label: 'City' })}
      ${baseInput({ id: 'lp2', label: 'State / Province' })}
      ${baseInput({ id: 'lp3', label: 'Postal Code' })}
      ${baseInput({ id: 'lp4', label: 'Latitude' })}
      ${baseInput({ id: 'lp5', label: 'Longitude' })}
    </div>
    <div class="flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save Location</button></div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/location/LocationPicker', {
  action: '/locations/update',
  countries: countryList
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Pre-filled',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="w-full">
        <label class="block text-sm font-medium text-text-primary mb-1.5">Country</label>
        <div class="relative">
          <select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm pr-8">
            <option>Select country…</option>
            <option selected>Turkey</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
            <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      ${baseInput({ id: 'lp6', label: 'City', value: 'Istanbul' })}
      ${baseInput({ id: 'lp7', label: 'State / Province' })}
      ${baseInput({ id: 'lp8', label: 'Postal Code', value: '34000' })}
      ${baseInput({ id: 'lp9', label: 'Latitude', value: '41.0082' })}
      ${baseInput({ id: 'lp10', label: 'Longitude', value: '28.9784' })}
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" class="inline-flex items-center justify-center rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Cancel</button>
      <button type="submit" class="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save Location</button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/location/LocationPicker', {
  action: '/locations/update',
  cancelHref: '/settings',
  countries: countryList,
  initial: { city: 'Istanbul', countryCode: 'TR', postalCode: '34000', latitude: 41.0082, longitude: 28.9784 }
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── GeoPointDisplay ───────────────────────────────────────────────────────
    {
      id: 'geo-point-display',
      title: 'GeoPointDisplay',
      category: 'Domain',
      abbr: 'Gp',
      description: 'Displays latitude/longitude coordinates with a Google Maps link. Configurable precision and optional label.',
      filePath: 'modules/domain/common/location/GeoPointDisplay.ejs',
      sourceCode: geoPointDisplaySource,
      variants: [
        {
          title: 'With label',
          previewHtml: `<div class="flex flex-col gap-3 p-4">
  ${geoEl(41.0082, 28.9784, 'Istanbul')}
  ${geoEl(48.8566, 2.3522,  'Paris')}
  ${geoEl(40.7128, -74.006, 'New York')}
</div>`,
          code: `<%- include('modules/domain/common/location/GeoPointDisplay', {
  point: { latitude: 41.0082, longitude: 28.9784 },
  label: 'Istanbul'
}) %>`,
        },
        {
          title: 'Coordinates only',
          previewHtml: `<div class="p-4">
  ${geoEl(51.5074, -0.1278, undefined, false, 4)}
</div>`,
          code: `<%- include('modules/domain/common/location/GeoPointDisplay', {
  point: { latitude: 51.5074, longitude: -0.1278 },
  showMapLink: false,
  precision: 4
}) %>`,
        },
      ],
    },
  ];
}
