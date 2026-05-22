import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/api-doc/AuthSchemeCard.ejs'),
  'utf-8',
);

export function buildAuthSchemeCardData(): ShowcaseItem[] {
  return [
    {
      id:          'api-doc-auth-scheme-card',
      title:       'AuthSchemeCard',
      category:    'Domain · API Doc',
      abbr:        'AK',
      description: 'Selectable card describing a single auth scheme (apiKey, http, oauth2, openIdConnect, mutualTLS).',
      filePath:    'modules/domain/api-doc/AuthSchemeCard.ejs',
      sourceCode,
      variants: [
        {
          title: 'OAuth 2.0 recommended scheme',
          previewHtml: `<div class="p-4 max-w-md">
  <a href="#" class="block rounded-xl border border-border bg-surface-raised p-4 text-left transition-shadow hover:shadow-md hover:border-border-focus">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <span class="w-4 h-4 inline-flex items-center justify-center"><i class="fa-solid fa-shield" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">OAuth 2.0</p>
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-primary-subtle text-primary border border-primary/30"><i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>oauth2</span>
            <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-success-subtle text-success-fg">Recommended</span>
          </div>
        </div>
      </div>
      <i class="fa-solid fa-arrow-right text-[13px] text-text-disabled mt-1" aria-hidden="true"></i>
    </div>
    <p class="mt-3 text-sm text-text-secondary leading-relaxed">Authorization Code flow with PKCE — preferred for user-facing apps.</p>
    <dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Client ID</dt><dd class="text-xs text-text-primary font-mono break-words">prod_client_42</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Scopes</dt><dd class="text-xs text-text-primary font-mono break-words">read write</dd></div>
    </dl>
  </a>
</div>`,
          code: `<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'OAuth 2.0',
  type: 'oauth2',
  recommended: true,
  description: 'Authorization Code flow with PKCE — preferred for user-facing apps.',
  metaItems: [
    { label: 'Client ID', value: 'prod_client_42' },
    { label: 'Scopes',    value: 'read write' },
  ],
  href: '/auth/oauth2'
}) %>`,
        },
        {
          title: 'API Key static scheme',
          previewHtml: `<div class="p-4 max-w-md">
  <div class="block rounded-xl border border-border bg-surface-raised p-4 text-left">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <span class="w-4 h-4 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">X-API-Key</p>
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-warning-subtle text-warning-fg border border-warning/30"><i class="fa-solid fa-key text-[10px]" aria-hidden="true"></i>apiKey</span>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-sm text-text-secondary leading-relaxed">Static header-based key for server-to-server integrations.</p>
  </div>
</div>`,
          code: `<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'X-API-Key',
  type: 'apiKey',
  description: 'Static header-based key for server-to-server integrations.'
}) %>`,
        },
      ],
    },
  ];
}
