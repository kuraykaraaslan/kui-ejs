// Server values inside the JavaScript of an on*= attribute are written as <%= JSON.stringify(x) %>
// with no quotes around them: the attribute escaping turns the JSON's quotes into &#34;, the browser
// decodes them back, and the handler sees a valid JS literal. The old form, '<%= x %>', broke on an
// apostrophe: &#39; decodes to ' inside the JS string, which ends it early. These tests render the
// handlers with ids holding an apostrophe and a double quote, decode them as a browser would, and run
// them against stubs. JSON written into data-* attributes is checked the same way.
import { describe, it, expect } from 'vitest';
import ejs from 'ejs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(__dirname, '..');
const render = (rel: string, locals: Record<string, unknown> = {}) =>
  ejs.renderFile(path.join(ROOT, rel), locals) as Promise<string>;
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, '');

/** Decodes the character references ejs writes, as a browser does for an attribute value. */
const decode = (s: string) =>
  s.replace(/&(#34|#39|quot|amp|lt|gt|#x27);/g, (_m, e: string) =>
    ({ '#34': '"', '#39': "'", quot: '"', amp: '&', lt: '<', gt: '>', '#x27': "'" })[e]!,
  );

/** Every attribute `name` in the markup, decoded. */
const attrs = (html: string, name: string) =>
  [...markup(html).matchAll(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'g'))].map((m) => decode(m[1] ?? m[2]));

/** Runs handler code against stub functions and returns the calls it made. */
function run(code: string, globals: string[]) {
  const calls: unknown[][] = [];
  const sandbox: Record<string, unknown> = { event: { preventDefault() {} }, document: { getElementById: () => null } };
  for (const g of globals) sandbox[g] = (...args: unknown[]) => { calls.push([g, ...args]); };
  vm.runInNewContext(code, sandbox);
  return calls;
}

const IDS = ["menu-it's", 'say-"hi"'];

describe('on*= handlers take server values as JSON', () => {
  it.each(IDS)('Modal close buttons pass the id %s through intact', async (id) => {
    const html = await render('modules/ui/Overlays/Modal/Modal.ejs', { id, open: true, title: 'T' });
    const handlers = attrs(html, 'onclick').filter((c) => c.includes('closeModal'));
    expect(handlers.length).toBeGreaterThan(0);
    for (const code of handlers) expect(run(code, ['closeModal'])).toEqual([['closeModal', id]]);
  });

  it.each(IDS)('DropdownMenu items close the menu %s', async (id) => {
    const html = await render('modules/ui/DropdownMenu.ejs', { id, trigger: '<button>x</button>', items: [{ label: 'A' }, { label: 'B', href: '/b' }] });
    const handlers = attrs(html, 'onclick').filter((c) => c.includes('closeDropdownMenu'));
    expect(handlers).toHaveLength(2);
    for (const code of handlers) expect(run(code, ['closeDropdownMenu'])).toEqual([['closeDropdownMenu', id]]);
  });

  it.each(IDS)('ViewToggle passes the id %s and the option key', async (id) => {
    const html = await render('modules/ui/ViewToggle.ejs', { id });
    const calls = attrs(html, 'onclick').flatMap((c) => run(c, ['viewToggleSelect']));
    expect(calls).toEqual([['viewToggleSelect', id, 'horizontal'], ['viewToggleSelect', id, 'vertical']]);
  });

  it.each(IDS)('AppSidebar toggles itself and its groups for %s', async (id) => {
    const html = await render('modules/app/AppSidebar.ejs', {
      id, searchable: false, navGroups: [{ label: "Owner's tools", collapsible: true, items: [{ id: 'a', label: 'A' }] }],
    });
    const calls = attrs(html, 'onclick').flatMap((c) => run(c, ['toggleAppSidebar', 'toggleSidebarGroup']));
    expect(calls).toEqual([['toggleAppSidebar', id], ['toggleSidebarGroup', id, "Owner's_tools"]]);
  });

  it.each(IDS)('AppDrawer search handlers build ids from %s', async (id) => {
    const html = await render('modules/app/AppDrawer.ejs', { id, searchable: true, navItems: [{ id: "it's", label: 'A' }] });
    const looked: string[] = [];
    const sandbox = {
      filterAppDrawer: () => {}, appDrawerSelect: (...a: unknown[]) => looked.push(`select:${a.join('|')}`),
      openDrawer: () => {}, closeDrawer: () => {},
      document: { getElementById: (x: string) => { looked.push(x); return null; } },
    };
    for (const code of [...attrs(html, 'oninput'), ...attrs(html, 'onclick')]) {
      vm.runInNewContext(code.replace(/\bthis\b/g, '({ value: "q" })'), sandbox);
    }
    expect(looked).toEqual(expect.arrayContaining([`${id}-search-clear`, `${id}-search`, `select:${id}|it's`]));
  });

  it("VideoPlayer's quality, subtitle and audio labels arrive intact", async () => {
    const html = await render('modules/ui/VideoPlayer/VideoPlayer.ejs', {
      id: "vp-it's",
      sources: [{ src: '/v.mp4', type: 'video/mp4' }],
      qualities: [{ value: '1080p', label: "Full HD (it's big)" }],
      subtitles: [{ src: '/s.vtt', srclang: 'en', label: 'English "CC"' }],
      audioTracks: [{ label: "Director's cut" }],
    });
    const calls: unknown[][] = [];
    const vp = new Proxy({}, { get: (_t, method: string) => (...args: unknown[]) => calls.push([method, ...args]) });
    for (const code of attrs(html, 'onclick')) vm.runInNewContext(code, { window: { __vp: { "vp-it's": vp } }, event: {} });
    expect(calls).toEqual(expect.arrayContaining([
      ['setQuality', '1080p', "Full HD (it's big)"],
      ['setSubtitle', 0, 'English "CC"'],
      ['togglePlay'],
    ]));
  });

  it("RichTextEditor's modal footers close their own modal", async () => {
    const html = await render('modules/app/RichTextEditor/index.ejs', { id: "rte-it's" });
    const calls = attrs(html, 'onclick').filter((c) => c.includes('closeModal(')).flatMap((c) => run(c, ['closeModal']));
    expect(calls).toEqual(expect.arrayContaining([['closeModal', "rte-it's-img-modal"], ['closeModal', "rte-it's-table-modal"]]));
    expect(markup(html)).toContain('id="rte-it&#39;s-img-drop"');
  });
});

describe('JSON in data-* attributes', () => {
  it('FileUploadSection: an apostrophe in an option survives', async () => {
    const html = await render('modules/app/FileUploadSection/FileUploadSection.ejs', {
      id: 'fus', accept: 'image/*', messages: { dropHere: "Drop it's files here", tooBig: 'Too "big"' },
    });
    const [raw] = attrs(html, 'data-fus-options');
    expect(markup(html)).toMatch(/data-fus-options="[^"]*&#39;[^"]*"/);
    expect(JSON.parse(raw).messages).toEqual({ dropHere: "Drop it's files here", tooBig: 'Too "big"' });
  });

  it('FileInput: an apostrophe in an option survives', async () => {
    const html = await render('modules/ui/FileInput.ejs', { id: 'fi', accept: "it's/*" });
    expect(JSON.parse(attrs(html, 'data-fi-options')[0]).accept).toBe("it's/*");
  });

  it('RichTextEditor: mentions and slash items with apostrophes survive', async () => {
    const mentions = [{ id: 'u1', label: "O'Brien" }];
    const slashItems = [{ id: 'q', label: 'Quote "block"', command: 'blockquote' }];
    const html = await render('modules/app/RichTextEditor/index.ejs', { id: 'rte', mentions, slashItems });
    expect(JSON.parse(attrs(html, 'data-mentions')[0])).toEqual(mentions);
    expect(JSON.parse(attrs(html, 'data-slash')[0])).toEqual(slashItems);
  });
});
