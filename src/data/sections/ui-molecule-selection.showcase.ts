import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const selectSource        = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Select.ejs'), 'utf-8');
const radioGroupSource    = fs.readFileSync(path.join(process.cwd(), 'modules/ui/RadioGroup.ejs'), 'utf-8');
const checkboxGroupSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/CheckboxGroup.ejs'), 'utf-8');

const wrapW = (inner: string) => `<div class="flex items-start justify-center p-4 w-full max-w-xs">${inner}</div>`;
const wrapFull = (inner: string) => `<div class="p-4 w-full">${inner}</div>`;

function selectEl(opts: {label?: string; placeholder?: string; hint?: string; error?: string; disabled?: boolean; options: {value: string; label: string}[]; value?: string}) {
  const id = `sel-${Math.random().toString(36).substr(2,5)}`;
  const baseClass = "block w-full rounded-md border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken transition-colors px-3 py-2 text-sm pr-8";
  const stateClass = opts.error
    ? "border-error focus:border-error focus:ring-error/20"
    : "border-border focus:border-primary hover:border-text-tertiary";
  const optionsHtml = opts.options.map(o =>
    `<option value="${o.value}"${opts.value === o.value ? ' selected' : ''}>${o.label}</option>`
  ).join('');
  const placeholder = opts.placeholder ? `<option value="">${opts.placeholder}</option>` : '';
  return `<div class="w-full">
  ${opts.label ? `<label for="${id}" class="block text-sm font-medium text-text-primary mb-1.5">${opts.label}</label>` : ''}
  <div class="relative">
    <select id="${id}" class="${baseClass} ${stateClass}"${opts.disabled ? ' disabled' : ''}>
      ${placeholder}${optionsHtml}
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
      <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
    </div>
  </div>
  ${opts.hint && !opts.error ? `<p class="mt-1.5 text-sm text-text-secondary">${opts.hint}</p>` : ''}
  ${opts.error ? `<p class="mt-1.5 text-sm text-error">${opts.error}</p>` : ''}
</div>`;
}

function radioGroupEl(opts: {legend?: string; name: string; options: {value: string; label: string; hint?: string}[]; value?: string; disabled?: boolean; cardStyle?: boolean}) {
  const radios = opts.options.map(opt => {
    const checked = opts.value === opt.value ? 'checked' : '';
    if (opts.cardStyle) {
      const active = opts.value === opt.value;
      return `<label class="flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${active ? 'border-primary bg-primary-subtle' : 'border-border bg-surface hover:bg-surface-overlay'}${opts.disabled ? ' opacity-50 cursor-not-allowed' : ''}">
      <input type="radio" name="${opts.name}" value="${opt.value}" ${checked}${opts.disabled ? ' disabled' : ''} class="mt-0.5 h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary/20">
      <div>
        <span class="text-sm font-medium ${active ? 'text-primary' : 'text-text-primary'}">${opt.label}</span>
        ${opt.hint ? `<p class="text-xs text-text-secondary mt-0.5">${opt.hint}</p>` : ''}
      </div>
    </label>`;
    }
    return `<label class="flex items-start gap-2 cursor-pointer${opts.disabled ? ' opacity-50 cursor-not-allowed' : ''}">
      <input type="radio" name="${opts.name}" value="${opt.value}" ${checked}${opts.disabled ? ' disabled' : ''} class="mt-0.5 h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary/20">
      <div>
        <span class="text-sm text-text-primary">${opt.label}</span>
        ${opt.hint ? `<p class="text-xs text-text-secondary">${opt.hint}</p>` : ''}
      </div>
    </label>`;
  }).join('\n    ');
  return `<fieldset>
  ${opts.legend ? `<legend class="text-sm font-medium text-text-primary mb-3">${opts.legend}</legend>` : ''}
  <div class="space-y-2">
    ${radios}
  </div>
</fieldset>`;
}

function checkboxGroupEl(opts: {legend?: string; options: {value: string; label: string}[]; selected: string[]; disabled?: boolean}) {
  const chips = opts.options.map(opt => {
    const isSelected = opts.selected.includes(opt.value);
    const stateClass = isSelected
      ? 'bg-primary-subtle border-primary text-primary'
      : 'bg-surface border-border text-text-primary hover:bg-surface-overlay';
    return `<label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer${opts.disabled ? ' opacity-50 cursor-not-allowed' : ''} ${stateClass}">
      <input type="checkbox" value="${opt.value}" class="sr-only"${isSelected ? ' checked' : ''}${opts.disabled ? ' disabled' : ''}>
      ${isSelected ? '<i class="fa-solid fa-check text-xs" aria-hidden="true"></i>' : ''}
      <span>${opt.label}</span>
    </label>`;
  }).join('\n    ');
  return `<fieldset>
  ${opts.legend ? `<legend class="text-sm font-medium text-text-primary mb-3">${opts.legend}</legend>` : ''}
  <div class="flex flex-wrap gap-2">
    ${chips}
  </div>
</fieldset>`;
}

const ROLES = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest',  label: 'Guest'  },
];

const PLANS = [
  { value: 'free',  label: 'Free',  hint: '$0/mo · 3 projects, 1 seat' },
  { value: 'pro',   label: 'Pro',   hint: '$12/mo · Unlimited projects' },
  { value: 'team',  label: 'Team',  hint: '$49/mo · 10 seats included'  },
];

const NOTIFY_OPTS = [
  { value: 'email', label: 'Email', hint: 'Sent to your primary email' },
  { value: 'sms',   label: 'SMS' },
  { value: 'none',  label: 'None' },
];

export function buildMoleculeSelectionData(): ShowcaseItem[] {
  return [
    {
      id: 'select',
      title: 'Select',
      category: 'Molecule',
      abbr: 'Sl',
      description: 'Label + select + hint + error anatomy. appearance-none overrides the native dropdown style and renders a chevron icon.',
      filePath: 'modules/ui/Select.ejs',
      sourceCode: selectSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapW(selectEl({ label: 'Role', placeholder: 'Select a role…', options: ROLES })),
          code: `<%- include('modules/ui/Select', {
  label: 'Role',
  placeholder: 'Select a role…',
  options: [
    { value: 'admin',  label: 'Admin'  },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]
}) %>`,
        },
        {
          title: 'With hint & selected value',
          previewHtml: wrapW(selectEl({ label: 'Role', hint: 'Determines access level.', options: ROLES, value: 'editor' })),
          code: `<%- include('modules/ui/Select', {
  label: 'Role',
  hint: 'Determines access level.',
  value: 'editor',
  options: ROLES
}) %>`,
        },
        {
          title: 'Error state',
          previewHtml: wrapW(selectEl({ label: 'Plan', placeholder: 'Select a plan', error: 'Please select a plan.', options: ROLES })),
          code: `<%- include('modules/ui/Select', {
  label: 'Plan',
  placeholder: 'Select a plan',
  required: true,
  error: 'Please select a plan.',
  options: PLANS
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapW(selectEl({ label: 'Plan', options: ROLES, value: 'editor', disabled: true })),
          code: `<%- include('modules/ui/Select', { label: 'Plan', disabled: true, value: 'editor', options: ROLES }) %>`,
        },
      ],
    },
    {
      id: 'radio-group',
      title: 'RadioGroup',
      category: 'Molecule',
      abbr: 'Rg',
      description: 'fieldset + legend based radio group. WCAG-compliant keyboard navigation with an optional card-style variant.',
      filePath: 'modules/ui/RadioGroup.ejs',
      sourceCode: radioGroupSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapW(radioGroupEl({ name: 'rg-notify', legend: 'Notification preference', options: NOTIFY_OPTS })),
          code: `<%- include('modules/ui/RadioGroup', {
  name: 'notify',
  legend: 'Notification preference',
  options: [
    { value: 'email', label: 'Email', hint: 'Sent to your primary email' },
    { value: 'sms',   label: 'SMS' },
    { value: 'none',  label: 'None' },
  ]
}) %>`,
        },
        {
          title: 'With selected value',
          previewHtml: wrapW(radioGroupEl({ name: 'rg-notify2', legend: 'Notification preference', options: NOTIFY_OPTS, value: 'email' })),
          code: `<%- include('modules/ui/RadioGroup', {
  name: 'notify',
  legend: 'Notification preference',
  value: 'email',
  options: NOTIFY_OPTS
}) %>`,
        },
        {
          title: 'Card style',
          previewHtml: wrapW(radioGroupEl({ name: 'rg-plan', legend: 'Choose plan', options: PLANS, value: 'pro', cardStyle: true })),
          code: `<%- include('modules/ui/RadioGroup', {
  name: 'plan',
  legend: 'Choose plan',
  value: 'pro',
  cardStyle: true,
  options: [
    { value: 'free', label: 'Free', hint: '$0/mo · 3 projects' },
    { value: 'pro',  label: 'Pro',  hint: '$12/mo · Unlimited'  },
    { value: 'team', label: 'Team', hint: '$49/mo · 10 seats'   },
  ]
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapW(radioGroupEl({ name: 'rg-dis', legend: 'Notification preference', options: NOTIFY_OPTS.slice(0, 2), value: 'email', disabled: true })),
          code: `<%- include('modules/ui/RadioGroup', { name: 'notify', legend: 'Notification preference', value: 'email', disabled: true, options: NOTIFY_OPTS }) %>`,
        },
      ],
    },
    {
      id: 'checkbox-group',
      title: 'CheckboxGroup',
      category: 'Molecule',
      abbr: 'Cg',
      description: 'Chip-style multi-select group. Selected chips use bg-primary-subtle / border-primary tokens. Keyboard accessible.',
      filePath: 'modules/ui/CheckboxGroup.ejs',
      sourceCode: checkboxGroupSource,
      variants: [
        {
          title: 'Default',
          previewHtml: wrapFull(checkboxGroupEl({
            legend: 'Tech stack',
            options: [
              { value: 'react',      label: 'React'      },
              { value: 'vue',        label: 'Vue'        },
              { value: 'angular',    label: 'Angular'    },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'nodejs',     label: 'Node.js'    },
            ],
            selected: ['react', 'typescript'],
          })),
          code: `<%- include('modules/ui/CheckboxGroup', {
  legend: 'Tech stack',
  options: [
    { value: 'react',      label: 'React'      },
    { value: 'vue',        label: 'Vue'        },
    { value: 'typescript', label: 'TypeScript' },
  ],
  selected: ['react', 'typescript']
}) %>`,
        },
        {
          title: 'Disabled',
          previewHtml: wrapFull(checkboxGroupEl({
            legend: 'Permissions',
            options: [
              { value: 'read',   label: 'Read'   },
              { value: 'write',  label: 'Write'  },
              { value: 'delete', label: 'Delete' },
            ],
            selected: ['read'],
            disabled: true,
          })),
          code: `<%- include('modules/ui/CheckboxGroup', {
  legend: 'Permissions',
  options: [
    { value: 'read',   label: 'Read'   },
    { value: 'write',  label: 'Write'  },
    { value: 'delete', label: 'Delete' },
  ],
  selected: ['read'],
  disabled: true
}) %>`,
        },
        {
          title: 'Empty selection',
          previewHtml: wrapFull(checkboxGroupEl({
            legend: 'Tags',
            options: [
              { value: 'design',   label: 'Design'   },
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend',  label: 'Backend'  },
              { value: 'devops',   label: 'DevOps'   },
            ],
            selected: [],
          })),
          code: `<%- include('modules/ui/CheckboxGroup', {
  legend: 'Tags',
  options: [
    { value: 'design',   label: 'Design'   },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend',  label: 'Backend'  },
  ],
  selected: []
}) %>`,
        },
      ],
    },
  ];
}
