// chart-render.spec.ts — DOM checks for the client-side chart renderers
// (modules/ui/Chart/scripts/series.js, bar.js, pie.js, heatmap.js), the cases
// kui-react's Chart.test.tsx pins for the same settings. Runs on the showcase
// pages (`npm run test:visual`); extra charts are mounted in the page through
// KuiChart.autoInit() with a config, the same way Chart.ejs mounts them.

import { test, expect, type Page } from '@playwright/test';

type Cfg = Record<string, unknown>;

/** Mount a chart of `kind` with `cfg` in the page (the renderers are already loaded there). */
async function mount(page: Page, id: string, kind: string, cfg: Cfg, legendPosition = 'bottom') {
  await page.evaluate(({ id, kind, cfg, legendPosition }) => {
    const host = document.createElement('div');
    host.setAttribute('data-kui-chart', id);
    host.setAttribute('data-kui-chart-kind', kind);
    host.setAttribute('data-kui-chart-config', JSON.stringify(cfg));
    host.className = legendPosition === 'right' ? 'flex w-full flex-row gap-4 items-center' : 'flex w-full flex-col';
    host.style.width = '480px';
    host.innerHTML = '<div data-kui-chart-plot class="min-w-0 flex-1"><div data-kui-chart-canvas class="relative w-full" style="height: 240px;"></div></div>';
    document.body.prepend(host);
    (window as unknown as { KuiChart: { autoInit: () => void } }).KuiChart.autoInit();
  }, { id, kind, cfg, legendPosition });
  return page.locator(`[data-kui-chart="${id}"]`);
}

const cats = [
  { id: 'a', name: 'A', data: [{ x: 'Mon', y: 1 }, { x: 'Tue', y: 3 }, { x: 'Wed', y: 2 }] },
  { id: 'b', name: 'B', data: [{ x: 'Mon', y: 2 }, { x: 'Tue', y: 1 }, { x: 'Wed', y: 4 }] },
];

test.describe('chart renderers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chart');
    await page.waitForFunction(() => !!(window as unknown as { KuiChart?: { renderers: Record<string, unknown> } }).KuiChart?.renderers.pie);
  });

  test('value axes stop at round bounds; crowded category labels are thinned', async ({ page }) => {
    const right = page.locator('[data-kui-chart="ch-demo-right"]');
    const left = await right.locator('svg g text[text-anchor="end"]').allTextContents();
    expect(left).toEqual(['0', '100', '200', '300', '400']);
    const daily = page.locator('[data-kui-chart="ch-demo-daily"]');
    const shown = (await daily.locator('svg g text[text-anchor="middle"]').allTextContents()).filter(Boolean);
    expect(shown.length).toBeGreaterThan(2);
    expect(shown.length).toBeLessThan(30);
  });

  test('right axis: its own ticks on the left grid, a title and a threshold', async ({ page }) => {
    const right = page.locator('[data-kui-chart="ch-demo-right"]');
    const r = await right.locator('svg g text[text-anchor="start"]').allTextContents();
    expect(r).toHaveLength(5);
    expect(r[0]).toBe('0');
    await expect(right.locator('text', { hasText: '°C' })).toHaveCount(1);
    await expect(right.locator('[data-threshold="320"] line')).toHaveCount(1);
    await expect(right.locator('path[data-point]')).toHaveCount(14);
    await expect(right.locator('path[data-line]').nth(1)).toHaveAttribute('stroke-dasharray', '6 4');
  });

  test('gradient area fill, value labels and dotted grid', async ({ page }) => {
    const g = page.locator('[data-kui-chart="ch-demo-gradient"]');
    await expect(g.locator('linearGradient')).toHaveCount(1);
    await expect(g.locator('path[data-area]')).toHaveAttribute('data-fill', 'gradient');
    expect(await g.locator('[data-value-label]').count()).toBeGreaterThan(0);
    await expect(g.locator('[data-grid="dotted"]')).toHaveCount(1);
    await expect(g.locator('[data-kui-chart-legend]')).toHaveCount(0);
  });

  test('grouped stacks, a stacked tooltip total, markers and horizontal value labels', async ({ page }) => {
    const groups = page.locator('[data-kui-chart="ch-demo-groups"]');
    const xs = await groups.locator('g[data-series] path[data-bar]').evaluateAll((els) => els.map((e) => e.getAttribute('data-x')));
    expect(new Set(xs).size).toBe(8); // 4 quarters x 2 slots (North stack, South)
    const svg = groups.locator('svg[role="img"]');
    await svg.scrollIntoViewIfNeeded();
    const box = (await svg.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
    await expect(groups.locator('[data-tooltip-total]')).toContainText('Total');
    await expect(page.locator('[data-kui-chart="ch-demo-hist"] [data-marker="Mean 210 ms"] line')).toHaveCount(1);
    const h = page.locator('[data-kui-chart="ch-demo-horizontal"]');
    expect(await h.locator('[data-value-label]').allTextContents()).toEqual(['38', '27', '14', '11', '10']);
  });

  test('pie outside labels with a grid legend; donut centre caption', async ({ page }) => {
    const pie = page.locator('[data-kui-chart="ch-demo-pie-labels"]');
    await expect(pie.locator('polyline')).toHaveCount(5);
    await expect(pie.locator('[data-kui-chart-legend]')).toHaveClass(/grid/);
    const donut = page.locator('[data-kui-chart="ch-demo-donut-center"]');
    await expect(donut.locator('[data-center]')).toHaveText('100');
    await expect(donut.locator('text', { hasText: 'Total' })).toHaveCount(1);
    await expect(donut.locator('[data-kui-chart-legend]')).toContainText('35%');
  });

  test('a hidden series is toggled from the legend', async ({ page }) => {
    const host = await mount(page, 't-toggle', 'series', { variant: 'line', mode: 'band', series: [cats[0], { ...cats[1], hidden: true }] });
    await expect(host.locator('path[data-line]')).toHaveCount(1);
    const b = host.getByRole('button', { name: 'B' });
    await expect(b).toHaveAttribute('aria-pressed', 'false');
    await b.click();
    await expect(host.locator('path[data-line]')).toHaveCount(2);
    await expect(host.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('per-series stroke style, width, points, step curve; legend values on top', async ({ page }) => {
    await page.evaluate(() => { (window as unknown as Record<string, unknown>).tFmtU = (v: number) => `${v} u`; });
    const styled = [{ ...cats[0], lineStyle: 'dashed', strokeWidth: 5, showPoints: true }, cats[1]];
    const host = await mount(page, 't-style', 'series', {
      variant: 'line', mode: 'band', series: styled, curve: 'step', legendPosition: 'top', legendValues: ['latest', 'max'], yFormat: 'tFmtU',
    });
    const lines = host.locator('path[data-line]');
    await expect(lines.nth(0)).toHaveAttribute('stroke-dasharray', '15 10');
    await expect(lines.nth(0)).toHaveAttribute('stroke-width', '5');
    expect(await lines.nth(0).getAttribute('d')).toContain('H');
    await expect(host.locator('g[data-series="a"] circle[data-point]')).toHaveCount(3);
    expect(await host.evaluate((el) => el.firstElementChild?.tagName)).toBe('UL');
    await expect(host.getByText('2 u · max 3 u')).toBeVisible();
  });

  test('bar: hidden axis labels, category ticks, end-rounded paths', async ({ page }) => {
    const host = await mount(page, 't-bar', 'bar', {
      series: [cats[0]], categoryTicks: [{ at: 0, label: 'E0' }, { at: 3, label: 'E3' }], showYAxis: false,
    });
    await expect(host.getByText('E0')).toHaveCount(1);
    await expect(host.getByText('Mon')).toHaveCount(0);
    expect(await host.locator('path[data-bar]').first().getAttribute('d')).toMatch(/Q/);
    await expect(host.locator('svg text[text-anchor="end"]')).toHaveCount(0);
  });
});

test.describe('heatmap renderer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/heatmap-chart');
    await page.waitForFunction(() => !!(window as unknown as { KuiChart?: { renderers: Record<string, unknown> } }).KuiChart?.renderers.heatmap);
  });

  test('two-colour scale, value label colour follows the cell, legend on the right', async ({ page }) => {
    const host = await mount(page, 't-heat', 'heatmap', {
      cells: [{ x: 'a', y: '1', value: 0 }, { x: 'b', y: '1', value: 10 }], color: '#ff0000', colorLow: '#0000ff', showValues: true, legendPosition: 'right',
    }, 'right');
    expect(await host.locator('rect').first().getAttribute('fill')).toContain('color-mix');
    const labels = host.locator('[data-cell-label]');
    await expect(labels.nth(0)).toHaveAttribute('fill', 'var(--text-primary)');
    await expect(labels.nth(1)).toHaveAttribute('fill', 'var(--surface-base)');
    expect(await host.evaluate((el) => el.lastElementChild?.getAttribute('data-heat-legend'))).toBe('scale');
  });
});
