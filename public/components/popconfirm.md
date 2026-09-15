# Popconfirm

- **id:** `popconfirm`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Popconfirm.ejs`
- **status:** stable
- **since:** 2026-09

"Are you sure?" confirmation popover: trigger + absolutely-positioned alertdialog panel with title, optional description, and Cancel/Confirm buttons. Built standalone (not a Popover wrapper). Since EJS cannot take a JS closure, confirming or cancelling dispatches a `popconfirm:confirm` / `popconfirm:cancel` CustomEvent on the root element for the host page to listen for.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Default

```ejs
<%- include('modules/ui/Popconfirm', {
  trigger: '<button type="button">Delete item</button>',
  title: 'Delete this item?',
  description: 'This action cannot be undone.',
}) %>
```

### Danger + custom labels

```ejs
<%- include('modules/ui/Popconfirm', {
  danger: true,
  trigger: '<button type="button">Remove account</button>',
  title: 'Permanently remove this account?',
  description: 'All data associated with this account will be deleted.',
  confirmLabel: 'Remove',
  cancelLabel: 'Keep account',
  confirmAction: 'removeAccount()',
}) %>

<script>
document.getElementById('my-popconfirm').addEventListener('popconfirm:confirm', function (ev) {
  // ev.detail.id === 'my-popconfirm'
});
</script>
```

## Full EJS source

```ejs
<%#
  modules/ui/Popconfirm.ejs — "are you sure?" confirmation popover.

  Built the same way as modules/ui/Overlays/Popover/Popover.ejs (self-contained
  trigger + absolutely-positioned panel + inline <script>), NOT a wrapper
  around Popover — Popover has no confirm/cancel footer or onConfirm callback
  concept in a server-rendered context.

  EJS has no live JS closures, so `onConfirm`/`onCancel` cannot be passed as
  functions. Instead:
    - `confirmAction` / `cancelAction` locals are rendered as
      `data-popconfirm-confirm-action` / `data-popconfirm-cancel-action`
      attributes on the root element — read them yourself in a page-level
      <script> if you prefer a data-attribute lookup.
    - Confirming or cancelling always dispatches a bubbling CustomEvent
      (`popconfirm:confirm` / `popconfirm:cancel`) on the root `#<id>` element
      with `{ detail: { id } }`. Host pages should add a listener:

        document.getElementById('my-popconfirm').addEventListener('popconfirm:confirm', function (ev) {
          // ev.detail.id === 'my-popconfirm'
        });
%>
<%
  var _id          = locals.id          || 'popconfirm-' + Math.random().toString(36).substr(2, 9);
  var _placement   = locals.placement   || 'bottom';
  var _trigger     = locals.trigger     || '';
  var _title       = locals.title       || '';
  var _description = locals.description || '';
  var _confirmLabel = locals.confirmLabel || 'Confirm';
  var _cancelLabel  = locals.cancelLabel  || 'Cancel';
  var _danger       = !!locals.danger;
  var _className    = locals.className    || '';

  var placementClass = {
    bottom: 'top-full left-0 mt-2',
    top:    'bottom-full left-0 mb-2',
    left:   'right-full top-0 mr-2',
    right:  'left-full top-0 ml-2',
  }[_placement] || 'top-full left-0 mt-2';

  var iconClass = _danger ? 'text-error' : 'text-warning';
%>
<%- include('./Overlays/shared/focus-trap.js') %>
<div
  id="<%= _id %>"
  class="relative inline-block<%= _className ? ' ' + _className : '' %>"
  data-popconfirm-confirm-action="<%= locals.confirmAction || '' %>"
  data-popconfirm-cancel-action="<%= locals.cancelAction || '' %>"
>
  <div
    id="<%= _id %>-trigger"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="<%= _id %>-panel"
    onclick="togglePopconfirm('<%= _id %>')"
  >
    <%- _trigger %>
  </div>
  <div
    id="<%= _id %>-panel"
    role="alertdialog"
    aria-labelledby="<%= _id %>-title"
    <% if (_description) { %>aria-describedby="<%= _id %>-description"<% } %>
    tabindex="-1"
    hidden
    data-state="closed"
    class="absolute z-[70] w-72 rounded-lg border border-border bg-surface-raised p-4 shadow-xl focus-visible:outline-none <%= placementClass %>"
  >
    <div class="flex gap-3">
      <span aria-hidden="true" class="shrink-0 <%= iconClass %>">
        <i class="fa-solid fa-circle-question" style="font-size:16px"></i>
      </span>
      <div class="min-w-0 flex-1">
        <p id="<%= _id %>-title" class="text-sm font-semibold text-text-primary"><%= _title %></p>
        <% if (_description) { %>
          <p id="<%= _id %>-description" class="mt-1 text-xs text-text-secondary"><%= _description %></p>
        <% } %>
      </div>
    </div>
    <div class="mt-3 flex justify-end gap-2">
      <span data-popconfirm-cancel>
        <%- include('./Button', { variant: 'outline', size: 'sm', children: _cancelLabel }) %>
      </span>
      <span data-popconfirm-confirm>
        <%- include('./Button', { variant: _danger ? 'danger' : 'primary', size: 'sm', children: _confirmLabel }) %>
      </span>
    </div>
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

  function openPopconfirm(id) {
    var e = getEls(id);
    if (!e.root || !e.panel || !e.trigger) return;
    e.panel.hidden = false;
    e.panel.setAttribute('data-state', 'open');
    e.trigger.setAttribute('aria-expanded', 'true');
    if (window.__overlayFocusTrap) window.__overlayFocusTrap.activate(id, e.panel);
    else e.panel.focus();
  }

  function closePopconfirm(id) {
    var e = getEls(id);
    if (!e.root || !e.panel || !e.trigger) return;
    e.panel.hidden = true;
    e.panel.setAttribute('data-state', 'closed');
    e.trigger.setAttribute('aria-expanded', 'false');
    if (window.__overlayFocusTrap) window.__overlayFocusTrap.deactivate(id);
  }

  function togglePopconfirm(id) {
    var e = getEls(id);
    if (!e.panel) return;
    if (e.panel.hidden) openPopconfirm(id); else closePopconfirm(id);
  }

  window.openPopconfirm   = window.openPopconfirm   || openPopconfirm;
  window.closePopconfirm  = window.closePopconfirm  || closePopconfirm;
  window.togglePopconfirm = window.togglePopconfirm || togglePopconfirm;

  var popconfirmId = '<%= _id %>';
  var root = document.getElementById(popconfirmId);
  if (!root) return;

  root.addEventListener('click', function (ev) {
    var confirmBtn = ev.target.closest('[data-popconfirm-confirm] button, [data-popconfirm-confirm] a');
    var cancelBtn  = ev.target.closest('[data-popconfirm-cancel] button, [data-popconfirm-cancel] a');

    if (confirmBtn) {
      closePopconfirm(popconfirmId);
      root.dispatchEvent(new CustomEvent('popconfirm:confirm', { bubbles: true, detail: { id: popconfirmId } }));
      return;
    }
    if (cancelBtn) {
      closePopconfirm(popconfirmId);
      root.dispatchEvent(new CustomEvent('popconfirm:cancel', { bubbles: true, detail: { id: popconfirmId } }));
      return;
    }
  });

  document.addEventListener('pointerdown', function (ev) {
    var panel = document.getElementById(popconfirmId + '-panel');
    if (!panel || panel.hidden) return;
    if (!root.contains(ev.target)) closePopconfirm(popconfirmId);
  }, true);

  document.addEventListener('keydown', function (ev) {
    var panel = document.getElementById(popconfirmId + '-panel');
    if (!panel || panel.hidden) return;
    var ft = window.__overlayFocusTrap;
    if (ft && !ft.isTop(popconfirmId)) return;
    if (ev.key === 'Escape') {
      closePopconfirm(popconfirmId);
      root.dispatchEvent(new CustomEvent('popconfirm:cancel', { bubbles: true, detail: { id: popconfirmId } }));
      return;
    }
    if (ft) ft.handleKey(popconfirmId, panel, ev);
  });
})();
</script>

```
