import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const loginFormSource        = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/LoginForm.ejs'), 'utf-8');
const registerFormSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/RegisterForm.ejs'), 'utf-8');
const forgotPasswordSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/ForgotPasswordForm.ejs'), 'utf-8');
const changePasswordSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/ChangePasswordForm.ejs'), 'utf-8');
const oauthButtonsSource     = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/OAuthButtons.ejs'), 'utf-8');
const sessionExpiredSource   = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/auth/SessionExpiredBanner.ejs'), 'utf-8');

// ─── Shared helpers ───────────────────────────────────────────────────────────

const baseInput = (opts: {
  id: string; label: string; type?: string; placeholder?: string;
  icon?: string; hint?: string; error?: string; value?: string; required?: boolean;
}) => {
  const stateClass = opts.error
    ? 'border-error focus:border-error focus:ring-error/20'
    : 'border-border focus:border-primary hover:border-text-tertiary';
  const iconPad = opts.icon ? 'pl-9' : 'px-3';
  return `<div class="w-full">
  <label for="${opts.id}" class="block text-sm font-medium text-text-primary mb-1.5">
    ${opts.label}${opts.required ? ' <span class="text-error">*</span>' : ''}
  </label>
  <div class="relative">
    ${opts.icon ? `<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">${opts.icon}</div>` : ''}
    <input type="${opts.type || 'text'}" id="${opts.id}" placeholder="${opts.placeholder || ''}"
      ${opts.value ? `value="${opts.value}"` : ''}
      class="block w-full rounded-md border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-colors ${iconPad} py-2 text-sm ${stateClass}">
  </div>
  ${opts.error ? `<p class="mt-1.5 text-sm text-error">${opts.error}</p>` : ''}
  ${opts.hint && !opts.error ? `<p class="mt-1.5 text-sm text-text-secondary">${opts.hint}</p>` : ''}
</div>`;
};

const submitBtn = (label: string, fullWidth = true) =>
  `<button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm${fullWidth ? ' w-full' : ''}">${label}</button>`;

const outlineBtn = (label: string, icon?: string) =>
  `<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay w-full px-4 py-2 text-sm">${icon ? `<i class="${icon}" aria-hidden="true"></i>` : ''}${label}</button>`;

const errorBanner = (msg: string) =>
  `<div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm"><i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i><span>${msg}</span></div>`;

const wrapForm = (inner: string) =>
  `<div class="p-4 w-full max-w-sm"><div class="bg-surface rounded-xl border border-border p-5"><form class="space-y-4">${inner}</form></div></div>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonAuthData(): ShowcaseItem[] {
  return [
    // ── LoginForm ─────────────────────────────────────────────────────────────
    {
      id: 'login-form',
      title: 'LoginForm',
      category: 'Domain',
      abbr: 'Lf',
      description: 'Email + password sign-in form with inline validation, "Remember me" checkbox, and server-error banner.',
      filePath: 'modules/domain/common/auth/LoginForm.ejs',
      sourceCode: loginFormSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapForm(`
  ${baseInput({ id: 'e1', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>', required: true })}
  ${baseInput({ id: 'p1', label: 'Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', required: true })}
  <label class="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none"><input type="checkbox" class="h-4 w-4 rounded border-border"> Remember me</label>
  ${submitBtn('Sign In')}`),
          code: `<%- include('modules/domain/common/auth/LoginForm', {
  action: '/auth/login',
  method: 'post'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With error',
          previewHtml: wrapForm(`
  ${errorBanner('Invalid email or password. Please try again.')}
  ${baseInput({ id: 'e2', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>', value: 'user@example.com' })}
  ${baseInput({ id: 'p2', label: 'Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>' })}
  ${submitBtn('Sign In')}`),
          code: `<%- include('modules/domain/common/auth/LoginForm', {
  action: '/auth/login',
  error: 'Invalid email or password. Please try again.'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── RegisterForm ──────────────────────────────────────────────────────────
    {
      id: 'register-form',
      title: 'RegisterForm',
      category: 'Domain',
      abbr: 'Rf',
      description: 'Registration form with email, password, and confirm-password fields. Real-time password match validation and server-error support.',
      filePath: 'modules/domain/common/auth/RegisterForm.ejs',
      sourceCode: registerFormSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapForm(`
  ${baseInput({ id: 're1', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>', required: true })}
  ${baseInput({ id: 'rp1', label: 'Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', hint: 'Minimum 8 characters', required: true })}
  ${baseInput({ id: 'rc1', label: 'Confirm Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', required: true })}
  ${submitBtn('Create Account')}`),
          code: `<%- include('modules/domain/common/auth/RegisterForm', {
  action: '/auth/register',
  method: 'post'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With field errors',
          previewHtml: wrapForm(`
  ${baseInput({ id: 're2', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>', error: 'Enter a valid email address.' })}
  ${baseInput({ id: 'rp2', label: 'Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', error: 'Password must be at least 8 characters.' })}
  ${baseInput({ id: 'rc2', label: 'Confirm Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>' })}
  ${submitBtn('Create Account')}`),
          code: `<%- include('modules/domain/common/auth/RegisterForm', {
  action: '/auth/register',
  errors: {
    email: 'Enter a valid email address.',
    password: 'Password must be at least 8 characters.'
  }
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── ForgotPasswordForm ────────────────────────────────────────────────────
    {
      id: 'forgot-password-form',
      title: 'ForgotPasswordForm',
      category: 'Domain',
      abbr: 'Fp',
      description: 'Email input that triggers a password reset link. Shows an inline success state after submission instead of a redirect.',
      filePath: 'modules/domain/common/auth/ForgotPasswordForm.ejs',
      sourceCode: forgotPasswordSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapForm(`
  ${baseInput({ id: 'fe1', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: '<i class="fa-solid fa-envelope text-xs" aria-hidden="true"></i>', required: true })}
  ${submitBtn('Send reset link')}`),
          code: `<%- include('modules/domain/common/auth/ForgotPasswordForm', {
  action: '/auth/forgot-password'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Sent state',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="bg-surface rounded-xl border border-border p-5"><div class="rounded-lg bg-success-subtle border border-success px-4 py-4 text-sm text-success-fg space-y-1"><p class="font-semibold"><i class="fa-solid fa-circle-check mr-1.5" aria-hidden="true"></i>Check your inbox</p><p>We sent a password reset link to <span class="font-mono">user@example.com</span>.</p></div></div></div>`,
          code: `<%- include('modules/domain/common/auth/ForgotPasswordForm', {
  sent: true,
  email: 'user@example.com'
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── ChangePasswordForm ────────────────────────────────────────────────────
    {
      id: 'change-password-form',
      title: 'ChangePasswordForm',
      category: 'Domain',
      abbr: 'Cp',
      description: 'Current password + new password + confirm fields with match validation and server-error banner.',
      filePath: 'modules/domain/common/auth/ChangePasswordForm.ejs',
      sourceCode: changePasswordSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapForm(`
  ${baseInput({ id: 'cp1', label: 'Current Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', required: true })}
  ${baseInput({ id: 'cp2', label: 'New Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', hint: 'Minimum 8 characters', required: true })}
  ${baseInput({ id: 'cp3', label: 'Confirm New Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', required: true })}
  ${submitBtn('Update Password')}`),
          code: `<%- include('modules/domain/common/auth/ChangePasswordForm', {
  action: '/account/change-password'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'With mismatch error',
          previewHtml: wrapForm(`
  ${baseInput({ id: 'cm1', label: 'Current Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>' })}
  ${baseInput({ id: 'cm2', label: 'New Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>' })}
  ${baseInput({ id: 'cm3', label: 'Confirm New Password', type: 'password', icon: '<i class="fa-solid fa-lock text-xs" aria-hidden="true"></i>', error: "Passwords don't match." })}
  ${submitBtn('Update Password')}`),
          code: `<%- include('modules/domain/common/auth/ChangePasswordForm', {
  action: '/account/change-password',
  errors: { confirmPassword: "Passwords don't match." }
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── OAuthButtons ──────────────────────────────────────────────────────────
    {
      id: 'oauth-buttons',
      title: 'OAuthButtons',
      category: 'Domain',
      abbr: 'Ob',
      description: 'Social sign-in buttons for Google, GitHub, Discord, and Microsoft. Accepts a providers prop to show only a subset.',
      filePath: 'modules/domain/common/auth/OAuthButtons.ejs',
      sourceCode: oauthButtonsSource,
      variants: [
        {
          title: 'All providers',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="flex flex-col gap-2">
  ${outlineBtn('Continue with Google', 'fa-brands fa-google text-[#EA4335]')}
  ${outlineBtn('Continue with GitHub', 'fa-brands fa-github text-text-primary')}
  ${outlineBtn('Continue with Discord', 'fa-brands fa-discord text-[#5865F2]')}
  ${outlineBtn('Continue with Microsoft', 'fa-brands fa-microsoft text-[#00A4EF]')}
</div></div>`,
          code: `<%- include('modules/domain/common/auth/OAuthButtons', {
  action: '/auth/oauth',
  providers: ['google', 'github', 'discord', 'microsoft']
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Google + GitHub only',
          previewHtml: `<div class="p-4 w-full max-w-sm"><div class="flex flex-col gap-2">
  ${outlineBtn('Continue with Google', 'fa-brands fa-google text-[#EA4335]')}
  ${outlineBtn('Continue with GitHub', 'fa-brands fa-github text-text-primary')}
</div></div>`,
          code: `<%- include('modules/domain/common/auth/OAuthButtons', {
  action: '/auth/oauth',
  providers: ['google', 'github']
}) %>`,
          layout: 'stack',
        },
      ],
    },

    // ── SessionExpiredBanner ──────────────────────────────────────────────────
    {
      id: 'session-expired-banner',
      title: 'SessionExpiredBanner',
      category: 'Domain',
      abbr: 'Se',
      description: 'Warning banner shown when the user session has expired. Includes a "Sign in again" action button.',
      filePath: 'modules/domain/common/auth/SessionExpiredBanner.ejs',
      sourceCode: sessionExpiredSource,
      variants: [
        {
          title: 'Default',
          previewHtml: `<div class="p-4 w-full max-w-lg"><div role="alert" class="flex items-start sm:items-center justify-between gap-4 flex-wrap rounded-lg border border-warning bg-warning-subtle px-4 py-3"><div class="flex items-start gap-3 min-w-0"><i class="fa-solid fa-clock text-warning shrink-0 mt-0.5 text-xl" aria-hidden="true"></i><div class="min-w-0"><p class="text-sm font-semibold text-text-primary">Session expired</p><p class="text-sm text-text-secondary mt-0.5">Your session has expired. Please sign in again to continue.</p></div></div><a href="#" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm shrink-0">Sign in again</a></div></div>`,
          code: `<%- include('modules/domain/common/auth/SessionExpiredBanner', {
  loginUrl: '/auth/login'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Custom message',
          previewHtml: `<div class="p-4 w-full max-w-lg"><div role="alert" class="flex items-start sm:items-center justify-between gap-4 flex-wrap rounded-lg border border-warning bg-warning-subtle px-4 py-3"><div class="flex items-start gap-3 min-w-0"><i class="fa-solid fa-clock text-warning shrink-0 mt-0.5 text-xl" aria-hidden="true"></i><div class="min-w-0"><p class="text-sm font-semibold text-text-primary">Session expired</p><p class="text-sm text-text-secondary mt-0.5">You have been inactive for 30 minutes. Reconnect to continue your work.</p></div></div><a href="#" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors bg-primary text-primary-fg hover:bg-primary-hover px-3 py-1.5 text-sm shrink-0">Sign in again</a></div></div>`,
          code: `<%- include('modules/domain/common/auth/SessionExpiredBanner', {
  loginUrl: '/auth/login',
  message: 'You have been inactive for 30 minutes. Reconnect to continue your work.'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
