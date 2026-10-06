/*
 * modules/ui/Chart/scripts/heatmap.js
 *
 * Token-aware matrix heatmap. Mirrors kui-react's charts/HeatmapChart.tsx.
 * Colour is the `color` token (default `var(--primary)`) at a variable
 * opacity, so light/dark follow the theme and no colour scale is hard-coded.
 * A missing value is an empty cell, never 0.
 *
 * Mounted by KuiChart.autoInit() from `data-kui-chart-kind="heatmap"` +
 * `data-kui-chart-config`. Requires chart-helpers.js.
 *
 * Config: { cells: [{x, y, value}], height, min, max, valueFormat (global fn
 *           name), valueLabel, showLegend, showTooltip, ariaLabel, color }
 */
(function (global) {
  'use strict';
  var K = global.KuiChart;
  if (!K || K.renderers.heatmap) return;

  var PAD = { top: 8, right: 8, bottom: 26, left: 56 };

  function render(host, cfg) {
    var canvas = host.querySelector('[data-kui-chart-canvas]');
    if (!canvas) return;
    var height = typeof cfg.height === 'number' ? cfg.height : 240;
    var color = cfg.color || 'var(--primary)';
    var showTooltip = cfg.showTooltip !== false;
    var valueLabel = cfg.valueLabel || 'Value';
    var grid = K.buildHeatGrid(cfg.cells || []);
    var lo = typeof cfg.min === 'number' ? cfg.min : grid.min;
    var hi = typeof cfg.max === 'number' ? cfg.max : grid.max;
    var fmt = K.resolveFn(cfg.valueFormat) || function (v) { return String(Math.round(v * 100) / 100); };

    var svg = K.svg('svg', { height: height, role: 'img', 'aria-label': cfg.ariaLabel || 'Heatmap' });
    canvas.insertBefore(svg, canvas.firstChild);
    var tip = K.tooltip(canvas);
    var hover = null;
    var geo = null;
    var rects = [];

    function text(x, y, anchor, label) {
      var t = K.svg('text', { x: x, y: y, 'text-anchor': anchor, 'font-size': K.theme.fontSize.axis, fill: K.theme.axisText });
      t.textContent = label;
      return t;
    }

    function paintHover() {
      rects.forEach(function (r) { r.el.setAttribute('stroke', hover && hover.xi === r.i && hover.yi === r.j ? K.theme.crosshair : 'none'); });
      if (!showTooltip || !hover || !geo) { tip.hide(); return; }
      var v = grid.values[hover.yi] ? grid.values[hover.yi][hover.xi] : null;
      if (v === null || v === undefined) { tip.hide(); return; }
      tip.update(
        grid.ys[hover.yi] + ' · ' + grid.xs[hover.xi],
        [{ seriesId: 'v', seriesName: valueLabel, color: color, y: v, valueLabel: fmt(v) }],
        PAD.left + geo.cw * (hover.xi + 0.5), PAD.top + geo.ch * (hover.yi + 0.5), geo.width
      );
    }

    function draw(width) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      rects = [];
      svg.setAttribute('width', width);
      var plotW = Math.max(0, width - PAD.left - PAD.right);
      var plotH = Math.max(0, height - PAD.top - PAD.bottom);
      var cw = grid.xs.length ? plotW / grid.xs.length : 0;
      var ch = grid.ys.length ? plotH / grid.ys.length : 0;
      geo = { cw: cw, ch: ch, width: width };
      var xEvery = Math.max(1, Math.ceil(56 / Math.max(1, cw)));
      var yEvery = Math.max(1, Math.ceil(14 / Math.max(1, ch)));
      grid.ys.forEach(function (label, j) {
        if (j % yEvery === 0) svg.appendChild(text(PAD.left - 6, PAD.top + ch * (j + 0.5) + 4, 'end', label));
      });
      grid.xs.forEach(function (label, i) {
        if (i % xEvery === 0) svg.appendChild(text(PAD.left + cw * (i + 0.5), height - 8, 'middle', label));
      });
      grid.values.forEach(function (row, j) {
        row.forEach(function (v, i) {
          if (v === null) return;
          var r = K.svg('rect', {
            x: PAD.left + cw * i + 0.5, y: PAD.top + ch * j + 0.5,
            width: Math.max(0, cw - 1), height: Math.max(0, ch - 1), rx: 2,
            fill: color, 'fill-opacity': 0.08 + 0.92 * K.heatIntensity(v, lo, hi),
            stroke: 'none', 'stroke-width': 1.5,
          });
          r.addEventListener('mouseenter', function () { if (showTooltip) { hover = { xi: i, yi: j }; paintHover(); } });
          svg.appendChild(r);
          rects.push({ el: r, i: i, j: j });
        });
      });
      paintHover();
    }

    svg.addEventListener('mouseleave', function () { hover = null; paintHover(); });

    if (cfg.showLegend !== false) {
      var legend = document.createElement('div');
      legend.className = 'mt-2 flex items-center gap-2 text-xs text-text-secondary';
      legend.setAttribute('aria-hidden', 'true');
      var a = document.createElement('span'); a.className = 'tabular-nums'; a.textContent = fmt(lo);
      var bar = document.createElement('span'); bar.className = 'h-2 flex-1 rounded-full';
      bar.style.background = 'linear-gradient(to right, color-mix(in srgb, ' + color + ' 8%, transparent), ' + color + ')';
      var b = document.createElement('span'); b.className = 'tabular-nums'; b.textContent = fmt(hi);
      legend.appendChild(a); legend.appendChild(bar); legend.appendChild(b);
      host.appendChild(legend);
    }

    K.observeContainer(canvas, function (size) { if (size.width > 0) draw(size.width); });
  }

  K.renderers.heatmap = render;
})(typeof window !== 'undefined' ? window : globalThis);
