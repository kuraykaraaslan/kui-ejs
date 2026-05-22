import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/common/payment/CheckoutSuccessState.ejs'),
  'utf-8'
);

function summaryCardHtml(opts: {
  amountFmt: string;
  method: string;
  provider: string;
  status: 'PAID' | 'PENDING';
  ref?: string;
}): string {
  const badge =
    opts.status === 'PAID'
      ? '<span class="inline-flex items-center gap-1 rounded-full font-medium bg-success-subtle text-success-fg px-2 py-0.5 text-xs"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-success" aria-hidden="true"></span>Paid</span>'
      : '<span class="inline-flex items-center gap-1 rounded-full font-medium bg-warning-subtle text-warning-fg px-2 py-0.5 text-xs"><span class="h-1.5 w-1.5 rounded-full shrink-0 bg-warning" aria-hidden="true"></span>Pending</span>';
  const refRow = opts.ref
    ? `<div class="flex items-center justify-between gap-4"><span class="text-sm text-text-secondary shrink-0">Ref</span><span class="text-xs font-mono text-text-secondary truncate text-right">${opts.ref}</span></div>`
    : '';
  return `<div class="bg-surface-raised border border-border rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-overlay">
      <span class="text-sm font-semibold text-text-primary">Payment</span>
      ${badge}
    </div>
    <div class="px-4 py-4 space-y-3">
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Amount</span><span class="tabular-nums text-xl font-semibold text-text-primary">${opts.amountFmt}</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Method</span><span class="text-sm font-medium text-text-primary">${opts.method}</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Provider</span><span class="text-sm font-medium text-text-primary">${opts.provider}</span></div>
      ${refRow}
    </div>
  </div>`;
}

function addressCardHtml(opts: {
  name: string;
  line1: string;
  city: string;
  country: string;
}): string {
  return `<div class="rounded-xl border border-border bg-surface-raised p-4 space-y-2">
    <p class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Delivering to</p>
    <div class="space-y-1">
      <p class="text-sm font-medium text-text-primary">${opts.name}</p>
      <p class="text-sm text-text-secondary">${opts.line1}</p>
      <p class="text-sm text-text-secondary">${opts.city}, ${opts.country}</p>
    </div>
  </div>`;
}

function checkoutHtml(opts: {
  amountFmt: string;
  method: string;
  provider: string;
  ref?: string;
  includeAddress?: boolean;
  includeReset?: boolean;
}): string {
  const summary = summaryCardHtml({
    amountFmt: opts.amountFmt,
    method: opts.method,
    provider: opts.provider,
    status: 'PAID',
    ref: opts.ref,
  });
  const addr = opts.includeAddress
    ? addressCardHtml({
        name: 'Jane Doe',
        line1: '123 Maple Street, Apt 4B',
        city: 'Istanbul',
        country: 'Türkiye',
      })
    : '';
  const reset = opts.includeReset
    ? `<a href="#" class="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-overlay">Start over</a>`
    : '';
  return `<div class="flex flex-col items-center justify-center py-16 space-y-6 text-center max-w-md mx-auto">
  <span class="flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle">
    <span class="w-10 h-10 inline-flex items-center justify-center text-success" aria-hidden="true">
      <i class="fa-solid fa-check" style="font-size:2.25rem;line-height:1"></i>
    </span>
  </span>
  <div class="space-y-2">
    <h2 class="text-2xl font-bold text-text-primary">Payment successful!</h2>
    <p class="text-text-secondary">${opts.amountFmt} was charged. A receipt has been sent to your email.</p>
  </div>
  <div class="w-full space-y-4 text-left">
    ${summary}
    ${addr}
  </div>
  ${reset}
</div>`;
}

export function buildDomainCommonCheckoutSuccessStateData(): ShowcaseItem[] {
  return [
    {
      id: 'checkout-success-state',
      title: 'CheckoutSuccessState',
      category: 'Domain',
      abbr: 'CK',
      description:
        'Success screen shown after checkout completion; includes a confirmation icon, payment summary, and optional delivery address.',
      filePath: 'modules/domain/common/payment/CheckoutSuccessState.ejs',
      sourceCode,
      variants: [
        {
          title: 'Başarı ekranı',
          previewHtml: `<div class="w-full p-4 bg-surface-base">
  ${checkoutHtml({
    amountFmt: '₺1.299,90',
    method: 'CREDIT_CARD',
    provider: 'Stripe',
    ref: 'pi_3NxYz2EwLHMpEt9Q1',
    includeAddress: false,
    includeReset: true,
  })}
</div>`,
          code: `<%- include('modules/domain/common/payment/CheckoutSuccessState', {
  payment: {
    paymentId: 'pay_demo_001',
    provider:  'Stripe',
    providerPaymentId: 'pi_3NxYz2EwLHMpEt9Q1',
    method:    'CREDIT_CARD',
    status:    'PAID',
    amount:    1299.90,
    currency:  'TRY'
  },
  onReset: 'function(){ window.location.reload(); }'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
