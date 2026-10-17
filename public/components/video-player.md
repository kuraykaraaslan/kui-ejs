# VideoPlayer

- **id:** `video-player`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/VideoPlayer/VideoPlayer.ejs`
- **status:** beta
- **since:** 2025-04

Custom HTML5 video player. Quality, subtitle, audio track, and playback rate selection; custom WebVTT subtitle overlay; auto-hiding controls; programmatic API. Keyboard shortcuts: Space/K=play, ←→=±10s, ↑↓=volume, M=mute, F=fullscreen.

## Design tokens consumed

- `--border`
- `--border-focus`

## Variants

### Tam özellikli

```ejs
<%- include('modules/ui/VideoPlayer/VideoPlayer', {
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
<%- include('modules/ui/VideoPlayer/VideoPlayer', {
  src:    'https://example.com/lecture.mp4',
  title:  'Lecture — Episode 1',
  subtitles: [
    { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
  ],
}) %>
```

### Minimal (kontroller her zaman görünür)

```ejs
<%- include('modules/ui/VideoPlayer/VideoPlayer', {
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
<%- include('modules/ui/VideoPlayer/VideoPlayer', {
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

// shared partial context
var _ctx = {
  id: _id,
  poster: _poster,
  title: _title,
  autoPlay: _autoPlay,
  loop: _loop,
  startMuted: _startMuted,
  qualities: _qualities,
  defaultQuality: _defaultQuality,
  defaultQualityLabel: _defaultQualityLabel,
  subtitles: _subtitles,
  audioTracks: _audioTracks,
  autoHideControls: _autoHideControls,
  enableCast: _enableCast,
  className: _className,
  sources: _sources,
  hasSubs: _hasSubs,
  hasQualities: _hasQualities,
  hasAudio: _hasAudio,
  speeds: _speeds,
};
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
    onclick="window.__vp[<%= JSON.stringify(String(_id)) %>].togglePlay()"
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

  <%- include('./partials/_overlays', { ctx: _ctx }) %>

  <%/* ── Controls layer ── */%>
  <div id="<%= _id %>-controls"
    class="absolute inset-0 flex flex-col justify-end transition-opacity duration-300 opacity-100 z-20"
    onclick="window.__vp[<%= JSON.stringify(String(_id)) %>].onBgClick(event)">

    <%/* Vignette */%>
    <div class="absolute inset-0 pointer-events-none"
      style="background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 30%,transparent 60%)"></div>

    <%- include('./partials/_settings-panel', { ctx: _ctx }) %>

    <%- include('./partials/_controls', { ctx: _ctx }) %>

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

<%/* ── Load shared helper scripts (browsers dedupe identical URLs) ── */%>
<script src="/assets/js/video-player/helpers.js"></script>
<script src="/assets/js/video-player/controls-visibility.js"></script>
<script src="/assets/js/video-player/video-events.js"></script>
<script src="/assets/js/video-player/subtitle-cues.js"></script>
<script src="/assets/js/video-player/keyboard.js"></script>
<script src="/assets/js/video-player/cast.js"></script>
<script src="/assets/js/video-player/public-api.js"></script>
<script src="/assets/js/video-player/init.js"></script>

<%/* ── Per-component initializer (preserves the IIFE pattern) ── */%>
<script>
(function () {
  var config = {
    id:         <%- include('../_script-json', { value: String(_id) }) %>,
    autoHide:   <%- include('../_script-json', { value: _autoHideControls }) %>,
    enableCast: <%- include('../_script-json', { value: _enableCast }) %>,
    castTitle:  <%- include('../_script-json', { value: _title }) %>,
    castPoster: <%- include('../_script-json', { value: _poster }) %>,
    castFirstSrc: <%- include('../_script-json', { value: _sources[0] || '' }) %>
  };
  function start() {
    if (window.__vpInit) { window.__vpInit(config); return; }
    document.addEventListener('vp:helpers-ready', function onReady() {
      document.removeEventListener('vp:helpers-ready', onReady);
      window.__vpInit(config);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
</script>

```
