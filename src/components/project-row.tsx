'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { DotList } from '@/components/dot-list';
import { ThemedImage } from '@/components/themed-image';
import type { Project } from '@/lib/data';
import { spring } from '@/lib/motion';

const MotionLink = motion.create(Link);

/**
 * One project as a full-width tile: the diagram on an inset plate, then company · year, title, summary,
 * an optional outcome, four key technologies and "Learn more ›". The whole tile is one link whose
 * accessible name is the title.
 */
export const ProjectRow = React.memo(function ProjectRow({ project, as: Heading = 'h3' }: { project: Project; as?: 'h2' | 'h3' }) {
  const locale = useLocale();
  const t = useTranslations('common');
  const titleId = useId();
  const summaryId = useId();
  const eyebrow = [project.companyName, project.year].filter(Boolean).join(' · ');

  return (
    <MotionLink
      href={`/${locale}/projects/${project.slug}`}
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      whileTap={{ scale: 0.99 }}
      transition={spring.snappy}
      className="grid overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40 md:grid-cols-[5fr_6fr]"
    >
      <div className="p-3 md:flex md:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-tile)-0.75rem)] bg-background">
          <ThemedImage
            src={project.coverImage}
            lightSrc={project.coverImageLight}
            alt=""
            fill
            sizes="(min-width: 768px) 440px, 100vw"
            className="object-contain p-6"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3 px-6 pb-7 pt-3 md:px-8 md:py-8">
        <p className="text-caption text-muted-foreground">{eyebrow}</p>
        <Heading id={titleId} className="text-title-2 text-balance">
          {project.title}
        </Heading>
        <p id={summaryId} className="text-body text-muted-foreground text-pretty">
          {project.summary}
        </p>
        {project.outcome && <p className="text-body">{project.outcome}</p>}
        <DotList items={project.highlights} className="text-caption text-muted-foreground" />
        <span className="mt-1 inline-flex items-center gap-0.5 text-body text-primary">
          {t('learnMore')}
          <ChevronRight className="size-4" aria-hidden />
        </span>
      </div>
    </MotionLink>
  );
});
