import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const tableSource     = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Table.ejs'), 'utf-8');
const dataTableSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/DataTable.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface Column { key: string; header: string; align?: 'left' | 'center' | 'right' }
interface Row    { [key: string]: string }

const alignClass: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

function tableEl(opts: { columns: Column[]; rows: Row[]; emptyMessage?: string }) {
  const ths = opts.columns.map(col =>
    `<th scope="col" class="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider ${alignClass[col.align || 'left']}">${col.header}</th>`
  ).join('\n        ');

  const body = opts.rows.length === 0
    ? `<tr><td colspan="${opts.columns.length}" class="px-4 py-8 text-center text-text-secondary">${opts.emptyMessage || 'No results found.'}</td></tr>`
    : opts.rows.map(row => {
        const tds = opts.columns.map(col =>
          `<td class="px-4 py-3 text-text-primary${col.align ? ' ' + alignClass[col.align] : ''}">${row[col.key] ?? ''}</td>`
        ).join('\n          ');
        return `<tr class="hover:bg-surface-overlay transition-colors">\n          ${tds}\n        </tr>`;
      }).join('\n        ');

  return `<div class="w-full overflow-x-auto rounded-lg border border-border">
  <table class="w-full text-sm">
    <thead class="bg-surface-sunken border-b border-border"><tr>${ths}</tr></thead>
    <tbody class="divide-y divide-border bg-surface-base">${body}</tbody>
  </table>
</div>`;
}

// Builds a static preview of DataTable (card wrapper + table + pagination footer)
function dataTableEl(opts: {
  columns: Column[];
  rows: Row[];
  page?: number;
  total?: number;
  pageSize?: number;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  clickable?: boolean;
}) {
  const page      = opts.page     ?? 1;
  const total     = opts.total    ?? opts.rows.length;
  const pageSize  = opts.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd   = Math.min(page * pageSize, total);

  const ths = opts.columns.map(col =>
    `<th scope="col" class="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider ${alignClass[col.align || 'left']}">${col.header}</th>`
  ).join('');

  const body = opts.rows.length === 0
    ? `<tr><td colspan="${opts.columns.length}" class="px-6 py-10 text-center text-sm text-text-secondary">${opts.emptyMessage || 'No results found.'}</td></tr>`
    : opts.rows.map(row => {
        const tds = opts.columns.map(col =>
          `<td class="px-6 py-4 text-text-primary${col.align ? ' ' + alignClass[col.align] : ''}">${row[col.key] ?? '—'}</td>`
        ).join('');
        return `<tr class="hover:bg-surface-overlay transition-colors${opts.clickable ? ' cursor-pointer' : ''}">${tds}</tr>`;
      }).join('');

  const header = opts.title
    ? `<div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
        <div>
          <h3 class="text-sm font-semibold text-text-primary">${opts.title}</h3>
          ${opts.subtitle ? `<p class="text-xs text-text-secondary mt-0.5">${opts.subtitle}</p>` : ''}
        </div>
      </div>`
    : '';

  // Minimal pagination footer (static, no JS)
  const navBtn  = 'flex items-center justify-center rounded-md text-sm font-medium border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  const navLink = `${navBtn} text-text-secondary hover:bg-surface-overlay hover:text-text-primary h-9 px-3`;
  const navDead = `${navBtn} text-text-disabled cursor-not-allowed opacity-50 h-9 px-3`;
  const navPage = (p: number, active: boolean) =>
    active
      ? `<span aria-current="page" class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-fg border border-primary">${p}</span>`
      : `<a href="?page=${p}" class="${navBtn} text-text-secondary hover:bg-surface-overlay hover:text-text-primary h-9 w-9">${p}</a>`;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)
    .map(p => navPage(p, p === page)).join('');

  const pagination = `
    <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-border flex-wrap">
      <p class="text-xs text-text-secondary">
        Showing <span class="font-medium text-text-primary">${rangeStart}–${rangeEnd}</span>
        of <span class="font-medium text-text-primary">${total}</span>
      </p>
      <nav aria-label="Pagination" class="flex items-center gap-1">
        <span class="${navDead}" aria-disabled="true">«</span>
        <span class="${navDead}" aria-disabled="true">‹</span>
        ${pages}
        ${totalPages > 1 ? `<a href="?page=2" class="${navLink}">›</a><a href="?page=${totalPages}" class="${navLink}">»</a>` : `<span class="${navDead}" aria-disabled="true">›</span><span class="${navDead}" aria-disabled="true">»</span>`}
      </nav>
    </div>`;

  return `<div class="rounded-xl border border-border bg-surface-raised shadow-sm overflow-hidden">
  ${header}
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-surface-sunken border-b border-border"><tr>${ths}</tr></thead>
      <tbody class="divide-y divide-border bg-surface-base">${body}</tbody>
    </table>
  </div>
  ${pagination}
</div>`;
}

const wrapFull = (inner: string) => `<div class="p-4 w-full">${inner}</div>`;

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_USERS: Row[] = [
  { name: 'Alice Johnson', role: 'Admin',  status: 'Active',   joined: 'Jan 2024' },
  { name: 'Bob Smith',     role: 'Editor', status: 'Active',   joined: 'Mar 2024' },
  { name: 'Carol White',   role: 'Viewer', status: 'Inactive', joined: 'Jun 2024' },
  { name: 'Dan Brown',     role: 'Editor', status: 'Pending',  joined: 'Sep 2024' },
];

const USER_COLS: Column[] = [
  { key: 'name',   header: 'Name' },
  { key: 'role',   header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'joined', header: 'Joined', align: 'right' },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export function buildOrganismDataData(): ShowcaseItem[] {
  return [
    {
      id: 'table',
      title: 'Table',
      category: 'Organism',
      abbr: 'Tl',
      description: 'Responsive table. scope="col" headers, hover row highlight, empty-state message, and custom cell render support.',
      filePath: 'modules/ui/Table.ejs',
      sourceCode: tableSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapFull(tableEl({ columns: USER_COLS, rows: SAMPLE_USERS })),
          code: `<%- include('modules/ui/Table', {
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'joined', header: 'Joined', align: 'right' },
  ],
  rows: users
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Compact — 2 columns',
          previewHtml: wrapFull(tableEl({
            columns: [
              { key: 'key',   header: 'Setting' },
              { key: 'value', header: 'Value', align: 'right' },
            ],
            rows: [
              { key: 'Max upload size', value: '10 MB' },
              { key: 'Session timeout', value: '30 min' },
              { key: 'API rate limit',  value: '1 000 / hr' },
              { key: 'Cache TTL',       value: '5 min' },
            ],
          })),
          code: `<%- include('modules/ui/Table', {
  columns: [
    { key: 'key',   header: 'Setting' },
    { key: 'value', header: 'Value', align: 'right' },
  ],
  rows: settings
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: wrapFull(tableEl({
            columns: USER_COLS,
            rows: [],
            emptyMessage: 'No users found. Invite someone to get started.',
          })),
          code: `<%- include('modules/ui/Table', {
  columns: [...],
  rows: [],
  emptyMessage: 'No users found. Invite someone to get started.'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    {
      id: 'data-table',
      title: 'DataTable',
      category: 'Organism',
      abbr: 'DT',
      description: 'Table + SearchBar + Pagination in a single component. Client-side search and pagination with filtered result counter and rows-per-page selector.',
      filePath: 'modules/ui/DataTable.ejs',
      sourceCode: dataTableSource,
      variants: [
        {
          title: 'With title & pagination',
          previewHtml: wrapFull(dataTableEl({
            columns: USER_COLS,
            rows: SAMPLE_USERS,
            title: 'Users',
            subtitle: '87 total',
            page: 1,
            total: 87,
            pageSize: 20,
          })),
          code: `<%- include('modules/ui/DataTable', {
  title: 'Users',
  subtitle: total + ' total',
  columns: [
    { key: 'name',   header: 'Name' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'joined', header: 'Joined', align: 'right' },
  ],
  rows: users,
  page: page,       // current page (1-based), from req.query
  total: total,     // total record count, from DB
  pageSize: 20,
  qs: qs,           // query string without 'page', from route
}) %>

<%-- In your Express route: --%>
<%
  // const page = parseInt(req.query.page) || 1;
  // const { users, total } = await UserService.list({ page, pageSize: 20 });
  // const qs = new URLSearchParams(req.query); qs.delete('page');
  // res.render('users/index', { users, total, page, qs: qs.toString() });
%>`,
          layout: 'stack',
        },
        {
          title: 'Clickable rows',
          previewHtml: wrapFull(dataTableEl({
            columns: USER_COLS,
            rows: SAMPLE_USERS,
            title: 'Users',
            page: 1,
            total: 4,
            pageSize: 20,
            clickable: true,
          })),
          code: `<%- include('modules/ui/DataTable', {
  columns: [...],
  rows: users,
  page: page,
  total: total,
  pageSize: 20,
  qs: qs,
  getRowHref: function(row) { return '/users/' + row.userId; }
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Custom cell render',
          previewHtml: wrapFull(dataTableEl({
            columns: USER_COLS,
            rows: SAMPLE_USERS,
            page: 1,
            total: 4,
            pageSize: 20,
          })),
          code: `<%- include('modules/ui/DataTable', {
  columns: [
    { key: 'name', header: 'User',
      render: function(row) {
        return '<div class="flex items-center gap-2">'
          + '<span class="h-7 w-7 rounded-full bg-primary-subtle text-primary text-xs flex items-center justify-center">'
          + row.name.charAt(0).toUpperCase()
          + '</span>'
          + '<span class="font-medium text-text-primary">' + row.name + '</span>'
          + '</div>';
      }
    },
    { key: 'status', header: 'Status',
      render: function(row) {
        var v = row.status === 'Active' ? 'bg-success-subtle text-success-fg'
               : row.status === 'Pending' ? 'bg-warning-subtle text-warning-fg'
               : 'bg-surface-overlay text-text-secondary';
        return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + v + '">'
          + row.status + '</span>';
      }
    },
  ],
  rows: users,
  page: page,
  total: total,
  pageSize: 20,
  qs: qs,
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: wrapFull(dataTableEl({
            columns: USER_COLS,
            rows: [],
            title: 'Users',
            page: 1,
            total: 0,
            pageSize: 20,
            emptyMessage: 'No users found.',
          })),
          code: `<%- include('modules/ui/DataTable', {
  columns: [...],
  rows: [],
  page: 1,
  total: 0,
  pageSize: 20,
  qs: qs,
  emptyMessage: 'No users found.'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
