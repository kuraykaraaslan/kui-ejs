// html-validate.test.ts — run html-validate over the same page bodies
// tests/routes.smoke.test.ts already requests, per phase-2-testing.md
// section 2.2: "html-validate over the smoke-test bodies. Start with rules:
// unique ids, label has a control, img has alt, no duplicate main, valid
// nesting. Tailwind class soup is fine for it."
//
// Deliberately `extends: []` with only these five rules turned on, rather
// than html-validate's full "recommended" preset — this repo's markup
// leans on long Tailwind utility-class strings and demo-only attribute
// patterns that a general preset would flag without being a real defect.
// The five rules below are structural/accessibility correctness checks
// that are never legitimately violated by Tailwind class soup.
//
// Uses the plain `HtmlValidate` class directly rather than the first-party
// `html-validate/vitest` matcher (`toHTMLValidate`): that matcher proxies
// each call through a worker thread via `Atomics.wait()`, which hung this
// suite for two hours straight (every one of 246 cases failed with
// "Atomics.wait() failed: timed-out", plus an unrelated worker
// DataCloneError trying to structured-clone a rule's `fix` callback) rather
// than actually validating anything. `validateString()` is a plain async
// method with no worker involved and runs the same 246 pages in seconds.
//
// This test found and fixed several real bugs, all now shipped:
//   - views/showcase/partials/source-block.ejs and .../widget.ejs displayed
//     a component's source/variant code with raw, unescaped output
//     (`<%- ... %>`) inside <pre><code>, so any `<`/`>`/`<%` in the source
//     text (i.e. nearly every EJS component) broke the surrounding page's
//     real DOM structure. Fixed to auto-escaping output (`<%= ... %>`).
//   - src/data/sections/ui-organism-content-score-bar.showcase.ts built a
//     `title` attribute via raw string interpolation of a hint string that
//     legitimately contains `"` characters, breaking the attribute value.
//   - The api-doc/modem/invoice/ups theme layouts each nested their own
//     `<main>` (opened in `_nav.ejs`, closed in the page or `_nav-close.ejs`)
//     inside `layouts/blank.ejs`'s own `<main id="main-content">` — two
//     landmarks (api-doc's literally sharing the same id). Changed the inner
//     one to a plain `<div>`; the layout already owns the one real `<main>`.
//   - modules/ui/Toggle.ejs had no way to give a label-less toggle (a
//     documented, showcased usage pattern) an accessible name. Added
//     `ariaLabel` support, applied to the <input> when there's no visible
//     `label`.
//
// `input-missing-label` still has real, pre-existing debt across many
// app/domain components (search bars, filter bars, modals, forms — see
// INPUT_MISSING_LABEL_BASELINE below) that's too broad to fix in one pass;
// ratcheted like modules/registry/registry.test.ts's abbr/variant counts so
// it can only shrink, not regress, while a dedicated a11y pass is pending.

import { describe, it, expect, beforeAll } from 'vitest';
import { HtmlValidate, type ConfigData } from 'html-validate';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import app from '../src/app';

const REPO_ROOT = path.resolve(__dirname, '..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.json'), 'utf8')
);

const showcaseSlugs: string[] = registry.components.map((c: { id: string }) => c.id);
const themeRoutes: string[] = registry.themes.map((t: { route: string }) => t.route);

const commonThemeSrc = readFileSync(path.join(REPO_ROOT, 'src/routes/themes/common.ts'), 'utf8');
const emailRoutes: string[] = [
  ...commonThemeSrc.matchAll(/router\.get\('(\/email\/[^']+)'/g),
].map((m) => `/theme/common${m[1]}`);

const allRoutes: string[] = [
  '/',
  ...themeRoutes,
  ...showcaseSlugs.map((slug) => `/${slug}`),
  ...emailRoutes,
];

// Rules that are fully clean today — any violation is a hard regression.
const STRICT_RULES = ['no-dup-id', 'wcag/h37', 'no-multiple-main', 'close-order'];
// Pre-existing, ratcheted — see the file header note above.
const RATCHETED_RULE = 'input-missing-label';

const config: ConfigData = {
  extends: [],
  rules: {
    'no-dup-id': 'error',
    'input-missing-label': 'error',
    'wcag/h37': 'error',
    'no-multiple-main': 'error',
    'close-order': 'error',
  },
};

const INPUT_MISSING_LABEL_BASELINE = 62;

let htmlvalidate: HtmlValidate;
let ratchetedViolationCount = 0;

beforeAll(() => {
  htmlvalidate = new HtmlValidate(config);
});

describe('html-validate over every rendered page', () => {
  it('found at least 240 routes to validate (regression guard on the route scan itself)', () => {
    expect(allRoutes.length).toBeGreaterThanOrEqual(240);
  });

  it.each(allRoutes)('%s passes the strict rule set', async (route) => {
    const res = await request(app).get(route);
    expect(res.status, `GET ${route} -> ${res.status}`).toBe(200);

    const report = await htmlvalidate.validateString(res.text, route);
    const messages = report.results.flatMap((r) => r.messages);

    ratchetedViolationCount += messages.filter((m) => m.ruleId === RATCHETED_RULE).length;

    const strictViolations = messages.filter((m) => STRICT_RULES.includes(m.ruleId));
    const details = strictViolations
      .map((m) => `  ${route}:${m.line}:${m.column} [${m.ruleId}] ${m.message}`)
      .join('\n');
    expect(strictViolations, `GET ${route} had html-validate errors:\n${details}`).toHaveLength(0);
  });

  it(`does not regress past the ${RATCHETED_RULE} baseline (${INPUT_MISSING_LABEL_BASELINE})`, () => {
    expect(ratchetedViolationCount).toBeLessThanOrEqual(INPUT_MISSING_LABEL_BASELINE);
  });
});
