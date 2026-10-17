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
