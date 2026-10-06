/*
 * modules/ui/Chart/scripts/time-series.js
 *
 * Time-axis renderer behind `type: 'line' | 'area'` + `xAxis: 'time'` (and the
 * `xScale: 'time'` alias). Mirrors kui-react's charts/TimeSeriesChart.tsx.
 *
 * Points are placed by TIME, so series with different sampling instants share
 * one axis. Zoom is a drag-to-select brush kept in this closure only: it never
 * reaches the page, so a dashboard's own time window is untouched. Double-click
 * or the "Reset zoom" button leaves it. y rescales to the visible points.
 *
 * Mounted by KuiChart.autoInit() from `data-kui-chart-kind="time"` +
 * `data-kui-chart-config` (JSON). Requires chart-helpers.js.
 *
 * Config: { series, variant: 'line'|'area', height, showGrid, showTooltip,
 *           smooth, strokeWidth, fillOpacity, zoom, yFormat (global fn name),
 *           locale, ariaLabel }
 */
(function (global) {
  'use strict';
  var K = global.KuiChart;
  if (!K || K.renderers.time) return;

  var PADDING = { top: 12, right: 16, bottom: 28, left: 44 };
  var clipSeq = 0;

  function render(host, cfg) {
    var canvas = host.querySelector('[data-kui-chart-canvas]');
    if (!canvas) return;
    var series = cfg.series || [];
    var variant = cfg.variant === 'area' ? 'area' : 'line';
    var height = typeof cfg.height === 'number' ? cfg.height : 240;
    var showGrid = cfg.showGrid !== false;
    var showTooltip = cfg.showTooltip !== false;
    var smooth = cfg.smooth !== false;
    var strokeWidth = typeof cfg.strokeWidth === 'number' ? cfg.strokeWidth : 2;
    var fillOpacity = typeof cfg.fillOpacity === 'number' ? cfg.fillOpacity : 0.2;
    var zoomOn = cfg.zoom !== false;
    var locale = cfg.locale || undefined;
    var userFmt = K.resolveFn(cfg.yFormat);
    var fmt = userFmt || function (v) { return String(Math.round(v * 100) / 100); };
    var resetBtn = host.querySelector('[data-kui-chart-reset]');
    var clipId = 'ts-clip-' + (++clipSeq);

    var full = K.timeExtent(series);
    var all = K.timePoints(series);
    var zoomDomain = null;
    var hoverT = null;
    var brush = null;
    var width = 0;
    var geo = null; // { rect, domain, span, min, max } of the last static draw

    var svg = K.svg('svg', {
      height: height,
      role: 'img',
      'aria-label': cfg.ariaLabel || (variant === 'area' ? 'Area chart' : 'Line chart'),
    });
    svg.style.touchAction = 'pan-y';
    svg.style.userSelect = 'none';
    if (zoomOn) svg.style.cursor = 'crosshair';
    canvas.insertBefore(svg, canvas.firstChild);
    var tip = K.tooltip(canvas);

    var crossLayer = K.svg('g', {});
    var overlayLayer = K.svg('g', {});

    function currentDomain() {
      return zoomDomain && zoomDomain[1] > full[0] && zoomDomain[0] < full[1] ? zoomDomain : full;
    }

    function drawStatic() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var domain = currentDomain();
      var ext = K.visibleYExtent(all, domain);
      var min = ext.min;
      var max = ext.max;
      var span = domain[1] - domain[0];
      var rect = {
        x: PADDING.left, y: PADDING.top,
        width: Math.max(0, width - PADDING.left - PADDING.right),
        height: Math.max(0, height - PADDING.top - PADDING.bottom),
      };
      geo = { rect: rect, domain: domain, span: span, min: min, max: max };
      svg.setAttribute('width', width);

      var defs = K.svg('defs', {});
      var clip = K.svg('clipPath', { id: clipId });
      clip.appendChild(K.svg('rect', { x: rect.x, y: rect.y - 2, width: rect.width, height: rect.height + 4 }));
      defs.appendChild(clip);
      svg.appendChild(defs);

      var yTickValues = K.niceTicks(min, max, 4);
      var yPixels = yTickValues.map(function (v) { return K.yScale(v, min, max, rect); });
      var yTicks = yTickValues.map(function (v, i) { return { position: yPixels[i], label: fmt(v) }; });
      var xTicks = K.timeTicks(domain, Math.max(2, Math.floor(rect.width / 90))).map(function (t) {
        return { position: K.xTime(t, domain, rect), label: K.formatTick(t, span, locale) };
      });
      var baselineY = K.yScale(0, min, max, rect);

      if (showGrid) svg.appendChild(K.grid(rect, yPixels));
      svg.appendChild(K.axisY(yTicks, rect.x, rect.y, rect.y + rect.height));
      svg.appendChild(K.axisX(xTicks, rect.y + rect.height, rect.x, rect.x + rect.width));
      svg.appendChild(crossLayer);

      var clipped = K.svg('g', { 'clip-path': 'url(#' + clipId + ')' });
      series.forEach(function (s, si) {
        var color = K.paletteColor(si, s.color);
        var pts = all[si].map(function (p) {
          return p.y === null || p.y === undefined ? null
            : { x: K.xTime(p.t, domain, rect), y: K.yScale(p.y, min, max, rect) };
        });
        var path = smooth ? K.smoothPath(pts) : K.linePath(pts);
        var solid = pts.filter(Boolean);
        var g = K.svg('g', {});
        if (variant === 'area' && solid.length > 1) {
          var areaPath = path + ' L' + solid[solid.length - 1].x + ' ' + baselineY + ' L' + solid[0].x + ' ' + baselineY + ' Z';
          g.appendChild(K.svg('path', { d: areaPath, fill: color, opacity: fillOpacity }));
        }
        g.appendChild(K.svg('path', {
          d: path, fill: 'none', stroke: color, 'stroke-width': strokeWidth,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        }));
        if (solid.length === 1) g.appendChild(K.svg('circle', { cx: solid[0].x, cy: solid[0].y, r: 3, fill: color }));
        clipped.appendChild(g);
      });
      svg.appendChild(clipped);
      svg.appendChild(overlayLayer);

      if (resetBtn) resetBtn.hidden = !(zoomOn && domain !== full);
    }

    function drawDynamic() {
      if (!geo) return;
      while (crossLayer.firstChild) crossLayer.removeChild(crossLayer.firstChild);
      while (overlayLayer.firstChild) overlayLayer.removeChild(overlayLayer.firstChild);
      var rect = geo.rect;
      var domain = geo.domain;

      var allTimes = [];
      var seen = {};
      all.forEach(function (pts) {
        pts.forEach(function (p) { if (!seen[p.t]) { seen[p.t] = true; allTimes.push(p.t); } });
      });
      allTimes.sort(function (a, b) { return a - b; });
      var hoverIdx = hoverT === null ? -1 : K.nearestIndex(allTimes, hoverT);
      var anchor = hoverIdx >= 0 ? allTimes[hoverIdx] : null;
      var hoverX = anchor === null ? null : K.xTime(anchor, domain, rect);

      if (hoverX !== null && !brush) crossLayer.appendChild(K.crosshair(rect, hoverX));

      if (anchor !== null && !brush) {
        series.forEach(function (s, si) {
          var p = null;
          for (var i = 0; i < all[si].length; i++) if (all[si][i].t === anchor) { p = all[si][i]; break; }
          if (!p || p.y === null || p.y === undefined) return;
          overlayLayer.appendChild(K.svg('circle', {
            cx: hoverX, cy: K.yScale(p.y, geo.min, geo.max, rect), r: 4,
            fill: 'var(--surface-base)', stroke: K.paletteColor(si, s.color), 'stroke-width': 2,
          }));
        });
      }
      if (brush && Math.abs(brush.to - brush.from) > 0) {
        overlayLayer.appendChild(K.svg('rect', {
          x: Math.min(brush.from, brush.to), y: rect.y, width: Math.abs(brush.to - brush.from), height: rect.height,
          fill: K.theme.crosshair, opacity: 0.2, 'pointer-events': 'none',
        }));
      }

      if (showTooltip && anchor !== null && hoverX !== null && !brush) {
        var rows = series.map(function (s, si) {
          var pts = all[si];
          var j = K.nearestIndex(pts.map(function (p) { return p.t; }), anchor);
          var p = j >= 0 ? pts[j] : undefined;
          var exact = !!p && p.t === anchor;
          return {
            seriesId: s.id, seriesName: s.name, color: K.paletteColor(si, s.color),
            y: exact ? p.y : null,
            valueLabel: exact && p.y !== null && p.y !== undefined ? (p.label !== undefined && p.label !== null ? p.label : fmt(p.y)) : undefined,
          };
        });
        tip.update(K.formatFull(anchor, geo.span, locale), rows, hoverX, rect.y + rect.height / 2, width);
      } else {
        tip.hide();
      }
    }

    function localX(e) {
      var b = svg.getBoundingClientRect();
      return e.clientX - b.left;
    }
    function inPlot(px) { return geo && px >= geo.rect.x && px <= geo.rect.x + geo.rect.width; }
    function resetZoom() { zoomDomain = null; hoverT = null; brush = null; drawStatic(); drawDynamic(); }

    svg.addEventListener('mousedown', function (e) {
      if (!zoomOn || e.button !== 0 || !geo) return;
      var px = localX(e);
      if (inPlot(px)) { brush = { from: px, to: px }; drawDynamic(); }
    });
    svg.addEventListener('mousemove', function (e) {
      if (!geo) return;
      var px = localX(e);
      if (brush) brush = { from: brush.from, to: Math.min(geo.rect.x + geo.rect.width, Math.max(geo.rect.x, px)) };
      if (showTooltip) hoverT = inPlot(px) ? K.invTime(px, geo.domain, geo.rect) : null;
      drawDynamic();
    });
    svg.addEventListener('mouseup', function () {
      if (!brush || !geo) return;
      var next = K.brushDomain(brush.from, brush.to, geo.domain, full, geo.rect);
      brush = null;
      if (next) { zoomDomain = next; hoverT = null; drawStatic(); }
      drawDynamic();
    });
    svg.addEventListener('mouseleave', function () { hoverT = null; brush = null; drawDynamic(); });
    svg.addEventListener('dblclick', function () { if (zoomOn) resetZoom(); });
    if (resetBtn) resetBtn.addEventListener('click', resetZoom);

    K.observeContainer(canvas, function (size) {
      if (size.width <= 0) return;
      width = size.width;
      drawStatic();
      drawDynamic();
    });
  }

  K.renderers.time = render;
})(typeof window !== 'undefined' ? window : globalThis);
