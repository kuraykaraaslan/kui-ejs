// showcase.spec.ts — visual regression over every showcase component page,
// per $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.3. Iterates the
// committed registry snapshot rather than hand-listing components, so a
// new component is covered the moment its showcase entry ships.
//
// One page load per component (not per variant) screenshotting every
// `[data-variant-block][data-variant-index]` container on it — ~207 page
// loads covering every variant, instead of one page load per variant.
//
// `video`, `canvas`, external-`img`, and `.leaflet-container` (MapView)
// elements are masked out — carried over from kui-react's equivalent spec,
// which found all of these flaking in a self-consistency run (itself
// against its own just-generated baselines): VideoPlayer's showcase demo
// streams a real remote video, so how much of a frame has decoded by
// screenshot time is a function of network timing; Charts.ejs (Chart.js,
// `<canvas>`) has a requestAnimationFrame-driven mount animation that
// CSS-animation disabling has no effect on; several showcase files use
// external photography (picsum.photos, pravatar); MapView's Leaflet tiles
// are externally-fetched `<img>`s that load asynchronously after mount.
// Masking proactively here instead of re-discovering each flake the slow
// way — which is exactly what happened for the two issues below, found
// despite the proactive masking above:
//
// A self-consistency run here (this suite against its own just-generated
// baselines) found three more real issues, unrelated to kui-react's:
//   - VideoPlayer.ejs wraps its <video> in extra chrome (a play-button
//     overlay, loading spinner, cast overlay) that lives outside the
//     <video> element itself and whose visibility genuinely depends on
//     whether the remote video's metadata loaded in time — masking only
//     `video` left that chrome flickering between runs. Masking the whole
//     `[aria-label^="Video:"]` wrapper covers all of it.
//   - `--font-mono`/`--font-sans` (public/assets/css/input.css) name
//     'Geist'/'Geist Mono' first, but this repo never actually loads that
//     font (no @font-face, no <link>) — every page silently falls back
//     through a long candidate list (ui-monospace, SFMono-Regular, Menlo,
//     Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace) to
//     whatever this Linux CI box happens to resolve first, and which one
//     "wins" isn't guaranteed stable, so code-panel text reflows to a
//     different line-wrap between runs. Forcing the browser's own generic
//     `monospace`/`sans-serif` keywords (unambiguous, zero fallback list)
//     via an init script sidesteps it without touching app code.
//   - Font Awesome (nearly every component uses `<i class="fa-solid ...">`)
//     loads from a CDN (views/partials/_head.ejs). Before that `@font-face`
//     finishes, icons render as a zero/fallback-width glyph; once it loads,
//     the icon snaps to its real glyph box and reflows whatever sits next
//     to or below it — a text-position flake unrelated to the Geist
//     fallback above, and specific to actual web-font network timing.
//     Explicitly awaiting `document.fonts.ready` (Playwright's own
//     screenshot stability wait covers CSS/layout settling, not this)
//     before each screenshot closes the race.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const components: { id: string; variantCount: number }[] = registry.components;
const MASK_SELECTOR = 'video, canvas, [aria-label^="Video:"], img[src^="http"], .leaflet-container';

const DETERMINISTIC_FONTS = `
  :root {
    --font-geist-sans: sans-serif !important;
    --font-geist-mono: monospace !important;
    --font-sans: sans-serif !important;
    --font-mono: monospace !important;
  }
`;

test.describe('showcase component variants', () => {
  for (const component of components) {
    test(component.id, async ({ page }) => {
      await page.addInitScript((css) => {
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style);
        });
      }, DETERMINISTIC_FONTS);
      await page.goto(`/${component.id}`);
      await page.evaluate(() => document.fonts.ready);

      const variantCount = component.variantCount ?? 0;
      for (let i = 0; i < variantCount; i++) {
        const variant = page.locator(`[data-variant-index="${i}"]`);
        await expect(variant).toBeVisible();
        await expect(variant).toHaveScreenshot(`${component.id}-${i}.png`, {
          mask: [variant.locator(MASK_SELECTOR)],
        });
      }
    });
  }
});
