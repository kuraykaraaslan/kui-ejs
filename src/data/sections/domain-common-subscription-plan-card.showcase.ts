import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/subscription/SubscriptionPlanCard.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Plan = {
  name: string;
  description?: string;
  price: number;        // minor units (e.g. 1900 = $19.00)
  currency?: string;
  interval?: 'MONTHLY' | 'YEARLY' | 'ONCE';
  features?: string[];
  isPopular?: boolean;
};

const INTERVAL_LABEL: Record<string, string> = {
  MONTHLY: '/ month',
  YEARLY:  '/ year',
  ONCE:    'one-time',
};

function formatPrice(price: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: price % 100 === 0 ? 0 : 2,
    }).format(price / 100);
  } catch {
    return (price / 100).toFixed(2) + ' ' + currency;
  }
}

function planCard(plan: Plan, opts: { isCurrent?: boolean; isSelected?: boolean; loading?: boolean; hasAction?: boolean } = {}): string {
  const highlighted = plan.isPopular || opts.isSelected || opts.isCurrent;
  const cardClass = 'relative flex flex-col rounded-2xl border p-6 transition-shadow ' +
    (highlighted ? 'border-primary shadow-md shadow-primary/10' : 'border-border shadow-sm hover:shadow-md');

  const intervalLabel = INTERVAL_LABEL[plan.interval || 'MONTHLY'];
  const formattedPrice = formatPrice(plan.price, plan.currency);

  const btnDisabled = opts.isCurrent || opts.loading || !opts.hasAction;
  const btnText = opts.isCurrent ? 'Current Plan' : (opts.loading ? 'Processing…' : `Choose ${plan.name}`);
  const btnClass = 'mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ' +
    (opts.isCurrent
      ? 'bg-surface-raised text-text-secondary cursor-default'
      : 'bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed');

  return `<div class="${cardClass}">
    ${plan.isPopular && !opts.isCurrent ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-fg">
      <i class="fa-solid fa-star w-2.5 h-2.5" aria-hidden="true"></i>Popular
    </span>` : ''}
    ${opts.isCurrent ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-success px-3 py-0.5 text-xs font-semibold text-white">
      <i class="fa-solid fa-check w-2.5 h-2.5" aria-hidden="true"></i>Current Plan
    </span>` : ''}

    <div class="mb-4">
      <h3 class="text-base font-semibold text-text-primary">${plan.name}</h3>
      ${plan.description ? `<p class="mt-1 text-xs text-text-secondary">${plan.description}</p>` : ''}
    </div>

    <div class="mb-6 flex items-baseline gap-1">
      <span class="text-3xl font-bold text-text-primary tracking-tight">${formattedPrice}</span>
      <span class="text-sm text-text-secondary">${intervalLabel}</span>
    </div>

    ${plan.features && plan.features.length ? `<ul class="mb-6 flex-1 space-y-2">
      ${plan.features.map(f => `<li class="flex items-start gap-2 text-sm text-text-primary">
        <i class="fa-solid fa-check w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" aria-hidden="true"></i>
        <span>${f}</span>
      </li>`).join('')}
    </ul>` : ''}

    <button type="button" ${btnDisabled ? 'disabled' : ''} class="${btnClass}">${btnText}</button>
  </div>`;
}

const STARTER: Plan = {
  name: 'Starter',
  description: 'For individuals getting started',
  price: 0,
  currency: 'USD',
  interval: 'MONTHLY',
  features: ['1 project', 'Community support', 'Basic analytics'],
};

const PRO: Plan = {
  name: 'Pro',
  description: 'For growing teams',
  price: 1900,
  currency: 'USD',
  interval: 'MONTHLY',
  features: ['Unlimited projects', 'Priority email support', 'Advanced analytics', 'Custom integrations'],
  isPopular: true,
};

const BUSINESS: Plan = {
  name: 'Business',
  description: 'For organizations at scale',
  price: 4900,
  currency: 'USD',
  interval: 'MONTHLY',
  features: ['Everything in Pro', 'SSO & SAML', 'Dedicated success manager', '99.9% uptime SLA'],
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonSubscriptionPlanCardData(): ShowcaseItem[] {
  return [
    {
      id: 'subscription-plan-card',
      title: 'SubscriptionPlanCard',
      category: 'Domain',
      abbr: 'SP',
      description: 'Fiyatlandırma sayfaları için abonelik plan kartı. Popüler/aktif rozetleri, Intl.NumberFormat ile yerelleştirilmiş para birimi, özellik listesi ve POST aksiyonlu seçim formu içerir.',
      filePath: 'modules/domain/common/subscription/SubscriptionPlanCard.ejs',
      sourceCode,
      variants: [
        {
          title: 'Plan grid',
          previewHtml: `<div class="w-full p-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-3">
    ${planCard(STARTER, { hasAction: true })}
    ${planCard(PRO,     { isCurrent: true, hasAction: true })}
    ${planCard(BUSINESS, { hasAction: true })}
  </div>
</div>`,
          code: `<div class="grid grid-cols-3 gap-4">
  <%- include('modules/domain/common/subscription/SubscriptionPlanCard', {
    plan: freePlan,
    action: '/billing/subscribe'
  }) %>
  <%- include('modules/domain/common/subscription/SubscriptionPlanCard', {
    plan: proPlan,
    isCurrent: true
  }) %>
  <%- include('modules/domain/common/subscription/SubscriptionPlanCard', {
    plan: enterprisePlan,
    action: '/billing/subscribe'
  }) %>
</div>`,
          layout: 'stack',
        },
        {
          title: 'Single card states',
          previewHtml: `<div class="w-full p-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-3">
    ${planCard(PRO, { isCurrent: true, hasAction: true })}
    ${planCard({ ...PRO, isPopular: true }, { hasAction: true })}
  </div>
</div>`,
          code: `<%- include('modules/domain/common/subscription/SubscriptionPlanCard', {
  plan: plan,
  isCurrent: true
}) %>
<%- include('modules/domain/common/subscription/SubscriptionPlanCard', {
  plan: Object.assign({}, plan, { isPopular: true }),
  action: '/billing/subscribe'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
