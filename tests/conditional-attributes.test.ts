// Conditional attributes must render as attributes. `<%= cond ? 'aria-current="page"' : '' %>`
// sends the whole `name="value"` string through escaped output, so the page got
// `aria-current=&#34;page&#34;`: an unquoted value of `"page"` (quotes included), not `page`.
// The repo's convention is `<% if (cond) { %>name="value"<% } %>`, with any dynamic value inside
// it through `<%= %>`. Each fixed partial is rendered here, and the last block scans every
// template so the pattern cannot come back.
import { describe, it, expect } from 'vitest';
import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const render = (rel: string, locals: Record<string, unknown> = {}) =>
  ejs.renderFile(path.join(ROOT, rel), locals) as Promise<string>;
/** The markup without inline <script> blocks, so script text never matches. */
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, '');
const count = (html: string, re: RegExp) => (html.match(re) || []).length;
/** The opening tag of the first element carrying `marker` (an attribute or text inside the tag). */
const tagWith = (html: string, marker: string) => {
  const at = html.indexOf(marker);
  if (at < 0) return '';
  return html.slice(html.lastIndexOf('<', at), html.indexOf('>', at) + 1);
};

describe('modules/ui/Pagination.ejs', () => {
  it('marks the current page aria-current="page" and no other', async () => {
    const html = markup(await render('modules/ui/Pagination.ejs', { page: 2, totalPages: 3 }));
    expect(tagWith(html, 'aria-label="Page 2"')).toContain('aria-current="page"');
    expect(tagWith(html, 'aria-label="Page 1"')).not.toContain('aria-current');
    expect(count(html, /aria-current="page"/g)).toBe(1);
    expect(html).not.toContain('&#34;');
  });
});

describe('modules/app/AppNav.ejs', () => {
  it('marks the active item aria-current="page"', async () => {
    const html = markup(await render('modules/app/AppNav.ejs', {
      navItems: [{ label: 'Home', href: '/home', active: true }, { label: 'Docs', href: '/docs' }],
    }));
    expect(tagWith(html, 'href="/home"')).toContain('aria-current="page"');
    expect(tagWith(html, 'href="/docs"')).not.toContain('aria-current');
    expect(html).not.toContain('&#34;');
  });
});

describe('modules/ui/TabGroup.ejs', () => {
  it('a disabled tab carries aria-disabled="true" and data-tg-disabled="1", an enabled one neither', async () => {
    const html = markup(await render('modules/ui/TabGroup.ejs', {
      id: 'tg',
      tabs: [{ id: 'a', label: 'A', content: 'a' }, { id: 'b', label: 'B', content: 'b', disabled: true }],
    }));
    const disabled = tagWith(html, 'data-tg-tab="b"');
    expect(disabled).toContain('aria-disabled="true"');
    expect(disabled).toContain('data-tg-disabled="1"');
    const enabled = tagWith(html, 'data-tg-tab="a"');
    expect(enabled).not.toContain('aria-disabled');
    expect(enabled).not.toContain('data-tg-disabled');
    expect(html).not.toContain('&#34;');
  });
});

describe('modules/ui/Table/Table.ejs (server mode)', () => {
  const table = (href: string | null) =>
    render('modules/ui/Table/Table.ejs', {
      mode: 'server',
      columns: [{ key: 'name', header: 'Name' }],
      rows: [{ name: 'Alpha' }],
      getRowHref: () => href,
    }).then(markup);

  it('a row with an href navigates on click through a real onclick attribute', async () => {
    const row = tagWith(await table('/items/1'), 'cursor-pointer');
    expect(row).toContain('onclick="location.href=&#34;/items/1&#34;"');
  });

  it('quotes and backslashes in the href stay inside the script string', async () => {
    const row = tagWith(await table(`/a'b\\c"d`), 'cursor-pointer');
    // JSON-encoded, then HTML-escaped: the browser decodes it to location.href="/a'b\\c\"d".
    expect(row).toContain('onclick="location.href=&#34;/a&#39;b\\\\c\\&#34;d&#34;"');
  });

  it('a row without an href has no onclick', async () => {
    const html = await table(null);
    expect(html).not.toContain('onclick=');
    expect(html).not.toContain('cursor-pointer');
  });
});

describe('modules/ui/Breadcrumb.ejs', () => {
  it('className renders as a class attribute, and nothing without it', async () => {
    const items = [{ label: 'Home', href: '/' }, { label: 'Here' }];
    expect(markup(await render('modules/ui/Breadcrumb.ejs', { items, className: 'mb-4' })))
      .toContain('<nav aria-label="Breadcrumb" class="mb-4">');
    expect(markup(await render('modules/ui/Breadcrumb.ejs', { items }))).toContain('<nav aria-label="Breadcrumb">');
  });
});

describe('modules/domain/common/i18n/DirectionProvider.ejs', () => {
  it('className renders as a class attribute, escaped', async () => {
    const html = markup(await render('modules/domain/common/i18n/DirectionProvider.ejs', { lang: 'ar', className: 'p-4 "x"' }));
    expect(html).toContain('<div dir="rtl" lang="ar" class="p-4 &#34;x&#34;">');
    expect(markup(await render('modules/domain/common/i18n/DirectionProvider.ejs', {}))).toContain('<div dir="ltr" lang="en">');
  });
});

describe('theme navigation partials', () => {
  it('views/partials/_navbar.ejs marks the current section, desktop and mobile', async () => {
    const html = markup(await render('views/partials/_navbar.ejs', { site: { name: 'KUI' }, currentPath: '/theme/blog' }));
    expect(count(html, /aria-current="page"/g)).toBe(2);
    for (const tag of html.match(/<a[^>]*aria-current[^>]*>/g) || []) expect(tag).toContain('href="/theme"');
    expect(html).not.toContain('aria-current=&#34;');
  });

  it('views/theme/common/account/_nav.ejs marks the active page', async () => {
    const html = markup(await render('views/theme/common/account/_nav.ejs', { activePage: 'settings', user: { name: 'Jane', email: 'j@x.io' } }));
    // The user menu links to the same pages; the nav's link is the one marked current.
    const current = html.match(/<a[^>]*aria-current[^>]*>/g) || [];
    expect(current).toHaveLength(1);
    expect(current[0]).toContain('href="/theme/common/account/settings"');
    expect(current[0]).toContain('aria-current="page"');
  });

  it('views/theme/invoice/_nav.ejs marks the active page', async () => {
    const html = markup(await render('views/theme/invoice/_nav.ejs', { activePage: 'invoices' }));
    expect(tagWith(html, 'href="/theme/invoice"')).toContain('aria-current="page"');
    expect(html).not.toContain('aria-current=&#34;');
  });

  it.each([['modem'], ['ups']])('views/theme/%s/_sidebar-body.ejs marks the active page', async (theme) => {
    const html = markup(await render(`views/theme/${theme}/_sidebar-body.ejs`, {
      activePage: 'b',
      nav: [{ id: 'a', label: 'A', href: '/a', icon: 'fa-solid fa-a' }, { id: 'b', label: 'B', href: '/b', icon: 'fa-solid fa-b' }],
    }));
    expect(tagWith(html, 'href="/b"')).toContain('aria-current="page"');
    expect(tagWith(html, 'href="/a"')).not.toContain('aria-current');
  });
});

describe('no template writes an attribute or markup through escaped output', () => {
  // A string literal inside `<%= %>` that holds `name="` / `name='` or a tag is escaped into
  // `name=&#34;` / `&lt;tag`. Plain values (classes, URLs, `?status=` query parts) are fine.
  const ATTR_OR_TAG = /[a-zA-Z_:-]=\\?["']|<\/?[a-zA-Z]/;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(ejs|js)$/.test(entry.name)) {
        const src = fs.readFileSync(file, 'utf8');
        for (const m of src.matchAll(/<%=([\s\S]*?)%>/g)) {
          const literals = m[1].match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g) || [];
          if (literals.some((l) => ATTR_OR_TAG.test(l.slice(1, -1)))) {
            offenders.push(`${path.relative(ROOT, file)}:${src.slice(0, m.index).split('\n').length}`);
          }
        }
      }
    }
  };
  walk(path.join(ROOT, 'modules'));
  walk(path.join(ROOT, 'views'));

  it('finds none in modules/ and views/', () => {
    expect(offenders).toEqual([]);
  });
});
