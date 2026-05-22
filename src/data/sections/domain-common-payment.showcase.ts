import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const paymentStatusBadgeSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/PaymentStatusBadge.ejs'), 'utf-8');
const paymentMethodSelectorSource= fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/PaymentMethodSelector.ejs'), 'utf-8');
const paymentSummaryCardSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/PaymentSummaryCard.ejs'), 'utf-8');
const creditCardVisualSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/CreditCardVisual.ejs'), 'utf-8');
const creditCardFormSource       = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/CreditCardForm.ejs'), 'utf-8');
const savedCardSelectorSource    = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/payment/SavedCardSelector.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function badgeEl(variant: string, children: string, dot = false): string {
  const vc: Record<string, string> = {
    success: 'bg-success-subtle text-success-fg',
    error:   'bg-error-subtle text-error-fg',
    warning: 'bg-warning-subtle text-warning-fg',
    info:    'bg-info-subtle text-info-fg',
    neutral: 'bg-surface-sunken text-text-secondary',
  };
  const dc: Record<string, string> = {
    success: 'bg-success', error: 'bg-error', warning: 'bg-warning', info: 'bg-info', neutral: 'bg-text-disabled',
  };
  const dotHtml = dot ? `<span class="h-1.5 w-1.5 rounded-full shrink-0 ${dc[variant] || 'bg-text-disabled'}" aria-hidden="true"></span>` : '';
  return `<span class="inline-flex items-center gap-1 rounded-full font-medium ${vc[variant] || vc.neutral} px-2 py-0.5 text-xs">${dotHtml}${children}</span>`;
}

const STATUS_META: Record<string, { label: string; variant: string }> = {
  PENDING:    { label: 'Pending',    variant: 'warning' },
  AUTHORIZED: { label: 'Authorized', variant: 'info' },
  PAID:       { label: 'Paid',       variant: 'success' },
  FAILED:     { label: 'Failed',     variant: 'error' },
  CANCELLED:  { label: 'Cancelled',  variant: 'neutral' },
  REFUNDED:   { label: 'Refunded',   variant: 'info' },
};

function cardVisualHtml(opts: {
  brand: string; cardNumber: string; cardholderName: string;
  expiryMonth: string; expiryYear: string; cvv?: string; flipped?: boolean;
}): string {
  const gradients: Record<string, string> = {
    VISA:       'linear-gradient(135deg,#1A1F71,#0A0F3D)',
    MASTERCARD: 'linear-gradient(135deg,#EB001B,#F79E1B,#FF5F00)',
    AMEX:       'linear-gradient(135deg,#2E77BC,#006FCF)',
    DISCOVER:   'linear-gradient(135deg,#F58220,#111827)',
    UNKNOWN:    'linear-gradient(135deg,#4B5563,#111827)',
  };
  const labels: Record<string, string> = {
    VISA: 'VISA', MASTERCARD: 'Mastercard', AMEX: 'AMEX', DISCOVER: 'Discover',
  };
  const grad = gradients[opts.brand] || gradients.UNKNOWN;
  const label = labels[opts.brand] || '';
  const isAmex = opts.brand === 'AMEX';
  const digits = opts.cardNumber.replace(/\D/g, '').padEnd(isAmex ? 15 : 16, '•');
  const masked = isAmex
    ? `${digits.slice(0,4)} ${digits.slice(4,10)} ${digits.slice(10,15)}`
    : `${digits.slice(0,4)} ${digits.slice(4,8)} ${digits.slice(8,12)} ${digits.slice(12,16)}`;
  const cvvStars = opts.cvv ? '•'.repeat(opts.cvv.length) : '•••';
  const transform = opts.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';

  return `<div class="w-72 h-44 select-none mx-auto" style="perspective:1000px" aria-hidden="true">
  <div class="relative w-full h-full" style="transform-style:preserve-3d;transform:${transform};transition:transform .5s">
    <div class="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between shadow-xl text-white" style="background:${grad};backface-visibility:hidden">
      <div class="flex justify-between items-start">
        <div class="flex gap-1">
          <div class="w-8 h-6 rounded" style="background:rgba(250,204,21,.8)"></div>
          <div class="w-8 h-6 rounded -ml-3" style="background:rgba(253,224,71,.5)"></div>
        </div>
        ${label ? `<span class="text-sm font-bold tracking-widest" style="opacity:.9">${label}</span>` : ''}
      </div>
      <p class="font-mono text-lg tracking-widest">${masked}</p>
      <div class="flex justify-between items-end">
        <div>
          <p class="uppercase mb-0.5" style="font-size:9px;opacity:.6">Card Holder</p>
          <p class="text-xs font-medium tracking-wide uppercase truncate" style="max-width:10rem">${opts.cardholderName || '••••• •••••'}</p>
        </div>
        <div class="text-right">
          <p class="uppercase mb-0.5" style="font-size:9px;opacity:.6">Expires</p>
          <p class="text-xs font-medium font-mono">${opts.expiryMonth}/${opts.expiryYear}</p>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 rounded-2xl shadow-xl overflow-hidden text-white" style="background:${grad};backface-visibility:hidden;transform:rotateY(180deg)">
      <div class="mt-7 h-10 w-full" style="background:rgba(0,0,0,.6)"></div>
      <div class="px-5 mt-4 flex items-center justify-end gap-3">
        <div class="flex-1 h-6 rounded" style="background:rgba(255,255,255,.2)"></div>
        <div class="rounded px-3 py-1 text-right min-w-14" style="background:rgba(255,255,255,.9)">
          <p class="text-gray-500 mb-0.5" style="font-size:9px">CVV</p>
          <p class="font-mono text-sm text-gray-800 tracking-widest">${cvvStars}</p>
        </div>
      </div>
      ${label ? `<p class="absolute bottom-4 right-5 text-sm font-bold tracking-widest" style="opacity:.8">${label}</p>` : ''}
    </div>
  </div>
</div>`;
}

const baseInput = (opts: { id: string; label: string; type?: string; placeholder?: string }) =>
  `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>
  <input type="${opts.type || 'text'}" id="${opts.id}" placeholder="${opts.placeholder || ''}"
    class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
</div>`;

const submitBtn = (label: string, fullWidth = true) =>
  `<button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm${fullWidth ? ' w-full' : ''}">${label}</button>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonPaymentData(): ShowcaseItem[] {
  return [
    // ── PaymentStatusBadge ────────────────────────────────────────────────────
    {
      id: 'payment-status-badge',
      title: 'PaymentStatusBadge',
      category: 'Domain',
      abbr: 'Ps',
      description: 'Color-coded badge for all PaymentStatus values: PENDING / AUTHORIZED / PAID / FAILED / CANCELLED / REFUNDED.',
      filePath: 'modules/domain/common/payment/PaymentStatusBadge.ejs',
      sourceCode: paymentStatusBadgeSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="flex flex-wrap gap-3 p-4">
  ${Object.entries(STATUS_META).map(([, m]) => badgeEl(m.variant, m.label)).join('\n  ')}
</div>`,
          code: `<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PAID' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PENDING' }) %>`,
        },
        {
          title: 'With dot, large',
          previewHtml: `<div class="flex flex-wrap gap-3 p-4">
  ${['PENDING', 'PAID', 'FAILED'].map(s => {
    const m = STATUS_META[s];
    return badgeEl(m.variant, m.label, true);
  }).join('\n  ')}
</div>`,
          code: `<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PENDING', dot: true, size: 'lg' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PAID',    dot: true, size: 'lg' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'FAILED',  dot: true, size: 'lg' }) %>`,
        },
      ],
    },

    // ── PaymentMethodSelector ─────────────────────────────────────────────────
    {
      id: 'payment-method-selector',
      title: 'PaymentMethodSelector',
      category: 'Domain',
      abbr: 'Pm',
      description: 'Radio-group style card selector for payment methods. Shows icon, label, and description. Default set: credit card, debit card, bank transfer, wallet.',
      filePath: 'modules/domain/common/payment/PaymentMethodSelector.ejs',
      sourceCode: paymentMethodSelectorSource,
      variants: [
        {
          title: 'Default (4 methods)',
          previewHtml: `<div class="w-full max-w-lg p-4">
  <fieldset>
    <legend class="block text-sm font-medium text-text-primary mb-3">Payment method</legend>
    <div class="grid grid-cols-2 gap-3">
      ${[
        { icon: 'fa-solid fa-credit-card text-blue-600',           label: 'Credit Card',   desc: 'Visa, Mastercard, Amex', selected: true },
        { icon: 'fa-solid fa-credit-card text-green-600',          label: 'Debit Card',    desc: 'All bank debit cards',   selected: false },
        { icon: 'fa-solid fa-building-columns text-text-secondary', label: 'Bank Transfer', desc: 'Direct from account',    selected: false },
        { icon: 'fa-solid fa-wallet text-purple-600',              label: 'Digital Wallet', desc: 'PayPal, Google Pay',    selected: false },
      ].map(m => `<label class="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${m.selected ? 'border-primary ring-2 ring-primary bg-primary-subtle/30' : 'border-border'}">
        <span aria-hidden="true" class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${m.selected ? 'border-primary bg-primary' : 'border-border'}">
          ${m.selected ? '<span class="h-1.5 w-1.5 rounded-full bg-white"></span>' : ''}
        </span>
        <i class="${m.icon} text-lg" aria-hidden="true"></i>
        <div><p class="text-sm font-medium text-text-primary">${m.label}</p><p class="text-xs text-text-secondary">${m.desc}</p></div>
      </label>`).join('')}
    </div>
  </fieldset>
</div>`,
          code: `<%- include('modules/domain/common/payment/PaymentMethodSelector', {
  name:  'paymentMethod',
  value: selectedMethod
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── PaymentSummaryCard ────────────────────────────────────────────────────
    {
      id: 'payment-summary-card',
      title: 'PaymentSummaryCard',
      category: 'Domain',
      abbr: 'Sc',
      description: 'Read-only payment summary card: amount, method, provider, provider reference, and status badge.',
      filePath: 'modules/domain/common/payment/PaymentSummaryCard.ejs',
      sourceCode: paymentSummaryCardSource,
      variants: [
        {
          title: 'Paid via Stripe',
          previewHtml: `<div class="w-full max-w-xs p-4">
  <div class="bg-surface-raised border border-border rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-overlay">
      <span class="text-sm font-semibold text-text-primary">Payment</span>
      ${badgeEl('success', 'Paid', true)}
    </div>
    <div class="px-4 py-4 space-y-3">
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Amount</span><span class="tabular-nums text-xl font-semibold text-text-primary">$153.96</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Method</span><span class="text-sm font-medium text-text-primary">Credit Card</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Provider</span><span class="text-sm font-medium text-text-primary">Stripe</span></div>
      <div class="flex items-center justify-between gap-4"><span class="text-sm text-text-secondary shrink-0">Ref</span><span class="text-xs font-mono text-text-secondary truncate text-right">pi_3Nf9xZ2eZvKYlo2C</span></div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/payment/PaymentSummaryCard', {
  payment: {
    provider: 'Stripe', method: 'CREDIT_CARD', status: 'PAID',
    amount: 153.96, currency: 'USD', providerPaymentId: 'pi_3Nf9xZ'
  }
}) %>`,
        },
        {
          title: 'Pending bank transfer',
          previewHtml: `<div class="w-full max-w-xs p-4">
  <div class="bg-surface-raised border border-border rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-overlay">
      <span class="text-sm font-semibold text-text-primary">Payment</span>
      ${badgeEl('warning', 'Pending', true)}
    </div>
    <div class="px-4 py-4 space-y-3">
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Amount</span><span class="tabular-nums text-xl font-semibold text-text-primary">₺2.499,00</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Method</span><span class="text-sm font-medium text-text-primary">Bank Transfer</span></div>
      <div class="flex items-center justify-between"><span class="text-sm text-text-secondary">Provider</span><span class="text-sm font-medium text-text-primary">Iyzico</span></div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/payment/PaymentSummaryCard', {
  payment: { provider: 'Iyzico', method: 'BANK_TRANSFER', status: 'PENDING', amount: 2499, currency: 'TRY' }
}) %>`,
        },
      ],
    },

    // ── CreditCardVisual ──────────────────────────────────────────────────────
    {
      id: 'credit-card-visual',
      title: 'CreditCardVisual',
      category: 'Domain',
      abbr: 'Cv',
      description: 'Animated 3-D flip credit card. Front shows number, name, expiry; back shows CVV strip. Supports VISA, Mastercard, AMEX, Discover.',
      filePath: 'modules/domain/common/payment/CreditCardVisual.ejs',
      sourceCode: creditCardVisualSource,
      variants: [
        {
          title: 'Brands',
          previewHtml: `<div class="flex flex-wrap gap-4 justify-center p-4">
  ${cardVisualHtml({ brand: 'VISA', cardNumber: '4111111111111111', cardholderName: 'JANE DOE', expiryMonth: '08', expiryYear: '28' })}
  ${cardVisualHtml({ brand: 'MASTERCARD', cardNumber: '5500005555555559', cardholderName: 'JOHN SMITH', expiryMonth: '12', expiryYear: '27' })}
</div>`,
          code: `<%- include('modules/domain/common/payment/CreditCardVisual', {
  brand: 'VISA', cardNumber: '4111111111111111',
  cardholderName: 'JANE DOE', expiryMonth: '08', expiryYear: '28'
}) %>`,
        },
        {
          title: 'Flipped (CVV)',
          previewHtml: `<div class="flex flex-wrap gap-4 justify-center p-4">
  ${cardVisualHtml({ brand: 'AMEX', cardNumber: '378282246310005', cardholderName: 'JANE DOE', expiryMonth: '03', expiryYear: '26', cvv: '1234', flipped: true })}
</div>`,
          code: `<%- include('modules/domain/common/payment/CreditCardVisual', {
  brand: 'AMEX', cardNumber: '378282246310005',
  cardholderName: 'JANE DOE', expiryMonth: '03', expiryYear: '26',
  cvv: '1234', flipped: true
}) %>`,
        },
      ],
    },

    // ── CreditCardForm ────────────────────────────────────────────────────────
    {
      id: 'credit-card-form',
      title: 'CreditCardForm',
      category: 'Domain',
      abbr: 'Cf',
      description: 'Full credit card entry form with live card visual preview. Auto-detects brand, formats number, flips card on CVV focus, validates expiry.',
      filePath: 'modules/domain/common/payment/CreditCardForm.ejs',
      sourceCode: creditCardFormSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <h2 class="text-base font-semibold text-text-primary">Add Payment Card</h2>
    ${cardVisualHtml({ brand: 'UNKNOWN', cardNumber: '', cardholderName: '', expiryMonth: 'MM', expiryYear: 'YY' })}
    ${baseInput({ id: 'card-num', label: 'Card Number', placeholder: '1234 5678 9012 3456' })}
    ${baseInput({ id: 'card-name', label: 'Cardholder Name', placeholder: 'Name on card' })}
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'exp', label: 'Expiry', placeholder: 'MM/YY' })}
      ${baseInput({ id: 'cvv', label: 'CVV', type: 'password', placeholder: '•••' })}
    </div>
    ${submitBtn('Add Card')}
  </div>
</div>`,
          code: `<%- include('modules/domain/common/payment/CreditCardForm', {
  action: '/payment/cards',
  method: 'post'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Server error',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-4">
    <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
      <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
      <span>Card declined. Please try a different card.</span>
    </div>
    ${baseInput({ id: 'cn2', label: 'Card Number', placeholder: '1234 5678 9012 3456' })}
    ${baseInput({ id: 'cn3', label: 'Cardholder Name', placeholder: 'Name on card' })}
    <div class="grid grid-cols-2 gap-4">
      ${baseInput({ id: 'exp2', label: 'Expiry', placeholder: 'MM/YY' })}
      ${baseInput({ id: 'cvv2', label: 'CVV', type: 'password', placeholder: '•••' })}
    </div>
    ${submitBtn('Add Card')}
  </div>
</div>`,
          code: `<%- include('modules/domain/common/payment/CreditCardForm', {
  action: '/payment/cards',
  error: 'Card declined. Please try a different card.'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── SavedCardSelector ─────────────────────────────────────────────────────
    {
      id: 'saved-card-selector',
      title: 'SavedCardSelector',
      category: 'Domain',
      abbr: 'Sk',
      description: 'Radio-group list of saved payment cards. Shows brand badge, masked number, expiry, and default indicator. Supports remove and add-new callbacks.',
      filePath: 'modules/domain/common/payment/SavedCardSelector.ejs',
      sourceCode: savedCardSelectorSource,
      variants: [
        {
          title: 'Multiple cards',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-2">
  ${[
    { brand: 'VISA', bg: 'bg-blue-600', lbl: 'VISA', last4: '4242', name: 'Jane Doe', exp: '08/28', isDefault: true, selected: true },
    { brand: 'MASTERCARD', bg: 'bg-orange-500', lbl: 'MC', last4: '5559', name: 'Jane Doe', exp: '12/27', isDefault: false, selected: false },
    { brand: 'AMEX', bg: 'bg-teal-600', lbl: 'AMEX', last4: '0005', name: 'Jane Doe', exp: '03/26', isDefault: false, selected: false },
  ].map(c => `
  <label class="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${c.selected ? 'border-primary ring-2 ring-primary ring-offset-1 bg-surface-raised' : 'border-border bg-surface-raised'}">
    <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${c.selected ? 'border-primary bg-primary' : 'border-border'}">
      ${c.selected ? '<span class="h-1.5 w-1.5 rounded-full bg-white"></span>' : ''}
    </span>
    <span class="inline-flex items-center justify-center rounded px-1.5 py-0.5 font-bold text-white tracking-wide shrink-0 ${c.bg}" style="font-size:10px">${c.lbl}</span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-text-primary font-mono">•••• •••• •••• ${c.last4}</p>
      <p class="text-xs text-text-secondary">${c.name} · ${c.exp}${c.isDefault ? ' <span class="ml-2 font-semibold text-primary uppercase" style="font-size:10px">Default</span>' : ''}</p>
    </div>
  </label>`).join('')}
</div>`,
          code: `<%- include('modules/domain/common/payment/SavedCardSelector', {
  cards: savedCards,
  selectedCardId: selectedCard,
  addHref: '/payment/cards/new',
  removeAction: '/payment/cards/{id}/remove'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <p class="text-sm text-text-secondary py-4 text-center">No saved cards.</p>
  <a href="#" class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">+ Add new card</a>
</div>`,
          code: `<%- include('modules/domain/common/payment/SavedCardSelector', {
  cards: [],
  addHref: '/payment/cards/new'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
