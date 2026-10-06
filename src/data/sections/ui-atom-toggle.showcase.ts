import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const togglePath = path.join(process.cwd(), 'modules/ui/Toggle.ejs');
const sourceCode = fs.readFileSync(togglePath, 'utf-8');

// The async states render the real Toggle.ejs (the older variants above use a peer-based sketch).
function renderToggle(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: togglePath });
}

// Matches the peer-based Toggle.ejs
function toggle(opts: {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
  wClass?: string;
  dotClass?: string;
}) {
  const {
    id = 'tg-' + Math.random().toString(36).slice(2, 7),
    checked = false,
    disabled = false,
    label,
    ariaLabel,
    wClass = 'w-11 h-6',
    dotClass = 'h-5 w-5 peer-checked:translate-x-5',
  } = opts;
  const cursor = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const ariaLabelAttr = !label && ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  return `<label class="inline-flex items-center cursor-pointer ${cursor}">
  <div class="relative">
    <input type="checkbox" id="${id}" class="sr-only peer"${ariaLabelAttr} ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
    <div class="bg-surface-active rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:bg-primary transition-all ${wClass}"></div>
    <div class="absolute left-0.5 top-0.5 bg-white rounded-full transition-all peer-checked:bg-primary-fg ${dotClass}"></div>
  </div>
  ${label ? `<span class="ml-3 text-sm font-medium text-text-primary">${label}</span>` : ''}
</label>`;
}

export function buildToggleData(): ShowcaseItem[] {
  return [
    {
      id: 'toggle',
      title: 'Toggle',
      category: 'Atom',
      abbr: 'Tg',
      description: 'role="switch" toggle/switch with three sizes, description slot, and disabled support. Fully accessible via CSS transform without a native input.',
      filePath: 'modules/ui/Toggle.ejs',
      sourceCode,
      variants: [
        {
          title: 'Checked',
          previewHtml: `<div class="flex justify-center p-4">${toggle({ checked: true, label: 'Notifications enabled' })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'notif', label: 'Notifications enabled', checked: true }) %>`,
        },
        {
          title: 'Unchecked',
          previewHtml: `<div class="flex justify-center p-4">${toggle({ checked: false, label: 'Dark mode' })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'dark', label: 'Dark mode' }) %>`,
        },
        {
          title: 'No visible label',
          previewHtml: `<div class="flex justify-center p-4">${toggle({ checked: true, ariaLabel: 'Enable notifications' })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 't', checked: true, ariaLabel: 'Enable notifications' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: `<div class="flex flex-col items-center gap-3 p-4">
  ${toggle({ checked: true,  disabled: true, label: 'Enabled (disabled)' })}
  ${toggle({ checked: false, disabled: true, label: 'Disabled option' })}
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'a', label: 'Enabled (disabled)', checked: true,  disabled: true }) %>
<%- include('modules/ui/Toggle', { id: 'b', label: 'Disabled option',     checked: false, disabled: true }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-col items-center gap-3 p-4">
  ${toggle({ checked: true, label: 'Small',  wClass: 'w-8 h-4',  dotClass: 'h-3 w-3 peer-checked:translate-x-4' })}
  ${toggle({ checked: true, label: 'Medium', wClass: 'w-11 h-6', dotClass: 'h-5 w-5 peer-checked:translate-x-5' })}
  ${toggle({ checked: true, label: 'Large',  wClass: 'w-14 h-7', dotClass: 'h-6 w-6 peer-checked:translate-x-7' })}
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'sm', label: 'Small',  size: 'sm', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'md', label: 'Medium', size: 'md', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'lg', label: 'Large',  size: 'lg', checked: true }) %>`,
        },
        {
          title: 'Pending (a write is in flight)',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'tg-pending', label: 'Heater', checked: true, pending: true })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'heater', label: 'Heater', checked: true, pending: true }) %>
<!-- at runtime: document.querySelector('[data-toggle-root="heater"]').__toggle.setPending(false) -->`,
        },
        {
          title: 'Mismatch (the device reports another value)',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'tg-mismatch', label: 'Heater', checked: true, mismatch: true, describedBy: 'tg-mismatch-hint' })}</div>
<p id="tg-mismatch-hint" class="text-center text-xs text-text-secondary">The device reports a different value.</p>`,
          code: `<%- include('modules/ui/Toggle', { id: 'heater', label: 'Heater', checked: true, mismatch: true, describedBy: 'heater-hint' }) %>
<p id="heater-hint">The device reports a different value.</p>`,
        },
      ],
    },
  ];
}
