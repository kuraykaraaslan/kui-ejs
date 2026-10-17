import { defineConfig, devices } from '@playwright/test';

// Visual regression config, per $KUIREACT_ROOT/docs/phases/02-testing.md
// section 2.3 (shared plan, both repos). Runs against a real build
// (`npm run build && npm run start`), not the nodemon/tsx dev server, so
// the ~213 page visits (207 components + 6 themes) hit a stable compiled
// server instead of paying a recompile/restart tax mid-run.
//
// Only one project (Desktop / light) is wired up for now, mirroring
// kui-react's config — doubling to a dark and/or 400px mobile project is
// real coverage the plan calls for, but doubles or quadruples the
// committed screenshot baseline size per addition. Deliberately deferred
// so the first baseline commit stays small enough to actually review.
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  // CI gets an HTML report (browsable trace viewer) alongside the
  // terminal list; local runs stay list-only. See
  // $KUIREACT_ROOT/docs/phases/02-testing.md 2.5 — CI uploads
  // playwright-report/ and test-results/ as artifacts on failure, so a
  // nightly/PR failure is debuggable without rerunning.
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  // Comparison tolerances. The defaults (threshold 0.2, maxDiffPixelRatio
  // 0.02) let real regressions through: a swapped primary colour (blue
  // #3b82f6 vs purple #8b5cf6, close in luminance) is below a 0.2 per-pixel
  // YIQ threshold, and a misplaced pale panel or a recoloured button stays
  // under 2% of the image. Measured on this suite (2026-10-17):
  //   - two consecutive full renders were pixel-identical (0 pixels differ
  //     even at threshold 0.02), so there is no run-to-run noise to absorb;
  //   - at threshold 0.1 the smallest real regressions found change 0.11%
  //     (card-5, a recoloured "Live" pill) to 2.6% (notification-menu-0,
  //     the panel opened at the bottom) of their image.
  // threshold 0.1 counts the colour swap; maxDiffPixelRatio 0.0005 (0.05%)
  // fails the smallest of those with a 2x margin and still leaves a little
  // room for anti-aliasing drift from a Chromium update. If a browser or
  // font update moves many baselines at once, regenerate them rather than
  // loosening these.
  expect: {
    toHaveScreenshot: { threshold: 0.1, maxDiffPixelRatio: 0.0005 },
  },
  use: {
    baseURL: 'http://localhost:3003',
    // Retries are what 'on-first-retry' needs to ever produce a trace —
    // outside CI there are none, so no trace ever gets written for a
    // local failure investigated in the same run. CI always wants a
    // trace on every failed attempt, retried or not.
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, colorScheme: 'light' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
