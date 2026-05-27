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

/**
 * External library metadata. Set on showcase entries that wrap a third-party
 * npm package. The detail header renders a small info popover with these
 * links so users can jump to the upstream sources.
 */
export type ExternalLibraryLinks = {
  /** Display label for the package, defaults to the showcase title. */
  packageName?: string;
  /** Published version (semver) — shown next to the package name. */
  version?: string;
  /** Generic homepage / project URL (often the README on GitHub). */
  homepage?: string;
  /** Standalone marketing / documentation site, distinct from `homepage`. */
  website?: string;
  /** npm registry page (https://www.npmjs.com/package/...). */
  npm?: string;
  /** GitHub repository URL. */
  github?: string;
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

  /**
   * Remote-library links. When set, the showcase detail header renders an
   * info popover with clickable shortcuts to the upstream homepage, npm
   * page, and GitHub repository. Use this for entries that wrap a
   * third-party package rather than first-party code in this repo.
   */
  external?: ExternalLibraryLinks;
};
