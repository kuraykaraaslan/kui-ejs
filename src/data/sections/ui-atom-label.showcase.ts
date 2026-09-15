import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Label.ejs'), 'utf-8');

export function buildLabelData(): ShowcaseItem[] {
  return [
    {
      id: 'label',
      title: 'Label',
      category: 'Atom',
      abbr: 'Lb',
      description: 'Standalone form label with an optional required indicator and disabled state, for pairing with custom controls that do not manage their own label.',
      filePath: 'modules/ui/Label.ejs',
      sourceCode,
      variants: [
        {
          title: 'Basic + required',
          previewHtml: `<div class="p-4 space-y-3">
  <label for="label-demo-name" class="block text-sm font-medium text-text-primary select-none">Full name</label>
  <label for="label-demo-email" class="block text-sm font-medium text-text-primary select-none">Email address<span class="text-error ml-1" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
</div>`,
          code: `<%- include('modules/ui/Label', { for: 'name', label: 'Full name' }) %>
<%- include('modules/ui/Label', { for: 'email', label: 'Email address', required: true }) %>`,
        },
        {
          title: 'Disabled',
          layout: 'stack' as const,
          previewHtml: `<div class="p-4 space-y-1.5 max-w-xs">
  <label for="label-demo-handle" class="block text-sm font-medium text-text-disabled cursor-not-allowed select-none">Handle (disabled)</label>
  <input id="label-demo-handle" disabled placeholder="@handle" class="w-full rounded-md border border-border bg-surface-sunken px-3 py-2 text-sm text-text-disabled disabled:cursor-not-allowed" />
</div>`,
          code: `<%- include('modules/ui/Label', { for: 'handle', label: 'Handle (disabled)', disabled: true }) %>
<input id="handle" disabled placeholder="@handle" />`,
        },
      ],
    },
  ];
}
