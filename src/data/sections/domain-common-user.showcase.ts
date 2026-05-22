import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const userAvatarSource      = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserAvatar.ejs'), 'utf-8');
const userMenuSource        = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserMenu.ejs'), 'utf-8');
const userRoleBadgeSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserRoleBadge.ejs'), 'utf-8');
const userStatusBadgeSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserStatusBadge.ejs'), 'utf-8');
const userProfileCardSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserProfileCard.ejs'), 'utf-8');
const userProfileFormSource = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserProfileForm.ejs'), 'utf-8');
const userPrefsFormSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/user/UserPreferencesForm.ejs'), 'utf-8');

// ─── Avatar helper ────────────────────────────────────────────────────────────

function avatarEl(opts: { name: string; size?: string; status?: string; src?: string }) {
  const sizeMap: Record<string, string> = {
    xs: 'h-6 w-6 text-xs', sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-lg',
  };
  const dotSizeMap: Record<string, string> = {
    xs: 'h-1.5 w-1.5', sm: 'h-2 w-2', md: 'h-2.5 w-2.5', lg: 'h-3 w-3', xl: 'h-4 w-4',
  };
  const sz = opts.size || 'md';
  const sc = sizeMap[sz] || sizeMap.md;
  const dotSc = dotSizeMap[sz] || dotSizeMap.md;
  const statusColorMap: Record<string, string> = { online: 'bg-success', offline: 'bg-text-disabled', away: 'bg-warning', busy: 'bg-error' };
  const statusColor = opts.status ? (statusColorMap[opts.status] || '') : '';
  const initials = opts.name.trim().split(/\s+/).map((w: string) => w[0] || '').slice(0, 2).join('').toUpperCase() || '?';

  const inner = opts.src
    ? `<img src="${opts.src}" alt="${opts.name}" class="${sc} rounded-full object-cover border border-border" />`
    : `<span aria-label="${opts.name}" class="${sc} rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center border border-primary-subtle select-none">${initials}</span>`;
  const dot = opts.status
    ? `<span aria-label="${opts.status}" class="absolute bottom-0 right-0 rounded-full border-2 border-surface-base ${statusColor} ${dotSc}"></span>`
    : '';

  return `<span class="${opts.status ? 'relative inline-flex shrink-0' : 'inline-flex shrink-0'}">${inner}${dot}</span>`;
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function badgeEl(opts: { variant: string; children: string; dot?: boolean }) {
  const variantClass: Record<string, string> = {
    success: 'bg-success-subtle text-success-fg',
    error:   'bg-error-subtle text-error-fg',
    warning: 'bg-warning-subtle text-warning-fg',
    info:    'bg-info-subtle text-info-fg',
    neutral: 'bg-surface-sunken text-text-secondary',
    primary: 'bg-primary-subtle text-primary',
  };
  const dotColorMap: Record<string, string> = {
    success: 'bg-success', error: 'bg-error', warning: 'bg-warning',
    info: 'bg-info', neutral: 'bg-text-disabled', primary: 'bg-primary',
  };
  const vc = variantClass[opts.variant] || variantClass.neutral;
  const dot = opts.dot ? `<span class="h-1.5 w-1.5 rounded-full shrink-0 ${dotColorMap[opts.variant] || 'bg-text-disabled'}" aria-hidden="true"></span>` : '';
  return `<span class="inline-flex items-center gap-1 rounded-full font-medium ${vc} px-2 py-0.5 text-xs">${dot}${opts.children}</span>`;
}

// ─── Form helpers (inline HTML) ───────────────────────────────────────────────

const baseInput = (opts: { id: string; label: string; type?: string; placeholder?: string; hint?: string; icon?: string; value?: string }) => {
  const iconPad = opts.icon ? 'pl-9' : 'px-3';
  return `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>
  <div class="relative">
    ${opts.icon ? `<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">${opts.icon}</div>` : ''}
    <input type="${opts.type || 'text'}" id="${opts.id}" placeholder="${opts.placeholder || ''}"${opts.value ? ` value="${opts.value}"` : ''}
      class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 ${iconPad} py-2 text-sm">
  </div>
  ${opts.hint ? `<p class="mt-1.5 text-sm text-text-secondary">${opts.hint}</p>` : ''}
</div>`;
};

const toggleEl = (opts: { label: string; checked?: boolean }) =>
  `<label class="inline-flex items-center cursor-pointer">
  <div class="relative"><input type="checkbox" class="sr-only peer"${opts.checked ? ' checked' : ''}>
    <div class="bg-surface-active rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:bg-primary transition-all w-11 h-6"></div>
    <div class="absolute left-0.5 top-0.5 bg-white rounded-full transition-all peer-checked:bg-primary-fg h-5 w-5 peer-checked:translate-x-5"></div>
  </div>
  <span class="ml-3 text-sm font-medium text-text-primary">${opts.label}</span>
</label>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonUserData(): ShowcaseItem[] {
  return [
    // ── UserAvatar ────────────────────────────────────────────────────────────
    {
      id: 'user-avatar',
      title: 'UserAvatar',
      category: 'Domain',
      abbr: 'Ua',
      description: 'Avatar that consumes the SafeUser type. Falls back to initials when no profile picture is set; supports online/away/busy/offline status dots.',
      filePath: 'modules/domain/common/user/UserAvatar.ejs',
      sourceCode: userAvatarSource,
      variants: [
        {
          title: 'Initials (no photo)',
          previewHtml: `<div class="p-4 flex items-center gap-4">${avatarEl({ name: 'Alice Johnson', size: 'sm' })}${avatarEl({ name: 'Alice Johnson', size: 'md' })}${avatarEl({ name: 'Alice Johnson', size: 'lg' })}${avatarEl({ name: 'Alice Johnson', size: 'xl' })}</div>`,
          code: `<%- include('modules/domain/common/user/UserAvatar', {
  name: 'Alice Johnson',
  size: 'md'
}) %>`,
        },
        {
          title: 'Online / Away / Busy / Offline',
          previewHtml: `<div class="p-4 flex items-center gap-4">${avatarEl({ name: 'Alice', status: 'online' })}${avatarEl({ name: 'Bob', status: 'away' })}${avatarEl({ name: 'Carol', status: 'busy' })}${avatarEl({ name: 'Dan', status: 'offline' })}</div>`,
          code: `<%- include('modules/domain/common/user/UserAvatar', {
  name: user.name,
  src:  user.profilePicture,
  status: 'online'
}) %>`,
        },
      ],
    },

    // ── UserMenu ──────────────────────────────────────────────────────────────
    {
      id: 'user-menu',
      title: 'UserMenu',
      category: 'Domain',
      abbr: 'Um',
      description: 'Avatar + name + role trigger. Dropdown with Profile, Settings, and Sign out items. Closes on outside click.',
      filePath: 'modules/domain/common/user/UserMenu.ejs',
      sourceCode: userMenuSource,
      variants: [
        {
          title: 'Closed (default)',
          previewHtml: `<div class="p-4 flex justify-end"><button type="button" class="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-surface-overlay">
  ${avatarEl({ name: 'Alice Johnson', size: 'sm' })}
  <div class="hidden sm:block text-left min-w-0">
    <p class="text-sm font-medium text-text-primary truncate max-w-[8rem]">Alice Johnson</p>
    <p class="text-xs text-text-secondary truncate">ADMIN</p>
  </div>
  <i class="fa-solid fa-chevron-down text-text-disabled text-xs hidden sm:block" aria-hidden="true"></i>
</button></div>`,
          code: `<%- include('modules/domain/common/user/UserMenu', {
  name:  user.name,
  email: user.email,
  role:  user.role,
  src:   user.profilePicture,
  profileHref:  '/account/profile',
  settingsHref: '/account/settings',
  signOutHref:  '/auth/logout',
  signOutMethod: 'post'
}) %>`,
        },
        {
          title: 'Dropdown open (static preview)',
          previewHtml: `<div class="p-4 relative flex justify-end" style="min-height:200px">
<div class="w-56 rounded-xl border border-border bg-surface-raised shadow-lg overflow-hidden">
  <div class="px-3 py-2.5 border-b border-border"><p class="text-sm font-semibold text-text-primary">Alice Johnson</p><p class="text-xs text-text-secondary">alice@example.com</p></div>
  <div class="py-1">
    <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay"><i class="fa-solid fa-user text-text-secondary text-xs shrink-0" aria-hidden="true"></i>Profile</a>
    <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay"><i class="fa-solid fa-gear text-text-secondary text-xs shrink-0" aria-hidden="true"></i>Settings</a>
  </div>
  <div class="py-1 border-t border-border">
    <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-subtle"><i class="fa-solid fa-arrow-right-from-bracket text-xs shrink-0" aria-hidden="true"></i>Sign out</a>
  </div>
</div></div>`,
          code: `<!-- Dropdown panel content (shown when open) -->
<%- include('modules/domain/common/user/UserMenu', {
  name:  'Alice Johnson',
  email: 'alice@example.com',
  align: 'right'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── UserRoleBadge ─────────────────────────────────────────────────────────
    {
      id: 'user-role-badge',
      title: 'UserRoleBadge',
      category: 'Domain',
      abbr: 'Ur',
      description: 'Color-coded badge for ADMIN / AUTHOR / USER roles. ADMIN renders as error (red), AUTHOR as primary (blue), USER as neutral.',
      filePath: 'modules/domain/common/user/UserRoleBadge.ejs',
      sourceCode: userRoleBadgeSource,
      variants: [
        {
          title: 'All roles',
          previewHtml: `<div class="p-4 flex flex-wrap items-center gap-3">
  ${badgeEl({ variant: 'error',   children: 'Admin' })}
  ${badgeEl({ variant: 'primary', children: 'Author' })}
  ${badgeEl({ variant: 'neutral', children: 'User' })}
</div>`,
          code: `<%- include('modules/domain/common/user/UserRoleBadge', { role: 'ADMIN' }) %>
<%- include('modules/domain/common/user/UserRoleBadge', { role: 'AUTHOR' }) %>
<%- include('modules/domain/common/user/UserRoleBadge', { role: 'USER' }) %>`,
        },
      ],
    },

    // ── UserStatusBadge ───────────────────────────────────────────────────────
    {
      id: 'user-status-badge',
      title: 'UserStatusBadge',
      category: 'Domain',
      abbr: 'Us',
      description: 'Color-coded badge for ACTIVE / INACTIVE / BANNED user statuses. Optional dot prop adds a leading status indicator.',
      filePath: 'modules/domain/common/user/UserStatusBadge.ejs',
      sourceCode: userStatusBadgeSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="p-4 flex flex-wrap items-center gap-3">
  ${badgeEl({ variant: 'success', children: 'Active' })}
  ${badgeEl({ variant: 'neutral', children: 'Inactive' })}
  ${badgeEl({ variant: 'error',   children: 'Banned' })}
</div>`,
          code: `<%- include('modules/domain/common/user/UserStatusBadge', { status: 'ACTIVE' }) %>
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'INACTIVE' }) %>
<%- include('modules/domain/common/user/UserStatusBadge', { status: 'BANNED' }) %>`,
        },
        {
          title: 'With dot',
          previewHtml: `<div class="p-4 flex flex-wrap items-center gap-3">
  ${badgeEl({ variant: 'success', children: 'Active',   dot: true })}
  ${badgeEl({ variant: 'neutral', children: 'Inactive', dot: true })}
  ${badgeEl({ variant: 'error',   children: 'Banned',   dot: true })}
</div>`,
          code: `<%- include('modules/domain/common/user/UserStatusBadge', { status: 'ACTIVE', dot: true }) %>`,
        },
      ],
    },

    // ── UserProfileForm ───────────────────────────────────────────────────────
    {
      id: 'user-profile-form',
      title: 'UserProfileForm',
      category: 'Domain',
      abbr: 'Up',
      description: 'Controlled form for editing display name, username, bio, and profile picture URL. Username validation: 3–32 chars, lowercase alphanumeric + underscore.',
      filePath: 'modules/domain/common/user/UserProfileForm.ejs',
      sourceCode: userProfileFormSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="bg-surface rounded-xl border border-border p-5"><form class="space-y-4">
  ${baseInput({ id: 'pf1', label: 'Display Name', placeholder: 'Jane Doe' })}
  ${baseInput({ id: 'pf2', label: 'Username', placeholder: 'janedoe', hint: 'Lowercase letters, numbers and underscores. 3–32 characters.' })}
  <div class="w-full"><label class="block text-sm font-medium text-text-primary mb-1.5">Bio</label><textarea rows="3" placeholder="Tell us about yourself…" class="block w-full rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm"></textarea></div>
  ${baseInput({ id: 'pf3', label: 'Profile Picture URL', type: 'url', placeholder: 'https://example.com/avatar.jpg', icon: '<i class="fa-solid fa-link text-xs" aria-hidden="true"></i>' })}
  <div class="flex justify-end gap-2 pt-2"><button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save Profile</button></div>
</form></div></div>`,
          code: `<%- include('modules/domain/common/user/UserProfileForm', {
  action: '/account/profile',
  initial: {
    name:     user.name,
    username: user.username,
    biography: user.biography,
    profilePicture: user.profilePicture
  }
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Pre-filled',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="bg-surface rounded-xl border border-border p-5"><form class="space-y-4">
  ${baseInput({ id: 'pf4', label: 'Display Name', value: 'Alice Johnson' })}
  ${baseInput({ id: 'pf5', label: 'Username', value: 'alicejohnson', hint: 'Lowercase letters, numbers and underscores. 3–32 characters.' })}
  <div class="w-full"><label class="block text-sm font-medium text-text-primary mb-1.5">Bio</label><textarea rows="3" class="block w-full rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm">Frontend developer and coffee enthusiast.</textarea></div>
  ${baseInput({ id: 'pf6', label: 'Profile Picture URL', type: 'url', value: 'https://example.com/alice.jpg', icon: '<i class="fa-solid fa-link text-xs" aria-hidden="true"></i>' })}
  <div class="flex justify-end gap-2 pt-2"><a href="#" class="inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Cancel</a><button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save Profile</button></div>
</form></div></div>`,
          code: `<%- include('modules/domain/common/user/UserProfileForm', {
  action: '/account/profile',
  cancelHref: '/account',
  initial: { name: 'Alice Johnson', username: 'alicejohnson', ... }
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── UserProfileCard ───────────────────────────────────────────────────────
    {
      id: 'user-profile-card',
      title: 'UserProfileCard',
      category: 'Domain',
      abbr: 'Pc',
      description: 'Profile card with cover banner, avatar, display name, username, bio, role and status badges, and an optional actions slot.',
      filePath: 'modules/domain/common/user/UserProfileCard.ejs',
      sourceCode: userProfileCardSource,
      variants: [
        {
          title: 'Full profile',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface-raised border border-border rounded-xl overflow-hidden">
    <div class="h-20 bg-gradient-to-r from-primary-subtle to-secondary/20"></div>
    <div class="px-5 pb-5">
      <div class="flex items-end justify-between -mt-8 mb-3">
        <div class="ring-4 ring-surface-raised rounded-full">
          ${avatarEl({ name: 'Jane Doe', size: 'xl' })}
        </div>
        <div class="flex items-center gap-2 pb-1">
          <button class="text-xs text-primary border border-border rounded-md px-3 py-1 hover:bg-surface-overlay">Edit</button>
        </div>
      </div>
      <div class="space-y-1 mb-3">
        <h3 class="text-lg font-bold text-text-primary leading-tight">Jane Doe</h3>
        <p class="text-sm text-text-secondary">@janedoe</p>
        <p class="text-sm text-text-secondary leading-relaxed pt-1">Full-stack engineer. Loves design systems and coffee.</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        ${badgeEl({ variant: 'error',   children: 'Admin' })}
        ${badgeEl({ variant: 'success', children: 'Active' })}
        <span class="text-xs text-text-secondary truncate">admin@acme.com</span>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/user/UserProfileCard', {
  name:      user.name,
  email:     user.email,
  role:      user.role,
  status:    user.status,
  username:  user.username,
  biography: user.biography,
  src:       user.profilePicture
}) %>`,
          layout: 'stack',
        },
        {
          title: 'No profile data',
          previewHtml: `<div class="w-full max-w-sm p-4">
  <div class="bg-surface-raised border border-border rounded-xl overflow-hidden">
    <div class="h-20 bg-gradient-to-r from-primary-subtle to-secondary/20"></div>
    <div class="px-5 pb-5">
      <div class="flex items-end -mt-8 mb-3">
        <div class="ring-4 ring-surface-raised rounded-full">
          ${avatarEl({ name: 'user@acme.com', size: 'xl' })}
        </div>
      </div>
      <div class="space-y-1 mb-3">
        <h3 class="text-lg font-bold text-text-primary leading-tight">user@acme.com</h3>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        ${badgeEl({ variant: 'neutral', children: 'User' })}
        ${badgeEl({ variant: 'neutral', children: 'Inactive' })}
        <span class="text-xs text-text-secondary truncate">user@acme.com</span>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/domain/common/user/UserProfileCard', {
  email:  user.email,
  role:   user.role,
  status: user.status
}) %>`,
        },
      ],
    },

    // ── UserPreferencesForm ───────────────────────────────────────────────────
    {
      id: 'user-preferences-form',
      title: 'UserPreferencesForm',
      category: 'Domain',
      abbr: 'Ue',
      description: 'Preferences form with theme and language selects plus email/push notification and newsletter toggles.',
      filePath: 'modules/domain/common/user/UserPreferencesForm.ejs',
      sourceCode: userPrefsFormSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="bg-surface rounded-xl border border-border p-5"><form class="space-y-6">
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-text-primary">Appearance</h3>
    <div><label class="block text-sm font-medium text-text-primary mb-1.5">Theme</label><select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm"><option selected>System default</option><option>Light</option><option>Dark</option></select></div>
    <div><label class="block text-sm font-medium text-text-primary mb-1.5">Language</label><select class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm"><option selected>🇺🇸 English</option><option>🇹🇷 Türkçe</option><option>🇩🇪 Deutsch</option></select></div>
  </div>
  <div class="space-y-3 pt-2 border-t border-border">
    <h3 class="text-sm font-semibold text-text-primary pt-2">Notifications</h3>
    ${toggleEl({ label: 'Email notifications', checked: true })}
    ${toggleEl({ label: 'Push notifications', checked: true })}
    ${toggleEl({ label: 'Newsletter', checked: false })}
  </div>
  <div class="flex justify-end pt-2"><button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">Save Preferences</button></div>
</form></div></div>`,
          code: `<%- include('modules/domain/common/user/UserPreferencesForm', {
  action: '/account/preferences',
  initial: {
    theme: 'SYSTEM',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    newsletter: false
  }
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
