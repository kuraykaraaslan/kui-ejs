// routes.smoke.test.ts — boot the app in-process (no real listen()) and
// request every known URL: the fixed AI-discoverability endpoints, every
// theme route, every showcase component slug, and one genuinely unknown
// path. The cheapest, highest-value test in this repo per
// $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.2 — it iterates the
// registry rather than hand-listing routes, so a new theme or component is
// covered the moment it's registered.
//
// If this fails right after `npm run registry:snapshot`, regenerate the
// snapshot first (see $KUIREACT_ROOT/docs/dev/phase-1-ci-and-gates.md
// section 1.2) before assuming a route is actually broken.

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import app from '../src/app';

const REPO_ROOT = path.resolve(__dirname, '..');
const registry = JSON.parse(readFileSync(path.join(REPO_ROOT, 'public/registry/components.json'), 'utf8'));

const showcaseSlugs: string[] = registry.components.map((c: { id: string }) => c.id);
const themeRoutes: string[] = registry.themes.map((t: { route: string }) => t.route);

async function expectShowcasePage(route: string) {
  const res = await request(app).get(route);
  expect(res.status, `GET ${route} -> ${res.status}`).toBe(200);
  expect(res.headers['content-type']).toMatch(/text\/html/);
  expect(res.text).toContain('<main id="main-content"');
}

describe('fixed AI-discoverability + utility routes', () => {
  it('GET / renders the showcase homepage', () => expectShowcasePage('/'));

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/registry returns the full registry JSON', async () => {
    const res = await request(app).get('/api/registry');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(Array.isArray(res.body.components)).toBe(true);
    expect(res.body.components.length).toBeGreaterThan(0);
  });

  it('GET /api/registry?index=1 returns the index (no source field)', async () => {
    const res = await request(app).get('/api/registry?index=1');
    expect(res.status).toBe(200);
    expect(res.body.components[0]).not.toHaveProperty('source');
  });

  it('GET /llms-full.txt returns a text dump', async () => {
    const res = await request(app).get('/llms-full.txt');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\//);
    expect(res.text.length).toBeGreaterThan(100);
  });

  it('an unknown, unmatched path 404s', async () => {
    const res = await request(app).get('/this/path/does/not/exist');
    expect(res.status).toBe(404);
  });
});

describe('theme routes', () => {
  it.each(themeRoutes)('GET %s renders successfully', async (route) => {
    const res = await request(app).get(route);
    expect(res.status, `GET ${route} -> ${res.status}`).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });
});

describe('showcase component slugs', () => {
  it.each(showcaseSlugs)('GET /%s renders the showcase page', async (slug) => {
    await expectShowcasePage(`/${slug}`);
  });
});
