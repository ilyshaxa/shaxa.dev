'use client';

import { useMemo } from 'react';
import { FolderOpen } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { ProjectCard } from '@/components/project-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { getAllProjects, localizeProjects } from '@/lib/data';

export default function ProjectsPage() {
  const baseProjects = getAllProjects();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(baseProjects, messages), [baseProjects, messages]);
  const t = useTranslations('projects');

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('title')} subtitle={t('subtitle')} />
        </ScrollReveal>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ScrollReveal key={project.slug ?? project.title} delay={index * 0.05} className="h-full">
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md py-20 text-center">
            <FolderOpen className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-6 text-headline">{t('empty.title')}</h2>
            <p className="mt-2 text-body text-muted-foreground">{t('empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
