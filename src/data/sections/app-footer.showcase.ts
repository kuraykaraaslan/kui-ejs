import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/AppFooter.ejs'), 'utf-8');

const statusBadge = (variant: 'operational' | 'degraded' | 'outage') => {
  const map = {
    operational: { cls: 'bg-success-subtle text-success-fg', dot: 'bg-success', label: 'Operational' },
    degraded:    { cls: 'bg-warning-subtle text-warning-fg', dot: 'bg-warning', label: 'Degraded' },
    outage:      { cls: 'bg-error-subtle text-error-fg',     dot: 'bg-error',   label: 'Outage' },
  } as const;
  const sc = map[variant];
  return `<span class="inline-flex items-center gap-1 rounded-md font-medium ${sc.cls} px-2.5 py-0.5 text-sm border border-border">
  <span class="h-1.5 w-1.5 rounded-full shrink-0 ${sc.dot}" aria-hidden="true"></span>
  ${sc.label}
</span>`;
};

const navLink = (label: string) =>
  `<a href="#" class="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-overlay">${label}</a>`;

const socialBtn = (icon: string, label: string) =>
  `<a href="#" aria-label="${label}" class="p-2 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-overlay"><i class="fa-brands ${icon}"></i></a>`;

export function buildAppFooterData(): ShowcaseItem[] {
  return [
    {
      id: 'app-footer',
      title: 'AppFooter',
      category: 'App',
      abbr: 'AFt',
      description: 'Two-row application footer with logo, navigation links, system status badge, version, copyright, and social slot.',
      filePath: 'modules/app/AppFooter.ejs',
      sourceCode,
      variants: [
        {
          title: 'Full — logo + nav + status + social',
          previewHtml: `<div class="p-4 w-full">
  <footer class="w-full border border-border rounded-xl bg-surface-raised overflow-hidden">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-primary">Acme</span>
        <span class="inline-flex items-center rounded-md font-medium bg-surface-overlay text-text-primary px-2.5 py-0.5 text-sm border border-border">v2.4.1</span>
      </div>
      <nav aria-label="Footer navigation" class="flex items-center gap-1">
        ${navLink('Docs')}${navLink('Changelog')}${navLink('Support')}${navLink('Pricing')}
      </nav>
      ${statusBadge('operational')}
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-surface-base">
      <p class="text-xs text-text-secondary">© 2026 Acme Corp. All rights reserved.</p>
      <div class="flex items-center gap-1">
        ${socialBtn('fa-github', 'GitHub')}${socialBtn('fa-x-twitter', 'X')}${socialBtn('fa-linkedin', 'LinkedIn')}
      </div>
    </div>
  </footer>
</div>`,
          code: `<%- include('modules/app/AppFooter', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  version:   '2.4.1',
  status:    'operational',
  copyright: '© 2026 Acme Corp. All rights reserved.',
  navContent: \`
    <a href="/docs"      class="px-3 py-1.5 text-sm">Docs</a>
    <a href="/changelog" class="px-3 py-1.5 text-sm">Changelog</a>
    <a href="/support"   class="px-3 py-1.5 text-sm">Support</a>
    <a href="/pricing"   class="px-3 py-1.5 text-sm">Pricing</a>
  \`,
  socialContent: \`
    <a href="https://github.com/acme"   aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
    <a href="https://x.com/acme"        aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
    <a href="https://linkedin.com/acme" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Minimal — copyright + status only',
          previewHtml: `<div class="p-4 w-full">
  <footer class="w-full border border-border rounded-xl bg-surface-raised overflow-hidden">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-primary">Acme</span>
      </div>
      ${statusBadge('degraded')}
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-surface-base">
      <p class="text-xs text-text-secondary">© 2026 Acme Corp.</p>
    </div>
  </footer>
</div>`,
          code: `<%- include('modules/app/AppFooter', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  status:    'degraded',
  copyright: '© 2026 Acme Corp.'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
