/**
 * Showcase configuration.
 *
 * Every value reads from an env var and falls back to the current built-in
 * default — so the showcase keeps its existing look unless an override is
 * supplied in `.env.local` (loaded by dotenv at server boot).
 *
 * See `.env.example` for the full list of overrides.
 */

const pick = (value: string | undefined, fallback: string): string =>
  value && value.trim().length > 0 ? value : fallback;

const pickOptional = (value: string | undefined): string | null =>
  value && value.trim().length > 0 ? value : null;

export const SHOWCASE_BRAND = {
  /** Short / package-style name (e.g. "KUI-ejs"). */
  short: pick(process.env.BRAND_SHORT, 'KUI-ejs'),
  /** Display / wordmark name shown in UI (e.g. "KUIejs"). */
  name: pick(process.env.BRAND_NAME, 'KUIejs'),
  /** Initial used in the round logo badge. */
  initial: pick(process.env.BRAND_INITIAL, 'K'),
  /** Short tagline. */
  tagline: pick(
    process.env.BRAND_TAGLINE,
    'Composable UI System for Real Products',
  ),
  /** Long description used for meta tags and the home panel body. */
  description: pick(
    process.env.BRAND_DESCRIPTION,
    'KUIejs is a production-ready UI system built with Express and EJS. A composable design system and component architecture for real-world applications.',
  ),
} as const;

export const SHOWCASE_LINKS = {
  siteUrl: pick(process.env.SITE_URL, 'https://ejs-components.kuray.dev'),
  github: pick(process.env.GITHUB_URL, 'https://github.com/kuraykaraaslan/KUIejs'),
  twitterHandle: pick(process.env.TWITTER_HANDLE, '@kuraykaraaslan'),
  author: {
    name: pick(process.env.AUTHOR_NAME, 'Kuray Karaaslan'),
    url: pick(process.env.AUTHOR_URL, 'https://kuray.dev'),
  },
} as const;

const KEYWORDS_DEFAULT =
  'EJS UI components, Express design system, component library, UI kit, frontend system, design system, EJS UI';

export const SHOWCASE_KEYWORDS = pick(process.env.BRAND_KEYWORDS, KEYWORDS_DEFAULT);

/**
 * Optional CSS variable overrides for the design tokens.
 *
 * `null` means "use the value from input.css". Any non-null value is
 * injected into a `<style>` tag rendered after the compiled stylesheet so
 * it wins the cascade.
 */
type ColorOverrides = {
  primary: string | null;
  primaryHover: string | null;
  primaryActive: string | null;
  primarySubtle: string | null;
  primaryFg: string | null;
  secondary: string | null;
  secondaryHover: string | null;
  secondaryActive: string | null;
  secondarySubtle: string | null;
  secondaryFg: string | null;
  surfaceBase: string | null;
  surfaceRaised: string | null;
  surfaceOverlay: string | null;
  surfaceSunken: string | null;
  border: string | null;
  borderStrong: string | null;
  borderFocus: string | null;
};

export const SHOWCASE_COLORS: { light: ColorOverrides; dark: ColorOverrides } = {
  light: {
    primary: pickOptional(process.env.COLOR_PRIMARY),
    primaryHover: pickOptional(process.env.COLOR_PRIMARY_HOVER),
    primaryActive: pickOptional(process.env.COLOR_PRIMARY_ACTIVE),
    primarySubtle: pickOptional(process.env.COLOR_PRIMARY_SUBTLE),
    primaryFg: pickOptional(process.env.COLOR_PRIMARY_FG),
    secondary: pickOptional(process.env.COLOR_SECONDARY),
    secondaryHover: pickOptional(process.env.COLOR_SECONDARY_HOVER),
    secondaryActive: pickOptional(process.env.COLOR_SECONDARY_ACTIVE),
    secondarySubtle: pickOptional(process.env.COLOR_SECONDARY_SUBTLE),
    secondaryFg: pickOptional(process.env.COLOR_SECONDARY_FG),
    surfaceBase: pickOptional(process.env.COLOR_SURFACE_BASE),
    surfaceRaised: pickOptional(process.env.COLOR_SURFACE_RAISED),
    surfaceOverlay: pickOptional(process.env.COLOR_SURFACE_OVERLAY),
    surfaceSunken: pickOptional(process.env.COLOR_SURFACE_SUNKEN),
    border: pickOptional(process.env.COLOR_BORDER),
    borderStrong: pickOptional(process.env.COLOR_BORDER_STRONG),
    borderFocus: pickOptional(process.env.COLOR_BORDER_FOCUS),
  },
  dark: {
    primary: pickOptional(process.env.COLOR_PRIMARY_DARK),
    primaryHover: pickOptional(process.env.COLOR_PRIMARY_HOVER_DARK),
    primaryActive: pickOptional(process.env.COLOR_PRIMARY_ACTIVE_DARK),
    primarySubtle: pickOptional(process.env.COLOR_PRIMARY_SUBTLE_DARK),
    primaryFg: pickOptional(process.env.COLOR_PRIMARY_FG_DARK),
    secondary: pickOptional(process.env.COLOR_SECONDARY_DARK),
    secondaryHover: pickOptional(process.env.COLOR_SECONDARY_HOVER_DARK),
    secondaryActive: pickOptional(process.env.COLOR_SECONDARY_ACTIVE_DARK),
    secondarySubtle: pickOptional(process.env.COLOR_SECONDARY_SUBTLE_DARK),
    secondaryFg: pickOptional(process.env.COLOR_SECONDARY_FG_DARK),
    surfaceBase: pickOptional(process.env.COLOR_SURFACE_BASE_DARK),
    surfaceRaised: pickOptional(process.env.COLOR_SURFACE_RAISED_DARK),
    surfaceOverlay: pickOptional(process.env.COLOR_SURFACE_OVERLAY_DARK),
    surfaceSunken: pickOptional(process.env.COLOR_SURFACE_SUNKEN_DARK),
    border: pickOptional(process.env.COLOR_BORDER_DARK),
    borderStrong: pickOptional(process.env.COLOR_BORDER_STRONG_DARK),
    borderFocus: pickOptional(process.env.COLOR_BORDER_FOCUS_DARK),
  },
};

const TOKEN_MAP: Array<[keyof ColorOverrides, string]> = [
  ['primary', '--primary'],
  ['primaryHover', '--primary-hover'],
  ['primaryActive', '--primary-active'],
  ['primarySubtle', '--primary-subtle'],
  ['primaryFg', '--primary-fg'],
  ['secondary', '--secondary'],
  ['secondaryHover', '--secondary-hover'],
  ['secondaryActive', '--secondary-active'],
  ['secondarySubtle', '--secondary-subtle'],
  ['secondaryFg', '--secondary-fg'],
  ['surfaceBase', '--surface-base'],
  ['surfaceRaised', '--surface-raised'],
  ['surfaceOverlay', '--surface-overlay'],
  ['surfaceSunken', '--surface-sunken'],
  ['border', '--border'],
  ['borderStrong', '--border-strong'],
  ['borderFocus', '--border-focus'],
];

function declarations(overrides: ColorOverrides): string {
  return TOKEN_MAP.map(([key, token]) => {
    const v = overrides[key];
    return v ? `  ${token}: ${v};` : null;
  })
    .filter(Boolean)
    .join('\n');
}

/**
 * Returns a CSS string with the active overrides, or an empty string when
 * no env-driven overrides are present.
 */
export function buildShowcaseColorCss(): string {
  const light = declarations(SHOWCASE_COLORS.light);
  const dark = declarations(SHOWCASE_COLORS.dark);
  const parts: string[] = [];
  if (light) parts.push(`:root {\n${light}\n}`);
  if (dark) parts.push(`.dark {\n${dark}\n}`);
  return parts.join('\n');
}

/**
 * View-friendly `site` object — what each EJS template receives.
 */
export const SITE_LOCALS = {
  name: SHOWCASE_BRAND.name,
  short: SHOWCASE_BRAND.short,
  initial: SHOWCASE_BRAND.initial,
  tagline: SHOWCASE_BRAND.tagline,
  /** Browser <title> default — matches NextJS metadata.title.default = name only. */
  title: SHOWCASE_BRAND.name,
  /** Long descriptive title for OG / Twitter / structured data. */
  longTitle: `${SHOWCASE_BRAND.name} — ${SHOWCASE_BRAND.tagline}`,
  description: SHOWCASE_BRAND.description,
  url: SHOWCASE_LINKS.siteUrl,
  github: SHOWCASE_LINKS.github,
  twitterHandle: SHOWCASE_LINKS.twitterHandle,
  keywords: SHOWCASE_KEYWORDS,
  author: SHOWCASE_LINKS.author.name,
  authorUrl: SHOWCASE_LINKS.author.url,
};

/**
 * Build a consistent browser `<title>` across showcase + theme routes.
 * Mirrors NextJS `metadata.title.template` pattern (`%s | ${name}`).
 *
 * - `buildPageTitle()` → `"Brand — Tagline"` (site default)
 * - `buildPageTitle('Button')` → `"Button | Brand"`
 * - `buildPageTitle('Dashboard', 'UPS Theme')` → `"Dashboard — UPS Theme | Brand"`
 */
export function buildPageTitle(page?: string | null, suffix?: string | null): string {
  if (!page) return SHOWCASE_BRAND.name;
  if (suffix) return `${page} — ${suffix} | ${SHOWCASE_BRAND.name}`;
  return `${page} | ${SHOWCASE_BRAND.name}`;
}