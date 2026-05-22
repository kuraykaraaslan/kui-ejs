import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Popover.ejs'), 'utf-8');

const placementClassMap: Record<string, string> = {
  bottom: 'top-full left-0 mt-2',
  top:    'bottom-full left-0 mb-2',
  left:   'right-full top-0 mr-2',
  right:  'left-full top-0 ml-2',
};

function popoverEl(opts: {
  trigger: string;
  children: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const pc = placementClassMap[opts.placement || 'bottom'];
  return `<div class="relative inline-block">
  <div aria-haspopup="dialog" aria-expanded="true">
    ${opts.trigger}
  </div>
  <div role="dialog" class="absolute z-[70] min-w-[12rem] rounded-lg border border-border bg-surface-raised shadow-xl focus-visible:outline-none ${pc}${opts.className ? ' ' + opts.className : ''}">
    ${opts.children}
  </div>
</div>`;
}

const trigger = (label: string) =>
  `<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
    ${label}
  </button>`;

const stage = (inner: string) =>
  `<div class="flex items-start justify-center gap-12 py-8 px-8" style="min-height:280px">${inner}</div>`;

const infoBody = `<div class="p-4 w-64">
  <h4 class="text-sm font-semibold text-text-primary mb-1">Pro tier</h4>
  <p class="text-xs text-text-secondary">Unlocks unlimited projects, advanced analytics and priority support.</p>
  <button type="button" class="mt-3 inline-flex items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-xs font-medium">Upgrade</button>
</div>`;

const formBody = `<div class="p-4 w-72">
  <label class="block text-sm font-medium text-text-primary mb-1">Quick note</label>
  <textarea rows="3" class="block w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus" placeholder="Type a note…"></textarea>
  <div class="mt-3 flex justify-end gap-2">
    <button type="button" class="px-3 py-1.5 text-xs rounded-md border border-border text-text-secondary hover:bg-surface-overlay">Cancel</button>
    <button type="button" class="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-fg hover:bg-primary-hover">Save</button>
  </div>
</div>`;

const listBody = `<ul class="py-1 w-56">
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay"><i class="fa-solid fa-user w-4" aria-hidden="true"></i>Profile</a></li>
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay"><i class="fa-solid fa-gear w-4" aria-hidden="true"></i>Settings</a></li>
  <li><a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay"><i class="fa-solid fa-circle-question w-4" aria-hidden="true"></i>Help</a></li>
</ul>`;

export function buildPopoverData(): ShowcaseItem[] {
  return [
    {
      id: 'popover',
      title: 'Popover',
      category: 'Organism',
      abbr: 'Po',
      description: 'Anchor-based contextual panel. Closes on outside click and Escape key. Supports top/bottom/left/right placement.',
      filePath: 'modules/ui/Popover.ejs',
      sourceCode,
      variants: [
        {
          title: 'Info popover (bottom)',
          previewHtml: stage(popoverEl({
            trigger: trigger('What is Pro?'),
            children: infoBody,
            placement: 'bottom',
          })),
          code: `<%- include('modules/ui/Popover', {
  id: 'pro-info',
  trigger: '<button>What is Pro?</button>',
  placement: 'bottom',
  children: '<div class="p-4 w-64">...</div>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Inline form (right)',
          previewHtml: stage(popoverEl({
            trigger: trigger('Add note'),
            children: formBody,
            placement: 'right',
          })),
          code: `<%- include('modules/ui/Popover', {
  id: 'note-popover',
  trigger: '<button>Add note</button>',
  placement: 'right',
  children: '<div class="p-4 w-72">...</div>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'List menu (top)',
          previewHtml: stage(popoverEl({
            trigger: trigger('Account'),
            children: listBody,
            placement: 'top',
          })),
          code: `<%- include('modules/ui/Popover', {
  id: 'account-popover',
  trigger: '<button>Account</button>',
  placement: 'top',
  children: '<ul class="py-1 w-56">...</ul>'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
