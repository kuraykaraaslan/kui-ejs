import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';
import * as ejs  from 'ejs';

// Render via the top-level shim so the inner CodeEditor.ejs `include()`
// calls resolve relative to the modules/ui/CodeEditor/ folder. The
// `sourceCode` we display is the orchestrator file.
const editorTemplatePath = path.join(process.cwd(), 'modules/ui/CodeEditor.ejs');
const editorMainPath     = path.join(process.cwd(), 'modules/ui/CodeEditor/CodeEditor.ejs');
const renderSource       = fs.readFileSync(editorTemplatePath, 'utf-8');
const sourceCode         = fs.readFileSync(editorMainPath,     'utf-8');

function renderEditor(locals: Record<string, unknown>): string {
  return ejs.render(renderSource, locals, { filename: editorTemplatePath });
}

const SAMPLE_JS = `// Fibonacci sequence
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(fib(i));
}`;

const SAMPLE_MD = `# Hello CodeEditor

Edit this markdown — line numbers update live.

- Lightweight CodeMirror fallback engine
- Token-based theming via CSS variables
- Future: Monaco opt-in, diagnostics, autocomplete
`;

function wrap(html: string): string {
  return `<div class="w-full max-w-2xl">${html}</div>`;
}

export function buildAppCodeEditorData(): ShowcaseItem[] {
  return [
    {
      id: 'code-editor',
      title: 'CodeEditor',
      category: 'App',
      abbr: 'CE',
      description:
        'Engine-agnostic code editor primitive. M1 ships a lightweight CodeMirror-style fallback engine (textarea + line-number gutter + active-line + theme + readonly + placeholder) so the public API is stable today. Future milestones: Monaco (VSCode) lazy engine, find/replace, multi-cursor, diagnostics (markers), custom autocomplete + hover, minimap, code folding, vim/emacs keymap. Pixel-identical React sibling at modules/ui/CodeEditor/index.tsx. Used by RulesetEditor M3 + RichTextEditor code-block insert (planned).',
      filePath: 'modules/ui/CodeEditor/CodeEditor.ejs',
      sourceCode,
      since: '2026-05',
      designTokens: [
        '--surface-base', '--surface-raised', '--surface-overlay', '--surface-sunken',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-strong', '--border-focus', '--error',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['textbox'],
        keyboardInteractions: [
          { keys: 'Tab',          action: 'Move focus into / out of the editor' },
          { keys: 'Arrow keys',   action: 'Move caret + sync active line gutter' },
          { keys: 'Ctrl/Cmd + Z', action: 'Browser-native undo (M1 textarea fallback)' },
        ],
      },
      variants: [
        {
          title: 'JavaScript readonly',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'ce-demo-js',
            label: 'example.js',
            hint: 'Read-only JavaScript snippet with line numbers.',
            value: SAMPLE_JS,
            language: 'js',
            theme: 'light',
            readonly: true,
            showLineNumbers: true,
            minHeight: 220,
          })),
          code: `<%- include('modules/ui/CodeEditor', {
  id: 'example',
  label: 'example.js',
  language: 'js',
  theme: 'light',
  value: source,
  readonly: true,
  showLineNumbers: true
}) %>`,
        },
        {
          title: 'Markdown editable',
          layout: 'stack',
          previewHtml: wrap(renderEditor({
            id: 'ce-demo-md',
            name: 'readme',
            label: 'README.md',
            hint: 'Editable markdown. The hidden form input is synced to the value.',
            value: SAMPLE_MD,
            language: 'markdown',
            theme: 'dark',
            placeholder: 'Start typing markdown…',
            showLineNumbers: true,
            minHeight: 220,
          })),
          code: `<%- include('modules/ui/CodeEditor', {
  id: 'readme',
  name: 'readme',
  label: 'README.md',
  language: 'markdown',
  theme: 'dark',
  value: src,
  placeholder: 'Start typing markdown…'
}) %>`,
        },
      ],
    },
  ];
}
