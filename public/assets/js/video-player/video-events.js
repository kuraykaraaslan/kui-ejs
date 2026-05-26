/* video-player/video-events.js — wires HTMLMediaElement events to the UI */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.attachVideoEvents = function (refs, ctx) {
    refs.video.addEventListener('timeupdate', function () { VPHelpers.updateProgress(refs); });
    refs.video.addEventListener('durationchange', function () {
      refs.durEl.textContent = VPHelpers.fmt(refs.video.duration || 0);
    });
    refs.video.addEventListener('waiting', function () { refs.spinner.classList.remove('hidden'); });
    refs.video.addEventListener('canplay', function () { refs.spinner.classList.add('hidden'); });
    refs.video.addEventListener('play', function () {
      VPHelpers.setPlayState(refs, true);
      ctx.scheduler.scheduleHide(true);
    });
    refs.video.addEventListener('pause', function () {
      VPHelpers.setPlayState(refs, false);
      VPHelpers.setControlsVisible(refs, true);
      ctx.scheduler.clear();
    });
    refs.video.addEventListener('ended', function () {
      VPHelpers.setPlayState(refs, false);
      VPHelpers.setControlsVisible(refs, true);
    });

    refs.container.addEventListener('mousemove', function () { ctx.scheduler.scheduleHide(!refs.video.paused); });
    refs.container.addEventListener('mouseleave', function () {
      if (!ctx.isCasting() && !refs.video.paused && ctx.autoHide) VPHelpers.setControlsVisible(refs, false);
    });

    document.addEventListener('fullscreenchange', function () {
      var fs = !!document.fullscreenElement;
      refs.fsIcon.className = 'fa-solid ' + (fs ? 'fa-compress' : 'fa-expand') + ' text-sm';
      var fsBtn = document.getElementById(ctx.id + '-fs-btn');
      if (fsBtn) fsBtn.setAttribute('aria-label', fs ? 'Exit fullscreen' : 'Enter fullscreen');
    });
  };
})(window);
