import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/StepFlow.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

type StepState = 'complete' | 'active' | 'pending';

const stepStyles: Record<StepState, { circle: string; text: string; line: string }> = {
  complete: { circle: 'bg-success text-text-inverse border-success',          text: 'text-text-primary',                line: 'bg-success' },
  active:   { circle: 'bg-primary text-primary-fg border-primary',            text: 'text-text-primary font-semibold', line: 'bg-border' },
  pending:  { circle: 'bg-surface-base text-text-disabled border-border',     text: 'text-text-disabled',              line: 'bg-border' },
};

const stepper = (items: { label: string; state: StepState }[]) => {
  return `<ol class="flex items-center">
    ${items.map((step, i) => {
      const s = stepStyles[step.state];
      const isLast = i === items.length - 1;
      const inner = step.state === 'complete'
        ? '<span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-check" aria-hidden="true"></i></span>'
        : String(i + 1);
      return `<li class="flex items-center${!isLast ? ' flex-1' : ''}">
        <div class="flex flex-col items-center gap-1 shrink-0">
          <div class="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${s.circle}">${inner}</div>
          <div class="text-center">
            <p class="text-xs whitespace-nowrap ${s.text}">${step.label}</p>
          </div>
        </div>
        ${!isLast ? `<div class="h-0.5 flex-1 mx-2 mt-[-1.25rem] ${s.line}" aria-hidden="true"></div>` : ''}
      </li>`;
    }).join('')}
  </ol>`;
};

const btnBase = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors px-4 py-2 text-sm';
const primaryBtn   = (label: string, iconRight = '') => `<button type="button" class="${btnBase} bg-primary text-primary-fg hover:bg-primary-hover">${label}${iconRight}</button>`;
const outlineBtn   = (label: string) => `<button type="button" class="${btnBase} border border-border text-text-primary hover:bg-surface-overlay">${label}</button>`;
const ghostBtn     = (label: string) => `<button type="button" class="${btnBase} bg-transparent text-text-primary hover:bg-surface-overlay">${label}</button>`;
const arrowIcon    = '<span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-arrow-right"></i></span>';

const flow = (opts: {
  steps: { label: string; state: StepState }[];
  body: string;
  current: number;
  total: number;
  showCancel?: boolean;
  showPrev?: boolean;
  isLast?: boolean;
  error?: string;
  completing?: boolean;
}) => {
  const { steps, body, current, total, showCancel, showPrev, isLast, error, completing } = opts;
  const errorHtml = error
    ? `<div class="rounded-lg border border-error bg-error-subtle text-error px-4 py-2.5 text-sm font-medium flex items-center gap-2">
        <i class="fa-solid fa-circle-xmark shrink-0" aria-hidden="true"></i>
        <span>${error}</span>
      </div>`
    : '';
  const nextBtnHtml = isLast
    ? primaryBtn(completing ? 'Submitting…' : 'Finish')
    : primaryBtn('Next', arrowIcon);
  return `<div class="p-4 w-full max-w-2xl">
  <div class="space-y-6">
    ${stepper(steps)}
    <div class="min-h-[12rem]">
      ${body}
    </div>
    ${errorHtml}
    <div class="flex items-center justify-between gap-3 pt-4 border-t border-border">
      <div>
        ${showCancel ? ghostBtn('Cancel') : ''}
        ${showPrev   ? outlineBtn('Back') : ''}
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-text-disabled">${current} / ${total}</span>
        ${nextBtnHtml}
      </div>
    </div>
  </div>
</div>`;
};

const fieldRow = (label: string, value: string) => `<label class="block">
  <span class="block text-sm font-medium text-text-primary mb-1">${label}</span>
  <input type="text" value="${value}" class="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus" />
</label>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildStepFlowData(): ShowcaseItem[] {
  return [
    {
      id: 'step-flow',
      title: 'StepFlow',
      category: 'App',
      abbr: 'SF',
      description: 'Multi-step wizard/flow: Stepper + step content + Back/Next/Cancel/Finish controls. Step state (`complete` / `active` / `pending`), inline error row (AlertBanner) and `stepflow:next` / `stepflow:prev` / `stepflow:cancel` / `stepflow:complete` custom events drive progress server- or client-side.',
      filePath: 'modules/app/StepFlow.ejs',
      sourceCode,
      variants: [
        {
          title: 'First step — Cancel + Next',
          previewHtml: flow({
            steps: [
              { label: 'Account',  state: 'active'  },
              { label: 'Profile',  state: 'pending' },
              { label: 'Review',   state: 'pending' },
            ],
            body: `<div class="space-y-3">
              ${fieldRow('Email', 'jane@acme.com')}
              ${fieldRow('Password', '••••••••')}
            </div>`,
            current: 1,
            total: 3,
            showCancel: true,
            showPrev: false,
            isLast: false,
          }),
          code: `<%- include('modules/app/StepFlow', {
  id: 'signup-flow',
  currentStep: 0,
  steps: [
    { label: 'Account', content: accountFormHtml },
    { label: 'Profile', content: profileFormHtml },
    { label: 'Review',  content: reviewHtml      },
  ],
}) %>

<script>
  document.getElementById('signup-flow')
    .addEventListener('stepflow:next', function () { /* advance step on server */ });
</script>`,
          layout: 'stack',
        },
        {
          title: 'Middle step — Back + Next + inline error',
          previewHtml: flow({
            steps: [
              { label: 'Account',  state: 'complete' },
              { label: 'Profile',  state: 'active'   },
              { label: 'Review',   state: 'pending'  },
            ],
            body: `<div class="space-y-3">
              ${fieldRow('Full name', '')}
              ${fieldRow('Company', 'Acme Inc')}
            </div>`,
            current: 2,
            total: 3,
            showCancel: false,
            showPrev: true,
            isLast: false,
            error: 'Full name is required.',
          }),
          code: `<%- include('modules/app/StepFlow', {
  id: 'signup-flow',
  currentStep: 1,
  stepError: 'Full name is required.',
  steps: [
    { label: 'Account', content: '' },
    { label: 'Profile', content: profileFormHtml },
    { label: 'Review',  content: '' },
  ],
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Final step — Back + Finish (completing)',
          previewHtml: flow({
            steps: [
              { label: 'Account',  state: 'complete' },
              { label: 'Profile',  state: 'complete' },
              { label: 'Review',   state: 'active'   },
            ],
            body: `<div class="rounded-xl border border-border bg-surface-raised p-4 space-y-2 text-sm">
              <p><span class="font-medium text-text-primary">Email:</span> <span class="text-text-secondary">jane@acme.com</span></p>
              <p><span class="font-medium text-text-primary">Name:</span>  <span class="text-text-secondary">Jane Doe</span></p>
              <p><span class="font-medium text-text-primary">Company:</span> <span class="text-text-secondary">Acme Inc</span></p>
            </div>`,
            current: 3,
            total: 3,
            showCancel: false,
            showPrev: true,
            isLast: true,
            completing: true,
          }),
          code: `<%- include('modules/app/StepFlow', {
  id: 'signup-flow',
  currentStep: 2,
  completing: true,
  completeLabel: 'Create account',
  steps: [
    { label: 'Account', content: '' },
    { label: 'Profile', content: '' },
    { label: 'Review',  content: summaryHtml },
  ],
}) %>

<script>
  document.getElementById('signup-flow')
    .addEventListener('stepflow:complete', function () { /* submit form on server */ });
</script>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
