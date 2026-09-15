import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const popconfirmPath   = path.join(process.cwd(), 'modules/ui/Popconfirm.ejs');
const popconfirmSource = fs.readFileSync(popconfirmPath, 'utf-8');

function renderPopconfirm(locals: Record<string, unknown>): string {
  return ejs.render(popconfirmSource, locals, { filename: popconfirmPath });
}

const wrap = (inner: string) => `<div class="w-full max-w-sm p-8">${inner}</div>`;

export function buildPopconfirmData(): ShowcaseItem[] {
  return [
    {
      id: 'popconfirm',
      title: 'Popconfirm',
      category: 'Molecule',
      abbr: 'Pc',
      description:
        '"Are you sure?" confirmation popover: trigger + absolutely-positioned alertdialog panel with title, optional description, and Cancel/Confirm buttons. Built standalone (not a Popover wrapper). Since EJS cannot take a JS closure, confirming or cancelling dispatches a `popconfirm:confirm` / `popconfirm:cancel` CustomEvent on the root element for the host page to listen for.',
      filePath: 'modules/ui/Popconfirm.ejs',
      sourceCode: popconfirmSource,
      since: '2026-09',
      variants: [
        {
          title: 'Default',
          previewHtml: wrap(renderPopconfirm({
            id: 'pc-demo-default',
            trigger: '<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium px-4 py-2 text-sm border border-border text-text-primary hover:bg-surface-overlay">Delete item</button>',
            title: 'Delete this item?',
            description: 'This action cannot be undone.',
          })),
          code: `<%- include('modules/ui/Popconfirm', {
  trigger: '<button type="button">Delete item</button>',
  title: 'Delete this item?',
  description: 'This action cannot be undone.',
}) %>`,
        },
        {
          title: 'Danger + custom labels',
          previewHtml: wrap(renderPopconfirm({
            id: 'pc-demo-danger',
            danger: true,
            trigger: '<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium px-4 py-2 text-sm bg-error text-text-inverse hover:opacity-90">Remove account</button>',
            title: 'Permanently remove this account?',
            description: 'All data associated with this account will be deleted.',
            confirmLabel: 'Remove',
            cancelLabel: 'Keep account',
            confirmAction: 'removeAccount()',
          })),
          code: `<%- include('modules/ui/Popconfirm', {
  danger: true,
  trigger: '<button type="button">Remove account</button>',
  title: 'Permanently remove this account?',
  description: 'All data associated with this account will be deleted.',
  confirmLabel: 'Remove',
  cancelLabel: 'Keep account',
  confirmAction: 'removeAccount()',
}) %>

<script>
document.getElementById('my-popconfirm').addEventListener('popconfirm:confirm', function (ev) {
  // ev.detail.id === 'my-popconfirm'
});
</script>`,
        },
      ],
    },
  ];
}
