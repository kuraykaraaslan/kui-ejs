import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const sliderSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Slider.ejs'), 'utf-8');

function renderSlider(locals: Record<string, unknown>): string {
  return ejs.render(sliderSource, locals, { filename: path.join(process.cwd(), 'modules/ui/Slider.ejs') });
}

function heroSlide(label: string, bg: string): string {
  return `<div class="h-40 flex items-center justify-center ${bg} text-white text-base font-semibold">${label}</div>`;
}

function plainSlide(label: string): string {
  return `<div class="h-32 bg-surface-sunken flex items-center justify-center rounded-xl text-sm text-text-secondary">${label}</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildSliderData(): ShowcaseItem[] {
  return [
    {
      id:          'slider',
      title:       'Slider',
      category:    'Organism',
      abbr:        'Sl',
      description: 'Erişilebilir carousel. role="region" + aria-roledescription="carousel" + slide aria etiketleri dahildir. Otomatik oynatma, dot navigasyon ve loop kontrolleri desteklenir.',
      filePath:    'modules/ui/Slider.ejs',
      sourceCode:  sliderSource,
      variants: [
        {
          title:       'Default',
          layout:      'stack',
          previewHtml: `<div class="w-full max-w-md mx-auto">${renderSlider({
            id:     'slider-demo-default',
            slides: [
              heroSlide('Slide 1', 'bg-primary'),
              heroSlide('Slide 2', 'bg-secondary'),
              heroSlide('Slide 3', 'bg-info'),
            ],
          })}</div>`,
          code: `<%- include('modules/ui/Slider', {
  slides: [
    "<div class='h-40 flex items-center justify-center bg-primary text-white'>Slide 1</div>",
    "<div class='h-40 flex items-center justify-center bg-secondary text-white'>Slide 2</div>",
    "<div class='h-40 flex items-center justify-center bg-info text-white'>Slide 3</div>",
  ],
}) %>`,
        },
        {
          title:       'Auto-play',
          layout:      'stack',
          previewHtml: `<div class="w-full max-w-md mx-auto">${renderSlider({
            id:               'slider-demo-autoplay',
            autoPlay:         true,
            autoPlayInterval: 2000,
            slides: [
              heroSlide('Auto 1', 'bg-primary'),
              heroSlide('Auto 2', 'bg-success'),
              heroSlide('Auto 3', 'bg-warning'),
            ],
          })}</div>`,
          code: `<%- include('modules/ui/Slider', {
  slides:           [ /* ... */ ],
  autoPlay:         true,
  autoPlayInterval: 2000,
}) %>`,
        },
        {
          title:       'No arrows / no loop',
          layout:      'stack',
          previewHtml: `<div class="w-full max-w-md mx-auto">${renderSlider({
            id:         'slider-demo-noarrows',
            showArrows: false,
            loop:       false,
            slides: [
              plainSlide('Slide 1 — dots only, no loop'),
              plainSlide('Slide 2'),
              plainSlide('Slide 3'),
            ],
          })}</div>`,
          code: `<%- include('modules/ui/Slider', {
  slides:     [ /* ... */ ],
  showArrows: false,
  loop:       false,
}) %>`,
        },
      ],
    },
  ];
}
