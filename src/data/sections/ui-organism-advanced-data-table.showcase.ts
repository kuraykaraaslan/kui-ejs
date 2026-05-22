import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/AdvancedDataTable.ejs'), 'utf-8');

interface Column { key: string; header: string; align?: 'left' | 'center' | 'right' }
interface Row    { [key: string]: string | undefined; _expanded?: string }

const alignClass: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

function adtEl(opts: {
  columns: Column[];
  rows: Row[];
  selectable?: boolean;
  stickyHeader?: boolean;
  emptyMessage?: string;
  selectedCount?: number;
}) {
  const hasExpand = opts.rows.some((r) => r._expanded !== undefined && r._expanded !== null && r._expanded !== '');
  const totalCols = opts.columns.length + (opts.selectable ? 1 : 0) + (hasExpand ? 1 : 0);
  const selectedCount = opts.selectedCount ?? 0;

  const countLine = opts.selectable
    ? `<p class="text-xs text-text-secondary${selectedCount === 0 ? ' hidden' : ''}">
        <span>${selectedCount}</span> of ${opts.rows.length} row${opts.rows.length !== 1 ? 's' : ''} selected
      </p>`
    : '';

  const headSelect = opts.selectable
    ? `<th scope="col" class="w-10 px-4 py-3">
        <input type="checkbox" aria-label="Select all rows" class="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus" />
      </th>`
    : '';

  const headExpand = hasExpand
    ? `<th scope="col" class="w-10 px-4 py-3" aria-label="Expand"></th>`
    : '';

  const ths = opts.columns.map((col) =>
    `<th scope="col" class="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider ${alignClass[col.align || 'left']}">${col.header}</th>`
  ).join('');

  const body = opts.rows.length === 0
    ? `<tr><td colspan="${totalCols}" class="px-4 py-10 text-center text-sm text-text-secondary">${opts.emptyMessage || 'No results found.'}</td></tr>`
    : opts.rows.map((row, i) => {
        const rowHasExpand = row._expanded !== undefined && row._expanded !== null && row._expanded !== '';
        const isSelected = opts.selectable && i < selectedCount;
        const selectClass = isSelected ? ' bg-primary-subtle' : '';
        const selCell = opts.selectable
          ? `<td class="w-10 px-4 py-3"><input type="checkbox"${isSelected ? ' checked' : ''} aria-label="Select row ${i + 1}" class="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus" /></td>`
          : '';
        const expCell = hasExpand
          ? (rowHasExpand
              ? `<td class="w-10 px-4 py-3"><button type="button" aria-label="Expand row" aria-expanded="false" class="text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"><span class="w-2.5 h-2.5 inline-flex items-center justify-center" aria-hidden="true"><i class="fa-solid fa-chevron-right" style="font-size:10px"></i></span></button></td>`
              : `<td class="w-10 px-4 py-3"></td>`)
          : '';
        const tds = opts.columns.map((col) =>
          `<td class="px-4 py-3 text-text-primary${col.align ? ' ' + alignClass[col.align] : ''}">${row[col.key] ?? ''}</td>`
        ).join('');
        return `<tr class="hover:bg-surface-overlay transition-colors${selectClass}">${selCell}${expCell}${tds}</tr>`;
      }).join('');

  return `<div class="space-y-2">
  ${countLine}
  <div class="w-full rounded-lg border border-border${opts.stickyHeader ? ' overflow-auto max-h-80' : ''}">
    <table class="w-full text-sm">
      <thead class="bg-surface-sunken border-b border-border${opts.stickyHeader ? ' sticky top-0 z-10' : ''}">
        <tr>${headSelect}${headExpand}${ths}</tr>
      </thead>
      <tbody class="divide-y divide-border bg-surface-base">${body}</tbody>
    </table>
  </div>
</div>`;
}

const wrap = (inner: string) => `<div class="w-full p-4">${inner}</div>`;

const baseColumns: Column[] = [
  { key: 'name',   header: 'Name' },
  { key: 'role',   header: 'Role' },
  { key: 'status', header: 'Status' },
];

const baseRows: Row[] = [
  { name: 'Jane Doe',      role: 'Designer',  status: 'Active' },
  { name: 'Carlos Mendes', role: 'Engineer',  status: 'Active' },
  { name: 'Aisha Khan',    role: 'PM',        status: 'Invited' },
  { name: 'Liam Walker',   role: 'Engineer',  status: 'Active' },
];

const expandableRows: Row[] = baseRows.map((r, i) => ({
  ...r,
  _expanded: i % 2 === 0
    ? `<div><strong>${r.name}</strong> joined the team in 2023. Currently assigned to the platform working group.</div>`
    : undefined,
}));

export function buildAdvancedDataTableData(): ShowcaseItem[] {
  return [
    {
      id: 'advanced-data-table',
      title: 'AdvancedDataTable',
      category: 'Organism',
      abbr: 'At',
      description: 'Enhanced table with row selection (with indeterminate header), expandable rows, and optional sticky header.',
      filePath: 'modules/ui/AdvancedDataTable.ejs',
      sourceCode,
      status: 'beta',
      variants: [
        {
          title: 'Basic (no extras)',
          previewHtml: wrap(adtEl({ columns: baseColumns, rows: baseRows })),
          code: `<%- include('modules/ui/AdvancedDataTable', {
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' }
  ],
  rows: [
    { name: 'Jane Doe',      role: 'Designer', status: 'Active' },
    { name: 'Carlos Mendes', role: 'Engineer', status: 'Active' },
    { name: 'Aisha Khan',    role: 'PM',       status: 'Invited' }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Selectable rows',
          previewHtml: wrap(adtEl({
            columns: baseColumns,
            rows: baseRows,
            selectable: true,
            selectedCount: 2,
          })),
          code: `<%- include('modules/ui/AdvancedDataTable', {
  selectable: true,
  columns: [...],
  rows: [...]
}) %>

<!-- Listen for selection changes -->
<script>
document.getElementById('adt-id')
  .addEventListener('adt:selection', (e) => console.log(e.detail.count));
</script>`,
          layout: 'stack',
        },
        {
          title: 'Expandable rows',
          previewHtml: wrap(adtEl({
            columns: baseColumns,
            rows: expandableRows,
          })),
          code: `<%- include('modules/ui/AdvancedDataTable', {
  columns: [...],
  rows: [
    { name: 'Jane Doe', role: 'Designer', status: 'Active',
      _expanded: '<div>Joined in 2023. Platform working group.</div>' },
    { name: 'Carlos Mendes', role: 'Engineer', status: 'Active' }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Selectable + sticky header',
          previewHtml: wrap(adtEl({
            columns: baseColumns,
            rows: [...baseRows, ...baseRows].map((r, i) => ({ ...r, name: `${r.name} ${i + 1}` })),
            selectable: true,
            stickyHeader: true,
          })),
          code: `<%- include('modules/ui/AdvancedDataTable', {
  selectable: true,
  stickyHeader: true,
  columns: [...],
  rows: [...]
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
