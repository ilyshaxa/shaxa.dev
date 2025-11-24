import { MetadataRoute } from 'next';
import { getAllProjects, getAllExperiences } from '@/lib/data';
import { getPrimaryDomain } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use primary domain for sitemap URLs (canonical)
  const primaryDomain = getPrimaryDomain();
  const projects = getAllProjects();
  const experiences = getAllExperiences();
  const currentDate = new Date().toISOString().split('T')[0];

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: primaryDomain,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${primaryDomain}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${primaryDomain}/projects`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${primaryDomain}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Experience pages
  const experiencePages: MetadataRoute.Sitemap = experiences.map((exp) => ({
    url: `${primaryDomain}/about/${exp.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${primaryDomain}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...mainPages, ...experiencePages, ...projectPages];
}

