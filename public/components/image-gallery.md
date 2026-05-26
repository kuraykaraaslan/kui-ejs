# ImageGallery

- **id:** `image-gallery`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ImageGallery.ejs`
- **status:** stable
- **since:** 2026-05

Responsive image grid with a full-screen lightbox, right-click context menu (open, copy URL, move to first/last, remove), and drag-to-reorder. Supports 2–4 columns, square / video / portrait / auto aspect ratios, optional captions, zoom toggle, thumbnail strip, and full keyboard navigation (← → Escape).

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

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

<!-- ── Gallery grid ─────────────────────────────────────────────────────── -->
<div
  id="<%= _id %>-grid"
  role="list"
  aria-label="Image gallery"
  class="grid <%= _colClass %> <%= _gapClass %>"
  data-gallery-id="<%= _id %>"
></div>

<!-- ── Shared context menu (populated by JS per image) ──────────────────── -->
<div
  id="<%= _id %>-ctx"
  role="menu"
  aria-label="Image options"
  style="position:fixed;z-index:9999;display:none;min-width:13rem"
  class="rounded-xl border border-border bg-surface-raised shadow-2xl py-1.5 outline-none"
></div>

<!-- ── Lightbox ─────────────────────────────────────────────────────────── -->
<div
  id="<%= _id %>-lb"
  role="dialog"
  aria-modal="true"
  aria-label="Image lightbox"
  style="display:none"
  class="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
>
  <!-- Top bar -->
  <div class="flex items-center justify-between px-4 py-3 shrink-0">
    <span id="<%= _id %>-lb-counter" class="text-white/70 text-sm tabular-nums select-none"></span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        id="<%= _id %>-lb-zoom"
        aria-label="Zoom in"
        class="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <i id="<%= _id %>-lb-zoom-icon" class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        id="<%= _id %>-lb-close"
        aria-label="Close lightbox"
        class="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <!-- Main image -->
  <div class="relative flex-1 flex items-center justify-center overflow-hidden px-14">
    <img
      id="<%= _id %>-lb-img"
      src=""
      alt=""
      draggable="false"
      class="max-h-full max-w-full object-contain transition-transform duration-300 select-none cursor-zoom-in"
    />
    <button
      type="button"
      id="<%= _id %>-lb-prev"
      aria-label="Previous image"
      class="absolute left-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
    </button>
    <button
      type="button"
      id="<%= _id %>-lb-next"
      aria-label="Next image"
      class="absolute right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
  </div>

  <!-- Caption -->
  <p id="<%= _id %>-lb-caption" class="shrink-0 text-center text-white/80 text-sm px-6 py-2 hidden"></p>

  <!-- Thumbnail strip -->
  <div id="<%= _id %>-lb-thumbs" class="shrink-0 flex gap-2 overflow-x-auto px-4 py-3 justify-center"></div>

  <!-- Backdrop -->
  <button
    type="button"
    id="<%= _id %>-lb-bg"
    aria-label="Close lightbox"
    style="position:absolute;inset:0;z-index:-1"
    class="cursor-default focus-visible:outline-none"
    tabindex="-1"
  ></button>
</div>

<script>
(function () {
  var G_ID    = '<%= _id %>';
  var COLS    = <%= _columns %>;
  var ASPECT  = '<%= _aspClass %>';
  var REORDER = <%= _reorderable ? 'true' : 'false' %>;
  var LIGHTBOX= <%= _lightbox    ? 'true' : 'false' %>;
  var CAPTIONS= <%= _showCaptions ? 'true' : 'false' %>;

  /* ── Image state (mutable) ──────────────────────────────────────────── */
  var images = <%- JSON.stringify(_images) %>;

  /* ── Grid render ────────────────────────────────────────────────────── */
  function renderGrid() {
    var grid = document.getElementById(G_ID + '-grid');
    if (!grid) return;
    grid.innerHTML = '';

    images.forEach(function (img, i) {
      var item = document.createElement('div');
      item.setAttribute('role', 'listitem');
      item.setAttribute('data-idx', i);
      item.className = [
        'group relative overflow-hidden rounded-lg bg-surface-sunken transition-all duration-200',
        ASPECT,
        REORDER ? 'cursor-grab active:cursor-grabbing' : '',
      ].filter(Boolean).join(' ');

      if (REORDER) {
        item.draggable = true;
        item.addEventListener('dragstart',  function () { dndStart(i); });
        item.addEventListener('dragover',   function (e) { e.preventDefault(); dndOver(i); });
        item.addEventListener('dragleave',  function () { dndLeave(); });
        item.addEventListener('drop',       function () { dndDrop(i); });
        item.addEventListener('dragend',    function () { dndEnd(); });
        item.addEventListener('contextmenu',function (e) { e.preventDefault(); e.stopPropagation(); openGalleryCtx(i, e); return false; });
      }

      /* Image */
      var pic = document.createElement('img');
      pic.src     = img.src;
      pic.alt     = img.alt || '';
      pic.loading = 'lazy';
      pic.draggable = false;
      pic.className = [
        'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
        ASPECT === '' ? 'aspect-square' : '',
        REORDER ? 'pointer-events-none' : '',
      ].filter(Boolean).join(' ');
      item.appendChild(pic);

      /* Drag handle badge */
      if (REORDER) {
        var grip = document.createElement('div');
        grip.setAttribute('aria-hidden', 'true');
        grip.className = 'absolute top-1.5 left-1.5 z-10 w-6 h-6 flex items-center justify-center rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none';
        grip.innerHTML = '<i class="fa-solid fa-grip-vertical text-xs" aria-hidden="true"></i>';
        item.appendChild(grip);
      }

      /* Hover overlay → lightbox */
      if (LIGHTBOX) {
        var overlay = document.createElement('button');
        overlay.type      = 'button';
        overlay.setAttribute('aria-label', 'Open ' + (img.alt || 'image') + ' in lightbox');
        overlay.className = 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 group-hover:bg-black/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset';
        overlay.innerHTML = '<i class="fa-solid fa-expand text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" aria-hidden="true"></i>'
          + (img.caption ? '<span class="text-white text-xs font-medium px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + escHtml(img.caption) + '</span>' : '');
        overlay.addEventListener('click', function () { lbOpen(i); });
        item.appendChild(overlay);
      }

      /* Static caption */
      if (CAPTIONS && img.caption) {
        var cap = document.createElement('p');
        cap.className = 'absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1 pointer-events-none';
        cap.style.cssText = 'display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden';
        cap.textContent = img.caption;
        item.appendChild(cap);
      }

      grid.appendChild(item);
    });
  }

  /* ── Lightbox ───────────────────────────────────────────────────────── */
  var lbIndex  = 0;
  var lbZoomed = false;

  function lbOpen(i) {
    lbIndex  = i;
    lbZoomed = false;
    var lb = document.getElementById(G_ID + '-lb');
    if (lb) lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lbUpdate();
  }

  function lbClose() {
    var lb = document.getElementById(G_ID + '-lb');
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
    lbZoomed = false;
    var lbImg = document.getElementById(G_ID + '-lb-img');
    if (lbImg) { lbImg.style.transform = ''; lbImg.className = lbImg.className.replace('cursor-zoom-out','cursor-zoom-in'); }
  }

  function lbNav(dir) {
    lbIndex  = (lbIndex + dir + images.length) % images.length;
    lbZoomed = false;
    lbUpdate();
  }

  function lbZoom() {
    lbZoomed = !lbZoomed;
    var lbImg  = document.getElementById(G_ID + '-lb-img');
    var lbZBtn = document.getElementById(G_ID + '-lb-zoom');
    var lbZIco = document.getElementById(G_ID + '-lb-zoom-icon');
    if (lbImg)  { lbImg.style.transform = lbZoomed ? 'scale(1.5)' : ''; lbImg.className = lbImg.className.replace(lbZoomed ? 'cursor-zoom-in' : 'cursor-zoom-out', lbZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'); }
    if (lbZBtn) lbZBtn.setAttribute('aria-label', lbZoomed ? 'Zoom out' : 'Zoom in');
    if (lbZIco) { lbZIco.className = 'fa-solid ' + (lbZoomed ? 'fa-magnifying-glass-minus' : 'fa-magnifying-glass-plus'); }
  }

  function lbUpdate() {
    var img     = images[lbIndex];
    var lbImg   = document.getElementById(G_ID + '-lb-img');
    var lbCnt   = document.getElementById(G_ID + '-lb-counter');
    var lbCap   = document.getElementById(G_ID + '-lb-caption');
    var lbPrev  = document.getElementById(G_ID + '-lb-prev');
    var lbNext  = document.getElementById(G_ID + '-lb-next');
    var lbThumbs= document.getElementById(G_ID + '-lb-thumbs');

    if (lbImg)  { lbImg.src = img.src; lbImg.alt = img.alt || ''; lbImg.style.transform = ''; }
    if (lbCnt)  lbCnt.textContent = (lbIndex + 1) + ' / ' + images.length;
    if (lbCap)  { lbCap.textContent = img.caption || ''; lbCap.classList.toggle('hidden', !img.caption); }
    if (lbPrev) lbPrev.style.display = images.length > 1 ? '' : 'none';
    if (lbNext) lbNext.style.display = images.length > 1 ? '' : 'none';

    if (lbThumbs && images.length > 1) {
      lbThumbs.innerHTML = '';
      images.forEach(function (im, j) {
        var btn = document.createElement('button');
        btn.type      = 'button';
        btn.setAttribute('aria-label', 'View image ' + (j + 1));
        btn.setAttribute('aria-pressed', j === lbIndex ? 'true' : 'false');
        btn.className = [
          'shrink-0 w-12 h-12 rounded overflow-hidden transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
          j === lbIndex ? 'ring-2 ring-white opacity-100 scale-105' : 'opacity-40 hover:opacity-70',
        ].join(' ');
        var bImg = document.createElement('img');
        bImg.src       = im.src;
        bImg.alt       = im.alt || '';
        bImg.className = 'w-full h-full object-cover';
        bImg.draggable = false;
        btn.appendChild(bImg);
        btn.addEventListener('click', function () { lbIndex = j; lbZoomed = false; lbUpdate(); });
        lbThumbs.appendChild(btn);
      });
    }
  }

  /* Lightbox buttons → per-instance listeners (no shared window globals) */
  function bindLbHandlers() {
    var zoomBtn  = document.getElementById(G_ID + '-lb-zoom');
    var closeBtn = document.getElementById(G_ID + '-lb-close');
    var prevBtn  = document.getElementById(G_ID + '-lb-prev');
    var nextBtn  = document.getElementById(G_ID + '-lb-next');
    var bgBtn    = document.getElementById(G_ID + '-lb-bg');
    var lbImg    = document.getElementById(G_ID + '-lb-img');
    if (zoomBtn)  zoomBtn.addEventListener('click', lbZoom);
    if (closeBtn) closeBtn.addEventListener('click', lbClose);
    if (prevBtn)  prevBtn.addEventListener('click', function(){ lbNav(-1); });
    if (nextBtn)  nextBtn.addEventListener('click', function(){ lbNav(1); });
    if (bgBtn)    bgBtn.addEventListener('click', lbClose);
    if (lbImg)    lbImg.addEventListener('click', lbZoom);
  }

  /* Lightbox keyboard */
  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById(G_ID + '-lb');
    if (!lb || lb.style.display === 'none') return;
    if (e.key === 'Escape')      { lbClose(); }
    if (e.key === 'ArrowLeft')   { lbNav(-1); }
    if (e.key === 'ArrowRight')  { lbNav(1); }
  });

  /* ── Drag-and-drop reorder ──────────────────────────────────────────── */
  var dragFrom = null;
  var dragOver = null;

  function dndStart(i) { dragFrom = i; markDrag(); }
  function dndOver(i)  { if (i !== dragFrom) { dragOver = i; markDrag(); } }
  function dndLeave()  { dragOver = null; markDrag(); }
  function dndDrop(dropIdx) {
    if (dragFrom === null || dragFrom === dropIdx) { dndEnd(); return; }
    var moved = images.splice(dragFrom, 1)[0];
    images.splice(dropIdx, 0, moved);
    dndEnd();
    renderGrid();
  }
  function dndEnd() { dragFrom = null; dragOver = null; }

  function markDrag() {
    var items = document.querySelectorAll('#' + G_ID + '-grid [data-idx]');
    items.forEach(function (el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.classList.toggle('opacity-40',          idx === dragFrom);
      el.classList.toggle('scale-95',            idx === dragFrom);
      el.classList.toggle('ring-2',              idx === dragFrom || idx === dragOver);
      el.classList.toggle('ring-inset',          idx === dragFrom);
      el.classList.toggle('ring-[var(--primary)]', idx === dragFrom || idx === dragOver);
      el.classList.toggle('shadow-lg',           idx === dragOver && idx !== dragFrom);
      el.classList.toggle('scale-[1.02]',        idx === dragOver && idx !== dragFrom);
    });
  }

  /* ── Context menu (gallery-specific, built by JS) ───────────────────── */
  var ctxMenu = document.getElementById(G_ID + '-ctx');

  function ensureGlobalCtx() {
    if (window._kuiCtx) return;
    window._kuiCtx = { active: null };
    document.addEventListener('mousedown', function (e) {
      var id = window._kuiCtx.active;
      if (!id) return;
      var m = document.getElementById(id);
      if (m && !m.contains(e.target)) window.closeContextMenu(id);
    });
    window.addEventListener('scroll', function () {
      if (window._kuiCtx.active) window.closeContextMenu(window._kuiCtx.active);
    }, { capture: true, passive: true });
    document.addEventListener('keydown', function (e) {
      var id = window._kuiCtx.active;
      if (!id) return;
      var m = document.getElementById(id);
      if (!m || m.style.display === 'none') return;
      if (e.key === 'Escape') { e.preventDefault(); window.closeContextMenu(id); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var focusable = Array.from(m.querySelectorAll('[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'));
        if (!focusable.length) return;
        var idx  = focusable.indexOf(document.activeElement);
        var next = e.key === 'ArrowDown' ? (idx + 1) % focusable.length : (idx <= 0 ? focusable.length - 1 : idx - 1);
        focusable[next].focus();
      }
    });
    window.closeContextMenu = window.closeContextMenu || function (id) {
      var m = document.getElementById(id);
      if (m) m.style.display = 'none';
      if (window._kuiCtx.active === id) window._kuiCtx.active = null;
    };
    window.openContextMenu = window.openContextMenu || function () {};
  }

  function openGalleryCtx(i, event) {
    if (!ctxMenu) return;
    ensureGlobalCtx();

    /* Close any other open menu first */
    if (window._kuiCtx.active && window._kuiCtx.active !== G_ID + '-ctx') {
      window.closeContextMenu(window._kuiCtx.active);
    }

    /* Build menu items via DOM (keeps click handlers attached) */
    ctxMenu.innerHTML = '';
    appendCtxItems(ctxMenu, i);

    /* Position */
    ctxMenu.style.visibility = 'hidden';
    ctxMenu.style.display    = 'block';
    var mw = ctxMenu.offsetWidth, mh = ctxMenu.offsetHeight;
    var vw = window.innerWidth,   vh = window.innerHeight, GAP = 8;
    var x  = (event.clientX + mw > vw - GAP) ? Math.max(GAP, event.clientX - mw) : event.clientX;
    var y  = (event.clientY + mh > vh - GAP) ? Math.max(GAP, event.clientY - mh) : event.clientY;
    ctxMenu.style.left       = x + 'px';
    ctxMenu.style.top        = y + 'px';
    ctxMenu.style.visibility = 'visible';
    window._kuiCtx.active    = G_ID + '-ctx';
    var first = ctxMenu.querySelector('[role="menuitem"]:not([disabled])');
    if (first) first.focus();
  }

  function appendCtxItems(parent, i) {
    var total = images.length;
    appendCtxItem(parent, 'fa-expand',       'Open in lightbox', null, false, false, function () { lbOpen(i); });
    appendCtxItem(parent, 'fa-copy',         'Copy image URL',   '⌘C', false, false, function () { if (navigator.clipboard) navigator.clipboard.writeText(images[i].src).catch(function(){}); });
    appendCtxSeparator(parent);
    appendCtxGroup(parent, 'Reorder');
    appendCtxItem(parent, 'fa-angles-left',  'Move to first',    null, false, i === 0,          function () { moveToIdx(i, 0); });
    appendCtxItem(parent, 'fa-angles-right', 'Move to last',     null, false, i === total - 1,  function () { moveToIdx(i, total - 1); });
    appendCtxSeparator(parent);
    appendCtxItem(parent, 'fa-trash',        'Remove',           null, true,  false, function () { removeAt(i); });
  }

  function appendCtxItem(parent, iconCls, label, shortcut, danger, disabled, fn) {
    var col     = danger ? 'text-error hover:bg-error-subtle focus-visible:bg-error-subtle' : 'text-text-primary hover:bg-surface-overlay focus-visible:bg-surface-overlay';
    var iconCol = danger ? 'text-error' : 'text-text-secondary';
    var dis     = disabled ? ' opacity-40 cursor-not-allowed pointer-events-none' : '';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'menuitem');
    btn.setAttribute('tabindex', '-1');
    if (disabled) { btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); }
    btn.className = 'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors select-none focus-visible:outline-none ' + col + dis;

    var iconSpan = document.createElement('span');
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.className = 'w-4 flex items-center justify-center shrink-0 ' + iconCol;
    iconSpan.innerHTML = '<i class="fa-solid ' + iconCls + ' text-xs" aria-hidden="true"></i>';
    btn.appendChild(iconSpan);

    var labelSpan = document.createElement('span');
    labelSpan.className = 'flex-1 truncate';
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);

    if (shortcut) {
      var kbd = document.createElement('kbd');
      kbd.className = 'shrink-0 ml-6 text-[11px] font-mono text-text-disabled';
      kbd.textContent = shortcut;
      btn.appendChild(kbd);
    }

    if (!disabled && fn) {
      btn.addEventListener('click', function () { fn(); if (window.closeContextMenu) window.closeContextMenu(G_ID + '-ctx'); });
    }
    parent.appendChild(btn);
  }

  function appendCtxSeparator(parent) {
    var sep = document.createElement('div');
    sep.setAttribute('role', 'separator');
    sep.setAttribute('aria-orientation', 'horizontal');
    sep.className = 'my-1 mx-2 border-t border-border';
    parent.appendChild(sep);
  }

  function appendCtxGroup(parent, label) {
    var p = document.createElement('p');
    p.setAttribute('role', 'presentation');
    p.className = 'px-3 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-widest text-text-disabled select-none';
    p.textContent = label;
    parent.appendChild(p);
  }

  function moveToIdx(from, to) {
    var moved = images.splice(from, 1)[0];
    images.splice(to, 0, moved);
    renderGrid();
  }

  function removeAt(i) {
    images.splice(i, 1);
    renderGrid();
  }

  /* ── Utility ────────────────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Init ───────────────────────────────────────────────────────────── */
  renderGrid();
  bindLbHandlers();
})();
</script>

```
