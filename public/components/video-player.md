# VideoPlayer

- **id:** `video-player`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/VideoPlayer.ejs`
- **status:** beta
- **since:** 2025-04

Custom HTML5 video player. Quality, subtitle, audio track, and playback rate selection; custom WebVTT subtitle overlay; auto-hiding controls; programmatic API. Keyboard shortcuts: Space/K=play, ←→=±10s, ↑↓=volume, M=mute, F=fullscreen.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`

## Variants

### Tam özellikli

```ejs
<%- include('modules/ui/VideoPlayer', {
  src:         'https://placeholdervideo.dev/1920x1080',
  poster:      'https://example.com/poster.jpg',
  title:       'Big Buck Bunny',
  qualities: [
    { label: '1080p',  value: 'https://example.com/video-1080p.mp4' },
    { label: '720p',   value: 'https://example.com/video-720p.mp4'  },
    { label: '480p',   value: 'https://example.com/video-480p.mp4'  },
  ],
  defaultQuality: 'https://example.com/video-1080p.mp4',
  subtitles: [
    { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
    { label: 'English', srclang: 'en', src: '/subtitles/en.vtt' },
  ],
  audioTracks: [
    { label: 'Türkçe' },
    { label: 'English' },
  ],
}) %>
```

### Yalnızca altyazı

```ejs
<%- include('modules/ui/VideoPlayer', {
  src:    'https://example.com/lecture.mp4',
  title:  'Lecture — Episode 1',
  subtitles: [
    { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
  ],
}) %>
```

### Minimal (kontroller her zaman görünür)

```ejs
<%- include('modules/ui/VideoPlayer', {
  src:              'https://placeholdervideo.dev/1920x1080',
  autoHideControls: false,
}) %>

<script>
  /* Geliştirici kontrolü örneği */
  document.querySelector('[data-vp-id="my-player"]')
    .addEventListener('vp:qualitychange', function (e) {
      console.log('Quality changed to', e.detail.value);
    });
</script>
```

### Otomatik oynat + sessiz

```ejs
<%- include('modules/ui/VideoPlayer', {
  src:          'https://example.com/promo.mp4',
  autoPlay:     true,
  startMuted:   true,
  loop:         true,
  poster:       'https://example.com/poster.jpg',
}) %>
```

## Full EJS source

```ejs
<%
var _id              = locals.id              || ('vp-' + Math.random().toString(36).substr(2, 9));
var _poster          = locals.poster          || '';
var _title           = locals.title           || '';
var _autoPlay        = locals.autoPlay        || false;
var _loop            = locals.loop            || false;
var _startMuted      = locals.startMuted      || false;
var _qualities       = locals.qualities       || [];
var _defaultQuality  = locals.defaultQuality  || (_qualities.length > 0 ? _qualities[0].value : '');
var _defaultQualityLabel = (function() {
  if (!_qualities.length) return 'Auto';
  var match = _qualities.filter(function(q) { return q.value === _defaultQuality; })[0];
  return match ? match.label : (_qualities[0] ? _qualities[0].label : 'Auto');
})();
var _subtitles       = locals.subtitles       || [];
var _audioTracks     = locals.audioTracks     || [];
var _autoHideControls = (locals.autoHideControls !== undefined) ? locals.autoHideControls : true;
var _enableCast      = (locals.enableCast      !== undefined) ? locals.enableCast      : true;
var _className       = locals.className       || '';

var _src = locals.src || '';
var _sources = Array.isArray(_src)
  ? _src
  : (typeof _src === 'string' ? [{ src: _src }] : [_src]);

var _hasSettings = true; // always show gear (speed is always available)
var _hasSubs     = _subtitles.length > 0;
var _hasQualities = _qualities.length > 0;
var _hasAudio    = _audioTracks.length > 1;

var _speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
%>

<div
  id="<%= _id %>"
  tabindex="0"
  aria-label="<%= _title ? 'Video: ' + _title : 'Video player' %>"
  class="relative bg-black rounded-xl overflow-hidden select-none outline-none aspect-video min-h-40 focus-visible:ring-2 focus-visible:ring-border-focus<%= _className ? ' ' + _className : '' %>"
>

  <%/* ── Video element ── */%>
  <video
    id="<%= _id %>-video"
    <% if (_poster)     { %>poster="<%= _poster %>"<% } %>
    <% if (_autoPlay)   { %>autoplay<% } %>
    <% if (_loop)       { %>loop<% } %>
    <% if (_startMuted) { %>muted<% } %>
    crossorigin="anonymous"
    class="w-full h-full object-contain block cursor-pointer"
    onclick="window.__vp['<%= _id %>'].togglePlay()"
  >
    <% _sources.forEach(function(s) {
         var src  = typeof s === 'string' ? s : s.src;
         var type = (typeof s === 'object' && s.type) ? s.type : '';
    %>
      <source src="<%= src %>"<% if (type) { %> type="<%= type %>"<% } %>>
    <% }); %>

    <% _subtitles.forEach(function(sub, i) { %>
      <track kind="subtitles" label="<%= sub.label %>"
        <% if (sub.srclang) { %>srclang="<%= sub.srclang %>"<% } %>
        src="<%= sub.src %>">
    <% }); %>
  </video>

  <%/* ── Loading spinner ── */%>
  <div id="<%= _id %>-spinner"
    class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
    <i class="fa-solid fa-spinner text-white text-4xl animate-spin drop-shadow-lg" aria-hidden="true"></i>
  </div>

  <%/* ── Centre play overlay ── */%>
  <div id="<%= _id %>-play-overlay"
    class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
    style="opacity:1"
    aria-hidden="true">
    <div id="<%= _id %>-play-circle"
      class="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-2 ring-white/20 transition-transform duration-300">
      <i class="fa-solid fa-play text-white text-2xl ml-1" aria-hidden="true"></i>
    </div>
  </div>

  <%/* ── Casting overlay ── */%>
  <% if (_enableCast) { %>
  <div id="<%= _id %>-cast-overlay"
    class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-3 text-center px-6 hidden"
    style="background:linear-gradient(to bottom,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.75) 55%,rgba(0,0,0,0) 100%)">
    <i class="fa-brands fa-chromecast text-white text-5xl drop-shadow-lg" aria-hidden="true"></i>
    <p id="<%= _id %>-cast-device" class="text-white/90 text-sm font-medium">Cihaza yayınlanıyor</p>
    <% if (_title) { %>
    <p class="text-white/60 text-xs max-w-[90%] truncate"><%= _title %></p>
    <% } %>
  </div>
  <% } %>

  <%/* ── Subtitle overlay ── */%>
  <div id="<%= _id %>-subtitle-overlay"
    class="absolute left-0 right-0 flex justify-center px-6 pointer-events-none z-10 transition-all duration-300 hidden"
    style="bottom:4.5rem">
    <span id="<%= _id %>-subtitle-text"
      class="bg-black/80 text-white px-3 py-1 rounded-md text-center max-w-[85%] whitespace-pre-line leading-snug font-medium"
      style="font-size:1rem"></span>
  </div>

  <%/* ── Controls layer ── */%>
  <div id="<%= _id %>-controls"
    class="absolute inset-0 flex flex-col justify-end transition-opacity duration-300 opacity-100 z-20"
    onclick="window.__vp['<%= _id %>'].onBgClick(event)">

    <%/* Vignette */%>
    <div class="absolute inset-0 pointer-events-none"
      style="background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 30%,transparent 60%)"></div>

    <%/* ── Settings panel ── */%>
    <div id="<%= _id %>-settings"
      class="absolute bottom-14 right-4 w-60 bg-black/90 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-20 hidden">

      <%/* Main view */%>
      <div id="<%= _id %>-view-main">
        <div class="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
          <i class="fa-solid fa-gear text-white/50 text-xs" aria-hidden="true"></i>
          <p class="text-white/70 text-xs font-semibold uppercase tracking-wider">Ayarlar</p>
        </div>
        <div class="py-1">

          <% if (_hasQualities) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].showView('quality')"
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group">
            <span class="text-white/85 text-sm">Kalite</span>
            <div class="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
              <span id="<%= _id %>-lbl-quality"><%= _defaultQualityLabel %></span>
              <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
            </div>
          </button>
          <% } %>

          <button type="button"
            onclick="window.__vp['<%= _id %>'].showView('speed')"
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group">
            <span class="text-white/85 text-sm">Oynatma Hızı</span>
            <div class="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
              <span id="<%= _id %>-lbl-speed">Normal</span>
              <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
            </div>
          </button>

          <% if (_hasSubs) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].showView('subtitles')"
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group">
            <span class="text-white/85 text-sm">Altyazı</span>
            <div class="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
              <span id="<%= _id %>-lbl-subtitle">Kapalı</span>
              <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
            </div>
          </button>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].showView('subtitle-size')"
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group">
            <span class="text-white/85 text-sm">Altyazı Boyutu</span>
            <div class="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
              <span id="<%= _id %>-lbl-subtitle-size">Orta</span>
              <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
            </div>
          </button>
          <% } %>

          <% if (_hasAudio) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].showView('language')"
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group">
            <span class="text-white/85 text-sm">Ses Dili</span>
            <div class="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
              <span id="<%= _id %>-lbl-language"><%= _audioTracks.length > 0 ? _audioTracks[0].label : '' %></span>
              <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
            </div>
          </button>
          <% } %>

        </div>
      </div>

      <%/* Quality sub-view */%>
      <% if (_hasQualities) { %>
      <div id="<%= _id %>-view-quality" class="hidden">
        <button type="button" onclick="window.__vp['<%= _id %>'].showView('main')"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
          <i class="fa-solid fa-chevron-left text-white/50 text-xs" aria-hidden="true"></i>
          <span class="text-white text-sm font-semibold">Kalite</span>
        </button>
        <div class="py-1">
          <% _qualities.forEach(function(q) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setQuality('<%= q.value %>', '<%= q.label %>')"
            data-vp-quality="<%= q.value %>"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span><%= q.label %></span>
            <i class="fa-solid fa-check text-primary text-xs<%= q.value !== _defaultQuality ? ' hidden' : '' %>"
              data-vp-check aria-hidden="true"></i>
          </button>
          <% }); %>
        </div>
      </div>
      <% } %>

      <%/* Speed sub-view */%>
      <div id="<%= _id %>-view-speed" class="hidden">
        <button type="button" onclick="window.__vp['<%= _id %>'].showView('main')"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
          <i class="fa-solid fa-chevron-left text-white/50 text-xs" aria-hidden="true"></i>
          <span class="text-white text-sm font-semibold">Oynatma Hızı</span>
        </button>
        <div class="py-1">
          <% _speeds.forEach(function(s) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setSpeed(<%= s %>)"
            data-vp-speed="<%= s %>"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span><%= s === 1 ? '1× (Normal)' : s + '×' %></span>
            <i class="fa-solid fa-check text-primary text-xs<%= s !== 1 ? ' hidden' : '' %>"
              data-vp-check aria-hidden="true"></i>
          </button>
          <% }); %>
        </div>
      </div>

      <%/* Subtitles sub-view */%>
      <% if (_hasSubs) { %>
      <div id="<%= _id %>-view-subtitles" class="hidden">
        <button type="button" onclick="window.__vp['<%= _id %>'].showView('main')"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
          <i class="fa-solid fa-chevron-left text-white/50 text-xs" aria-hidden="true"></i>
          <span class="text-white text-sm font-semibold">Altyazı</span>
        </button>
        <div class="py-1">
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setSubtitle(null, 'Kapalı')"
            data-vp-sub="null"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span>Kapalı</span>
            <i class="fa-solid fa-check text-primary text-xs" data-vp-check aria-hidden="true"></i>
          </button>
          <% _subtitles.forEach(function(sub, i) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setSubtitle(<%= i %>, '<%= sub.label %>')"
            data-vp-sub="<%= i %>"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span><%= sub.label %></span>
            <i class="fa-solid fa-check text-primary text-xs hidden" data-vp-check aria-hidden="true"></i>
          </button>
          <% }); %>
        </div>
      </div>

      <%/* Subtitle size sub-view */%>
      <div id="<%= _id %>-view-subtitle-size" class="hidden">
        <button type="button" onclick="window.__vp['<%= _id %>'].showView('main')"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
          <i class="fa-solid fa-chevron-left text-white/50 text-xs" aria-hidden="true"></i>
          <span class="text-white text-sm font-semibold">Altyazı Boyutu</span>
        </button>
        <div class="py-1">
          <% var _fontSizes = [
               { key: 'sm', label: 'Küçük',     size: '0.8rem'  },
               { key: 'md', label: 'Orta',       size: '1rem'    },
               { key: 'lg', label: 'Büyük',      size: '1.3rem'  },
               { key: 'xl', label: 'Çok Büyük',  size: '1.65rem' }
             ];
             _fontSizes.forEach(function(fs) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setSubtitleSize('<%= fs.key %>', '<%= fs.label %>', '<%= fs.size %>')"
            data-vp-sub-size="<%= fs.key %>"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span class="flex flex-col items-start gap-0.5">
              <span><%= fs.label %></span>
              <span class="text-xs text-white/35 font-normal"><%= fs.size %></span>
            </span>
            <i class="fa-solid fa-check text-primary text-xs<%= fs.key !== 'md' ? ' hidden' : '' %>"
              data-vp-check aria-hidden="true"></i>
          </button>
          <% }); %>
        </div>
      </div>
      <% } %>

      <%/* Language sub-view */%>
      <% if (_hasAudio) { %>
      <div id="<%= _id %>-view-language" class="hidden">
        <button type="button" onclick="window.__vp['<%= _id %>'].showView('main')"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
          <i class="fa-solid fa-chevron-left text-white/50 text-xs" aria-hidden="true"></i>
          <span class="text-white text-sm font-semibold">Ses Dili</span>
        </button>
        <div class="py-1">
          <% _audioTracks.forEach(function(track, i) { %>
          <button type="button"
            onclick="window.__vp['<%= _id %>'].setAudioTrack(<%= i %>, '<%= track.label %>')"
            data-vp-audio="<%= i %>"
            class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10 text-white/80">
            <span class="flex flex-col items-start gap-0.5">
              <span><%= track.label %></span>
              <% if (track.language) { %><span class="text-xs text-white/35 font-normal"><%= track.language %></span><% } %>
            </span>
            <i class="fa-solid fa-check text-primary text-xs<%= i !== 0 ? ' hidden' : '' %>"
              data-vp-check aria-hidden="true"></i>
          </button>
          <% }); %>
        </div>
      </div>
      <% } %>

    </div><%/* end settings panel */%>

    <%/* ── Controls bar ── */%>
    <div class="relative px-4 pb-3 pt-6 space-y-2.5">

      <% if (_title) { %>
      <p class="text-white/90 text-sm font-medium truncate leading-tight"><%= _title %></p>
      <% } %>

      <%/* Progress bar */%>
      <div id="<%= _id %>-progress"
        role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
        tabindex="0"
        class="relative h-1.5 rounded-full bg-white/20 cursor-pointer group hover:h-2 transition-all"
        onclick="window.__vp['<%= _id %>'].seek(event)"
        onmousemove="window.__vp['<%= _id %>'].seekHover(event)"
        onmouseleave="window.__vp['<%= _id %>'].seekLeave()">
        <div id="<%= _id %>-buffered"   class="absolute inset-y-0 left-0 rounded-full bg-white/25" style="width:0%"></div>
        <div id="<%= _id %>-played"     class="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style="width:0%"></div>
        <div id="<%= _id %>-seek-hover" class="absolute inset-y-0 left-0 rounded-full bg-white/15" style="width:0%"></div>
        <div id="<%= _id %>-thumb"
          class="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style="left:calc(0% - 7px)"></div>
        <div id="<%= _id %>-hover-time"
          class="absolute -top-8 -translate-x-1/2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap hidden"
          style="left:0"></div>
      </div>

      <%/* Control buttons */%>
      <div class="flex items-center gap-1">

        <button type="button" aria-label="Rewind 10 seconds"
          onclick="window.__vp['<%= _id %>'].seekBy(-10)"
          class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          <i class="fa-solid fa-rotate-left text-sm" aria-hidden="true"></i>
        </button>

        <button type="button" id="<%= _id %>-play-btn" aria-label="Play"
          onclick="window.__vp['<%= _id %>'].togglePlay()"
          class="w-9 h-9 flex items-center justify-center text-white hover:text-primary transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          <i id="<%= _id %>-play-icon" class="fa-solid fa-play text-base" aria-hidden="true"></i>
        </button>

        <button type="button" aria-label="Forward 10 seconds"
          onclick="window.__vp['<%= _id %>'].seekBy(10)"
          class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          <i class="fa-solid fa-rotate-right text-sm" aria-hidden="true"></i>
        </button>

        <%/* Volume */%>
        <div class="flex items-center gap-1.5"
          onmouseenter="window.__vp['<%= _id %>'].showVolume(true)"
          onmouseleave="window.__vp['<%= _id %>'].showVolume(false)">
          <button type="button" aria-label="Mute"
            onclick="window.__vp['<%= _id %>'].toggleMute()"
            class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
            <i id="<%= _id %>-vol-icon" class="fa-solid fa-volume-high text-sm" aria-hidden="true"></i>
          </button>
          <div id="<%= _id %>-vol-wrap" class="overflow-hidden transition-all duration-200 ease-out" style="width:0;opacity:0">
            <input id="<%= _id %>-vol-input" type="range" min="0" max="1" step="0.05" value="1"
              aria-label="Volume"
              class="w-20 h-1 cursor-pointer accent-primary"
              oninput="window.__vp['<%= _id %>'].setVolume(this.value)">
          </div>
        </div>

        <%/* Time */%>
        <span class="text-white/70 text-xs tabular-nums flex-1 pl-1 select-none">
          <span id="<%= _id %>-cur-time">0:00</span><span class="text-white/30 mx-0.5">/</span><span id="<%= _id %>-duration">0:00</span>
        </span>

        <%/* Settings */%>
        <button type="button" id="<%= _id %>-gear-btn" aria-label="Settings" aria-expanded="false"
          onclick="window.__vp['<%= _id %>'].toggleSettings()"
          class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          <i id="<%= _id %>-gear-icon" class="fa-solid fa-gear text-sm transition-transform duration-300" aria-hidden="true"></i>
        </button>

        <%/* Cast */%>
        <% if (_enableCast) { %>
        <button type="button" id="<%= _id %>-cast-btn" aria-label="Cast to device" aria-pressed="false"
          onclick="window.__vp['<%= _id %>'].toggleCast()"
          class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white hidden">
          <i id="<%= _id %>-cast-icon" class="fa-brands fa-chromecast text-sm" aria-hidden="true"></i>
        </button>
        <% } %>

        <%/* Fullscreen */%>
        <button type="button" id="<%= _id %>-fs-btn" aria-label="Enter fullscreen"
          onclick="window.__vp['<%= _id %>'].toggleFullscreen()"
          class="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          <i id="<%= _id %>-fs-icon" class="fa-solid fa-expand text-sm" aria-hidden="true"></i>
        </button>

      </div>
    </div>
  </div><%/* end controls layer */%>

</div>

<%/*
  ──────────────────────────────────────────────────────────────────────────────
  JS-event-vs-callback API (EJS) — note for consumers
  ──────────────────────────────────────────────────────────────────────────────
  The React `VideoPlayer.tsx` exposes callback props (`onQualityChange`,
  `onAudioTrackChange`, `onCastStateChange`, `onControlsVisibilityChange`).
  This EJS twin runs as a vanilla-JS IIFE and instead dispatches DOM
  `CustomEvent`s on the player container:
    - `vp:qualitychange`      → detail: { value }
    - `vp:audiotrackchange`   → detail: { index }
  Subscribe via:
    document.getElementById('<id>').addEventListener('vp:qualitychange', ...);
  The imperative API is exposed at `window.__vp[<id>]` (togglePlay, seekBy,
  toggleMute, setVolume, setSpeed, setQuality, setSubtitle, etc.).
*/%>
<script>
(function () {
  var id          = '<%= _id %>';
  var autoHide    = <%- JSON.stringify(_autoHideControls) %>;
  var enableCast  = <%- JSON.stringify(_enableCast) %>;
  var castTitle   = <%- JSON.stringify(_title) %>;
  var castPoster  = <%- JSON.stringify(_poster) %>;
  var castFirstSrc = <%- JSON.stringify(_sources[0] || '') %>;

  window.__vp = window.__vp || {};

  // ── DOM refs ────────────────────────────────────────────────────────────────
  var container   = document.getElementById(id);
  var video       = document.getElementById(id + '-video');
  var spinner     = document.getElementById(id + '-spinner');
  var playOverlay = document.getElementById(id + '-play-overlay');
  var playCircle  = document.getElementById(id + '-play-circle');
  var subOverlay  = document.getElementById(id + '-subtitle-overlay');
  var subText     = document.getElementById(id + '-subtitle-text');
  var controls    = document.getElementById(id + '-controls');
  var progressEl  = document.getElementById(id + '-progress');
  var bufferedEl  = document.getElementById(id + '-buffered');
  var playedEl    = document.getElementById(id + '-played');
  var seekHoverEl = document.getElementById(id + '-seek-hover');
  var thumbEl     = document.getElementById(id + '-thumb');
  var hoverTimeEl = document.getElementById(id + '-hover-time');
  var curTimeEl   = document.getElementById(id + '-cur-time');
  var durEl       = document.getElementById(id + '-duration');
  var playIcon    = document.getElementById(id + '-play-icon');
  var volIcon     = document.getElementById(id + '-vol-icon');
  var volWrap     = document.getElementById(id + '-vol-wrap');
  var volInput    = document.getElementById(id + '-vol-input');
  var gearIcon    = document.getElementById(id + '-gear-icon');
  var fsIcon      = document.getElementById(id + '-fs-icon');
  var settings    = document.getElementById(id + '-settings');
  var castOverlay = document.getElementById(id + '-cast-overlay');
  var castDeviceEl = document.getElementById(id + '-cast-device');
  var castBtn     = document.getElementById(id + '-cast-btn');
  var castIcon    = document.getElementById(id + '-cast-icon');

  // ── Internal state ──────────────────────────────────────────────────────────
  var hideTimer       = null;
  var cueListener     = null;
  var selectedSubIdx  = null;

  // ── Cast state ──────────────────────────────────────────────────────────────
  var castState       = 'unavailable';
  var castDeviceName  = null;
  var castContext     = null;
  var castFramework   = null;
  var chromeCast      = null;
  var remotePlayer    = null;
  var remoteController = null;
  function isCasting() { return castState === 'connected'; }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function fmt(s) {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    var mm = String(m).padStart(2, '0');
    var ss = String(sec).padStart(2, '0');
    return (h > 0 ? h + ':' : '') + mm + ':' + ss;
  }

  function setControlsVisible(v) {
    if (v) {
      controls.classList.remove('opacity-0', 'pointer-events-none');
      if (subOverlay && !subOverlay.classList.contains('hidden'))
        subOverlay.style.bottom = '4.5rem';
    } else {
      controls.classList.add('opacity-0', 'pointer-events-none');
      if (subOverlay && !subOverlay.classList.contains('hidden'))
        subOverlay.style.bottom = '1rem';
    }
  }

  function scheduleHide(playing) {
    if (hideTimer) clearTimeout(hideTimer);
    setControlsVisible(true);
    if (isCasting()) return; // pin controls while casting
    if (playing && autoHide)
      hideTimer = setTimeout(function () { setControlsVisible(false); }, 3000);
  }

  function setPlayState(playing) {
    playIcon.className = 'fa-solid ' + (playing ? 'fa-pause' : 'fa-play') + ' text-base';
    playOverlay.style.opacity    = playing ? '0' : '1';
    playCircle.style.transform   = playing ? 'scale(1.25)' : 'scale(1)';
  }

  function updateVolumeIcon(vol, muted) {
    var ic = (muted || vol == 0) ? 'fa-volume-off' : (vol < 0.5 ? 'fa-volume-low' : 'fa-volume-high');
    volIcon.className = 'fa-solid ' + ic + ' text-sm';
  }

  function updateProgress() {
    var dur = video.duration;
    if (!dur || !isFinite(dur)) return;
    var pct = (video.currentTime / dur) * 100;
    playedEl.style.width = pct + '%';
    thumbEl.style.left   = 'calc(' + pct + '% - 7px)';
    progressEl.setAttribute('aria-valuenow', Math.round(pct));
    curTimeEl.textContent = fmt(video.currentTime);
    if (video.buffered.length > 0)
      bufferedEl.style.width = (video.buffered.end(video.buffered.length - 1) / dur * 100) + '%';
  }

  // ── Subtitle cue rendering ──────────────────────────────────────────────────
  function activateSubtitle(idx) {
    var tracks = video.textTracks;
    for (var i = 0; i < tracks.length; i++) tracks[i].mode = 'disabled';
    subOverlay.classList.add('hidden');
    selectedSubIdx = idx;
    if (idx === null || !tracks[idx]) return;
    var track = tracks[idx];
    track.mode = 'hidden';
    function onCue() {
      var active = track.activeCues;
      if (!active || active.length === 0) { subOverlay.classList.add('hidden'); return; }
      subText.textContent = Array.prototype.slice.call(active)
        .map(function (c) { return c.text.replace(/<[^>]+>/g, ''); }).join('\n');
      subOverlay.classList.remove('hidden');
    }
    if (cueListener) track.removeEventListener('cuechange', cueListener);
    cueListener = onCue;
    track.addEventListener('cuechange', onCue);
  }

  // ── Video events ────────────────────────────────────────────────────────────
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('durationchange', function () { durEl.textContent = fmt(video.duration || 0); });
  video.addEventListener('waiting',  function () { spinner.classList.remove('hidden'); });
  video.addEventListener('canplay',  function () { spinner.classList.add('hidden'); });
  video.addEventListener('play',     function () { setPlayState(true);  scheduleHide(true); });
  video.addEventListener('pause',    function () { setPlayState(false); setControlsVisible(true); if (hideTimer) clearTimeout(hideTimer); });
  video.addEventListener('ended',    function () { setPlayState(false); setControlsVisible(true); });

  container.addEventListener('mousemove',  function () { scheduleHide(!video.paused); });
  container.addEventListener('mouseleave', function () { if (!isCasting() && !video.paused && autoHide) setControlsVisible(false); });

  // Keyboard
  container.addEventListener('keydown', function (e) {
    var p = window.__vp[id];
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); p.togglePlay(); break;
      case 'ArrowLeft':   e.preventDefault(); p.seekBy(-10); break;
      case 'ArrowRight':  e.preventDefault(); p.seekBy(10); break;
      case 'ArrowUp':     e.preventDefault(); p.setVolume(Math.min(1, video.volume + 0.1)); break;
      case 'ArrowDown':   e.preventDefault(); p.setVolume(Math.max(0, video.volume - 0.1)); break;
      case 'm':           e.preventDefault(); p.toggleMute(); break;
      case 'f':           e.preventDefault(); p.toggleFullscreen(); break;
      case 'Escape':
        if (settings && !settings.classList.contains('hidden')) { e.preventDefault(); p.toggleSettings(); }
        break;
    }
  });

  // Close settings on outside click
  document.addEventListener('click', function (e) {
    if (!settings || settings.classList.contains('hidden')) return;
    var gearBtn = document.getElementById(id + '-gear-btn');
    if (!settings.contains(e.target) && !gearBtn.contains(e.target))
      window.__vp[id].toggleSettings();
  });

  document.addEventListener('fullscreenchange', function () {
    var fs = !!document.fullscreenElement;
    fsIcon.className = 'fa-solid ' + (fs ? 'fa-compress' : 'fa-expand') + ' text-sm';
    document.getElementById(id + '-fs-btn').setAttribute('aria-label', fs ? 'Exit fullscreen' : 'Enter fullscreen');
  });

  // ── Cast helpers ────────────────────────────────────────────────────────────
  function ensureCastSdk() {
    if (!window.__vp_cast) window.__vp_cast = {};
    if (window.__vp_cast.promise) return window.__vp_cast.promise;
    window.__vp_cast.promise = new Promise(function (resolve) {
      function done() {
        if (window.cast && window.cast.framework && window.chrome && window.chrome.cast) {
          resolve({ framework: window.cast.framework, chromeCast: window.chrome.cast });
          return true;
        }
        return false;
      }
      if (done()) return;
      var prev = window.__onGCastApiAvailable;
      window.__onGCastApiAvailable = function (available) {
        if (typeof prev === 'function') { try { prev(available); } catch (e) {} }
        if (available) done();
      };
      if (!document.getElementById('google-cast-sdk')) {
        var s = document.createElement('script');
        s.id   = 'google-cast-sdk';
        s.src  = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        s.async = true;
        document.head.appendChild(s);
      }
    });
    return window.__vp_cast.promise;
  }

  function mapCastState(s) {
    if (s === 'CONNECTED')             return 'connected';
    if (s === 'CONNECTING')            return 'connecting';
    if (s === 'NO_DEVICES_AVAILABLE')  return 'unavailable';
    return 'available';
  }

  function updateCastUi() {
    if (castBtn) {
      castBtn.classList.toggle('hidden', castState === 'unavailable');
      castBtn.setAttribute('aria-pressed', isCasting() ? 'true' : 'false');
      castBtn.setAttribute('aria-label', isCasting() ? 'Stop casting' : 'Cast to device');
      var active = castState === 'connected' || castState === 'connecting';
      castBtn.classList.toggle('text-primary', active);
      castBtn.classList.toggle('text-white/80', !active);
      if (castIcon) castIcon.classList.toggle('animate-pulse', castState === 'connecting');
    }
    if (castOverlay) castOverlay.classList.toggle('hidden', !isCasting());
    if (castDeviceEl) castDeviceEl.textContent = castDeviceName
      ? (castDeviceName + ' cihazına yayınlanıyor')
      : 'Cihaza yayınlanıyor';
    if (isCasting()) {
      if (hideTimer) clearTimeout(hideTimer);
      setControlsVisible(true);
    }
  }

  function syncRemote() {
    if (!remotePlayer || !remotePlayer.isConnected) return;
    setPlayState(!remotePlayer.isPaused);
    var dur = remotePlayer.duration;
    if (dur > 0) durEl.textContent = fmt(dur);
    if (isFinite(remotePlayer.currentTime)) {
      curTimeEl.textContent = fmt(remotePlayer.currentTime);
      if (dur > 0) {
        var pct = (remotePlayer.currentTime / dur) * 100;
        playedEl.style.width = pct + '%';
        thumbEl.style.left   = 'calc(' + pct + '% - 7px)';
        progressEl.setAttribute('aria-valuenow', Math.round(pct));
      }
    }
    if (volInput) volInput.value = remotePlayer.isMuted ? 0 : remotePlayer.volumeLevel;
    updateVolumeIcon(remotePlayer.volumeLevel, remotePlayer.isMuted);
  }

  if (enableCast) {
    ensureCastSdk().then(function (res) {
      castFramework = res.framework;
      chromeCast    = res.chromeCast;
      castContext   = castFramework.CastContext.getInstance();
      try {
        castContext.setOptions({
          receiverApplicationId: chromeCast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy:        chromeCast.AutoJoinPolicy.ORIGIN_SCOPED,
        });
      } catch (e) {}

      function syncCastState() {
        castState = mapCastState(castContext.getCastState());
        var session = isCasting() ? castContext.getCurrentSession() : null;
        var device  = session && session.getCastDevice ? session.getCastDevice() : null;
        castDeviceName = device ? device.friendlyName : null;
        updateCastUi();
      }
      castContext.addEventListener(castFramework.CastContextEventType.CAST_STATE_CHANGED, syncCastState);
      syncCastState();

      remotePlayer     = new castFramework.RemotePlayer();
      remoteController = new castFramework.RemotePlayerController(remotePlayer);
      remoteController.addEventListener(castFramework.RemotePlayerEventType.ANY_CHANGE, syncRemote);
    });
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  window.__vp[id] = {

    togglePlay: function () {
      if (isCasting() && remoteController) { remoteController.playOrPause(); return; }
      if (video.paused) video.play(); else video.pause();
    },

    seekBy: function (delta) {
      if (isCasting() && remotePlayer && remoteController) {
        remotePlayer.currentTime = Math.max(0, Math.min(remotePlayer.duration || 0, remotePlayer.currentTime + delta));
        remoteController.seek();
        return;
      }
      video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
    },

    toggleMute: function () {
      if (isCasting() && remoteController) { remoteController.muteOrUnmute(); return; }
      video.muted = !video.muted;
      updateVolumeIcon(video.volume, video.muted);
      if (volInput) volInput.value = video.muted ? 0 : video.volume;
    },

    setVolume: function (val) {
      var v = Math.max(0, Math.min(1, parseFloat(val)));
      if (isCasting() && remotePlayer && remoteController) {
        remotePlayer.volumeLevel = v;
        remoteController.setVolumeLevel();
        if (volInput) volInput.value = v;
        updateVolumeIcon(v, v === 0);
        return;
      }
      video.volume = v; video.muted = v === 0;
      if (volInput) volInput.value = v;
      updateVolumeIcon(v, v === 0);
    },

    showVolume: function (show) {
      volWrap.style.width   = show ? '5rem' : '0';
      volWrap.style.opacity = show ? '1'    : '0';
    },

    seek: function (e) {
      var rect = progressEl.getBoundingClientRect();
      var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (isCasting() && remotePlayer && remoteController) {
        if (!remotePlayer.duration) return;
        remotePlayer.currentTime = ratio * remotePlayer.duration;
        remoteController.seek();
        return;
      }
      if (video.duration) video.currentTime = ratio * video.duration;
    },

    seekHover: function (e) {
      var rect = progressEl.getBoundingClientRect();
      var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      seekHoverEl.style.width = (x / rect.width * 100) + '%';
      if (hoverTimeEl && video.duration) {
        hoverTimeEl.textContent = fmt(x / rect.width * video.duration);
        hoverTimeEl.style.left  = x + 'px';
        hoverTimeEl.classList.remove('hidden');
      }
    },

    seekLeave: function () {
      seekHoverEl.style.width = '0%';
      if (hoverTimeEl) hoverTimeEl.classList.add('hidden');
    },

    toggleFullscreen: function () {
      if (!document.fullscreenElement) container.requestFullscreen();
      else document.exitFullscreen();
    },

    toggleSettings: function () {
      if (!settings) return;
      var opening = settings.classList.contains('hidden');
      if (opening) {
        settings.classList.remove('hidden');
        this.showView('main');
        gearIcon.style.transform = 'rotate(30deg)';
        document.getElementById(id + '-gear-btn').setAttribute('aria-expanded', 'true');
      } else {
        settings.classList.add('hidden');
        gearIcon.style.transform = '';
        document.getElementById(id + '-gear-btn').setAttribute('aria-expanded', 'false');
      }
    },

    showView: function (view) {
      var views = settings.querySelectorAll('[id^="' + id + '-view-"]');
      views.forEach(function (v) { v.classList.add('hidden'); });
      var target = document.getElementById(id + '-view-' + view);
      if (target) target.classList.remove('hidden');
    },

    setSpeed: function (s) {
      video.playbackRate = s;
      var lbl = document.getElementById(id + '-lbl-speed');
      if (lbl) lbl.textContent = s === 1 ? 'Normal' : s + '×';
      var view = document.getElementById(id + '-view-speed');
      if (view) view.querySelectorAll('[data-vp-speed]').forEach(function (btn) {
        btn.querySelector('[data-vp-check]').classList.toggle('hidden', parseFloat(btn.dataset.vpSpeed) !== s);
      });
      this.toggleSettings();
    },

    setQuality: function (value, label) {
      var lbl = document.getElementById(id + '-lbl-quality');
      if (lbl) lbl.textContent = label;
      var view = document.getElementById(id + '-view-quality');
      if (view) view.querySelectorAll('[data-vp-quality]').forEach(function (btn) {
        btn.querySelector('[data-vp-check]').classList.toggle('hidden', btn.dataset.vpQuality !== value);
      });
      this.toggleSettings();
      container.dispatchEvent(new CustomEvent('vp:qualitychange', { detail: { value: value } }));
    },

    setSubtitle: function (idx, label) {
      var lbl = document.getElementById(id + '-lbl-subtitle');
      if (lbl) lbl.textContent = label;
      var view = document.getElementById(id + '-view-subtitles');
      if (view) view.querySelectorAll('[data-vp-sub]').forEach(function (btn) {
        var match = idx === null ? btn.dataset.vpSub === 'null' : parseInt(btn.dataset.vpSub) === idx;
        btn.querySelector('[data-vp-check]').classList.toggle('hidden', !match);
      });
      activateSubtitle(idx);
      this.toggleSettings();
    },

    setSubtitleSize: function (key, label, size) {
      var lbl = document.getElementById(id + '-lbl-subtitle-size');
      if (lbl) lbl.textContent = label;
      if (subText) subText.style.fontSize = size;
      var view = document.getElementById(id + '-view-subtitle-size');
      if (view) view.querySelectorAll('[data-vp-sub-size]').forEach(function (btn) {
        btn.querySelector('[data-vp-check]').classList.toggle('hidden', btn.dataset.vpSubSize !== key);
      });
      this.showView('main');
    },

    setAudioTrack: function (idx, label) {
      var lbl = document.getElementById(id + '-lbl-language');
      if (lbl) lbl.textContent = label;
      var view = document.getElementById(id + '-view-language');
      if (view) view.querySelectorAll('[data-vp-audio]').forEach(function (btn) {
        btn.querySelector('[data-vp-check]').classList.toggle('hidden', parseInt(btn.dataset.vpAudio) !== idx);
      });
      this.toggleSettings();
      container.dispatchEvent(new CustomEvent('vp:audiotrackchange', { detail: { index: idx } }));
    },

    onBgClick: function (e) {
      if (e.target === controls && !isCasting()) this.togglePlay();
    },

    toggleCast: function () {
      if (!castContext || !chromeCast) return;
      if (isCasting()) { castContext.endCurrentSession(true); return; }
      castContext.requestSession().then(function () {
        var session = castContext.getCurrentSession();
        if (!session) return;
        var first = castFirstSrc;
        var src = video.currentSrc || (typeof first === 'string' ? first : (first && first.src) || '');
        if (!src) return;
        var contentType = (first && typeof first === 'object' && first.type) ? first.type : 'video/mp4';
        var mediaInfo = new chromeCast.media.MediaInfo(src, contentType);
        var metadata  = new chromeCast.media.GenericMediaMetadata();
        if (castTitle)  metadata.title  = castTitle;
        if (castPoster) metadata.images = [new chromeCast.Image(castPoster)];
        mediaInfo.metadata = metadata;
        var request = new chromeCast.media.LoadRequest(mediaInfo);
        request.currentTime = video.currentTime || 0;
        session.loadMedia(request).then(function () { video.pause(); }).catch(function () {});
      }).catch(function () {});
    },
  };

  // Initialise hidden state
  spinner.classList.add('hidden');
  setControlsVisible(true);

})();
</script>

```
