// themes.spec.ts — full-page visual regression of every theme landing
// page, per $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.3.
// Iterates the committed registry snapshot's themes[], so a new theme is
// covered the moment it's registered.
//
// Masking and the deterministic-fonts init script mirror
// showcase.spec.ts — see that file's header for why each one is there.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const themes: { id: string; route: string }[] = registry.themes;
const MASK_SELECTOR = 'video, canvas, [aria-label^="Video:"], img[src^="http"], .leaflet-container';

const DETERMINISTIC_FONTS = `
  :root {
    --font-geist-sans: sans-serif !important;
    --font-geist-mono: monospace !important;
    --font-sans: sans-serif !important;
    --font-mono: monospace !important;
  }
`;

// axe-core scan runs after the screenshot assertion, mirroring
// showcase.spec.ts — see that file's header for why color-contrast is
// the one ratcheted rule here (the same design-token-level gaps show up
// on full theme pages, just without the component-specific issues that
// file also ratchets, since none of those components' broken states
// surface on these landing pages).
test.describe('theme landing pages', () => {
  const RATCHETED_RULES = ['color-contrast'];
  const ratchetedViolationCounts: Record<string, number> = Object.fromEntries(
    RATCHETED_RULES.map((id) => [id, 0]),
  );

  // See showcase.spec.ts's own AXE_OUT_DIR comment — same reasoning, one
  // directory shared between both spec files.
  const AXE_OUT_DIR = path.join(REPO_ROOT, 'test-results/axe');
  function writeAxeFailure(id: string, violations: unknown) {
    mkdirSync(AXE_OUT_DIR, { recursive: true });
    writeFileSync(path.join(AXE_OUT_DIR, `theme-${id}.json`), JSON.stringify(violations, null, 2));
  }

  for (const theme of themes) {
    test(theme.id, async ({ page }) => {
      await page.addInitScript((css) => {
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style);
        });
      }, DETERMINISTIC_FONTS);
      await page.goto(theme.route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${theme.id}.png`, {
        fullPage: true,
        mask: [page.locator(MASK_SELECTOR)],
      });

      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

      for (const rule of RATCHETED_RULES) {
        ratchetedViolationCounts[rule] += bad
          .filter((v) => v.id === rule)
          .reduce((sum, v) => sum + v.nodes.length, 0);
      }

      const strict = bad.filter((v) => !RATCHETED_RULES.includes(v.id));
      if (strict.length > 0) writeAxeFailure(theme.id, strict);
      const details = strict
        .map((v) => `  [${v.impact}] ${v.id} (${v.nodes.length} nodes) — ${v.help}`)
        .join('\n');
      expect(strict, `axe found serious/critical violations on ${theme.route}:\n${details}`).toHaveLength(0);
    });
  }

  test('does not regress past the ratcheted a11y baselines', () => {
    const BASELINES: Record<string, number> = {
      'color-contrast': 160,
    };
    for (const rule of RATCHETED_RULES) {
      expect(
        ratchetedViolationCounts[rule],
        `${rule}: ${ratchetedViolationCounts[rule]} > baseline ${BASELINES[rule]}`,
      ).toBeLessThanOrEqual(BASELINES[rule]);
    }
  });
});
