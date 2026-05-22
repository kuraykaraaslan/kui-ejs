import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/TreeView.ejs'), 'utf-8');

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

function renderNodes(nodes: Node[], selectedId: string, depth: number, isRoot: boolean, label: string): string {
  const items = nodes.map(node => {
    const hasChildren = !!(node.children && node.children.length > 0);
    const isSelected  = node.id === selectedId;
    const rowCls = rowBase + (isSelected ? rowSelected : '');
    const indent = `padding-left: ${depth * 1.25}rem;`;
    const children = hasChildren
      ? renderNodes(node.children!, selectedId, depth + 1, false, label)
      : '';
    return `<li role="treeitem" data-tree-node-id="${node.id}" data-has-children="${hasChildren ? 'true' : 'false'}"${hasChildren ? ' aria-expanded="true"' : ''} aria-selected="${isSelected ? 'true' : 'false'}">
      <div tabindex="0" data-tree-row style="${indent}" class="${rowCls}">
        ${hasChildren ? chevronHtml() : leafSpacerHtml()}
        <span>${node.label}</span>
      </div>
      ${children}
    </li>`;
  }).join('');

  if (isRoot) {
    return `<ul role="tree" aria-label="${label}" class="space-y-0.5">${items}</ul>`;
  }
  return `<ul role="group" class="ml-0">${items}</ul>`;
}

function treeViewEl(opts: { nodes: Node[]; selectedId?: string; label?: string }) {
  return renderNodes(opts.nodes, opts.selectedId || '', 0, true, opts.label || 'Tree');
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
      filePath: 'modules/ui/TreeView.ejs',
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
      ],
    },
  ];
}
