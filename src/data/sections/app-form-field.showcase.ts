import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/FormField.ejs'), 'utf-8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseInput = 'block w-full rounded-md border bg-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm';

const wrap = (inner: string) =>
  `<div class="p-4 w-full max-w-md">${inner}</div>`;

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAppFormFieldData(): ShowcaseItem[] {
  return [
    {
      id: 'form-field',
      title: 'FormField',
      category: 'App',
      abbr: 'FF',
      description: 'Form alanı wrapper\'ı: label + slot + hint + error. Computed `id`, `aria-describedby` ve `aria-invalid` değerlerini sarmalayan `data-form-field` üzerinden expose eder. NextJS\'deki react-hook-form karşıtının statik EJS muadili.',
      filePath: 'modules/app/FormField.ejs',
      sourceCode,
      variants: [
        {
          title: 'With hint',
          previewHtml: wrap(`<div class="flex flex-col gap-1.5">
  <label for="email" class="text-sm font-medium text-text-primary">Email</label>
  <div data-form-field data-input-id="email" aria-describedby="email-hint" aria-invalid="false">
    <input id="email" name="email" type="email" placeholder="you@example.com" class="${baseInput} border-border" />
  </div>
  <p id="email-hint" class="text-xs text-text-secondary">We'll never share your email.</p>
</div>`),
          code: `<%- include('modules/app/FormField', {
  name:  'email',
  label: 'Email',
  hint:  "We'll never share your email.",
  children: \`<input id="email" name="email" type="email"
    placeholder="you@example.com"
    class="block w-full rounded-md border border-border bg-surface text-text-primary px-3 py-2 text-sm" />\`
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Required with error',
          previewHtml: wrap(`<div class="flex flex-col gap-1.5">
  <label for="password" class="text-sm font-medium text-text-primary after:content-['*'] after:ml-0.5 after:text-error">Password</label>
  <div data-form-field data-input-id="password" aria-describedby="password-error" aria-invalid="true">
    <input id="password" name="password" type="password" value="abc" aria-invalid="true" class="${baseInput} border-error focus:ring-error/20" />
  </div>
  <p id="password-error" role="alert" class="text-xs text-error">Password must be at least 8 characters.</p>
</div>`),
          code: `<%- include('modules/app/FormField', {
  name:     'password',
  label:    'Password',
  required: true,
  error:    'Password must be at least 8 characters.',
  children: \`<input id="password" name="password" type="password"
    aria-invalid="true"
    class="block w-full rounded-md border border-error bg-surface text-text-primary px-3 py-2 text-sm" />\`
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
