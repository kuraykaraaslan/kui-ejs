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

function renderCalendar(locals: Record<string, unknown>): string {
  return ejs.render(renderSource, locals, { filename: calTemplatePath });
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
        'Month / week / day calendar with view switcher, today/prev/next nav (Page Up/Down + T keyboard), per-event color and icon, all-day bars + timed pills, and TR/EN locales. Pixel-identical React sibling at modules/app/Calendar/index.tsx. Agenda + resource view, drag-create/move/resize, RRULE recurrence, multi-calendar overlay and full a11y/i18n/perf polish land in M2-M6.',
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
      ],
    },
  ];
}
