import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/api-doc/ApiKeyTokenCard.ejs'),
  'utf-8',
);

export function buildApiKeyTokenCardData(): ShowcaseItem[] {
  return [
    {
      id:          'api-doc-api-key-token-card',
      title:       'ApiKeyTokenCard',
      category:    'Domain · API Doc',
      abbr:        'AT',
      description: 'Card for a single API key — reveal/hide, copy-to-clipboard, env badge, last-used metadata.',
      filePath:    'modules/domain/api-doc/ApiKeyTokenCard.ejs',
      sourceCode,
      variants: [
        {
          title: 'Production key with scopes',
          previewHtml: `<div class="p-4 max-w-sm">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2 min-w-0">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
          <span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">Production key</p>
          <div class="mt-1"><span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-success-subtle text-success-fg">production</span></div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base font-mono text-xs text-text-primary">
      <span class="flex-1 truncate select-all" aria-label="API token">••••••••••••••••a1b2</span>
      <button type="button" aria-label="Reveal token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-eye" aria-hidden="true"></i></span></button>
      <button type="button" aria-label="Copy token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-copy" aria-hidden="true"></i></span></button>
    </div>
    <dl class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt><dd class="text-text-primary">Jan 12, 2026</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt><dd class="text-text-primary">May 20, 2026</dd></div>
    </dl>
    <div class="flex flex-wrap gap-1.5 border-t border-border pt-3">
      <code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]">read:products</code>
      <code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]">write:orders</code>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Production key',
  token: 'sk_live_AbCdEfGhIjKlMnOpQrSta1b2',
  environment: 'production',
  createdAt: '2026-01-12',
  lastUsedAt: '2026-05-20',
  scopes: ['read:products', 'write:orders']
}) %>`,
        },
        {
          title: 'Staging key with revoke action',
          previewHtml: `<div class="p-4 max-w-sm">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2 min-w-0">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
          <span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">Staging key</p>
          <div class="mt-1"><span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-warning-subtle text-warning-fg">staging</span></div>
        </div>
      </div>
      <button type="button" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-error border border-error/40 hover:bg-error-subtle"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>Revoke</button>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base font-mono text-xs text-text-primary">
      <span class="flex-1 truncate select-all">••••••••••••9z8y</span>
      <button type="button" aria-label="Reveal token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-eye" aria-hidden="true"></i></span></button>
      <button type="button" aria-label="Copy token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-copy" aria-hidden="true"></i></span></button>
    </div>
    <dl class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt><dd class="text-text-primary">Apr 1, 2026</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt><dd class="text-text-primary">Never</dd></div>
    </dl>
  </div>
</div>`,
          code: `<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Staging key',
  token: 'sk_test_XyZ9z8y',
  environment: 'staging',
  createdAt: '2026-04-01',
  lastUsedAt: null,
  onRevoke: true
}) %>`,
        },
      ],
    },
  ];
}
