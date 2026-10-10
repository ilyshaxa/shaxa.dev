import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { getAllExperiences, localizeExperiences } from '@/lib/data';
import { buildPageMetadata, getBaseUrl, withSiteName } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = await getMessages({ locale });
  const experience = localizeExperiences(getAllExperiences(), messages).find((item) => item.slug === slug);
  // An unknown slug is a 404 (the page calls notFound()); there is nothing to describe.
  if (!experience) return {};

  return buildPageMetadata({
    baseUrl: await getBaseUrl(),
    locale,
    path: `/about/${slug}`,
    title: withSiteName(`${experience.position}, ${experience.company}`),
    description: experience.summary,
  });
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
