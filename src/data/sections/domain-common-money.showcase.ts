import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const priceDisplaySource    = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/money/PriceDisplay.ejs'), 'utf-8');
const orderTotalsSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/money/OrderTotalsCard.ejs'), 'utf-8');
const currencySelectorSource= fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/money/CurrencySelector.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priceEl(amount: number, currency = 'TRY', locale = 'tr-TR', size = 'md', strikethrough = false): string {
  const sizeClass: Record<string, string> = {
    sm: 'text-sm', md: 'text-base', lg: 'text-xl font-semibold', xl: 'text-3xl font-bold',
  };
  const sc = sizeClass[size] || 'text-base';
  const formatted = amount.toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<span class="tabular-nums ${sc}${strikethrough ? ' line-through text-text-secondary' : ''}">${formatted}</span>`;
}

function totalsPreview(locale: string, currency: string, subtotal: number, total: number, extra: { label: string; amount: number; isDiscount?: boolean }[]): string {
  const fmt = (n: number) => Math.abs(n).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const lines = [{ label: 'Subtotal', amount: subtotal, isDiscount: false }, ...extra];
  const rows = lines.map(l =>
    `<div class="flex items-center justify-between text-sm">
      <span class="text-text-secondary">${l.label}</span>
      <span class="tabular-nums ${l.isDiscount ? 'text-success-fg' : 'text-text-primary'}">${l.isDiscount ? '−' : ''}${fmt(l.amount)}</span>
    </div>`
  ).join('');
  return `<div class="w-full max-w-xs p-4">
  <div class="rounded-lg border border-border bg-surface-raised p-4 space-y-2">
    ${rows}
    <div class="flex items-center justify-between pt-3 border-t border-border">
      <span class="text-sm font-semibold text-text-primary">Total</span>
      <span class="tabular-nums text-xl font-semibold text-text-primary">${fmt(total)}</span>
    </div>
  </div>
</div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonMoneyData(): ShowcaseItem[] {
  return [
    // ── PriceDisplay ─────────────────────────────────────────────────────────
    {
      id: 'price-display',
      title: 'PriceDisplay',
      category: 'Domain',
      abbr: 'Pd',
      description: 'Currency formatter using Intl.NumberFormat. Supports any ISO 4217 code and locale. Strikethrough prop renders an original/crossed-out price.',
      filePath: 'modules/domain/common/money/PriceDisplay.ejs',
      sourceCode: priceDisplaySource,
      variants: [
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-col gap-3 p-4">
  ${priceEl(1299.99, 'TRY', 'tr-TR', 'sm')}
  ${priceEl(1299.99, 'TRY', 'tr-TR', 'md')}
  ${priceEl(1299.99, 'TRY', 'tr-TR', 'lg')}
  ${priceEl(1299.99, 'TRY', 'tr-TR', 'xl')}
</div>`,
          code: `<%- include('modules/domain/common/money/PriceDisplay', { amount: 1299.99, currency: 'TRY', size: 'lg' }) %>`,
        },
        {
          title: 'Multi-currency + strikethrough',
          previewHtml: `<div class="flex flex-col gap-3 p-4">
  <div class="flex items-center gap-3">
    ${priceEl(2499, 'TRY', 'tr-TR', 'lg')}
    ${priceEl(1799, 'TRY', 'tr-TR', 'lg', true)}
  </div>
  ${priceEl(89.99, 'USD', 'en-US', 'lg')}
  ${priceEl(74.99, 'EUR', 'de-DE', 'lg')}
</div>`,
          code: `<%- include('modules/domain/common/money/PriceDisplay', { amount: 2499, currency: 'TRY', size: 'lg' }) %>
<%- include('modules/domain/common/money/PriceDisplay', { amount: 1799, currency: 'TRY', size: 'lg', strikethrough: true }) %>`,
        },
      ],
    },

    // ── OrderTotalsCard ───────────────────────────────────────────────────────
    {
      id: 'order-totals-card',
      title: 'OrderTotalsCard',
      category: 'Domain',
      abbr: 'Ot',
      description: 'Order summary card showing subtotal, discount, tax, service fee, shipping, and an emphasized total. Zero-value lines are hidden automatically.',
      filePath: 'modules/domain/common/money/OrderTotalsCard.ejs',
      sourceCode: orderTotalsSource,
      variants: [
        {
          title: 'No extras',
          previewHtml: totalsPreview('en-US', 'USD', 89.99, 89.99, []),
          code: `<%- include('modules/domain/common/money/OrderTotalsCard', {
  totals: { subtotal: 89.99, total: 89.99, currency: 'USD' },
  locale: 'en-US'
}) %>`,
        },
        {
          title: 'With discount, tax & shipping',
          previewHtml: totalsPreview('en-US', 'USD', 149.99, 153.96, [
            { label: 'Discount', amount: 20, isDiscount: true },
            { label: 'Tax', amount: 11.99 },
            { label: 'Shipping', amount: 9.99 },
          ]),
          code: `<%- include('modules/domain/common/money/OrderTotalsCard', {
  totals: { subtotal: 149.99, discountTotal: 20, taxTotal: 11.99, shippingTotal: 9.99, total: 153.96, currency: 'USD' },
  locale: 'en-US'
}) %>`,
        },
      ],
    },

    // ── CurrencySelector ──────────────────────────────────────────────────────
    {
      id: 'currency-selector',
      title: 'CurrencySelector',
      category: 'Domain',
      abbr: 'Cs',
      description: 'Currency dropdown built from countries-list. Deduped, alphabetically sorted ISO 4217 currency codes.',
      filePath: 'modules/domain/common/money/CurrencySelector.ejs',
      sourceCode: currencySelectorSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="w-full max-w-xs p-4">
  <div class="space-y-1">
    <label class="block text-sm font-medium text-text-primary">Currency</label>
    <div class="relative">
      <select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm pr-8">
        <option>TRY</option><option>USD</option><option>EUR</option><option>GBP</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
        <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/money/CurrencySelector', {
  value: currentCurrency,
  name:  'currency',
  currencies: availableCurrencies
}) %>`,
        },
        {
          title: 'No label',
          previewHtml: `<div class="w-full max-w-xs p-4">
  <div class="relative">
    <select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm pr-8">
      <option selected>USD</option><option>TRY</option><option>EUR</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
      <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/money/CurrencySelector', {
  value: 'USD',
  label: '',
  name:  'currency'
}) %>`,
        },
      ],
    },
  ];
}
