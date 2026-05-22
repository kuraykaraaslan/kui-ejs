import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import { buildDomainCommonAuthData } from './domain-common-auth.showcase';
import { buildDomainCommonUserData } from './domain-common-user.showcase';
import { buildDomainCommonMoneyData } from './domain-common-money.showcase';
import { buildDomainCommonPaymentData } from './domain-common-payment.showcase';
import { buildDomainCommonAddressData } from './domain-common-address.showcase';
import { buildDomainCommonStatusData } from './domain-common-status.showcase';
import { buildDomainCommonDiscountData } from './domain-common-discount.showcase';
import { buildDomainCommonSeoData } from './domain-common-seo.showcase';
import { buildDomainCommonLocationData } from './domain-common-location.showcase';
import { buildDomainCommonEmailData } from './domain-common-email.showcase';
import { buildDomainCommonChartsData } from './domain-common-charts.showcase';
import { buildDomainCommonNotificationFilterTabsData } from './domain-common-notification-filter-tabs.showcase';
import { buildDomainCommonNotificationListItemData } from './domain-common-notification-list-item.showcase';
import { buildDomainCommonNotificationMenuData } from './domain-common-notification-menu.showcase';
import { buildDomainCommonCheckoutSuccessStateData } from './domain-common-checkout-success-state.showcase';
import { buildDomainCommonCartBadgeData } from './domain-common-cart-badge.showcase';
import { buildDomainCommonChatBoxData } from './domain-common-chat-box.showcase';
import { buildDomainCommonCountrySelectorData } from './domain-common-country-selector.showcase';
import { buildDomainCommonSubscriptionPlanCardData } from './domain-common-subscription-plan-card.showcase';

const languageSwitcherSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/i18n/LanguageSwitcher.ejs'), 'utf-8');
const directionProviderSource= fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/i18n/DirectionProvider.ejs'), 'utf-8');
const notFoundPageSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/NotFoundPage.ejs'), 'utf-8');

// ─── LanguageSwitcher preview helper ─────────────────────────────────────────

function langSwitcherEl(value: string) {
  const langs = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'tr', label: '🇹🇷 Türkçe' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'ar', label: '🇸🇦 العربية' },
  ];
  const options = langs.map(l =>
    `<option value="${l.value}"${l.value === value ? ' selected' : ''}>${l.label}</option>`
  ).join('');
  return `<div class="relative inline-flex items-center gap-1">
  <i class="fa-solid fa-globe text-text-secondary text-sm" aria-hidden="true"></i>
  <select aria-label="Select language"
    class="appearance-none rounded-md border border-border bg-surface text-text-primary text-sm px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors cursor-pointer">
    ${options}
  </select>
  <i class="fa-solid fa-chevron-down text-xs text-text-disabled pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" aria-hidden="true"></i>
</div>`;
}

// ─── NotFoundPage preview (miniaturized) ──────────────────────────────────────

const notFoundPreview = `<div class="flex flex-col items-center justify-center py-10 px-4 bg-surface-base w-full text-center">
  <div class="select-none text-7xl font-black leading-none tabular-nums"
    style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;opacity:.15"
    aria-hidden="true">404</div>
  <div class="flex h-14 w-14 -mt-6 mb-4 items-center justify-center rounded-xl"
    style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%)">
    <i class="fa-solid fa-magnifying-glass text-white text-lg" aria-hidden="true"></i>
  </div>
  <h1 class="text-lg font-bold text-text-primary">Page Not Found</h1>
  <p class="mt-2 max-w-xs text-text-secondary text-sm">The page you're looking for has been removed, moved, or never existed.</p>
  <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
    <a href="#" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
      style="background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%)">
      <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>Go Home
    </a>
    <button type="button" class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-text-primary border border-border hover:bg-surface-overlay">
      Go Back
    </button>
  </div>
</div>`;

// ─── i18n items ───────────────────────────────────────────────────────────────

const languageSwitcherItem: ShowcaseItem = {
  id: 'language-switcher',
  title: 'LanguageSwitcher',
  category: 'Domain',
  abbr: 'Ls',
  description: 'Language selector using a native select. Defaults to en/tr/de/fr/ar; with autoSubmit the form is submitted automatically on change.',
  filePath: 'modules/domain/common/i18n/LanguageSwitcher.ejs',
  sourceCode: languageSwitcherSource,
  variants: [
    {
      title: 'Default (English)',
      previewHtml: `<div class="p-4">${langSwitcherEl('en')}</div>`,
      code: `<%- include('modules/domain/common/i18n/LanguageSwitcher', {
  value: currentLang,
  name: 'language'
}) %>`,
    },
    {
      title: 'Turkish selected',
      previewHtml: `<div class="p-4">${langSwitcherEl('tr')}</div>`,
      code: `<%- include('modules/domain/common/i18n/LanguageSwitcher', {
  value: 'tr'
}) %>`,
    },
    {
      title: 'Auto-submit on change',
      previewHtml: `<div class="p-4"><form action="/set-language" method="post">${langSwitcherEl('en')}</form></div>`,
      code: `<form action="/set-language" method="post">
  <%- include('modules/domain/common/i18n/LanguageSwitcher', {
    value: currentLang,
    autoSubmit: true
  }) %>
</form>`,
    },
  ],
};

const directionProviderItem: ShowcaseItem = {
  id: 'direction-provider',
  title: 'DirectionProvider',
  category: 'Domain',
  abbr: 'Dp',
  description: 'Wrapper div that sets dir="rtl"/"ltr" based on the language code. RTL languages: ar, he, fa, ur, yi, ku, ps, sd.',
  filePath: 'modules/domain/common/i18n/DirectionProvider.ejs',
  sourceCode: directionProviderSource,
  variants: [
    {
      title: 'RTL (Arabic)',
      previewHtml: `<div class="w-full max-w-sm p-4">
  <div dir="rtl" lang="ar">
    <div class="space-y-2 p-4 bg-surface-raised border border-border rounded-lg">
      <p class="text-sm font-semibold text-text-primary">dir="rtl"</p>
      <p class="text-sm text-text-secondary">مرحبا بالعالم — Hello World</p>
      <p class="text-xs text-text-disabled">Text flows right to left</p>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/common/i18n/DirectionProvider', {
  lang: 'ar'
}) %>`,
      layout: 'stack',
    },
    {
      title: 'LTR (English)',
      previewHtml: `<div class="w-full max-w-sm p-4">
  <div dir="ltr" lang="en">
    <div class="space-y-2 p-4 bg-surface-raised border border-border rounded-lg">
      <p class="text-sm font-semibold text-text-primary">dir="ltr"</p>
      <p class="text-sm text-text-secondary">Hello World — مرحبا بالعالم</p>
      <p class="text-xs text-text-disabled">Text flows left to right</p>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/common/i18n/DirectionProvider', {
  lang: 'en'
}) %>`,
      layout: 'stack',
    },
  ],
};

const notFoundPageItem: ShowcaseItem = {
  id: 'not-found-page',
  title: 'NotFoundPage',
  category: 'Domain',
  abbr: 'Nf',
  description: 'Full-page 404 screen with a gradient "404" heading, icon slot, title, description, and home/back action buttons.',
  filePath: 'modules/domain/common/NotFoundPage.ejs',
  sourceCode: notFoundPageSource,
  variants: [
    {
      title: 'Default',
      previewHtml: notFoundPreview,
      code: `<%- include('modules/domain/common/NotFoundPage') %>`,
      layout: 'stack',
    },
    {
      title: 'Custom title & description',
      previewHtml: notFoundPreview,
      code: `<%- include('modules/domain/common/NotFoundPage', {
  title: 'Nothing here yet',
  description: 'This section is under construction. Check back soon.',
  homeLabel: 'Return home',
  backLabel: 'Previous page'
}) %>`,
      layout: 'stack',
    },
  ],
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonData(): ShowcaseItem[] {
  // Collect all items indexed by id
  const allItems: Record<string, ShowcaseItem> = {};

  for (const item of [
    ...buildDomainCommonAuthData(),
    ...buildDomainCommonUserData(),
    ...buildDomainCommonMoneyData(),
    ...buildDomainCommonPaymentData(),
    ...buildDomainCommonAddressData(),
    ...buildDomainCommonStatusData(),
    ...buildDomainCommonDiscountData(),
    ...buildDomainCommonSeoData(),
    ...buildDomainCommonLocationData(),
    languageSwitcherItem,
    directionProviderItem,
    notFoundPageItem,
    ...buildDomainCommonEmailData(),
    ...buildDomainCommonChartsData(),
    ...buildDomainCommonNotificationFilterTabsData(),
    ...buildDomainCommonNotificationListItemData(),
    ...buildDomainCommonNotificationMenuData(),
    ...buildDomainCommonCheckoutSuccessStateData(),
    ...buildDomainCommonCartBadgeData(),
    ...buildDomainCommonChatBoxData(),
    ...buildDomainCommonCountrySelectorData(),
    ...buildDomainCommonSubscriptionPlanCardData(),
  ]) {
    allItems[item.id] = item;
  }

  // Return in exact NextJS showcase order
  const ORDER = [
    'login-form',
    'register-form',
    'oauth-buttons',
    'user-avatar',
    'user-role-badge',
    'user-status-badge',
    'user-menu',
    'price-display',
    'payment-status-badge',
    'address-form',
    'address-card',
    'order-totals-card',
    'publish-status-badge',
    'visibility-badge',
    'language-switcher',
    'change-password-form',
    'user-profile-card',
    'user-profile-form',
    'user-preferences-form',
    'coupon-input',
    'discount-badge',
    'payment-method-selector',
    'payment-summary-card',
    'forgot-password-form',
    'session-expired-banner',
    'seo-form',
    'seo-preview',
    'address-selector',
    'location-picker',
    'geo-point-display',
    'processing-status-indicator',
    'currency-selector',
    'country-selector',
    'direction-provider',
    'credit-card-visual',
    'credit-card-form',
    'saved-card-selector',
    'not-found-page',
    'chat-box',
    // Emails
    'email-welcome',
    'email-verify-otp',
    'email-password-reset',
    'email-password-changed',
    'email-login-alert',
    'email-account-locked',
    'email-order-confirmation',
    'email-order-shipped',
    'email-order-delivered',
    'email-order-cancelled',
    'email-refund',
    'email-abandoned-cart',
    'email-invoice',
    'email-subscription-activated',
    'email-renewal-reminder',
    'email-subscription-cancelled',
    'email-payment-failed',
    'email-card-expiring',
    'email-comment-reply',
    'email-mention',
    'email-new-message',
    'email-newsletter',
    'email-promotional',
    'email-product-update',
    'email-maintenance',
    'email-policy-update',
    'email-data-export',
    'email-account-deletion',
    'email-ticket-opened',
    'email-ticket-reply',
    'email-ticket-resolved',
    'charts',
    'notification-filter-tabs',
    'notification-list-item',
    'notification-menu',
    'subscription-plan-card',
    'checkout-success-state',
    'cart-badge',
  ];

  return ORDER.map((id) => {
    if (!allItems[id]) throw new Error(`ShowcaseItem not found: ${id}`);
    return allItems[id];
  });
}
