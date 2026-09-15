import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const accordionPath   = path.join(process.cwd(), 'modules/ui/Accordion.ejs');
const accordionSource = fs.readFileSync(accordionPath, 'utf-8');

function renderAccordion(locals: Record<string, unknown>): string {
  return ejs.render(accordionSource, locals, { filename: accordionPath });
}

const wrap = (inner: string) => `<div class="w-full max-w-md">${inner}</div>`;

const FAQ_ITEMS = [
  { id: 'shipping', title: 'How long does shipping take?', content: 'Standard shipping takes 3–5 business days. Express orders arrive in 1–2 business days.' },
  { id: 'returns', title: 'What is your return policy?', content: 'Items can be returned within 30 days of delivery for a full refund, provided they are unused and in original packaging.' },
  { id: 'support', title: 'How do I contact support?', content: 'Reach our support team any time via the in-app chat or by emailing support@example.com.' },
];

export function buildAccordionData(): ShowcaseItem[] {
  return [
    {
      id: 'accordion',
      title: 'Accordion',
      category: 'Molecule',
      abbr: 'Ac',
      description:
        'Collapsible panel group for progressively disclosing content. Server-renders the initial open/closed state from `defaultOpenIds` (no client JS needed for first paint), then a scoped inline script wires up click handlers. Supports single-open or `allowMultiple` mode.',
      filePath: 'modules/ui/Accordion.ejs',
      sourceCode: accordionSource,
      since: '2026-09',
      variants: [
        {
          title: 'Single open (default)',
          layout: 'stack' as const,
          previewHtml: wrap(renderAccordion({
            id: 'acc-demo-single',
            items: FAQ_ITEMS,
            defaultOpenIds: ['shipping'],
          })),
          code: `<%- include('modules/ui/Accordion', {
  items: [
    { id: 'shipping', title: 'How long does shipping take?', content: '...' },
    { id: 'returns',  title: 'What is your return policy?',  content: '...' },
    { id: 'support',  title: 'How do I contact support?',    content: '...' },
  ],
  defaultOpenIds: ['shipping'],
}) %>`,
        },
        {
          title: 'Allow multiple + disabled item',
          layout: 'stack' as const,
          previewHtml: wrap(renderAccordion({
            id: 'acc-demo-multi',
            allowMultiple: true,
            defaultOpenIds: ['shipping', 'returns'],
            items: [
              ...FAQ_ITEMS.slice(0, 2),
              { id: 'legal', title: 'Legal (coming soon)', content: '', disabled: true },
            ],
          })),
          code: `<%- include('modules/ui/Accordion', {
  allowMultiple: true,
  defaultOpenIds: ['shipping', 'returns'],
  items: [
    { id: 'shipping', title: 'How long does shipping take?', content: '...' },
    { id: 'returns',  title: 'What is your return policy?',  content: '...' },
    { id: 'legal',    title: 'Legal (coming soon)', content: '', disabled: true },
  ],
}) %>`,
        },
      ],
    },
  ];
}
