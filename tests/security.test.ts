// security.test.ts — HTTP security header baseline, plus two documented
// gaps (CSP, CSRF) tracked in docs/dev/phase-5-ejs-security-and-runtime.md.
//
// Per docs/dev/phase-2-testing.md section 2.2, this file "grows with phase
// 5": CSP and CSRF are real, pre-existing gaps in this app today (not test
// omissions). Rather than skip them, the tests below assert today's actual
// (weak) posture for both, so that landing CSP or CSRF protection later
// makes these specific tests fail — forcing a conscious update instead of
// the gap silently closing unnoticed, or silently staying open forever
// because nothing was watching it.

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import app from '../src/app';

const REPO_ROOT = path.resolve(__dirname, '..');

describe('helmet security headers (present today)', () => {
  it('sets the baseline helmet header set on every response', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    expect(res.headers['referrer-policy']).toBe('no-referrer');
    expect(res.headers['strict-transport-security']).toContain('max-age=');
  });
});

describe('Content-Security-Policy (known gap — tracked in phase 5)', () => {
  it('is not set today — src/app.ts explicitly disables it (`helmet({ contentSecurityPolicy: false })`)', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-security-policy']).toBeUndefined();
  });
});

describe('CSRF protection on real POST mutation routes (known gap — tracked in phase 5)', () => {
  // These are genuine, server-side-mutating POST handlers (login, register,
  // cart, account settings) in src/routes/themes/common.ts — a real CSRF
  // exposure in a real (if sample-data-backed, unauthenticated) demo app,
  // not an inert showcase preview.
  const commonThemeSrc = readFileSync(path.join(REPO_ROOT, 'src/routes/themes/common.ts'), 'utf8');
  const realPostRoutes = [...commonThemeSrc.matchAll(/router\.post\('([^']+)'/g)].map((m) => m[1]);

  it('found the known set of real POST mutation routes (regression guard on the scan itself)', () => {
    expect(realPostRoutes.length).toBeGreaterThanOrEqual(15);
  });

  it('accepts a POST with no CSRF token at all today', async () => {
    const res = await request(app)
      .post('/theme/common/auth/login')
      .type('form')
      .send({ email: 'test@example.com' });
    // No csurf/equivalent middleware is wired in yet, so this succeeds
    // (redirects to the success query string) rather than being rejected
    // with a 403. When CSRF protection lands, this exact request should
    // start failing without a valid token — update this test to assert
    // that instead of the current pass-through behavior.
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('success=1');
  });
});
