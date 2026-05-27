import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/MentionPicker.ejs'), 'utf-8');

export function buildMentionPickerData(): ShowcaseItem[] {
  return [
    {
      id: 'mention-picker',
      title: 'MentionPicker',
      category: 'App',
      abbr: 'MP',
      since: '2026-05',
      description: '@-trigger autocomplete picker. Headless: takes users + query + position, fires onSelect. Keyboard nav (ArrowUp/Down, Enter/Tab, Escape).',
      filePath: 'modules/app/MentionPicker.ejs',
      sourceCode,
      variants: [
        {
          title: 'Filtered list',
          layout: 'stack',
          previewHtml: `<div class="flex flex-col items-center gap-4 py-6">
  <div role="listbox" aria-label="Users to mention" class="z-50 w-72 rounded-lg border border-border bg-surface-raised shadow-lg overflow-hidden">
    <div class="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-text-secondary">
      <i class="fa-solid fa-at text-text-disabled" style="font-size: 0.75rem;" aria-hidden="true"></i>
      <span class="font-medium">"al"</span>
    </div>
    <ul class="max-h-64 overflow-y-auto py-1">
      <li role="option" aria-selected="true" class="flex items-center gap-3 px-3 py-2 cursor-pointer bg-surface-overlay">
        <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">AB</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text-primary truncate">Alice Brooks</p>
          <p class="text-xs text-text-secondary truncate">@aliceb</p>
        </div>
      </li>
      <li role="option" aria-selected="false" class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-surface-overlay">
        <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">DA</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text-primary truncate">Diego Alvarez</p>
          <p class="text-xs text-text-secondary truncate">@diegoa</p>
        </div>
      </li>
    </ul>
  </div>
</div>`,
          code: `<%- include('modules/app/MentionPicker', {
  users: candidates,
  query: 'al',
  anchorInputId: 'comment-input'
}) %>`,
        },
        {
          title: 'Empty results',
          layout: 'stack',
          previewHtml: `<div class="flex justify-center py-6">
  <div role="listbox" aria-label="Users to mention" class="z-50 w-72 rounded-lg border border-border bg-surface-raised shadow-lg overflow-hidden">
    <div class="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-text-secondary">
      <i class="fa-solid fa-at text-text-disabled" style="font-size: 0.75rem;" aria-hidden="true"></i>
      <span class="font-medium">"zzz"</span>
    </div>
    <p class="px-3 py-4 text-sm text-center text-text-secondary">No matching users</p>
  </div>
</div>`,
          code: `<%- include('modules/app/MentionPicker', {
  users: candidates,
  query: 'zzz'
}) %>`,
        },
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="listbox"', 'role="option"', 'aria-selected'],
        keyboardInteractions: [
          { keys: 'ArrowDown / ArrowUp', action: 'Move selection' },
          { keys: 'Enter / Tab',          action: 'Insert highlighted mention' },
          { keys: 'Escape',               action: 'Cancel picker' },
        ],
      },
    },
  ];
}
