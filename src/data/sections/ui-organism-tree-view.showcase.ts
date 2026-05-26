import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/TreeView/TreeView.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Node = { id: string; label: string; children?: Node[] };

const rowBase = 'flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus hover:bg-surface-overlay transition-colors';
const rowSelected = ' bg-primary-subtle text-primary font-medium';

function chevronHtml(): string {
  return `<span aria-hidden="true" class="text-text-disabled w-3 shrink-0 flex items-center justify-center">
    <i class="fa-solid fa-chevron-down w-2.5 h-2.5"></i>
  </span>`;
}

function leafSpacerHtml(): string {
  return `<span class="w-3 shrink-0" aria-hidden="true"></span>`;
}

function renderNodes(
  nodes: Node[],
  selectedIds: string[],
  depth: number,
  isRoot: boolean,
  label: string,
  selectionMode: 'single' | 'multi',
  focusId: string,
  parentSetSize: number,
): string {
  const items = nodes.map((node, idx) => {
    const hasChildren = !!(node.children && node.children.length > 0);
    const isSelected  = selectedIds.indexOf(node.id) !== -1;
    const isFocused   = focusId === node.id || (!focusId && depth === 0 && idx === 0);
    const rowCls = rowBase + (isSelected ? rowSelected : '');
    const indent = `padding-left: ${depth * 1.25}rem;`;
    const level = depth + 1;
    const children = hasChildren
      ? renderNodes(node.children!, selectedIds, depth + 1, false, label, selectionMode, focusId, node.children!.length)
      : '';
    return `<li role="treeitem" data-tree-node-id="${node.id}" data-has-children="${hasChildren ? 'true' : 'false'}"${hasChildren ? ' aria-expanded="true"' : ''} aria-selected="${isSelected ? 'true' : 'false'}" aria-level="${level}" aria-posinset="${idx + 1}" aria-setsize="${parentSetSize}">
      <div tabindex="${isFocused ? 0 : -1}" data-tree-row style="${indent}" class="${rowCls}">
        ${hasChildren ? chevronHtml() : leafSpacerHtml()}
        <span>${node.label}</span>
      </div>
      ${children}
    </li>`;
  }).join('');

  if (isRoot) {
    const multi = selectionMode === 'multi' ? ' aria-multiselectable="true"' : '';
    return `<ul role="tree" aria-label="${label}"${multi} data-selection-mode="${selectionMode}" class="space-y-0.5">${items}</ul>`;
  }
  return `<ul role="group" class="ml-0">${items}</ul>`;
}

function toolbarHtml(): string {
  return `<div data-tree-toolbar class="flex items-center gap-1 px-1 pb-1 text-xs text-text-secondary">
    <button type="button" data-tree-action="expand-all" class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors">
      <i class="fa-solid fa-angles-down w-3 h-3" aria-hidden="true"></i>
      <span>Expand all</span>
    </button>
    <button type="button" data-tree-action="collapse-all" class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors">
      <i class="fa-solid fa-angles-up w-3 h-3" aria-hidden="true"></i>
      <span>Collapse all</span>
    </button>
  </div>`;
}

function hasAnyChildren(nodes: Node[]): boolean {
  return nodes.some(n => !!(n.children && n.children.length));
}

function treeViewEl(opts: {
  nodes: Node[];
  selectedId?: string;
  selectedIds?: string[];
  label?: string;
  selectionMode?: 'single' | 'multi';
  focusId?: string;
  hideToolbar?: boolean;
}) {
  const selectionMode = opts.selectionMode || 'single';
  const selectedIds = opts.selectedIds || (opts.selectedId ? [opts.selectedId] : []);
  const tree = renderNodes(opts.nodes, selectedIds, 0, true, opts.label || 'Tree', selectionMode, opts.focusId || '', opts.nodes.length);
  const toolbar = !opts.hideToolbar && hasAnyChildren(opts.nodes) ? toolbarHtml() : '';
  return `<div class="flex flex-col gap-1">${toolbar}${tree}</div>`;
}

const wrap = (inner: string) => `<div class="p-4 w-full max-w-sm">${inner}</div>`;

// ─── Sample data ──────────────────────────────────────────────────────────────

const FILE_TREE: Node[] = [
  { id: 'src', label: 'src', children: [
    { id: 'components', label: 'components', children: [
      { id: 'Button', label: 'Button.ejs' },
      { id: 'Card',   label: 'Card.ejs' },
    ]},
    { id: 'routes', label: 'routes', children: [
      { id: 'index', label: 'index.ts' },
      { id: 'users', label: 'users.ts' },
    ]},
    { id: 'app',    label: 'app.ts' },
  ]},
  { id: 'package', label: 'package.json' },
];

const NAV_TREE: Node[] = [
  { id: 'account', label: 'Account', children: [
    { id: 'profile',  label: 'Profile' },
    { id: 'password', label: 'Password' },
  ]},
  { id: 'workspace', label: 'Workspace', children: [
    { id: 'general', label: 'General' },
    { id: 'billing', label: 'Billing' },
  ]},
  { id: 'integrations', label: 'Integrations' },
];

const FLAT_TREE: Node[] = [
  { id: 'ts', label: 'TypeScript' },
  { id: 'js', label: 'JavaScript' },
  { id: 'py', label: 'Python' },
  { id: 'go', label: 'Go' },
];

// ─── Export ───────────────────────────────────────────────────────────────────

export function buildTreeViewData(): ShowcaseItem[] {
  return [
    {
      id: 'tree-view',
      title: 'TreeView',
      category: 'Organism',
      abbr: 'Tv',
      description: 'Collapsible tree with keyboard navigation, selection, and aria-tree roles.',
      filePath: 'modules/ui/TreeView/TreeView.ejs',
      sourceCode,
      variants: [
        {
          title: 'File tree',
          previewHtml: wrap(treeViewEl({ nodes: FILE_TREE, label: 'Files', selectedId: 'Card' })),
          code: `<%- include('modules/ui/TreeView', {
  label: 'Files',
  selectedId: selectedId,
  nodes: [
    { id: 'src', label: 'src', children: [
      { id: 'components', label: 'components', children: [
        { id: 'Button', label: 'Button.ejs' },
        { id: 'Card',   label: 'Card.ejs' },
      ]},
      { id: 'routes', label: 'routes', children: [
        { id: 'index', label: 'index.ts' },
        { id: 'users', label: 'users.ts' },
      ]},
    ]},
    { id: 'package', label: 'package.json' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Navigation menu',
          previewHtml: wrap(treeViewEl({ nodes: NAV_TREE, label: 'Settings navigation', selectedId: 'billing' })),
          code: `<%- include('modules/ui/TreeView', {
  label: 'Settings navigation',
  selectedId: 'billing',
  nodes: [
    { id: 'account', label: 'Account', children: [
      { id: 'profile',  label: 'Profile' },
      { id: 'password', label: 'Password' },
    ]},
    { id: 'workspace', label: 'Workspace', children: [
      { id: 'general', label: 'General' },
      { id: 'billing', label: 'Billing' },
    ]},
    { id: 'integrations', label: 'Integrations' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Flat list',
          previewHtml: wrap(treeViewEl({ nodes: FLAT_TREE, label: 'Language selector', selectedId: 'ts' })),
          code: `<%- include('modules/ui/TreeView', {
  label: 'Language selector',
  selectedId: 'ts',
  nodes: [
    { id: 'ts', label: 'TypeScript' },
    { id: 'js', label: 'JavaScript' },
    { id: 'py', label: 'Python' },
    { id: 'go', label: 'Go' },
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Multi-select + type-ahead',
          previewHtml: wrap(treeViewEl({
            nodes: [
              { id: 'docs', label: 'Documents', children: [
                { id: 'spec', label: 'spec.md' },
                { id: 'roadmap', label: 'roadmap.md' },
              ]},
              { id: 'src', label: 'src', children: [
                { id: 'Button', label: 'Button.ejs' },
                { id: 'Card', label: 'Card.ejs' },
                { id: 'Drawer', label: 'Drawer.ejs' },
                { id: 'TreeView', label: 'TreeView.ejs' },
              ]},
              { id: 'tests', label: 'tests', children: [
                { id: 'unit', label: 'unit' },
                { id: 'e2e', label: 'e2e' },
              ]},
            ],
            label: 'Project files (multi-select + type-ahead)',
            selectionMode: 'multi',
            selectedIds: ['Card'],
            focusId: 'Card',
          })),
          code: `<%- include('modules/ui/TreeView', {
  label: 'Project files',
  selectionMode: 'multi',
  selectedIds: ['Card'],
  nodes: [
    { id: 'docs', label: 'Documents', children: [
      { id: 'spec',    label: 'spec.md' },
      { id: 'roadmap', label: 'roadmap.md' },
    ]},
    { id: 'src', label: 'src', children: [
      { id: 'Button',   label: 'Button.ejs' },
      { id: 'Card',     label: 'Card.ejs' },
      { id: 'Drawer',   label: 'Drawer.ejs' },
      { id: 'TreeView', label: 'TreeView.ejs' },
    ]},
  ]
}) %>

<%# Try it:
%   - Cmd/Ctrl-click       → toggle individual rows
%   - Shift-click          → range-select between anchor and clicked row
%   - Type "tre"           → focus jumps to "TreeView.ejs"
%   - Cmd/Ctrl+A           → select all visible rows
%   - Arrow keys / Home / End / Space / Enter — full keyboard nav.
%>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
