import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const galleryTemplatePath = path.join(process.cwd(), 'modules/app/ImageGallery/index.ejs');
const sourceCode = fs.readFileSync(galleryTemplatePath, 'utf-8');

function renderGallery(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: galleryTemplatePath });
}

/* ── Sample images (same seeds as the Next.js showcase) ────────────────────── */
const IMAGES = [
  { src: 'https://picsum.photos/seed/gal1/800/600', alt: 'Mountain landscape',  caption: 'Sunrise over the Alps'      },
  { src: 'https://picsum.photos/seed/gal2/800/600', alt: 'Ocean sunset',         caption: 'Golden hour at the coast'   },
  { src: 'https://picsum.photos/seed/gal3/800/600', alt: 'Forest path',          caption: 'Morning mist in the forest' },
  { src: 'https://picsum.photos/seed/gal4/800/600', alt: 'City skyline',         caption: 'Downtown at dusk'           },
  { src: 'https://picsum.photos/seed/gal5/800/600', alt: 'Desert dunes',         caption: 'Sahara at golden hour'      },
  { src: 'https://picsum.photos/seed/gal6/800/600', alt: 'Snowy peaks',          caption: 'First snowfall of the year' },
  { src: 'https://picsum.photos/seed/gal7/800/600', alt: 'Tropical beach',       caption: 'Crystal-clear lagoon'       },
  { src: 'https://picsum.photos/seed/gal8/800/600', alt: 'Autumn colors',        caption: 'Peak foliage season'        },
];

const SMALL_SET = IMAGES.slice(0, 4);

export function buildImageGalleryData(): ShowcaseItem[] {
  return [
    {
      id: 'image-gallery',
      title: 'ImageGallery',
      category: 'App',
      abbr: 'IG',
      since: '2026-05',
      description:
        'Responsive image grid with a full-screen lightbox, right-click context menu (open, copy URL, move to first/last, remove), and drag-to-reorder. Supports 2–4 columns, square / video / portrait / auto aspect ratios, optional captions, zoom toggle, thumbnail strip, and full keyboard navigation (← → Escape).',
      filePath: 'modules/app/ImageGallery/index.ejs',
      sourceCode,
      variants: [
        {
          title: 'Reorderable — drag + right-click menu',
          layout: 'stack',
          previewHtml: `
            <div class="w-full max-w-2xl space-y-2">
              <p class="text-xs text-text-secondary select-none mb-2">Drag images to reorder • Right-click for context menu</p>
              ${renderGallery({ images: IMAGES, columns: 3, aspect: 'square', gap: 'md', reorderable: true })}
            </div>`,
          code: `<%- include('modules/app/ImageGallery', {
  images: [
    { src: '/photo-1.jpg', alt: 'Mountain', caption: 'Sunrise over the Alps' },
    { src: '/photo-2.jpg', alt: 'Ocean',    caption: 'Golden hour'           },
    { src: '/photo-3.jpg', alt: 'Forest',   caption: 'Morning mist'          },
  ],
  columns:    3,
  aspect:     'square',
  gap:        'md',
  reorderable: true
}) %>`,
        },
        {
          title: '3-column grid — lightbox only',
          layout: 'stack',
          previewHtml: `
            <div class="w-full max-w-2xl">
              ${renderGallery({ images: IMAGES, columns: 3, aspect: 'square', gap: 'md' })}
            </div>`,
          code: `<%- include('modules/app/ImageGallery', {
  images: images,
  columns: 3,
  aspect:  'square',
  gap:     'md'
}) %>`,
        },
        {
          title: '2-column with captions',
          layout: 'stack',
          previewHtml: `
            <div class="w-full max-w-lg">
              ${renderGallery({ images: SMALL_SET, columns: 2, aspect: 'video', gap: 'lg', showCaptions: true })}
            </div>`,
          code: `<%- include('modules/app/ImageGallery', {
  images:      images,
  columns:     2,
  aspect:      'video',
  gap:         'lg',
  showCaptions: true
}) %>`,
        },
        {
          title: '4-column compact',
          layout: 'stack',
          previewHtml: `
            <div class="w-full max-w-2xl">
              ${renderGallery({ images: IMAGES, columns: 4, aspect: 'square', gap: 'sm' })}
            </div>`,
          code: `<%- include('modules/app/ImageGallery', {
  images:  images,
  columns: 4,
  aspect:  'square',
  gap:     'sm'
}) %>`,
        },
      ],
    },
  ];
}
