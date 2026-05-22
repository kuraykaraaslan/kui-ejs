import { buildPageTitle } from '../../config/showcase.config';
import { Router, Request, Response } from 'express';

const router = Router();

/* ─── Demo data ─── */

const DEMO_USER = {
  name:           'John Doe',
  username:       'johndoe',
  email:          'john.doe@example.com',
  phone:          '+90 555 123 45 67',
  biography:      'Full-stack developer passionate about design systems and component-driven development.',
  profilePicture: null,
  role:           'AUTHOR',
  status:         'ACTIVE',
};

const DEFAULT_PREFERENCES = {
  theme:              'SYSTEM',
  language:           'en',
  emailNotifications: true,
  pushNotifications:  false,
  newsletter:         true,
  timezone:           'Europe/Istanbul',
};

const DEFAULT_ADDRESSES = [
  {
    fullName:     'John Doe',
    phone:        '+90 555 123 45 67',
    addressLine1: 'Atatürk Caddesi No:42 Daire:5',
    addressLine2: 'Levent Mah.',
    city:         'Istanbul',
    state:        'Istanbul',
    postalCode:   '34330',
    country:      'Turkey',
    countryCode:  'TR',
  },
  {
    fullName:     'John Doe',
    phone:        '+90 555 987 65 43',
    addressLine1: 'Kızılay Meydanı Sk. No:8',
    addressLine2: null,
    city:         'Ankara',
    state:        'Ankara',
    postalCode:   '06420',
    country:      'Turkey',
    countryCode:  'TR',
  },
];

const DEFAULT_CARDS = [
  { cardId: 'card-1', last4: '4242', brand: 'VISA',       cardholderName: 'JOHN DOE', expiryMonth: '08', expiryYear: '27', isDefault: true },
  { cardId: 'card-2', last4: '5555', brand: 'MASTERCARD', cardholderName: 'JOHN DOE', expiryMonth: '12', expiryYear: '26' },
  { cardId: 'card-3', last4: '3782', brand: 'AMEX',       cardholderName: 'JOHN DOE', expiryMonth: '03', expiryYear: '28' },
];

const DEFAULT_CART = {
  cartId: 'cart-demo-001',
  items: [
    { cartItemId: 'ci-1', productId: 'prod-1', name: 'Pro Plan — Annual',    description: 'Full access to all features, priority support', image: null, variant: 'Billing: Yearly', price: 999.90,  currency: 'TRY', quantity: 1, maxQuantity: 1 },
    { cartItemId: 'ci-2', productId: 'prod-2', name: 'Design System Add-on', description: 'Component library + Figma kit',                 image: null, variant: null,             price: 150.00,  currency: 'TRY', quantity: 2, maxQuantity: 5 },
    { cartItemId: 'ci-3', productId: 'prod-3', name: 'Priority Support',     description: '12-month dedicated support package',             image: null, variant: null,             price: 130.00,  currency: 'TRY', quantity: 1, maxQuantity: 1 },
  ],
  totals: { subtotal: 1429.90, discountTotal: 130.00, taxTotal: 208.78, serviceFee: 29.99, shippingTotal: 0, total: 1538.67, currency: 'TRY' },
};

const DEMO_ORDERS = [
  { paymentId: 'pay-001', provider: 'Stripe',  providerPaymentId: 'pi_3NxA1',   method: 'CREDIT_CARD', status: 'PAID',     amount: 1538.67, currency: 'TRY' },
  { paymentId: 'pay-002', provider: 'Stripe',  providerPaymentId: 'pi_3NwB2',   method: 'CREDIT_CARD', status: 'REFUNDED', amount: 299.90,  currency: 'TRY' },
  { paymentId: 'pay-003', provider: 'PayPal',  providerPaymentId: 'PAYID-MXY123',method: 'WALLET',      status: 'PAID',     amount: 89.00,   currency: 'TRY' },
  { paymentId: 'pay-004', provider: 'Stripe',  providerPaymentId: 'pi_3NvC3',   method: 'CREDIT_CARD', status: 'FAILED',   amount: 450.00,  currency: 'TRY' },
  { paymentId: 'pay-005', provider: 'Stripe',  providerPaymentId: 'pi_3NuD4',   method: 'DEBIT_CARD',  status: 'PENDING',  amount: 750.00,  currency: 'TRY' },
];

const ORDER_TOTALS = { subtotal: 1299.90, discountTotal: 130.00, taxTotal: 208.78, serviceFee: 29.99, shippingTotal: 0, total: 1408.67, currency: 'TRY' };

/* ─── Mutable demo state (single-user, resets on server restart) ─── */

let demoUser        = { ...DEMO_USER };
let demoPreferences = { ...DEFAULT_PREFERENCES };
let demoAddresses   = DEFAULT_ADDRESSES.map((a) => ({ ...a }));
let demoCards       = DEFAULT_CARDS.map((c) => ({ ...c }));
let demoCart        = { ...DEFAULT_CART, items: DEFAULT_CART.items.map((i) => ({ ...i })), totals: { ...DEFAULT_CART.totals } };
let cartCoupon: string | undefined;

function recalcCart() {
  const subtotal = demoCart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cartCoupon ? Math.round(subtotal * 0.1) : 0;
  const tax      = Math.round((subtotal - discount) * 0.18 * 100) / 100;
  const service  = demoCart.totals.serviceFee;
  demoCart.totals = { ...demoCart.totals, subtotal, discountTotal: discount, taxTotal: tax, total: subtotal - discount + tax + service };
}

/* ══════════════════════════════════════════════════════════════
   Index
══════════════════════════════════════════════════════════════ */

router.get('/', (_req: Request, res: Response) => {
  res.render('theme/common/index', { layout: 'layouts/blank', title: 'Common Theme' });
});

/* ══════════════════════════════════════════════════════════════
   Auth
══════════════════════════════════════════════════════════════ */

router.get('/auth/login', (req: Request, res: Response) => {
  res.render('theme/common/auth/login', {
    layout:      'layouts/blank',
    title: buildPageTitle('Login', 'Common Theme'),
    showExpired: !req.query.noexpired,
    successMsg:  req.query.success ? `Signed in as ${req.query.email || 'you'}` : '',
    error:       req.query.error   || '',
  });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { provider, email } = req.body;
  if (provider) return res.redirect('/theme/common/auth/login?success=1&email=' + encodeURIComponent(provider + '@oauth.demo'));
  if (!email)   return res.redirect('/theme/common/auth/login?error=Email+is+required');
  res.redirect('/theme/common/auth/login?success=1&email=' + encodeURIComponent(email));
});

router.get('/auth/register', (req: Request, res: Response) => {
  res.render('theme/common/auth/register', {
    layout:       'layouts/blank',
    title: buildPageTitle('Register', 'Common Theme'),
    successEmail: req.query.success || '',
    error:        req.query.error   || '',
  });
});

router.post('/auth/register', (req: Request, res: Response) => {
  const { provider, email, password, confirmPassword } = req.body;
  if (provider) return res.redirect('/theme/common/auth/register?success=' + encodeURIComponent(provider + '@oauth.demo'));
  if (!email)   return res.redirect('/theme/common/auth/register?error=Email+is+required');
  if (!password || password.length < 8) return res.redirect('/theme/common/auth/register?error=Password+too+short');
  if (password !== confirmPassword)     return res.redirect('/theme/common/auth/register?error=Passwords+do+not+match');
  res.redirect('/theme/common/auth/register?success=' + encodeURIComponent(email));
});

router.get('/auth/forgot-password', (req: Request, res: Response) => {
  res.render('theme/common/auth/forgot-password', {
    layout:     'layouts/blank',
    title: buildPageTitle('Forgot Password', 'Common Theme'),
    sent:       !!req.query.sent,
    emailValue: req.query.email || '',
  });
});

router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  res.redirect('/theme/common/auth/forgot-password?sent=1&email=' + encodeURIComponent(email || ''));
});

router.get('/auth/reset-password', (req: Request, res: Response) => {
  res.render('theme/common/auth/reset-password', {
    layout:  'layouts/blank',
    title: buildPageTitle('Reset Password', 'Common Theme'),
    success: !!req.query.success,
    error:   req.query.error || '',
  });
});

router.post('/auth/reset-password', (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword.length < 8) return res.redirect('/theme/common/auth/reset-password?error=Password+too+short');
  if (newPassword !== confirmPassword)        return res.redirect("/theme/common/auth/reset-password?error=Passwords+don't+match");
  res.redirect('/theme/common/auth/reset-password?success=1');
});

router.get('/auth/verify-email', (req: Request, res: Response) => {
  res.render('theme/common/auth/verify-email', {
    layout:   'layouts/blank',
    title: buildPageTitle('Verify Email', 'Common Theme'),
    verified: !!req.query.verified,
  });
});

router.get('/auth/two-factor', (req: Request, res: Response) => {
  res.render('theme/common/auth/two-factor', {
    layout:  'layouts/blank',
    title: buildPageTitle('Two-Factor Auth', 'Common Theme'),
    success: !!req.query.success,
  });
});

/* ══════════════════════════════════════════════════════════════
   Cart
══════════════════════════════════════════════════════════════ */

router.get('/cart', (_req: Request, res: Response) => {
  res.render('theme/common/cart/index', {
    layout:        'layouts/blank',
    title: buildPageTitle('Cart', 'Common Theme'),
    cart:          demoCart,
    appliedCoupon: cartCoupon,
  });
});

router.post('/cart/quantity', (req: Request, res: Response) => {
  const { cartItemId, qty } = req.body;
  const item = demoCart.items.find((i) => i.cartItemId === cartItemId);
  if (item) {
    const newQty = Math.max(1, Math.min(item.maxQuantity, parseInt(qty as string) || 1));
    item.quantity = newQty;
    recalcCart();
  }
  res.redirect('/theme/common/cart');
});

router.post('/cart/remove', (req: Request, res: Response) => {
  const { cartItemId } = req.body;
  demoCart.items = demoCart.items.filter((i) => i.cartItemId !== cartItemId);
  recalcCart();
  res.redirect('/theme/common/cart');
});

router.post('/cart/coupon', (req: Request, res: Response) => {
  const { couponCode } = req.body;
  if ((couponCode as string)?.toUpperCase() === 'SAVE10') {
    cartCoupon = 'SAVE10';
    recalcCart();
    res.redirect('/theme/common/cart');
  } else {
    res.redirect('/theme/common/cart?couponError=' + encodeURIComponent('Invalid coupon. Try SAVE10.'));
  }
});

router.post('/cart/coupon/remove', (_req: Request, res: Response) => {
  cartCoupon = undefined;
  recalcCart();
  res.redirect('/theme/common/cart');
});

/* ══════════════════════════════════════════════════════════════
   Payment
══════════════════════════════════════════════════════════════ */

router.get('/payment', (_req: Request, res: Response) => {
  res.render('theme/common/payment/index', {
    layout:      'layouts/blank',
    title: buildPageTitle('Payment Components', 'Common Theme'),
    orderTotals: ORDER_TOTALS,
    savedCards:  demoCards,
    demoPayment: { paymentId: 'pay_demo_001', provider: 'Stripe', providerPaymentId: 'pi_3NxYz2EwLHMpEt9Q1aB2c3D4', method: 'CREDIT_CARD', status: 'PAID', amount: ORDER_TOTALS.total, currency: ORDER_TOTALS.currency },
  });
});

router.get('/payment/checkout', (_req: Request, res: Response) => {
  res.render('theme/common/payment/checkout', {
    layout:      'layouts/blank',
    title: buildPageTitle('Checkout', 'Common Theme'),
    addresses:   demoAddresses,
    cards:       demoCards,
    demoCart,
    orderTotals: ORDER_TOTALS,
  });
});

/* ══════════════════════════════════════════════════════════════
   Not Found
══════════════════════════════════════════════════════════════ */

router.get('/not-found', (_req: Request, res: Response) => {
  res.render('theme/common/not-found', { layout: 'layouts/blank', title: buildPageTitle('404', 'Common Theme') });
});

/* ══════════════════════════════════════════════════════════════
   Account
══════════════════════════════════════════════════════════════ */

function accountContext() {
  return {
    name:           demoUser.name,
    email:          demoUser.email,
    username:       demoUser.username,
    biography:      demoUser.biography,
    profilePicture: demoUser.profilePicture,
    role:           demoUser.role,
    status:         demoUser.status,
  };
}

/* Profile */
router.get('/account/profile', (req: Request, res: Response) => {
  res.render('theme/common/account/profile', {
    layout:  'layouts/blank',
    title: buildPageTitle('Profile', 'Common Theme'),
    user:    accountContext(),
    saved:   !!req.query.saved,
    editing: !!req.query.edit,
  });
});

router.post('/account/profile', (req: Request, res: Response) => {
  const { name, username, biography, profilePicture } = req.body;
  demoUser = { ...demoUser, name: name || demoUser.name, username: username || demoUser.username, biography: biography || demoUser.biography, profilePicture: profilePicture || demoUser.profilePicture };
  res.redirect('/theme/common/account/profile?saved=1');
});

/* Settings */
router.get('/account/settings', (req: Request, res: Response) => {
  res.render('theme/common/account/settings', {
    layout:      'layouts/blank',
    title: buildPageTitle('Settings', 'Common Theme'),
    user:        accountContext(),
    preferences: demoPreferences,
    prefSaved:   !!req.query.prefSaved,
    pwSaved:     !!req.query.pwSaved,
    pwError:     !!req.query.pwError,
  });
});

router.post('/account/settings/preferences', (req: Request, res: Response) => {
  demoPreferences = {
    theme:              req.body.theme              || demoPreferences.theme,
    language:           req.body.language           || demoPreferences.language,
    emailNotifications: req.body.emailNotifications === '1',
    pushNotifications:  req.body.pushNotifications  === '1',
    newsletter:         req.body.newsletter         === '1',
    timezone:           demoPreferences.timezone,
  };
  res.redirect('/theme/common/account/settings?prefSaved=1');
});

router.post('/account/settings/password', (req: Request, res: Response) => {
  const { currentPassword } = req.body;
  if (currentPassword === 'wrong') return res.redirect('/theme/common/account/settings?pwError=1');
  res.redirect('/theme/common/account/settings?pwSaved=1');
});

/* Addresses */
router.get('/account/addresses', (req: Request, res: Response) => {
  res.render('theme/common/account/addresses', {
    layout:    'layouts/blank',
    title: buildPageTitle('Addresses', 'Common Theme'),
    user:      accountContext(),
    addresses: demoAddresses,
    mode:      (req.query.mode as string) || 'list',
    editIdx:   req.query.idx !== undefined ? parseInt(req.query.idx as string) : -1,
    flash:     req.query.flash || '',
  });
});

router.post('/account/addresses/new', (req: Request, res: Response) => {
  const addr = {
    fullName: req.body.fullName, phone: req.body.phone,
    addressLine1: req.body.addressLine1, addressLine2: req.body.addressLine2 || null,
    city: req.body.city, state: req.body.state, postalCode: req.body.postalCode,
    country: req.body.country, countryCode: req.body.countryCode,
  };
  demoAddresses.push(addr);
  res.redirect('/theme/common/account/addresses?flash=Address+added.');
});

router.post('/account/addresses/:idx', (req: Request, res: Response) => {
  const idx = parseInt(req.params.idx as string);
  if (idx >= 0 && idx < demoAddresses.length) {
    demoAddresses[idx] = {
      fullName: req.body.fullName, phone: req.body.phone,
      addressLine1: req.body.addressLine1, addressLine2: req.body.addressLine2 || null,
      city: req.body.city, state: req.body.state, postalCode: req.body.postalCode,
      country: req.body.country, countryCode: req.body.countryCode,
    };
  }
  res.redirect('/theme/common/account/addresses?flash=Address+updated.');
});

router.post('/account/addresses/:idx/delete', (req: Request, res: Response) => {
  const idx = parseInt(req.params.idx as string);
  if (idx >= 0 && idx < demoAddresses.length) demoAddresses.splice(idx, 1);
  res.redirect('/theme/common/account/addresses?flash=Address+removed.');
});

/* Payment methods */
router.get('/account/payment-methods', (req: Request, res: Response) => {
  res.render('theme/common/account/payment-methods', {
    layout: 'layouts/blank',
    title: buildPageTitle('Payment Methods', 'Common Theme'),
    user:   accountContext(),
    cards:  demoCards,
    adding: !!req.query.adding,
    flash:  req.query.flash || '',
  });
});

router.post('/account/payment-methods/new', (req: Request, res: Response) => {
  const expiry = (req.body.expiry || '').split('/');
  const newCard = {
    cardId:         'card-' + Date.now(),
    last4:          (req.body.cardNumber || '').replace(/\s/g, '').slice(-4),
    brand:          'VISA' as const,
    cardholderName: req.body.cardholderName || 'CARD HOLDER',
    expiryMonth:    expiry[0]?.trim() || '12',
    expiryYear:     expiry[1]?.trim() || '99',
  };
  demoCards.push(newCard);
  res.redirect('/theme/common/account/payment-methods?flash=Card+added.');
});

router.post('/account/payment-methods/:id/remove', (req: Request, res: Response) => {
  demoCards = demoCards.filter((c) => c.cardId !== req.params.id);
  res.redirect('/theme/common/account/payment-methods?flash=Card+removed.');
});

/* Orders */
router.get('/account/orders', (req: Request, res: Response) => {
  res.render('theme/common/account/orders', {
    layout: 'layouts/blank',
    title: buildPageTitle('Orders', 'Common Theme'),
    user:   accountContext(),
    orders: DEMO_ORDERS,
    filter: (req.query.filter as string) || 'ALL',
  });
});

/* ══════════════════════════════════════════════════════════════
   Email Previews
══════════════════════════════════════════════════════════════ */

const COMPANY = {
  name:         'Acme Corp',
  domain:       'acme.example.com',
  address:      '123 Main Street · San Francisco, CA 94102',
  supportEmail: 'support@acme.example.com',
};

function emailCtx(title: string, subject: string, extra: object = {}): object {
  return {
    layout:    'layouts/blank',
    title:     title + ' — Email Preview',
    subject,
    fromName:  COMPANY.name,
    fromEmail: 'noreply@' + COMPANY.domain,
    toName:    demoUser.name,
    toEmail:   demoUser.email,
    date:      'May 3, 2026 at 10:23 AM',
    company:   COMPANY,
    ...extra,
  };
}

const EMAIL_ORDER_ITEMS = [
  { name: 'Pro Plan — Annual',    variant: 'Billing: Yearly', qty: 1, price: 999.90 },
  { name: 'Design System Add-on', variant: null,              qty: 2, price: 150.00 },
];
const EMAIL_ORDER_TOTALS = { subtotal: 1299.90, discount: 0, tax: 233.98, shipping: 0, total: 1533.88, currency: 'TRY' };
const EMAIL_SHIPPING     = { fullName: 'John Doe', addressLine1: 'Atatürk Caddesi No:42', city: 'Istanbul', country: 'Turkey', postalCode: '34330' };

router.get('/email', (_req, res) =>
  res.render('theme/common/email/index', { layout: 'layouts/blank', title: buildPageTitle('Email Previews', 'Common Theme') }));

/* Auth emails */
router.get('/email/auth/welcome', (_req, res) =>
  res.render('theme/common/email/auth/welcome', emailCtx('Welcome Email', 'Welcome to Acme Corp! Confirm your email to get started', {
    confirmUrl: '#',
  })));

router.get('/email/auth/verify-email', (_req, res) =>
  res.render('theme/common/email/auth/verify-email', emailCtx('Verify Email', 'Your Acme Corp verification code', {
    otp: '847 392',
    expiresIn: '15 minutes',
  })));

router.get('/email/auth/password-reset', (_req, res) =>
  res.render('theme/common/email/auth/password-reset', emailCtx('Password Reset', 'Reset your Acme Corp password', {
    resetUrl:  '#',
    expiresIn: '1 hour',
  })));

router.get('/email/auth/password-changed', (_req, res) =>
  res.render('theme/common/email/auth/password-changed', emailCtx('Password Changed', 'Your password has been changed', {
    changedAt:  'May 3, 2026 at 10:23 AM (UTC+3)',
    ipAddress:  '192.168.1.42',
    location:   'Istanbul, Turkey',
    supportUrl: '#',
  })));

router.get('/email/auth/login-alert', (_req, res) =>
  res.render('theme/common/email/auth/login-alert', emailCtx('New Login Alert', 'New sign-in to your Acme Corp account', {
    device:     'Chrome on Windows 11',
    location:   'Istanbul, Turkey',
    ipAddress:  '192.168.1.42',
    loginTime:  'May 3, 2026 at 10:23 AM',
    secureUrl:  '#',
  })));

router.get('/email/auth/account-locked', (_req, res) =>
  res.render('theme/common/email/auth/account-locked', emailCtx('Account Locked', 'Your account has been temporarily locked', {
    reason:     'Too many failed login attempts',
    unlockAt:   'May 3, 2026 at 11:23 AM',
    unlockUrl:  '#',
    supportUrl: '#',
  })));

/* Order emails */
router.get('/email/order/confirmation', (_req, res) =>
  res.render('theme/common/email/order/confirmation', emailCtx('Order Confirmation', 'Order confirmed — #ORD-20260503-001', {
    order: { id: 'ORD-20260503-001', date: 'May 3, 2026', items: EMAIL_ORDER_ITEMS, totals: EMAIL_ORDER_TOTALS, shipping: EMAIL_SHIPPING, viewUrl: '#' },
  })));

router.get('/email/order/shipped', (_req, res) =>
  res.render('theme/common/email/order/shipped', emailCtx('Order Shipped', 'Your order #ORD-20260503-001 has shipped!', {
    order: { id: 'ORD-20260503-001', carrier: 'FedEx', trackingNumber: 'FX123456789TR', trackingUrl: '#', estimatedDelivery: 'May 6–7, 2026', items: EMAIL_ORDER_ITEMS },
  })));

router.get('/email/order/delivered', (_req, res) =>
  res.render('theme/common/email/order/delivered', emailCtx('Order Delivered', 'Your order has been delivered!', {
    order: { id: 'ORD-20260503-001', deliveredAt: 'May 6, 2026 at 2:34 PM', items: EMAIL_ORDER_ITEMS, reviewUrl: '#', viewUrl: '#' },
  })));

router.get('/email/order/cancelled', (_req, res) =>
  res.render('theme/common/email/order/cancelled', emailCtx('Order Cancelled', 'Your order #ORD-20260503-001 has been cancelled', {
    order: { id: 'ORD-20260503-001', reason: 'Requested by customer', items: EMAIL_ORDER_ITEMS, refundAmount: 1533.88, refundDays: '3–5 business days', currency: 'TRY', shopUrl: '#' },
  })));

router.get('/email/order/refund', (_req, res) =>
  res.render('theme/common/email/order/refund', emailCtx('Refund Processed', 'Your refund of ₺299.90 has been processed', {
    refund: { id: 'REF-20260503-001', orderId: 'ORD-20260430-005', amount: 299.90, currency: 'TRY', method: 'Visa ••••4242', processedAt: 'May 3, 2026', arrivalDays: '3–5 business days', viewUrl: '#' },
  })));

router.get('/email/order/abandoned-cart', (_req, res) =>
  res.render('theme/common/email/order/abandoned-cart', emailCtx('Abandoned Cart', 'You left something behind…', {
    cart: { items: EMAIL_ORDER_ITEMS, total: 1299.90, currency: 'TRY', couponCode: 'COMEBACK10', couponPct: 10, expiresAt: 'May 5, 2026', resumeUrl: '#' },
  })));

/* Billing emails */
router.get('/email/billing/invoice', (_req, res) =>
  res.render('theme/common/email/billing/invoice', emailCtx('Invoice', 'Invoice #INV-2026-0042 from Acme Corp', {
    invoice: { id: 'INV-2026-0042', date: 'May 3, 2026', dueDate: 'May 17, 2026', status: 'PAID', items: EMAIL_ORDER_ITEMS, totals: EMAIL_ORDER_TOTALS, downloadUrl: '#' },
  })));

router.get('/email/billing/subscription-activated', (_req, res) =>
  res.render('theme/common/email/billing/subscription-activated', emailCtx('Subscription Activated', 'Your Pro subscription is now active!', {
    plan: { name: 'Pro Plan', price: 999.90, currency: 'TRY', interval: 'year', nextBillingDate: 'May 3, 2027', features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Team collaboration', 'Custom integrations'], manageUrl: '#' },
  })));

router.get('/email/billing/renewal-reminder', (_req, res) =>
  res.render('theme/common/email/billing/renewal-reminder', emailCtx('Renewal Reminder', 'Your Pro Plan renews in 7 days', {
    plan: { name: 'Pro Plan', renewalDate: 'May 10, 2026', amount: 999.90, currency: 'TRY', paymentMethod: 'Visa ••••4242', manageUrl: '#', cancelUrl: '#' },
  })));

router.get('/email/billing/subscription-cancelled', (_req, res) =>
  res.render('theme/common/email/billing/subscription-cancelled', emailCtx('Subscription Cancelled', 'Your Pro Plan subscription has been cancelled', {
    plan: { name: 'Pro Plan', cancelledAt: 'May 3, 2026', accessUntil: 'May 10, 2026', reactivateUrl: '#', feedbackUrl: '#' },
  })));

router.get('/email/billing/payment-failed', (_req, res) =>
  res.render('theme/common/email/billing/payment-failed', emailCtx('Payment Failed', "We couldn't process your payment", {
    payment: { amount: 999.90, currency: 'TRY', attemptedAt: 'May 3, 2026 at 10:23 AM', failReason: 'Insufficient funds', retryDate: 'May 10, 2026', updateUrl: '#' },
  })));

router.get('/email/billing/card-expiring', (_req, res) =>
  res.render('theme/common/email/billing/card-expiring', emailCtx('Card Expiring Soon', 'Your Visa ••••4242 expires next month', {
    card: { last4: '4242', brand: 'Visa', expiryMonth: '06', expiryYear: '26', updateUrl: '#' },
    plan: { name: 'Pro Plan', nextBillingDate: 'May 10, 2026' },
  })));

/* Notification emails */
router.get('/email/notification/comment-reply', (_req, res) =>
  res.render('theme/common/email/notification/comment-reply', emailCtx('Comment Reply', 'Sarah replied to your comment', {
    notification: { senderName: 'Sarah Chen', postTitle: 'Getting Started with Design Systems', postUrl: '#', yourComment: 'Great article! The atomic design section was particularly helpful for our team.', replyText: 'Thanks John! The atomic approach really does scale well. Let me know if you need help adapting it for your stack.', viewUrl: '#' },
  })));

router.get('/email/notification/mention', (_req, res) =>
  res.render('theme/common/email/notification/mention', emailCtx('You Were Mentioned', 'Alex mentioned you in a comment', {
    notification: { mentionerName: 'Alex Rivera', context: 'mentioned you in a comment on "Building Scalable APIs"', excerpt: '…I think @johndoe had a great solution to this problem in their last post. You should check out their approach to error boundaries.', viewUrl: '#' },
  })));

router.get('/email/notification/new-message', (_req, res) =>
  res.render('theme/common/email/notification/new-message', emailCtx('New Message', 'You have a new message from Maria Santos', {
    notification: { senderName: 'Maria Santos', messageCount: 1, preview: "Hi John! I wanted to follow up on our conversation about the design system integration. I've put together some notes…", sentAt: 'May 3, 2026 at 9:45 AM', replyUrl: '#' },
  })));

/* Marketing emails */
router.get('/email/marketing/newsletter', (_req, res) =>
  res.render('theme/common/email/marketing/newsletter', emailCtx('Newsletter', 'Acme Weekly — Issue #42', {
    newsletter: {
      issue: 42,
      date:  'May 3, 2026',
      intro: "Here's what's happening in the world of design systems and developer tools this week.",
      articles: [
        { tag: 'Design',    title: 'The Future of Adaptive Interfaces',    summary: 'How AI-driven design is reshaping how we build and ship UI components at scale.',              url: '#', readTime: '5 min' },
        { tag: 'Dev Tools', title: 'Tailwind CSS v4 Deep Dive',            summary: 'A comprehensive look at the new CSS-first config, OKLCH colors, and performance improvements.', url: '#', readTime: '8 min' },
        { tag: 'Community', title: 'Spotlight: Open Source Design Systems', summary: 'We talked to the maintainers of 5 popular open-source design systems about their journey.',  url: '#', readTime: '6 min' },
      ],
      ctaUrl: '#',
    },
  })));

router.get('/email/marketing/promotional', (_req, res) =>
  res.render('theme/common/email/marketing/promotional', emailCtx('Special Offer', '50% off Pro Plan — This weekend only', {
    promo: { headline: '50% Off Pro Plan', subheadline: 'This weekend only — upgrade and save', discountPct: 50, code: 'WEEKEND50', validUntil: 'May 5, 2026 at 11:59 PM', originalPrice: 999.90, discountedPrice: 499.95, currency: 'TRY', shopUrl: '#', features: ['Everything in Free', 'Unlimited projects', 'Priority support', 'Advanced analytics'] },
  })));

router.get('/email/marketing/product-update', (_req, res) =>
  res.render('theme/common/email/marketing/product-update', emailCtx('Product Update', "What's new in Acme Corp v2.4", {
    update: {
      version: '2.4',
      date:    'May 3, 2026',
      intro:   "After months of work, we're excited to announce Acme Corp v2.4 — our biggest release yet.",
      highlights: [
        { icon: 'fa-solid fa-bolt',        title: '3× Faster Performance', description: 'Complete rewrite of the rendering engine. Everything loads significantly faster.' },
        { icon: 'fa-solid fa-paint-brush', title: 'New Design System',    description: 'Fresh component library with 200+ components and a refined dark mode.' },
        { icon: 'fa-solid fa-plug',        title: 'New Integrations',     description: 'Native connectors for Figma, GitHub, Slack, and 12 more tools.' },
      ],
      changelogUrl:  '#',
      learnMoreUrl:  '#',
    },
  })));

/* System emails */
router.get('/email/system/maintenance', (_req, res) =>
  res.render('theme/common/email/system/maintenance', emailCtx('Scheduled Maintenance', 'Scheduled maintenance on May 10 — 2–6 AM UTC', {
    maintenance: { startTime: 'May 10, 2026 at 2:00 AM UTC', endTime: 'May 10, 2026 at 6:00 AM UTC', duration: '~4 hours', reason: 'Infrastructure upgrade and database migration', affected: ['Web application', 'API access', 'File uploads'], statusUrl: '#' },
  })));

router.get('/email/system/policy-update', (_req, res) =>
  res.render('theme/common/email/system/policy-update', emailCtx('Policy Update', 'Important updates to our Privacy Policy', {
    update: { type: 'Privacy Policy', effectiveDate: 'June 1, 2026', summaryPoints: ['More granular control over your data sharing preferences.', 'Clarified how we handle third-party analytics and advertising data.', 'Added your right to data portability and how to request an export.', 'Updated retention periods for inactive account data.'], viewUrl: '#' },
  })));

router.get('/email/system/data-export', (_req, res) =>
  res.render('theme/common/email/system/data-export', emailCtx('Data Export Ready', 'Your data export is ready to download', {
    export: { requestedAt: 'May 3, 2026 at 9:00 AM', readyAt: 'May 3, 2026 at 9:07 AM', fileSize: '2.4 MB', format: 'ZIP (JSON + CSV)', downloadUrl: '#', expiresAt: 'May 10, 2026' },
  })));

router.get('/email/system/account-deletion', (_req, res) =>
  res.render('theme/common/email/system/account-deletion', emailCtx('Account Deletion Scheduled', 'Your account is scheduled for deletion on May 10', {
    deletion: { requestedAt: 'May 3, 2026 at 10:00 AM', scheduledAt: 'May 10, 2026', gracePeriodDays: 7, cancelUrl: '#', supportUrl: '#' },
  })));

/* Support emails */
router.get('/email/support/ticket-opened', (_req, res) =>
  res.render('theme/common/email/support/ticket-opened', emailCtx('Support Ticket Opened', '[Ticket #SUP-4821] Your request has been received', {
    ticket: { id: 'SUP-4821', subject: 'Unable to export data to CSV format', description: "Hi, I'm trying to export my project data to CSV but the download button shows a spinner for a few seconds and then nothing happens. I've tried on Chrome and Firefox. My account is on the Pro plan.", submittedAt: 'May 3, 2026 at 10:23 AM', viewUrl: '#' },
  })));

router.get('/email/support/ticket-reply', (_req, res) =>
  res.render('theme/common/email/support/ticket-reply', emailCtx('Support Reply', '[Ticket #SUP-4821] New reply from the support team', {
    ticket: { id: 'SUP-4821', subject: 'Unable to export data to CSV format', agentName: 'Emma', agentRole: 'Acme Support', replyText: "Hi John, thank you for reaching out! I've investigated the issue and found that CSV exports for large datasets (>10k rows) were timing out due to a server-side issue. I've applied a fix to your account and increased your export timeout limit.\n\nCould you try the export again and let me know if it works?", repliedAt: 'May 3, 2026 at 2:15 PM', viewUrl: '#', replyUrl: '#' },
  })));

router.get('/email/support/ticket-resolved', (_req, res) =>
  res.render('theme/common/email/support/ticket-resolved', emailCtx('Ticket Resolved', '[Ticket #SUP-4821] Your ticket has been resolved', {
    ticket: { id: 'SUP-4821', subject: 'Unable to export data to CSV format', resolvedAt: 'May 3, 2026 at 3:30 PM', resolution: 'Applied server-side fix for large CSV exports and increased timeout limit for Pro plan accounts.', feedbackUrl: '#', reopenUrl: '#', viewUrl: '#' },
  })));

export default router;
