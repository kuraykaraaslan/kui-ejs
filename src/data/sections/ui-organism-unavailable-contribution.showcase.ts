import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// UnavailableContribution: the placeholder admins and editors see where a contributed piece
// of UI cannot be shown (parity with kui-react modules/ui/UnavailableContribution.tsx).
const partialPath = path.join(process.cwd(), 'modules/ui/UnavailableContribution.ejs');
const sourceCode = fs.readFileSync(partialPath, 'utf-8');

function render(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: partialPath });
}

const REASONS = ['disabled', 'unentitled', 'blocked', 'retired', 'banned', 'quarantined', 'failed', 'missing', 'no-access'];
const ACTIONS: Record<string, { label: string }> = {
  disabled: { label: 'Enable' },
  unentitled: { label: 'Upgrade' },
  quarantined: { label: 'Retry' },
  failed: { label: 'Retry' },
};
const CARD_REASONS = ['disabled', 'unentitled', 'quarantined', 'failed'];

export function buildUnavailableContributionData(): ShowcaseItem[] {
  return [
    {
      id: 'unavailable-contribution',
      title: 'UnavailableContribution',
      category: 'Organism',
      abbr: 'Uc',
      description: 'Placeholder for a contribution that cannot be shown, for admins and editors (end users see nothing). Nine reasons (disabled, unentitled, blocked, retired, banned, quarantined, failed, missing, no-access), each with a default icon, tone and short text; four sizes (inline, card, tab, node); optional title, detail and action. Texts are overridable for i18n.',
      filePath: 'modules/ui/UnavailableContribution.ejs',
      sourceCode,
      since: '2026-10',
      composes: ['badge', 'button', 'empty-state'],
      variants: [
        {
          title: 'Card (dashboard widget, panel)',
          previewHtml: `<div class="grid w-full gap-3 sm:grid-cols-2">${CARD_REASONS.map((reason) => render({ reason, action: ACTIONS[reason] })).join('')}</div>`,
          code: `<%- include('modules/ui/UnavailableContribution', {
  reason: 'disabled',
  action: { label: 'Enable', onClick: 'enableModule()' }
}) %>
<%- include('modules/ui/UnavailableContribution', {
  reason: 'unentitled',
  action: { label: 'Upgrade', href: '/billing' }
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Inline (top bar, menu, every reason)',
          previewHtml: `<div class="flex flex-wrap gap-3">${REASONS.map((reason) => render({ reason, size: 'inline' })).join('')}</div>`,
          code: `<%- include('modules/ui/UnavailableContribution', { reason: 'blocked', size: 'inline' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Node (page-builder block, automation node)',
          previewHtml: `<div class="grid w-full max-w-md gap-3">${CARD_REASONS.map((reason) => render({ reason, size: 'node', title: 'Product carousel', action: ACTIONS[reason] })).join('')}</div>`,
          code: `<%- include('modules/ui/UnavailableContribution', {
  reason: 'quarantined',
  size: 'node',
  title: 'Product carousel',
  action: { label: 'Retry', onClick: 'location.reload()' }
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Tab panel',
          previewHtml: render({ reason: 'no-access', size: 'tab' }),
          code: `<%- include('modules/ui/UnavailableContribution', { reason: 'no-access', size: 'tab' }) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
