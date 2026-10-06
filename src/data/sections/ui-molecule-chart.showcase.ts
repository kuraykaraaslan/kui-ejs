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
        'Token-aware primitive chart library at @/modules/ui/Chart. M1 ships seven SVG-based charts (Line, Bar, Area, Pie, Donut, Scatter, SparkLine) that consume a unified `Series` data shape. Colors auto-resolve from --primary / --secondary / --success / --warning / --error / --info, so dark mode and theme swaps work without any extra work. Pixel-identical EJS sibling at modules/ui/Chart/Chart.ejs. GaugeChart, HeatmapChart and the time axis (`xAxis="time"` with drag-to-zoom on Line/Area) have their own pages (gauge-chart, heatmap-chart, time-series-chart); Bar/Area take `stacked`. The remaining M3 stubs (BubbleChart, TreemapChart, RadarChart, FunnelChart, SankeyChart, CandlestickChart) are exported but render null until implemented; see PLANS/38-Charts.md.',
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
