# Gantt

- **id:** `gantt`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Gantt/Gantt.ejs`
- **status:** beta
- **since:** 2026-05

MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line (var(--warning)), WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill (bg-primary over bg-primary-subtle). Public props for `dependencies`, `baselines`, `criticalPath`, `workingDays`, `holidays`, `messages`, and the M2 callbacks (`onTaskUpdate`, `onDependencyCreate/Delete`) are accepted but not yet visually wired — they become live in M2 (drag-to-schedule + dependency drawing), M3 (CPM critical-path highlight + hover tooltip), M4 (milestones + baselines + group rollup), M5 (resource leveling + export PNG/PDF/CSV + working-day calendar), and M6 (full keyboard nav + locale). Pixel-identical React sibling at modules/app/Gantt/index.tsx.

## Depends on (include order)

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: grid, row, columnheader, gridcell, tablist, tab
- Keyboard:
  - `Tab` — Move focus across scale tabs and collapse buttons
  - `Space / Enter` — Activate scale tab or expand/collapse a WBS group

Root carries role="grid" with aria-rowcount + aria-colcount. The timeline header row is role="row" with aria-rowindex="1" and each cell is role="columnheader" with aria-colindex. Task bars are role="gridcell" labelled with the task name, dates and % complete. Scale switcher is a role="tablist"/role="tab" pair. Full keyboard parity ships in M6.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--primary-fg`
- `--warning`

## Variants

### Week scale (default)

```ejs
<%- include('modules/app/Gantt', {
  id: 'launch-plan',
  ariaLabel: 'Product launch plan',
  scale: 'week',
  tasks: [
    { id: 'g1', name: 'Design phase',     isGroup: true, start: new Date('2026-05-01'), end: new Date('2026-05-15'), progress: 70 },
    { id: 't1', name: 'Wireframes',       parentId: 'g1', start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
    { id: 't2', name: 'Visual design',    parentId: 'g1', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 80 },
    { id: 'm1', name: 'Launch',           start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true }
  ]
}) %>
```

### Month scale

```ejs
<%- include('modules/app/Gantt', { id: 'roadmap', scale: 'month', tasks: tasks }) %>
```

### Collapsed group

```ejs
// Seed any group with `collapsed: true` to hide its children at first paint.
<%- include('modules/app/Gantt', {
  id: 'plan', scale: 'week',
  tasks: tasks.map(function (t) { return t.id === 'impl' ? Object.assign({}, t, { collapsed: true }) : t; })
}) %>
```

## Full EJS source

```ejs
<%
  // ── Gantt EJS (M1 — Timeline + bars) ─────────────────────────────────
  // Pixel-identical to modules/app/Gantt/index.tsx in 01_NextJS_Components.
  // Scale switcher + today line + WBS tree + horizontally-scrolling timeline
  // with absolutely-positioned task bars + progress fill.
  // Future milestones (M2 drag, M3 deps + CPM, M4 milestones + baseline,
  // M5 export + calendar, M6 a11y + i18n) extend without breaking the M1
  // surface. Stubs for M2+ live alongside as comments.
  var _id        = locals.id        || 'gt-' + Math.random().toString(36).substr(2, 9);
  var _tasks     = locals.tasks     || [];
  var _scale     = locals.scale     || 'week';
  // dependencies (TODO M2 stub — accepted but not rendered).
  // baselines    (TODO M4 stub).
  // workingDays  (TODO M5 stub).
  // holidays     (TODO M5 stub).
  // criticalPath (TODO M3 stub).
  var _ariaLabel = locals.ariaLabel || 'Gantt chart';
  var _msg = Object.assign({
    today: 'Today',
    scaleDay: 'Day', scaleWeek: 'Week', scaleMonth: 'Month',
    scaleQuarter: 'Quarter', scaleYear: 'Year',
    taskColumn: 'Task', ownerColumn: 'Owner', progressColumn: '%'
  }, locals.messages || {});

  // ── Pixels-per-day per scale — must match types.ts PIXELS_PER_DAY. ──
  var PPD = { day: 32, week: 14, month: 6, quarter: 2.5, year: 1.2 };
  var BAR_HEIGHT = 24;
  var ROW_HEIGHT = 36;
  var SIDE_PANEL_WIDTH = 320;
  var ppd = PPD[_scale] || PPD.week;

  var MS_PER_DAY = 86400000;
  function startOfDay(d) { var c = new Date(d); c.setHours(0,0,0,0); return c; }
  function diffDays(a, b) { return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY); }
  function addDays(d, n) { var c = new Date(d); c.setDate(c.getDate() + n); return c; }

  // ── Range computation ────────────────────────────────────────────────
  var rangeStart, rangeEnd;
  if (_tasks.length === 0) {
    var today = startOfDay(new Date());
    rangeStart = addDays(today, -7);
    rangeEnd   = addDays(today,  30);
  } else {
    var minMs = Infinity, maxMs = -Infinity;
    _tasks.forEach(function (t) {
      var s = new Date(t.start).getTime();
      var e = new Date(t.end).getTime();
      if (s < minMs) minMs = s;
      if (e > maxMs) maxMs = e;
    });
    rangeStart = addDays(startOfDay(new Date(minMs)), -3);
    rangeEnd   = addDays(startOfDay(new Date(maxMs)),  3);
  }

  var MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function isoWeek(d) {
    var target = new Date(d.valueOf());
    var dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  // ── Build header columns ─────────────────────────────────────────────
  var columns = [];
  var cur;
  if (_scale === 'day') {
    cur = new Date(rangeStart);
    while (cur < rangeEnd) {
      var next = addDays(cur, 1);
      columns.push({ start: new Date(cur), end: next, label: String(cur.getDate()), subLabel: MONTH_NAMES_SHORT[cur.getMonth()], width: ppd });
      cur = next;
    }
  } else if (_scale === 'week') {
    cur = new Date(rangeStart);
    var dow = (cur.getDay() + 6) % 7;
    cur = addDays(cur, -dow);
    while (cur < rangeEnd) {
      var next = addDays(cur, 7);
      var days = Math.min(7, diffDays(cur, rangeEnd));
      columns.push({ start: new Date(cur), end: next, label: 'W' + isoWeek(cur), subLabel: MONTH_NAMES_SHORT[cur.getMonth()] + ' ' + cur.getDate(), width: days * ppd });
      cur = next;
    }
  } else if (_scale === 'month') {
    cur = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    while (cur < rangeEnd) {
      var next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      var days = diffDays(cur, next);
      columns.push({ start: new Date(cur), end: next, label: MONTH_NAMES_SHORT[cur.getMonth()], subLabel: String(cur.getFullYear()), width: days * ppd });
      cur = next;
    }
  } else if (_scale === 'quarter') {
    var startQ = Math.floor(rangeStart.getMonth() / 3);
    cur = new Date(rangeStart.getFullYear(), startQ * 3, 1);
    while (cur < rangeEnd) {
      var next = new Date(cur.getFullYear(), cur.getMonth() + 3, 1);
      var days = diffDays(cur, next);
      columns.push({ start: new Date(cur), end: next, label: 'Q' + (Math.floor(cur.getMonth() / 3) + 1), subLabel: String(cur.getFullYear()), width: days * ppd });
      cur = next;
    }
  } else { // year
    cur = new Date(rangeStart.getFullYear(), 0, 1);
    while (cur < rangeEnd) {
      var next = new Date(cur.getFullYear() + 1, 0, 1);
      var days = diffDays(cur, next);
      columns.push({ start: new Date(cur), end: next, label: String(cur.getFullYear()), width: days * ppd });
      cur = next;
    }
  }
  var baselineStart = columns[0] ? columns[0].start : rangeStart;
  var totalWidth = columns.reduce(function (sum, c) { return sum + c.width; }, 0);

  // ── Flatten WBS tree (depth-first) ───────────────────────────────────
  var ids = {};
  _tasks.forEach(function (t) { ids[t.id] = true; });
  var byParent = {};
  _tasks.forEach(function (t) {
    var key = (t.parentId && ids[t.parentId]) ? t.parentId : '__root__';
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(t);
  });
  var collapsedIds = {};
  _tasks.forEach(function (t) { if (t.collapsed) collapsedIds[t.id] = true; });
  var flatRows = [];
  function walk(parentKey, depth) {
    var children = byParent[parentKey] || [];
    children.forEach(function (c) {
      var hasChildren = !!(byParent[c.id] && byParent[c.id].length);
      flatRows.push({ task: c, depth: depth, hasChildren: hasChildren });
      if (hasChildren && !collapsedIds[c.id]) walk(c.id, depth + 1);
    });
  }
  walk('__root__', 0);
  var totalHeight = flatRows.length * ROW_HEIGHT;

  // ── Today line position ──────────────────────────────────────────────
  var todayDate = new Date();
  var todayLeft = -1;
  if (todayDate >= rangeStart && todayDate <= rangeEnd) {
    todayLeft = diffDays(baselineStart, todayDate) * ppd;
  }

  var SCALES = ['day', 'week', 'month', 'quarter', 'year'];
  var SCALE_LABEL = { day: _msg.scaleDay, week: _msg.scaleWeek, month: _msg.scaleMonth, quarter: _msg.scaleQuarter, year: _msg.scaleYear };
%>
<div
  id="<%= _id %>"
  role="grid"
  aria-label="<%= _ariaLabel %>"
  aria-rowcount="<%= flatRows.length + 1 %>"
  aria-colcount="<%= columns.length %>"
  data-gantt-id="<%= _id %>"
  data-gantt-scale="<%= _scale %>"
  class="gantt-root w-full flex flex-col rounded-lg border border-border bg-surface-base overflow-hidden"
>
  <!-- ── Toolbar: scale switcher + today label ──────────────────────── -->
  <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-surface-raised">
    <div class="flex items-center gap-2 text-text-primary">
      <i class="fa-solid fa-calendar w-3.5 h-3.5 text-text-secondary" aria-hidden="true" style="font-size:0.875rem"></i>
      <h2 class="text-sm font-semibold">
        <%= _msg.today %>: <span class="tabular-nums font-normal text-text-secondary"><%= todayDate.toLocaleDateString() %></span>
      </h2>
    </div>
    <div role="tablist" aria-label="Timeline scale" class="inline-flex items-center rounded-md border border-border bg-surface-base p-0.5">
      <% SCALES.forEach(function (s) {
           var active = s === _scale;
           var cls = active ? 'bg-primary text-primary-fg' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay';
      %>
        <button type="button"
          role="tab"
          aria-selected="<%= active ? 'true' : 'false' %>"
          data-kui-gantt-scale="<%= s %>"
          class="px-2.5 py-1 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= cls %>">
          <%= SCALE_LABEL[s] %>
        </button>
      <% }); %>
    </div>
    <%# TODO M5: export menu (PNG / PDF / CSV). %>
    <%# TODO M3: critical-path toggle. %>
  </div>

  <!-- ── Body ───────────────────────────────────────────────────────── -->
  <div class="flex w-full max-h-[32rem]">
    <!-- Left: WBS panel -->
    <div data-gantt-side="1" class="overflow-y-auto overflow-x-hidden scrollbar-hide">
      <%- include('./partials/_task-list', { _id: _id, flatRows: flatRows, _msg: _msg, ROW_HEIGHT: ROW_HEIGHT, SIDE_PANEL_WIDTH: SIDE_PANEL_WIDTH, totalHeight: totalHeight, collapsedIds: collapsedIds }) %>
    </div>

    <!-- Right: timeline -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- Sticky header (horizontal scroll mirrors body) -->
      <div data-gantt-header="1" class="overflow-hidden border-b border-border">
        <%- include('./partials/_timeline-header', { columns: columns, totalWidth: totalWidth }) %>
      </div>
      <!-- Scrollable body -->
      <div data-gantt-timeline="1" class="relative flex-1 overflow-auto">
        <div class="relative" style="width: <%= totalWidth %>px; height: <%= totalHeight %>px;">
          <!-- Row backgrounds -->
          <% flatRows.forEach(function (row, i) {
               var bg = (i % 2 === 1) ? 'bg-surface-overlay/40' : 'bg-transparent';
          %>
            <div aria-hidden="true"
              class="absolute left-0 right-0 border-b border-border/60 <%= bg %>"
              style="top: <%= i * ROW_HEIGHT %>px; height: <%= ROW_HEIGHT %>px; width: <%= totalWidth %>px;"></div>
          <% }); %>

          <!-- Today line -->
          <%- include('./partials/_today-line', { todayLeft: todayLeft, totalHeight: totalHeight }) %>

          <!-- Task bars -->
          <% flatRows.forEach(function (row, i) {
               var task = row.task;
               var startOffsetDays = diffDays(baselineStart, new Date(task.start));
               var durationDays    = Math.max(1, diffDays(new Date(task.start), new Date(task.end)));
               var left            = startOffsetDays * ppd;
               var width           = durationDays * ppd;
               var top             = (i * ROW_HEIGHT) + (ROW_HEIGHT - BAR_HEIGHT) / 2;
               var progress        = Math.max(0, Math.min(100, task.progress || 0));
          %>
            <%- include('./partials/_bar', { task: task, left: left, width: width, top: top, height: BAR_HEIGHT, progress: progress }) %>
          <% }); %>

          <%# TODO M2: <svg> overlay for dependency arrows. %>
          <%# TODO M4: baseline ghost bars + milestone diamonds. %>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
(function () {
  var GT_ID = '<%= _id %>';
  var root = document.getElementById(GT_ID);
  if (!root) return;

  <%- include('./scripts/scale.js') %>
  <%- include('./scripts/scroll.js') %>
  <%- include('./scripts/zoom.js') %>
})();
</script>

```
