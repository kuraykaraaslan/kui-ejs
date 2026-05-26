# KanbanBoard

- **id:** `kanban-board`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/KanbanBoard/KanbanBoard.ejs`
- **status:** beta
- **since:** 2026-05

Trello / Linear-style kanban board. M1 ships HTML5-native drag and drop between columns with an inline drop-position indicator (thin line between cards) and full optimistic-UI rewind via window.KuiKanban.get(id).setMover() — throw / reject from the mover to revert. Future milestones: column reorder + collapse + WIP limits (M2), swimlanes + filters + search (M3), inline edit + bulk select + card detail panel (M4), keyboard nav + ARIA announcements (M5), virtualization + auto-archive + dependencies (M6). Pixel-identical React sibling at modules/app/KanbanBoard/index.tsx.

## Depends on (include order)

- `badge`
- `avatar`

## Accessibility

- WCAG: AA
- ARIA patterns: region, list, listitem, application
- Keyboard:
  - `Tab` — Move focus across cards / columns
  - `Drag (mouse)` — Pick up a card and drop on any column slot

Each column is role="region" with aria-label; the inner list is role="list"; cards are role="listitem". aria-grabbed flips on the active card; aria-dropeffect="move" is set on all columns while a drag is in flight. Full keyboard parity ships in M5.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-strong`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--info-subtle`
- `--warning-subtle`
- `--error-subtle`
- `--success-subtle`

## Variants

### Three columns (basic)

```ejs
<%- include('modules/app/KanbanBoard', {
  id: 'engineering-board',
  ariaLabel: 'Engineering board',
  columns: [
    { id: 'todo',  title: 'To Do' },
    { id: 'doing', title: 'In Progress' },
    { id: 'done',  title: 'Done' }
  ],
  cards: [
    { id: 'c1', columnId: 'todo',  title: 'Audit dark-mode tokens', priority: 'medium' },
    { id: 'c2', columnId: 'doing', title: 'Refactor Quill toolbar' }
  ]
}) %>

<script>
  // Persist + revert hook (mover may throw to roll back the optimistic move).
  window.KuiKanban.get('engineering-board').setMover(async function (card, from, to, index) {
    var r = await fetch('/api/cards/' + card.id, {
      method: 'PATCH', body: JSON.stringify({ columnId: to, index })
    });
    if (!r.ok) throw new Error(r.statusText);
  });
</script>
```

### canMove validation

```ejs
<%- include('modules/app/KanbanBoard', { id: 'board', columns, cards }) %>
<script>
  window.KuiKanban.get('board')._canMove = function (card, from, to) {
    return from !== 'done' || to === 'done';
  };
</script>
```

### Async mover with rollback

```ejs
<%- include('modules/app/KanbanBoard', { id: 'board', columns, cards }) %>
<script>
  window.KuiKanban.get('board').setMover(async function (card, from, to, index) {
    var r = await fetch('/api/move', {
      method: 'POST',
      body: JSON.stringify({ id: card.id, to: to, index: index })
    });
    if (!r.ok) throw new Error(r.statusText); // -> optimistic move rolls back
  });
</script>
```

## Full EJS source

```ejs
<%
  // ── KanbanBoard EJS (M1 — Core DnD) ─────────────────────────────────
  // Pixel-identical to modules/app/KanbanBoard/index.tsx in 01_NextJS_Components.
  // HTML5 native drag-and-drop between columns + thin drop-line insert hint
  // + optimistic-UI rewind on rejected onCardMove (rejection signalled by
  // a global Promise the caller can attach via window.KuiKanban.setMover).
  var _id       = locals.id       || 'kb-' + Math.random().toString(36).substr(2, 9);
  var _columns  = locals.columns  || [];
  var _cards    = locals.cards    || [];
  var _ariaLabel= locals.ariaLabel|| 'Kanban board';
%>
<div
  id="<%= _id %>"
  role="application"
  aria-label="<%= _ariaLabel %>"
  data-kanban-id="<%= _id %>"
  class="kanban-board w-full overflow-x-auto flex gap-3 items-start p-2"
>
  <% _columns.forEach(function (col) {
       var colCards = _cards.filter(function (c) { return c.columnId === col.id; });
  %>
    <%- include('./partials/_column', { _id: _id, col: col, cards: colCards }) %>
  <% }); %>
  <%# TODO M2: trailing "+ Add column" button (onColumnAdd). %>
  <%# TODO M3: filter/search bar + swimlane row wrappers. %>
  <%# TODO M5: <span aria-live="polite" /> announcing card moves. %>
</div>

<script>
(function () {
  var KB_ID  = '<%= _id %>';
  var MIME   = 'application/x-kanban-card';
  var cards  = <%- JSON.stringify(_cards) %>;
  var snapshot = null;
  var dropTarget = null; // { columnId, index }
  var draggingId = null;

  var root = document.getElementById(KB_ID);
  if (!root) return;

  /* ── Optimistic mover (rebuilds DOM after splice / rollback) ──────── */
  <%- include('./scripts/dnd.js') %>

  /* ── Init: bind once per card + column ────────────────────────────── */
  bindAll();

  /* ── Public API per board (window.KuiKanban.get(id)) ───────────────── */
  window.KuiKanban = window.KuiKanban || {};
  window.KuiKanban.get = window.KuiKanban.get || function (id) {
    return window.KuiKanban[id] || null;
  };
  window.KuiKanban[KB_ID] = {
    setMover: function (fn) { window.KuiKanban[KB_ID]._mover = fn; },
    getCards: function ()   { return cards.slice(); },
  };
})();
</script>

```
