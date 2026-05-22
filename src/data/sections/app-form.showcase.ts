import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const formSource      = fs.readFileSync(path.join(process.cwd(), 'modules/app/Form.ejs'), 'utf-8');
const filterBarSource = fs.readFileSync(path.join(process.cwd(), 'modules/app/FilterBar.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const wrapCard = (inner: string) =>
  `<div class="p-4 w-full max-w-lg"><div class="bg-surface rounded-xl border border-border p-5">${inner}</div></div>`;

const field = (label: string, placeholder = '', type = 'text', value = '') =>
  `<div class="w-full">
    <label class="block text-sm font-medium text-text-primary mb-1.5">${label}</label>
    <input type="${type}" placeholder="${placeholder}" value="${value}"
      class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
  </div>`;

const textarea = (label: string, placeholder = '') =>
  `<div class="w-full">
    <label class="block text-sm font-medium text-text-primary mb-1.5">${label}</label>
    <textarea rows="3" placeholder="${placeholder}"
      class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm resize-none"></textarea>
  </div>`;

const select = (label: string, options: string[], placeholder = 'All') =>
  `<div class="w-full">
    <label class="block text-sm font-medium text-text-primary mb-1.5">${label}</label>
    <div class="relative">
      <select class="block w-full appearance-none rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 pr-8 text-sm">
        <option value="">${placeholder}</option>
        ${options.map(o => `<option>${o}</option>`).join('')}
      </select>
      <i class="fa-solid fa-chevron-down text-xs text-text-disabled pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"></i>
    </div>
  </div>`;

const actionBtns = (primary: string, secondary?: string) =>
  `<div class="flex items-center justify-end gap-3 pt-2 border-t border-border mt-2">
    ${secondary ? `<button type="button" class="inline-flex items-center justify-center rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium">${secondary}</button>` : ''}
    <button type="submit" class="inline-flex items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm font-medium">${primary}</button>
  </div>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppFormData(): ShowcaseItem[] {
  return [
    // ── Form ─────────────────────────────────────────────────────────────────
    {
      id: 'form',
      title: 'Form',
      category: 'App',
      abbr: 'Fm',
      description: 'Form layout wrapper with title, description, error and actions slots. `columns` prop renders fields in a 1 or 2 column grid.',
      filePath: 'modules/app/Form.ejs',
      sourceCode: formSource,
      variants: [
        {
          title: 'Single column',
          previewHtml: wrapCard(`
  <div class="mb-4">
    <h2 class="text-lg font-semibold text-text-primary">Edit Profile</h2>
    <p class="text-sm text-text-secondary mt-0.5">Update your personal information.</p>
  </div>
  <form class="space-y-6">
    <div class="grid grid-cols-1 gap-4">
      ${field('Name', 'Jane Doe', 'text', 'Jane Doe')}
      ${field('Email', 'jane@example.com', 'email', 'jane@example.com')}
      ${textarea('Bio', 'Tell us about yourself…')}
    </div>
    ${actionBtns('Save changes', 'Cancel')}
  </form>`),
          code: `<%- include('modules/app/Form', {
  title:       'Edit Profile',
  description: 'Update your personal information.',
  action:      '/account/profile',
  actionsContent: \`
    <%- include('modules/ui/Button', { variant: 'outline', children: 'Cancel', href: '/account' }) %>
    <%- include('modules/ui/Button', { type: 'submit', children: 'Save changes' }) %>
  \`,
  children: \`
    <%- include('modules/ui/Input',    { label: 'Name',  name: 'name',  value: user.name }) %>
    <%- include('modules/ui/Input',    { label: 'Email', name: 'email', type: 'email', value: user.email }) %>
    <%- include('modules/ui/Textarea', { label: 'Bio',   name: 'bio',   value: user.bio }) %>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Two column',
          previewHtml: wrapCard(`
  <div class="mb-4">
    <h2 class="text-lg font-semibold text-text-primary">Personal Details</h2>
  </div>
  <form class="space-y-6">
    <div class="grid sm:grid-cols-2 gap-4">
      ${field('First Name', 'Jane', 'text', 'Jane')}
      ${field('Last Name', 'Doe', 'text', 'Doe')}
      ${field('Email', 'jane@example.com', 'email', 'jane@example.com')}
      ${field('Phone', '+1 555 000 0000', 'tel')}
    </div>
    ${actionBtns('Save')}
  </form>`),
          code: `<%- include('modules/app/Form', {
  title:   'Personal Details',
  columns: 2,
  action:  '/account/details',
  actionsContent: \`<%- include('modules/ui/Button', { type: 'submit', children: 'Save' }) %>\`,
  children: \`
    <%- include('modules/ui/Input', { label: 'First Name', name: 'firstName' }) %>
    <%- include('modules/ui/Input', { label: 'Last Name',  name: 'lastName'  }) %>
    <%- include('modules/ui/Input', { label: 'Email',      name: 'email', type: 'email' }) %>
    <%- include('modules/ui/Input', { label: 'Phone',      name: 'phone', type: 'tel' }) %>
  \`
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── FilterBar ─────────────────────────────────────────────────────────────
    {
      id: 'filter-bar',
      title: 'FilterBar',
      category: 'App',
      abbr: 'Fb',
      description: 'Select, multiselect, daterange and text-based filter panel. Supports URL-based filtering via GET form submit.',
      filePath: 'modules/app/FilterBar.ejs',
      sourceCode: filterBarSource,
      variants: [
        {
          title: 'Full filter set',
          previewHtml: `<div class="p-4 w-full">
  <div class="flex flex-wrap items-end gap-3 p-4 bg-surface-raised border border-border rounded-xl">
    ${select('Status', ['Active', 'Inactive', 'Pending'])}
    ${select('Category', ['Design', 'Engineering', 'Marketing'])}
    <div class="min-w-56 flex-1">
      <label class="block text-sm font-medium text-text-primary mb-1.5">Date range</label>
      <div class="flex items-center gap-1.5">
        <input type="date" class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
        <span class="text-text-disabled text-sm shrink-0">–</span>
        <input type="date" class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0 self-end pb-0.5">
      <button type="reset" class="inline-flex items-center justify-center rounded-md text-text-secondary hover:bg-surface-overlay px-3 py-2 text-sm font-medium">Reset</button>
      <button type="submit" class="inline-flex items-center gap-1.5 justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-3 py-2 text-sm font-medium">
        <i class="fa-solid fa-filter text-xs"></i>Apply
      </button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/FilterBar', {
  action: req.path,
  method: 'get',
  fields: [
    { type: 'select', id: 'status',   label: 'Status',   options: [{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}] },
    { type: 'select', id: 'category', label: 'Category', options: categories.map(c => ({value: c.id, label: c.name})) },
    { type: 'daterange', id: 'date',  label: 'Date range' },
  ],
  values: req.query
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Compact filters',
          previewHtml: `<div class="p-4 w-full max-w-lg">
  <div class="flex flex-wrap items-end gap-3 p-4 bg-surface-raised border border-border rounded-xl">
    ${select('Status', ['Active', 'Inactive'])}
    ${select('Role', ['Admin', 'Editor', 'Viewer'])}
    <div class="flex items-center gap-2 shrink-0 self-end pb-0.5">
      <button type="submit" class="inline-flex items-center gap-1.5 justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-3 py-2 text-sm font-medium">
        <i class="fa-solid fa-filter text-xs"></i>Apply
      </button>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/FilterBar', {
  action: req.path,
  fields: [
    { type: 'select', id: 'status', label: 'Status', options: statusOptions },
    { type: 'select', id: 'role',   label: 'Role',   options: roleOptions   },
  ],
  values: req.query
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
