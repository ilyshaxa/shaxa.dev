import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/keys', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

