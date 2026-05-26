/* video-player/cast.js — Google Cast SDK loader + state sync */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  VPHelpers.ensureCastSdk = function () {
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
        s.id = 'google-cast-sdk';
        s.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        s.async = true;
        document.head.appendChild(s);
      }
    });
    return window.__vp_cast.promise;
  };

  VPHelpers.mapCastState = function (s) {
    if (s === 'CONNECTED')            return 'connected';
    if (s === 'CONNECTING')           return 'connecting';
    if (s === 'NO_DEVICES_AVAILABLE') return 'unavailable';
    return 'available';
  };

  VPHelpers.createCastController = function (refs, ctx) {
    var state = {
      castState: 'unavailable',
      castDeviceName: null,
      castContext: null,
      castFramework: null,
      chromeCast: null,
      remotePlayer: null,
      remoteController: null
    };

    function isCasting() { return state.castState === 'connected'; }

    function updateCastUi() {
      if (refs.castBtn) {
        refs.castBtn.classList.toggle('hidden', state.castState === 'unavailable');
        refs.castBtn.setAttribute('aria-pressed', isCasting() ? 'true' : 'false');
        refs.castBtn.setAttribute('aria-label', isCasting() ? 'Stop casting' : 'Cast to device');
        var active = state.castState === 'connected' || state.castState === 'connecting';
        refs.castBtn.classList.toggle('text-primary', active);
        refs.castBtn.classList.toggle('text-white/80', !active);
        if (refs.castIcon) refs.castIcon.classList.toggle('animate-pulse', state.castState === 'connecting');
      }
      if (refs.castOverlay) refs.castOverlay.classList.toggle('hidden', !isCasting());
      if (refs.castDeviceEl)
        refs.castDeviceEl.textContent = state.castDeviceName
          ? (state.castDeviceName + ' cihazına yayınlanıyor')
          : 'Cihaza yayınlanıyor';
      if (isCasting()) {
        ctx.scheduler.clear();
        VPHelpers.setControlsVisible(refs, true);
      }
    }

    function syncRemote() {
      if (!state.remotePlayer || !state.remotePlayer.isConnected) return;
      VPHelpers.setPlayState(refs, !state.remotePlayer.isPaused);
      var dur = state.remotePlayer.duration;
      if (dur > 0) refs.durEl.textContent = VPHelpers.fmt(dur);
      if (isFinite(state.remotePlayer.currentTime)) {
        refs.curTimeEl.textContent = VPHelpers.fmt(state.remotePlayer.currentTime);
        if (dur > 0) {
          var pct = (state.remotePlayer.currentTime / dur) * 100;
          refs.playedEl.style.width = pct + '%';
          refs.thumbEl.style.left = 'calc(' + pct + '% - 7px)';
          refs.progressEl.setAttribute('aria-valuenow', Math.round(pct));
        }
      }
      if (refs.volInput) refs.volInput.value = state.remotePlayer.isMuted ? 0 : state.remotePlayer.volumeLevel;
      VPHelpers.updateVolumeIcon(refs, state.remotePlayer.volumeLevel, state.remotePlayer.isMuted);
    }

    function init() {
      if (!ctx.enableCast) return;
      VPHelpers.ensureCastSdk().then(function (res) {
        state.castFramework = res.framework;
        state.chromeCast = res.chromeCast;
        state.castContext = state.castFramework.CastContext.getInstance();
        try {
          state.castContext.setOptions({
            receiverApplicationId: state.chromeCast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: state.chromeCast.AutoJoinPolicy.ORIGIN_SCOPED
          });
        } catch (e) {}

        function syncCastState() {
          state.castState = VPHelpers.mapCastState(state.castContext.getCastState());
          var session = isCasting() ? state.castContext.getCurrentSession() : null;
          var device = session && session.getCastDevice ? session.getCastDevice() : null;
          state.castDeviceName = device ? device.friendlyName : null;
          updateCastUi();
        }
        state.castContext.addEventListener(state.castFramework.CastContextEventType.CAST_STATE_CHANGED, syncCastState);
        syncCastState();

        state.remotePlayer = new state.castFramework.RemotePlayer();
        state.remoteController = new state.castFramework.RemotePlayerController(state.remotePlayer);
        state.remoteController.addEventListener(state.castFramework.RemotePlayerEventType.ANY_CHANGE, syncRemote);
      });
    }

    function toggleCast() {
      if (!state.castContext || !state.chromeCast) return;
      if (isCasting()) { state.castContext.endCurrentSession(true); return; }
      state.castContext.requestSession().then(function () {
        var session = state.castContext.getCurrentSession();
        if (!session) return;
        var first = ctx.castFirstSrc;
        var src = refs.video.currentSrc || (typeof first === 'string' ? first : (first && first.src) || '');
        if (!src) return;
        var contentType = (first && typeof first === 'object' && first.type) ? first.type : 'video/mp4';
        var mediaInfo = new state.chromeCast.media.MediaInfo(src, contentType);
        var metadata = new state.chromeCast.media.GenericMediaMetadata();
        if (ctx.castTitle)  metadata.title = ctx.castTitle;
        if (ctx.castPoster) metadata.images = [new state.chromeCast.Image(ctx.castPoster)];
        mediaInfo.metadata = metadata;
        var request = new state.chromeCast.media.LoadRequest(mediaInfo);
        request.currentTime = refs.video.currentTime || 0;
        session.loadMedia(request).then(function () { refs.video.pause(); }).catch(function () {});
      }).catch(function () {});
    }

    return {
      init: init,
      isCasting: isCasting,
      toggleCast: toggleCast,
      getRemotePlayer: function () { return state.remotePlayer; },
      getRemoteController: function () { return state.remoteController; }
    };
  };
})(window);
