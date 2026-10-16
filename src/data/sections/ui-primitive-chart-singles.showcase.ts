import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import { chartSource, renderChart, frame } from './ui-molecule-chart.showcase';

const gaugeSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Chart/partials/_gauge.ejs'), 'utf-8');

// GaugeChart, HeatmapChart and the time axis of Line/Area: own pages, same split as
// kui-react (ui-primitive-chart-singles.showcase.tsx). All three render through
// the one Chart partial (modules/ui/Chart/Chart.ejs).

// ── Deterministic demo data (no Math.random, no Date.now) ───────────
const BANDS = [
  { to: 60, tone: 'success' },
  { to: 85, tone: 'warning' },
  { to: 100, tone: 'error' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
/** 7 days x 24 hours; every 37th cell is missing (null), never 0. */
const heatCells = Array.from({ length: 7 * 24 }, (_, i) => {
  const day = Math.floor(i / 24);
  const hour = i % 24;
  return { x: String(hour).padStart(2, '0'), y: DAYS[day], value: i % 37 === 0 ? null : Math.round(40 + 35 * Math.sin(hour / 4) + day * 3) };
});
/** 3 rooms x 4 time slots, all present, on a fixed 0-100 scale. */
const roomCells = ['Lab', 'Hall', 'Office'].flatMap((room, r) =>
  ['06:00', '12:00', '18:00', '24:00'].map((slot, c) => ({ x: slot, y: room, value: 20 + r * 25 + c * 10 })),
);

const T0 = Date.UTC(2026, 9, 6, 8, 0, 0);
const iso = (ms: number) => new Date(ms).toISOString();
/** 60 samples roughly 7 minutes apart with a deterministic jitter (uneven instants). */
const tempSeries = [
  {
    id: 'temp',
    name: 'Temperature',
    data: Array.from({ length: 60 }, (_, i) => ({
      x: iso(T0 + i * 7 * 60_000 + (i % 3) * 20_000),
      y: Math.round((21 + Math.sin(i / 6) * 3 + (i % 5) * 0.2) * 10) / 10,
    })),
  },
  {
    id: 'setpoint',
    name: 'Setpoint',
    data: [
      { x: iso(T0), y: 22 },
      { x: iso(T0 + 3 * 3_600_000), y: 22 },
      { x: iso(T0 + 7 * 3_600_000), y: 20 },
    ],
  },
];
/** Two sensors sampled at different instants on the same axis. */
const flowSeries = [
  { id: 'inlet', name: 'Inlet flow', data: Array.from({ length: 24 }, (_, i) => ({ x: iso(T0 + i * 10 * 60_000), y: 40 + (i % 6) * 4 })) },
  { id: 'outlet', name: 'Outlet flow', data: Array.from({ length: 16 }, (_, i) => ({ x: iso(T0 + 5 * 60_000 + i * 15 * 60_000), y: 35 + (i % 4) * 5 })) },
];

// `yFormat` / `valueFormat` travel as the NAME of a global function (the config is JSON).
const FMT_SCRIPT = `<script>window.kuiFmtCelsius = function (v) { return (Math.round(v * 10) / 10) + '\\u00b0C'; }; window.kuiFmtPercent = function (v) { return v + '%'; };</script>`;

const common = {
  relatedTo: ['chart'],
  since: '2026-10',
  status: 'beta' as const,
  category: 'Molecule' as const,
};

export function buildPrimitiveChartSinglesData(): ShowcaseItem[] {
  return [
    {
      ...common,
      id: 'gauge-chart',
      title: 'GaugeChart',
      abbr: 'Gc',
      description:
        'Gauge (role="meter") rendered on the server. Five layouts: `arc` (half circle, default), `donut` (an arc between `startAngle` / `endAngle`), `bar-horizontal`, `bar-vertical` and `level` (a thermometer). Threshold `bands` (`from` / `to`, `tone` or any `color`, `label`) drawn as a thin outer ring (`bandStyle: \'outer\'`, default) or tinted on the track; `bandEdges` decides boundary values, `bandDisplay` whether bands colour the bar, the track or both. Needle styles `line`, `arrow`, `marker`; evenly spaced `ticks` with `tickLabels`; `thickness`, `roundedCaps`, `color`, `trackColor`; sizes sm / md / lg / `fill`; a stale state for readings that stopped updating. Every text (value, caption, min / max, ticks) is HTML over the SVG, so it keeps the kit\'s type sizes. Part of the Chart library (`modules/ui/Chart/Chart.ejs`, `type: \'gauge\'`).',
      filePath: 'modules/ui/Chart/partials/_gauge.ejs',
      sourceCode: gaugeSource,
      designTokens: ['--success', '--warning', '--error', '--info', '--surface-sunken', '--text-primary', '--text-secondary'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['meter'], notes: 'role="meter" with aria-valuemin / aria-valuemax / aria-valuenow and an aria-label from `label`.' },
      variants: [
        {
          title: 'Threshold bands',
          layout: 'stack' as const,
          previewHtml: frame(
            'CPU 34% (success band), Disk 91% (error band)',
            `<div class="flex flex-wrap items-end gap-6">`
              + renderChart({ id: 'gc-demo-cpu', type: 'gauge', value: 34, unit: '%', label: 'CPU', bands: BANDS })
              + renderChart({ id: 'gc-demo-disk', type: 'gauge', value: 91, unit: '%', label: 'Disk', bands: BANDS })
              + `</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 34, unit: '%', label: 'CPU', bands: bands }) %>\n<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 91, unit: '%', label: 'Disk', bands: bands }) %>`,
        },
        {
          title: 'Needle',
          layout: 'stack' as const,
          previewHtml: frame('Disk 91% with a needle', renderChart({ id: 'gc-demo-needle', type: 'gauge', value: 91, unit: '%', label: 'Disk', needle: true, bands: BANDS })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 91, min: 0, max: 100, unit: '%', label: 'Disk', needle: true, bands: bands }) %>`,
        },
        {
          title: 'Layouts',
          layout: 'stack' as const,
          previewHtml: frame(
            'donut with an arrow, horizontal bar with ticks, vertical bar, level with a marker',
            `<div class="flex flex-wrap items-end gap-6">`
              + renderChart({ id: 'gc-demo-donut', type: 'gauge', layout: 'donut', value: 72, unit: '%', label: 'Memory', needle: true, needleStyle: 'arrow', bands: BANDS, size: 'sm' })
              + renderChart({ id: 'gc-demo-hbar', type: 'gauge', layout: 'bar-horizontal', value: 64, unit: '%', label: 'Battery', ticks: 5, tickLabels: true, bands: BANDS, size: 'sm' })
              + renderChart({ id: 'gc-demo-vbar', type: 'gauge', layout: 'bar-vertical', value: 38, unit: 'L', label: 'Tank', roundedCaps: true, size: 'sm' })
              + renderChart({ id: 'gc-demo-level', type: 'gauge', layout: 'level', value: 21, min: -10, max: 40, unit: '°C', label: 'Room', needle: true, needleStyle: 'marker', color: 'var(--error)', size: 'sm' })
              + `</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'gauge', layout: 'donut', value: 72, unit: '%', needle: true, needleStyle: 'arrow', bands: bands }) %>
<%- include('modules/ui/Chart/Chart', { type: 'gauge', layout: 'bar-horizontal', value: 64, ticks: 5, tickLabels: true, bands: bands }) %>
<%- include('modules/ui/Chart/Chart', { type: 'gauge', layout: 'bar-vertical', value: 38, unit: 'L', roundedCaps: true }) %>
<%- include('modules/ui/Chart/Chart', { type: 'gauge', layout: 'level', value: 21, min: -10, max: 40, needle: true, needleStyle: 'marker', color: 'var(--error)' }) %>`,
        },
        {
          title: 'Stale reading',
          layout: 'stack' as const,
          previewHtml: frame('The value stopped updating', renderChart({ id: 'gc-demo-stale', type: 'gauge', value: 72, size: 'sm', label: 'Stale reading', stale: true })),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 72, size: 'sm', label: 'Stale reading', stale: true }) %>`,
        },
        {
          title: 'Sizes',
          layout: 'stack' as const,
          previewHtml: frame(
            'sm, md, lg at 55%',
            `<div class="flex flex-wrap items-end gap-6">`
              + (['sm', 'md', 'lg'] as const).map((s) => renderChart({ id: `gc-demo-size-${s}`, type: 'gauge', value: 55, unit: '%', label: s, size: s, bands: BANDS })).join('')
              + `</div>`,
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 55, unit: '%', label: 'sm', size: 'sm', bands: bands }) %>\n<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 55, unit: '%', label: 'md', size: 'md', bands: bands }) %>\n<%- include('modules/ui/Chart/Chart', { type: 'gauge', value: 55, unit: '%', label: 'lg', size: 'lg', bands: bands }) %>`,
        },
      ],
    },
    {
      ...common,
      id: 'heatmap-chart',
      title: 'HeatmapChart',
      abbr: 'Hm',
      description:
        'Matrix of cells coloured on one token scale (`color` at a variable opacity, or mixed from `colorLow` to `color`; `colorFor` for banded colours). A missing value (`null`) renders as an empty cell, never as 0, so gaps in the data stay visible. Hover shows the value; the scale can be fixed with `min` / `max`. Options: `showValues` (cell labels whose colour follows the cell), `cellGap`, `cellRadius`, `legendPosition`, `legendItems` (a banded legend), `legendFormat`, `tickStyle`, `fill`.',
      filePath: 'modules/ui/Chart/scripts/heatmap.js',
      sourceCode: chartSource,
      designTokens: ['--primary', '--surface-sunken', '--border', '--text-secondary'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['img'], notes: 'role="img" with an aria-label; the hover tooltip repeats the cell value as text.' },
      variants: [
        {
          title: 'Missing data is empty, not zero',
          layout: 'stack' as const,
          previewHtml: frame(
            'Messages per hour and weekday (every 37th cell is missing)',
            renderChart({ id: 'hm-demo-missing', type: 'heatmap', cells: heatCells, height: 220, valueLabel: 'Messages' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'heatmap', cells: cells, height: 220, valueLabel: 'Messages' }) %>`,
        },
        {
          title: 'Fixed scale and value format',
          layout: 'stack' as const,
          previewHtml: frame(
            'Humidity by room and time of day (fixed 0-100 scale)',
            FMT_SCRIPT + renderChart({ id: 'hm-demo-fixed', type: 'heatmap', cells: roomCells, height: 140, min: 0, max: 100, valueLabel: 'Humidity', valueFormat: 'kuiFmtPercent' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'heatmap', cells: cells, min: 0, max: 100, valueLabel: 'Humidity', valueFormat: 'fmtPercent' }) %>\n<!-- valueFormat is the NAME of a global function: window.fmtPercent = (v) => v + '%' -->`,
        },
        {
          title: 'Two-colour scale, cell values, legend on the right',
          layout: 'stack' as const,
          previewHtml: frame(
            'Humidity from colorLow (info) to color (error), values printed in the cells',
            FMT_SCRIPT + renderChart({ id: 'hm-demo-two', type: 'heatmap', cells: roomCells, height: 160, min: 0, max: 100, color: 'var(--error)', colorLow: 'var(--info)', showValues: true, legendPosition: 'right', valueFormat: 'kuiFmtPercent' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'heatmap', cells: cells, color: 'var(--error)', colorLow: 'var(--info)', showValues: true, legendPosition: 'right' }) %>`,
        },
      ],
    },
    {
      ...common,
      id: 'time-series-chart',
      title: 'TimeSeriesChart',
      abbr: 'Ts',
      description:
        'The continuous time axis behind `LineChart` / `AreaChart` with `xAxis="time"`: timestamps (ISO strings or epoch ms) in `x`, uneven sampling, series with different instants on one axis, and drag-to-zoom (double-click or "Reset zoom" to leave). Zoom is local to the chart and never reaches the caller. Ticks follow the visible span (24 h `HH:mm`, `d MMM`, `MMM yy`), in `timeZone` when given; the value axis widens to round bounds. Takes the same settings as the band axis (right axis, thresholds, marks, legend values, tooltip options).',
      filePath: 'modules/ui/Chart/scripts/series.js',
      sourceCode: chartSource,
      designTokens: ['--primary', '--secondary', '--border', '--text-secondary', '--surface-raised'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['img'], notes: 'role="img" with an aria-label; the tooltip and crosshair follow the nearest sample.' },
      variants: [
        {
          title: 'Line with drag-to-zoom',
          layout: 'stack' as const,
          previewHtml: frame(
            'Temperature vs setpoint (drag a range to zoom, double-click to reset)',
            FMT_SCRIPT + renderChart({ id: 'ts-demo-line', type: 'line', xAxis: 'time', series: tempSeries, height: 240, yFormat: 'kuiFmtCelsius' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'line', xAxis: 'time', series: series, height: 240, yFormat: 'fmtCelsius' }) %>\n<!-- yFormat is the NAME of a global function: window.fmtCelsius = (v) => v + '°C' -->`,
        },
        {
          title: 'Area, series sampled at different instants',
          layout: 'stack' as const,
          previewHtml: frame(
            'Inlet (every 10 min) and outlet (every 15 min) flow',
            renderChart({ id: 'ts-demo-area', type: 'area', xAxis: 'time', series: flowSeries, height: 240 }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'area', xAxis: 'time', series: [inlet, outlet], height: 240 }) %>`,
        },
        {
          title: 'Zoom disabled',
          layout: 'stack' as const,
          previewHtml: frame(
            'Same data, zoom={false}',
            FMT_SCRIPT + renderChart({ id: 'ts-demo-nozoom', type: 'line', xAxis: 'time', series: tempSeries, zoom: false, height: 200, yFormat: 'kuiFmtCelsius' }),
          ),
          code: `<%- include('modules/ui/Chart/Chart', { type: 'line', xAxis: 'time', series: series, zoom: false }) %>`,
        },
      ],
    },
  ];
}
