import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// Chart (EJS sibling of kui-react modules/ui/Chart). One partial dispatches to
// the per-type partials. Gauge, heatmap and the time axis have their own pages
// (ui-primitive-chart-singles.showcase.ts), same as kui-react.
export const chartPath   = path.join(process.cwd(), 'modules/ui/Chart/Chart.ejs');
export const chartSource = fs.readFileSync(chartPath, 'utf-8');

export function renderChart(locals: Record<string, unknown>): string {
  return ejs.render(chartSource, locals, { filename: chartPath });
}

export const frame = (title: string, inner: string) =>
  `<div class="w-full rounded-xl border border-border bg-surface-raised p-4 shadow-sm"><p class="mb-2 text-xs font-medium text-text-secondary">${title}</p>${inner}</div>`;

// ── demo data (same shapes and numbers as the kui-react showcase) ──────────
const lineSeries = [
  { id: 'active', name: 'Active users', data: [['Mon', 1200], ['Tue', 1900], ['Wed', 1500], ['Thu', 2300], ['Fri', 2100], ['Sat', 2800], ['Sun', 1700]].map(([x, y]) => ({ x, y })) },
  { id: 'signups', name: 'New signups', data: [['Mon', 300], ['Tue', 480], ['Wed', 220], ['Thu', 560], ['Fri', 410], ['Sat', 690], ['Sun', 320]].map(([x, y]) => ({ x, y })) },
];

const barSeries = [
  { id: 'revenue', name: 'Revenue', data: [['Jan', 4200], ['Feb', 5800], ['Mar', 4900], ['Apr', 7100], ['May', 6300], ['Jun', 8400]].map(([x, y]) => ({ x, y })) },
  { id: 'expenses', name: 'Expenses', data: [['Jan', 2800], ['Feb', 3200], ['Mar', 3600], ['Apr', 4100], ['May', 3900], ['Jun', 4700]].map(([x, y]) => ({ x, y })) },
];

const pieSeries = [
  { id: 'category-share', name: 'Category share', data: [['Electronics', 35], ['Clothing', 25], ['Food', 20], ['Books', 12], ['Other', 8]].map(([x, y]) => ({ x, y })) },
];

// Settings surface (kui-react phase 21): two value axes, marks, stacks, markers, crowded labels.
const powerSeries = [
  { id: 'load', name: 'Load (kW)', data: [212, 248, 263, 351, 298, 276, 240].map((y, i) => ({ x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], y })), showPoints: true, pointShape: 'diamond' },
  { id: 'temp', name: 'Outside (°C)', data: [16.6, 18.2, 21.4, 25.3, 23.1, 19.8, 17.5].map((y, i) => ({ x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], y })), yAxis: 'right', lineStyle: 'dashed', showPoints: true, pointShape: 'square' },
];
const gradientSeries = [
  { id: 'visits', name: 'Visits', data: [320, 410, 380, 520, 610, 580, 690].map((y, i) => ({ x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], y })), fillGradient: true, fillOpacity: 0.35 },
];
const groupedSeries = [
  { id: 'north-a', name: 'North A', stack: 'north', data: [['Q1', 30], ['Q2', 42], ['Q3', 38], ['Q4', 51]].map(([x, y]) => ({ x, y })) },
  { id: 'north-b', name: 'North B', stack: 'north', data: [['Q1', 18], ['Q2', 22], ['Q3', 25], ['Q4', 20]].map(([x, y]) => ({ x, y })) },
  { id: 'south', name: 'South', data: [['Q1', 41], ['Q2', 35], ['Q3', 47], ['Q4', 56]].map(([x, y]) => ({ x, y })) },
];
const histogram = [{ id: 'bins', name: 'Requests', data: [4, 9, 17, 28, 34, 26, 15, 8, 3].map((y, i) => ({ x: String(i * 50), y })) }];
const dailySeries = [{ id: 'daily', name: 'Orders', data: Array.from({ length: 30 }, (_, i) => ({ x: `${i + 1} Oct`, y: 40 + ((i * 37) % 23) + (i % 7) * 3 })) }];
const horizontalSeries = [{ id: 'lang', name: 'Share', data: [['TypeScript', 38], ['Python', 27], ['Go', 14], ['Rust', 11], ['Java', 10]].map(([x, y]) => ({ x, y })) }];

const sparkValues = [12, 14, 11, 17, 19, 16, 22, 21, 24, 27, 23, 29];
const toSpark = (values: number[]) => [{ id: 'spark', name: 'spark', data: values.map((y, i) => ({ x: i, y })) }];

// Fixed-size inline wrapper (react SparkLine: inline-block align-middle, width x height).
const spark = (id: string, values: number[], filled: boolean) =>
  `<span class="inline-block align-middle" style="width: 120px; height: 28px;">${renderChart({ id, type: 'sparkline', series: toSpark(values), height: 28, filled, showLegend: false, ariaLabel: 'Sparkline' })}</span>`;

export function buildChartData(): ShowcaseItem[] {
  return [
    {
      id: 'chart',
      title: 'Chart',
      category: 'Molecule',
      abbr: 'Ch',
      description:
        'Token-aware primitive chart library, the EJS sibling of kui-react `@/modules/ui/Chart` (modules/ui/Chart/Chart.ejs). Line, Bar, Area, Pie, Donut and SparkLine consume one `Series` data shape; colours come from --primary / --secondary / --success / --warning / --error / --info, so dark mode and theme swaps need no extra work. Value axes widen to round bounds with readable steps (never 263.25 on a 0-351 axis; `yTickCount` sets about how many intervals); crowded category labels are thinned so they never overlap. Line / Area / Bar share the settings surface: a right value axis (`series[].yAxis: \'right\'`, `y2Min` / `y2Max` / `y2Label`, aligned to the left grid), `yMin` / `yMax`, axis titles, thresholds, `gridStyle` (dashed by default), `showXAxis` / `showYAxis`, legend position / values / toggling, tooltip mode, header, value format and stack total, and `fill` (take the parent\'s height). Line / Area add curves (smooth, linear, step), per-series stroke style, point marks (circle, square, diamond, triangle, `pointSize`) and gradient fills; Bar adds grouped stacks (`series[].stack`), horizontal bars, value labels, category ticks and markers. Pie / Donut take slice labels (inside or outside), a slice gap, the start angle, a centre caption and legend values. GaugeChart, HeatmapChart and the time axis (`xAxis: \'time\'` with drag-to-zoom) have their own pages. Format options are the NAME of a global function, since the config travels as JSON.',
      filePath: 'modules/ui/Chart/Chart.ejs',
      sourceCode: chartSource,
      since: '2026-05',
      status: 'beta',
      relatedTo: ['charts'],
      designTokens: ['--primary', '--secondary', '--success', '--warning', '--error', '--info', '--surface-raised', '--border', '--text-primary', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['img'],
        notes: 'Each chart SVG uses role="img" + aria-label. M5 will add a visually hidden data table for screen-reader parity and keyboard navigation between data points.',
      },
      variants: [
        {
          title: 'LineChart',
          layout: 'stack' as const,
          previewHtml: frame('Daily active users vs new signups', renderChart({ id: 'ch-demo-line', type: 'line', series: lineSeries, height: 220 })),
          code: `<%- include('modules/ui/Chart/Chart', { id: 'activity', type: 'line', series: series, height: 220 }) %>`,
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
          title: 'BarChart',
          layout: 'stack' as const,
          previewHtml: frame('Revenue vs expenses (monthly)', renderChart({ id: 'ch-demo-bar', type: 'bar', series: barSeries, height: 220 })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'bar', series: series }) %>`,
        },
        {
          title: 'AreaChart',
          layout: 'stack' as const,
          previewHtml: frame('Engagement over the week (smoothed)', renderChart({ id: 'ch-demo-area', type: 'area', series: lineSeries, height: 220, fillOpacity: 0.18 })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'area', series: series, fillOpacity: 0.18 }) %>`,
        },
        {
          title: 'PieChart',
          layout: 'stack' as const,
          previewHtml: frame('Sales by category', renderChart({ id: 'ch-demo-pie', type: 'pie', series: pieSeries, height: 220 })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'pie', series: pieSeries }) %>`,
        },
        {
          title: 'DonutChart',
          layout: 'stack' as const,
          previewHtml: frame('Sales by category (donut)', renderChart({ id: 'ch-demo-donut', type: 'donut', series: pieSeries, height: 220, innerRadius: 0.62 })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'donut', series: pieSeries, innerRadius: 0.62 }) %>`,
        },
        {
          title: 'Right axis, point marks and a gradient fill',
          layout: 'stack' as const,
          previewHtml: frame(
            'Load (left) vs outside temperature (right axis), limit line',
            renderChart({ id: 'ch-demo-right', type: 'line', series: powerSeries, height: 220, yLabel: 'kW', y2Label: '°C', thresholds: [{ value: 320, label: 'Limit' }] })
              + `<div class="mt-3">${renderChart({ id: 'ch-demo-gradient', type: 'area', series: gradientSeries, height: 180, showValues: true, gridStyle: 'dotted', showLegend: false })}</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'line', series: [load, { ...temp, yAxis: 'right' }], yLabel: 'kW', y2Label: '°C',
  thresholds: [{ value: 320, label: 'Limit' }] }) %>
<%- include('modules/ui/Chart/Chart', { type: 'area', series: [{ ...visits, fillGradient: true }], showValues: true, gridStyle: 'dotted' }) %>`,
        },
        {
          title: 'Grouped stacks, markers and crowded labels',
          layout: 'stack' as const,
          previewHtml: frame(
            'North A + B stacked beside South; a histogram with its mean; 30 days thinned; horizontal bars',
            renderChart({ id: 'ch-demo-groups', type: 'bar', series: groupedSeries, height: 200, showValues: true, tooltipTotal: true })
              + `<div class="mt-3">${renderChart({ id: 'ch-demo-hist', type: 'bar', series: histogram, height: 180, barWidth: 1, barGap: 0, radius: 0, markers: [{ at: 4.2, label: 'Mean 210 ms' }], showLegend: false, xLabel: 'Latency (ms)' })}</div>`
              + `<div class="mt-3">${renderChart({ id: 'ch-demo-daily', type: 'bar', series: dailySeries, height: 180, showLegend: false, yTickCount: 3 })}</div>`
              + `<div class="mt-3">${renderChart({ id: 'ch-demo-horizontal', type: 'bar', series: horizontalSeries, orientation: 'horizontal', showValues: true, height: 180, showLegend: false })}</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'bar', series: [{ ...a, stack: 'north' }, { ...b, stack: 'north' }, south], showValues: true, tooltipTotal: true }) %>
<%- include('modules/ui/Chart/Chart', { type: 'bar', series: bins, barWidth: 1, barGap: 0, radius: 0, markers: [{ at: 4.2, label: 'Mean 210 ms' }] }) %>
<%- include('modules/ui/Chart/Chart', { type: 'bar', series: thirtyDays, yTickCount: 3 }) %>
<%- include('modules/ui/Chart/Chart', { type: 'bar', series: share, orientation: 'horizontal', showValues: true }) %>`,
        },
        {
          title: 'Pie and donut labels',
          layout: 'stack' as const,
          previewHtml: frame(
            'Outside labels with a grid legend; donut with a caption, a slice gap and shares in the legend',
            `<div class="space-y-4">`
              + renderChart({ id: 'ch-demo-pie-labels', type: 'pie', series: pieSeries, height: 220, labels: 'name-percent', labelPosition: 'outside', legendLayout: 'grid' })
              + renderChart({ id: 'ch-demo-donut-center', type: 'donut', series: pieSeries, height: 220, centerLabel: 'Total', sliceGap: 3, legendValue: 'percent', legendPosition: 'right' })
              + `</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'pie', series: pieSeries, labels: 'name-percent', labelPosition: 'outside', legendLayout: 'grid' }) %>
<%- include('modules/ui/Chart/Chart', { type: 'donut', series: pieSeries, centerLabel: 'Total', sliceGap: 3, legendValue: 'percent', legendPosition: 'right' }) %>`,
        },
        {
          title: 'SparkLine',
          layout: 'stack' as const,
          previewHtml: frame(
            'Inline sparklines',
            `<div class="flex items-center gap-4 text-sm text-text-primary"><span>MRR&nbsp;</span>${spark('ch-demo-spark-1', sparkValues, true)}<span class="ml-2 font-medium text-success">+24%</span></div>`
              + `<div class="mt-3 flex items-center gap-4 text-sm text-text-primary"><span>DAU&nbsp;</span>${spark('ch-demo-spark-2', [5, 7, 6, 9, 8, 11, 10, 13], false)}<span class="ml-2 font-medium text-success">+8%</span></div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'sparkline', series: [{ id: 'spark', name: 'spark', data: values }], height: 28, filled: true }) %>
<%- include('modules/ui/Chart/Chart', { type: 'sparkline', series: [{ id: 'spark', name: 'spark', data: values2 }], height: 28 }) %>`,
        },
      ],
    },
  ];
}
