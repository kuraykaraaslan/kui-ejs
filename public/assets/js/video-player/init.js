/* video-player/init.js — per-component IIFE orchestrator */
(function (global) {
  'use strict';
  var VPHelpers = global.VPHelpers || (global.VPHelpers = {});

  global.__vp = global.__vp || {};

  // Per-component init: preserves the IIFE pattern from the original inline script.
  global.__vpInit = function (config) {
    (function () {
      var refs = VPHelpers.collectRefs(config.id);
      if (!refs.container || !refs.video) return;

      // ── ctx shared across helper modules ─────────────────────────────────
      var ctx = {
        id: config.id,
        autoHide: config.autoHide,
        enableCast: config.enableCast,
        castTitle: config.castTitle,
        castPoster: config.castPoster,
        castFirstSrc: config.castFirstSrc,
        // late-bound after cast controller exists:
        isCasting: function () { return false; },
        scheduler: null
      };

      // visibility scheduler (defined here so ctx.isCasting binds correctly)
      ctx.scheduler = VPHelpers.createVisibilityScheduler(refs, ctx);

      // cast controller (provides ctx.isCasting + remote refs)
      var castCtl = VPHelpers.createCastController(refs, ctx);
      ctx.isCasting = castCtl.isCasting;

      // subtitle controller
      var subCtl = VPHelpers.createSubtitleController(refs);

      // wire up video + keyboard + cast init
      VPHelpers.attachVideoEvents(refs, ctx);
      VPHelpers.attachKeyboard(refs, ctx);
      castCtl.init();

      // expose imperative API
      global.__vp[config.id] = VPHelpers.createPublicApi(refs, ctx, {
        subtitle: subCtl,
        cast: castCtl
      });

      // initial UI state
      refs.spinner.classList.add('hidden');
      VPHelpers.setControlsVisible(refs, true);
    })();
  };

  // Signal that helpers are ready (for per-instance scripts that load before init.js)
  try {
    document.dispatchEvent(new CustomEvent('vp:helpers-ready'));
  } catch (e) {}
})(window);
