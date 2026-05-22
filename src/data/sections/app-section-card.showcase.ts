import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/SectionCard.ejs'), 'utf-8');

export function buildSectionCardData(): ShowcaseItem[] {
  return [
    {
      id: 'section-card',
      title: 'SectionCard',
      category: 'App',
      abbr: 'SC',
      description: 'Titled content card with rounded-xl + border + bg-surface-raised + p-6. Header is separated by an underline; children slot accepts arbitrary content.',
      filePath: 'modules/app/SectionCard.ejs',
      sourceCode,
      variants: [
        {
          title: 'Basic — title + content',
          previewHtml: `<div class="p-4 w-full max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-6 space-y-4">
    <h3 class="text-sm font-semibold text-text-primary border-b border-border pb-3">Account details</h3>
    <div class="space-y-2 text-sm text-text-secondary">
      <p><span class="text-text-primary font-medium">Name:</span> Jane Doe</p>
      <p><span class="text-text-primary font-medium">Email:</span> jane@acme.com</p>
      <p><span class="text-text-primary font-medium">Role:</span> Administrator</p>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/SectionCard', {
  title: 'Account details',
  children: \`
    <div class="space-y-2 text-sm text-text-secondary">
      <p><span class="text-text-primary font-medium">Name:</span> <%= user.name %></p>
      <p><span class="text-text-primary font-medium">Email:</span> <%= user.email %></p>
      <p><span class="text-text-primary font-medium">Role:</span> <%= user.role %></p>
    </div>
  \`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Form section',
          previewHtml: `<div class="p-4 w-full max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-6 space-y-4">
    <h3 class="text-sm font-semibold text-text-primary border-b border-border pb-3">Notification preferences</h3>
    <div class="space-y-3">
      <label class="flex items-center justify-between text-sm">
        <span class="text-text-primary">Email updates</span>
        <span class="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
          <span class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-4 transition"></span>
        </span>
      </label>
      <label class="flex items-center justify-between text-sm">
        <span class="text-text-primary">Push notifications</span>
        <span class="relative inline-flex h-5 w-9 items-center rounded-full bg-surface-sunken">
          <span class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition"></span>
        </span>
      </label>
      <label class="flex items-center justify-between text-sm">
        <span class="text-text-primary">Weekly digest</span>
        <span class="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
          <span class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-4 transition"></span>
        </span>
      </label>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/SectionCard', {
  title: 'Notification preferences',
  children: \`
    <div class="space-y-3">
      <%- include('modules/ui/Toggle', { label: 'Email updates',      checked: prefs.email }) %>
      <%- include('modules/ui/Toggle', { label: 'Push notifications', checked: prefs.push  }) %>
      <%- include('modules/ui/Toggle', { label: 'Weekly digest',      checked: prefs.weekly }) %>
    </div>
  \`
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
