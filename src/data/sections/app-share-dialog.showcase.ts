import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/ShareDialog.ejs'), 'utf-8');

export function buildShareDialogData(): ShowcaseItem[] {
  return [
    {
      id: 'share-dialog',
      title: 'ShareDialog',
      category: 'App',
      abbr: 'SD',
      since: '2026-05',
      description: 'Share modal: copyable link, email invitation with permission picker, and a list of current invitees with permission/remove controls.',
      filePath: 'modules/app/ShareDialog.ejs',
      sourceCode,
      variants: [
        {
          title: 'With invitees',
          layout: 'stack',
          previewHtml: `<div class="p-6 w-full max-w-lg mx-auto">
  <div class="rounded-xl border border-border bg-surface-raised shadow-xl flex flex-col">
    <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
      <div>
        <h2 class="text-base font-semibold text-text-primary">Share</h2>
        <p class="text-sm text-text-secondary mt-0.5">Invite people or copy the link.</p>
      </div>
      <button type="button" aria-label="Close dialog" class="shrink-0 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">
        <i class="fa-solid fa-xmark" style="font-size: 1rem;" aria-hidden="true"></i>
      </button>
    </div>
    <div class="px-6 py-4 flex-1 space-y-5">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-text-primary">Shareable Link</label>
        <div class="flex gap-2">
          <div class="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm">
            <i class="fa-solid fa-link text-text-disabled shrink-0" style="font-size: 0.875rem;" aria-hidden="true"></i>
            <input type="text" value="https://app.example.com/docs/x4y9-zk7" readonly class="flex-1 bg-transparent text-text-primary focus-visible:outline-none truncate" />
          </div>
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
            <i class="fa-solid fa-copy" style="font-size: 0.875rem;" aria-hidden="true"></i>
            Copy
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-text-primary">Invite People</label>
        <div class="flex items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm">
          <i class="fa-solid fa-envelope text-text-disabled shrink-0" style="font-size: 0.875rem;" aria-hidden="true"></i>
          <input type="email" placeholder="name@example.com" class="w-full bg-transparent text-text-primary placeholder:text-text-disabled focus-visible:outline-none" />
        </div>
        <div class="flex items-center justify-end gap-2">
          <select class="rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary">
            <option>Viewer</option><option>Commenter</option><option>Editor</option>
          </select>
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
            <i class="fa-solid fa-paper-plane" style="font-size: 0.875rem;" aria-hidden="true"></i>
            Invite
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-wide text-text-disabled font-medium">People with access (3)</p>
        <ul class="divide-y divide-border rounded-md border border-border bg-surface-base">
          <li class="flex items-center gap-3 px-3 py-2">
            <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">AB</span>
            <div class="flex-1 min-w-0"><p class="text-sm font-medium text-text-primary truncate">Alice Brooks</p><p class="text-xs text-text-secondary truncate">alice@example.com</p></div>
            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-warning-subtle text-warning-fg">Owner</span>
          </li>
          <li class="flex items-center gap-3 px-3 py-2">
            <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">MR</span>
            <div class="flex-1 min-w-0"><p class="text-sm font-medium text-text-primary truncate">Marcus Reed</p><p class="text-xs text-text-secondary truncate">marcus@example.com</p></div>
            <select class="rounded-md border border-border bg-surface-base px-2 py-1 text-xs text-text-primary"><option>Viewer</option><option>Commenter</option><option selected>Editor</option></select>
            <button type="button" aria-label="Remove Marcus Reed's access" class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-text-disabled hover:text-error hover:bg-error-subtle"><i class="fa-solid fa-xmark" style="font-size: 0.75rem;" aria-hidden="true"></i></button>
          </li>
          <li class="flex items-center gap-3 px-3 py-2">
            <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">PS</span>
            <div class="flex-1 min-w-0"><p class="text-sm font-medium text-text-primary truncate">Priya Sharma</p><p class="text-xs text-text-secondary truncate">priya@example.com</p></div>
            <select class="rounded-md border border-border bg-surface-base px-2 py-1 text-xs text-text-primary"><option selected>Viewer</option><option>Commenter</option><option>Editor</option></select>
            <button type="button" aria-label="Remove Priya Sharma's access" class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-text-disabled hover:text-error hover:bg-error-subtle"><i class="fa-solid fa-xmark" style="font-size: 0.75rem;" aria-hidden="true"></i></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/ShareDialog', {
  open: true,
  shareUrl: 'https://app.example.com/docs/x4y9-zk7',
  invitees: [
    { id: '1', name: 'Alice Brooks', email: 'alice@example.com',  permission: 'owner'  },
    { id: '2', name: 'Marcus Reed',  email: 'marcus@example.com', permission: 'editor' },
    { id: '3', name: 'Priya Sharma', email: 'priya@example.com',  permission: 'viewer' }
  ]
}) %>`,
        },
        {
          title: 'Empty / link only',
          layout: 'stack',
          previewHtml: `<div class="p-6 w-full max-w-lg mx-auto">
  <div class="rounded-xl border border-border bg-surface-raised shadow-xl flex flex-col">
    <div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
      <div>
        <h2 class="text-base font-semibold text-text-primary">Share</h2>
        <p class="text-sm text-text-secondary mt-0.5">Invite people or copy the link.</p>
      </div>
      <button type="button" aria-label="Close dialog" class="shrink-0 text-text-disabled hover:text-text-primary"><i class="fa-solid fa-xmark" style="font-size: 1rem;" aria-hidden="true"></i></button>
    </div>
    <div class="px-6 py-4 flex-1 space-y-5">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-text-primary">Shareable Link</label>
        <div class="flex gap-2">
          <div class="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm">
            <i class="fa-solid fa-link text-text-disabled shrink-0" style="font-size: 0.875rem;" aria-hidden="true"></i>
            <input type="text" value="https://app.example.com/projects/empty-share" readonly class="flex-1 bg-transparent text-text-primary focus-visible:outline-none truncate" />
          </div>
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
            <i class="fa-solid fa-copy" style="font-size: 0.875rem;" aria-hidden="true"></i>
            Copy
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-text-primary">Invite People</label>
        <div class="flex items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm">
          <i class="fa-solid fa-envelope text-text-disabled shrink-0" style="font-size: 0.875rem;" aria-hidden="true"></i>
          <input type="email" placeholder="name@example.com" class="w-full bg-transparent text-text-primary placeholder:text-text-disabled focus-visible:outline-none" />
        </div>
        <div class="flex items-center justify-end gap-2">
          <select class="rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary"><option>Viewer</option></select>
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
            <i class="fa-solid fa-paper-plane" style="font-size: 0.875rem;" aria-hidden="true"></i>
            Invite
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/ShareDialog', {
  open: true,
  shareUrl: 'https://app.example.com/projects/empty-share',
  invitees: []
}) %>`,
        },
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby', 'aria-describedby'],
      },
    },
  ];
}
