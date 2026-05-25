import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';

const galleryTemplatePath = path.join(process.cwd(), 'modules/app/ImageGallery.ejs');
const sourceCode = fs.readFileSync(galleryTemplatePath, 'utf-8');

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

/* ── Static grid preview ────────────────────────────────────────────────────
   The ImageGallery grid is rendered by client-side JS. For the static preview
   we build equivalent HTML so the showcase looks identical to the live component.
   ─────────────────────────────────────────────────────────────────────────── */
type GalleryAspect = 'square' | 'video' | 'portrait' | 'auto';
type GalleryGap    = 'sm' | 'md' | 'lg';

const COL_CLASS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
};
const GAP_CLASS: Record<GalleryGap, string> = { sm: 'gap-1', md: 'gap-2', lg: 'gap-4' };
const ASP_CLASS: Record<GalleryAspect, string> = {
  square: 'aspect-square', video: 'aspect-video', portrait: 'aspect-[3/4]', auto: '',
};

function buildTile(
  img: typeof IMAGES[0],
  i: number,
  total: number,
  aspect: GalleryAspect,
  showCaptions: boolean,
  reorderable: boolean,
): string {
  const aspClass = ASP_CLASS[aspect];
  const imgExtra = aspect === 'auto' ? 'aspect-square' : '';
  const grabClass = reorderable ? 'cursor-grab' : '';
  const grip = reorderable
    ? `<div aria-hidden="true" class="absolute top-1.5 left-1.5 z-10 w-6 h-6 flex items-center justify-center rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <i class="fa-solid fa-grip-vertical text-xs" aria-hidden="true"></i>
       </div>`
    : '';
  const caption = showCaptions && img.caption
    ? `<p class="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1 pointer-events-none line-clamp-1">${img.caption}</p>`
    : '';
  return `<div role="listitem" class="group relative overflow-hidden rounded-lg bg-surface-sunken transition-all duration-200 ${aspClass} ${grabClass}">
    <img src="${img.src}" alt="${img.alt}" loading="lazy" draggable="false"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imgExtra}" />
    ${grip}
    ${caption}
  </div>`;
}

function buildGalleryPreview(
  images: typeof IMAGES,
  columns: 2 | 3 | 4,
  aspect: GalleryAspect,
  gap: GalleryGap,
  showCaptions = false,
  reorderable = false,
  maxWidth = 'max-w-2xl',
): string {
  const tiles = images
    .map((img, i) => buildTile(img, i, images.length, aspect, showCaptions, reorderable))
    .join('');
  return `<div class="w-full ${maxWidth}">
    <div class="grid ${COL_CLASS[columns]} ${GAP_CLASS[gap]}" role="list" aria-label="Image gallery">
      ${tiles}
    </div>
  </div>`;
}

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
      filePath: 'modules/app/ImageGallery.ejs',
      sourceCode,
      variants: [
        {
          title: 'Reorderable — drag + right-click menu',
          layout: 'stack',
          previewHtml: (() => {
            const hint = `<p class="text-xs text-text-secondary select-none mb-2">Drag images to reorder • Right-click for context menu</p>`;
            return `<div class="w-full max-w-2xl space-y-2">${hint}${buildGalleryPreview(IMAGES, 3, 'square', 'md', false, true)}</div>`;
          })(),
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
          previewHtml: buildGalleryPreview(IMAGES, 3, 'square', 'md'),
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
          previewHtml: buildGalleryPreview(SMALL_SET, 2, 'video', 'lg', true, false, 'max-w-lg'),
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
          previewHtml: buildGalleryPreview(IMAGES, 4, 'square', 'sm'),
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
