// Type definitions for the machine-readable component registry consumed by
// AI tools, code generators, and copy-paste workflows.
//
// The registry is built at runtime from showcase data + the sidebar menu —
// see `src/registry/registry.ts`. It is exposed at `/api/registry` and
// `/llms-full.txt`.

import type { ComponentStatus, A11yMetadata } from '../types';

export type RegistryLayer = 'ui' | 'app' | 'domain' | 'theme';

export type RegistryCategory =
  | 'Atom'
  | 'Molecule'
  | 'Organism'
  | 'App'
  | 'Domain'
  | 'Theme';

export type RegistryVariant = {
  title: string;
  code: string;
};

export type RegistryComponent = {
  /** Stable identifier — matches the showcase menu id and is URL-safe. */
  id: string;
  /** Display name; matches the EJS partial filename in PascalCase. */
  name: string;
  /** Module-layer bucket. */
  layer: RegistryLayer;
  /** Atomic-design category as used in the sidebar. */
  category: string;
  /** Repo-relative source path to the .ejs partial. */
  filePath: string;
  /** Two-letter sidebar abbreviation. */
  abbr: string;
  /** Short human description (from showcase entry). */
  description: string;
  /** Inlined EJS source (verbatim from showcase entry). */
  source: string;
  /** Compact, copy-paste-friendly variant snippets. */
  variants: RegistryVariant[];
  /** Status badge: stable | beta | deprecated. */
  status: ComponentStatus;
  /** Version the component was first added. */
  since?: string;
  /** Optional 1–2 sentence guidance. */
  whenToUse?: string;
  /** Optional anti-pattern guidance. */
  whenNotToUse?: string;
  /** Component IDs this composes from. */
  composes?: string[];
  /** Sibling components a caller may also want. */
  relatedTo?: string[];
  /** Components/themes that import this one (inverse index). */
  usedBy?: string[];
  /** Accessibility metadata. */
  a11y?: A11yMetadata;
  /** CSS-variable design tokens consumed. */
  designTokens?: string[];
  /** npm packages required at runtime. */
  dependencies?: string[];
};

export type RegistryTheme = {
  id: string;
  title: string;
  route: string;
  status: ComponentStatus;
  since?: string;
};

export type RegistryToken = {
  name: string;       // CSS variable e.g. '--primary'
  light: string;      // value in light mode
  dark?: string;      // value in dark mode if overridden
  purpose: string;
};

export type Registry = {
  $schema: string;
  /** Library name, currently 'kui-ejs'. */
  name: string;
  /** Library version from package.json. */
  version: string;
  /** Registry schema version (bumped on breaking shape changes). */
  registryVersion: string;
  generatedAt: string;
  description: string;
  /** Plain-English explainer of where each layer lives. */
  layers: Record<RegistryLayer, string>;
  /** Conventions an EJS author / code generator should follow. */
  conventions: {
    templating: string;
    icons: string;
    styling: string;
    includes: string;
    accessibility: string;
    rawOutput: string;
    fileNaming: string;
  };
  /** Design tokens defined in public/assets/css/input.css. */
  designTokens: RegistryToken[];
  components: RegistryComponent[];
  themes: RegistryTheme[];
};
