'use client';

import { Activity, Cloud, Container, Database, GitBranch, Server, Wrench, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/scroll-reveal';
import type { Profile } from '@/lib/data';
import { cn } from '@/lib/utils';

type SkillCategory = keyof Profile['skills'];

// Apple system colors (light / dark). Only the icons carry color.
// Grid: 4 columns on lg. Cloud is 2×2; containers and tools span 2, so every row is full.
const categoryConfig: Record<SkillCategory, { icon: LucideIcon; color: string; tile: string }> = {
  cloud: { icon: Cloud, color: 'text-[#007aff] dark:text-[#0a84ff]', tile: 'md:col-span-2 lg:row-span-2' },
  containers: { icon: Container, color: 'text-[#34c759] dark:text-[#30d158]', tile: 'lg:col-span-2' },
  infrastructure: { icon: Server, color: 'text-[#af52de] dark:text-[#bf5af2]', tile: '' },
  cicd: { icon: GitBranch, color: 'text-[#ff9500] dark:text-[#ff9f0a]', tile: '' },
  monitoring: { icon: Activity, color: 'text-[#ff3b30] dark:text-[#ff453a]', tile: '' },
  database: { icon: Database, color: 'text-[#ff2d55] dark:text-[#ff375f]', tile: '' },
  tools: { icon: Wrench, color: 'text-[#32ade6] dark:text-[#64d2ff]', tile: 'lg:col-span-2' },
};

export function SkillsBento({ skills }: { skills: Profile['skills'] }) {
  const t = useTranslations('home.skills.categories');
  const categories = Object.keys(skills) as SkillCategory[];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const { icon: Icon, color, tile } = categoryConfig[category];
        const isHero = category === 'cloud';
        return (
          <ScrollReveal
            key={category}
            delay={index * 0.05}
            className={cn('rounded-tile bg-secondary p-6 md:p-8 contrast-more:border contrast-more:border-foreground/40', tile)}
          >
            <Icon className={cn(isHero ? 'size-10' : 'size-7', color)} strokeWidth={1.75} aria-hidden />
            <h3 className={cn('mt-4', isHero ? 'text-title-2' : 'text-headline')}>{t(category)}</h3>
            <ul
              className={cn(
                'mt-3 text-muted-foreground',
                isHero ? 'space-y-1.5 text-body-lg' : 'flex flex-wrap gap-x-3 gap-y-1 text-body'
              )}
            >
              {skills[category].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
