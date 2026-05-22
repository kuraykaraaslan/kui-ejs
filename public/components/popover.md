# Popover

- **id:** `popover`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Popover.ejs`
- **status:** stable
- **since:** 2026-05

Tıklamayla açılan, role="dialog" tabanlı küçük overlay. 4 yerleşim, ESC ve dış-tık ile kapanma.

## Design tokens consumed

- `--border`
- `--surface-raised`

## Variants

### Info popover (bottom)

```ejs
<%- include('modules/ui/Popover', {
  id: 'pro-info',
  trigger: '<button>What is Pro?</button>',
  placement: 'bottom',
  children: '<div class="p-4 w-64">...</div>'
}) %>
```

### Inline form (right)

```ejs
<%- include('modules/ui/Popover', {
  id: 'note-popover',
  trigger: '<button>Add note</button>',
  placement: 'right',
  children: '<div class="p-4 w-72">...</div>'
}) %>
```

### List menu (top)

```ejs
<%- include('modules/ui/Popover', {
  id: 'account-popover',
  trigger: '<button>Account</button>',
  placement: 'top',
  children: '<ul class="py-1 w-56">...</ul>'
}) %>
```

## Full EJS source

```ejs
<%
  var _id        = locals.id        || 'popover-' + Math.random().toString(36).substr(2, 9);
  var _placement = locals.placement || 'bottom';
  var _trigger   = locals.trigger   || '';
  var _className = locals.className || '';

  var placementClass = {
    bottom: 'top-full left-0 mt-2',
    top:    'bottom-full left-0 mb-2',
    left:   'right-full top-0 mr-2',
    right:  'left-full top-0 ml-2',
  }[_placement] || 'top-full left-0 mt-2';
%>
<div id="<%= _id %>" class="relative inline-block">
  <div
    id="<%= _id %>-trigger"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="<%= _id %>-panel"
    onclick="togglePopover('<%= _id %>')"
  >
    <%- _trigger %>
  </div>
  <div
    id="<%= _id %>-panel"
    role="dialog"
    tabindex="-1"
    hidden
    class="absolute z-[70] min-w-[12rem] rounded-lg border border-border bg-surface-raised shadow-xl focus-visible:outline-none <%= placementClass %><%= _className ? ' ' + _className : '' %>"
  >
    <%- locals.children || '' %>
  </div>
</div>

<script>
(function () {
  function getEls(id) {
    return {
      root:    document.getElementById(id),
      trigger: document.getElementById(id + '-trigger'),
      panel:   document.getElementById(id + '-panel'),
    };
  }

  function openPopover(id) {
    var e = getEls(id);
    if (!e.root || !e.panel || !e.trigger) return;
    e.panel.hidden = false;
    e.trigger.setAttribute('aria-expanded', 'true');
    e.panel.focus();
  }

  function closePopover(id) {
    var e = getEls(id);
    if (!e.root || !e.panel || !e.trigger) return;
    e.panel.hidden = true;
    e.trigger.setAttribute('aria-expanded', 'false');
  }

  function togglePopover(id) {
    var e = getEls(id);
    if (!e.panel) return;
    if (e.panel.hidden) openPopover(id); else closePopover(id);
  }

  window.openPopover   = window.openPopover   || openPopover;
  window.closePopover  = window.closePopover  || closePopover;
  window.togglePopover = window.togglePopover || togglePopover;

  var popoverId = '<%= _id %>';
  var root = document.getElementById(popoverId);
  if (!root) return;

  document.addEventListener('mousedown', function (ev) {
    var panel = document.getElementById(popoverId + '-panel');
    if (!panel || panel.hidden) return;
    if (!root.contains(ev.target)) closePopover(popoverId);
  });

  document.addEventListener('keydown', function (ev) {
    var panel = document.getElementById(popoverId + '-panel');
    if (!panel || panel.hidden) return;
    if (ev.key === 'Escape') closePopover(popoverId);
  });
})();
</script>

```
