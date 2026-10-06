import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const togglePath = path.join(process.cwd(), 'modules/ui/Toggle.ejs');
const sourceCode = fs.readFileSync(togglePath, 'utf-8');

function renderToggle(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: togglePath });
}

export function buildToggleData(): ShowcaseItem[] {
  return [
    {
      id: 'toggle',
      title: 'Toggle',
      category: 'Molecule',
      abbr: 'Tg',
      description: 'role="switch" toggle/switch with three sizes, description slot, and disabled support. Fully accessible via CSS transform without a native input.',
      filePath: 'modules/ui/Toggle.ejs',
      sourceCode,
      variants: [
        {
          title: 'Checked',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'sc-toggle-checked', label: 'Notifications enabled', checked: true })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'notif', label: 'Notifications enabled', checked: true }) %>`,
        },
        {
          title: 'Unchecked',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'sc-toggle-unchecked', label: 'Dark mode', checked: false })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'dark', label: 'Dark mode' }) %>`,
        },
        {
          title: 'No visible label',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'sc-toggle-nolabel', label: '', ariaLabel: 'Enable notifications', checked: true })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 't', checked: true, ariaLabel: 'Enable notifications' }) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: `<div class="flex flex-col items-center gap-2 p-4">
  ${renderToggle({ id: 'sc-toggle-dis1', label: 'Enabled (disabled)', checked: true, disabled: true })}
  ${renderToggle({ id: 'sc-toggle-dis2', label: 'Disabled option', checked: false, disabled: true })}
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'a', label: 'Enabled (disabled)', checked: true,  disabled: true }) %>
<%- include('modules/ui/Toggle', { id: 'b', label: 'Disabled option',     checked: false, disabled: true }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex flex-col items-center gap-3 p-4">
  ${renderToggle({ id: 'sc-toggle-sm', label: 'Small', checked: true, size: 'sm' })}
  ${renderToggle({ id: 'sc-toggle-md', label: 'Medium', checked: true, size: 'md' })}
  ${renderToggle({ id: 'sc-toggle-lg', label: 'Large', checked: true, size: 'lg' })}
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'sm', label: 'Small',  size: 'sm', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'md', label: 'Medium', size: 'md', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'lg', label: 'Large',  size: 'lg', checked: true }) %>`,
        },
        {
          title: 'Pending (a write is in flight)',
          previewHtml: `<div class="flex justify-center p-4">${renderToggle({ id: 'sc-toggle-pending', label: 'Heater', checked: true, pending: true })}</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'heater', label: 'Heater', checked: true, pending: true }) %>
<!-- at runtime: document.querySelector('[data-toggle-root="heater"]').__toggle.setPending(false) -->`,
        },
        {
          title: 'Mismatch (the device reports another value)',
          previewHtml: `<div class="flex flex-col items-center gap-1 p-4">
  ${renderToggle({ id: 'sc-toggle-mismatch', label: 'Heater', checked: true, mismatch: true, describedBy: 'sc-toggle-mismatch-hint' })}
  <p id="sc-toggle-mismatch-hint" class="text-center text-xs text-text-secondary">The device reports a different value.</p>
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'heater', label: 'Heater', checked: true, mismatch: true, describedBy: 'heater-hint' }) %>
<p id="heater-hint">The device reports a different value.</p>`,
        },
        {
          title: 'With description',
          previewHtml: `<div class="w-full max-w-xs space-y-3">
  ${renderToggle({ id: 'sc-toggle-desc1', label: 'Marketing emails', description: 'Receive weekly updates and promotions.', checked: true })}
  ${renderToggle({ id: 'sc-toggle-desc2', label: 'Security alerts', description: 'Get notified about account activity.', checked: false })}
</div>`,
          code: `<%- include('modules/ui/Toggle', { id: 'marketing', label: 'Marketing emails', description: 'Receive weekly updates.', checked: true }) %>`,
        },
        {
          title: 'Settings list (controlled)',
          layout: 'stack' as const,
          previewHtml: `<div class="w-full max-w-xs divide-y divide-border border border-border rounded-lg overflow-hidden">
${[
  { key: 'notifications', label: 'Push notifications', desc: 'Alerts for new activity', checked: true },
  { key: 'marketing', label: 'Marketing emails', desc: 'Weekly updates and offers', checked: false },
  { key: 'darkMode', label: 'Dark mode', desc: 'Switch to dark theme', checked: false },
].map((it) => `  <div class="flex items-center justify-between px-4 py-3 bg-surface-base">
    <div>
      <p class="text-sm font-medium text-text-primary">${it.label}</p>
      <p class="text-xs text-text-secondary">${it.desc}</p>
    </div>
    ${renderToggle({ id: 'ctrl-' + it.key, label: '', ariaLabel: it.label, checked: it.checked })}
  </div>`).join('\n')}
</div>`,
          code: `<div class="divide-y border rounded-lg">
  <div class="flex items-center justify-between px-4 py-3">
    <div>
      <p class="text-sm font-medium">Push notifications</p>
      <p class="text-xs text-text-secondary">Alerts for new activity</p>
    </div>
    <%- include('modules/ui/Toggle', { id: 'notifications', label: '', ariaLabel: 'Push notifications', checked: true }) %>
  </div>
  <!-- … one row per setting -->
</div>`,
        },
      ],
    },
  ];
}
