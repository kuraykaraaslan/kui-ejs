/* ── TODO M3 — FormRenderer conditional-logic evaluator ────────────────
 *
 * Planned rule shape (mirrors React useLogicEval.ts):
 *   { op: 'show'|'hide'|'skip-page', target, when: { field, eq } }
 *
 * Implementation note: no eval / Function — walk a small AST emitted by the
 * visual editor (LogicEditor.ejs / .tsx in M3).
 *
 * For M1 every field is always visible; this file is a no-op stub.
 */
function evaluateVisibility() { return {}; }
