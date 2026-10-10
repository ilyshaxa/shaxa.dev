import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
// Relative imports with extensions keep this module loadable from `node --test` (no path aliases there).
import { getProfile } from './data.ts';
import { localeMetadata, locales } from '../types/i18n.ts';

/**
 * Get the current base URL (domain) from the request
 * Supports both shaxa.dev and shaxriyor.com
 */
export async function getBaseUrl(): Promise<string> {
  // Loaded on demand so the pure helpers below stay importable outside a Next request (unit tests).
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'https';

  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // In production, use the current domain
  return `${protocol}://${host}`;
}

/**
 * Get the primary domain (for canonical URLs)
 * Defaults to shaxa.dev but can be overridden
 */
export function getPrimaryDomain(): string {
  return process.env.PRIMARY_DOMAIN || 'https://shaxa.dev';
}

/**
 * Check if the current domain is the primary domain
 */
export async function isPrimaryDomain(): Promise<boolean> {
  const baseUrl = await getBaseUrl();
  const primaryDomain = getPrimaryDomain();
  return baseUrl === primaryDomain || baseUrl.includes('shaxa.dev');
}

/** Link-preview card shared by every page and locale: name, role and photo only, so it needs no translation. */
export const OG_IMAGE = { path: '/og.png', width: 1200, height: 630 } as const;

/** Page titles read "<label> - Shaxriyor Jabborov"; the locale layout uses this as its `title.template`. */
export const TITLE_TEMPLATE = `%s - ${getProfile().name}`;

export function withSiteName(label: string): string {
  return TITLE_TEMPLATE.replace('%s', label);
}

/** "@ilyshaxa", taken from the profile's X link so the handle has one source. */
export function getTwitterHandle(): string {
  return `@${new URL(getProfile().twitter).pathname.replace(/^\/|\/$/g, '')}`;
}

export function siteNameFor(baseUrl: string): string {
  return baseUrl.includes('shaxriyor.com') ? 'shaxriyor.com' : 'shaxa.dev';
}

/** Absolute URL of a page: `<base>/<locale><path>`; `path` is '' for the locale home and '/about' style otherwise. */
export function pageUrl(baseUrl: string, locale: string, path = ''): string {
  return `${baseUrl}/${locale}${path}`;
}

/** Canonical = the page's own URL on the given domain; hreflang for every locale; x-default points at the English page. */
export function buildAlternates(baseUrl: string, locale: string, path = ''): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const code of locales) languages[code] = pageUrl(baseUrl, code, path);
  languages['x-default'] = pageUrl(baseUrl, 'en', path);
  return { canonical: pageUrl(baseUrl, locale, path), languages };
}

interface PageSeo {
  baseUrl: string;
  locale: string;
  /** '' for the locale home, otherwise '/about', '/projects/<slug>' and so on. */
  path?: string;
  /** The complete title shown in the tab and in previews (the name suffix is already in it). */
  title: string;
  description: string;
}

/**
 * Everything a page needs for search and sharing. A child `openGraph` or `twitter` replaces the parent's
 * wholesale, so every field is supplied here rather than inherited from the locale layout.
 */
export function buildPageMetadata({ baseUrl, locale, path = '', title, description }: PageSeo): Metadata {
  const { name, title: role } = getProfile();
  // Canonical, hreflang and og:url always name the primary domain (as the sitemap and the README say), so
  // shaxriyor.com, www and preview hosts do not each claim to be the canonical copy. The image and site name follow the host.
  const primary = getPrimaryDomain();
  const url = pageUrl(primary, locale, path);
  const image = { url: `${baseUrl}${OG_IMAGE.path}`, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: `${name}, ${role}` };

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(primary, locale, path),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteNameFor(baseUrl),
      locale: localeMetadata[locale as keyof typeof localeMetadata]?.code ?? localeMetadata.en.code,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: getTwitterHandle(),
      images: [image],
    },
  };
}

/** Metadata for About, Projects and Contact from `metadata.<section>.*` in the messages. */
export async function sectionMetadata(locale: string, section: 'about' | 'projects' | 'contact'): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${section}` });
  const { name } = getProfile();
  return buildPageMetadata({
    baseUrl: await getBaseUrl(),
    locale,
    path: `/${section}`,
    title: t('title', { name }),
    description: t('description', { name }),
  });
}
