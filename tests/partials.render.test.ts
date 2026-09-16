// partials.render.test.ts — render every modules/**/*.ejs component the
// registry knows about through ejs.renderFile with empty locals ({}).
// Per $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.2: "render each
// modules/**/*.ejs through ejs.renderFile with the default locals from its
// showcase entry's first variant. Catches undefined-local crashes that only
// surface on a rarely visited page."
//
// Every modules/** component is written to the `locals.x || default`
// defensive-default convention (see AGENTS.md), so rendering with {} is a
// direct test of that contract, not a fabricated test scenario.
//
// Scope: only the modules/** entries. The registry's other 31 entries are
// views/theme/common/email/**, which are real page templates rendered via
// route handlers that build specific locals with the `emailCtx()` helper
// (src/routes/themes/common.ts) — {} is not a locals shape those templates
// are meant to tolerate. They're covered instead by the "common theme email
// sub-routes" block in tests/routes.smoke.test.ts, which requests each one
// through the real route and its real locals.
//
// This test previously caught three real bugs, since fixed:
//   - modules/app/FormField.ejs: a doc comment's own prose contained the
//     literal `%>` sequence, which EJS's raw-substring tokenizer treated as
//     closing the scriptlet early, silently turning the real `var`
//     declarations below into literal output text.
//   - modules/ui/DateRangePicker.ejs: `include('modules/ui/DatePicker/...')`
//     used a bare module-style path with no root/views resolution actually
//     configured for it; every other include in the codebase is
//     file-relative. Fixed to `./DatePicker/DateRangePicker`.
//   - modules/ui/TreeView/TreeView.ejs: two script includes
//     (`./scripts/tree-state`, `./scripts/keyboard`) were missing the
//     required `.js` extension EJS needs to avoid auto-appending `.ejs`.

import { describe, it, expect } from 'vitest';
import ejs from 'ejs';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.json'), 'utf8')
);

const componentFilePaths: string[] = registry.components
  .map((c: { filePath: string }) => c.filePath)
  .filter((p: string) => p.startsWith('modules/'));

describe('modules/** component partials render with empty locals', () => {
  it('found at least 150 modules/** components to test (regression guard on the scan itself)', () => {
    expect(componentFilePaths.length).toBeGreaterThanOrEqual(150);
  });

  it.each(componentFilePaths)('%s renders without throwing', async (filePath) => {
    const absPath = path.join(REPO_ROOT, filePath);
    const html = await ejs.renderFile(absPath, {});
    // A handful of components (e.g. ParameterTable, CodeSamplePanel,
    // ServerSelector) intentionally `return;` early and render nothing when
    // given no data — that's `undefined`, not a crash, and is a legitimate
    // "empty state" contract for those components. What this test actually
    // guards against is an unhandled throw (undefined-local crash), so
    // accept either outcome rather than requiring non-empty output.
    expect(['undefined', 'string']).toContain(typeof html);
  });
});
