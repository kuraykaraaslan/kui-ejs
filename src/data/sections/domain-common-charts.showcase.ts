import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const chartsSource = fs.readFileSync(
  path.join(process.cwd(), 'modules/domain/common/charts/Charts.ejs'),
  'utf-8',
);

let _seq = 0;
function uid() { return `chart-showcase-${++_seq}`; }

function chartCard(opts: {
  chartId: string;
  type: string;
  title: string;
  subtitle?: string;
  data: object;
  options?: object;
}): string {
  const subtitle = opts.subtitle
    ? `<p class="mt-0.5 text-xs text-text-secondary">${opts.subtitle}</p>`
    : '';
  const mergedOpts = Object.assign(
    { responsive: true, plugins: { legend: { position: 'top' } } },
    opts.options ?? {},
  );
  return `
<div class="rounded-xl border border-border bg-surface-raised p-5 shadow-sm w-full">
  <div class="mb-4">
    <h3 class="text-sm font-semibold text-text-primary">${opts.title}</h3>
    ${subtitle}
  </div>
  <canvas id="${opts.chartId}"></canvas>
</div>
<script>
(function () {
  var canvas = document.getElementById('${opts.chartId}');
  if (!canvas || !window.Chart) return;
  new Chart(canvas, {
    type: '${opts.type}',
    data: ${JSON.stringify(opts.data)},
    options: ${JSON.stringify(mergedOpts)}
  });
})();
</script>`;
}

/* ─── 1. Bar — Revenue vs Expenses ─────────────────────────────────────────── */
const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue',  data: [4200, 5800, 4900, 7100, 6300, 8400], backgroundColor: 'rgba(59,130,246,0.8)',  borderRadius: 6 },
    { label: 'Expenses', data: [2800, 3200, 3600, 4100, 3900, 4700], backgroundColor: 'rgba(139,92,246,0.8)', borderRadius: 6 },
  ],
};

/* ─── 2. Line — User Activity ───────────────────────────────────────────────── */
const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    { label: 'Active Users', data: [1200, 1900, 1500, 2300, 2100, 2800, 1700], borderColor: 'rgb(59,130,246)',  backgroundColor: 'rgba(59,130,246,0.1)',  fill: true, tension: 0.4 },
    { label: 'New Signups',  data: [300,  480,  220,  560,  410,  690,  320],  borderColor: 'rgb(34,197,94)',   backgroundColor: 'rgba(34,197,94,0.1)',   fill: true, tension: 0.4 },
  ],
};

/* ─── 3. Doughnut — Sales by Category ──────────────────────────────────────── */
const doughnutData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
  datasets: [{
    data: [35, 25, 20, 12, 8],
    backgroundColor: [
      'rgba(59,130,246,0.85)', 'rgba(139,92,246,0.85)', 'rgba(34,197,94,0.85)',
      'rgba(245,158,11,0.85)', 'rgba(107,114,128,0.85)',
    ],
    borderWidth: 2,
    borderColor: '#fff',
  }],
};

/* ─── 4. Radar — Product Comparison ────────────────────────────────────────── */
const radarData = {
  labels: ['Speed', 'Reliability', 'Support', 'Price', 'Features', 'UX'],
  datasets: [
    { label: 'Our Product', data: [88, 92, 78, 70, 85, 90], borderColor: 'rgb(59,130,246)',  backgroundColor: 'rgba(59,130,246,0.2)',  pointBackgroundColor: 'rgb(59,130,246)' },
    { label: 'Competitor',  data: [72, 80, 65, 85, 75, 68], borderColor: 'rgb(139,92,246)', backgroundColor: 'rgba(139,92,246,0.2)', pointBackgroundColor: 'rgb(139,92,246)' },
  ],
};

/* ─── 5. Polar Area — Regional Sales ───────────────────────────────────────── */
const polarData = {
  labels: ['North', 'South', 'East', 'West', 'Central'],
  datasets: [{
    data: [42, 28, 35, 19, 56],
    backgroundColor: [
      'rgba(59,130,246,0.75)', 'rgba(34,197,94,0.75)', 'rgba(245,158,11,0.75)',
      'rgba(239,68,68,0.75)',  'rgba(139,92,246,0.75)',
    ],
    borderWidth: 1,
  }],
};

/* ─── Builder ─────────────────────────────────────────────────────────────── */
export function buildDomainCommonChartsData(): ShowcaseItem[] {
  return [
    {
      id: 'charts',
      title: 'Charts',
      category: 'Domain',
      abbr: 'Ch',
      description: 'Chart.js chart components wrapped in Cards: Bar, Line, Doughnut, Radar, and Polar Area.',
      filePath: 'modules/domain/common/charts/Charts.ejs',
      sourceCode: chartsSource,
      variants: [
        {
          title: 'Bar — Revenue vs Expenses',
          layout: 'stack',
          previewHtml: chartCard({
            chartId: uid(),
            type: 'bar',
            title: 'Revenue vs Expenses',
            subtitle: 'Monthly comparison (USD)',
            data: barData,
            options: { scales: { y: { beginAtZero: true } } },
          }),
          code: `<%- include('modules/domain/common/charts/Charts', {
  chartId: 'revenue-bar',
  type: 'bar',
  title: 'Revenue vs Expenses',
  subtitle: 'Monthly comparison (USD)',
  data: barData,
  options: { scales: { y: { beginAtZero: true } } }
}) %>`,
        },
        {
          title: 'Line — User Activity',
          layout: 'stack',
          previewHtml: chartCard({
            chartId: uid(),
            type: 'line',
            title: 'User Activity',
            subtitle: 'Daily active users vs new signups',
            data: lineData,
            options: { scales: { y: { beginAtZero: true } } },
          }),
          code: `<%- include('modules/domain/common/charts/Charts', {
  chartId: 'user-activity-line',
  type: 'line',
  title: 'User Activity',
  subtitle: 'Daily active users vs new signups',
  data: lineData
}) %>`,
        },
        {
          title: 'Doughnut — Sales by Category',
          layout: 'stack',
          previewHtml: chartCard({
            chartId: uid(),
            type: 'doughnut',
            title: 'Sales by Category',
            subtitle: 'Percentage share of total revenue',
            data: doughnutData,
            options: { plugins: { legend: { position: 'bottom' } }, cutout: '65%' },
          }),
          code: `<%- include('modules/domain/common/charts/Charts', {
  chartId: 'sales-doughnut',
  type: 'doughnut',
  title: 'Sales by Category',
  data: doughnutData,
  options: { cutout: '65%', plugins: { legend: { position: 'bottom' } } }
}) %>`,
        },
        {
          title: 'Radar — Product Comparison',
          layout: 'stack',
          previewHtml: chartCard({
            chartId: uid(),
            type: 'radar',
            title: 'Product Comparison',
            subtitle: 'Our product vs competitor across 6 dimensions',
            data: radarData,
            options: { scales: { r: { beginAtZero: true, max: 100 } } },
          }),
          code: `<%- include('modules/domain/common/charts/Charts', {
  chartId: 'product-radar',
  type: 'radar',
  title: 'Product Comparison',
  data: radarData,
  options: { scales: { r: { beginAtZero: true, max: 100 } } }
}) %>`,
        },
        {
          title: 'Polar Area — Regional Sales',
          layout: 'stack',
          previewHtml: chartCard({
            chartId: uid(),
            type: 'polarArea',
            title: 'Regional Sales',
            subtitle: 'Units sold per region',
            data: polarData,
            options: { plugins: { legend: { position: 'bottom' } } },
          }),
          code: `<%- include('modules/domain/common/charts/Charts', {
  chartId: 'regional-polar',
  type: 'polarArea',
  title: 'Regional Sales',
  data: polarData
}) %>`,
        },
      ],
    },
  ];
}
