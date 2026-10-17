// Extension surfaces (next-boilerplate phase 37), kui-react parity: UnavailableContribution,
// TabGroup isolation + order, contributed DropdownMenu / UserMenu items, AppTopBar regions,
// AppSidebar header + badges, DataTable rowActions, CommandPalette without demo defaults.
// Markup is checked through ejs.renderFile; the client scripts (portal placement, registered
// commands) were exercised separately in a browser.
import { describe, it, expect, vi } from 'vitest';
import ejs from 'ejs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const render = (rel: string, locals: Record<string, unknown> = {}) =>
  ejs.renderFile(path.join(ROOT, rel), locals) as Promise<string>;

/** The markup without inline <script> blocks, so script text never matches. */
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, '');
const count = (html: string, re: RegExp) => (html.match(re) || []).length;
/** Visible menu entries (menuitem labels, '-' for separators) in document order. */
function menuEntries(html: string): string[] {
  const menu = html.slice(html.indexOf('role="menu"'));
  const body = markup(menu);
  return [...body.matchAll(/role="(menuitem|separator)"[^>]*>([\s\S]*?)<\/(?:button|a|div)>/g)].map((m) =>
    m[1] === 'separator' ? '-' : m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  );
}

const REASONS = ['disabled', 'unentitled', 'blocked', 'retired', 'banned', 'quarantined', 'failed', 'missing', 'no-access'];

describe('UnavailableContribution', () => {
  it.each(REASONS)('reason %s renders its default text and icon', async (reason) => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason });
    expect(html).toContain(`data-reason="${reason}"`);
    expect(html).toMatch(/<i class="fa-solid fa-[a-z-]+"/);
  });

  it('defaults to the card size, reason missing, with a dashed frame', async () => {
    const html = await render('modules/ui/UnavailableContribution.ejs');
    expect(html).toContain('data-reason="missing"');
    expect(html).toContain('data-size="card"');
    expect(html).toContain('border-dashed');
  });

  it.each(['inline', 'card', 'tab', 'node'])('size %s is marked on the element', async (size) => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason: 'disabled', size });
    expect(html).toContain(`data-size="${size}"`);
  });

  it('host texts override the defaults; detail null hides the explanation', async () => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason: 'unentitled', label: 'Nicht im Tarif', detail: null });
    expect(html).toContain('Nicht im Tarif');
    expect(html).not.toContain('Not in plan');
    expect(html).not.toContain('Your current plan does not include this.');
  });

  it('a title becomes the heading and the reason moves to a badge', async () => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason: 'quarantined', size: 'node', title: 'Call log' });
    expect(html).toMatch(/<p class="truncate text-sm font-semibold text-text-primary">Call log<\/p>/);
    expect(html).toMatch(/rounded-full[^"]*">Quarantined<\/span>/);
  });

  it('renders the action as a button (onClick JS) or a link (href), escaped', async () => {
    const btn = await render('modules/ui/UnavailableContribution.ejs', { reason: 'failed', action: { label: 'Retry', onClick: 'retry("x")' } });
    expect(btn).toContain('<button type="button" onclick="retry(&quot;x&quot;)"');
    const link = await render('modules/ui/UnavailableContribution.ejs', { reason: 'unentitled', action: { label: 'Upgrade', href: '/billing' } });
    expect(link).toMatch(/<a href="\/billing"[^>]*>Upgrade<\/a>/);
  });

  it('framed: false drops the frame', async () => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason: 'disabled', framed: false });
    expect(html).not.toContain('border-dashed');
  });

  it('inline: the detail is the tooltip and is kept for screen readers', async () => {
    const html = await render('modules/ui/UnavailableContribution.ejs', { reason: 'no-access', size: 'inline' });
    expect(html).toContain('title="You do not have permission to see this."');
    expect(html).toContain('<span class="sr-only">You do not have permission to see this.</span>');
  });
});

describe('TabGroup', () => {
  const tabIds = (html: string) => [...html.matchAll(/data-tg-tab="([^"]+)"/g)].map((m) => m[1]);

  it('sorts tabs by order (missing counts as 0, ties keep array order)', async () => {
    const html = await render('modules/ui/TabGroup.ejs', {
      tabs: [
        { id: 'calls', label: 'Calls', order: 20, content: 'c' },
        { id: 'overview', label: 'Overview', content: 'o' },
        { id: 'pinned', label: 'Pinned', order: -1, content: 'p' },
        { id: 'notes', label: 'Notes', content: 'n' },
      ],
    });
    expect(tabIds(html)).toEqual(['pinned', 'overview', 'notes', 'calls']);
    expect(html).toMatch(/aria-selected="true"\s+aria-controls="[^"]+-panel-pinned"/);
  });

  it('an unknown activeTab falls back to the first tab', async () => {
    const html = await render('modules/ui/TabGroup.ejs', { activeTab: 'gone', tabs: [{ id: 'a', label: 'A', content: 'a' }] });
    expect(html).toMatch(/aria-selected="true"\s+aria-controls="[^"]+-panel-a"/);
  });

  it('a tab-level lazy overrides the group', async () => {
    const html = markup(await render('modules/ui/TabGroup.ejs', {
      tabs: [
        { id: 'a', label: 'A', content: '<p>alpha</p>' },
        { id: 'b', label: 'B', content: '<p>beta</p>' },
        { id: 'x', label: 'X', content: '<p>contributed</p>', lazy: true },
      ],
    }));
    expect(html).toContain('<p>beta</p>');
    expect(html).not.toContain('<p>contributed</p>');
    expect(html).toContain('data-tg-lazy-panel="1"');
  });

  it('isolate: a throwing function content shows the failed placeholder and is reported', async () => {
    const onTabError = vi.fn();
    const html = markup(await render('modules/ui/TabGroup.ejs', {
      isolate: true,
      activeTab: 'x',
      onTabError,
      tabs: [
        { id: 'a', label: 'A', content: () => '<p>alpha</p>' },
        { id: 'x', label: 'X', content: () => { throw new Error('tab broke'); } },
      ],
    }));
    expect(html).toContain('<p>alpha</p>');
    expect(html).toContain('data-reason="failed"');
    expect(html).toContain('onclick="location.reload()"');
    expect(onTabError).toHaveBeenCalledWith('x', expect.objectContaining({ message: 'tab broke' }));
  });

  it('renderError lets the host choose the fallback; per-tab isolate works without the group flag', async () => {
    const html = markup(await render('modules/ui/TabGroup.ejs', {
      activeTab: 'x',
      renderError: ({ tab, error }: { tab: { label: string }; error: Error }) => `<p>${tab.label}: ${error.message}</p>`,
      tabs: [{ id: 'x', label: 'Broken', isolate: true, content: () => { throw new Error('boom'); } }],
    }));
    expect(html).toContain('<p>Broken: boom</p>');
  });

  it('without isolate a throwing content is not swallowed', async () => {
    await expect(render('modules/ui/TabGroup.ejs', {
      tabs: [{ id: 'x', label: 'X', content: () => { throw new Error('boom'); } }],
    })).rejects.toThrow('boom');
  });
});

describe('DropdownMenu contributed items', () => {
  it('hidden items are left out without stray separators', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', {
      items: [{ label: 'Edit' }, { type: 'separator' }, { label: 'Call', hidden: true }, { type: 'separator' }, { label: 'Delete', danger: true }],
    });
    expect(menuEntries(html)).toEqual(['Edit', '-', 'Delete']);
  });

  it('orders by group (lowest order first) and order, with a separator between groups', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', {
      items: [
        { id: 'sign-out', label: 'Sign out', group: 'session', order: 1000 },
        { id: 'profile', label: 'Profile', group: 'account', order: 100 },
        { type: 'separator' },
        { id: 'dnd', label: 'Do not disturb', group: 'status', order: 50 },
        { id: 'settings', label: 'Settings', group: 'account', order: 200 },
      ],
    });
    expect(menuEntries(html)).toEqual(['Do not disturb', '-', 'Profile', 'Settings', '-', 'Sign out']);
  });

  it('a list without group or order keeps its order and separators', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', { items: [{ label: 'B' }, { type: 'separator' }, { label: 'A' }] });
    expect(menuEntries(html)).toEqual(['B', '-', 'A']);
  });

  it('href renders a link with data-item-id; a disabled href item stays a disabled button', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', {
      items: [{ id: 'docs', label: 'Docs', href: '/docs' }, { label: 'Off', href: '/off', disabled: true }],
    });
    expect(html).toMatch(/<a\s+role="menuitem"\s+href="\/docs"\s+data-item-id="docs"/);
    expect(html).not.toContain('href="/off"');
    expect(html).toMatch(/<button\s+role="menuitem"\s+type="button"\s+disabled/);
  });

  it('disabledReason shows under a disabled item and describes it', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', {
      id: 'dm',
      items: [{ label: 'Archive', disabled: true, disabledReason: 'Only owners can archive' }],
    });
    expect(html).toContain('title="Only owners can archive" aria-label="Archive" aria-describedby="dm-reason-0"');
    expect(html).toContain('<span id="dm-reason-0" class="text-xs text-text-secondary">Only owners can archive</span>');
  });

  it('portal marks the menu for document.body placement', async () => {
    const html = await render('modules/ui/DropdownMenu.ejs', { portal: true, align: 'right', items: [{ label: 'A' }] });
    expect(markup(html)).toContain('data-dropdown-portal="right"');
  });
});

describe('UserMenu', () => {
  const entries = async (locals: Record<string, unknown>) =>
    menuEntries(await render('modules/domain/common/user/UserMenu.ejs', { id: 'um', name: 'Jane', ...locals }));

  it('shows Profile, Settings, a separator and Sign out by default', async () => {
    expect(await entries({})).toEqual(['Profile', 'Settings', '-', 'Sign out']);
  });

  it('extraItems merge with the built-in items, placed by group and order', async () => {
    expect(await entries({
      extraItems: [
        { id: 'prefs', label: 'Preferences' },
        { id: 'dnd', label: 'Do not disturb', group: 'status', order: 10 },
        { id: 'stop', label: 'Stop impersonating', group: 'session', order: 900 },
      ],
    })).toEqual(['Do not disturb', '-', 'Profile', 'Settings', 'Preferences', '-', 'Stop impersonating', 'Sign out']);
  });

  it('items replace the built-in items unless mergeItems is set', async () => {
    expect(await entries({ items: [{ label: 'Mine' }, { type: 'separator' }, { label: 'Leave' }] })).toEqual(['Mine', '-', 'Leave']);
    expect(await entries({ mergeItems: true, items: [{ id: 'billing', label: 'Billing' }] }))
      .toEqual(['Profile', 'Settings', 'Billing', '-', 'Sign out']);
  });

  it('an item with a built-in id replaces it in place; hrefs and labels are configurable', async () => {
    const html = await render('modules/domain/common/user/UserMenu.ejs', {
      id: 'um', name: 'Jane', settingsHref: '/settings', labels: { signOut: 'Abmelden' },
      extraItems: [{ id: 'profile', label: 'My account', href: '/me' }],
    });
    expect(menuEntries(html)).toEqual(['My account', 'Settings', '-', 'Abmelden']);
    expect(html).toContain('href="/me"');
    expect(html).toContain('href="/settings"');
  });
});

describe('AppTopBar regions', () => {
  it('renders as before without regions', async () => {
    const html = await render('modules/app/AppTopBar.ejs', { logoContent: 'Logo', children: '<span>child</span>' });
    expect(html).not.toContain('data-region');
  });

  it('orders region items, leaves hidden ones out and pushes end to the far end', async () => {
    const html = await render('modules/app/AppTopBar.ejs', {
      start: '<b>switcher</b>',
      end: [
        { id: 'user', node: 'user', order: 100 },
        { id: 'bell', node: 'bell', order: 10 },
        { id: 'lang', node: 'lang' },
        { id: 'phone', node: 'phone', hidden: true },
      ],
    });
    expect(html).toContain('<div data-region="start" class="flex items-center gap-2"><b>switcher</b></div>');
    expect(html).toContain('<div data-region="end" class="flex items-center gap-2 ml-auto shrink-0">langbelluser</div>');
  });

  it('a region whose items are all hidden renders nothing', async () => {
    const html = await render('modules/app/AppTopBar.ejs', { end: [{ id: 'x', node: 'x', hidden: true }] });
    expect(html).not.toContain('data-region');
  });
});

describe('AppSidebar header and badges', () => {
  it('renders headerContent above the nav, from a string or a function of { collapsed }', async () => {
    const html = markup(await render('modules/app/AppSidebar.ejs', {
      collapsed: true,
      headerContent: ({ collapsed }: { collapsed: boolean }) => (collapsed ? '<i>narrow</i>' : '<b>wide</b>'),
      navItems: [{ id: 'a', label: 'A' }],
    }));
    expect(html).toContain('<div class="shrink-0 border-b border-border px-2 py-2 flex justify-center">');
    expect(html.indexOf('<i>narrow</i>')).toBeGreaterThan(-1);
    expect(html.indexOf('<i>narrow</i>')).toBeLessThan(html.indexOf('<nav'));
  });

  it('shows a count above 0, hides 0 and renders badge HTML as given', async () => {
    const html = markup(await render('modules/app/AppSidebar.ejs', {
      searchable: false,
      navItems: [
        { id: 'a', label: 'Inbox', badge: 3 },
        { id: 'z', label: 'Zero', badge: 0 },
        { id: 't', label: 'Team', badge: '<span class="dot">Beta</span>' },
      ],
    }));
    expect(count(html, /text-\[10px\]">3</g)).toBe(1);
    expect(html).not.toMatch(/text-\[10px\]">0</);
    expect(html).toContain('<span class="shrink-0"><span class="dot">Beta</span></span>');
  });

  it('marks the active item, link or button, as the current page (parity with kui-react)', async () => {
    const render2 = async (activeId: string) => markup(await render('modules/app/AppSidebar.ejs', {
      searchable: false,
      activeId,
      navItems: [{ id: 'home', label: 'Home', href: '/home' }, { id: 'inbox', label: 'Inbox' }],
    }));
    expect(await render2('home')).toMatch(/<a href="\/home" aria-current="page"/);
    expect(await render2('inbox')).toMatch(/<button type="button" aria-current="page"/);
    expect(count(await render2('none'), /aria-current/g)).toBe(0);
  });

  it('collapsed, every item carries its label as an escaped title', async () => {
    const html = markup(await render('modules/app/AppSidebar.ejs', {
      collapsed: true,
      searchable: false,
      navItems: [{ id: 'a', label: 'Q&A', href: '/qa' }, { id: 'b', label: 'Inbox' }],
    }));
    expect(html).toContain('<a href="/qa" title="Q&amp;A" class=');
    expect(html).toContain('<button type="button" title="Inbox" class=');
    expect(html).not.toContain('&#34;');
  });
});

describe('DataTable rowActions', () => {
  const rows = [
    { id: '1', name: 'Acme', status: 'active', email: 'a@x.test' },
    { id: '2', name: 'Globex', status: 'archived', email: '' },
  ];
  const columns = [{ key: 'name', header: 'Name' }];

  it('without rowActions the table has no actions column (unchanged)', async () => {
    const html = markup(await render('modules/ui/DataTable.ejs', { mode: 'static', searchable: false, columns, rows }));
    expect(html).not.toContain('data-part="row-actions"');
    expect(count(html, /scope="col"/g)).toBe(1);
  });

  it('adds a trailing column with a portalled menu per row, resolving per-row fields', async () => {
    const html = await render('modules/ui/DataTable.ejs', {
      id: 'dt', mode: 'static', searchable: false, columns, rows,
      rowActionsLabel: (r: { name: string }) => `Actions for ${r.name}`,
      rowActions: [
        { id: 'open', label: 'Open', href: (r: { id: string }) => `/c/${r.id}` },
        { id: 'restore', label: 'Restore', hidden: (r: { status: string }) => r.status !== 'archived' },
        { id: 'sign', label: 'Sign', disabled: (r: { email: string }) => !r.email, disabledReason: 'Add an email address first' },
        { id: 'delete', label: 'Delete', destructive: true, group: 'danger', order: 100 },
      ],
    });
    expect(count(html, /data-part="row-actions"/g)).toBe(2);
    expect(html).toContain('<span class="sr-only">Actions</span>');
    expect(html).toContain('aria-label="Actions for Acme"');
    expect(html).toContain('href="/c/2"');
    expect(count(html, /data-item-id="restore"/g)).toBe(1);
    expect(html).toContain('data-dropdown-portal="right"');
    expect(html).toContain('text-error hover:bg-error-subtle');
    expect(html).toMatch(/COL_COUNT\s*=\s*2/);
  });

  it('a row whose actions are all hidden gets an empty cell; the empty state spans the column', async () => {
    const html = markup(await render('modules/ui/DataTable.ejs', {
      mode: 'static', searchable: false, columns, rows,
      rowActions: [{ id: 'restore', label: 'Restore', hidden: (r: { status: string }) => r.status !== 'archived' }],
    }));
    expect(count(html, /data-part="row-actions"/g)).toBe(2);
    expect(count(html, /aria-label="Row actions"/g)).toBe(1);
    const empty = await render('modules/ui/DataTable.ejs', { mode: 'static', columns, rows: [], rowActions: [{ id: 'x', label: 'X' }] });
    expect(empty).toContain('colspan="2"');
  });
});

describe('CommandPalette', () => {
  const options = (html: string) => [...markup(html).matchAll(/data-original-label="([^"]*)"/g)].map((m) => m[1]);

  it('lists no sample commands by default', async () => {
    expect(options(await render('modules/app/AppCommandBar.ejs'))).toEqual([]);
  });

  it('demo fills in the sample commands; items win over demo', async () => {
    expect(options(await render('modules/app/AppCommandBar.ejs', { demo: true }))).toHaveLength(12);
    expect(options(await render('modules/app/AppCommandBar.ejs', { demo: true, items: [{ label: 'Only me', group: 'Mine' }] })))
      .toEqual(['Only me']);
  });

  it('orders groups and commands by order and drops hidden commands', async () => {
    const html = await render('modules/app/AppCommandBar.ejs', {
      items: [
        { id: 'logs', label: 'Open logs', group: 'Admin', order: 50 },
        { id: 'new-lead', label: 'New lead', group: 'Create', order: 20 },
        { id: 'new-contact', label: 'New contact', group: 'Create', order: 10 },
        { id: 'secret', label: 'Secret tool', group: 'Admin', hidden: true },
        { id: 'home', label: 'Go home', category: 'Navigation', order: 0 },
      ],
    });
    expect(options(html)).toEqual(['Go home', 'New contact', 'New lead', 'Open logs']);
    expect(html).toContain('data-cmd-id="new-lead"');
  });

  it('ships the runtime registry (registerMany) and its rendering', async () => {
    const html = await render('modules/app/AppCommandBar.ejs');
    expect(html).toContain('registerMany');
    expect(html).toContain('syncRegistered');
  });
});
