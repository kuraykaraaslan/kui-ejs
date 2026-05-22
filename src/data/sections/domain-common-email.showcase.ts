import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

// ─── Source files ─────────────────────────────────────────────────────────────

const viewPath = (p: string) => path.join(process.cwd(), 'views/theme/common/email', p);

const welcomeSrc              = fs.readFileSync(viewPath('auth/welcome.ejs'),             'utf-8');
const verifyEmailSrc          = fs.readFileSync(viewPath('auth/verify-email.ejs'),        'utf-8');
const passwordResetSrc        = fs.readFileSync(viewPath('auth/password-reset.ejs'),      'utf-8');
const passwordChangedSrc      = fs.readFileSync(viewPath('auth/password-changed.ejs'),    'utf-8');
const loginAlertSrc           = fs.readFileSync(viewPath('auth/login-alert.ejs'),         'utf-8');
const accountLockedSrc        = fs.readFileSync(viewPath('auth/account-locked.ejs'),      'utf-8');
const orderConfirmationSrc    = fs.readFileSync(viewPath('order/confirmation.ejs'),       'utf-8');
const orderShippedSrc         = fs.readFileSync(viewPath('order/shipped.ejs'),            'utf-8');
const orderDeliveredSrc       = fs.readFileSync(viewPath('order/delivered.ejs'),          'utf-8');
const orderCancelledSrc       = fs.readFileSync(viewPath('order/cancelled.ejs'),          'utf-8');
const refundSrc               = fs.readFileSync(viewPath('order/refund.ejs'),             'utf-8');
const abandonedCartSrc        = fs.readFileSync(viewPath('order/abandoned-cart.ejs'),     'utf-8');
const invoiceSrc              = fs.readFileSync(viewPath('billing/invoice.ejs'),          'utf-8');
const subActivatedSrc         = fs.readFileSync(viewPath('billing/subscription-activated.ejs'),  'utf-8');
const renewalReminderSrc      = fs.readFileSync(viewPath('billing/renewal-reminder.ejs'),        'utf-8');
const subCancelledSrc         = fs.readFileSync(viewPath('billing/subscription-cancelled.ejs'),  'utf-8');
const paymentFailedSrc        = fs.readFileSync(viewPath('billing/payment-failed.ejs'),   'utf-8');
const cardExpiringSrc         = fs.readFileSync(viewPath('billing/card-expiring.ejs'),    'utf-8');
const commentReplySrc         = fs.readFileSync(viewPath('notification/comment-reply.ejs'), 'utf-8');
const mentionSrc              = fs.readFileSync(viewPath('notification/mention.ejs'),     'utf-8');
const newMessageSrc           = fs.readFileSync(viewPath('notification/new-message.ejs'), 'utf-8');
const newsletterSrc           = fs.readFileSync(viewPath('marketing/newsletter.ejs'),     'utf-8');
const promotionalSrc          = fs.readFileSync(viewPath('marketing/promotional.ejs'),    'utf-8');
const productUpdateSrc        = fs.readFileSync(viewPath('marketing/product-update.ejs'), 'utf-8');
const maintenanceSrc          = fs.readFileSync(viewPath('system/maintenance.ejs'),       'utf-8');
const policyUpdateSrc         = fs.readFileSync(viewPath('system/policy-update.ejs'),     'utf-8');
const dataExportSrc           = fs.readFileSync(viewPath('system/data-export.ejs'),       'utf-8');
const accountDeletionSrc      = fs.readFileSync(viewPath('system/account-deletion.ejs'),  'utf-8');
const ticketOpenedSrc         = fs.readFileSync(viewPath('support/ticket-opened.ejs'),    'utf-8');
const ticketReplySrc          = fs.readFileSync(viewPath('support/ticket-reply.ejs'),     'utf-8');
const ticketResolvedSrc       = fs.readFileSync(viewPath('support/ticket-resolved.ejs'),  'utf-8');

// ─── Mini preview helpers ─────────────────────────────────────────────────────

/** Renders a scaled-down email card thumbnail */
function emailCard(opts: {
  headerBg: string;
  headerContent: string;
  body: string;
  liveUrl: string;
}) {
  return `<div class="w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-border shadow-sm text-left">
  <div class="${opts.headerBg} px-5 py-4 text-center">${opts.headerContent}</div>
  <div class="bg-white px-5 py-4 space-y-2">${opts.body}</div>
  <div class="bg-[#f4f5f7] px-5 py-2.5 flex items-center justify-between">
    <p class="text-[10px] text-text-secondary">© 2026 Acme Corp</p>
    <a href="${opts.liveUrl}" target="_blank"
      class="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-medium">
      <i class="fa-solid fa-arrow-up-right-from-square text-[8px]" aria-hidden="true"></i>Live preview
    </a>
  </div>
</div>`;
}

const emailRow = (label: string, value: string) =>
  `<div class="flex justify-between items-center gap-2 text-xs"><span class="text-text-secondary shrink-0">${label}</span><span class="font-medium text-text-primary truncate text-right">${value}</span></div>`;

const emailBadge = (text: string, cls: string) =>
  `<span class="rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}">${text}</span>`;

const emailBtn = (label: string, cls = 'bg-primary text-primary-fg') =>
  `<div class="text-center pt-1"><span class="inline-block rounded-lg px-4 py-1.5 text-xs font-semibold ${cls}">${label}</span></div>`;

const emailHr = () => `<div class="border-t border-border"></div>`;

const emailBodyText = (text: string) =>
  `<p class="text-xs text-text-secondary leading-relaxed">${text}</p>`;

const primaryHeader = (icon: string, title: string, sub?: string) =>
  `<i class="${icon} text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
   <p class="text-primary-fg font-bold text-sm">${title}</p>
   ${sub ? `<p class="text-primary-fg/70 text-[10px] mt-0.5">${sub}</p>` : ''}`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonEmailData(): ShowcaseItem[] {
  return [

    // ── Welcome ───────────────────────────────────────────────────────────────
    {
      id: 'email-welcome',
      title: 'WelcomeEmail',
      category: 'Email',
      abbr: 'We',
      description: 'Welcome email sent after registration. Includes an email verification CTA and a "next steps" list.',
      filePath: 'views/theme/common/email/auth/welcome.ejs',
      sourceCode: welcomeSrc,
      variants: [
        {
          title: 'Welcome Email',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-party-horn', 'Welcome, John Doe! 🎉'),
            body: `
              ${emailBodyText('Thanks for creating an account. Confirm your email to get started.')}
              ${emailBtn('Confirm Email Address')}
              ${emailHr()}
              ${emailBodyText('Link expires in <strong>24 hours</strong>.')}`,
            liveUrl: '/theme/common/email/auth/welcome',
          }),
          code: `// GET /theme/common/email/auth/welcome
res.render('theme/common/email/auth/welcome', {
  layout:    'layouts/blank',
  subject:   'Welcome to Acme Corp! Confirm your email to get started',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  date:      new Date().toLocaleString(),
  company:   { name: 'Acme Corp', address: '123 Main St · San Francisco, CA' },
  confirmUrl: generateConfirmUrl(user.id),
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Verify Email OTP ─────────────────────────────────────────────────────
    {
      id: 'email-verify-otp',
      title: 'VerifyEmailOTP',
      category: 'Email',
      abbr: 'Vo',
      description: '6-digit OTP code. Large mono-font code display and expiry notice.',
      filePath: 'views/theme/common/email/auth/verify-email.ejs',
      sourceCode: verifyEmailSrc,
      variants: [
        {
          title: 'OTP Code Email',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-envelope-circle-check text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">Verify your email</p>`,
            body: `
              ${emailBodyText('Enter this code in the verification screen. Expires in <strong>15 minutes</strong>.')}
              <div class="flex justify-center py-2">
                <div class="bg-surface-overlay border border-border rounded-xl px-6 py-3 text-center">
                  <p class="font-mono text-2xl font-bold tracking-[0.2em] text-text-primary">847 392</p>
                </div>
              </div>
              ${emailBodyText('Didn\'t request this? You can safely ignore this email.')}`,
            liveUrl: '/theme/common/email/auth/verify-email',
          }),
          code: `// GET /theme/common/email/auth/verify-email
res.render('theme/common/email/auth/verify-email', {
  layout:    'layouts/blank',
  subject:   'Your Acme Corp verification code',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  otp:       generateOTP(),      // e.g. '847 392'
  expiresIn: '15 minutes',
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Password Reset ────────────────────────────────────────────────────────
    {
      id: 'email-password-reset',
      title: 'PasswordResetEmail',
      category: 'Email',
      abbr: 'Pr',
      description: 'Password reset link email. Includes an expiry notice and a security note.',
      filePath: 'views/theme/common/email/auth/password-reset.ejs',
      sourceCode: passwordResetSrc,
      variants: [
        {
          title: 'Password Reset',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-lock-open', 'Reset your password'),
            body: `
              ${emailBodyText('Click the button below to choose a new password for your account.')}
              ${emailBtn('Reset Password')}
              <div class="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 flex items-center gap-2 text-xs text-amber-800">
                <i class="fa-solid fa-clock text-amber-500 shrink-0" aria-hidden="true"></i>
                Link expires in <strong>1 hour</strong>.
              </div>`,
            liveUrl: '/theme/common/email/auth/password-reset',
          }),
          code: `// GET /theme/common/email/auth/password-reset
res.render('theme/common/email/auth/password-reset', {
  layout:    'layouts/blank',
  subject:   'Reset your Acme Corp password',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  resetUrl:  generateResetUrl(token),
  expiresIn: '1 hour',
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Password Changed ──────────────────────────────────────────────────────
    {
      id: 'email-password-changed',
      title: 'PasswordChangedEmail',
      category: 'Email',
      abbr: 'Pc',
      description: 'Password change confirmation email. Device, IP, and location info with a "Wasn\'t me" alert.',
      filePath: 'views/theme/common/email/auth/password-changed.ejs',
      sourceCode: passwordChangedSrc,
      variants: [
        {
          title: 'Password Changed',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-shield-check', 'Acme Corp'),
            body: `
              <div class="rounded-lg bg-green-50 border border-green-200 px-3 py-2 flex items-center gap-2">
                <i class="fa-solid fa-shield-check text-green-600 shrink-0" aria-hidden="true"></i>
                <p class="text-xs font-semibold text-green-800">Password updated successfully</p>
              </div>
              ${emailRow('Changed at', 'May 3, 2026 10:23 AM')}
              ${emailRow('Location', 'Istanbul, Turkey')}
              ${emailRow('IP address', '192.168.1.42')}
              <div class="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                <strong>Wasn't you?</strong> Contact support immediately.
              </div>`,
            liveUrl: '/theme/common/email/auth/password-changed',
          }),
          code: `// GET /theme/common/email/auth/password-changed
res.render('theme/common/email/auth/password-changed', {
  layout:     'layouts/blank',
  subject:    'Your password has been changed',
  fromName:   'Acme Corp',
  fromEmail:  'noreply@acme.example.com',
  toName:     user.name,
  toEmail:    user.email,
  company:    { name: 'Acme Corp', address: '...' },
  changedAt:  new Date().toLocaleString(),
  ipAddress:  req.ip,
  location:   resolveLocation(req.ip),
  supportUrl: '/support',
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Login Alert ───────────────────────────────────────────────────────────
    {
      id: 'email-login-alert',
      title: 'LoginAlertEmail',
      category: 'Email',
      abbr: 'La',
      description: 'New device sign-in alert. Device, location, and IP info; "Secure My Account" and "This Was Me" CTA pair.',
      filePath: 'views/theme/common/email/auth/login-alert.ejs',
      sourceCode: loginAlertSrc,
      variants: [
        {
          title: 'New Login Alert',
          previewHtml: emailCard({
            headerBg: 'bg-amber-400',
            headerContent: `<i class="fa-solid fa-triangle-exclamation text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">New sign-in detected</p>`,
            body: `
              ${emailBodyText('A new sign-in to your account was detected.')}
              ${emailRow('Device', 'Chrome on Windows 11')}
              ${emailRow('Location', 'Istanbul, Turkey')}
              ${emailRow('Time', 'May 3, 2026 10:23 AM')}
              <div class="flex gap-2 pt-1">
                <span class="flex-1 text-center rounded-lg bg-red-500 text-white px-3 py-1.5 text-[10px] font-semibold">Secure Account</span>
                <span class="flex-1 text-center rounded-lg border border-border text-text-primary px-3 py-1.5 text-[10px] font-semibold">This Was Me</span>
              </div>`,
            liveUrl: '/theme/common/email/auth/login-alert',
          }),
          code: `// GET /theme/common/email/auth/login-alert
res.render('theme/common/email/auth/login-alert', {
  layout:    'layouts/blank',
  subject:   'New sign-in to your Acme Corp account',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  device:    parseUserAgent(req.headers['user-agent']),
  location:  resolveLocation(req.ip),
  ipAddress: req.ip,
  loginTime: new Date().toLocaleString(),
  secureUrl: '/account/security',
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Account Locked ────────────────────────────────────────────────────────
    {
      id: 'email-account-locked',
      title: 'AccountLockedEmail',
      category: 'Email',
      abbr: 'Al',
      description: 'Account lock email after too many failed sign-in attempts. Unlock time, reason, and "Unlock" / "Support" buttons.',
      filePath: 'views/theme/common/email/auth/account-locked.ejs',
      sourceCode: accountLockedSrc,
      variants: [
        {
          title: 'Account Locked',
          previewHtml: emailCard({
            headerBg: 'bg-red-500',
            headerContent: `<i class="fa-solid fa-lock text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Account temporarily locked</p>`,
            body: `
              ${emailBodyText('Your account has been locked to protect your security.')}
              ${emailRow('Reason', 'Too many failed attempts')}
              ${emailRow('Unlocks at', 'May 3, 2026 11:23 AM')}
              <div class="flex gap-2 pt-1">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-3 py-1.5 text-[10px] font-semibold">Unlock Account</span>
                <span class="flex-1 text-center rounded-lg border border-border text-text-primary px-3 py-1.5 text-[10px] font-semibold">Support</span>
              </div>`,
            liveUrl: '/theme/common/email/auth/account-locked',
          }),
          code: `// GET /theme/common/email/auth/account-locked
res.render('theme/common/email/auth/account-locked', {
  layout:     'layouts/blank',
  subject:    'Your account has been temporarily locked',
  fromName:   'Acme Corp',
  fromEmail:  'noreply@acme.example.com',
  toName:     user.name,
  toEmail:    user.email,
  company:    { name: 'Acme Corp', address: '...' },
  reason:     'Too many failed login attempts',
  unlockAt:   lockExpiry.toLocaleString(),
  unlockUrl:  '/auth/unlock?token=' + token,
  supportUrl: '/support',
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Order Confirmation ────────────────────────────────────────────────────
    {
      id: 'email-order-confirmation',
      title: 'OrderConfirmationEmail',
      category: 'Email',
      abbr: 'Oc',
      description: 'Order confirmation receipt. Line items, subtotal/tax/total, and shipping address.',
      filePath: 'views/theme/common/email/order/confirmation.ejs',
      sourceCode: orderConfirmationSrc,
      variants: [
        {
          title: 'Order Confirmed',
          previewHtml: emailCard({
            headerBg: 'bg-green-500',
            headerContent: `<i class="fa-solid fa-circle-check text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Order Confirmed!</p>
              <p class="text-white/70 text-[10px]">Order #ORD-20260503-001</p>`,
            body: `
              <div class="rounded-lg border border-border divide-y divide-border text-xs">
                <div class="flex justify-between px-3 py-2"><span class="text-text-secondary">Pro Plan — Annual</span><span class="font-semibold">₺999.90</span></div>
                <div class="flex justify-between px-3 py-2"><span class="text-text-secondary">Design System ×2</span><span class="font-semibold">₺300.00</span></div>
                <div class="flex justify-between px-3 py-2 bg-surface-raised"><span class="font-bold">Total</span><span class="font-bold">₺1,533.88</span></div>
              </div>
              ${emailBtn('View Order Details')}`,
            liveUrl: '/theme/common/email/order/confirmation',
          }),
          code: `// GET /theme/common/email/order/confirmation
res.render('theme/common/email/order/confirmation', {
  layout:    'layouts/blank',
  subject:   'Order confirmed — #' + order.id,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:       order.id,
    date:     order.createdAt.toLocaleDateString(),
    items:    order.items,    // [{ name, variant, qty, price }]
    totals:   order.totals,   // { subtotal, discount, tax, shipping, total, currency }
    shipping: order.address,  // { fullName, addressLine1, city, country, postalCode }
    viewUrl:  '/orders/' + order.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Order Shipped ─────────────────────────────────────────────────────────
    {
      id: 'email-order-shipped',
      title: 'OrderShippedEmail',
      category: 'Email',
      abbr: 'Os',
      description: 'Shipping notification. Carrier, tracking number, estimated delivery date, and a "Track My Package" CTA.',
      filePath: 'views/theme/common/email/order/shipped.ejs',
      sourceCode: orderShippedSrc,
      variants: [
        {
          title: 'Order Shipped',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-truck text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">Your order is on its way!</p>
              <p class="text-primary-fg/70 text-[10px]">Order #ORD-20260503-001</p>`,
            body: `
              <div class="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1.5">
                ${emailRow('Carrier', 'FedEx')}
                ${emailRow('Tracking #', 'FX123456789TR')}
                ${emailRow('Estimated delivery', 'May 6–7, 2026')}
              </div>
              ${emailBtn('Track My Package')}`,
            liveUrl: '/theme/common/email/order/shipped',
          }),
          code: `// GET /theme/common/email/order/shipped
res.render('theme/common/email/order/shipped', {
  layout:    'layouts/blank',
  subject:   'Your order #' + order.id + ' has shipped!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:                order.id,
    carrier:           shipment.carrier,
    trackingNumber:    shipment.trackingNumber,
    trackingUrl:       shipment.trackingUrl,
    estimatedDelivery: shipment.estimatedDelivery,
    items:             order.items,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Order Delivered ───────────────────────────────────────────────────────
    {
      id: 'email-order-delivered',
      title: 'OrderDeliveredEmail',
      category: 'Email',
      abbr: 'Od',
      description: 'Delivery confirmation. Star-rating buttons with a review request CTA.',
      filePath: 'views/theme/common/email/order/delivered.ejs',
      sourceCode: orderDeliveredSrc,
      variants: [
        {
          title: 'Order Delivered',
          previewHtml: emailCard({
            headerBg: 'bg-green-500',
            headerContent: `<i class="fa-solid fa-house text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Delivered!</p>
              <p class="text-white/70 text-[10px]">Order #ORD-20260503-001</p>`,
            body: `
              ${emailBodyText('Your package was delivered on <strong>May 6, 2026 at 2:34 PM</strong>.')}
              <div class="rounded-lg bg-surface-raised border border-border p-3 text-center space-y-2">
                <p class="text-xs font-semibold text-text-primary">How was your experience?</p>
                <div class="flex justify-center gap-1 text-sm">⭐⭐⭐⭐⭐</div>
              </div>
              <div class="flex gap-2">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-2 py-1.5 text-[10px] font-semibold">Write a Review</span>
                <span class="flex-1 text-center rounded-lg border border-border px-2 py-1.5 text-[10px] font-semibold">View Order</span>
              </div>`,
            liveUrl: '/theme/common/email/order/delivered',
          }),
          code: `// GET /theme/common/email/order/delivered
res.render('theme/common/email/order/delivered', {
  layout:    'layouts/blank',
  subject:   'Your order has been delivered!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:          order.id,
    deliveredAt: delivery.timestamp.toLocaleString(),
    items:       order.items,
    reviewUrl:   '/orders/' + order.id + '/review',
    viewUrl:     '/orders/' + order.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Order Cancelled ───────────────────────────────────────────────────────
    {
      id: 'email-order-cancelled',
      title: 'OrderCancelledEmail',
      category: 'Email',
      abbr: 'Ox',
      description: 'Order cancellation notice. Cancellation reason, struck-through items, and refund window.',
      filePath: 'views/theme/common/email/order/cancelled.ejs',
      sourceCode: orderCancelledSrc,
      variants: [
        {
          title: 'Order Cancelled',
          previewHtml: emailCard({
            headerBg: 'bg-surface-sunken',
            headerContent: `<i class="fa-solid fa-xmark text-text-secondary text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-text-primary font-bold text-sm">Order Cancelled</p>
              <p class="text-text-secondary text-[10px]">Order #ORD-20260503-001</p>`,
            body: `
              <div class="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs">
                <span class="text-text-secondary">Reason: </span>
                <span class="font-medium">Requested by customer</span>
              </div>
              <div class="rounded-lg border border-border divide-y text-xs">
                <div class="px-3 py-2 line-through text-text-secondary">Pro Plan — Annual  ×1</div>
                <div class="px-3 py-2 line-through text-text-secondary">Design System ×2</div>
              </div>
              <div class="rounded-lg bg-cyan-50 border border-cyan-200 px-3 py-2 text-xs text-cyan-800">
                Refund of <strong>₺1,533.88</strong> in 3–5 business days.
              </div>`,
            liveUrl: '/theme/common/email/order/cancelled',
          }),
          code: `// GET /theme/common/email/order/cancelled
res.render('theme/common/email/order/cancelled', {
  layout:    'layouts/blank',
  subject:   'Your order #' + order.id + ' has been cancelled',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:           order.id,
    reason:       cancellation.reason,
    items:        order.items,
    refundAmount: order.total,
    refundDays:   '3–5 business days',
    currency:     order.currency,
    shopUrl:      '/shop',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Refund ────────────────────────────────────────────────────────────────
    {
      id: 'email-refund',
      title: 'RefundEmail',
      category: 'Email',
      abbr: 'Rf',
      description: 'Refund processed notice. Amount hero, refund method, and estimated arrival window.',
      filePath: 'views/theme/common/email/order/refund.ejs',
      sourceCode: refundSrc,
      variants: [
        {
          title: 'Refund Processed',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-rotate-left', 'Acme Corp'),
            body: `
              <div class="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center space-y-0.5">
                <i class="fa-solid fa-rotate-left text-green-600 text-lg" aria-hidden="true"></i>
                <p class="text-2xl font-bold text-text-primary">₺299.90</p>
                <p class="text-[10px] text-text-secondary">Refund processed</p>
              </div>
              ${emailRow('Refunded to', 'Visa ••••4242')}
              ${emailRow('Expected arrival', '3–5 business days')}
              ${emailBtn('View Order', 'border border-border text-text-primary bg-white')}`,
            liveUrl: '/theme/common/email/order/refund',
          }),
          code: `// GET /theme/common/email/order/refund
res.render('theme/common/email/order/refund', {
  layout:    'layouts/blank',
  subject:   'Your refund of ₺' + refund.amount + ' has been processed',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  refund: {
    id:          refund.id,
    orderId:     order.id,
    amount:      refund.amount,
    currency:    refund.currency,
    method:      paymentMethod.display,  // 'Visa ••••4242'
    processedAt: new Date().toLocaleDateString(),
    arrivalDays: '3–5 business days',
    viewUrl:     '/orders/' + order.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Abandoned Cart ────────────────────────────────────────────────────────
    {
      id: 'email-abandoned-cart',
      title: 'AbandonedCartEmail',
      category: 'Email',
      abbr: 'Ac',
      description: 'Abandoned cart re-engagement email. Coupon code, discount offer, and cart contents.',
      filePath: 'views/theme/common/email/order/abandoned-cart.ejs',
      sourceCode: abandonedCartSrc,
      variants: [
        {
          title: 'Abandoned Cart',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-cart-shopping text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">You left something behind</p>
              <p class="text-primary-fg/70 text-[10px]">Your cart expires May 5, 2026</p>`,
            body: `
              ${emailRow('Pro Plan — Annual', '₺999.90')}
              ${emailRow('Design System Add-on ×2', '₺300.00')}
              ${emailHr()}
              <div class="rounded-lg bg-amber-50 border-2 border-dashed border-amber-400 px-4 py-2 text-center space-y-0.5">
                <p class="text-[10px] text-text-secondary">Use code for 10% off:</p>
                <p class="font-mono text-sm font-bold text-amber-700 tracking-widest">COMEBACK10</p>
              </div>
              ${emailBtn('Complete My Purchase')}`,
            liveUrl: '/theme/common/email/order/abandoned-cart',
          }),
          code: `// GET /theme/common/email/order/abandoned-cart
res.render('theme/common/email/order/abandoned-cart', {
  layout:    'layouts/blank',
  subject:   'You left something behind…',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  cart: {
    items:       cart.items,
    total:       cart.subtotal,
    currency:    cart.currency,
    couponCode:  'COMEBACK10',
    couponPct:   10,
    expiresAt:   expiryDate.toLocaleDateString(),
    resumeUrl:   '/cart?token=' + cart.token,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Invoice ───────────────────────────────────────────────────────────────
    {
      id: 'email-invoice',
      title: 'InvoiceEmail',
      category: 'Email',
      abbr: 'Iv',
      description: 'Itemized invoice. Status badge, all line items and totals, PDF download CTA.',
      filePath: 'views/theme/common/email/billing/invoice.ejs',
      sourceCode: invoiceSrc,
      variants: [
        {
          title: 'Invoice — PAID',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<div class="flex items-start justify-between w-full">
              <div class="text-left">
                <p class="text-primary-fg font-bold text-sm">Acme Corp</p>
                <p class="text-primary-fg/70 text-[10px]">123 Main St · SF, CA</p>
              </div>
              <span class="rounded-md bg-green-500/30 border border-green-300 text-white text-[9px] font-bold px-2 py-0.5 uppercase">PAID</span>
            </div>
            <div class="text-left mt-3">
              <p class="text-primary-fg/60 text-[9px] uppercase tracking-wide">Invoice</p>
              <p class="text-primary-fg font-mono font-bold text-xs">INV-2026-0042</p>
            </div>`,
            body: `
              ${emailRow('Issue Date', 'May 3, 2026')}
              ${emailRow('Due Date', 'May 17, 2026')}
              <div class="rounded-lg border border-border divide-y text-xs">
                <div class="flex justify-between px-3 py-1.5"><span class="text-text-secondary">Pro Plan</span><span class="font-semibold">₺999.90</span></div>
                <div class="flex justify-between px-3 py-1.5"><span class="text-text-secondary">Design System ×2</span><span class="font-semibold">₺300.00</span></div>
                <div class="flex justify-between px-3 py-1.5 font-bold bg-surface-raised"><span>Total</span><span>₺1,533.88</span></div>
              </div>
              ${emailBtn('Download PDF Invoice')}`,
            liveUrl: '/theme/common/email/billing/invoice',
          }),
          code: `// GET /theme/common/email/billing/invoice
res.render('theme/common/email/billing/invoice', {
  layout:    'layouts/blank',
  subject:   'Invoice #' + invoice.id + ' from Acme Corp',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  invoice: {
    id:          invoice.id,
    date:        invoice.createdAt.toLocaleDateString(),
    dueDate:     invoice.dueDate.toLocaleDateString(),
    status:      invoice.status,     // 'PAID' | 'PENDING' | 'OVERDUE'
    items:       invoice.lineItems,  // [{ name, variant, qty, price }]
    totals:      invoice.totals,
    downloadUrl: '/invoices/' + invoice.id + '/pdf',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Subscription Activated ────────────────────────────────────────────────
    {
      id: 'email-subscription-activated',
      title: 'SubscriptionActivatedEmail',
      category: 'Email',
      abbr: 'Sa',
      description: 'Plan activation confirmation. Feature list, price, and next billing date.',
      filePath: 'views/theme/common/email/billing/subscription-activated.ejs',
      sourceCode: subActivatedSrc,
      variants: [
        {
          title: 'Subscription Activated',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-sparkles text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">You're on Pro Plan!</p>
              <p class="text-primary-fg/70 text-[10px]">Subscription active</p>`,
            body: `
              <div class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 flex justify-between">
                <span class="text-xs font-bold text-text-primary">Pro Plan</span>
                <span class="text-xs font-bold text-primary">₺999.90 / year</span>
              </div>
              ${emailRow('Next billing', 'May 3, 2027')}
              <div class="space-y-1 text-xs">
                ${['Unlimited projects', 'Priority support', 'Advanced analytics'].map(f =>
                  `<div class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-green-500 text-[10px]" aria-hidden="true"></i><span class="text-text-secondary">${f}</span></div>`).join('')}
              </div>
              ${emailBtn('Manage Subscription')}`,
            liveUrl: '/theme/common/email/billing/subscription-activated',
          }),
          code: `// GET /theme/common/email/billing/subscription-activated
res.render('theme/common/email/billing/subscription-activated', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' subscription is now active!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:            plan.name,
    price:           plan.price,
    currency:        plan.currency,
    interval:        plan.billingInterval,  // 'month' | 'year'
    nextBillingDate: subscription.nextBillingDate.toLocaleDateString(),
    features:        plan.features,
    manageUrl:       '/account/subscription',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Renewal Reminder ──────────────────────────────────────────────────────
    {
      id: 'email-renewal-reminder',
      title: 'RenewalReminderEmail',
      category: 'Email',
      abbr: 'Rr',
      description: '7-day advance renewal reminder. Payment method, amount, and manage/cancel links.',
      filePath: 'views/theme/common/email/billing/renewal-reminder.ejs',
      sourceCode: renewalReminderSrc,
      variants: [
        {
          title: 'Renewal Reminder',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-bell', 'Acme Corp'),
            body: `
              <div class="rounded-lg bg-cyan-50 border border-cyan-200 px-3 py-2 flex items-center gap-2 text-xs text-cyan-800">
                <i class="fa-solid fa-bell text-cyan-500 shrink-0" aria-hidden="true"></i>
                <span class="font-semibold">Your subscription renews in 7 days</span>
              </div>
              ${emailRow('Plan', 'Pro Plan')}
              ${emailRow('Renewal date', 'May 10, 2026')}
              ${emailRow('Amount', '₺999.90')}
              ${emailRow('Payment method', 'Visa ••••4242')}
              <div class="flex gap-2 pt-1">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-2 py-1.5 text-[10px] font-semibold">Manage</span>
                <span class="flex-1 text-center rounded-lg border border-border text-text-secondary px-2 py-1.5 text-[10px]">Cancel</span>
              </div>`,
            liveUrl: '/theme/common/email/billing/renewal-reminder',
          }),
          code: `// GET /theme/common/email/billing/renewal-reminder
res.render('theme/common/email/billing/renewal-reminder', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' renews in 7 days',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:          subscription.planName,
    renewalDate:   subscription.nextBillingDate.toLocaleDateString(),
    amount:        subscription.amount,
    currency:      subscription.currency,
    paymentMethod: paymentMethod.display,
    manageUrl:     '/account/subscription',
    cancelUrl:     '/account/subscription/cancel',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Subscription Cancelled ────────────────────────────────────────────────
    {
      id: 'email-subscription-cancelled',
      title: 'SubscriptionCancelledEmail',
      category: 'Email',
      abbr: 'Sc',
      description: 'Subscription cancellation. Access end date, reactivation CTA, and feedback link.',
      filePath: 'views/theme/common/email/billing/subscription-cancelled.ejs',
      sourceCode: subCancelledSrc,
      variants: [
        {
          title: 'Subscription Cancelled',
          previewHtml: emailCard({
            headerBg: 'bg-surface-sunken',
            headerContent: `<i class="fa-solid fa-circle-minus text-text-secondary text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-text-primary font-bold text-sm">Subscription Cancelled</p>
              <p class="text-text-secondary text-[10px]">Pro Plan</p>`,
            body: `
              <div class="rounded-lg bg-cyan-50 border border-cyan-200 px-3 py-2 text-xs text-cyan-800">
                Access until <strong>May 10, 2026</strong>, then reverts to Free.
              </div>
              ${emailRow('Cancelled on', 'May 3, 2026')}
              <div class="rounded-lg bg-surface-raised border border-border px-3 py-2 text-center space-y-1.5">
                <p class="text-xs font-semibold">Changed your mind?</p>
                ${emailBtn('Reactivate Subscription')}
              </div>`,
            liveUrl: '/theme/common/email/billing/subscription-cancelled',
          }),
          code: `// GET /theme/common/email/billing/subscription-cancelled
res.render('theme/common/email/billing/subscription-cancelled', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' subscription has been cancelled',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:          subscription.planName,
    cancelledAt:   new Date().toLocaleDateString(),
    accessUntil:   subscription.currentPeriodEnd.toLocaleDateString(),
    reactivateUrl: '/account/subscription/reactivate',
    feedbackUrl:   '/feedback/cancellation',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Payment Failed ────────────────────────────────────────────────────────
    {
      id: 'email-payment-failed',
      title: 'PaymentFailedEmail',
      category: 'Email',
      abbr: 'Pf',
      description: 'Payment failed notice. Failure reason, retry date, and an update-payment-method CTA.',
      filePath: 'views/theme/common/email/billing/payment-failed.ejs',
      sourceCode: paymentFailedSrc,
      variants: [
        {
          title: 'Payment Failed',
          previewHtml: emailCard({
            headerBg: 'bg-red-500',
            headerContent: `<i class="fa-solid fa-circle-exclamation text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Payment Failed</p>
              <p class="text-white/70 text-[10px]">₺999.90 could not be processed</p>`,
            body: `
              ${emailRow('Amount', '₺999.90')}
              ${emailRow('Failure reason', 'Insufficient funds')}
              ${emailRow('Next retry', 'May 10, 2026')}
              <div class="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                <i class="fa-solid fa-clock text-amber-500 shrink-0 mt-0.5" aria-hidden="true"></i>
                Resolve by <strong>May 10</strong> to avoid service interruption.
              </div>
              ${emailBtn('Update Payment Method', 'bg-red-500 text-white')}`,
            liveUrl: '/theme/common/email/billing/payment-failed',
          }),
          code: `// GET /theme/common/email/billing/payment-failed
res.render('theme/common/email/billing/payment-failed', {
  layout:    'layouts/blank',
  subject:   "We couldn't process your payment",
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  payment: {
    amount:      charge.amount,
    currency:    charge.currency,
    attemptedAt: charge.createdAt.toLocaleString(),
    failReason:  charge.failureMessage,
    retryDate:   nextRetry.toLocaleDateString(),
    updateUrl:   '/account/payment-methods',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Card Expiring ─────────────────────────────────────────────────────────
    {
      id: 'email-card-expiring',
      title: 'CardExpiringEmail',
      category: 'Email',
      abbr: 'Ce',
      description: 'Card expiration warning. Card visual, plan/billing info, and an update CTA.',
      filePath: 'views/theme/common/email/billing/card-expiring.ejs',
      sourceCode: cardExpiringSrc,
      variants: [
        {
          title: 'Card Expiring Soon',
          previewHtml: emailCard({
            headerBg: 'bg-amber-400',
            headerContent: `<i class="fa-solid fa-credit-card text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Your card is expiring soon</p>
              <p class="text-white/80 text-[10px]">Visa ••••4242 expires 06/26</p>`,
            body: `
              <div class="rounded-xl bg-gradient-to-br from-gray-800 to-gray-600 p-3 text-white space-y-1.5">
                <div class="flex justify-between items-center">
                  <p class="text-[9px] font-medium opacity-70 uppercase tracking-wider">Visa</p>
                  <i class="fa-solid fa-credit-card opacity-60 text-xs" aria-hidden="true"></i>
                </div>
                <p class="font-mono text-xs tracking-widest">•••• •••• •••• 4242</p>
                <p class="font-mono text-[10px] font-semibold text-amber-300">Expires 06/26</p>
              </div>
              ${emailBodyText('Used for <strong>Pro Plan</strong>, renews May 10, 2026.')}
              ${emailBtn('Update Payment Method')}`,
            liveUrl: '/theme/common/email/billing/card-expiring',
          }),
          code: `// GET /theme/common/email/billing/card-expiring
res.render('theme/common/email/billing/card-expiring', {
  layout:    'layouts/blank',
  subject:   'Your ' + card.brand + ' ••••' + card.last4 + ' expires next month',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  card: {
    last4:       card.last4,
    brand:       card.brand,
    expiryMonth: card.expMonth.toString().padStart(2, '0'),
    expiryYear:  card.expYear.toString().slice(-2),
    updateUrl:   '/account/payment-methods',
  },
  plan: {
    name:            subscription.planName,
    nextBillingDate: subscription.nextBillingDate.toLocaleDateString(),
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Comment Reply ─────────────────────────────────────────────────────────
    {
      id: 'email-comment-reply',
      title: 'CommentReplyEmail',
      category: 'Email',
      abbr: 'Cr',
      description: 'Comment reply notification. Original comment + new reply in a thread view.',
      filePath: 'views/theme/common/email/notification/comment-reply.ejs',
      sourceCode: commentReplySrc,
      variants: [
        {
          title: 'Comment Reply',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-comment', 'Acme Corp'),
            body: `
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-bold text-xs">S</div>
                <div class="text-xs"><span class="text-primary font-semibold">Sarah Chen</span> <span class="text-text-secondary">replied to your comment</span></div>
              </div>
              <div class="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs text-text-secondary">Great article! The atomic design section was helpful…</div>
              <div class="ml-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-text-primary">Thanks John! The atomic approach really does scale well.</div>
              ${emailBtn('View Discussion')}`,
            liveUrl: '/theme/common/email/notification/comment-reply',
          }),
          code: `// GET /theme/common/email/notification/comment-reply
res.render('theme/common/email/notification/comment-reply', {
  layout:    'layouts/blank',
  subject:   reply.authorName + ' replied to your comment',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    originalComment.authorName,
  toEmail:   originalComment.authorEmail,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    senderName:  reply.authorName,
    postTitle:   post.title,
    postUrl:     '/posts/' + post.slug,
    yourComment: originalComment.body,
    replyText:   reply.body,
    viewUrl:     '/posts/' + post.slug + '#comment-' + reply.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Mention ───────────────────────────────────────────────────────────────
    {
      id: 'email-mention',
      title: 'MentionEmail',
      category: 'Email',
      abbr: 'Mn',
      description: '@mention notification. Mentioner, context, and quoted excerpt display.',
      filePath: 'views/theme/common/email/notification/mention.ejs',
      sourceCode: mentionSrc,
      variants: [
        {
          title: 'Mention Notification',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-at', 'Acme Corp'),
            body: `
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-white font-bold text-xs">A</div>
                <div class="text-xs"><span class="text-primary font-semibold">Alex Rivera</span> <span class="text-text-secondary">mentioned you in a comment</span></div>
              </div>
              <div class="rounded-lg border border-border bg-surface-raised px-3 py-3">
                <p class="text-[10px] text-text-secondary mb-1">Excerpt</p>
                <p class="text-xs text-text-primary italic">…I think <strong>@johndoe</strong> had a great solution to this problem…</p>
              </div>
              ${emailBtn('See the Mention')}`,
            liveUrl: '/theme/common/email/notification/mention',
          }),
          code: `// GET /theme/common/email/notification/mention
res.render('theme/common/email/notification/mention', {
  layout:    'layouts/blank',
  subject:   mention.authorName + ' mentioned you in a comment',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    mentionedUser.name,
  toEmail:   mentionedUser.email,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    mentionerName: mention.authorName,
    context:       'mentioned you in a comment on "' + post.title + '"',
    excerpt:       buildExcerptAround(mention, comment.body),
    viewUrl:       '/posts/' + post.slug + '#comment-' + comment.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── New Message ───────────────────────────────────────────────────────────
    {
      id: 'email-new-message',
      title: 'NewMessageEmail',
      category: 'Email',
      abbr: 'Nm',
      description: 'Inbox message notification. Sender, message preview, and Reply/Inbox CTA pair.',
      filePath: 'views/theme/common/email/notification/new-message.ejs',
      sourceCode: newMessageSrc,
      variants: [
        {
          title: 'New Message',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-envelope', 'Acme Corp'),
            body: `
              <div class="rounded-lg border border-border overflow-hidden">
                <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-white">
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-bold text-[10px]">M</div>
                  <div><p class="text-xs font-semibold">Maria Santos</p><p class="text-[10px] text-text-secondary">May 3 · 9:45 AM</p></div>
                </div>
                <div class="px-3 py-2 bg-surface-raised">
                  <p class="text-xs text-text-secondary">Hi John! I wanted to follow up on our conversation about the design system…</p>
                </div>
              </div>
              <div class="flex gap-2">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-2 py-1.5 text-[10px] font-semibold">Reply</span>
                <span class="flex-1 text-center rounded-lg border border-border px-2 py-1.5 text-[10px] font-semibold">Inbox</span>
              </div>`,
            liveUrl: '/theme/common/email/notification/new-message',
          }),
          code: `// GET /theme/common/email/notification/new-message
res.render('theme/common/email/notification/new-message', {
  layout:    'layouts/blank',
  subject:   'You have a new message from ' + sender.name,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    recipient.name,
  toEmail:   recipient.email,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    senderName:   sender.name,
    messageCount: unreadCount,
    preview:      message.body.slice(0, 120) + '…',
    sentAt:       message.createdAt.toLocaleString(),
    replyUrl:     '/messages/' + thread.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Newsletter ────────────────────────────────────────────────────────────
    {
      id: 'email-newsletter',
      title: 'NewsletterEmail',
      category: 'Email',
      abbr: 'Nl',
      description: 'Weekly newsletter. Article cards, tag colors, and reading time.',
      filePath: 'views/theme/common/email/marketing/newsletter.ejs',
      sourceCode: newsletterSrc,
      variants: [
        {
          title: 'Weekly Newsletter',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<div class="flex items-start justify-between w-full">
              <div class="text-left"><p class="text-primary-fg font-bold text-sm">Acme Corp</p><p class="text-primary-fg/80 text-[10px]">Weekly Newsletter</p></div>
              <div class="text-right"><p class="text-primary-fg/70 text-[9px]">Issue #42</p><p class="text-primary-fg/70 text-[9px]">May 3, 2026</p></div>
            </div>`,
            body: `
              ${['Design', 'Dev Tools', 'Community'].map((tag, i) => {
                const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700'];
                const titles = ['The Future of Adaptive Interfaces', 'Tailwind CSS v4 Deep Dive', 'Open Source Design Systems'];
                return `<div class="rounded-lg border border-border bg-surface-raised p-2.5 space-y-1">
                  <div class="flex justify-between">
                    <span class="rounded-full px-2 py-0.5 text-[9px] font-medium ${colors[i]}">${tag}</span>
                    <span class="text-[9px] text-text-secondary">${[5,8,6][i]} min</span>
                  </div>
                  <p class="text-xs font-semibold text-text-primary">${titles[i]}</p>
                </div>`;
              }).join('')}`,
            liveUrl: '/theme/common/email/marketing/newsletter',
          }),
          code: `// GET /theme/common/email/marketing/newsletter
res.render('theme/common/email/marketing/newsletter', {
  layout:    'layouts/blank',
  subject:   'Acme Weekly — Issue #' + newsletter.issue,
  fromName:  'Acme Corp',
  fromEmail: 'hello@acme.example.com',
  toName:    subscriber.name,
  toEmail:   subscriber.email,
  company:   { name: 'Acme Corp', address: '...' },
  newsletter: {
    issue:    newsletter.issueNumber,
    date:     newsletter.publishedAt.toLocaleDateString(),
    intro:    newsletter.intro,
    articles: newsletter.articles.map(a => ({
      tag:      a.category,
      title:    a.title,
      summary:  a.excerpt,
      url:      '/blog/' + a.slug,
      readTime: a.readingTime + ' min',
    })),
    ctaUrl: '/blog',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Promotional ───────────────────────────────────────────────────────────
    {
      id: 'email-promotional',
      title: 'PromotionalEmail',
      category: 'Email',
      abbr: 'Ep',
      description: 'Limited-time promotion. Gradient header, price comparison, dashed-border coupon code.',
      filePath: 'views/theme/common/email/marketing/promotional.ejs',
      sourceCode: promotionalSrc,
      variants: [
        {
          title: 'Promotional Offer',
          previewHtml: emailCard({
            headerBg: '',
            headerContent: ``,
            body: ``,
            liveUrl: '/theme/common/email/marketing/promotional',
          }).replace(
            '<div class=" px-5 py-4 text-center"></div>',
            `<div class="px-5 py-6 text-center" style="background:linear-gradient(135deg,var(--primary),var(--secondary))">
              <span class="inline-block bg-white/20 rounded-full px-3 py-0.5 text-white text-[9px] font-semibold mb-2 uppercase tracking-wide">Limited Time</span>
              <p class="text-white font-black text-3xl mb-1">50% OFF</p>
              <p class="text-white/80 text-xs">This weekend only — upgrade and save</p>
            </div>
            <div class="bg-white px-5 py-4 space-y-2">
              <div class="flex items-center justify-center gap-4 text-center">
                <div><p class="text-[10px] text-text-secondary">Regular</p><p class="text-lg font-bold text-text-secondary line-through">₺999.90</p></div>
                <span class="text-text-secondary">→</span>
                <div><p class="text-[10px] text-text-secondary">Your price</p><p class="text-lg font-bold text-green-600">₺499.95</p></div>
              </div>
              <div class="rounded-lg bg-blue-50 border-2 border-dashed border-primary px-4 py-2 text-center">
                <p class="font-mono text-sm font-bold text-primary tracking-widest">WEEKEND50</p>
                <p class="text-[9px] text-text-secondary">Valid until May 5, 2026 at 11:59 PM</p>
              </div>
              ${emailBtn('Claim My Discount', 'text-white')} </div>`
          ),
          code: `// GET /theme/common/email/marketing/promotional
res.render('theme/common/email/marketing/promotional', {
  layout:    'layouts/blank',
  subject:   promo.discountPct + '% off ' + plan.name + ' — This weekend only',
  fromName:  'Acme Corp',
  fromEmail: 'deals@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  promo: {
    headline:         promo.headline,
    subheadline:      promo.subheadline,
    discountPct:      promo.discountPercent,
    code:             promo.couponCode,
    validUntil:       promo.expiresAt.toLocaleString(),
    originalPrice:    plan.price,
    discountedPrice:  plan.price * (1 - promo.discountPercent / 100),
    currency:         plan.currency,
    shopUrl:          '/pricing',
    features:         plan.features,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Product Update ────────────────────────────────────────────────────────
    {
      id: 'email-product-update',
      title: 'ProductUpdateEmail',
      category: 'Email',
      abbr: 'Pu',
      description: 'Product release announcement. Version badge, highlighted change cards, and changelog link.',
      filePath: 'views/theme/common/email/marketing/product-update.ejs',
      sourceCode: productUpdateSrc,
      variants: [
        {
          title: 'Product Update',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<div class="flex items-start justify-between w-full">
              <div class="text-left"><p class="text-primary-fg font-bold text-sm">Acme Corp</p><p class="text-primary-fg/80 text-[10px]">Product Update</p></div>
              <span class="bg-white/20 text-primary-fg text-[9px] font-bold rounded-full px-2 py-0.5">v2.4</span>
            </div>
            <p class="text-primary-fg font-bold text-base mt-3 text-left">We shipped something big 🚀</p>`,
            body: `
              ${[
                { icon: 'fa-solid fa-bolt',        title: '3× Faster Performance' },
                { icon: 'fa-solid fa-paint-brush', title: 'New Design System' },
                { icon: 'fa-solid fa-plug',        title: 'New Integrations' },
              ].map(h => `<div class="flex items-center gap-3 rounded-lg border border-border bg-surface-raised p-2.5">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary text-xs"><i class="${h.icon}" aria-hidden="true"></i></span>
                <p class="text-xs font-semibold text-text-primary">${h.title}</p>
              </div>`).join('')}
              <div class="flex gap-2">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-2 py-1.5 text-[10px] font-semibold">What's New</span>
                <span class="flex-1 text-center rounded-lg border border-border px-2 py-1.5 text-[10px] font-semibold">Changelog</span>
              </div>`,
            liveUrl: '/theme/common/email/marketing/product-update',
          }),
          code: `// GET /theme/common/email/marketing/product-update
res.render('theme/common/email/marketing/product-update', {
  layout:    'layouts/blank',
  subject:   "What's new in Acme Corp v" + release.version,
  fromName:  'Acme Corp',
  fromEmail: 'updates@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  update: {
    version:      release.version,
    date:         release.releasedAt.toLocaleDateString(),
    intro:        release.intro,
    highlights:   release.highlights.map(h => ({
      icon:        h.icon,
      title:       h.title,
      description: h.summary,
    })),
    changelogUrl: '/changelog',
    learnMoreUrl: '/blog/v' + release.version,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Maintenance ───────────────────────────────────────────────────────────
    {
      id: 'email-maintenance',
      title: 'MaintenanceEmail',
      category: 'Email',
      abbr: 'Me',
      description: 'Advance notice before scheduled maintenance. Time window, affected services, and status page link.',
      filePath: 'views/theme/common/email/system/maintenance.ejs',
      sourceCode: maintenanceSrc,
      variants: [
        {
          title: 'Scheduled Maintenance',
          previewHtml: emailCard({
            headerBg: 'bg-amber-400',
            headerContent: `<i class="fa-solid fa-screwdriver-wrench text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Scheduled Maintenance</p>
              <p class="text-white/80 text-[10px]">Advance notice — no action required</p>`,
            body: `
              ${emailRow('Start', 'May 10 at 2:00 AM UTC')}
              ${emailRow('End', 'May 10 at 6:00 AM UTC')}
              ${emailRow('Duration', '~4 hours')}
              <div class="space-y-1 text-xs">
                <p class="font-semibold text-text-primary">Affected services:</p>
                ${['Web application', 'API access', 'File uploads'].map(s =>
                  `<div class="flex items-center gap-2"><i class="fa-solid fa-circle text-amber-400 text-[8px]" aria-hidden="true"></i><span class="text-text-secondary">${s}</span></div>`).join('')}
              </div>`,
            liveUrl: '/theme/common/email/system/maintenance',
          }),
          code: `// GET /theme/common/email/system/maintenance
res.render('theme/common/email/system/maintenance', {
  layout:    'layouts/blank',
  subject:   'Scheduled maintenance on ' + maintenance.date,
  fromName:  'Acme Corp',
  fromEmail: 'status@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  maintenance: {
    startTime: maintenance.startAt.toUTCString(),
    endTime:   maintenance.endAt.toUTCString(),
    duration:  maintenance.durationLabel,
    reason:    maintenance.reason,
    affected:  maintenance.affectedServices,
    statusUrl: 'https://status.acme.example.com',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Policy Update ─────────────────────────────────────────────────────────
    {
      id: 'email-policy-update',
      title: 'PolicyUpdateEmail',
      category: 'Email',
      abbr: 'Pl',
      description: 'Privacy policy / terms of service update. Point-by-point summary and effective date.',
      filePath: 'views/theme/common/email/system/policy-update.ejs',
      sourceCode: policyUpdateSrc,
      variants: [
        {
          title: 'Privacy Policy Update',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: primaryHeader('fa-solid fa-file-lines', 'Acme Corp'),
            body: `
              ${emailBodyText('Updates to our <strong>Privacy Policy</strong> take effect <strong>June 1, 2026</strong>.')}
              <div class="space-y-1.5 text-xs">
                ${[
                  'More granular data sharing preferences.',
                  'Clarified third-party analytics handling.',
                  'Added right to data portability.',
                  'Updated retention periods.',
                ].map(p => `<div class="flex items-start gap-2"><span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary text-[8px] mt-0.5 font-bold">✓</span><p class="text-text-secondary">${p}</p></div>`).join('')}
              </div>
              ${emailBtn('Read the Full Policy')}`,
            liveUrl: '/theme/common/email/system/policy-update',
          }),
          code: `// GET /theme/common/email/system/policy-update
res.render('theme/common/email/system/policy-update', {
  layout:    'layouts/blank',
  subject:   'Important updates to our ' + update.type,
  fromName:  'Acme Corp',
  fromEmail: 'legal@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  update: {
    type:          'Privacy Policy',   // or 'Terms of Service'
    effectiveDate: policy.effectiveDate.toLocaleDateString(),
    summaryPoints: policy.changes.map(c => c.summary),
    viewUrl:       '/legal/privacy',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Data Export ───────────────────────────────────────────────────────────
    {
      id: 'email-data-export',
      title: 'DataExportEmail',
      category: 'Email',
      abbr: 'De',
      description: 'Data export ready notice. File size, format, expiration date, and download CTA.',
      filePath: 'views/theme/common/email/system/data-export.ejs',
      sourceCode: dataExportSrc,
      variants: [
        {
          title: 'Data Export Ready',
          previewHtml: emailCard({
            headerBg: 'bg-green-500',
            headerContent: `<i class="fa-solid fa-download text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Your export is ready!</p>`,
            body: `
              ${emailRow('File size', '2.4 MB')}
              ${emailRow('Format', 'ZIP (JSON + CSV)')}
              ${emailRow('Requested', 'May 3, 2026 9:00 AM')}
              ${emailRow('Link expires', 'May 10, 2026')}
              ${emailBtn('Download Your Data')}
              ${emailBodyText('Keep this file secure — it contains your personal data.')}`,
            liveUrl: '/theme/common/email/system/data-export',
          }),
          code: `// GET /theme/common/email/system/data-export
res.render('theme/common/email/system/data-export', {
  layout:    'layouts/blank',
  subject:   'Your data export is ready to download',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  export: {
    requestedAt: exportJob.requestedAt.toLocaleString(),
    readyAt:     exportJob.completedAt.toLocaleString(),
    fileSize:    formatBytes(exportJob.fileSizeBytes),
    format:      'ZIP (JSON + CSV)',
    downloadUrl: exportJob.signedDownloadUrl,   // time-limited signed URL
    expiresAt:   exportJob.expiresAt.toLocaleDateString(),
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Account Deletion ──────────────────────────────────────────────────────
    {
      id: 'email-account-deletion',
      title: 'AccountDeletionEmail',
      category: 'Email',
      abbr: 'Ad',
      description: 'Account deletion scheduled notice. Grace period, permanent deletion warning, and a cancel CTA.',
      filePath: 'views/theme/common/email/system/account-deletion.ejs',
      sourceCode: accountDeletionSrc,
      variants: [
        {
          title: 'Account Deletion Scheduled',
          previewHtml: emailCard({
            headerBg: 'bg-red-500',
            headerContent: `<i class="fa-solid fa-trash text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Account Deletion Scheduled</p>`,
            body: `
              ${emailRow('Requested', 'May 3, 2026 10:00 AM')}
              ${emailRow('Scheduled for', 'May 10, 2026')}
              ${emailRow('Grace period', '7 days to cancel')}
              <div class="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                <p class="font-semibold">This action is permanent</p>
                <p>All data will be deleted on May 10, 2026. This cannot be undone.</p>
              </div>
              ${emailBtn('Cancel Deletion')}`,
            liveUrl: '/theme/common/email/system/account-deletion',
          }),
          code: `// GET /theme/common/email/system/account-deletion
res.render('theme/common/email/system/account-deletion', {
  layout:    'layouts/blank',
  subject:   'Your account is scheduled for deletion on ' + deletionDate,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  deletion: {
    requestedAt:      new Date().toLocaleString(),
    scheduledAt:      deletionDate.toLocaleDateString(),
    gracePeriodDays:  7,
    cancelUrl:        '/account/cancel-deletion?token=' + token,
    supportUrl:       '/support',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Ticket Opened ─────────────────────────────────────────────────────────
    {
      id: 'email-ticket-opened',
      title: 'TicketOpenedEmail',
      category: 'Email',
      abbr: 'To',
      description: 'Support request received auto-reply. Ticket ID, subject, status badge, and message preview.',
      filePath: 'views/theme/common/email/support/ticket-opened.ejs',
      sourceCode: ticketOpenedSrc,
      variants: [
        {
          title: 'Ticket Opened',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-headset text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">Support Request Received</p>
              <p class="text-primary-fg/70 text-[10px]">Ticket #SUP-4821</p>`,
            body: `
              <div class="rounded-lg bg-green-50 border border-green-200 px-3 py-2 flex items-center gap-2 text-xs text-green-800">
                <i class="fa-solid fa-circle-check text-green-600 shrink-0" aria-hidden="true"></i>
                We've received your request and will respond shortly.
              </div>
              ${emailRow('Ticket ID', '#SUP-4821')}
              ${emailRow('Subject', 'Unable to export data to CSV')}
              ${emailRow('Status', 'Open')}
              <div class="rounded-lg bg-surface-raised border border-border px-3 py-2 text-xs text-text-secondary">Unable to export my project data to CSV…</div>
              ${emailBtn('View Ticket')}`,
            liveUrl: '/theme/common/email/support/ticket-opened',
          }),
          code: `// GET /theme/common/email/support/ticket-opened
res.render('theme/common/email/support/ticket-opened', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] Your request has been received',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:          ticket.id,
    subject:     ticket.subject,
    description: ticket.body,
    submittedAt: ticket.createdAt.toLocaleString(),
    viewUrl:     '/support/tickets/' + ticket.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Ticket Reply ──────────────────────────────────────────────────────────
    {
      id: 'email-ticket-reply',
      title: 'TicketReplyEmail',
      category: 'Email',
      abbr: 'Tr',
      description: 'Reply from the support team. Agent avatar, full reply text, and Reply and View CTA pair.',
      filePath: 'views/theme/common/email/support/ticket-reply.ejs',
      sourceCode: ticketReplySrc,
      variants: [
        {
          title: 'Agent Reply',
          previewHtml: emailCard({
            headerBg: 'bg-primary',
            headerContent: `<i class="fa-solid fa-reply text-primary-fg text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-primary-fg font-bold text-sm">New Reply on Your Ticket</p>
              <p class="text-primary-fg/70 text-[10px]">Ticket #SUP-4821</p>`,
            body: `
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-bold text-xs">E</div>
                <div><p class="text-xs font-semibold">Emma</p><p class="text-[10px] text-text-secondary">Acme Support · May 3, 2:15 PM</p></div>
              </div>
              <div class="rounded-lg bg-surface-over rounded-lg bg-surface-raised border border-border px-3 py-2 text-xs text-text-primary">
                Hi John, I've investigated the issue and applied a fix to your account. Could you try the export again?
              </div>
              <div class="flex gap-2">
                <span class="flex-1 text-center rounded-lg bg-primary text-primary-fg px-2 py-1.5 text-[10px] font-semibold">Reply</span>
                <span class="flex-1 text-center rounded-lg border border-border px-2 py-1.5 text-[10px] font-semibold">View Ticket</span>
              </div>`,
            liveUrl: '/theme/common/email/support/ticket-reply',
          }),
          code: `// GET /theme/common/email/support/ticket-reply
res.render('theme/common/email/support/ticket-reply', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] New reply from the support team',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:         ticket.id,
    subject:    ticket.subject,
    agentName:  reply.author.firstName,
    agentRole:  'Acme Support',
    replyText:  reply.body,
    repliedAt:  reply.createdAt.toLocaleString(),
    viewUrl:    '/support/tickets/' + ticket.id,
    replyUrl:   '/support/tickets/' + ticket.id + '/reply',
  },
});`,
          layout: 'stack',
        },
      ],
    },

    // ── Ticket Resolved ───────────────────────────────────────────────────────
    {
      id: 'email-ticket-resolved',
      title: 'TicketResolvedEmail',
      category: 'Email',
      abbr: 'Ts',
      description: 'Support ticket resolved notice. Resolution summary, emoji rating, and a reopen option.',
      filePath: 'views/theme/common/email/support/ticket-resolved.ejs',
      sourceCode: ticketResolvedSrc,
      variants: [
        {
          title: 'Ticket Resolved',
          previewHtml: emailCard({
            headerBg: 'bg-green-500',
            headerContent: `<i class="fa-solid fa-circle-check text-white text-2xl mb-1.5" aria-hidden="true"></i>
              <p class="text-white font-bold text-sm">Ticket Resolved</p>
              <p class="text-white/70 text-[10px]">Ticket #SUP-4821</p>`,
            body: `
              ${emailRow('Subject', 'Unable to export data to CSV')}
              ${emailRow('Resolved on', 'May 3, 2026 3:30 PM')}
              <div class="rounded-lg bg-surface-raised border border-border px-3 py-2 text-xs text-text-secondary">Applied server-side fix for large CSV exports.</div>
              <div class="rounded-lg bg-surface-raised border border-border px-3 py-3 text-center space-y-2">
                <p class="text-xs font-semibold">Was this helpful?</p>
                <div class="flex justify-center gap-3 text-lg">
                  <span title="Great">😊</span>
                  <span title="Okay">😐</span>
                  <span title="Poor">😞</span>
                </div>
              </div>`,
            liveUrl: '/theme/common/email/support/ticket-resolved',
          }),
          code: `// GET /theme/common/email/support/ticket-resolved
res.render('theme/common/email/support/ticket-resolved', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] Your ticket has been resolved',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:          ticket.id,
    subject:     ticket.subject,
    resolvedAt:  ticket.resolvedAt.toLocaleString(),
    resolution:  ticket.resolutionSummary,
    feedbackUrl: '/support/tickets/' + ticket.id + '/feedback',
    reopenUrl:   '/support/tickets/' + ticket.id + '/reopen',
    viewUrl:     '/support/tickets/' + ticket.id,
  },
});`,
          layout: 'stack',
        },
      ],
    },

  ];
}
