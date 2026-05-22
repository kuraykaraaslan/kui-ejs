import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/ContentScoreBar.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Tier = 'great' | 'ok' | 'poor';
type TierStyles = { bar: string; text: string; bg: string; border: string; dot: string; label: string };

const TIER_MAP: Record<Tier, TierStyles> = {
  great: { bar: 'bg-success', text: 'text-success-fg', bg: 'bg-success-subtle', border: 'border-success', dot: 'bg-success', label: 'Good' },
  ok:    { bar: 'bg-warning', text: 'text-warning-fg', bg: 'bg-warning-subtle', border: 'border-warning', dot: 'bg-warning', label: 'Fair' },
  poor:  { bar: 'bg-error',   text: 'text-error-fg',   bg: 'bg-error-subtle',   border: 'border-error',   dot: 'bg-error',   label: 'Poor' },
};

function tierFor(score: number): Tier {
  if (score >= 70) return 'great';
  if (score >= 40) return 'ok';
  return 'poor';
}

type Result = { label: string; pass: boolean; hint?: string };

function contentScoreBarEl(opts: { score: number; results: Result[]; label?: string }) {
  const score = Math.max(0, Math.min(100, Math.round(opts.score)));
  const t = TIER_MAP[tierFor(score)];
  const passCount = opts.results.filter(r => r.pass).length;
  const ariaText = `${opts.label || 'Content score'}: ${score}%`;

  const labelHtml = opts.label
    ? `<span class="text-xs font-semibold text-text-secondary uppercase tracking-wider">${opts.label}</span>`
    : '';

  const pills = opts.results.length === 0 ? '' : `<div class="flex flex-wrap gap-1">${
    opts.results.map(r => {
      const pillClass = r.pass
        ? `${t.bg} ${t.text} border ${t.border}`
        : 'bg-surface-sunken text-text-disabled border border-border';
      const titleAttr = r.hint ? ` title="${r.hint}"` : '';
      const check = r.pass
        ? `<span class="w-2.5 h-2.5 inline-flex items-center justify-center" aria-hidden="true"><i class="fa-solid fa-check" style="font-size:10px"></i></span>`
        : '';
      return `<span${titleAttr} class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-default select-none transition-colors ${pillClass}">${check}${r.label}</span>`;
    }).join('')
  }</div>
  <p class="text-xs text-text-secondary leading-none">${passCount} / ${opts.results.length} rules passed</p>`;

  return `<div class="rounded-lg border p-3 space-y-2 transition-colors duration-300 ${t.bg} ${t.border}" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100" aria-label="${ariaText}">
    <div class="flex items-center gap-2">
      <span class="inline-block h-1.5 w-1.5 rounded-full shrink-0 ${t.dot}" aria-hidden="true"></span>
      ${labelHtml}
      <div class="ml-auto flex items-center gap-1.5">
        <span class="text-xs font-medium ${t.text}">${t.label}</span>
        <span class="text-sm font-bold tabular-nums leading-none ${t.text}" aria-label="${ariaText}">${score}%</span>
      </div>
    </div>
    <div class="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
      <div class="h-full rounded-full transition-all duration-500 ease-out ${t.bar}" style="width: ${score}%"></div>
    </div>
    ${pills}
  </div>`;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function buildContentScoreBarData(): ShowcaseItem[] {
  // Mirrors NextJS "Live evaluation" — value: "Build with Next.js and TypeScript",
  // 5 rules at 20pt each. Server-rendered with the precomputed evaluation.
  const LIVE_VALUE = 'Build with Next.js and TypeScript';
  const LIVE_RESULTS: Result[] = [
    { label: 'Min 20 chars',  pass: LIVE_VALUE.length >= 20 },
    { label: 'Has number',    pass: /\d/.test(LIVE_VALUE) },
    { label: 'Has uppercase', pass: /[A-Z]/.test(LIVE_VALUE) },
    { label: 'Has keyword',   pass: /next|react|typescript/i.test(LIVE_VALUE), hint: 'Include "Next", "React", or "TypeScript"' },
    { label: 'Min 5 words',   pass: LIVE_VALUE.trim().split(/\s+/).filter(Boolean).length >= 5 },
  ];
  const liveScore = Math.round((LIVE_RESULTS.filter(r => r.pass).length / LIVE_RESULTS.length) * 100);

  const fakeResults = (pass: number, total: number): Result[] =>
    Array.from({ length: total }, (_, i) => ({ label: `Rule ${i + 1}`, pass: i < pass }));

  const PWD_VALUE = 'Hello1';
  const PWD_RESULTS: Result[] = [
    { label: 'Min 8 chars',  pass: PWD_VALUE.length >= 8 },
    { label: 'Uppercase',    pass: /[A-Z]/.test(PWD_VALUE) },
    { label: 'Number',       pass: /\d/.test(PWD_VALUE) },
    { label: 'Special char', pass: /[^A-Za-z0-9]/.test(PWD_VALUE) },
  ];
  const pwdScore = Math.round((PWD_RESULTS.filter(r => r.pass).length / PWD_RESULTS.length) * 100);

  // Static input + ContentScoreBar pair (mirrors NextJS Textarea/Input + bar layout).
  const liveInputHtml = `<div class="w-full max-w-sm space-y-2">
  <label for="sc-csb-input" class="block text-sm font-medium text-text-primary">Content</label>
  <textarea id="sc-csb-input" rows="2" class="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus" placeholder="Type your content…">${LIVE_VALUE}</textarea>
  ${contentScoreBarEl({ score: liveScore, results: LIVE_RESULTS, label: 'Quality score' })}
</div>`;

  const pwdInputHtml = `<div class="w-full max-w-sm space-y-2">
  <input type="password" value="${PWD_VALUE}" placeholder="Enter password…" class="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus" />
  ${contentScoreBarEl({ score: pwdScore, results: PWD_RESULTS, label: 'Password strength' })}
</div>`;

  return [
    {
      id: 'content-score-bar',
      title: 'ContentScoreBar',
      category: 'Organism',
      abbr: 'Cs',
      description: 'Rule-based content quality score with Good ≥70 / Fair ≥40 / Poor <40 tier system. Each rule shown as a chip with passed/total count. role="progressbar" + aria-valuenow.',
      filePath: 'modules/ui/ContentScoreBar.ejs',
      sourceCode,
      variants: [
        {
          title: 'Live evaluation',
          previewHtml: `<div class="p-4 w-full">${liveInputHtml}</div>`,
          code: `<%# Evaluate rules in your Express route, then pass score + results. %>
<%
  // const value   = req.body.content || '';
  // const rules   = [
  //   { label: 'Min 20 chars', check: function (v) { return v.length >= 20; }, points: 20 },
  //   { label: 'Has keyword',  check: function (v) { return /react/i.test(v); }, points: 20, hint: 'Include "React"' },
  //   // ...
  // ];
  // let earned = 0, total = 0;
  // const results = rules.map(function (r) {
  //   const pass = r.check(value); if (pass) earned += r.points; total += r.points;
  //   return { label: r.label, pass: pass, hint: r.hint };
  // });
  // const score = total > 0 ? Math.round((earned / total) * 100) : 0;
%>
<%- include('modules/ui/ContentScoreBar', {
  label: 'Quality score',
  score: score,
  results: results
}) %>`,
          layout: 'stack',
        },
        {
          title: 'All tiers',
          previewHtml: `<div class="p-4 w-full max-w-sm space-y-3">
  ${contentScoreBarEl({ score: 100, results: fakeResults(5, 5), label: 'Good (100%)' })}
  ${contentScoreBarEl({ score: 60,  results: fakeResults(3, 5), label: 'Fair (60%)' })}
  ${contentScoreBarEl({ score: 20,  results: fakeResults(1, 5), label: 'Poor (20%)' })}
</div>`,
          code: `<%# Good tier  (score ≥ 70) %>
<%- include('modules/ui/ContentScoreBar', { score: 100, label: 'Good (100%)', results: allPassRules }) %>

<%# Fair tier  (40 ≤ score < 70) %>
<%- include('modules/ui/ContentScoreBar', { score: 60,  label: 'Fair (60%)',  results: halfPassRules }) %>

<%# Poor tier  (score < 40) %>
<%- include('modules/ui/ContentScoreBar', { score: 20,  label: 'Poor (20%)',  results: onePassRules  }) %>`,
          layout: 'stack',
        },
        {
          title: 'Password strength',
          previewHtml: `<div class="p-4 w-full">${pwdInputHtml}</div>`,
          code: `<%# Server-side password rule evaluation (mirror of NextJS preview). %>
<%
  // const rules = [
  //   { label: 'Min 8 chars',  check: function (v) { return v.length >= 8; },          points: 25 },
  //   { label: 'Uppercase',    check: function (v) { return /[A-Z]/.test(v); },        points: 25 },
  //   { label: 'Number',       check: function (v) { return /\\d/.test(v); },           points: 25 },
  //   { label: 'Special char', check: function (v) { return /[^A-Za-z0-9]/.test(v); }, points: 25 },
  // ];
%>
<%- include('modules/ui/ContentScoreBar', {
  label: 'Password strength',
  score: score,
  results: results
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
