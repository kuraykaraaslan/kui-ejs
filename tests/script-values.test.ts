// Server values inside inline <script> blocks go through modules/ui/_script-json.ejs: JSON.stringify
// with every "<" as < and U+2028 / U+2029 escaped. Escaped output (<%= %>) was wrong there (an
// apostrophe arrived as &#39;), and a bare <%- JSON.stringify() %> was unsafe (a value holding
// "</script>" ended the block). These tests pin the helper, the components whose text values reach
// a script, a scan that keeps both patterns out of every template, and a parse of every inline
// script on every showcase and theme page.
import { describe, it, expect } from 'vitest';
import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import request from 'supertest';
import app from '../src/app';

const ROOT = path.resolve(__dirname, '..');
const render = (rel: string, locals: Record<string, unknown> = {}) =>
  ejs.renderFile(path.join(ROOT, rel), locals) as Promise<string>;
const INJECTION = '</script><script>window.__pwned = 1</script>';

/** The inline scripts of a rendered page, in order. */
const scripts = (html: string) => [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
/** The value an inline script gives `name` with `var name = <JSON>;` or `name: <JSON>,`. */
const assigned = (html: string, name: string) => {
  const re = new RegExp(`(?:var\\s+${name}\\s*=|^\\s*${name}\\s*:)\\s*(.*?)\\s*[;,]?\\s*$`, 'gm');
  for (const code of scripts(html)) {
    for (const m of code.matchAll(re)) {
      // Skip assignments of client-side expressions (cfg.placeholder, …): only a JSON literal counts.
      try { return JSON.parse(m[1]); } catch { /* not a literal */ }
    }
  }
  throw new Error(`no script assigns ${name}`);
};

describe('modules/ui/_script-json.ejs', () => {
  const json = (value: unknown) => render('modules/ui/_script-json.ejs', { value });

  it('writes a JSON literal the script reads back unchanged', async () => {
    for (const value of ["it's", 'say "hi"', 'back\\slash', 42, true, null, { a: [1, '<b>x</b>'] }]) {
      const out = await json(value);
      expect(vm.runInNewContext(`(${out})`)).toEqual(value);
    }
  });

  it('turns every "<" into \\u003c, so "</script>" cannot end the block', async () => {
    const out = await json(INJECTION);
    expect(out).not.toContain('<');
    expect(out).toBe(JSON.stringify(INJECTION).replace(/</g, '\\u003c'));
    expect(vm.runInNewContext(`(${out})`)).toBe(INJECTION);
  });

  it('escapes U+2028 and U+2029, and writes null for undefined', async () => {
    expect(await json('a b c')).toBe('"a\\u2028b\\u2029c"');
    expect(await json(undefined)).toBe('null');
  });
});

describe('text values that reach a script', () => {
  it('CountrySelector: an apostrophe in the placeholder arrives as itself', async () => {
    const html = await render('modules/domain/common/location/CountrySelector.ejs', { placeholder: "Pick the country you're in" });
    expect(assigned(html, 'placeholder')).toBe("Pick the country you're in");
    expect(html).not.toContain('&#39;re in\'');
  });

  it('CountrySelector: a "</script>" in the placeholder stays inside the script', async () => {
    const html = await render('modules/domain/common/location/CountrySelector.ejs', { placeholder: INJECTION });
    expect(html).not.toContain('<script>window.__pwned');
    expect(assigned(html, 'placeholder')).toBe(INJECTION);
    for (const code of scripts(html)) expect(() => new vm.Script(code)).not.toThrow();
  });

  it.each([
    ['TagInput placeholder', 'modules/ui/TagInput.ejs', { placeholder: INJECTION }, 'placeholderText'],
    ['RichTextEditor value', 'modules/app/RichTextEditor/index.ejs', { value: `<p>it's</p>${INJECTION}` }, 'initialHtml'],
    ['RichTextEditor placeholder', 'modules/app/RichTextEditor/index.ejs', { placeholder: `it's ${INJECTION}` }, 'placeholder'],
  ])('%s: apostrophes and "</script>" arrive intact', async (_label, file, locals, name) => {
    const html = await render(file, locals);
    expect(html).not.toContain('<script>window.__pwned');
    expect(assigned(html, name)).toBe(Object.values(locals)[0]);
  });

  it('DirectionProvider: the language reaches the document unescaped', async () => {
    const html = await render('modules/domain/common/i18n/DirectionProvider.ejs', { lang: "x-it's" });
    expect(html).toContain(`setAttribute('lang', "x-it's")`);
  });
});

describe('no template writes a value into a script another way', () => {
  // Scriptlets and HTML comments are blanked first, so a "<script>" mentioned in them is no tag.
  const blank = (src: string) => src.replace(/<%(?![=-])[\s\S]*?%>|<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
  const offenders: string[] = [];
  const scan = (file: string) => {
    const src = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const ranges = file.endsWith('.js')
      ? [[0, src.length]]
      : [...blank(src).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => [m.index! + m[0].indexOf('>') + 1, m.index! + m[0].length]);
    for (const [start, end] of ranges) {
      const code = src.slice(start, end);
      for (const m of code.matchAll(/<%=|<%-\s*JSON\.stringify\(/g)) {
        offenders.push(`${rel}:${src.slice(0, start + m.index!).split('\n').length}`);
      }
    }
  };
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.ejs') || (entry.name.endsWith('.js') && fs.readFileSync(file, 'utf8').includes('<%'))) scan(file);
    }
  };
  walk(path.join(ROOT, 'modules'));
  walk(path.join(ROOT, 'views'));

  it('finds no <%= %> and no bare <%- JSON.stringify() %> inside an inline script', () => {
    expect(offenders).toEqual([]);
  });
});

describe('every inline script on every showcase and theme page', () => {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/registry/components.json'), 'utf8'));
  const routes: string[] = [
    ...registry.components.map((c: { id: string }) => `/${c.id}`),
    ...registry.themes.map((t: { route: string }) => t.route),
  ];

  it('parses (JSON-LD as JSON, the rest as JavaScript)', async () => {
    const broken: string[] = [];
    let checked = 0;
    for (const route of routes) {
      const res = await request(app).get(route);
      for (const m of res.text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
        const [, attrs, code] = m;
        if (/\bsrc=/.test(attrs)) continue;
        checked++;
        try {
          if (/application\/ld\+json/.test(attrs)) JSON.parse(code);
          else if (!/\btype=/.test(attrs) || /javascript|module/.test(attrs)) new vm.Script(code);
        } catch (e) {
          broken.push(`${route}: ${(e as Error).message}`);
        }
      }
    }
    expect(checked).toBeGreaterThan(500);
    expect(broken).toEqual([]);
  }, 120_000);
});
