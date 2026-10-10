'use client';

import { useMemo } from 'react';
import { FolderOpen } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { ProjectRow } from '@/components/project-row';
import { SectionHeader } from '@/components/section-header';
import { getAllProjects, localizeProjects } from '@/lib/data';

export default function ProjectsPage() {
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
  const t = useTranslations('projects');

  return (
    <div className="page-container pb-24 pt-12 md:pb-32 md:pt-20">
      <SectionHeader as="h1" title={t('title')} />
      {projects.length > 0 ? (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectRow key={project.slug} project={project} as="h2" />
          ))}
        </div>
      ) : (
        <div className="max-w-md py-12">
          <FolderOpen className="size-10 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          <h2 className="mt-4 text-headline">{t('empty.title')}</h2>
          <p className="mt-2 text-body text-muted-foreground">{t('empty.description')}</p>
        </div>
      )}
    </div>
  );
}
