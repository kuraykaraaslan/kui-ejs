/* global L, IntersectionObserver, MutationObserver */
// MapView · Leaflet provider runtime
// Mirrors NextJS providers/leaflet.ts + parts/LeafletCanvas.tsx + hooks.
//
// Public surface — invoke from MapView.ejs:
//   window.__MapViewLeaflet.init({
//     id, center, zoom, markers, zones, routes, fitBoundsPadding,
//   });
//
// Behaviour parity with NextJS M1:
//   • Lazy load: defers L.map() until the container enters the viewport.
//   • Token-based theming: swaps CartoDB Voyager (light) ↔ Dark Matter (dark)
//     in response to <html class="dark"> changes.
//   • Fit-to-bounds: zoom to marker bounds when `fitBoundsPadding` is set or
//     when the marker count changes.
//
// TODO M2: marker clustering, hover popup auto-open, activeMarkerId.
// TODO M3: search/geocoder, route polylines from a directions service.
// TODO M4: locate-me, layer toggle, draw tools.
// TODO M5: keyboard nav, reduced-motion mode, i18n strings, telemetry hook.
(function () {
  if (window.__MapViewLeaflet) return;

  var COLORS = {
    primary: '#3b82f6', success: '#22c55e', warning: '#f59e0b',
    error: '#ef4444',   info: '#06b6d4',    neutral: '#6b7280'
  };
  var FILL = {
    primary: '#3b82f620', success: '#22c55e20', warning: '#f59e0b20',
    error: '#ef444420',   info: '#06b6d420',    neutral: '#6b728020'
  };

  var TILES = {
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  };

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function pinSvg(color) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">'
      + '<path d="M12 0C5.373 0 0 5.373 0 12c0 3.143 1.204 5.997 3.17 8.126L12 36l8.83-15.874A11.945 11.945 0 0 0 24 12C24 5.373 18.627 0 12 0z" fill="' + color + '"/>'
      + '<circle cx="12" cy="12" r="4.5" fill="white" opacity=".9"/></svg>';
  }

  function createIcon(color) {
    return L.divIcon({ html: pinSvg(color), className: '', iconSize: [24, 36], iconAnchor: [12, 36], tooltipAnchor: [0, -38] });
  }

  function tooltipHtml(tt) {
    var hasMeta = tt.description || (tt.fields && tt.fields.length);
    var html = '<div style="min-width:130px;max-width:220px">'
      + '<p style="font-weight:600;font-size:13px;color:#111827;margin-bottom:' + (hasMeta ? '3px' : '0') + '">' + tt.title + '</p>';
    if (tt.description) {
      html += '<p style="font-size:11px;color:#6b7280;line-height:1.4;margin-bottom:' + (tt.fields && tt.fields.length ? '4px' : '0') + '">' + tt.description + '</p>';
    }
    if (tt.fields && tt.fields.length) {
      html += '<table style="width:100%;border-collapse:collapse"><tbody>';
      tt.fields.forEach(function (f) {
        html += '<tr><td style="font-size:11px;color:#6b7280;padding-right:6px;white-space:nowrap">' + f.label + '</td>'
              + '<td style="font-size:11px;color:#111827;font-weight:500">' + f.value + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    return html + '</div>';
  }

  function setupTileTheme(map) {
    var current = isDark() ? TILES.dark : TILES.light;
    var layer = L.tileLayer(current.url, { attribution: current.attribution }).addTo(map);
    var mo = new MutationObserver(function () {
      var next = isDark() ? TILES.dark : TILES.light;
      if (next === current) return;
      map.removeLayer(layer);
      current = next;
      layer = L.tileLayer(current.url, { attribution: current.attribution }).addTo(map);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return function dispose() { mo.disconnect(); };
  }

  function build(opts) {
    var mapEl = document.getElementById(opts.id + '-map');
    if (!mapEl || !window.L) return;

    var map = L.map(opts.id + '-map').setView(opts.center, opts.zoom);
    setupTileTheme(map);

    var zoneLayers = (opts.zones || []).map(function (z) {
      var v = z.variant || 'primary';
      var layer = L.polygon(z.positions, {
        color: COLORS[v], fillColor: FILL[v],
        fillOpacity: z.fillOpacity != null ? z.fillOpacity : 0.25, weight: 2
      }).addTo(map);
      if (z.label) layer.bindTooltip('<span style="font-weight:600;font-size:12px;color:' + COLORS[v] + '">' + z.label + '</span>', { sticky: true });
      return layer;
    });

    var routeLayers = (opts.routes || []).map(function (r) {
      var layer = L.polyline(r.positions, {
        color: r.color || COLORS.primary,
        weight: r.weight || 3,
        dashArray: r.dashed ? '8 6' : null
      }).addTo(map);
      if (r.label) layer.bindTooltip('<span style="font-weight:600;font-size:12px">' + r.label + '</span>', { sticky: true });
      return layer;
    });

    (opts.markers || []).forEach(function (m) {
      var color  = COLORS[m.variant || 'primary'];
      var marker = L.marker(m.position, { icon: createIcon(color) }).addTo(map);
      if (m.tooltip) marker.bindTooltip(tooltipHtml(m.tooltip));
      else if (m.label) marker.bindTooltip('<span style="font-size:12px;font-weight:600">' + m.label + '</span>');
    });

    // Fit-to-bounds when requested.
    if (typeof opts.fitBoundsPadding === 'number' && opts.markers && opts.markers.length) {
      var bounds = L.latLngBounds(opts.markers.map(function (m) { return m.position; }));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [opts.fitBoundsPadding, opts.fitBoundsPadding] });
      }
    }

    return { map: map, mapEl: mapEl, COLORS: COLORS, zoneLayers: zoneLayers, routeLayers: routeLayers, createIcon: createIcon, tooltipHtml: tooltipHtml };
  }

  function init(opts) {
    var mapEl = document.getElementById(opts.id + '-map');
    if (!mapEl) return;
    var started = false;
    function start() {
      if (started) return;
      started = true;
      var ctx = build(opts);
      if (ctx && typeof opts.onReady === 'function') opts.onReady(ctx);
    }
    if (typeof IntersectionObserver === 'undefined') { start(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { start(); io.disconnect(); break; }
      }
    }, { rootMargin: '200px', threshold: 0.01 });
    io.observe(mapEl);
  }

  window.__MapViewLeaflet = { init: init, COLORS: COLORS, createIcon: createIcon, tooltipHtml: tooltipHtml };
})();
