'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { StatusDot } from '@/components/status-dot';
import { ThemedImage } from '@/components/themed-image';
import { generateProjectSlug, type Project } from '@/lib/data';
import { spring } from '@/lib/motion';

const MotionLink = motion.create(Link);

// Hover nudges the cover (pointer devices only; framer ignores touch "hover").
const coverVariants = { rest: { scale: 1 }, hover: { scale: 1.03 } };

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const statusLabel = t(project.status === 'Completed' ? 'status.completed' : 'status.inProgress');
  const slug = project.slug || generateProjectSlug(project.title);
  const shownTech = project.technologies.slice(0, 5);
  const extraTech = project.technologies.length - shownTech.length;
  const techLine = [...shownTech, ...(extraTech > 0 ? [`+${extraTech}`] : [])].join(' · ');

  return (
    <MotionLink
      href={`/${locale}/projects/${slug}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      className="flex h-full flex-col overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div className="absolute inset-0" variants={coverVariants} transition={spring.default}>
          <ThemedImage
            src={project.coverImage}
            lightSrc={project.coverImageLight}
            alt=""
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 400px"
            className="object-contain p-6"
          />
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-6 pb-6">
        <StatusDot status={project.status} label={`${statusLabel} · ${project.year}`} />
        <h3 className="text-headline">{project.title}</h3>
        <p className="line-clamp-3 text-body text-muted-foreground">{project.shortDescription}</p>
        {project.companyName && <p className="text-caption text-muted-foreground">{project.companyName}</p>}
        <p className="mt-auto pt-2 text-caption text-muted-foreground">{techLine}</p>
      </div>
    </MotionLink>
  );
});
