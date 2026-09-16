// themes.spec.ts — full-page visual regression of every theme landing
// page, per $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.3.
// Iterates the committed registry snapshot's themes[], so a new theme is
// covered the moment it's registered.
//
// Masking and the deterministic-fonts init script mirror
// showcase.spec.ts — see that file's header for why each one is there.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
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

test.describe('theme landing pages', () => {
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
    });
  }
});
