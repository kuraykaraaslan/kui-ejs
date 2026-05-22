import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/StepShell.ejs'), 'utf-8');

type StepState = 'active' | 'done' | 'inactive';

const stepHeader = (number: number, title: string, state: StepState, withEdit = false) => {
  const borderClass = state === 'active' ? 'border-primary shadow-sm' : 'border-border';
  const circleClass = state === 'done'
    ? 'bg-success text-white'
    : state === 'active'
      ? 'bg-primary text-primary-fg'
      : 'bg-surface-overlay text-text-disabled';
  const titleClass = state === 'active'
    ? 'text-text-primary'
    : state === 'done'
      ? 'text-text-secondary'
      : 'text-text-disabled';
  const inner = state === 'done'
    ? '<i class="fa-solid fa-check w-3 h-3" aria-hidden="true"></i>'
    : String(number);
  const editBtn = withEdit
    ? `<span class="shrink-0"><button class="inline-flex items-center justify-center rounded-md text-xs font-medium px-2 py-1 text-primary hover:bg-primary-subtle">Edit</button></span>`
    : '';
  return { borderClass, circleClass, titleClass, inner, editBtn };
};

const stepCard = (number: number, title: string, state: StepState, opts: { summary?: string; childrenHtml?: string; withEdit?: boolean } = {}) => {
  const { borderClass, circleClass, titleClass, inner, editBtn } = stepHeader(number, title, state, opts.withEdit);
  return `<div class="rounded-2xl border transition-all bg-surface-raised overflow-hidden ${borderClass}">
  <div class="flex items-center gap-3 px-5 py-4">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${circleClass}">${inner}</span>
    <h2 class="flex-1 text-sm font-semibold ${titleClass}">${title}</h2>
    ${editBtn}
  </div>
  ${state === 'done' && opts.summary ? `<div class="px-5 pb-4 border-t border-border pt-3 opacity-70">${opts.summary}</div>` : ''}
  ${state === 'active' && opts.childrenHtml ? `<div class="px-5 pb-5 border-t border-border pt-4">${opts.childrenHtml}</div>` : ''}
</div>`;
};

export function buildStepShellData(): ShowcaseItem[] {
  return [
    {
      id: 'step-shell',
      title: 'StepShell',
      category: 'App',
      abbr: 'Ss',
      description: 'Çok adımlı akışlarda tek bir adımı sarmalayan kart. active / done / inactive durumlarına göre kenarlık ve numara dairesi değişir; done + onEdit kombinasyonunda özet altında Edit butonu çıkar.',
      filePath: 'modules/app/StepShell.ejs',
      sourceCode,
      variants: [
        {
          title: 'Three states — done / active / inactive',
          previewHtml: `<div class="p-4 w-full max-w-md space-y-3">
  ${stepCard(1, 'Account details', 'done', { summary: '<p class="text-sm text-text-secondary">jane@acme.com · Admin role</p>', withEdit: true })}
  ${stepCard(2, 'Billing address', 'active', { childrenHtml: `
    <div class="space-y-3">
      <input type="text" placeholder="Street address" class="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm" />
      <div class="flex justify-end gap-2">
        <button class="rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium">Cancel</button>
        <button class="rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm font-medium">Continue</button>
      </div>
    </div>
  ` })}
  ${stepCard(3, 'Payment method', 'inactive')}
</div>`,
          code: `<%- include('modules/app/StepShell', {
  number: 1, title: 'Account details', done: true, onEdit: '/checkout?step=1',
  summary: '<p class="text-sm text-text-secondary">' + user.email + ' · ' + user.role + ' role</p>'
}) %>

<%- include('modules/app/StepShell', {
  number: 2, title: 'Billing address', active: true,
  children: addressFormHtml
}) %>

<%- include('modules/app/StepShell', { number: 3, title: 'Payment method' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Active step only',
          previewHtml: `<div class="p-4 w-full max-w-md">
  ${stepCard(2, 'Choose a plan', 'active', { childrenHtml: `
    <div class="grid gap-3 sm:grid-cols-2">
      <button class="rounded-lg border border-primary bg-primary-subtle p-3 text-left">
        <p class="text-sm font-semibold text-text-primary">Starter</p>
        <p class="text-xs text-text-secondary mt-0.5">$9 / month</p>
      </button>
      <button class="rounded-lg border border-border bg-surface-base p-3 text-left hover:border-border-strong">
        <p class="text-sm font-semibold text-text-primary">Pro</p>
        <p class="text-xs text-text-secondary mt-0.5">$29 / month</p>
      </button>
    </div>
  ` })}
</div>`,
          code: `<%- include('modules/app/StepShell', {
  number: 2,
  title:  'Choose a plan',
  active: true,
  children: planSelectorHtml
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
