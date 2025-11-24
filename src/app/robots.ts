import { MetadataRoute } from 'next';
import { getPrimaryDomain } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Use primary domain for sitemap reference (canonical)
  const primaryDomain = getPrimaryDomain();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/keys', '/api/'],
      },
    ],
    sitemap: `${primaryDomain}/sitemap.xml`,
  };
}

