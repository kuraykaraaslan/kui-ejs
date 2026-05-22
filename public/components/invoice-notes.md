# InvoiceNotes

- **id:** `invoice-notes`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/InvoiceNotes.ejs`
- **status:** stable
- **since:** 2025-05

Invoice footer section with optional notes text, bank details, and custom footer.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Notes + bank details

```ejs
<%- include('../../../modules/domain/invoice/InvoiceNotes', { notes: inv.notes, bankDetails: issuer.bankDetails }) %>
```

## Full EJS source

```ejs
<%
  var _notes       = locals.notes       || null;
  var _bankDetails = locals.bankDetails || null;
  var _footer      = locals.footer      || null;
%>
<% if (_notes || _bankDetails || _footer) { %>
<div class="space-y-4">
  <% if (_notes) { %>
  <div>
    <p class="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5">Notes</p>
    <p class="text-xs text-text-secondary leading-relaxed"><%= _notes %></p>
  </div>
  <% } %>

  <% if (_bankDetails) { %>
  <div>
    <p class="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5">Bank Details</p>
    <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
      <span class="text-text-secondary">Bank</span>
      <span class="font-mono text-text-primary"><%= _bankDetails.bank %></span>
      <span class="text-text-secondary">IBAN</span>
      <span class="font-mono text-text-primary"><%= _bankDetails.iban %></span>
      <span class="text-text-secondary">SWIFT</span>
      <span class="font-mono text-text-primary"><%= _bankDetails.swift %></span>
    </div>
  </div>
  <% } %>

  <% if (_footer) { %>
  <p class="text-xs text-text-secondary border-t border-border pt-3"><%= _footer %></p>
  <% } %>
</div>
<% } %>

```
