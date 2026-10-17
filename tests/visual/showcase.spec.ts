// showcase.spec.ts — visual regression over every showcase component page,
// per $KUIREACT_ROOT/docs/phases/02-testing.md section 2.3. Iterates the
// committed registry snapshot rather than hand-listing components, so a
// new component is covered the moment its showcase entry ships.
//
// One page load per component (not per variant) screenshotting every
// `[data-variant-block][data-variant-index]` container on it — ~207 page
// loads covering every variant, instead of one page load per variant.
// Pages load with ?layout=variant, so every variant uses the layout it declares.
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
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const components: { id: string; variantCount: number }[] = registry.components;
// Leaflet's own tiles and marker images are left out of the img mask: their boxes reach far past the
// map they are clipped to, so masking them painted over neighbouring content (a variant's title, the
// code panel). The .leaflet-container mask already covers the map.
const MASK_SELECTOR = 'video, canvas, [aria-label^="Video:"], img[src^="http"]:not([class*="leaflet-"]), .leaflet-container';

const DETERMINISTIC_FONTS = `
  :root {
    --font-geist-sans: sans-serif !important;
    --font-geist-mono: monospace !important;
    --font-sans: sans-serif !important;
    --font-mono: monospace !important;
  }
`;

// The showcase page scrolls inside <main> (an h-screen shell with overflow hidden), so a variant
// taller than that scroller was captured only as far as the scroller showed it: the rest came out
// white, and the sticky top bar could sit over the variant's title. For the screenshots the page
// grows to its content and the top bar stays in the flow, so every variant is captured whole.
// Widths do not change (headless Chromium draws no scrollbars).
const WHOLE_PAGE = `
  body { overflow: visible !important; }
  .h-screen { height: auto !important; min-height: 100vh; overflow: visible !important; }
  #main-content { overflow: visible !important; }
  header.sticky { position: static !important; }
`;

// axe-core scan runs after the screenshot assertions on the same page load —
// per $KUIREACT_ROOT/docs/phases/02-testing.md section 2.4. Four rule
// categories are ratcheted (not force-fixed) rather than blocking every
// showcase page on them:
//   - color-contrast: a design-token-level decision (--text-secondary on
//     --surface-sunken-ish backgrounds sits under WCAG AA's 4.5:1 for
//     normal text in several places), not a per-component code bug.
//   - aria-command-name (25 nodes, 2 pages): MapView's Leaflet markers
//     use `L.divIcon()` (a custom inline-SVG pin), not `L.icon()` — only
//     the latter accepts Leaflet's `alt` option and renders an `<img>`
//     `alt` actually applies to; and RichTextEditor's Quill toolbar
//     renders its own `<span class="ql-picker-label" role="button">`
//     unlabeled pickers — both are third-party-library-owned markup.
//   - aria-prohibited-attr (21 nodes, 1 page): same Quill toolbar —
//     `<span class="ql-header ql-picker" aria-label="...">` has no role
//     Quill's own runtime assigns, so the fix would mean patching
//     Quill's rendered DOM after the fact, not this codebase's markup.
//   - aria-required-children (1 node, 1 page): MentionPicker's "no
//     matching users" empty state keeps `role="listbox"` on the panel
//     while it has zero `option`/`group` children — the tension between
//     "the empty state must say something" and "a listbox must own an
//     option" has no clean single-node fix.
test.describe('showcase component variants', () => {
  const RATCHETED_RULES = [
    'color-contrast',
    'aria-command-name',
    'aria-prohibited-attr',
    'aria-required-children',
  ];
  const ratchetedViolationCounts: Record<string, number> = Object.fromEntries(
    RATCHETED_RULES.map((id) => [id, 0]),
  );

  // Written only when a page actually fails the strict check below, so
  // CI ($KUIREACT_ROOT/docs/phases/02-testing.md 2.5) has the full axe
  // payload — not just the truncated one-line-per-rule summary in the
  // assertion message — to upload as an artifact.
  const AXE_OUT_DIR = path.join(REPO_ROOT, 'test-results/axe');
  function writeAxeFailure(id: string, violations: unknown) {
    mkdirSync(AXE_OUT_DIR, { recursive: true });
    writeFileSync(path.join(AXE_OUT_DIR, `${id}.json`), JSON.stringify(violations, null, 2));
  }

  for (const component of components) {
    test(component.id, async ({ page }) => {
      await page.addInitScript(([fonts, whole]) => {
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.textContent = fonts;
          document.head.appendChild(style);
          const shell = document.createElement('style');
          shell.id = 'visual-whole-page';
          shell.textContent = whole;
          document.head.appendChild(shell);
        });
      }, [DETERMINISTIC_FONTS, WHOLE_PAGE]);
      // ?layout=variant: each variant in the layout it declares, so a `layout: 'stack'` variant (a wide
      // table, a toolbar) is screenshotted full width instead of squeezed beside its code panel.
      await page.goto(`/${component.id}?layout=variant`);
      await page.evaluate(() => document.fonts.ready);

      const variantCount = component.variantCount ?? 0;
      for (let i = 0; i < variantCount; i++) {
        const variant = page.locator(`[data-variant-index="${i}"]`);
        await expect(variant).toBeVisible();
        await expect(variant).toHaveScreenshot(`${component.id}-${i}.png`, {
          mask: [variant.locator(MASK_SELECTOR)],
        });
      }

      // axe runs on the page as users get it (scrolling inside <main>), so its counts stay comparable
      // with the ratcheted baselines: content the scroller hides is not checked for contrast.
      await page.evaluate(() => document.getElementById('visual-whole-page')?.remove());
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

      for (const rule of RATCHETED_RULES) {
        ratchetedViolationCounts[rule] += bad
          .filter((v) => v.id === rule)
          .reduce((sum, v) => sum + v.nodes.length, 0);
      }

      const strict = bad.filter((v) => !RATCHETED_RULES.includes(v.id));
      if (strict.length > 0) writeAxeFailure(component.id, strict);
      const details = strict
        .map((v) => `  [${v.impact}] ${v.id} (${v.nodes.length} nodes) — ${v.help}`)
        .join('\n');
      expect(strict, `axe found serious/critical violations on /${component.id}:\n${details}`).toHaveLength(0);
    });
  }

  test('does not regress past the ratcheted a11y baselines', () => {
    const BASELINES: Record<string, number> = {
      'color-contrast': 5100,
      'aria-command-name': 35,
      'aria-prohibited-attr': 30,
      'aria-required-children': 5,
    };
    for (const rule of RATCHETED_RULES) {
      expect(
        ratchetedViolationCounts[rule],
        `${rule}: ${ratchetedViolationCounts[rule]} > baseline ${BASELINES[rule]}`,
      ).toBeLessThanOrEqual(BASELINES[rule]);
    }
  });
});
