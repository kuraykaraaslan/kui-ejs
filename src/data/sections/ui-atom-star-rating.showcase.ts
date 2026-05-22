import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/StarRating.ejs'), 'utf-8');

const sizeClassesMap: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};
const gapClassesMap: Record<string, string> = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

function readonlyStars(value: number, size: 'sm' | 'md' | 'lg', caption = ''): string {
  const TOTAL = 5;
  const sz = sizeClassesMap[size];
  const gap = gapClassesMap[size];
  const label = `${value.toFixed(1)} out of ${TOTAL} stars`;
  const icons: string[] = [];
  for (let i = 1; i <= TOTAL; i++) {
    const filled = value >= i;
    const half = !filled && value >= i - 0.5;
    const iconClass = filled ? 'fa-solid fa-star' : (half ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star');
    const colorClass = (filled || half) ? 'text-warning' : 'text-text-disabled';
    icons.push(`<i class="${iconClass} ${sz} ${colorClass}" aria-hidden="true"></i>`);
  }
  const captionHtml = caption ? `<span class="ml-2 text-sm text-text-secondary">${caption}</span>` : '';
  return `<span class="inline-flex items-center ${gap}" role="img" aria-label="${label}">${icons.join('')}${captionHtml}</span>`;
}

function interactiveStars(value: number, size: 'sm' | 'md' | 'lg' = 'lg', ariaLabel = 'Pick a rating'): string {
  const TOTAL = 5;
  const sz = sizeClassesMap[size];
  const gap = gapClassesMap[size];
  const buttons: string[] = [];
  for (let k = 1; k <= TOTAL; k++) {
    const filled = value >= k;
    const checked = value === k;
    buttons.push(
      `<button type="button" role="radio" aria-checked="${checked ? 'true' : 'false'}" aria-label="${k} ${k === 1 ? 'star' : 'stars'}" class="rounded-sm transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="${filled ? 'fa-solid fa-star' : 'fa-regular fa-star'} ${sz} ${filled ? 'text-warning' : 'text-text-disabled'}" aria-hidden="true"></i></button>`
    );
  }
  return `<span role="radiogroup" aria-label="${ariaLabel}" class="inline-flex items-center ${gap}">${buttons.join('')}</span>`;
}

export function buildStarRatingData(): ShowcaseItem[] {
  return [
    {
      id: 'star-rating',
      title: 'StarRating',
      category: 'Atom',
      abbr: 'SR',
      description:
        'Five-star rating indicator. Read-only by default with decimal/half-star rendering; pass `readonly: false` for interactive whole-star selection.',
      filePath: 'modules/ui/StarRating.ejs',
      since: '2026-05',
      sourceCode,
      whenToUse:
        'Surface a 0–5 star score (e.g. product / hotel / restaurant ratings) or let users submit a new rating.',
      whenNotToUse:
        'For non-star scales (e.g. NPS, percentages) use ContentScoreBar or a custom indicator instead.',
      composes: [],
      designTokens: ['--warning', '--text-disabled', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="img" (readonly)', 'role="radiogroup" / role="radio" (interactive)'],
      },
      variants: [
        {
          title: 'Readonly with decimals',
          previewHtml: `<div class="flex justify-center p-4"><div class="flex flex-col gap-2">
  ${readonlyStars(4.7, 'sm', '(312 reviews)')}
  ${readonlyStars(3.5, 'md')}
  ${readonlyStars(2.2, 'lg')}
</div></div>`,
          code: `<%- include('modules/ui/StarRating', { value: 4.7, size: 'sm', caption: '(312 reviews)' }) %>
<%- include('modules/ui/StarRating', { value: 3.5, size: 'md' }) %>
<%- include('modules/ui/StarRating', { value: 2.2, size: 'lg' }) %>`,
        },
        {
          title: 'Interactive',
          previewHtml: `<div class="flex justify-center p-4"><div class="flex flex-col items-start gap-2">
  ${interactiveStars(0, 'lg', 'Pick a rating')}
  <p class="text-xs text-text-secondary">Selected: <span class="font-semibold text-text-primary">–</span></p>
</div></div>`,
          code: `<%- include('modules/ui/StarRating', {
  value: 0,
  readonly: false,
  size: 'lg',
  ariaLabel: 'Pick a rating'
}) %>`,
        },
      ],
    },
  ];
}
