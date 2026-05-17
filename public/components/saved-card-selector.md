# SavedCardSelector

- **id:** `saved-card-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/payment/SavedCardSelector.ejs`
- **status:** stable
- **since:** 0.1

Kayıtlı ödeme kartları listesi. Marka rozeti, maskeli numara, son tarih ve varsayılan göstergesi.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--error`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Multiple cards

```ejs
<%- include('modules/domain/common/payment/SavedCardSelector', {
  cards: savedCards,
  selectedCardId: selectedCard,
  addHref: '/payment/cards/new',
  removeAction: '/payment/cards/{id}/remove'
}) %>
```

### Empty state

```ejs
<%- include('modules/domain/common/payment/SavedCardSelector', {
  cards: [],
  addHref: '/payment/cards/new'
}) %>
```

## Full EJS source

```ejs
<%
  var _cards          = locals.cards          || [];
  var _selectedCardId = locals.selectedCardId || null;
  var _addHref        = locals.addHref        || null;
  var _removeAction   = locals.removeAction   || null;

  var brandColor = {
    VISA: 'bg-blue-600', MASTERCARD: 'bg-orange-500', AMEX: 'bg-teal-600',
    DISCOVER: 'bg-orange-400', JCB: 'bg-blue-600', TROY: 'bg-cyan-600',
    MIR: 'bg-green-600', UNIONPAY: 'bg-red-600', UNKNOWN: 'bg-gray-500',
  };
  var brandLabel = {
    VISA: 'VISA', MASTERCARD: 'MC', AMEX: 'AMEX', DISCOVER: 'DISC',
    JCB: 'JCB', TROY: 'TROY', MIR: 'MIR', UNIONPAY: 'UNIONPAY', UNKNOWN: '••',
  };
%>
<fieldset class="space-y-3<%= locals.className ? ' ' + locals.className : '' %>">
  <legend class="sr-only">Select payment card</legend>

  <% if (_cards.length === 0) { %>
  <p class="text-sm text-text-secondary py-4 text-center">No saved cards.</p>
  <% } else { %>
  <div class="space-y-2">
    <% _cards.forEach(function(card) {
      var isSelected = card.cardId === _selectedCardId;
      var bc = brandColor[card.brand] || 'bg-gray-500';
      var bl = brandLabel[card.brand] || '••';
      var rowClass = isSelected
        ? 'border-primary ring-2 ring-primary ring-offset-1 bg-surface-raised'
        : 'border-border hover:border-border-strong bg-surface-raised';
    %>
    <label class="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-border-focus <%= rowClass %>">
      <input type="radio" name="savedCard" value="<%= card.cardId %>"
        <%= isSelected ? 'checked' : '' %>
        class="sr-only">
      <span aria-hidden="true" class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors <%= isSelected ? 'border-primary bg-primary' : 'border-border' %>">
        <% if (isSelected) { %><span class="h-1.5 w-1.5 rounded-full bg-white"></span><% } %>
      </span>

      <span class="inline-flex items-center justify-center rounded px-1.5 py-0.5 font-bold text-white tracking-wide shrink-0 <%= bc %>" style="font-size:10px"><%= bl %></span>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-text-primary font-mono">•••• •••• •••• <%= card.last4 %></p>
        <p class="text-xs text-text-secondary">
          <%= card.cardholderName %> · <%= card.expiryMonth %>/<%= card.expiryYear %>
          <% if (card.isDefault) { %><span class="ml-2 font-semibold text-primary uppercase" style="font-size:10px">Default</span><% } %>
        </p>
      </div>

      <% if (_removeAction) { %>
      <form action="<%= _removeAction.replace('{id}', card.cardId) %>" method="post" class="shrink-0">
        <button type="submit" onclick="return confirm('Remove this card?')"
          class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors bg-transparent text-error hover:opacity-80 px-2 py-1 text-xs">
          Remove
        </button>
      </form>
      <% } %>
    </label>
    <% }); %>
  </div>
  <% } %>

  <% if (_addHref) { %>
  <a href="<%= _addHref %>"
    class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
    + Add new card
  </a>
  <% } %>
</fieldset>

```
