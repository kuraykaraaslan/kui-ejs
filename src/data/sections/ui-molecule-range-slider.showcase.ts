import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const rangeSliderPath   = path.join(process.cwd(), 'modules/ui/RangeSlider.ejs');
const rangeSliderSource = fs.readFileSync(rangeSliderPath, 'utf-8');

function renderRangeSlider(locals: Record<string, unknown>): string {
  return ejs.render(rangeSliderSource, locals, { filename: rangeSliderPath });
}

const wrap = (inner: string) => `<div class="w-full max-w-sm p-2">${inner}</div>`;

export function buildRangeSliderData(): ShowcaseItem[] {
  return [
    {
      id: 'range-slider',
      title: 'RangeSlider',
      category: 'Molecule',
      abbr: 'Rs',
      description:
        'Numeric slider input, distinct from Slider (a carousel). Single mode renders one native `<input type="range">` with a server-computed token gradient fill. Range (dual-handle) mode overlays two native range inputs with a shared fill bar and a small inline script that clamps the handles against each other and keeps the fill in sync while dragging.',
      filePath: 'modules/ui/RangeSlider.ejs',
      sourceCode: rangeSliderSource,
      since: '2026-09',
      variants: [
        {
          title: 'Single value',
          layout: 'stack' as const,
          previewHtml: wrap(renderRangeSlider({
            id: 'rs-demo-single',
            label: 'Volume',
            value: 65,
            min: 0,
            max: 100,
          })),
          code: `<%- include('modules/ui/RangeSlider', {
  label: 'Volume',
  value: 65,
  min: 0,
  max: 100,
  name: 'volume',
}) %>`,
        },
        {
          title: 'Dual-handle range',
          layout: 'stack' as const,
          previewHtml: wrap(renderRangeSlider({
            id: 'rs-demo-range',
            label: 'Price range',
            range: true,
            value: [20, 80],
            min: 0,
            max: 100,
          })),
          code: `<%- include('modules/ui/RangeSlider', {
  label: 'Price range',
  range: true,
  value: [20, 80],
  min: 0,
  max: 100,
  nameMin: 'priceMin',
  nameMax: 'priceMax',
}) %>`,
        },
      ],
    },
  ];
}
