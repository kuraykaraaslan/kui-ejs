# InvoiceEmail

- **id:** `email-invoice`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/invoice.ejs`
- **status:** stable
- **since:** 2025-05

Itemized invoice. Status badge, all line items and totals, PDF download CTA.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Invoice — PAID

```ejs
// GET /theme/common/email/billing/invoice
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
});
```

## Full EJS source

```ejs
<%
  var inv    = locals.invoice || {};
  var items  = inv.items  || [];
  var totals = inv.totals || {};
  var STATUS_COLORS = { PAID: 'bg-success/10 text-success border-success/30', PENDING: 'bg-warning/10 text-warning border-warning/30', OVERDUE: 'bg-error/10 text-error border-error/30' };
  var statusClass = STATUS_COLORS[inv.status] || STATUS_COLORS.PENDING;
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-primary-fg font-bold text-xl"><%= company.name %></p>
          <p class="text-primary-fg/70 text-xs mt-1"><%= company.address %></p>
        </div>
        <span class="rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wide <%= statusClass %>">
          <%= inv.status %>
        </span>
      </div>
      <div class="mt-6">
        <p class="text-primary-fg/70 text-xs uppercase tracking-wide">Invoice</p>
        <p class="text-primary-fg font-mono text-lg font-bold"><%= inv.id %></p>
      </div>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <!-- Meta -->
      <div class="flex flex-wrap gap-4 text-sm">
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wide">Issue Date</p>
          <p class="font-medium text-text-primary mt-0.5"><%= inv.date %></p>
        </div>
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wide">Due Date</p>
          <p class="font-medium text-text-primary mt-0.5"><%= inv.dueDate %></p>
        </div>
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wide">Billed To</p>
          <p class="font-medium text-text-primary mt-0.5"><%= toName %></p>
          <p class="text-xs text-text-secondary"><%= toEmail %></p>
        </div>
      </div>

      <!-- Line items -->
      <div class="rounded-xl border border-border divide-y divide-border">
        <div class="flex justify-between px-4 py-2 bg-surface-raised rounded-t-xl">
          <span class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Item</span>
          <span class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Amount</span>
        </div>
        <% items.forEach(function(item) { %>
        <div class="flex items-start justify-between px-4 py-3 gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary"><%= item.name %></p>
            <% if (item.variant) { %><p class="text-xs text-text-secondary"><%= item.variant %></p><% } %>
            <p class="text-xs text-text-secondary">Qty: <%= item.qty %></p>
          </div>
          <p class="text-sm font-semibold text-text-primary shrink-0"><%= fmtTRY(item.price * item.qty) %></p>
        </div>
        <% }); %>
        <div class="px-4 py-3 bg-surface-raised rounded-b-xl space-y-1.5">
          <div class="flex justify-between text-xs text-text-secondary">
            <span>Subtotal</span><span><%= fmtTRY(totals.subtotal) %></span>
          </div>
          <div class="flex justify-between text-xs text-text-secondary">
            <span>Tax</span><span><%= fmtTRY(totals.tax) %></span>
          </div>
          <div class="flex justify-between text-sm font-bold text-text-primary border-t border-border pt-1.5 mt-1">
            <span>Total</span><span><%= fmtTRY(totals.total) %></span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= inv.downloadUrl %>"
          class="inline-flex items-center gap-2 bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          <i class="fa-solid fa-download" aria-hidden="true"></i>
          Download PDF Invoice
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
