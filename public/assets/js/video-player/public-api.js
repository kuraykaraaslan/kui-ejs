/* video-player/public-api.js — builds window.__vp[id] imperative API */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.createPublicApi = function (refs, ctx, controllers) {
    var sub = controllers.subtitle;
    var cast = controllers.cast;

    return {
      togglePlay: function () {
        if (cast.isCasting() && cast.getRemoteController()) { cast.getRemoteController().playOrPause(); return; }
        if (refs.video.paused) refs.video.play(); else refs.video.pause();
      },

      seekBy: function (delta) {
        var rp = cast.getRemotePlayer(); var rc = cast.getRemoteController();
        if (cast.isCasting() && rp && rc) {
          rp.currentTime = Math.max(0, Math.min(rp.duration || 0, rp.currentTime + delta));
          rc.seek(); return;
        }
        refs.video.currentTime = Math.max(0, Math.min(refs.video.duration || 0, refs.video.currentTime + delta));
      },

      toggleMute: function () {
        if (cast.isCasting() && cast.getRemoteController()) { cast.getRemoteController().muteOrUnmute(); return; }
        refs.video.muted = !refs.video.muted;
        VPHelpers.updateVolumeIcon(refs, refs.video.volume, refs.video.muted);
        if (refs.volInput) refs.volInput.value = refs.video.muted ? 0 : refs.video.volume;
      },

      setVolume: function (val) {
        var v = Math.max(0, Math.min(1, parseFloat(val)));
        var rp = cast.getRemotePlayer(); var rc = cast.getRemoteController();
        if (cast.isCasting() && rp && rc) {
          rp.volumeLevel = v; rc.setVolumeLevel();
          if (refs.volInput) refs.volInput.value = v;
          VPHelpers.updateVolumeIcon(refs, v, v === 0);
          return;
        }
        refs.video.volume = v; refs.video.muted = v === 0;
        if (refs.volInput) refs.volInput.value = v;
        VPHelpers.updateVolumeIcon(refs, v, v === 0);
      },

      showVolume: function (show) {
        refs.volWrap.style.width = show ? '5rem' : '0';
        refs.volWrap.style.opacity = show ? '1' : '0';
      },

      seek: function (e) {
        var rect = refs.progressEl.getBoundingClientRect();
        var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        var rp = cast.getRemotePlayer(); var rc = cast.getRemoteController();
        if (cast.isCasting() && rp && rc) {
          if (!rp.duration) return;
          rp.currentTime = ratio * rp.duration; rc.seek(); return;
        }
        if (refs.video.duration) refs.video.currentTime = ratio * refs.video.duration;
      },

      seekHover: function (e) {
        var rect = refs.progressEl.getBoundingClientRect();
        var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        refs.seekHoverEl.style.width = (x / rect.width * 100) + '%';
        if (refs.hoverTimeEl && refs.video.duration) {
          refs.hoverTimeEl.textContent = VPHelpers.fmt(x / rect.width * refs.video.duration);
          refs.hoverTimeEl.style.left = x + 'px';
          refs.hoverTimeEl.classList.remove('hidden');
        }
      },

      seekLeave: function () {
        refs.seekHoverEl.style.width = '0%';
        if (refs.hoverTimeEl) refs.hoverTimeEl.classList.add('hidden');
      },

      toggleFullscreen: function () {
        if (!document.fullscreenElement) refs.container.requestFullscreen();
        else document.exitFullscreen();
      },

      toggleSettings: function () {
        if (!refs.settings) return;
        var opening = refs.settings.classList.contains('hidden');
        if (opening) {
          refs.settings.classList.remove('hidden');
          this.showView('main');
          refs.gearIcon.style.transform = 'rotate(30deg)';
          var gearBtn = document.getElementById(ctx.id + '-gear-btn');
          if (gearBtn) gearBtn.setAttribute('aria-expanded', 'true');
        } else {
          refs.settings.classList.add('hidden');
          refs.gearIcon.style.transform = '';
          var gearBtn2 = document.getElementById(ctx.id + '-gear-btn');
          if (gearBtn2) gearBtn2.setAttribute('aria-expanded', 'false');
        }
      },

      showView: function (view) {
        var views = refs.settings.querySelectorAll('[id^="' + ctx.id + '-view-"]');
        views.forEach(function (v) { v.classList.add('hidden'); });
        var target = document.getElementById(ctx.id + '-view-' + view);
        if (target) target.classList.remove('hidden');
      },

      setSpeed: function (s) {
        refs.video.playbackRate = s;
        var lbl = document.getElementById(ctx.id + '-lbl-speed');
        if (lbl) lbl.textContent = s === 1 ? 'Normal' : s + '×';
        var view = document.getElementById(ctx.id + '-view-speed');
        if (view) view.querySelectorAll('[data-vp-speed]').forEach(function (btn) {
          btn.querySelector('[data-vp-check]').classList.toggle('hidden', parseFloat(btn.dataset.vpSpeed) !== s);
        });
        this.toggleSettings();
      },

      setQuality: function (value, label) {
        var lbl = document.getElementById(ctx.id + '-lbl-quality');
        if (lbl) lbl.textContent = label;
        var view = document.getElementById(ctx.id + '-view-quality');
        if (view) view.querySelectorAll('[data-vp-quality]').forEach(function (btn) {
          btn.querySelector('[data-vp-check]').classList.toggle('hidden', btn.dataset.vpQuality !== value);
        });
        this.toggleSettings();
        refs.container.dispatchEvent(new CustomEvent('vp:qualitychange', { detail: { value: value } }));
      },

      setSubtitle: function (idx, label) {
        var lbl = document.getElementById(ctx.id + '-lbl-subtitle');
        if (lbl) lbl.textContent = label;
        var view = document.getElementById(ctx.id + '-view-subtitles');
        if (view) view.querySelectorAll('[data-vp-sub]').forEach(function (btn) {
          var match = idx === null ? btn.dataset.vpSub === 'null' : parseInt(btn.dataset.vpSub) === idx;
          btn.querySelector('[data-vp-check]').classList.toggle('hidden', !match);
        });
        sub.activate(idx);
        this.toggleSettings();
      },

      setSubtitleSize: function (key, label, size) {
        var lbl = document.getElementById(ctx.id + '-lbl-subtitle-size');
        if (lbl) lbl.textContent = label;
        if (refs.subText) refs.subText.style.fontSize = size;
        var view = document.getElementById(ctx.id + '-view-subtitle-size');
        if (view) view.querySelectorAll('[data-vp-sub-size]').forEach(function (btn) {
          btn.querySelector('[data-vp-check]').classList.toggle('hidden', btn.dataset.vpSubSize !== key);
        });
        this.showView('main');
      },

      setAudioTrack: function (idx, label) {
        var lbl = document.getElementById(ctx.id + '-lbl-language');
        if (lbl) lbl.textContent = label;
        var view = document.getElementById(ctx.id + '-view-language');
        if (view) view.querySelectorAll('[data-vp-audio]').forEach(function (btn) {
          btn.querySelector('[data-vp-check]').classList.toggle('hidden', parseInt(btn.dataset.vpAudio) !== idx);
        });
        this.toggleSettings();
        refs.container.dispatchEvent(new CustomEvent('vp:audiotrackchange', { detail: { index: idx } }));
      },

      onBgClick: function (e) {
        if (e.target === refs.controls && !cast.isCasting()) this.togglePlay();
      },

      toggleCast: function () { cast.toggleCast(); }
    };
  };
})(window);
