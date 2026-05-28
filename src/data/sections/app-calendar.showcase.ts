import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render path goes through the top-level shim so include() inside resolves
// the split folder partials/JS correctly. The displayed sourceCode is the
// orchestrator entry (Calendar/Calendar.ejs).
const calTemplatePath = path.join(process.cwd(), 'modules/app/Calendar.ejs');
const calIndexPath    = path.join(process.cwd(), 'modules/app/Calendar/Calendar.ejs');
const renderSource    = fs.readFileSync(calTemplatePath, 'utf-8');
const sourceCode      = fs.readFileSync(calIndexPath,    'utf-8');

const miniTemplatePath = path.join(process.cwd(), 'modules/app/MiniCalendar.ejs');
const miniSource       = fs.readFileSync(miniTemplatePath, 'utf-8');

function renderCalendar(locals: Record<string, unknown>): string {
  return ejs.render(renderSource, locals, { filename: calTemplatePath });
}

function renderMiniCalendar(locals: Record<string, unknown>): string {
  return ejs.render(miniSource, locals, { filename: miniTemplatePath });
}

// Anchor to a stable date so the deterministic grid matches the NextJS demo.
const Y = 2026;
const M = 4; // May (0-indexed)
const DEMO_ANCHOR = new Date(Y, M, 13);

function makeEvents() {
  return [
    { id: 'e1', title: 'Design sync',
      start: new Date(Y, M, 11, 10, 0), end: new Date(Y, M, 11, 11, 0),
      color: 'primary', icon: 'fa-video' },
    { id: 'e2', title: 'Coffee with Ada',
      start: new Date(Y, M, 12, 9, 0),  end: new Date(Y, M, 12, 9, 30),
      color: 'success', icon: 'fa-mug-hot' },
    { id: 'e3', title: 'Roadmap review',
      start: new Date(Y, M, 13, 13, 30), end: new Date(Y, M, 13, 15, 0),
      color: 'info' },
    { id: 'e4', title: 'Birthday — Grace',
      start: new Date(Y, M, 14, 0, 0),  end: new Date(Y, M, 14, 23, 59),
      allDay: true, color: 'warning', icon: 'fa-cake-candles' },
    { id: 'e5', title: 'Flight to LHR',
      start: new Date(Y, M, 15, 18, 0), end: new Date(Y, M, 15, 21, 30),
      color: 'secondary', icon: 'fa-plane-departure' },
    { id: 'e6', title: 'Workshop',
      start: new Date(Y, M, 13, 16, 0), end: new Date(Y, M, 13, 17, 30),
      color: 'error', icon: 'fa-graduation-cap' },
    { id: 'e7', title: 'Standup',
      start: new Date(Y, M, 13, 9, 30), end: new Date(Y, M, 13, 10, 0),
      color: 'primary' },
  ];
}

function wrap(html: string): string {
  return `<div class="w-full">${html}</div>`;
}

export function buildAppCalendarData(): ShowcaseItem[] {
  return [
    {
      id: 'calendar',
      title: 'Calendar',
      category: 'App',
      abbr: 'Cl',
      description:
        'Month / week / day / agenda / resource calendar with view switcher, today/prev/next nav (Page Up/Down + T keyboard), per-event color and icon, all-day bars + timed pills, TR/EN locales, full interactions (anchored popover with Edit/Delete, drag-move, edge-resize, drag-create), in-house RRULE expansion (FREQ/INTERVAL/COUNT/UNTIL/BYDAY + exceptions, server-side), multi-calendar overlay with per-calendar visibility legend, ResourceView lanes with O(n²) conflict highlighting, agenda list (search + date grouping) and a composable MiniCalendar sibling (modules/app/MiniCalendar). Pixel-identical React sibling at modules/app/Calendar/index.tsx. Full a11y / i18n / perf polish + IANA timezone land in M6.',
      filePath: 'modules/app/Calendar/Calendar.ejs',
      sourceCode,
      since: '2026-05',
      status: 'beta',
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['Grid (month)', 'Tablist (view switcher)', 'Region (week/day)'],
        keyboardInteractions: [
          { keys: 'Page Up',   action: 'Previous period (month / week / day)' },
          { keys: 'Page Down', action: 'Next period (month / week / day)' },
          { keys: 'T',         action: 'Jump to today' },
        ],
      },
      designTokens: [
        '--primary', '--primary-fg',
        '--success', '--success-fg',
        '--warning', '--error', '--info', '--secondary',
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--border', '--border-focus',
        '--text-primary', '--text-secondary', '--text-disabled',
      ],
      variants: [
        {
          title: 'Month view — Türkçe',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-month',
            view: 'month',
            defaultDate: DEMO_ANCHOR,
            events: makeEvents(),
            locale: 'tr',
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'main-cal',
  view: 'month',
  defaultDate: new Date(2026, 4, 13),
  events: events,
  locale: 'tr'
}) %>`,
        },
        {
          title: 'Week view — working hours shading',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-week',
            view: 'week',
            defaultDate: DEMO_ANCHOR,
            events: makeEvents(),
            locale: 'tr',
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'main-cal',
  view: 'week',
  defaultDate: new Date(2026, 4, 13),
  events: events,
  locale: 'tr',
  workingHours: { start: 9, end: 18, days: [1,2,3,4,5] }
}) %>`,
        },
        {
          title: 'Day view — English',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-day',
            view: 'day',
            defaultDate: DEMO_ANCHOR,
            events: makeEvents(),
            locale: 'en',
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'main-cal',
  view: 'day',
  defaultDate: new Date(2026, 4, 13),
  events: events,
  locale: 'en',
  workingHours: { start: 9, end: 18, days: [1,2,3,4,5] }
}) %>`,
        },
        {
          title: 'Recurring — RRULE expansion',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-rec',
            view: 'week',
            defaultDate: DEMO_ANCHOR,
            locale: 'en',
            slotMinutes: 15,
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
            events: [
              {
                id: 'rec-standup', title: 'Daily standup',
                start: new Date(Y, M, 11, 9, 30), end: new Date(Y, M, 11, 9, 45),
                color: 'primary',
                rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20',
                exceptions: [new Date(Y, M, 13)],
              },
              {
                id: 'one-off', title: 'Roadmap review',
                start: new Date(Y, M, 13, 14, 0), end: new Date(Y, M, 13, 15, 0),
                color: 'info', icon: 'fa-video',
              },
              {
                id: 'rec-coffee', title: 'Coffee with Ada',
                start: new Date(Y, M, 12, 8, 30), end: new Date(Y, M, 12, 9, 0),
                color: 'success', icon: 'fa-mug-hot',
                rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;COUNT=5',
              },
            ],
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'main-cal',
  view: 'week',
  defaultDate: new Date(2026, 4, 13),
  slotMinutes: 15,
  workingHours: { start: 9, end: 18, days: [1,2,3,4,5] },
  events: [
    { id: 'standup', title: 'Daily standup',
      start: new Date(2026, 4, 11, 9, 30), end: new Date(2026, 4, 11, 9, 45),
      rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20',
      exceptions: [new Date(2026, 4, 13)] },
    { id: 'coffee', title: 'Coffee with Ada',
      start: new Date(2026, 4, 12, 8, 30), end: new Date(2026, 4, 12, 9, 0),
      rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;COUNT=5' }
  ]
}) %>`,
        },
        {
          title: 'Interactive — drag, resize, popover',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-interactive',
            view: 'week',
            defaultDate: DEMO_ANCHOR,
            events: makeEvents(),
            locale: 'en',
            slotMinutes: 30,
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
          })),
          code: `<!-- Listen for the CustomEvents the calendar fires on user actions -->
<%- include('modules/app/Calendar', {
  id: 'interactive-cal',
  view: 'week',
  defaultDate: new Date(2026, 4, 13),
  events: events,
  slotMinutes: 30
}) %>
<script>
  var cal = document.getElementById('interactive-cal');
  cal.addEventListener('kui-calendar:event-create', function (ev) {
    console.log('create', ev.detail); // { start, end, dayIndex }
  });
  cal.addEventListener('kui-calendar:event-update', function (ev) {
    console.log('update', ev.detail); // { eventId, start, end }
  });
  cal.addEventListener('kui-calendar:event-delete', function (ev) {
    console.log('delete', ev.detail); // { eventId }
  });
  cal.addEventListener('kui-calendar:event-edit', function (ev) {
    // Open your own edit modal here, then call your API.
    console.log('edit', ev.detail);
  });
</script>`,
        },
        {
          title: 'Resource view — rooms with conflict highlight',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-resource',
            view: 'resource',
            defaultDate: DEMO_ANCHOR,
            locale: 'en',
            slotMinutes: 15,
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
            resources: [
              { id: 'room-a', name: 'Studio A',  color: 'primary' },
              { id: 'room-b', name: 'Studio B',  color: 'success' },
              { id: 'room-c', name: 'Boardroom', color: 'warning' },
            ],
            events: [
              { id: 'r1', title: 'Sprint planning',
                start: new Date(Y, M, 13, 9, 0),  end: new Date(Y, M, 13, 11, 0),
                resourceId: 'room-a' },
              { id: 'r2', title: 'Design crit',
                start: new Date(Y, M, 13, 10, 30), end: new Date(Y, M, 13, 12, 0),
                resourceId: 'room-a' }, // overlaps r1 → ring-error
              { id: 'r3', title: 'Client demo',
                start: new Date(Y, M, 13, 13, 0), end: new Date(Y, M, 13, 14, 0),
                resourceId: 'room-b', icon: 'fa-video' },
              { id: 'r4', title: 'Budget review',
                start: new Date(Y, M, 13, 15, 0), end: new Date(Y, M, 13, 16, 30),
                resourceId: 'room-c' },
              { id: 'r5', title: 'Coffee chat',
                start: new Date(Y, M, 13, 9, 30), end: new Date(Y, M, 13, 10, 0),
                resourceId: 'room-b', icon: 'fa-mug-hot' },
            ],
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'rooms-cal',
  view: 'resource',
  defaultDate: new Date(2026, 4, 13),
  slotMinutes: 15,
  workingHours: { start: 9, end: 18, days: [1,2,3,4,5] },
  resources: [
    { id: 'room-a', name: 'Studio A',  color: 'primary' },
    { id: 'room-b', name: 'Studio B',  color: 'success' },
    { id: 'room-c', name: 'Boardroom', color: 'warning' }
  ],
  events: events // each carries a resourceId
}) %>`,
        },
        {
          title: 'Agenda view — date-grouped + search',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-agenda',
            view: 'agenda',
            defaultDate: DEMO_ANCHOR,
            events: makeEvents(),
            locale: 'en',
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'agenda-cal',
  view: 'agenda',
  defaultDate: new Date(2026, 4, 13),
  events: events,
  locale: 'en'
}) %>`,
        },
        {
          title: 'MiniCalendar sidebar — composes with Calendar via CustomEvent',
          layout: 'stack',
          previewHtml: `
<div class="w-full grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-3 items-start" id="mini-side-demo">
  ${renderMiniCalendar({ id: 'mini-side-mini', value: DEMO_ANCHOR, locale: 'en' })}
  ${renderCalendar({
    id: 'mini-side-main',
    view: 'week',
    defaultDate: DEMO_ANCHOR,
    events: makeEvents(),
    locale: 'en',
    workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
  })}
</div>
<script>
(function () {
  var mini = document.getElementById('mini-side-mini');
  var main = document.getElementById('mini-side-main');
  if (!mini || !main) return;
  mini.addEventListener('kui-minicalendar:change', function (ev) {
    // Re-anchor the main calendar — simplest: set data-current-date + dispatch
    // the date-change event so the existing nav code reuses its handler.
    main.setAttribute('data-current-date', ev.detail.date.toISOString());
  });
})();
</script>`,
          code: `<div class="grid grid-cols-[15rem_1fr] gap-3">
  <%- include('modules/app/MiniCalendar', {
    id: 'mini',
    value: new Date(2026, 4, 13),
    locale: 'en'
  }) %>
  <%- include('modules/app/Calendar', {
    id: 'main',
    view: 'week',
    defaultDate: new Date(2026, 4, 13),
    events: events
  }) %>
</div>
<script>
  // Listen to mini → drive main
  document.getElementById('mini').addEventListener(
    'kui-minicalendar:change',
    function (ev) {
      // Re-render or update the main calendar with the picked date.
      // For SPA-style apps you'd call your route/state handler here.
      console.log('picked', ev.detail.date);
    }
  );
</script>`,
        },
        {
          title: 'Multi-calendar overlay — toggle visibility',
          layout: 'stack',
          previewHtml: wrap(renderCalendar({
            id: 'cal-demo-multi',
            view: 'week',
            defaultDate: DEMO_ANCHOR,
            locale: 'en',
            slotMinutes: 30,
            workingHours: { start: 9, end: 18, days: [1, 2, 3, 4, 5] },
            calendars: [
              { id: 'work',     name: 'Work',     color: 'primary' },
              { id: 'personal', name: 'Personal', color: 'success' },
              { id: 'family',   name: 'Family',   color: 'warning' },
            ],
            events: [
              { id: 'm1', title: 'Design sync',
                start: new Date(Y, M, 11, 10, 0), end: new Date(Y, M, 11, 11, 0),
                calendarId: 'work', icon: 'fa-video' },
              { id: 'm2', title: 'Standup',
                start: new Date(Y, M, 12, 9, 30), end: new Date(Y, M, 12, 10, 0),
                calendarId: 'work' },
              { id: 'm3', title: 'Yoga',
                start: new Date(Y, M, 12, 18, 30), end: new Date(Y, M, 12, 19, 30),
                calendarId: 'personal' },
              { id: 'm4', title: 'Dinner — parents',
                start: new Date(Y, M, 14, 19, 0), end: new Date(Y, M, 14, 21, 0),
                calendarId: 'family', icon: 'fa-mug-hot' },
              { id: 'm5', title: 'Doctor',
                start: new Date(Y, M, 13, 14, 0), end: new Date(Y, M, 13, 15, 0),
                calendarId: 'personal' },
            ],
          })),
          code: `<%- include('modules/app/Calendar', {
  id: 'multi-cal',
  view: 'week',
  defaultDate: new Date(2026, 4, 13),
  calendars: [
    { id: 'work',     name: 'Work',     color: 'primary' },
    { id: 'personal', name: 'Personal', color: 'success' },
    { id: 'family',   name: 'Family',   color: 'warning' }
  ],
  events: events // each carries a calendarId
}) %>
<script>
  // Listen for visibility toggles fired by the chip-style legend.
  document.getElementById('multi-cal').addEventListener(
    'kui-calendar:calendar-toggle',
    function (ev) { console.log(ev.detail); /* { calendarId, visible } */ }
  );
</script>`,
        },
      ],
    },
  ];
}
