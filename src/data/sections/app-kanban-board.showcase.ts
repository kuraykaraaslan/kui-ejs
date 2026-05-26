import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render through the shim so include() inside resolves split partials/scripts.
const tplPath    = path.join(process.cwd(), 'modules/app/KanbanBoard.ejs');
const indexPath  = path.join(process.cwd(), 'modules/app/KanbanBoard/KanbanBoard.ejs');
const renderSrc  = fs.readFileSync(tplPath,   'utf-8');
const sourceCode = fs.readFileSync(indexPath, 'utf-8');

function renderBoard(locals: Record<string, unknown>): string {
  return ejs.render(renderSrc, locals, { filename: tplPath });
}

const COLUMNS_3 = [
  { id: 'todo',  title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done',  title: 'Done' },
];

const CARDS_3 = [
  { id: 'c1', columnId: 'todo',  title: 'Audit dark-mode tokens',   priority: 'medium', labels: [{ id: 'l1', label: 'design', tone: 'info' }] },
  { id: 'c2', columnId: 'todo',  title: 'Wire i18n for /account',   priority: 'low',    labels: [{ id: 'l2', label: 'i18n',   tone: 'primary' }] },
  { id: 'c3', columnId: 'todo',  title: 'Fix flaky e2e on Firefox', priority: 'urgent', labels: [{ id: 'l3', label: 'bug',    tone: 'error' }] },
  { id: 'c4', columnId: 'doing', title: 'Refactor Quill toolbar',   priority: 'medium', assignees: [{ id: 'u1', name: 'Jane Doe' }] },
  { id: 'c5', columnId: 'doing', title: 'Document KanbanBoard API',                     assignees: [{ id: 'u2', name: 'John Smith' }, { id: 'u3', name: 'Ada Lovelace' }] },
  { id: 'c6', columnId: 'done',  title: 'Ship release notes',       priority: 'high',   labels: [{ id: 'l4', label: 'docs',   tone: 'success' }] },
];

function wrap(html: string): string {
  return `<div class="w-full">${html}</div>`;
}

export function buildAppKanbanBoardData(): ShowcaseItem[] {
  return [
    {
      id: 'kanban-board',
      title: 'KanbanBoard',
      category: 'App',
      abbr: 'KB',
      description:
        'Trello / Linear-style kanban board. M1 ships HTML5-native drag and drop between columns with an inline drop-position indicator (thin line between cards) and full optimistic-UI rewind via window.KuiKanban.get(id).setMover() — throw / reject from the mover to revert. Future milestones: column reorder + collapse + WIP limits (M2), swimlanes + filters + search (M3), inline edit + bulk select + card detail panel (M4), keyboard nav + ARIA announcements (M5), virtualization + auto-archive + dependencies (M6). Pixel-identical React sibling at modules/app/KanbanBoard/index.tsx.',
      filePath: 'modules/app/KanbanBoard/KanbanBoard.ejs',
      sourceCode,
      since: '2026-05',
      status: 'beta',
      composes: ['badge', 'avatar'],
      designTokens: [
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-strong', '--border-focus',
        '--primary', '--primary-subtle',
        '--info-subtle', '--warning-subtle', '--error-subtle', '--success-subtle',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['region', 'list', 'listitem', 'application'],
        keyboardInteractions: [
          { keys: 'Tab',          action: 'Move focus across cards / columns' },
          { keys: 'Drag (mouse)', action: 'Pick up a card and drop on any column slot' },
        ],
        notes:
          'Each column is role="region" with aria-label; the inner list is role="list"; cards are role="listitem". aria-grabbed flips on the active card; aria-dropeffect="move" is set on all columns while a drag is in flight. Full keyboard parity ships in M5.',
      },
      variants: [
        {
          title: 'Three columns (basic)',
          layout: 'stack',
          previewHtml: wrap(renderBoard({
            id: 'kb-demo-basic',
            ariaLabel: 'Engineering board',
            columns: COLUMNS_3,
            cards: CARDS_3,
          })),
          code: `<%- include('modules/app/KanbanBoard', {
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
</script>`,
        },
        {
          title: 'canMove validation',
          layout: 'stack',
          previewHtml: wrap(
            renderBoard({
              id: 'kb-demo-validated',
              ariaLabel: 'Validated board (no exit from Done)',
              columns: COLUMNS_3,
              cards: CARDS_3,
            }) +
            `<script>
              (function () {
                var api = window.KuiKanban && window.KuiKanban.get('kb-demo-validated');
                if (!api) return;
                api._canMove = function (card, from, to) { return from !== 'done' || to === 'done'; };
              })();
            </script>`
          ),
          code: `<%- include('modules/app/KanbanBoard', { id: 'board', columns, cards }) %>
<script>
  window.KuiKanban.get('board')._canMove = function (card, from, to) {
    return from !== 'done' || to === 'done';
  };
</script>`,
        },
        {
          title: 'Async mover with rollback',
          layout: 'stack',
          previewHtml: wrap(
            renderBoard({
              id: 'kb-demo-async',
              ariaLabel: 'Server-validated board — moves into Done get rejected',
              columns: COLUMNS_3,
              cards: CARDS_3,
            }) +
            `<script>
              (function () {
                var api = window.KuiKanban && window.KuiKanban.get('kb-demo-async');
                if (!api) return;
                api.setMover(function (card, from, to) {
                  return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                      if (to === 'done') reject(new Error('Server rejected move into Done'));
                      else resolve();
                    }, 350);
                  });
                });
              })();
            </script>`
          ),
          code: `<%- include('modules/app/KanbanBoard', { id: 'board', columns, cards }) %>
<script>
  window.KuiKanban.get('board').setMover(async function (card, from, to, index) {
    var r = await fetch('/api/move', {
      method: 'POST',
      body: JSON.stringify({ id: card.id, to: to, index: index })
    });
    if (!r.ok) throw new Error(r.statusText); // -> optimistic move rolls back
  });
</script>`,
        },
      ],
    },
  ];
}
