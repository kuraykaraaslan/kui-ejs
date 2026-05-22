import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const couponInputSource  = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/discount/CouponInput.ejs'), 'utf-8');
const discountBadgeSource= fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/discount/DiscountBadge.ejs'), 'utf-8');

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonDiscountData(): ShowcaseItem[] {
  return [
    // ── CouponInput ───────────────────────────────────────────────────────────
    {
      id: 'coupon-input',
      title: 'CouponInput',
      category: 'Domain',
      abbr: 'Ci',
      description: 'Coupon code input with apply/remove flow. Calls onApply which returns success/error; shows applied state once a valid code is accepted.',
      filePath: 'modules/domain/common/discount/CouponInput.ejs',
      sourceCode: couponInputSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-3">
    <p class="text-sm font-medium text-text-primary">Have a coupon?</p>
    <div class="flex gap-2">
      <input type="text" placeholder="Enter coupon code" aria-label="Coupon code"
        class="flex-1 block rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm uppercase">
      <button type="submit" class="shrink-0 inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Apply</button>
    </div>
    <p class="text-xs text-text-secondary">Try: <span class="font-mono">SAVE20</span></p>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/discount/CouponInput', {
  action: '/cart/coupon/apply'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Applied state',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface rounded-xl border border-border p-5 space-y-3">
    <p class="text-sm font-medium text-text-primary">Have a coupon?</p>
    <div class="flex items-center justify-between gap-3 rounded-lg bg-success-subtle border border-success px-4 py-2.5">
      <div class="flex items-center gap-2 min-w-0">
        <i class="fa-solid fa-check text-success-fg shrink-0" aria-hidden="true"></i>
        <span class="text-sm font-medium text-success-fg truncate"><span class="font-mono">SAVE20</span> applied</span>
      </div>
      <button class="text-sm text-success-fg underline shrink-0">Remove</button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/discount/CouponInput', {
  appliedCode: 'SAVE20',
  removeAction: '/cart/coupon/remove'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── DiscountBadge ─────────────────────────────────────────────────────────
    {
      id: 'discount-badge',
      title: 'DiscountBadge',
      category: 'Domain',
      abbr: 'Db',
      description: 'Formats and displays a discount: percentage (e.g. "20% off"), fixed amount with currency, or free shipping.',
      filePath: 'modules/domain/common/discount/DiscountBadge.ejs',
      sourceCode: discountBadgeSource,
      variants: [
        {
          title: 'All types',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-sm px-2 py-0.5">20% off</span>
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-sm px-2 py-0.5">₺50 off</span>
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-sm px-2 py-0.5">Free shipping</span>
</div>`,
          code: `<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'PERCENTAGE', discountValue: 20 }) %>
<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'FIXED', discountValue: 50, currency: 'TRY' }) %>
<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'FREE_SHIPPING', discountValue: 0 }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-xs px-1.5 py-0.5">10% off</span>
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-sm px-2 py-0.5">10% off</span>
  <span class="inline-flex items-center font-semibold rounded-full bg-error-subtle text-error border border-error/30 text-base px-2.5 py-1">10% off</span>
</div>`,
          code: `<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'PERCENTAGE', discountValue: 10, size: 'sm' }) %>
<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'PERCENTAGE', discountValue: 10, size: 'md' }) %>
<%- include('modules/domain/common/discount/DiscountBadge', { discountType: 'PERCENTAGE', discountValue: 10, size: 'lg' }) %>`,
        },
      ],
    },
  ];
}
