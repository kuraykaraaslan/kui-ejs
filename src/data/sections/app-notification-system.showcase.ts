import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/NotificationSystem.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const variantMap: Record<string, { container: string; iconColor: string; progressColor: string; icon: string }> = {
  success: { container: 'bg-success-subtle border-success', iconColor: 'text-success-fg',     progressColor: 'bg-success', icon: 'fa-circle-check' },
  warning: { container: 'bg-warning-subtle border-warning', iconColor: 'text-warning',        progressColor: 'bg-warning', icon: 'fa-triangle-exclamation' },
  error:   { container: 'bg-error-subtle border-error',     iconColor: 'text-error',          progressColor: 'bg-error',   icon: 'fa-circle-xmark' },
  info:    { container: 'bg-info-subtle border-info',       iconColor: 'text-info',           progressColor: 'bg-info',    icon: 'fa-circle-info' },
  loading: { container: 'bg-surface-raised border-border',  iconColor: 'text-text-secondary', progressColor: 'bg-primary', icon: 'fa-spinner fa-spin' },
};

const toast = (variant: keyof typeof variantMap, title: string, message: string, withProgress = true) => {
  const vm = variantMap[variant];
  return `<div class="relative w-80 rounded-xl border shadow-lg overflow-hidden pointer-events-auto ${vm.container}">
    <div class="flex items-start gap-3 px-4 pt-4 pb-3">
      <i class="fa-solid ${vm.icon} mt-0.5 shrink-0 ${vm.iconColor}" aria-hidden="true"></i>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-text-primary leading-snug">${title}</p>
        <p class="text-sm text-text-secondary leading-snug mt-0.5">${message}</p>
      </div>
      <button type="button" aria-label="Dismiss"
        class="shrink-0 mt-0.5 rounded text-text-secondary hover:text-text-primary">
        <i class="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
      </button>
    </div>
    ${withProgress ? `<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
      <div class="h-full rounded-full ${vm.progressColor}" style="width:60%;opacity:0.5"></div>
    </div>` : ''}
  </div>`;
};

const frame = (position: string, body: string) => {
  const posMap: Record<string, string> = {
    'top-right':     'top-4 right-4 items-end',
    'top-left':      'top-4 left-4 items-start',
    'bottom-right':  'bottom-4 right-4 items-end',
    'bottom-left':   'bottom-4 left-4 items-start',
  };
  const pos = posMap[position] || posMap['top-right'];
  return `<div class="p-4 w-full">
  <div class="relative w-full h-[360px] rounded-xl border border-border bg-surface-overlay overflow-hidden">
    <div class="absolute z-[90] flex flex-col gap-2 ${pos}">
      ${body}
    </div>
  </div>
</div>`;
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppNotificationSystemData(): ShowcaseItem[] {
  return [
    {
      id: 'notification-system',
      title: 'NotificationSystem',
      category: 'App',
      abbr: 'NS',
      description: 'Page-level toast container with global `window.notify` / `window.pushNotification` API. 6 positions, 5 variants (success/warning/error/info/loading), auto-dismiss progress bar, hover to pause, manual dismiss.',
      filePath: 'modules/app/NotificationSystem.ejs',
      sourceCode,
      variants: [
        {
          title: 'Top-right stack',
          previewHtml: frame('top-right', `
            ${toast('success', 'Profile saved', 'Your changes are live.')}
            ${toast('info',    'New comment',   'Alex replied to your post.', false)}
          `),
          code: `<%# Mount once near </body> %>
<%- include('modules/app/NotificationSystem', { position: 'top-right' }) %>

<script>
  // Anywhere on the page:
  window.notify.success('Profile saved', { title: 'Profile saved', message: 'Your changes are live.' });
  window.notify.info('New comment',     { title: 'New comment',    message: 'Alex replied to your post.', duration: 0 });
</script>`,
          layout: 'stack',
        },
        {
          title: 'Error + loading (bottom-left)',
          previewHtml: frame('bottom-left', `
            ${toast('error',   'Upload failed',  'Network error. Please retry.')}
            ${toast('loading', 'Syncing…',       'Updating 12 records.', false)}
          `),
          code: `<%- include('modules/app/NotificationSystem', { position: 'bottom-left' }) %>

<script>
  window.notify.error('Upload failed',  { title: 'Upload failed', message: 'Network error. Please retry.' });
  var id = window.notify.loading('Syncing…', { title: 'Syncing…', message: 'Updating 12 records.' });
  // later:
  // window.notify.dismiss(id);
</script>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
