import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = 'https://shaxa.dev';

  return [
    {
      url: domain,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
