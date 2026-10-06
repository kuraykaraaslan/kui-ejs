import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const rangeSliderPath   = path.join(process.cwd(), 'modules/ui/RangeSlider.ejs');
const rangeSliderSource = fs.readFileSync(rangeSliderPath, 'utf-8');

function renderRangeSlider(locals: Record<string, unknown>): string {
  return ejs.render(rangeSliderSource, locals, { filename: rangeSliderPath });
}

const CLS = 'w-full max-w-xs';

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
          previewHtml: renderRangeSlider({
            className: CLS,
            id: 'rs-demo-single',
            label: 'Volume',
            value: 65,
            min: 0,
            max: 100,
          }),
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
          previewHtml: renderRangeSlider({
            className: CLS,
            id: 'rs-demo-range',
            label: 'Price range',
            range: true,
            value: [20, 80],
            min: 0,
            max: 100,
          }),
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
        {
          title: 'Commit on release (one write per gesture)',
          layout: 'stack' as const,
          previewHtml: `<div id="rs-commit-wrap" class="w-full max-w-xs space-y-1">${renderRangeSlider({ id: 'rs-demo-commit', label: 'Fan speed', value: 40, min: 0, max: 100, step: 5 })}<p class="text-xs text-text-secondary" data-commits>Commits: none yet</p></div>
<script>(function(){var w=document.getElementById('rs-commit-wrap');if(!w)return;var n=0;w.addEventListener('kui:rangeslider-commit',function(e){n++;w.querySelector('[data-commits]').textContent='Commits: '+n+' (last value '+e.detail.value+')';});})();</script>`,
          code: `<%- include('modules/ui/RangeSlider', { id: 'fan', label: 'Fan speed', value: 40, step: 5 }) %>
<script>
  // 'input' still fires per step (live label); the commit fires once per gesture:
  // pointer up, 400 ms of keyboard idle, or blur.
  document.getElementById('fan').addEventListener('kui:rangeslider-commit', (e) => api.setFan(e.detail.value));
</script>`,
        },
        {
          title: 'Pending (a write is in flight)',
          layout: 'stack' as const,
          previewHtml: `<div class="w-full max-w-xs">${renderRangeSlider({ id: 'rs-demo-pending', label: 'Fan speed', value: 40, min: 0, max: 100, step: 5, pending: true })}</div>`,
          code: `<%- include('modules/ui/RangeSlider', { id: 'fan', label: 'Fan speed', value: 40, step: 5, pending: true }) %>
<!-- at runtime: document.getElementById('fan').__rangeslider.setPending(false) -->`,
        },
      ],
    },
  ];
}
