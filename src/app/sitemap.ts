import type { MetadataRoute } from 'next';
// Relative imports with extensions keep this loadable from `node --test` (src/lib/sitemap.test.ts).
import { getAllProjects, getAllExperiences } from '../lib/data.ts';
import { buildAlternates, getPrimaryDomain } from '../lib/seo.ts';
import { locales } from '../types/i18n.ts';

// The date the site content last changed. A fixed date, not "today", so the sitemap does not claim every
// URL changed on every request; bump it when the pages or their copy change.
export const CONTENT_LAST_MODIFIED = '2026-10-10';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use primary domain for sitemap URLs (canonical)
  const primaryDomain = getPrimaryDomain();
  const projects = getAllProjects();
  const experiences = getAllExperiences();

  // One entry per locale page; each lists every language version (and x-default), matching the hreflang in the page <head>.
  const entry = (
    locale: string,
    path: string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${primaryDomain}/${locale}${path}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency,
    priority,
    alternates: { languages: buildAlternates(primaryDomain, locale, path).languages },
  });

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Main pages for each locale
  const mainPagePaths = ['', '/about', '/projects', '/contact'];
  for (const locale of locales) {
    for (const path of mainPagePaths) {
      sitemapEntries.push(
        entry(locale, path, path === '' ? 'weekly' : 'monthly', path === '' ? 1.0 : path === '/about' ? 0.9 : path === '/projects' ? 0.8 : 0.7),
      );
    }
  }

  // Experience detail pages for each locale
  for (const locale of locales) {
    for (const exp of experiences) {
      sitemapEntries.push(entry(locale, `/about/${exp.slug}`, 'monthly', 0.8));
    }
  }

  // Project detail pages for each locale
  for (const locale of locales) {
    for (const project of projects) {
      sitemapEntries.push(entry(locale, `/projects/${project.slug}`, 'monthly', 0.8));
    }
  }

  return sitemapEntries;
}
