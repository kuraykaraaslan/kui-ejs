import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/cart/CartBadge.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cartBadgeEl(totalQty: number): string {
  const display = totalQty > 99 ? '99+' : String(totalQty);
  const label = `Cart — ${totalQty} item${totalQty !== 1 ? 's' : ''}`;
  return `<button type="button"
    aria-label="${label}"
    class="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-surface-raised text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
    <i class="fa-solid fa-cart-shopping w-5 h-5" aria-hidden="true"></i>
    ${totalQty > 0 ? `<span aria-hidden="true" class="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-fg tabular-nums shadow">${display}</span>` : ''}
  </button>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonCartBadgeData(): ShowcaseItem[] {
  return [
    {
      id: 'cart-badge',
      title: 'CartBadge',
      category: 'Domain',
      abbr: 'CB',
      description: 'Round cart button for the header that shows the number of items in the cart. Counts above 99 render as a "99+" badge.',
      filePath: 'modules/domain/common/cart/CartBadge.ejs',
      sourceCode,
      variants: [
        {
          title: 'States',
          previewHtml: `<div class="flex flex-wrap items-center justify-center gap-6 p-6">
  <div class="flex flex-col items-center gap-2">
    ${cartBadgeEl(0)}
    <span class="text-xs text-text-secondary">Empty</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    ${cartBadgeEl(3)}
    <span class="text-xs text-text-secondary">3 items</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    ${cartBadgeEl(12)}
    <span class="text-xs text-text-secondary">12 items</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    ${cartBadgeEl(150)}
    <span class="text-xs text-text-secondary">99+ overflow</span>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [] }
}) %>
<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [{ quantity: 1 }, { quantity: 2 }] }
}) %>
<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [{ quantity: 150 }] }
}) %>`,
        },
        {
          title: 'In a header',
          previewHtml: `<div class="w-full max-w-md p-4">
  <header class="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-base border border-border">
    <div class="flex items-center gap-2">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg text-sm font-bold">S</span>
      <span class="text-sm font-semibold text-text-primary">Shop</span>
    </div>
    <nav class="flex items-center gap-2">
      <button type="button" class="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-surface-overlay text-text-secondary" aria-label="Search">
        <i class="fa-solid fa-magnifying-glass w-4 h-4" aria-hidden="true"></i>
      </button>
      ${cartBadgeEl(5)}
    </nav>
  </header>
</div>`,
          code: `<header class="flex items-center justify-between">
  <a href="/">Shop</a>
  <nav>
    <%- include('modules/domain/common/cart/CartBadge', {
      cart: currentCart,
      onClick: 'openCartDrawer'
    }) %>
  </nav>
</header>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
