import { defineConfig, devices } from '@playwright/test';

// Visual regression config, per $KUIREACT_ROOT/docs/dev/phase-2-testing.md
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
  // $KUIREACT_ROOT/docs/dev/phase-2-testing.md 2.5 — CI uploads
  // playwright-report/ and test-results/ as artifacts on failure, so a
  // nightly/PR failure is debuggable without rerunning.
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
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
