import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// Chart (EJS sibling of kui-react modules/ui/Chart). One partial dispatches to
// the per-type partials; line/area with `xAxis: 'time'` and the heatmap are
// drawn client-side from `data-kui-chart-config`, the gauge is server-rendered.
const chartPath   = path.join(process.cwd(), 'modules/ui/Chart/Chart.ejs');
const chartSource = fs.readFileSync(chartPath, 'utf-8');

function renderChart(locals: Record<string, unknown>): string {
  return ejs.render(chartSource, locals, { filename: chartPath });
}

const frame = (title: string, inner: string) =>
  `<div class="w-full rounded-xl border border-border bg-surface-raised p-4 shadow-sm"><p class="mb-2 text-xs font-medium text-text-secondary">${title}</p>${inner}</div>`;

// ── demo data (same shapes and numbers as the kui-react showcase) ──────────
const lineSeries = [
  { id: 'active', name: 'Active users', data: [['Mon', 1200], ['Tue', 1900], ['Wed', 1500], ['Thu', 2300], ['Fri', 2100], ['Sat', 2800], ['Sun', 1700]].map(([x, y]) => ({ x, y })) },
  { id: 'signups', name: 'New signups', data: [['Mon', 300], ['Tue', 480], ['Wed', 220], ['Thu', 560], ['Fri', 410], ['Sat', 690], ['Sun', 320]].map(([x, y]) => ({ x, y })) },
];

// Telemetry: uneven sampling instants on one time axis (ISO strings).
const T0 = Date.UTC(2026, 9, 6, 8, 0, 0);
const tempSeries = [
  {
    id: 'temp',
    name: 'Temperature',
    data: Array.from({ length: 60 }, (_, i) => ({
      x: new Date(T0 + i * 7 * 60_000 + (i % 3) * 20_000).toISOString(),
      y: Math.round((21 + Math.sin(i / 6) * 3 + (i % 5) * 0.2) * 10) / 10,
    })),
  },
  {
    id: 'setpoint',
    name: 'Setpoint',
    data: [
      { x: new Date(T0).toISOString(), y: 22 },
      { x: new Date(T0 + 3 * 3_600_000).toISOString(), y: 22 },
      { x: new Date(T0 + 7 * 3_600_000).toISOString(), y: 20 },
    ],
  },
];

const barSeries = [
  { id: 'revenue', name: 'Revenue', data: [['Jan', 4200], ['Feb', 5800], ['Mar', 4900], ['Apr', 7100], ['May', 6300], ['Jun', 8400]].map(([x, y]) => ({ x, y })) },
  { id: 'expenses', name: 'Expenses', data: [['Jan', 2800], ['Feb', 3200], ['Mar', 3600], ['Apr', 4100], ['May', 3900], ['Jun', 4700]].map(([x, y]) => ({ x, y })) },
];

const heatCells = Array.from({ length: 7 * 24 }, (_, i) => {
  const day = Math.floor(i / 24);
  const hour = i % 24;
  return {
    x: String(hour).padStart(2, '0'),
    y: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    value: i % 37 === 0 ? null : Math.round(40 + 35 * Math.sin(hour / 4) + day * 3),
  };
});

const gaugeBands = [{ to: 60, tone: 'success' }, { to: 85, tone: 'warning' }, { to: 100, tone: 'error' }];

// `yFormat` / `valueFormat` travel as the NAME of a global function (the config is JSON).
const FMT_SCRIPT = `<script>window.kuiFmtCelsius = function (v) { return (Math.round(v * 10) / 10) + '\\u00b0C'; };</script>`;

export function buildChartData(): ShowcaseItem[] {
  return [
    {
      id: 'chart',
      title: 'Chart',
      category: 'Molecule',
      abbr: 'Ch',
      description:
        'Token-aware SVG chart partial. `type` is line, bar, area, pie, donut, sparkline, gauge or heatmap. Colors resolve from --primary / --secondary / --success / --warning / --error / --info, so dark mode works without extra work. Line and area take `xAxis: \'time\'` for a continuous time axis with drag-to-zoom (double-click or the reset button leaves the zoom; it never reaches the page), bar and area take `stacked`, the gauge is a role="meter" half-donut with threshold bands and the heatmap draws missing values as empty cells. Pixel-identical sibling of kui-react modules/ui/Chart.',
      filePath: 'modules/ui/Chart/Chart.ejs',
      sourceCode: chartSource,
      since: '2026-05',
      status: 'beta',
      relatedTo: ['charts'],
      designTokens: ['--primary', '--secondary', '--success', '--warning', '--error', '--info', '--border', '--border-strong', '--surface-raised', '--text-primary', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['img', 'meter', 'tooltip'],
        notes: 'Charts are role="img" with an aria-label; the gauge is role="meter" with aria-valuemin / -max / -now (clamped) and aria-valuetext (real value, unit, band, stale). The zoom reset is a real button.',
      },
      variants: [
        {
          title: 'LineChart (band axis)',
          layout: 'stack' as const,
          previewHtml: frame('Weekly activity', renderChart({ id: 'ch-demo-line', type: 'line', series: lineSeries, height: 220 })),
          code: `<%- include('modules/ui/Chart/Chart', { id: 'activity', type: 'line', series: series, height: 220 }) %>`,
        },
        {
          title: 'Time axis + drag-to-zoom (xAxis: "time")',
          layout: 'stack' as const,
          previewHtml: frame(
            'Temperature (drag a range to zoom, double-click to reset)',
            FMT_SCRIPT + renderChart({ id: 'ch-demo-time', type: 'line', xAxis: 'time', yFormat: 'kuiFmtCelsius', series: tempSeries, height: 240 }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', {
  id: 'temp',
  type: 'line',
  xAxis: 'time',          // 'xScale' is an alias; xAxis wins
  yFormat: 'fmtCelsius',  // NAME of a global function: window.fmtCelsius = (v) => v + '°C'
  series: [{ id: 'temp', name: 'Temperature', data: [{ x: '2026-10-06T08:00:00Z', y: 21.4 }, /* … */] }],
}) %>`,
        },
        {
          title: 'Stacked bars and areas',
          layout: 'stack' as const,
          previewHtml: frame(
            'Revenue + expenses, stacked',
            renderChart({ id: 'ch-demo-stack-bar', type: 'bar', stacked: true, series: barSeries, height: 200 })
              + `<div class="mt-3">${renderChart({ id: 'ch-demo-stack-area', type: 'area', stacked: true, series: barSeries, height: 200 })}</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'bar', stacked: true, series: series }) %>
<%- include('modules/ui/Chart/Chart', { type: 'area', stacked: true, series: series }) %>`,
        },
        {
          title: 'GaugeChart',
          layout: 'stack' as const,
          previewHtml: frame(
            'Gauges with threshold bands',
            `<div class="flex flex-wrap items-end gap-6">`
              + renderChart({ id: 'ch-demo-gauge-1', type: 'gauge', value: 34, unit: '%', label: 'CPU', bands: gaugeBands })
              + renderChart({ id: 'ch-demo-gauge-2', type: 'gauge', value: 91, unit: '%', label: 'Disk', needle: true, bands: gaugeBands })
              + renderChart({ id: 'ch-demo-gauge-3', type: 'gauge', value: 72, size: 'sm', label: 'Stale reading', stale: true })
              + `</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', {
  type: 'gauge', value: 91, min: 0, max: 100, unit: '%', label: 'Disk', needle: true,
  bands: [{ to: 60, tone: 'success' }, { to: 85, tone: 'warning' }, { to: 100, tone: 'error' }],
}) %>`,
        },
        {
          title: 'HeatmapChart',
          layout: 'stack' as const,
          previewHtml: frame(
            'Messages per hour (missing values are empty cells, never 0)',
            renderChart({ id: 'ch-demo-heat', type: 'heatmap', cells: heatCells, height: 220, valueLabel: 'Messages' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', {
  type: 'heatmap',
  cells: [{ x: '08', y: 'Mon', value: 42 }, { x: '09', y: 'Mon', value: null } /* … */],
  valueLabel: 'Messages',
}) %>`,
        },
      ],
    },
  ];
}
