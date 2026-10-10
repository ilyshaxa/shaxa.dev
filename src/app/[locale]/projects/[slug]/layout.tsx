import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { getAllProjects, localizeProjects } from '@/lib/data';
import { buildPageMetadata, getBaseUrl, withSiteName } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = await getMessages({ locale });
  const project = localizeProjects(getAllProjects(), messages).find((item) => item.slug === slug);
  // An unknown slug is a 404 (the page calls notFound()); there is nothing to describe.
  if (!project) return {};

  return buildPageMetadata({
    baseUrl: await getBaseUrl(),
    locale,
    path: `/projects/${slug}`,
    title: withSiteName(project.title),
    description: project.summary,
  });
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
