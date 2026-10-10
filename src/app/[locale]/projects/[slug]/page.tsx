'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotList } from '@/components/dot-list';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { MediaViewer } from '@/components/media-viewer';
import { StatusDot } from '@/components/status-dot';
import { getAllProjects, getExperienceSlugByCompany, localizeProjects } from '@/lib/data';
import { useThemedSrc } from '@/lib/use-themed-src';

export default function ProjectPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
  const project = projects.find((p) => p.slug === slug);

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

  const statusLabel = t(project.status === 'Completed' ? 'status.completed' : 'status.inProgress');
  // Only company projects link to a job entry; a personal project has none.
  const companySlug = project.companyName ? getExperienceSlugByCompany(project.companyName) : null;
  const eyebrow = [project.companyName, project.year].filter(Boolean).join(' · ');
  // The only project with a live URL is the Telegram bot; any other host falls back to its hostname.
  const liveHost = project.liveUrl ? new URL(project.liveUrl).hostname : null;
  const liveLabel = liveHost === 't.me' ? t('openInTelegram') : liveHost;

  return (
    <article className="page-container pb-24 pt-10 md:pb-32 md:pt-16">
      <Button asChild variant="plain" size="sm" className="min-h-11">
        <Link href={`/${locale}/projects`}>
          <ChevronLeft className="size-4" />
          {t('back')}
        </Link>
      </Button>

      <header className="mt-8 max-w-[44rem]">
        <p className="text-caption text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-2 text-title-1 text-balance">{project.title}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{project.summary}</p>
      </header>

      <div className="mt-10">
        <MediaViewer src={mediaSrc} alt={project.title} isVideo={project.isVideo} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <section>
          <h2 className="text-title-2">{t('whatIBuilt')}</h2>
          <ul className="mt-6 space-y-4">
            {project.points.map((point) => (
              <li key={point} className="flex gap-3 text-body text-muted-foreground">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-8">
          <GroupedList>
            {project.companyName && (
              <GroupedListItem
                title={t('company')}
                trailing={project.companyName}
                href={companySlug ? `/${locale}/about/${companySlug}` : undefined}
              />
            )}
            <GroupedListItem title={t('year')} trailing={project.year} />
            <GroupedListItem title={t('status.label')} trailing={<StatusDot status={project.status} label={statusLabel} />} />
            {project.liveUrl && liveLabel && <GroupedListItem title={liveLabel} href={project.liveUrl} />}
          </GroupedList>
          <section>
            <h2 className="text-caption text-muted-foreground">{t('technologies')}</h2>
            <DotList items={project.technologies} className="mt-2 text-body" />
          </section>
        </aside>
      </div>
    </article>
  );
}
