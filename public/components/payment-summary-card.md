# PaymentSummaryCard

- **id:** `payment-summary-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/payment/PaymentSummaryCard.ejs`
- **status:** stable
- **since:** 0.1

Salt okunur ödeme özet kartı: tutar, yöntem, sağlayıcı, referans ve durum rozeti.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Paid via Stripe

```ejs
<%- include('modules/domain/common/payment/PaymentSummaryCard', {
  payment: {
    provider: 'Stripe', method: 'CREDIT_CARD', status: 'PAID',
    amount: 153.96, currency: 'USD', providerPaymentId: 'pi_3Nf9xZ'
  }
}) %>
```

### Pending bank transfer

```ejs
<%- include('modules/domain/common/payment/PaymentSummaryCard', {
  payment: { provider: 'Iyzico', method: 'BANK_TRANSFER', status: 'PENDING', amount: 2499, currency: 'TRY' }
}) %>
```

## Full EJS source

```ejs
<%
  var _payment  = locals.payment || {};
  var _locale   = locals.locale  || 'tr-TR';
  var _currency = _payment.currency || 'TRY';
  var _amount   = _payment.amount   || 0;

  var methodLabels = {
    CREDIT_CARD:   'Credit Card',
    DEBIT_CARD:    'Debit Card',
    BANK_TRANSFER: 'Bank Transfer',
    CASH:          'Cash',
    WALLET:        'Digital Wallet',
    CRYPTO:        'Crypto',
  };
  var methodLabel = methodLabels[_payment.method] || _payment.method || '';
  var amountFormatted = _amount.toLocaleString(_locale, { style: 'currency', currency: _currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
%>
<div class="bg-surface-raised border border-border rounded-xl overflow-hidden<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-overlay">
    <span class="text-sm font-semibold text-text-primary">Payment</span>
    <%- include('../payment/PaymentStatusBadge', { status: _payment.status, size: 'sm', dot: true }) %>
  </div>

  <div class="px-4 py-4 space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm text-text-secondary">Amount</span>
      <span class="tabular-nums text-xl font-semibold text-text-primary"><%= amountFormatted %></span>
    </div>

    <% if (methodLabel) { %>
    <div class="flex items-center justify-between">
      <span class="text-sm text-text-secondary">Method</span>
      <span class="text-sm font-medium text-text-primary"><%= methodLabel %></span>
    </div>
    <% } %>

    <% if (_payment.provider) { %>
    <div class="flex items-center justify-between">
      <span class="text-sm text-text-secondary">Provider</span>
      <span class="text-sm font-medium text-text-primary"><%= _payment.provider %></span>
    </div>
    <% } %>

    <% if (_payment.providerPaymentId) { %>
    <div class="flex items-center justify-between gap-4">
      <span class="text-sm text-text-secondary shrink-0">Ref</span>
      <span class="text-xs font-mono text-text-secondary truncate text-right"><%= _payment.providerPaymentId %></span>
    </div>
    <% } %>
  </div>
</div>

```
