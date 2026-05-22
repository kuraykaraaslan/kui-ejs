import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const publishStatusSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/status/PublishStatusBadge.ejs'), 'utf-8');
const visibilityBadgeSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/status/VisibilityBadge.ejs'), 'utf-8');
const processingStatusSource  = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/status/ProcessingStatusIndicator.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function badgeEl(variant: string, children: string, icon?: string): string {
  const vc: Record<string, string> = {
    success: 'bg-success-subtle text-success-fg',
    error:   'bg-error-subtle text-error-fg',
    warning: 'bg-warning-subtle text-warning-fg',
    neutral: 'bg-surface-sunken text-text-secondary',
  };
  const inner = icon ? `${icon} ${children}` : children;
  return `<span class="inline-flex items-center gap-1 rounded-full font-medium ${vc[variant] || vc.neutral} px-2 py-0.5 text-xs">${inner}</span>`;
}

function processingEl(status: string, progress: number | null, size = 'md', label?: string): string {
  const meta: Record<string, { lbl: string; icon: string; color: string; pulse: boolean }> = {
    UPLOADING:  { lbl: 'Uploading',  icon: 'fa-solid fa-cloud-arrow-up', color: 'text-info',    pulse: true },
    PROCESSING: { lbl: 'Processing', icon: 'fa-solid fa-gear',            color: 'text-warning', pulse: true },
    READY:      { lbl: 'Ready',      icon: 'fa-solid fa-check',           color: 'text-success', pulse: false },
    FAILED:     { lbl: 'Failed',     icon: 'fa-solid fa-xmark',           color: 'text-error',   pulse: false },
  };
  const barColor: Record<string, string> = { UPLOADING: 'bg-info', PROCESSING: 'bg-warning', READY: 'bg-success', FAILED: 'bg-error' };
  const m = meta[status] || meta.PROCESSING;
  const sizeMap: Record<string, { text: string; icon: string; bar: string }> = {
    sm: { text: 'text-xs', icon: 'text-sm', bar: 'h-1' },
    md: { text: 'text-sm', icon: 'text-base', bar: 'h-1.5' },
    lg: { text: 'text-base', icon: 'text-lg', bar: 'h-2' },
  };
  const s = sizeMap[size] || sizeMap.md;
  const displayLabel = label || m.lbl;
  const pct = progress !== null ? Math.min(100, Math.max(0, progress)) : 0;

  return `<div class="space-y-1.5">
  <div class="flex items-center gap-2">
    <span class="${s.icon} ${m.color}${m.pulse ? ' animate-pulse' : ''}" aria-hidden="true"><i class="${m.icon}"></i></span>
    <span class="${s.text} font-medium text-text-primary">${displayLabel}</span>
    ${progress !== null ? `<span class="${s.text} text-text-secondary ml-auto tabular-nums">${Math.round(progress)}%</span>` : ''}
  </div>
  ${progress !== null ? `<div class="w-full rounded-full bg-surface-sunken overflow-hidden ${s.bar}">
    <div role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
      class="h-full rounded-full transition-all duration-300 ${barColor[status] || 'bg-primary'}"
      style="width:${pct}%"></div>
  </div>` : ''}
</div>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonStatusData(): ShowcaseItem[] {
  return [
    // ── PublishStatusBadge ────────────────────────────────────────────────────
    {
      id: 'publish-status-badge',
      title: 'PublishStatusBadge',
      category: 'Domain',
      abbr: 'Pb',
      description: 'Badge for DRAFT / PUBLISHED / ARCHIVED content states with contextual Font Awesome icons. Icon can be hidden via showIcon={false}.',
      filePath: 'modules/domain/common/status/PublishStatusBadge.ejs',
      sourceCode: publishStatusSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  ${badgeEl('warning', 'Draft',     '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>')}
  ${badgeEl('success', 'Published', '<i class="fa-solid fa-globe" aria-hidden="true"></i>')}
  ${badgeEl('neutral', 'Archived',  '<i class="fa-solid fa-box-archive" aria-hidden="true"></i>')}
</div>`,
          code: `<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'DRAFT' }) %>
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'PUBLISHED' }) %>
<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'ARCHIVED' }) %>`,
        },
        {
          title: 'Without icon, small',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  ${badgeEl('warning', 'Draft')}
  ${badgeEl('success', 'Published')}
  ${badgeEl('neutral', 'Archived')}
</div>`,
          code: `<%- include('modules/domain/common/status/PublishStatusBadge', { status: 'DRAFT', showIcon: false, size: 'sm' }) %>`,
        },
      ],
    },

    // ── VisibilityBadge ───────────────────────────────────────────────────────
    {
      id: 'visibility-badge',
      title: 'VisibilityBadge',
      category: 'Domain',
      abbr: 'Vb',
      description: 'Badge for PUBLIC / PRIVATE / UNLISTED visibility states with eye/lock icons. PUBLIC is green, PRIVATE is red, UNLISTED is neutral.',
      filePath: 'modules/domain/common/status/VisibilityBadge.ejs',
      sourceCode: visibilityBadgeSource,
      variants: [
        {
          title: 'All states',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  ${badgeEl('success', 'Public',   '<i class="fa-solid fa-eye" aria-hidden="true"></i>')}
  ${badgeEl('error',   'Private',  '<i class="fa-solid fa-lock" aria-hidden="true"></i>')}
  ${badgeEl('neutral', 'Unlisted', '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>')}
</div>`,
          code: `<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PRIVATE' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'UNLISTED' }) %>`,
        },
        {
          title: 'Sizes',
          previewHtml: `<div class="flex items-center gap-3 p-4 flex-wrap">
  <span class="inline-flex items-center gap-1 rounded-full font-medium bg-success-subtle text-success-fg px-1.5 py-0 text-[10px]"><i class="fa-solid fa-eye" aria-hidden="true"></i>Public</span>
  ${badgeEl('success', 'Public', '<i class="fa-solid fa-eye" aria-hidden="true"></i>')}
  <span class="inline-flex items-center gap-1 rounded-full font-medium bg-success-subtle text-success-fg px-3 py-1 text-sm"><i class="fa-solid fa-eye" aria-hidden="true"></i>Public</span>
</div>`,
          code: `<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'sm' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'md' }) %>
<%- include('modules/domain/common/status/VisibilityBadge', { visibility: 'PUBLIC', size: 'lg' }) %>`,
        },
      ],
    },

    // ── ProcessingStatusIndicator ─────────────────────────────────────────────
    {
      id: 'processing-status-indicator',
      title: 'ProcessingStatusIndicator',
      category: 'Domain',
      abbr: 'Pi',
      description: 'Animated status indicator for UPLOADING / PROCESSING / READY / FAILED states. Optional progress bar with percentage.',
      filePath: 'modules/domain/common/status/ProcessingStatusIndicator.ejs',
      sourceCode: processingStatusSource,
      variants: [
        {
          title: 'All states',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-4">
  ${processingEl('UPLOADING',  30,   'md')}
  ${processingEl('PROCESSING', 65,   'md')}
  ${processingEl('READY',      100,  'md')}
  ${processingEl('FAILED',     null, 'md')}
</div>`,
          code: `<%- include('modules/domain/common/status/ProcessingStatusIndicator', { status: 'UPLOADING',  progress: 30 }) %>
<%- include('modules/domain/common/status/ProcessingStatusIndicator', { status: 'PROCESSING', progress: 65 }) %>
<%- include('modules/domain/common/status/ProcessingStatusIndicator', { status: 'READY',      progress: 100 }) %>
<%- include('modules/domain/common/status/ProcessingStatusIndicator', { status: 'FAILED' }) %>`,
        },
        {
          title: 'Custom label + sizes',
          previewHtml: `<div class="w-full max-w-sm p-4 space-y-4">
  ${processingEl('PROCESSING', 45, 'sm', 'Encoding video…')}
  ${processingEl('PROCESSING', 45, 'md', 'Encoding video…')}
  ${processingEl('PROCESSING', 45, 'lg', 'Encoding video…')}
</div>`,
          code: `<%- include('modules/domain/common/status/ProcessingStatusIndicator', {
  status: 'PROCESSING', label: 'Encoding video…', progress: 45, size: 'lg'
}) %>`,
        },
      ],
    },
  ];
}
