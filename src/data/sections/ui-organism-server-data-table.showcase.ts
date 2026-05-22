import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ServerDataTable.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface Column { key: string; header: string; align?: 'left' | 'center' | 'right' }
interface Row    { [key: string]: string }

const alignClass: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

function paginationEl(opts: { page: number; totalPages: number }) {
  const navBtn  = 'flex items-center justify-center rounded-md text-sm font-medium border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  const navLink = `${navBtn} text-text-secondary hover:bg-surface-overlay hover:text-text-primary h-9 px-3`;
  const navDead = `${navBtn} text-text-disabled cursor-not-allowed opacity-50 h-9 px-3`;
  const navPage = (p: number, active: boolean) =>
    active
      ? `<span aria-current="page" class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-fg border border-primary">${p}</span>`
      : `<a href="?page=${p}" class="${navBtn} text-text-secondary hover:bg-surface-overlay hover:text-text-primary h-9 w-9">${p}</a>`;

  const pages = Array.from({ length: Math.min(opts.totalPages, 5) }, (_, i) => i + 1)
    .map(p => navPage(p, p === opts.page)).join('');

  const next = opts.totalPages > 1
    ? `<a href="?page=${opts.page + 1}" class="${navLink}">›</a><a href="?page=${opts.totalPages}" class="${navLink}">»</a>`
    : `<span class="${navDead}" aria-disabled="true">›</span><span class="${navDead}" aria-disabled="true">»</span>`;

  return `<nav aria-label="Pagination" class="flex items-center gap-1">
    <span class="${navDead}" aria-disabled="true">«</span>
    <span class="${navDead}" aria-disabled="true">‹</span>
    ${pages}
    ${next}
  </nav>`;
}

function serverDataTableEl(opts: {
  columns: Column[];
  rows: Row[];
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  title?: string;
  subtitle?: string;
  headerRightHtml?: string;
  toolbarHtml?: string;
  emptyMessage?: string;
  loading?: boolean;
  clickable?: boolean;
}) {
  const page       = opts.page       ?? 1;
  const total      = opts.total;
  const pageSize   = opts.pageSize;
  const totalPages = opts.totalPages ?? Math.max(1, Math.ceil((total ?? opts.rows.length) / (pageSize ?? 20)));
  const rangeStart = (total != null && pageSize != null) ? (page - 1) * pageSize + 1 : null;
  const rangeEnd   = (total != null && pageSize != null) ? Math.min(page * pageSize, total) : null;

  const header = (opts.title || opts.headerRightHtml)
    ? `<div class="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
        <div>
          ${opts.title ? `<h3 class="text-sm font-semibold text-text-primary">${opts.title}</h3>` : ''}
          ${opts.subtitle ? `<p class="text-xs text-text-secondary mt-0.5">${opts.subtitle}</p>` : ''}
        </div>
        ${opts.headerRightHtml ? `<div class="shrink-0">${opts.headerRightHtml}</div>` : ''}
      </div>`
    : '';

  const toolbar = opts.toolbarHtml
    ? `<div class="px-6 pt-4 pb-0">${opts.toolbarHtml}</div>`
    : '';

  if (opts.loading) {
    return `<div class="rounded-xl border border-border bg-surface-raised shadow-sm overflow-hidden">
      ${header}
      ${toolbar}
      <div class="flex justify-center py-12">
        <span aria-hidden="true" class="inline-block rounded-full border-border border-t-primary animate-spin h-8 w-8 border-[3px]"></span>
      </div>
    </div>`;
  }

  const ths = opts.columns.map(col =>
    `<th scope="col" class="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider ${alignClass[col.align || 'left']}">${col.header}</th>`
  ).join('');

  const body = opts.rows.length === 0
    ? `<tr><td colspan="${opts.columns.length}" class="px-6 py-10 text-center text-sm text-text-secondary">${opts.emptyMessage || 'No results found.'}</td></tr>`
    : opts.rows.map(row => {
        const tds = opts.columns.map(col =>
          `<td class="px-6 py-4 text-text-primary${col.align ? ' ' + alignClass[col.align] : ''}">${row[col.key] ?? ''}</td>`
        ).join('');
        return `<tr class="hover:bg-surface-overlay transition-colors${opts.clickable ? ' cursor-pointer' : ''}">${tds}</tr>`;
      }).join('');

  const rangeText = (total != null && rangeStart != null && rangeEnd != null)
    ? `Showing ${rangeStart}–${rangeEnd} of ${total}`
    : (total != null ? `${total} result${total !== 1 ? 's' : ''}` : '');

  return `<div class="rounded-xl border border-border bg-surface-raised shadow-sm overflow-hidden">
    ${header}
    ${toolbar}
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead><tr class="border-b border-border bg-surface-sunken">${ths}</tr></thead>
        <tbody class="divide-y divide-border bg-surface-base">${body}</tbody>
      </table>
    </div>
    <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-border flex-wrap">
      <p class="text-xs text-text-secondary">${rangeText}</p>
      ${paginationEl({ page, totalPages })}
    </div>
  </div>`;
}

const wrapFull = (inner: string) => `<div class="p-4 w-full">${inner}</div>`;

// ─── Sample data ──────────────────────────────────────────────────────────────

const ORDER_COLS: Column[] = [
  { key: 'orderId',  header: 'Order' },
  { key: 'customer', header: 'Customer' },
  { key: 'status',   header: 'Status' },
  { key: 'total',    header: 'Total', align: 'right' },
];

const ORDER_ROWS: Row[] = [
  { orderId: '#10421', customer: 'Alice Johnson', status: 'Paid',     total: '$129.00' },
  { orderId: '#10422', customer: 'Bob Smith',     status: 'Pending',  total: '$54.20'  },
  { orderId: '#10423', customer: 'Carol White',   status: 'Refunded', total: '$320.00' },
  { orderId: '#10424', customer: 'Dan Brown',     status: 'Paid',     total: '$78.50'  },
];

// ─── Export ───────────────────────────────────────────────────────────────────

export function buildServerDataTableData(): ShowcaseItem[] {
  return [
    {
      id: 'server-data-table',
      title: 'ServerDataTable',
      category: 'Organism',
      abbr: 'Sd',
      description: 'Server-side paginated table. Reads page/totalPages/total/pageSize from the Express route; supports title, toolbar, clickable rows, and empty/loading states.',
      filePath: 'modules/ui/ServerDataTable.ejs',
      sourceCode,
      variants: [
        {
          title: 'With title & pagination',
          previewHtml: wrapFull(serverDataTableEl({
            columns: ORDER_COLS,
            rows: ORDER_ROWS,
            title: 'Orders',
            subtitle: '142 total',
            page: 1,
            totalPages: 8,
            total: 142,
            pageSize: 20,
          })),
          code: `<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  subtitle: total + ' total',
  columns: [
    { key: 'orderId',  header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'status',   header: 'Status' },
    { key: 'total',    header: 'Total', align: 'right' },
  ],
  rows: orders,
  page: page,
  totalPages: totalPages,
  total: total,
  pageSize: 20,
}) %>

<%-- In your Express route: --%>
<%
  // const page = parseInt(req.query.page) || 1;
  // const { orders, total } = await OrderService.list({ page, pageSize: 20 });
  // res.render('orders/index', { orders, total, page, totalPages: Math.ceil(total / 20) });
%>`,
          layout: 'stack',
        },
        {
          title: 'Clickable rows + header action',
          previewHtml: wrapFull(serverDataTableEl({
            columns: ORDER_COLS,
            rows: ORDER_ROWS,
            title: 'Orders',
            subtitle: 'Click a row to open',
            page: 2,
            totalPages: 8,
            total: 142,
            pageSize: 20,
            clickable: true,
            headerRightHtml: `<a href="/orders/new" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-fg hover:bg-primary-hover transition-colors">+ New order</a>`,
          })),
          code: `<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  headerRight: '<a href="/orders/new" class="...">+ New order</a>',
  columns: [...],
  rows: orders,
  page: page,
  totalPages: totalPages,
  total: total,
  pageSize: 20,
  getRowHref: function(row) { return '/orders/' + row.orderId.replace('#', ''); }
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Loading',
          previewHtml: wrapFull(serverDataTableEl({
            columns: ORDER_COLS,
            rows: [],
            title: 'Orders',
            loading: true,
          })),
          code: `<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  columns: [...],
  rows: [],
  loading: true
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty state',
          previewHtml: wrapFull(serverDataTableEl({
            columns: ORDER_COLS,
            rows: [],
            title: 'Orders',
            page: 1,
            totalPages: 1,
            total: 0,
            pageSize: 20,
            emptyMessage: 'No orders yet. Your first sale will appear here.',
          })),
          code: `<%- include('modules/ui/ServerDataTable', {
  title: 'Orders',
  columns: [...],
  rows: [],
  page: 1,
  totalPages: 1,
  total: 0,
  pageSize: 20,
  emptyMessage: 'No orders yet. Your first sale will appear here.'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
