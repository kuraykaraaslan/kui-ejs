import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

const editorTemplatePath = path.join(process.cwd(), 'modules/app/RichTextEditor.ejs');
const sourceCode = fs.readFileSync(editorTemplatePath, 'utf-8');

function renderEditor(locals: Record<string, unknown>): string {
  return ejs.render(sourceCode, locals, { filename: editorTemplatePath });
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

function wrap(html: string): string {
  return `<div class="w-full max-w-2xl">${html}</div>`;
}

export function buildAppRichTextEditorData(): ShowcaseItem[] {
  return [
    {
      id: 'rich-text-editor',
      title: 'RichTextEditor',
      category: 'App',
      abbr: 'RT',
      description:
        'WYSIWYG editor for long-form prose. Built on Quill 2.x — the same library powers the NextJS sibling so output HTML is identical. Toolbar covers bold/italic/underline/strike/inline code, headings, blockquote, code block, lists, link, image (via Modal + file upload as data URL), text align, clear formatting, undo/redo.',
      filePath: 'modules/app/RichTextEditor.ejs',
      sourceCode,
      since: '2026-05',
      variants: [
        {
          title: 'Empty',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'rte-demo-empty',
            name: 'rte-demo-empty',
            label: 'Article body',
            hint: 'Use the toolbar to format your text.',
            value: '',
            placeholder: 'Start writing your article…',
            readOnly: false,
            minHeight: 180,
          })),
          code: `<%- include('modules/app/RichTextEditor', {
  id: 'article-body',
  name: 'body',
  label: 'Article body',
  hint: 'Use the toolbar to format your text.',
  placeholder: 'Start writing your article…'
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
  hint: 'This document is read-only.',
  value: savedHtml,
  readOnly: true
}) %>`,
        },
      ],
    },
  ];
}
