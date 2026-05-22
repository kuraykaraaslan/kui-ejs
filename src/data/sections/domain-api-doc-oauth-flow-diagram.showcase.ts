import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/api-doc/OAuthFlowDiagram.ejs'),
  'utf-8',
);

export function buildOAuthFlowDiagramData(): ShowcaseItem[] {
  return [
    {
      id:          'api-doc-oauth-flow-diagram',
      title:       'OAuthFlowDiagram',
      category:    'Domain · API Doc',
      abbr:        'OF',
      description: 'Visual walkthrough of an OAuth 2.0 flow with actors, numbered steps, endpoints, and scopes.',
      filePath:    'modules/domain/api-doc/OAuthFlowDiagram.ejs',
      sourceCode,
      variants: [
        {
          title: 'Authorization Code flow',
          previewHtml: `<div class="p-4 max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-text-disabled">OAuth 2.0 Flow</p>
        <p class="text-base font-semibold text-text-primary mt-0.5">Authorization Code</p>
      </div>
      <span class="inline-flex items-center gap-1 rounded-full font-medium px-1.5 py-0 text-[10px] bg-primary-subtle text-primary"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>authorizationCode</span>
    </div>
    <div class="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-user text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">User</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-server text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Your App</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-shield-halved text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Auth Server</span></div>
    </div>
    <ol class="space-y-1.5">
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">1</span><span>User clicks "Sign in"</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">2</span><span>Redirect to /authorize</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">3</span><span>User grants consent</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">4</span><span>Code returned to app</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">5</span><span>Exchange code for token</span></li>
    </ol>
    <dl class="border-t border-border pt-3 space-y-1.5">
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Authorization URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/authorize</dd></div>
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Token URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/token</dd></div>
    </dl>
    <div class="border-t border-border pt-3">
      <p class="text-[10px] uppercase tracking-wider text-text-disabled mb-2">Available scopes</p>
      <ul class="space-y-1">
        <li class="flex items-start gap-2 text-xs"><i class="fa-solid fa-circle-check text-[11px] text-success mt-0.5 shrink-0" aria-hidden="true"></i><div class="min-w-0"><code class="font-mono text-text-primary font-semibold">read</code><span class="text-text-secondary"> &mdash; Read access</span></div></li>
        <li class="flex items-start gap-2 text-xs"><i class="fa-solid fa-circle-check text-[11px] text-success mt-0.5 shrink-0" aria-hidden="true"></i><div class="min-w-0"><code class="font-mono text-text-primary font-semibold">write</code><span class="text-text-secondary"> &mdash; Write access</span></div></li>
      </ul>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'authorizationCode',
  authorizationUrl: 'https://auth.example.com/authorize',
  tokenUrl:         'https://auth.example.com/token',
  scopes: [
    { name: 'read',  description: 'Read access' },
    { name: 'write', description: 'Write access' },
  ]
}) %>`,
        },
        {
          title: 'Client Credentials flow',
          previewHtml: `<div class="p-4 max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-text-disabled">OAuth 2.0 Flow</p>
        <p class="text-base font-semibold text-text-primary mt-0.5">Client Credentials</p>
      </div>
      <span class="inline-flex items-center gap-1 rounded-full font-medium px-1.5 py-0 text-[10px] bg-primary-subtle text-primary"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>clientCredentials</span>
    </div>
    <div class="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-user text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">User</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-server text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Your App</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-shield-halved text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Auth Server</span></div>
    </div>
    <ol class="space-y-1.5">
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">1</span><span>App authenticates with client ID + secret</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">2</span><span>POST to /token</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">3</span><span>Access token returned</span></li>
    </ol>
    <dl class="border-t border-border pt-3 space-y-1.5">
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Token URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/token</dd></div>
    </dl>
  </div>
</div>`,
          code: `<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'clientCredentials',
  tokenUrl: 'https://auth.example.com/token'
}) %>`,
        },
      ],
    },
  ];
}
