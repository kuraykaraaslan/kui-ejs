# Accordion

- **id:** `accordion`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Accordion.ejs`
- **status:** stable
- **since:** 2026-09

Collapsible panel group for progressively disclosing content. Server-renders the initial open/closed state from `defaultOpenIds` (no client JS needed for first paint), then a scoped inline script wires up click handlers. Supports single-open or `allowMultiple` mode.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### Single open (default)

```ejs
<%- include('modules/ui/Accordion', {
  items: [
    { id: 'shipping', title: 'How long does shipping take?', content: '...' },
    { id: 'returns',  title: 'What is your return policy?',  content: '...' },
    { id: 'support',  title: 'How do I contact support?',    content: '...' },
  ],
  defaultOpenIds: ['shipping'],
}) %>
```

### Allow multiple + disabled item

```ejs
<%- include('modules/ui/Accordion', {
  allowMultiple: true,
  defaultOpenIds: ['shipping', 'returns'],
  items: [
    { id: 'shipping', title: 'How long does shipping take?', content: '...' },
    { id: 'returns',  title: 'What is your return policy?',  content: '...' },
    { id: 'legal',    title: 'Legal (coming soon)', content: '', disabled: true },
  ],
}) %>
```

## Full EJS source

```ejs
<%
  var _id            = locals.id            || 'accordion-' + Math.random().toString(36).substr(2, 9);
  var _items         = locals.items         || [];
  var _defaultOpenIds = locals.defaultOpenIds || [];
  var _allowMultiple = !!locals.allowMultiple;
  var _className     = locals.className     || '';

  function isOpen(itemId) {
    return _defaultOpenIds.indexOf(itemId) !== -1;
  }
%>
<div id="<%= _id %>" data-accordion data-allow-multiple="<%= _allowMultiple ? 'true' : 'false' %>" class="divide-y divide-border rounded-lg border border-border bg-surface-base<%= _className ? ' ' + _className : '' %>">
  <% _items.forEach(function (item) { %>
    <%
      var _headerId  = _id + '-header-' + item.id;
      var _panelId   = _id + '-panel-' + item.id;
      var _itemOpen  = isOpen(item.id);
      var _disabled  = !!item.disabled;
    %>
    <h3 class="m-0">
      <button
        type="button"
        id="<%= _headerId %>"
        aria-expanded="<%= _itemOpen ? 'true' : 'false' %>"
        aria-controls="<%= _panelId %>"
        data-accordion-trigger="<%= item.id %>"
        <% if (_disabled) { %>disabled<% } %>
        class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span><%= item.title %></span>
        <span
          aria-hidden="true"
          data-accordion-chevron
          class="shrink-0 text-text-secondary transition-transform duration-200<%= _itemOpen ? ' rotate-180' : '' %>"
        >
          <i class="fa-solid fa-chevron-down" style="font-size:12px"></i>
        </span>
      </button>
    </h3>
    <div
      id="<%= _panelId %>"
      role="region"
      aria-labelledby="<%= _headerId %>"
      data-accordion-panel="<%= item.id %>"
      <% if (!_itemOpen) { %>hidden<% } %>
      class="px-4 py-3 text-sm text-text-secondary"
    >
      <%= item.content %>
    </div>
  <% }); %>
</div>

<script>
(function () {
  var rootId = '<%= _id %>';
  var root = document.getElementById(rootId);
  if (!root) return;

  var allowMultiple = root.getAttribute('data-allow-multiple') === 'true';

  function closeItem(itemId) {
    var trigger = root.querySelector('[data-accordion-trigger="' + itemId + '"]');
    var panel   = root.querySelector('[data-accordion-panel="' + itemId + '"]');
    if (!trigger || !panel) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    var chevron = trigger.querySelector('[data-accordion-chevron]');
    if (chevron) chevron.classList.remove('rotate-180');
  }

  function openItem(itemId) {
    var trigger = root.querySelector('[data-accordion-trigger="' + itemId + '"]');
    var panel   = root.querySelector('[data-accordion-panel="' + itemId + '"]');
    if (!trigger || !panel) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    var chevron = trigger.querySelector('[data-accordion-chevron]');
    if (chevron) chevron.classList.add('rotate-180');
  }

  root.addEventListener('click', function (ev) {
    var trigger = ev.target.closest('[data-accordion-trigger]');
    if (!trigger || !root.contains(trigger) || trigger.disabled) return;

    var itemId = trigger.getAttribute('data-accordion-trigger');
    var panel  = root.querySelector('[data-accordion-panel="' + itemId + '"]');
    if (!panel) return;

    var willOpen = panel.hidden;

    if (willOpen && !allowMultiple) {
      var triggers = root.querySelectorAll('[data-accordion-trigger]');
      Array.prototype.forEach.call(triggers, function (t) {
        var id = t.getAttribute('data-accordion-trigger');
        if (id !== itemId) closeItem(id);
      });
    }

    if (willOpen) openItem(itemId); else closeItem(itemId);
  });
})();
</script>

```
