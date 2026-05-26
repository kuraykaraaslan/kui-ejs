import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render the editor + renderer through their shim modules.
const builderShim  = path.join(process.cwd(), 'modules/app/FormBuilder.ejs');
const builderIndex = path.join(process.cwd(), 'modules/app/FormBuilder/FormBuilder.ejs');
const rendererShim = path.join(process.cwd(), 'modules/app/FormRenderer.ejs');
const builderSrc   = fs.readFileSync(builderShim,  'utf-8');
const rendererSrc  = fs.readFileSync(rendererShim, 'utf-8');
const sourceCode   = fs.readFileSync(builderIndex, 'utf-8');

function renderBuilder(locals: Record<string, unknown>): string {
  return ejs.render(builderSrc, locals, { filename: builderShim });
}
function renderRenderer(locals: Record<string, unknown>): string {
  return ejs.render(rendererSrc, locals, { filename: rendererShim });
}

const STARTER_SCHEMA = {
  id: 'starter',
  title: 'Contact form',
  description: 'Drag fields from the palette to extend this form.',
  fields: [
    { id: 'f1', type: 'text',  name: 'name',    label: 'Your name',    placeholder: 'Ada Lovelace',     required: true },
    { id: 'f2', type: 'email', name: 'email',   label: 'Email',        placeholder: 'name@example.com', required: true },
    { id: 'f3', type: 'select',name: 'topic',   label: 'Topic',        required: true,
      options: [
        { label: 'Sales',    value: 'sales' },
        { label: 'Support',  value: 'support' },
        { label: 'Feedback', value: 'feedback' },
      ] },
    { id: 'f4', type: 'textarea', name: 'message', label: 'Message', helperText: 'Up to 500 characters.', required: true },
    { id: 'f5', type: 'checkbox', name: 'consent', label: 'I agree to the privacy policy', required: true },
  ],
};

function wrap(html: string): string {
  return `<div class="w-full">${html}</div>`;
}

export function buildAppFormBuilderData(): ShowcaseItem[] {
  return [
    {
      id: 'form-builder',
      title: 'FormBuilder',
      category: 'App',
      abbr: 'FB',
      description:
        'Typeform / JotForm-style drag-to-build form designer. M1 ships the field palette (text / email / number / textarea / select / radio / checkbox / date / file — multiselect / signature / rating are palette stubs), a draggable canvas with reorder + duplicate + delete, a right-hand settings panel (label, name, placeholder, helper text, required, default value, options), JSON schema export / import, and a paired FormRenderer with required + email-format validation. Future milestones: full validation engine + custom validators (M2), conditional logic editor + runtime AST eval (M3), multi-page + save & resume (M4), schema I/O + webhooks + signature / rating (M5), full WAI-ARIA / keyboard parity + i18n + theming (M6). Pixel-identical React sibling at modules/app/FormBuilder/index.tsx.',
      filePath: 'modules/app/FormBuilder/FormBuilder.ejs',
      sourceCode,
      since: '2026-05',
      status: 'beta',
      composes: ['button', 'input', 'checkbox', 'select', 'textarea'],
      designTokens: [
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-strong', '--border-focus',
        '--primary', '--primary-hover', '--primary-active', '--primary-fg',
        '--error', '--error-subtle',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['application', 'list', 'listitem', 'radiogroup', 'alert'],
        keyboardInteractions: [
          { keys: 'Tab',          action: 'Move focus across palette / canvas / settings' },
          { keys: 'Enter / Space', action: 'Activate palette item to append a field' },
          { keys: 'Drag (mouse)',  action: 'Drag from palette → drop into canvas; reorder by dragging the grip handle' },
        ],
        notes:
          'Builder root is role="application" with aria-label. Canvas list is role="list"; each draggable card is role="listitem" with aria-current when selected. FormRenderer adds aria-required + aria-invalid + aria-describedby per field, and surfaces validation messages with role="alert". Keyboard reorder + LiveRegion announcements land in M6.',
      },
      variants: [
        {
          title: 'Builder (drag + edit)',
          layout: 'stack',
          previewHtml: wrap(renderBuilder({
            id: 'fb-demo-basic',
            schema: STARTER_SCHEMA,
          })),
          code: `<%- include('modules/app/FormBuilder', {
  id: 'contact-builder',
  schema: {
    id: 'contact',
    title: 'Contact form',
    fields: [
      { id: 'f1', type: 'text',  name: 'name',  label: 'Your name', required: true },
      { id: 'f2', type: 'email', name: 'email', label: 'Email',     required: true }
    ]
  }
}) %>

<script>
  // Read or replace the live schema:
  var api = window.KuiFormBuilder['contact-builder'];
  console.log(api.getSchema());
</script>`,
        },
        {
          title: 'Builder + live FormRenderer',
          layout: 'stack',
          previewHtml: wrap(
            renderBuilder({ id: 'fb-demo-paired-b', schema: STARTER_SCHEMA }) +
            renderRenderer({ id: 'fr-demo-paired',  schema: STARTER_SCHEMA }),
          ),
          code: `<%- include('modules/app/FormBuilder', { id: 'b', schema: schema }) %>
<%- include('modules/app/FormRenderer', { id: 'r', schema: schema }) %>

<script>
  document.getElementById('r').addEventListener('KuiFormRenderer:r:submit', function (e) {
    fetch('/api/submit', { method: 'POST', body: JSON.stringify(e.detail.values) });
  });
</script>`,
        },
        {
          title: 'Standalone renderer (required + email validation)',
          layout: 'stack',
          previewHtml: wrap(renderRenderer({ id: 'fr-demo-standalone', schema: STARTER_SCHEMA })),
          code: `<%- include('modules/app/FormRenderer', {
  id: 'contact-form',
  schema: schema
}) %>

<script>
  document.getElementById('contact-form')
    .addEventListener('KuiFormRenderer:contact-form:submit', function (e) {
      console.log('values', e.detail.values);
    });
</script>`,
        },
      ],
    },
  ];
}
