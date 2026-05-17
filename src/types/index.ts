export type ThemeStatus = 'planned' | 'in-progress' | 'done';

export type ThemeMeta = {
  id: string;
  title: string;
  description: string;
  route: string;
  vertical: string;
  status: ThemeStatus;
  tags: string[];
  pages: ThemePageMeta[];
};

export type ThemePageMeta = {
  title: string;
  path: string;
};

export type ShowcaseMeta = {
  themes: ThemeMeta[];
};

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export type ShowcaseNavItem = {
  id: string;
  title: string;
  category: string;
  abbr: string;
  href?: string;
  status?: ComponentStatus;
  since?: string;
};

export type ShowcaseNavGroup = {
  label: string;
  items: ShowcaseNavItem[];
  collapsible?: boolean;
  sectionStart?: string;
};

export type ShowcaseVariant = {
  title: string;
  previewHtml: string;
  code: string;
  layout?: 'side' | 'stack';
};

export type WcagLevel = 'A' | 'AA' | 'AAA';

export type KeyboardInteraction = {
  keys: string;
  action: string;
};

export type A11yMetadata = {
  wcagLevel?: WcagLevel;
  ariaPatterns?: string[];
  keyboardInteractions?: KeyboardInteraction[];
  notes?: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  abbr: string;
  description: string;
  filePath: string;
  sourceCode: string;
  variants: ShowcaseVariant[];

  // Status + version — previously only on NavItem; now also on the item for
  // direct consumption by the registry without a menu lookup.
  status?: ComponentStatus;
  since?: string;

  // Optional AI-discoverability metadata. All optional so existing entries
  // remain backward compatible. Surfaced via /api/registry and /llms-full.txt.
  whenToUse?: string;
  whenNotToUse?: string;
  composes?: string[];        // component IDs this depends on
  relatedTo?: string[];       // sibling component IDs
  a11y?: A11yMetadata;
  designTokens?: string[];    // CSS variable names consumed
  dependencies?: string[];    // npm packages required at runtime
};
