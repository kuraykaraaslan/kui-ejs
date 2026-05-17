# PaymentTermsBadge

- **id:** `invoice-payment-terms-badge`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/PaymentTermsBadge.ejs`
- **status:** stable

Payment terms badge: Net 7, Net 15, Net 30, Net 60, Due on Receipt, Immediate.

## Design tokens consumed

- `--info`

## Variants

### Payment terms

```ejs
<%- include('../../../modules/domain/invoice/PaymentTermsBadge', { terms: 'NET_30' }) %>
```

## Full EJS source

```ejs
<%
  var _terms = (locals.terms || 'NET_30').toUpperCase();
  var _size  = locals.size  || 'md';

  var labels = {
    NET_7:          'Net 7',
    NET_15:         'Net 15',
    NET_30:         'Net 30',
    NET_60:         'Net 60',
    DUE_ON_RECEIPT: 'Due on Receipt',
    IMMEDIATE:      'Immediate',
  };
  var label = labels[_terms] || _terms;
  var cls   = _size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
%>
<span class="inline-flex items-center gap-1 rounded-full border font-medium <%= cls %> text-info bg-info/10 border-info/30">
  <i class="fa-solid fa-calendar-days text-xs" aria-hidden="true"></i>
  <%= label %>
</span>

```
