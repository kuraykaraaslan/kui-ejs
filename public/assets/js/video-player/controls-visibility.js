/* video-player/controls-visibility.js — auto-hide logic for the controls bar */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.setControlsVisible = function (refs, v) {
    if (v) {
      refs.controls.classList.remove('opacity-0', 'pointer-events-none');
      if (refs.subOverlay && !refs.subOverlay.classList.contains('hidden'))
        refs.subOverlay.style.bottom = '4.5rem';
    } else {
      refs.controls.classList.add('opacity-0', 'pointer-events-none');
      if (refs.subOverlay && !refs.subOverlay.classList.contains('hidden'))
        refs.subOverlay.style.bottom = '1rem';
    }
  };

  // Returns { scheduleHide(isPlaying), clear() }. Owns its own timer.
  VPHelpers.createVisibilityScheduler = function (refs, ctx) {
    var hideTimer = null;
    return {
      scheduleHide: function (playing) {
        if (hideTimer) clearTimeout(hideTimer);
        VPHelpers.setControlsVisible(refs, true);
        if (ctx.isCasting()) return; // pin controls while casting
        if (playing && ctx.autoHide)
          hideTimer = setTimeout(function () { VPHelpers.setControlsVisible(refs, false); }, 3000);
      },
      clear: function () { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
    };
  };
})(window);
