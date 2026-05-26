/* video-player/subtitle-cues.js — WebVTT cue overlay renderer */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  // Returns the activateSubtitle closure bound to this player's refs.
  VPHelpers.createSubtitleController = function (refs) {
    var cueListener = null;

    function activate(idx) {
      var tracks = refs.video.textTracks;
      for (var i = 0; i < tracks.length; i++) tracks[i].mode = 'disabled';
      refs.subOverlay.classList.add('hidden');
      if (idx === null || !tracks[idx]) return;
      var track = tracks[idx];
      track.mode = 'hidden';

      function onCue() {
        var active = track.activeCues;
        if (!active || active.length === 0) {
          refs.subOverlay.classList.add('hidden');
          return;
        }
        refs.subText.textContent = Array.prototype.slice.call(active)
          .map(function (c) { return c.text.replace(/<[^>]+>/g, ''); }).join('\n');
        refs.subOverlay.classList.remove('hidden');
      }
      if (cueListener) track.removeEventListener('cuechange', cueListener);
      cueListener = onCue;
      track.addEventListener('cuechange', onCue);
    }

    return { activate: activate };
  };
})(window);
