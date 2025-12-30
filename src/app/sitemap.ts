import { MetadataRoute } from 'next';
import { getAllProjects, getAllExperiences } from '@/lib/data';
import { getPrimaryDomain } from '@/lib/seo';
import { locales } from '@/types/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use primary domain for sitemap URLs (canonical)
  const primaryDomain = getPrimaryDomain();
  const projects = getAllProjects();
  const experiences = getAllExperiences();
  const currentDate = new Date().toISOString().split('T')[0];

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Main pages for each locale
  const mainPagePaths = ['', '/about', '/projects', '/contact'];
  for (const locale of locales) {
    for (const path of mainPagePaths) {
      sitemapEntries.push({
        url: `${primaryDomain}/${locale}${path}`,
        lastModified: currentDate,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1.0 : path === '/about' ? 0.9 : path === '/projects' ? 0.8 : 0.7,
      });
    }
  }

  // Experience detail pages for each locale
  for (const locale of locales) {
    for (const exp of experiences) {
      sitemapEntries.push({
        url: `${primaryDomain}/${locale}/about/${exp.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Project detail pages for each locale
  for (const locale of locales) {
    for (const project of projects) {
      const projectSlug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-');
      sitemapEntries.push({
        url: `${primaryDomain}/${locale}/projects/${projectSlug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return sitemapEntries;
}

