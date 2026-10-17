# ImageGallery

- **id:** `image-gallery`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ImageGallery/index.ejs`
- **status:** stable
- **since:** 2026-05

Responsive image grid with a full-screen lightbox, right-click context menu (open, copy URL, move to first/last, remove), and drag-to-reorder. Supports 2–4 columns, square / video / portrait / auto aspect ratios, optional captions, zoom toggle, thumbnail strip, and full keyboard navigation (← → Escape).

## Variants

### Reorderable — drag + right-click menu

```ejs
<%- include('modules/app/ImageGallery', {
  images: [
    { src: '/photo-1.jpg', alt: 'Mountain', caption: 'Sunrise over the Alps' },
    { src: '/photo-2.jpg', alt: 'Ocean',    caption: 'Golden hour'           },
    { src: '/photo-3.jpg', alt: 'Forest',   caption: 'Morning mist'          },
  ],
  columns:    3,
  aspect:     'square',
  gap:        'md',
  reorderable: true
}) %>
```

### 3-column grid — lightbox only

```ejs
<%- include('modules/app/ImageGallery', {
  images: images,
  columns: 3,
  aspect:  'square',
  gap:     'md'
}) %>
```

### 2-column with captions

```ejs
<%- include('modules/app/ImageGallery', {
  images:      images,
  columns:     2,
  aspect:      'video',
  gap:         'lg',
  showCaptions: true
}) %>
```

### 4-column compact

```ejs
<%- include('modules/app/ImageGallery', {
  images:  images,
  columns: 4,
  aspect:  'square',
  gap:     'sm'
}) %>
```

## Full EJS source

```ejs
<%
  var _id          = locals.id          || 'gallery-' + Math.random().toString(36).substr(2, 9);
  var _images      = locals.images      || [];
  var _columns     = locals.columns     || 3;
  var _aspect      = locals.aspect      || 'square';
  var _gap         = locals.gap         || 'md';
  var _lightbox    = locals.lightbox    !== false;
  var _showCaptions = !!locals.showCaptions;
  var _reorderable = !!locals.reorderable;

  var _colClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' }[_columns] || 'grid-cols-2 sm:grid-cols-3';
  var _gapClass = { sm: 'gap-1', md: 'gap-2', lg: 'gap-4' }[_gap] || 'gap-2';
  var _aspClass = { square: 'aspect-square', video: 'aspect-video', portrait: 'aspect-[3/4]', auto: '' }[_aspect] || 'aspect-square';
%>

<%- include('./partials/_grid',     { _id: _id, _colClass: _colClass, _gapClass: _gapClass }) %>
<%- include('./partials/_lightbox', { _id: _id }) %>

<script>
(function () {
  var G_ID    = <%- include('../../ui/_script-json', { value: String(_id) }) %>;
  var COLS    = <%- include('../../ui/_script-json', { value: Number(_columns) }) %>;
  var ASPECT  = <%- include('../../ui/_script-json', { value: String(_aspClass) }) %>;
  var REORDER = <%- include('../../ui/_script-json', { value: !!_reorderable }) %>;
  var LIGHTBOX= <%- include('../../ui/_script-json', { value: !!_lightbox }) %>;
  var CAPTIONS= <%- include('../../ui/_script-json', { value: !!_showCaptions }) %>;

  /* ── Image state (mutable) ──────────────────────────────────────────── */
  var images = <%- include('../../ui/_script-json', { value: _images }) %>;

  /* Inline all behaviour scripts inside this IIFE so they share lexical scope. */
  <%- include('./grid-renderer.js') %>
  <%- include('./lightbox.js') %>
  <%- include('./dnd.js') %>
  <%- include('./context-menu.js') %>

  /* ── Init ───────────────────────────────────────────────────────────── */
  renderGrid();
  bindLbHandlers();
})();
</script>

```
