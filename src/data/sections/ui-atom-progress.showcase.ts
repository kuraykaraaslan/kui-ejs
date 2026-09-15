import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const progressPath   = path.join(process.cwd(), 'modules/ui/Progress.ejs');
const progressSource = fs.readFileSync(progressPath, 'utf-8');

function renderProgress(locals: Record<string, unknown>): string {
  return ejs.render(progressSource, locals, { filename: progressPath });
}

const wrap = (inner: string) => `<div class="w-full max-w-sm space-y-4">${inner}</div>`;

export function buildProgressData(): ShowcaseItem[] {
  return [
    {
      id: 'progress',
      title: 'Progress',
      category: 'Atom',
      abbr: 'Pr',
      description:
        'Progress indicator in bar or circle shape. Server-rendered only — the bar fill width and circle stroke-dasharray/dashoffset are computed from `value` at render time. Variant maps to semantic tokens (primary/success/warning/error); `showLabel` renders the current percentage.',
      filePath: 'modules/ui/Progress.ejs',
      sourceCode: progressSource,
      since: '2026-09',
      variants: [
        {
          title: 'Bar — variants',
          layout: 'stack' as const,
          previewHtml: wrap(
            renderProgress({ value: 72, variant: 'primary', showLabel: true, label: 'Upload progress' }) +
            '<div class="mt-3"></div>' +
            renderProgress({ value: 100, variant: 'success', showLabel: true, label: 'Sync complete' }) +
            '<div class="mt-3"></div>' +
            renderProgress({ value: 45, variant: 'warning', showLabel: true, label: 'Storage used' }) +
            '<div class="mt-3"></div>' +
            renderProgress({ value: 90, variant: 'error', showLabel: true, label: 'Error budget' })
          ),
          code: `<%- include('modules/ui/Progress', {
  value: 72,
  variant: 'primary',
  showLabel: true,
  label: 'Upload progress',
}) %>`,
        },
        {
          title: 'Circle shape',
          previewHtml: wrap(
            '<div class="flex items-center gap-6">' +
            renderProgress({ value: 66, shape: 'circle', size: 'md', showLabel: true, label: 'Profile completeness' }) +
            renderProgress({ value: 100, shape: 'circle', size: 'lg', variant: 'success', showLabel: true, label: 'Task done' }) +
            '</div>'
          ),
          code: `<%- include('modules/ui/Progress', {
  value: 66,
  shape: 'circle',
  size: 'lg',
  showLabel: true,
  label: 'Profile completeness',
}) %>`,
        },
      ],
    },
  ];
}
