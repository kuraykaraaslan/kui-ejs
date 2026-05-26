/* video-player/keyboard.js — keyboard shortcut handler */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.attachKeyboard = function (refs, ctx) {
    refs.container.addEventListener('keydown', function (e) {
      var p = window.__vp[ctx.id];
      if (!p) return;
      switch (e.key) {
        case ' ':
        case 'k':          e.preventDefault(); p.togglePlay(); break;
        case 'ArrowLeft':  e.preventDefault(); p.seekBy(-10); break;
        case 'ArrowRight': e.preventDefault(); p.seekBy(10); break;
        case 'ArrowUp':    e.preventDefault(); p.setVolume(Math.min(1, refs.video.volume + 0.1)); break;
        case 'ArrowDown':  e.preventDefault(); p.setVolume(Math.max(0, refs.video.volume - 0.1)); break;
        case 'm':          e.preventDefault(); p.toggleMute(); break;
        case 'f':          e.preventDefault(); p.toggleFullscreen(); break;
        case 'Escape':
          if (refs.settings && !refs.settings.classList.contains('hidden')) {
            e.preventDefault();
            p.toggleSettings();
          }
          break;
      }
    });

    // Close settings on outside click
    document.addEventListener('click', function (e) {
      if (!refs.settings || refs.settings.classList.contains('hidden')) return;
      var gearBtn = document.getElementById(ctx.id + '-gear-btn');
      if (!refs.settings.contains(e.target) && gearBtn && !gearBtn.contains(e.target))
        window.__vp[ctx.id].toggleSettings();
    });
  };
})(window);
