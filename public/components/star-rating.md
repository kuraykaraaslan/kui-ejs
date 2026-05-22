# StarRating

- **id:** `star-rating`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/StarRating.ejs`
- **status:** stable
- **since:** 2026-05

Five-star rating indicator. Read-only by default with decimal/half-star rendering; pass `readonly: false` for interactive whole-star selection.

## When to use

Surface a 0–5 star score (e.g. product / hotel / restaurant ratings) or let users submit a new rating.

## When NOT to use

For non-star scales (e.g. NPS, percentages) use ContentScoreBar or a custom indicator instead.

## Accessibility

- WCAG: AA
- ARIA patterns: role="img" (readonly), role="radiogroup" / role="radio" (interactive)

## Design tokens consumed

- `--warning`
- `--text-disabled`
- `--border-focus`

## Variants

### Readonly with decimals

```ejs
<%- include('modules/ui/StarRating', { value: 4.7, size: 'sm', caption: '(312 reviews)' }) %>
<%- include('modules/ui/StarRating', { value: 3.5, size: 'md' }) %>
<%- include('modules/ui/StarRating', { value: 2.2, size: 'lg' }) %>
```

### Interactive

```ejs
<%- include('modules/ui/StarRating', {
  value: 0,
  readonly: false,
  size: 'lg',
  ariaLabel: 'Pick a rating'
}) %>
```

## Full EJS source

```ejs
<%
  var _value     = (typeof locals.value === 'number') ? locals.value : 0;
  var _size      = locals.size       || 'md';
  var _readonly  = (typeof locals.readonly === 'boolean') ? locals.readonly : true;
  var _ariaLabel = locals['aria-label'] || locals.ariaLabel || '';
  var _caption   = locals.caption    || '';
  var _className = locals.className  || '';

  var TOTAL_STARS = 5;

  // clamp
  if (isNaN(_value)) _value = 0;
  if (_value < 0) _value = 0;
  if (_value > TOTAL_STARS) _value = TOTAL_STARS;

  var sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[_size] || 'w-5 h-5';

  var gapClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  }[_size] || 'gap-1';

  var defaultLabel = _value.toFixed(1) + ' out of ' + TOTAL_STARS + ' stars';
  var labelText = _ariaLabel || defaultLabel;

  var isInteractive = !_readonly;

  // unique id for interactive mode JS scoping
  var _rid = 'sr_' + Math.random().toString(36).slice(2, 9);
%>
<% if (!isInteractive) { %>
  <span class="inline-flex items-center <%= gapClasses %><%= _className ? ' ' + _className : '' %>" role="img" aria-label="<%= labelText %>">
    <% for (var i = 1; i <= TOTAL_STARS; i++) {
         var filled = _value >= i;
         var half   = !filled && _value >= (i - 0.5);
         var iconClass = filled ? 'fa-solid fa-star' : (half ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star');
         var colorClass = (filled || half) ? 'text-warning' : 'text-text-disabled';
    %>
      <i class="<%= iconClass %> <%= sizeClasses %> <%= colorClass %>" aria-hidden="true"></i>
    <% } %>
    <% if (_caption) { %>
      <span class="ml-2 text-sm text-text-secondary"><%- _caption %></span>
    <% } %>
  </span>
<% } else { %>
  <span id="<%= _rid %>" role="radiogroup" aria-label="<%= _ariaLabel || 'Rating' %>" class="inline-flex items-center <%= gapClasses %><%= _className ? ' ' + _className : '' %>" data-value="<%= _value %>">
    <% for (var k = 1; k <= TOTAL_STARS; k++) {
         var kFilled = _value >= k;
         var kChecked = _value === k;
    %>
      <button
        type="button"
        role="radio"
        aria-checked="<%= kChecked ? 'true' : 'false' %>"
        aria-label="<%= k %> <%= k === 1 ? 'star' : 'stars' %>"
        data-star="<%= k %>"
        class="rounded-sm transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="<%= kFilled ? 'fa-solid fa-star' : 'fa-regular fa-star' %> <%= sizeClasses %> <%= kFilled ? 'text-warning' : 'text-text-disabled' %>" aria-hidden="true"></i>
      </button>
    <% } %>
    <% if (_caption) { %>
      <span class="ml-2 text-sm text-text-secondary"><%- _caption %></span>
    <% } %>
  </span>
  <script>
    (function(){
      var root = document.getElementById('<%= _rid %>');
      if (!root) return;
      var buttons = root.querySelectorAll('button[data-star]');
      var current = parseFloat(root.getAttribute('data-value')) || 0;
      var sizeCls = '<%= sizeClasses %>';

      function paint(displayValue, isHover) {
        buttons.forEach(function(btn){
          var s = parseInt(btn.getAttribute('data-star'), 10);
          var filled = displayValue >= s;
          var icon = btn.querySelector('i');
          if (!icon) return;
          icon.className = (filled ? 'fa-solid fa-star' : 'fa-regular fa-star') + ' ' + sizeCls + ' ' + (filled ? 'text-warning' : 'text-text-disabled');
          if (!isHover) {
            btn.setAttribute('aria-checked', (current === s) ? 'true' : 'false');
          }
        });
      }

      buttons.forEach(function(btn){
        var s = parseInt(btn.getAttribute('data-star'), 10);
        btn.addEventListener('mouseenter', function(){ paint(s, true); });
        btn.addEventListener('focus',      function(){ paint(s, true); });
        btn.addEventListener('blur',       function(){ paint(current, false); });
        btn.addEventListener('click',      function(){
          current = s;
          root.setAttribute('data-value', String(current));
          paint(current, false);
          root.dispatchEvent(new CustomEvent('change', { detail: { value: current }, bubbles: true }));
        });
      });
      root.addEventListener('mouseleave', function(){ paint(current, false); });
    })();
  </script>
<% } %>

```
