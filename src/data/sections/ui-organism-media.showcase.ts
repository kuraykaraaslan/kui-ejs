import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const videoPlayerSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/VideoPlayer/VideoPlayer.ejs'), 'utf-8');

function renderVideoPlayer(locals: Record<string, unknown>): string {
  return ejs.render(videoPlayerSource, locals, { filename: path.join(process.cwd(), 'modules/ui/VideoPlayer/VideoPlayer.ejs') });
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildOrganismMediaData(): ShowcaseItem[] {
  return [
    {
      id:          'video-player',
      title:       'VideoPlayer',
      category:    'Organism',
      abbr:        'Vp',
      description: 'Custom HTML5 video player. Quality, subtitle, audio track, and playback rate selection; custom WebVTT subtitle overlay; auto-hiding controls; programmatic API. Keyboard shortcuts: Space/K=play, ←→=±10s, ↑↓=volume, M=mute, F=fullscreen.',
      filePath:    'modules/ui/VideoPlayer/VideoPlayer.ejs',
      sourceCode:  videoPlayerSource,
      variants: [
        {
          title:       'Tam özellikli',
          layout:      'stack',
          previewHtml: renderVideoPlayer({
            src:            'https://placeholdervideo.dev/1920x1080',
            title:          'Big Buck Bunny',
            qualities:      [
              { label: '1080p', value: 'https://placeholdervideo.dev/1920x1080' },
              { label: '720p',  value: 'https://placeholdervideo.dev/1280x720'  },
              { label: '480p',  value: 'https://placeholdervideo.dev/854x480'   },
            ],
            defaultQuality: 'https://placeholdervideo.dev/1920x1080',
            subtitles:      [
              { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
              { label: 'English', srclang: 'en', src: '/subtitles/en.vtt' },
            ],
            audioTracks:    [{ label: 'Türkçe' }, { label: 'English' }],
          }),
          code: `<%- include('modules/ui/VideoPlayer/VideoPlayer', {
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
}) %>`,
        },
        {
          title:       'Yalnızca altyazı',
          layout:      'stack',
          previewHtml: renderVideoPlayer({
            src:       'https://placeholdervideo.dev/1920x1080',
            title:     'Lecture — Episode 1',
            subtitles: [
              { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
            ],
          }),
          code: `<%- include('modules/ui/VideoPlayer/VideoPlayer', {
  src:    'https://example.com/lecture.mp4',
  title:  'Lecture — Episode 1',
  subtitles: [
    { label: 'Türkçe', srclang: 'tr', src: '/subtitles/tr.vtt' },
  ],
}) %>`,
        },
        {
          title:       'Minimal (kontroller her zaman görünür)',
          layout:      'stack',
          previewHtml: renderVideoPlayer({
            src:              'https://placeholdervideo.dev/1920x1080',
            autoHideControls: false,
          }),
          code: `<%- include('modules/ui/VideoPlayer/VideoPlayer', {
  src:              'https://placeholdervideo.dev/1920x1080',
  autoHideControls: false,
}) %>

<script>
  /* Geliştirici kontrolü örneği */
  document.querySelector('[data-vp-id="my-player"]')
    .addEventListener('vp:qualitychange', function (e) {
      console.log('Quality changed to', e.detail.value);
    });
<\/script>`,
        },
        {
          title:       'Otomatik oynat + sessiz',
          layout:      'stack',
          previewHtml: renderVideoPlayer({
            src:        'https://placeholdervideo.dev/1920x1080',
            autoPlay:   true,
            startMuted: true,
            loop:       true,
          }),
          code: `<%- include('modules/ui/VideoPlayer/VideoPlayer', {
  src:          'https://example.com/promo.mp4',
  autoPlay:     true,
  startMuted:   true,
  loop:         true,
  poster:       'https://example.com/poster.jpg',
}) %>`,
        },
      ],
    },
  ];
}
