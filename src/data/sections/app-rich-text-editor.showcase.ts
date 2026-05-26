import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render path goes through the shim so the include() inside resolves the
// split folder partials/JS correctly. The displayed sourceCode is the
// orchestrator entry (RichTextEditor/index.ejs).
const editorTemplatePath = path.join(process.cwd(), 'modules/app/RichTextEditor.ejs');
const editorIndexPath    = path.join(process.cwd(), 'modules/app/RichTextEditor/index.ejs');
const renderSource       = fs.readFileSync(editorTemplatePath, 'utf-8');
const sourceCode         = fs.readFileSync(editorIndexPath,    'utf-8');

function renderEditor(locals: Record<string, unknown>): string {
  return ejs.render(renderSource, locals, { filename: editorTemplatePath });
}

const SAMPLE_HTML = `<h1>Release notes</h1>` +
  `<p>This week we shipped <strong>three</strong> things you should know about.</p>` +
  `<h2>New features</h2>` +
  `<ul>` +
    `<li>Inline <em>image upload</em> in the editor toolbar.</li>` +
    `<li>Block-level <code>code</code> snippets with syntax highlighting.</li>` +
    `<li>Read-only mode for archived documents.</li>` +
  `</ul>` +
  `<blockquote>Pixel parity between the React and EJS sibling components is now enforced.</blockquote>` +
  `<p>Read the <a href="https://example.com/changelog">full changelog</a> for the rest.</p>`;

const SAMPLE_MENTIONS = [
  { id: 'u1', label: 'Jane Doe',     description: 'Product designer' },
  { id: 'u2', label: 'John Smith',   description: 'Engineer' },
  { id: 'u3', label: 'Ada Lovelace', description: 'CTO' },
  { id: 'u4', label: 'Alan Turing',  description: 'Founder' },
  { id: 'u5', label: 'Grace Hopper', description: 'VP Engineering' },
];

const SAMPLE_SLASH = [
  { id: 'h1',    label: 'Heading 1',    description: 'Big section title',   command: 'header:1' },
  { id: 'h2',    label: 'Heading 2',    description: 'Medium title',        command: 'header:2' },
  { id: 'list',  label: 'Bullet list',  description: 'Unordered list',      command: 'list:bullet' },
  { id: 'quote', label: 'Quote',        description: 'Block quote',         command: 'blockquote' },
  { id: 'code',  label: 'Code block',   description: 'Monospaced block',    command: 'code-block' },
  { id: 'hr',    label: 'Divider',      description: 'Horizontal rule',     command: 'hr' },
];

function wrap(html: string): string {
  return `<div class="w-full max-w-2xl">${html}</div>`;
}

function actionsHtml(id: string): string {
  return `<div class="flex flex-wrap gap-2 mt-2">
    <button type="button" class="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-surface-overlay" onclick="window.KuiRte.get('${id}').focus()">Focus</button>
    <button type="button" class="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-surface-overlay" onclick="window.KuiRte.get('${id}').clear()">Clear</button>
    <button type="button" class="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-surface-overlay" onclick="window.KuiRte.get('${id}').insertHTML('<p><strong>Inserted</strong> via API.</p>')">Insert HTML</button>
    <button type="button" class="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-surface-overlay" onclick="alert(window.KuiRte.get('${id}').getText())">Read plain text</button>
  </div>`;
}

export function buildAppRichTextEditorData(): ShowcaseItem[] {
  return [
    {
      id: 'rich-text-editor',
      title: 'RichTextEditor',
      category: 'App',
      abbr: 'RT',
      description:
        'Quill 2.x WYSIWYG with token-tinted snow theme. Production features: controlled value (via `kui-rte:set-html` event), imperative API via `window.KuiRte.get(id)`, name+hidden-form-sync, drag-and-drop image upload (with `imageUploadFn` global override), paste sanitization (Word / GDocs cleanup), char + word counter with maxLength, autosave to localStorage, markdown shortcuts, color + highlight, sub/sup, indent/outdent, horizontal rule, tables, emoji picker, @-mentions, /-slash command menu, selection bubble menu, image resize/align overlay, fullscreen mode. Pixel-identical React sibling at modules/app/RichTextEditor/index.tsx.',
      filePath: 'modules/app/RichTextEditor/index.ejs',
      sourceCode,
      since: '2026-05',
      variants: [
        {
          title: 'Empty + counter',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-empty',
            name: 'rte-demo-empty',
            label: 'Article body',
            hint: 'Use the toolbar — markdown shortcuts work too: try **bold** or # heading.',
            value: '',
            placeholder: 'Start writing your article…',
            readOnly: false,
            minHeight: 180,
            showCounter: true,
            showWordCount: true,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'article-body',
  name: 'body',
  label: 'Article body',
  showCounter: true,
  showWordCount: true
}) %>`,
        },
        {
          title: 'Pre-populated',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-prefilled',
            name: 'rte-demo-prefilled',
            label: 'Release notes',
            value: SAMPLE_HTML,
            readOnly: false,
            minHeight: 220,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'release-notes',
  name: 'releaseNotes',
  label: 'Release notes',
  value: '<h1>Release notes</h1><p>...</p>'
}) %>`,
        },
        {
          title: 'Read-only',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-readonly',
            name: 'rte-demo-readonly',
            label: 'Archived document',
            hint: 'This document is read-only.',
            value: SAMPLE_HTML,
            readOnly: true,
            minHeight: 220,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'archived',
  name: 'archived',
  label: 'Archived document',
  value: savedHtml,
  readOnly: true
}) %>`,
        },
        {
          title: 'Max length (200 chars)',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-maxlen',
            name: 'rte-demo-maxlen',
            label: 'Short summary',
            hint: 'Maximum 200 characters.',
            maxLength: 200,
            showCounter: true,
            minHeight: 120,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'short-summary',
  name: 'summary',
  label: 'Short summary',
  maxLength: 200,
  showCounter: true
}) %>`,
        },
        {
          title: 'Mentions + slash commands',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-mention',
            name: 'rte-demo-mention',
            label: 'Comment',
            hint: 'Type @ to mention a teammate, or / to insert a block.',
            placeholder: 'Try typing @ or / …',
            mentions: SAMPLE_MENTIONS,
            slashItems: SAMPLE_SLASH,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'comment',
  name: 'comment',
  label: 'Comment',
  mentions: [
    { id: 'u1', label: 'Jane Doe', description: 'Designer' },
    { id: 'u2', label: 'John Smith', description: 'Engineer' }
  ],
  slashItems: [
    { id: 'h1',   label: 'Heading 1',   command: 'header:1' },
    { id: 'list', label: 'Bullet list', command: 'list:bullet' },
    { id: 'hr',   label: 'Divider',     command: 'hr' }
  ]
}) %>`,
        },
        {
          title: 'Imperative ref API',
          layout: 'stack',
          previewHtml: wrap(
            renderEditor({
              id: 'rte-demo-imperative',
              name: 'rte-demo-imperative',
              label: 'Imperative handle',
              value: '<p>Click the buttons below to drive this editor programmatically.</p>',
              minHeight: 160,
            }) + actionsHtml('rte-demo-imperative')
          ),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'reply', name: 'reply', value: '<p>Hello</p>'
}) %>

<script>
  var api = window.KuiRte.get('reply');
  api.focus();
  api.insertHTML('<p>Hi!</p>');
  var text = api.getText();
</script>`,
        },
        {
          title: 'Form integration',
          layout: 'stack',
          previewHtml: wrap(
            `<form onsubmit="event.preventDefault(); var fd = new FormData(this); document.getElementById('rte-demo-form-out').textContent = String(fd.get('body') || '');" class="space-y-2">` +
              renderEditor({
                id: 'rte-demo-form',
                name: 'body',
                label: 'Description',
                value: '<p>This editor syncs to a hidden input.</p>',
                minHeight: 120,
              }) +
              `<button type="submit" class="px-4 py-2 rounded-md bg-primary text-primary-fg hover:bg-primary-hover text-sm font-medium">Submit</button>` +
              `<pre id="rte-demo-form-out" class="text-[10px] leading-snug bg-surface-sunken text-text-secondary p-2 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap break-words"></pre>` +
            `</form>`
          ),
          code: `<form action="/api/post" method="post">
  <%- include('modules/app/RichTextEditor', {
    id: 'post', name: 'body', value: savedHtml
  }) %>
  <button type="submit">Save</button>
</form>`,
        },
        {
          title: 'Autosave',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-autosave',
            name: 'rte-demo-autosave',
            label: 'Draft (auto-saved to localStorage)',
            hint: "Your changes survive page refresh — key: 'demo-draft'.",
            autosaveKey: 'demo-draft',
            placeholder: 'Type, then refresh the page to verify autosave…',
            minHeight: 140,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'draft', name: 'draft', autosaveKey: 'my-draft'
}) %>`,
        },
      ],
    },
  ];
}
