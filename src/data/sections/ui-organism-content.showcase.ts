import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const cardSource        = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Card.ejs'), 'utf-8');
const alertBannerSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/AlertBanner.ejs'), 'utf-8');
const toastSource       = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Toast/Toast.ejs'), 'utf-8');

// ─── Card ─────────────────────────────────────────────────────────────────────

function cardEl(opts: {
  title?: string;
  subtitle?: string;
  variant?: 'raised' | 'flat' | 'outline';
  children?: string;
  footer?: string;
  headerRight?: string;
  hoverable?: boolean;
  loading?: boolean;
}) {
  const variantClass: Record<string, string> = {
    raised:  'bg-surface-raised shadow-sm',
    flat:    'bg-surface-base',
    outline: 'bg-transparent',
  };
  const v = opts.variant || 'raised';
  const hoverClass = opts.hoverable
    ? 'transition-shadow hover:shadow-md hover:border-border-focus cursor-pointer'
    : '';

  if (opts.loading) {
    return `<div class="rounded-xl border border-border overflow-hidden text-left ${variantClass[v]} ${hoverClass}">
  <div class="px-6 py-4 space-y-3 animate-pulse">
    <div class="h-4 bg-surface-sunken rounded w-2/3"></div>
    <div class="h-3 bg-surface-sunken rounded w-full"></div>
    <div class="h-3 bg-surface-sunken rounded w-4/5"></div>
    <div class="h-3 bg-surface-sunken rounded w-1/2"></div>
  </div>
</div>`;
  }

  const header = (opts.title || opts.headerRight)
    ? `<div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
    <div>${opts.title ? `<h3 class="text-sm font-semibold text-text-primary">${opts.title}</h3>` : ''}${opts.subtitle ? `<p class="text-xs text-text-secondary mt-0.5">${opts.subtitle}</p>` : ''}</div>
    ${opts.headerRight ? `<div class="shrink-0">${opts.headerRight}</div>` : ''}
  </div>` : '';
  const body   = opts.children ? `<div class="px-6 py-4">${opts.children}</div>` : '';
  const footer = opts.footer   ? `<div class="px-6 py-3 border-t border-border bg-surface-base">${opts.footer}</div>` : '';

  return `<div class="rounded-xl border border-border overflow-hidden text-left ${variantClass[v]} ${hoverClass}">
  ${header}${body}${footer}
</div>`;
}

// ─── AlertBanner ──────────────────────────────────────────────────────────────

function alertEl(opts: {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  actionLabel?: string;
  actionHref?: string;
}) {
  const variantMap: Record<string, { container: string; icon: string }> = {
    success: { container: 'bg-success-subtle border-success text-success-fg', icon: 'fa-circle-check' },
    warning: { container: 'bg-warning-subtle border-warning text-warning-fg', icon: 'fa-triangle-exclamation' },
    error:   { container: 'bg-error-subtle border-error text-error-fg',       icon: 'fa-circle-xmark' },
    info:    { container: 'bg-info-subtle border-info text-info-fg',          icon: 'fa-circle-info' },
  };
  const vm = variantMap[opts.variant || 'info'];
  const actionHtml = opts.actionLabel
    ? `<div class="mt-2">${opts.actionHref
        ? `<a href="${opts.actionHref}" class="text-xs font-semibold underline underline-offset-2 hover:opacity-70">${opts.actionLabel}</a>`
        : `<button type="button" class="text-xs font-semibold underline underline-offset-2 hover:opacity-70">${opts.actionLabel}</button>`
      }</div>` : '';
  const dismiss = opts.dismissible
    ? `<button type="button" aria-label="Dismiss" class="shrink-0 hover:opacity-70 transition-opacity rounded"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`
    : '';
  return `<div role="alert" class="flex items-start gap-3 rounded-lg border p-4 ${vm.container}">
  <i class="fa-solid ${vm.icon} mt-0.5 shrink-0 text-base" aria-hidden="true"></i>
  <div class="flex-1 text-sm min-w-0">
    ${opts.title ? `<p class="font-semibold">${opts.title}</p>` : ''}
    <p class="${opts.title ? 'mt-0.5' : ''}">${opts.message}</p>
    ${actionHtml}
  </div>
  ${dismiss}
</div>`;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function toastEl(opts: {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'loading';
  title?: string;
  message: string;
  actionLabel?: string;
  persistent?: boolean;
}) {
  const variantMap: Record<string, { container: string; iconColor: string; icon: string }> = {
    success: { container: 'bg-success-subtle border-success', iconColor: 'text-success-fg', icon: 'fa-circle-check' },
    warning: { container: 'bg-warning-subtle border-warning', iconColor: 'text-warning',    icon: 'fa-triangle-exclamation' },
    error:   { container: 'bg-error-subtle border-error',     iconColor: 'text-error',      icon: 'fa-circle-xmark' },
    info:    { container: 'bg-info-subtle border-info',       iconColor: 'text-info',        icon: 'fa-circle-info' },
    loading: { container: 'bg-surface-raised border-border',  iconColor: 'text-text-secondary', icon: 'fa-spinner fa-spin' },
  };
  const vm = variantMap[opts.variant || 'info'];
  const action = opts.actionLabel
    ? `<div class="flex flex-wrap gap-x-3 gap-y-1 mt-2.5"><button type="button" class="text-xs font-semibold rounded underline underline-offset-2 text-text-primary hover:opacity-70">${opts.actionLabel}</button></div>`
    : '';
  const closeBtn = !opts.persistent
    ? `<button type="button" aria-label="Dismiss" class="shrink-0 mt-0.5 rounded text-text-secondary hover:text-text-primary transition-colors"><i class="fa-solid fa-xmark text-sm" aria-hidden="true"></i></button>`
    : '';
  return `<div class="relative w-80 rounded-xl border shadow-lg overflow-hidden ${vm.container}">
  <div class="flex items-start gap-3 px-4 pt-4 pb-3">
    <i class="fa-solid ${vm.icon} mt-0.5 shrink-0 ${vm.iconColor}" aria-hidden="true"></i>
    <div class="flex-1 min-w-0">
      ${opts.title ? `<p class="text-sm font-semibold text-text-primary leading-snug">${opts.title}</p>` : ''}
      <p class="text-sm text-text-secondary leading-snug${opts.title ? ' mt-0.5' : ''}">${opts.message}</p>
      ${action}
    </div>
    ${closeBtn}
  </div>
</div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

const wrapMd  = (inner: string) => `<div class="p-4 w-full max-w-sm">${inner}</div>`;
const wrapFull = (inner: string) => `<div class="p-4 w-full max-w-md">${inner}</div>`;

export function buildOrganismContentData(): ShowcaseItem[] {
  return [
    // ── Card ──────────────────────────────────────────────────────────────────
    {
      id: 'card',
      title: 'Card',
      category: 'Organism',
      abbr: 'Cd',
      description: 'Content container with raised / flat / outline variants. Supports title, subtitle, headerRight, footer slots and loading skeleton state.',
      filePath: 'modules/ui/Card.ejs',
      sourceCode: cardSource,
      variants: [
        {
          title: 'Default (raised)',
          previewHtml: wrapMd(cardEl({
            title: 'Card title',
            subtitle: 'Optional subtitle',
            children: '<p class="text-sm text-text-secondary">Card body content goes here. You can put any HTML inside.</p>',
            footer: '<div class="flex justify-end gap-2"><button class="px-3 py-1.5 text-sm rounded-md border border-border text-text-secondary hover:bg-surface-overlay">Cancel</button><button class="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-fg hover:bg-primary-hover">Confirm</button></div>',
          })),
          code: `<%- include('modules/ui/Card', {
  title: 'Card title',
  subtitle: 'Optional subtitle',
  children: '<p>Card body content goes here.</p>',
  footer: '<div class="flex justify-end gap-2">...</div>'
}) %>`,
        },
        {
          title: 'Flat',
          previewHtml: wrapMd(cardEl({
            title: 'Flat card',
            variant: 'flat',
            children: '<p class="text-sm text-text-secondary">No shadow, transparent background.</p>',
          })),
          code: `<%- include('modules/ui/Card', {
  title: 'Flat card',
  variant: 'flat',
  children: '<p>No shadow, transparent background.</p>'
}) %>`,
        },
        {
          title: 'Outline',
          previewHtml: wrapMd(cardEl({
            title: 'Outline card',
            variant: 'outline',
            children: '<p class="text-sm text-text-secondary">Border only, no background fill.</p>',
          })),
          code: `<%- include('modules/ui/Card', {
  title: 'Outline card',
  variant: 'outline',
  children: '<p>Border only, no background fill.</p>'
}) %>`,
        },
        {
          title: 'Hoverable',
          previewHtml: wrapMd(cardEl({
            title: 'Hoverable card',
            hoverable: true,
            children: '<p class="text-sm text-text-secondary">Hover to see the shadow lift effect.</p>',
          })),
          code: `<%- include('modules/ui/Card', {
  title: 'Hoverable card',
  hoverable: true,
  children: '<p>Hover to see the shadow lift effect.</p>'
}) %>`,
        },
        {
          title: 'Loading skeleton',
          previewHtml: wrapMd(cardEl({ loading: true })),
          code: `<%- include('modules/ui/Card', { loading: true }) %>`,
        },
        {
          title: 'With headerRight',
          previewHtml: wrapMd(cardEl({
            title: 'Recent activity',
            subtitle: 'Last 7 days',
            headerRight: '<span class="text-xs font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded-full">Live</span>',
            children: '<p class="text-sm text-text-secondary">Activity feed content here.</p>',
          })),
          code: `<%- include('modules/ui/Card', {
  title: 'Recent activity',
  subtitle: 'Last 7 days',
  headerRight: '<span class="text-xs font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded-full">Live</span>',
  children: '<p>Activity feed content here.</p>'
}) %>`,
        },
      ],
    },

    // ── AlertBanner ───────────────────────────────────────────────────────────
    {
      id: 'alert-banner',
      title: 'AlertBanner',
      category: 'Organism',
      abbr: 'Al',
      description: 'Page-level info, success, warning or error message. Announced via role="alert" for screen readers with optional dismissible and action support.',
      filePath: 'modules/ui/AlertBanner.ejs',
      sourceCode: alertBannerSource,
      variants: [
        {
          title: 'Info',
          previewHtml: wrapFull(alertEl({ variant: 'info', title: 'Heads up', message: 'You can update your preferences at any time from the settings page.' })),
          code: `<%- include('modules/ui/AlertBanner', {
  variant: 'info',
  title: 'Heads up',
  message: 'You can update your preferences at any time.'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Success',
          previewHtml: wrapFull(alertEl({ variant: 'success', title: 'Changes saved', message: 'Your profile has been updated successfully.' })),
          code: `<%- include('modules/ui/AlertBanner', {
  variant: 'success',
  title: 'Changes saved',
  message: 'Your profile has been updated successfully.'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Warning',
          previewHtml: wrapFull(alertEl({ variant: 'warning', title: 'Subscription expiring', message: 'Your plan expires in 3 days. Renew now to avoid interruption.', actionLabel: 'Renew plan' })),
          code: `<%- include('modules/ui/AlertBanner', {
  variant: 'warning',
  title: 'Subscription expiring',
  message: 'Your plan expires in 3 days.',
  actionLabel: 'Renew plan'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Error',
          previewHtml: wrapFull(alertEl({ variant: 'error', title: 'Payment failed', message: 'We could not charge your card. Please update your billing details.', actionLabel: 'Update billing', actionHref: '#' })),
          code: `<%- include('modules/ui/AlertBanner', {
  variant: 'error',
  title: 'Payment failed',
  message: 'We could not charge your card.',
  actionLabel: 'Update billing',
  actionHref: '/billing'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Dismissible',
          previewHtml: wrapFull(alertEl({ variant: 'info', message: 'This alert can be dismissed.', dismissible: true })),
          code: `<%- include('modules/ui/AlertBanner', {
  variant: 'info',
  message: 'This alert can be dismissed.',
  dismissible: true
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── Toast ─────────────────────────────────────────────────────────────────
    {
      id: 'toast',
      title: 'Toast',
      category: 'Organism',
      abbr: 'Ts',
      description: 'Notification system with success/warning/error/info/loading variants. Hover-to-freeze, progress bar, title, actions, and promise support.',
      filePath: 'modules/ui/Toast/Toast.ejs',
      sourceCode: toastSource,
      variants: [
        {
          title: 'Success',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'success', title: 'File uploaded', message: 'report.pdf has been uploaded successfully.' })}</div>`,
          code: `<%- include('modules/ui/Toast', {
  variant: 'success',
  title: 'File uploaded',
  message: 'report.pdf has been uploaded successfully.'
}) %>`,
        },
        {
          title: 'Error',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'error', title: 'Upload failed', message: 'The file exceeds the 10 MB size limit.', actionLabel: 'Try again' })}</div>`,
          code: `<%- include('modules/ui/Toast', {
  variant: 'error',
  title: 'Upload failed',
  message: 'The file exceeds the 10 MB size limit.',
  actionLabel: 'Try again'
}) %>`,
        },
        {
          title: 'Warning',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'warning', message: 'Session expires in 5 minutes.' })}</div>`,
          code: `<%- include('modules/ui/Toast', {
  variant: 'warning',
  message: 'Session expires in 5 minutes.'
}) %>`,
        },
        {
          title: 'Info',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'info', title: 'New update', message: 'Version 2.4 is available. Refresh to apply.' })}</div>`,
          code: `<%- include('modules/ui/Toast', {
  variant: 'info',
  title: 'New update',
  message: 'Version 2.4 is available. Refresh to apply.'
}) %>`,
        },
        {
          title: 'Loading',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'loading', message: 'Saving your changes…', persistent: true })}</div>`,
          code: `<%- include('modules/ui/Toast', {
  variant: 'loading',
  message: 'Saving your changes…',
  persistent: true
}) %>`,
        },
        {
          title: 'toast.promise() API',
          previewHtml: `<div class="p-4">${toastEl({ variant: 'loading', message: 'Kullanıcı yükleniyor…', persistent: true })}</div>`,
          code: `<%# Mount once — store.js exposes window.toast() %>
<%- include('modules/ui/Toast/scripts/store.js') %>

<script>
  // Same surface as the NextJS \`toast.promise()\` — drives one toast
  // through loading → success | error in a single call.
  window.toast.promise(
    fetch('/api/user').then(function (r) { return r.json(); }),
    {
      loading: 'Kullanıcı yükleniyor…',
      success: function (u) { return u.name + ' (#' + u.id + ') yüklendi.'; },
      error:   function (e) { return 'Hata: ' + e.message; },
    }
  );

  // String shortcuts for success/error are also accepted.
  window.toast.promise(saveSettings(), {
    loading: 'Kaydediliyor…',
    success: 'Tamamlandı!',
    error:   'Kaydetme başarısız oldu.',
  });
</script>`,
        },
      ],
    },
  ];
}
