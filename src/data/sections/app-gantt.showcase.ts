import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render through the shim so include() inside resolves split partials/scripts.
const tplPath    = path.join(process.cwd(), 'modules/app/Gantt.ejs');
const indexPath  = path.join(process.cwd(), 'modules/app/Gantt/Gantt.ejs');
const renderSrc  = fs.readFileSync(tplPath,   'utf-8');
const sourceCode = fs.readFileSync(indexPath, 'utf-8');

function renderGantt(locals: Record<string, unknown>): string {
  return ejs.render(renderSrc, locals, { filename: tplPath });
}

const today = new Date();
function day(offset: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

const PROJECT_TASKS = [
  { id: 'g1', name: 'Design phase',     isGroup: true,  start: day(-14), end: day(7),  progress: 70, owner: 'Ada L.' },
  { id: 't1', name: 'Wireframes',       parentId: 'g1', start: day(-14), end: day(-7), progress: 100, owner: 'Ada L.' },
  { id: 't2', name: 'Visual design',    parentId: 'g1', start: day(-7),  end: day(2),  progress: 80,  owner: 'Jane D.' },
  { id: 't3', name: 'Design review',    parentId: 'g1', start: day(2),   end: day(7),  progress: 20,  owner: 'Team' },
  { id: 'g2', name: 'Implementation',   isGroup: true,  start: day(0),   end: day(28), progress: 35,  owner: 'John S.' },
  { id: 't4', name: 'Frontend skeleton',parentId: 'g2', start: day(0),   end: day(10), progress: 50,  owner: 'John S.' },
  { id: 't5', name: 'API integration',  parentId: 'g2', start: day(7),   end: day(21), progress: 25,  owner: 'Mira K.' },
  { id: 't6', name: 'End-to-end tests', parentId: 'g2', start: day(18),  end: day(28), progress: 0,   owner: 'QA' },
  { id: 'g3', name: 'Release',          isGroup: true,  start: day(28),  end: day(35), progress: 0,   owner: 'PM' },
  { id: 't7', name: 'Staging deploy',   parentId: 'g3', start: day(28),  end: day(31), progress: 0,   owner: 'DevOps' },
  { id: 't8', name: 'Launch',           parentId: 'g3', start: day(34),  end: day(35), progress: 0,   owner: 'PM', isMilestone: true },
];

function wrap(html: string): string {
  return `<div class="w-full">${html}</div>`;
}

export function buildAppGanttData(): ShowcaseItem[] {
  return [
    {
      id: 'gantt',
      title: 'Gantt',
      category: 'App',
      abbr: 'Gt',
      description:
        'MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line (var(--warning)), WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill (bg-primary over bg-primary-subtle). Public props for `dependencies`, `baselines`, `criticalPath`, `workingDays`, `holidays`, `messages`, and the M2 callbacks (`onTaskUpdate`, `onDependencyCreate/Delete`) are accepted but not yet visually wired — they become live in M2 (drag-to-schedule + dependency drawing), M3 (CPM critical-path highlight + hover tooltip), M4 (milestones + baselines + group rollup), M5 (resource leveling + export PNG/PDF/CSV + working-day calendar), and M6 (full keyboard nav + locale). Pixel-identical React sibling at modules/app/Gantt/index.tsx.',
      filePath: 'modules/app/Gantt/Gantt.ejs',
      sourceCode,
      since: '2026-05',
      status: 'beta',
      composes: ['button'],
      designTokens: [
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--text-primary', '--text-secondary',
        '--border', '--border-focus',
        '--primary', '--primary-subtle', '--primary-fg',
        '--warning',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['grid', 'row', 'columnheader', 'gridcell', 'tablist', 'tab'],
        keyboardInteractions: [
          { keys: 'Tab',           action: 'Move focus across scale tabs and collapse buttons' },
          { keys: 'Space / Enter', action: 'Activate scale tab or expand/collapse a WBS group' },
        ],
        notes:
          'Root carries role="grid" with aria-rowcount + aria-colcount. The timeline header row is role="row" with aria-rowindex="1" and each cell is role="columnheader" with aria-colindex. Task bars are role="gridcell" labelled with the task name, dates and % complete. Scale switcher is a role="tablist"/role="tab" pair. Full keyboard parity ships in M6.',
      },
      variants: [
        {
          title: 'Week scale (default)',
          layout: 'stack',
          previewHtml: wrap(renderGantt({
            id: 'gt-demo-week',
            tasks: PROJECT_TASKS,
            scale: 'week',
            ariaLabel: 'Product launch plan',
          })),
          code: `<%- include('modules/app/Gantt', {
  id: 'launch-plan',
  ariaLabel: 'Product launch plan',
  scale: 'week',
  tasks: [
    { id: 'g1', name: 'Design phase',     isGroup: true, start: new Date('2026-05-01'), end: new Date('2026-05-15'), progress: 70 },
    { id: 't1', name: 'Wireframes',       parentId: 'g1', start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
    { id: 't2', name: 'Visual design',    parentId: 'g1', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 80 },
    { id: 'm1', name: 'Launch',           start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true }
  ]
}) %>`,
        },
        {
          title: 'Month scale',
          layout: 'stack',
          previewHtml: wrap(renderGantt({
            id: 'gt-demo-month',
            tasks: PROJECT_TASKS,
            scale: 'month',
            ariaLabel: 'Long-range roadmap',
          })),
          code: `<%- include('modules/app/Gantt', { id: 'roadmap', scale: 'month', tasks: tasks }) %>`,
        },
        {
          title: 'Collapsed group',
          layout: 'stack',
          previewHtml: wrap(renderGantt({
            id: 'gt-demo-collapsed',
            tasks: PROJECT_TASKS.map((t) => t.id === 'g2' ? { ...t, collapsed: true } : t),
            scale: 'week',
            ariaLabel: 'Plan with Implementation collapsed',
          })),
          code: `// Seed any group with \`collapsed: true\` to hide its children at first paint.
<%- include('modules/app/Gantt', {
  id: 'plan', scale: 'week',
  tasks: tasks.map(function (t) { return t.id === 'impl' ? Object.assign({}, t, { collapsed: true }) : t; })
}) %>`,
        },
      ],
    },
  ];
}
