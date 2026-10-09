'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { GroupedList } from '@/components/grouped-list';
import type { Experience } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';
import { spring } from '@/lib/motion';

interface ExperienceListProps {
  experiences: Experience[];
  /** Rows shown before "Show all"; omit to show every row. */
  initialCount?: number;
  variant?: 'compact' | 'detailed';
}

export function ExperienceList({ experiences, initialCount, variant = 'compact' }: ExperienceListProps) {
  const locale = useLocale();
  const tHome = useTranslations('home.experience');
  const tAbout = useTranslations('about');
  const [showAll, setShowAll] = useState(false);
  const limit = Math.min(initialCount ?? experiences.length, experiences.length);
  const hiddenCount = experiences.length - limit;
  const visible = showAll ? experiences : experiences.slice(0, limit);

  return (
    <div>
      <GroupedList>
        <AnimatePresence initial={false}>
          {visible.map((exp) => {
            const details = [exp.location, ...exp.technologies.slice(0, 3)].filter(Boolean).join(' · ');
            return (
              <motion.li
                key={exp.slug}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring.default}
                className="overflow-hidden border-b border-border last:border-b-0"
              >
                <Link
                  href={`/${locale}/about/${exp.slug}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]"
                >
                  <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
                    {exp.logo && <Image src={exp.logo} alt="" width={28} height={28} className="object-contain" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[1.0625rem] font-semibold tracking-[-0.01em]">{exp.position}</span>
                    <span className="block truncate text-caption text-muted-foreground">
                      {exp.company} · {tAbout(`employmentTypes.${employmentTypeKeys[exp.employmentType]}`)}
                    </span>
                    <span className="block truncate text-caption text-muted-foreground sm:hidden">{exp.duration}</span>
                    {variant === 'detailed' && details && (
                      <span className="mt-0.5 block truncate text-caption text-muted-foreground">{details}</span>
                    )}
                  </span>
                  <span className="hidden shrink-0 text-caption text-muted-foreground sm:block">{exp.duration}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </GroupedList>

      {hiddenCount > 0 && (
        <div className="mt-6 text-center">
          <Button variant="plain" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll}>
            {showAll ? tHome('showLess') : tHome('showAll', { count: hiddenCount })}
          </Button>
        </div>
      )}
    </div>
  );
}
