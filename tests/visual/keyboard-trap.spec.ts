// keyboard-trap.spec.ts — keyboard smoke test for every overlay component
// (Modal, Drawer, DropdownMenu, Popover, Popconfirm, CommandPalette), per
// $KUIREACT_ROOT/docs/dev/phase-2-testing.md section 2.4: open it, assert
// focus moved inside, press Escape, assert focus returned to the trigger.
//
// None of these render as live, interactive instances on the showcase
// pages — showcase.spec.ts's own header comment documents why (several
// showcase files hand-roll a static "always open" preview string instead
// of including the real component, specifically so the screenshot shows
// the open state without needing a script to click anything). That's fine
// for pixel coverage but useless for keyboard interaction, so this spec
// renders each component directly via `ejs.render()` into a bare HTML
// page instead of navigating to a showcase route — the same real EJS
// template + its real inline `<script>`, just without the showcase
// chrome around it.
//
// Every one of `Modal`/`Drawer`/`Popover`/`Popconfirm` shares
// `modules/ui/Overlays/shared/focus-trap.js` (`window.__overlayFocusTrap`)
// for the trap itself, so this mostly confirms the wiring rather than
// re-testing that shared script's own Tab-wrap/layer-stack logic. Two
// real gaps were found and fixed while writing this spec, not just
// covered:
//   - `DropdownMenu.ejs` never used the shared trap at all — opening it
//     moved focus to the first menuitem (that part already worked) but
//     Tab could escape past the menu into the rest of the page, and
//     closing it never restored focus to the trigger.
//   - `CommandPalette.ejs` has its own bespoke dialog (not built on
//     `Modal.ejs`) with no trap wiring either — same missing
//     focus-restore-on-close gap, plus no Tab-wrap. Its existing
//     "keep focus on the search input" UX is deliberately different
//     from a plain first-focusable-element trap (the input isn't the
//     first focusable element — a header "Esc" close button is), so the
//     fix layers the shared trap's activate()/deactivate() under the
//     existing focus-the-input logic rather than replacing it.

import { test, expect } from '@playwright/test';
import * as ejs from 'ejs';
import * as fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');

function renderComponent(relPath: string, locals: Record<string, unknown>): string {
  const filename = path.join(REPO_ROOT, relPath);
  const source = fs.readFileSync(filename, 'utf8');
  return ejs.render(source, locals, { filename });
}

async function loadPage(page: import('@playwright/test').Page, bodyHtml: string) {
  await page.setContent(`<!DOCTYPE html><html><body>${bodyHtml}</body></html>`);
}

test.describe('keyboard trap smoke test', () => {
  test('Modal: focus moves in on open, Escape restores it to the trigger', async ({ page }) => {
    const html = renderComponent('modules/ui/Overlays/Modal/Modal.ejs', {
      id: 'modal-test',
      title: 'Test modal',
      open: false,
      children: '<button type="button">Inside action</button>',
    });
    await loadPage(page, `<button onclick="openModal('modal-test')">Open modal</button>${html}`);
    const trigger = page.getByRole('button', { name: 'Open modal' });
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test('Drawer: focus moves in on open, Escape restores it to the trigger', async ({ page }) => {
    const html = renderComponent('modules/ui/Overlays/Drawer/Drawer.ejs', {
      id: 'drawer-test',
      title: 'Test drawer',
      open: false,
      children: '<button type="button">Inside action</button>',
    });
    await loadPage(page, `<button onclick="openDrawer('drawer-test')">Open drawer</button>${html}`);
    const trigger = page.getByRole('button', { name: 'Open drawer' });
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Close drawer' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test('DropdownMenu: focus moves to the first item on open, Escape restores it to the trigger, Tab wraps', async ({ page }) => {
    const html = renderComponent('modules/ui/DropdownMenu.ejs', {
      id: 'dd-test',
      trigger: '<button type="button">Open menu</button>',
      items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete', danger: true }],
    });
    await loadPage(page, html);
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();

    await page.getByRole('menuitem', { name: 'Delete' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('Popover: focus moves in on open, Escape restores it to the trigger', async ({ page }) => {
    const html = renderComponent('modules/ui/Overlays/Popover/Popover.ejs', {
      id: 'popover-test',
      trigger: '<button type="button">Open popover</button>',
      children: '<button type="button">Inside action</button>',
    });
    await loadPage(page, html);
    const trigger = page.getByRole('button', { name: 'Open popover' });
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Inside action' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('Popconfirm: focus moves in on open, Escape restores it to the trigger', async ({ page }) => {
    const html = renderComponent('modules/ui/Popconfirm.ejs', {
      id: 'popconfirm-test',
      trigger: '<button type="button">Delete</button>',
      title: 'Delete this item?',
    });
    await loadPage(page, html);
    const trigger = page.getByRole('button', { name: 'Delete', exact: true });
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('alertdialog')).toBeHidden();
  });

  test('CommandPalette: focus moves to the search input on open, Escape restores it to the trigger', async ({ page }) => {
    const html = renderComponent('modules/app/CommandPalette/CommandPalette.ejs', { id: 'cmd-bar-test' });
    await loadPage(page, `<button data-cmd-trigger="cmd-bar-test">Open palette</button>${html}`);
    const trigger = page.getByRole('button', { name: 'Open palette' });
    await trigger.click();
    await expect(page.locator('#cmd-bar-test-input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('dialog')).toHaveClass(/hidden/);
  });
});
