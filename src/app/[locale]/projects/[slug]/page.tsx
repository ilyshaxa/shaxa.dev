'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { Building2, ChevronLeft, ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { MediaViewer } from '@/components/media-viewer';
import { ScrollReveal } from '@/components/scroll-reveal';
import { StatusDot } from '@/components/status-dot';
import { generateProjectSlug, getAllProjects, getExperienceSlugByCompany, localizeProjects } from '@/lib/data';
import { useThemedSrc } from '@/lib/use-themed-src';

const rowIconClass = 'size-5 text-muted-foreground';

export default function ProjectPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
  const project = projects.find((p) => p.slug === slug || generateProjectSlug(p.title) === slug);

  // Hooks run before notFound() so their order never changes between renders.
  const defaultMedia = project
    ? project.isVideo
      ? project.expandedVideo || project.expandedImage || project.coverImage
      : project.expandedImage || project.coverImage
    : '';
  const lightMedia = project?.isVideo ? project.expandedVideoLight : project?.expandedImageLight;
  const mediaSrc = useThemedSrc(defaultMedia, lightMedia);

  if (!project) {
    notFound();
  }

  const status = project.originalStatus ?? project.status;
  const companySlug = project.companyName ? getExperienceSlugByCompany(project.companyName) : null;
  const companyHref = companySlug ? `/${locale}/about/${companySlug}` : `/${locale}/about`;

  return (
    <article className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/projects`}>
            <ChevronLeft className="size-4" />
            {t('backToProjects')}
          </Link>
        </Button>

        <ScrollReveal className="mt-8 max-w-[800px]">
          <h1 className="text-title-1 text-balance">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusDot status={status} label={project.status} />
            <span className="text-caption text-muted-foreground">{project.year}</span>
            {project.companyName && <span className="text-caption text-muted-foreground">{project.companyName}</span>}
          </div>
        </ScrollReveal>

        <div className="mt-10">
          <MediaViewer src={mediaSrc} alt={project.title} isVideo={project.isVideo} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-title-2">{t('aboutProject')}</h2>
              <p className="mt-4 max-w-[680px] text-body-lg text-muted-foreground text-pretty">{project.fullDescription}</p>
            </section>
            <section>
              <h2 className="text-title-2">{t('technologies')}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1 text-[0.9375rem] font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <GroupedList>
              <GroupedListItem title={t('status.title')} trailing={<StatusDot status={status} label={project.status} />} />
              <GroupedListItem title={t('year')} trailing={project.year} />
              {project.companyName && (
                <GroupedListItem leading={<Building2 className={rowIconClass} />} title={project.companyName} href={companyHref} />
              )}
              {project.liveUrl && (
                <GroupedListItem leading={<ExternalLink className={rowIconClass} />} title={t('liveDemo')} href={project.liveUrl} />
              )}
              {project.githubUrl && (
                <GroupedListItem leading={<Github className={rowIconClass} />} title={t('viewCode')} href={project.githubUrl} />
              )}
            </GroupedList>
          </aside>
        </div>
      </div>
    </article>
  );
}
