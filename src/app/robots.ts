import { MetadataRoute } from 'next';
import { getPrimaryDomain } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPrimaryDomain();
  
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

