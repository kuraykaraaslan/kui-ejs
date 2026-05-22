import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/InlineAlert.ejs'), 'utf-8');

const variantMap: Record<string, { container: string; icon: string }> = {
  success: { container: 'bg-success-subtle border-success text-success-fg',   icon: 'fa-check' },
  error:   { container: 'bg-error-subtle border-error text-error',            icon: 'fa-xmark' },
  warning: { container: 'bg-warning-subtle border-warning text-text-primary', icon: 'fa-triangle-exclamation' },
  info:    { container: 'bg-info-subtle border-info text-text-primary',       icon: 'fa-circle-info' },
};

const alert = (variant: keyof typeof variantMap, message: string) => {
  const vm = variantMap[variant];
  return `<div class="rounded-lg border px-4 py-2.5 text-sm font-medium flex items-center gap-1.5 ${vm.container}">
  <span aria-hidden="true" class="w-3.5 h-3.5 inline-flex items-center justify-center shrink-0">
    <i class="fa-solid ${vm.icon}" style="font-size:14px"></i>
  </span>
  <span>${message}</span>
</div>`;
};

export function buildInlineAlertData(): ShowcaseItem[] {
  return [
    {
      id: 'inline-alert',
      title: 'InlineAlert',
      category: 'App',
      abbr: 'IA',
      description: 'Compact inline alert strip used next to form fields or inside cards. success / error / warning / info variants; icon + single-line message.',
      filePath: 'modules/app/InlineAlert.ejs',
      sourceCode,
      variants: [
        {
          title: 'All variants',
          previewHtml: `<div class="p-4 w-full max-w-md space-y-3">
  ${alert('success', 'Settings saved successfully.')}
  ${alert('error',   'Failed to save. Check your input and try again.')}
  ${alert('warning', 'Your subscription expires in 3 days.')}
  ${alert('info',    'A new version is available — refresh to update.')}
</div>`,
          code: `<%- include('modules/app/InlineAlert', { variant: 'success', message: 'Settings saved successfully.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'error',   message: 'Failed to save. Check your input and try again.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'warning', message: 'Your subscription expires in 3 days.' }) %>
<%- include('modules/app/InlineAlert', { variant: 'info',    message: 'A new version is available — refresh to update.' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Below a form field',
          previewHtml: `<div class="p-4 w-full max-w-md space-y-2">
  <label class="block text-sm font-medium text-text-primary">Email address</label>
  <input type="email" value="not-an-email" class="w-full rounded-md border border-error bg-surface-base px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus" />
  ${alert('error', 'Please enter a valid email address.')}
</div>`,
          code: `<div class="space-y-2">
  <%- include('modules/ui/Input', { label: 'Email address', type: 'email', value: form.email, error: !!errors.email }) %>
  <% if (errors.email) { %>
    <%- include('modules/app/InlineAlert', { variant: 'error', message: errors.email }) %>
  <% } %>
</div>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
