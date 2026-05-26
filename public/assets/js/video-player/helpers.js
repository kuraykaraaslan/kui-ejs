/* video-player/helpers.js — shared utilities for VideoPlayer.ejs */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.fmt = function (s) {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = Math.floor(s % 60);
    var mm = String(m).padStart(2, '0');
    var ss = String(sec).padStart(2, '0');
    return (h > 0 ? h + ':' : '') + mm + ':' + ss;
  };

  VPHelpers.collectRefs = function (id) {
    return {
      container:   document.getElementById(id),
      video:       document.getElementById(id + '-video'),
      spinner:     document.getElementById(id + '-spinner'),
      playOverlay: document.getElementById(id + '-play-overlay'),
      playCircle:  document.getElementById(id + '-play-circle'),
      subOverlay:  document.getElementById(id + '-subtitle-overlay'),
      subText:     document.getElementById(id + '-subtitle-text'),
      controls:    document.getElementById(id + '-controls'),
      progressEl:  document.getElementById(id + '-progress'),
      bufferedEl:  document.getElementById(id + '-buffered'),
      playedEl:    document.getElementById(id + '-played'),
      seekHoverEl: document.getElementById(id + '-seek-hover'),
      thumbEl:     document.getElementById(id + '-thumb'),
      hoverTimeEl: document.getElementById(id + '-hover-time'),
      curTimeEl:   document.getElementById(id + '-cur-time'),
      durEl:       document.getElementById(id + '-duration'),
      playIcon:    document.getElementById(id + '-play-icon'),
      volIcon:     document.getElementById(id + '-vol-icon'),
      volWrap:     document.getElementById(id + '-vol-wrap'),
      volInput:    document.getElementById(id + '-vol-input'),
      gearIcon:    document.getElementById(id + '-gear-icon'),
      fsIcon:      document.getElementById(id + '-fs-icon'),
      settings:    document.getElementById(id + '-settings'),
      castOverlay: document.getElementById(id + '-cast-overlay'),
      castDeviceEl: document.getElementById(id + '-cast-device'),
      castBtn:     document.getElementById(id + '-cast-btn'),
      castIcon:    document.getElementById(id + '-cast-icon')
    };
  };

  VPHelpers.setPlayState = function (refs, playing) {
    refs.playIcon.className = 'fa-solid ' + (playing ? 'fa-pause' : 'fa-play') + ' text-base';
    refs.playOverlay.style.opacity = playing ? '0' : '1';
    refs.playCircle.style.transform = playing ? 'scale(1.25)' : 'scale(1)';
  };

  VPHelpers.updateVolumeIcon = function (refs, vol, muted) {
    var ic = (muted || vol == 0) ? 'fa-volume-off' : (vol < 0.5 ? 'fa-volume-low' : 'fa-volume-high');
    refs.volIcon.className = 'fa-solid ' + ic + ' text-sm';
  };

  VPHelpers.updateProgress = function (refs) {
    var dur = refs.video.duration;
    if (!dur || !isFinite(dur)) return;
    var pct = (refs.video.currentTime / dur) * 100;
    refs.playedEl.style.width = pct + '%';
    refs.thumbEl.style.left = 'calc(' + pct + '% - 7px)';
    refs.progressEl.setAttribute('aria-valuenow', Math.round(pct));
    refs.curTimeEl.textContent = VPHelpers.fmt(refs.video.currentTime);
    if (refs.video.buffered.length > 0)
      refs.bufferedEl.style.width = (refs.video.buffered.end(refs.video.buffered.length - 1) / dur * 100) + '%';
  };
})(window);
