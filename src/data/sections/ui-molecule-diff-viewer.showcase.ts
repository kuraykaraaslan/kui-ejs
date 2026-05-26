import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const diffViewerPath   = path.join(process.cwd(), 'modules/ui/DiffViewer.ejs');
const diffViewerSource = fs.readFileSync(diffViewerPath, 'utf-8');

function renderDiffViewer(locals: Record<string, unknown>): string {
  return ejs.render(diffViewerSource, locals, { filename: diffViewerPath });
}

const SAMPLE_OLD = `function greet(name) {
  console.log("Hello, " + name);
}

greet("world");
`;

const SAMPLE_NEW = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("world");
greet("kui");
`;

const LONG_OLD = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
`;

const LONG_NEW = `import { useState, useCallback } from 'react';

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);
  const handleReset = () => setCount(initial);
  return (
    <div className="flex gap-2">
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
`;

const wrap = (inner: string) => `<div class="w-full max-w-2xl">${inner}</div>`;

export function buildMoleculeDiffViewerData(): ShowcaseItem[] {
  return [
    {
      id: 'diff-viewer',
      title: 'DiffViewer',
      category: 'Molecule',
      abbr: 'Dv',
      description:
        'Line-based text diff viewer with unified (GitHub-style) and split (yan yana) modes. M1 ships a zero-dep LCS algorithm, hunk headers in `@@ -old,n +new,n @@` form, old/new line-number gutters, configurable context window, and optional collapsible unchanged regions. Pixel-identical React sibling at modules/ui/DiffViewer/index.tsx.',
      filePath: 'modules/ui/DiffViewer/DiffViewer.ejs',
      sourceCode: diffViewerSource,
      since: '2026-05',
      variants: [
        {
          title: 'Unified (default)',
          layout: 'stack' as const,
          previewHtml: wrap(renderDiffViewer({ id: 'dv-demo-unified', oldText: SAMPLE_OLD, newText: SAMPLE_NEW })),
          code: `<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc
}) %>`,
        },
        {
          title: 'Split (yan yana)',
          layout: 'stack' as const,
          previewHtml: wrap(renderDiffViewer({ id: 'dv-demo-split', oldText: SAMPLE_OLD, newText: SAMPLE_NEW, mode: 'split' })),
          code: `<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  mode: 'split'
}) %>`,
        },
        {
          title: 'With context=1',
          layout: 'stack' as const,
          previewHtml: wrap(renderDiffViewer({ id: 'dv-demo-ctx1', oldText: LONG_OLD, newText: LONG_NEW, context: 1 })),
          code: `<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  context: 1
}) %>`,
        },
        {
          title: 'Collapsible unchanged context',
          layout: 'stack' as const,
          previewHtml: wrap(renderDiffViewer({ id: 'dv-demo-collapsible', oldText: LONG_OLD, newText: LONG_NEW, context: 3, collapsible: true })),
          code: `<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  context: 3,
  collapsible: true
}) %>`,
        },
      ],
    },
  ];
}
