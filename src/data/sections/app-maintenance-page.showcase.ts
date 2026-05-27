import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/MaintenancePage.ejs'), 'utf-8');

export function buildMaintenancePageData(): ShowcaseItem[] {
  return [
    {
      id: 'maintenance-page',
      title: 'MaintenancePage',
      category: 'App',
      abbr: 'Mp',
      since: '2026-05',
      description: 'Full-page maintenance screen. Optional ETA countdown badge and external status-page link. Use for planned downtime or unplanned outages.',
      filePath: 'modules/app/MaintenancePage.ejs',
      sourceCode,
      variants: [
        {
          title: 'Plain (no ETA)',
          layout: 'stack',
          previewHtml: `<div class="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style="height: 360px;">
  <div role="status" aria-live="polite" class="absolute inset-0 flex flex-col items-center justify-center px-4 bg-surface-base">
    <div class="flex h-20 w-20 mb-6 items-center justify-center rounded-2xl text-4xl shadow-lg" style="background: linear-gradient(135deg, var(--warning) 0%, var(--primary) 100%); box-shadow: 0 8px 32px color-mix(in srgb, var(--warning) 30%, transparent);">
      <i class="fa-solid fa-screwdriver-wrench text-text-inverse" style="font-size: 2rem;" aria-hidden="true"></i>
    </div>
    <h1 class="text-2xl sm:text-3xl font-bold text-text-primary text-center">System Maintenance</h1>
    <p class="mt-3 max-w-md text-center text-text-secondary text-sm sm:text-base leading-relaxed">We're performing a short maintenance to improve service quality. We'll be back shortly.</p>
    <div class="mt-16 flex items-center gap-2 opacity-20" aria-hidden="true">
      <span class="rounded-full bg-warning" style="width: 5px; height: 5px;"></span>
      <span class="rounded-full bg-warning" style="width: 7px; height: 7px;"></span>
      <span class="rounded-full bg-warning" style="width: 10px; height: 10px;"></span>
      <span class="rounded-full bg-warning" style="width: 7px; height: 7px;"></span>
      <span class="rounded-full bg-warning" style="width: 5px; height: 5px;"></span>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/MaintenancePage', {
  title: 'System Maintenance',
  description: "We're performing a short maintenance."
}) %>`,
        },
        {
          title: 'With ETA + status link',
          layout: 'stack',
          previewHtml: `<div class="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style="height: 420px;">
  <div role="status" aria-live="polite" class="absolute inset-0 flex flex-col items-center justify-center px-4 bg-surface-base">
    <div class="flex h-20 w-20 mb-6 items-center justify-center rounded-2xl text-4xl shadow-lg" style="background: linear-gradient(135deg, var(--warning) 0%, var(--primary) 100%); box-shadow: 0 8px 32px color-mix(in srgb, var(--warning) 30%, transparent);">
      <i class="fa-solid fa-screwdriver-wrench text-text-inverse" style="font-size: 2rem;" aria-hidden="true"></i>
    </div>
    <h1 class="text-2xl sm:text-3xl font-bold text-text-primary text-center">System Maintenance</h1>
    <p class="mt-3 max-w-md text-center text-text-secondary text-sm sm:text-base leading-relaxed">We're shipping new features. Estimated return time below.</p>
    <div class="mt-6 flex flex-col items-center gap-2">
      <span class="text-xs uppercase tracking-wide text-text-disabled">Estimated Return</span>
      <span class="inline-flex items-center gap-1 rounded-full font-medium bg-warning-subtle text-warning-fg px-3 py-1 text-sm">
        <i class="fa-solid fa-clock" style="font-size: 0.75rem;" aria-hidden="true"></i>
        <span class="font-mono tabular-nums">00:45:00</span>
      </span>
    </div>
    <a href="https://status.example.com" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-text-primary border border-border transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      Status Page
      <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.875rem;" aria-hidden="true"></i>
    </a>
    <div class="mt-16 flex items-center gap-2 opacity-20" aria-hidden="true">
      <span class="rounded-full bg-warning" style="width: 5px; height: 5px;"></span>
      <span class="rounded-full bg-warning" style="width: 7px; height: 7px;"></span>
      <span class="rounded-full bg-warning" style="width: 10px; height: 10px;"></span>
      <span class="rounded-full bg-warning" style="width: 7px; height: 7px;"></span>
      <span class="rounded-full bg-warning" style="width: 5px; height: 5px;"></span>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/MaintenancePage', {
  title: 'System Maintenance',
  description: "We're shipping new features.",
  eta: new Date(Date.now() + 45 * 60 * 1000),
  statusUrl: 'https://status.example.com',
  statusLabel: 'Status Page'
}) %>`,
        },
      ],
    },
  ];
}
