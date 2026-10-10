import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { GroupedList } from '@/components/grouped-list';
import type { Experience } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';

interface ExperienceListProps {
  experiences: Experience[];
  /** About shows a one-line summary under each row; Home doesn't. */
  showSummary?: boolean;
}

export function ExperienceList({ experiences, showSummary = false }: ExperienceListProps) {
  const locale = useLocale();
  const t = useTranslations('about');

  return (
    <GroupedList>
      {experiences.map((exp) => (
        <li key={exp.slug} className="border-b border-border last:border-b-0">
          <Link
            href={`/${locale}/about/${exp.slug}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors focus-visible:-outline-offset-2 hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
              {exp.logo && <Image src={exp.logo} alt="" width={28} height={28} className="object-contain" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-headline">{exp.company}</span>
              <span className="block text-caption text-muted-foreground">
                {exp.position} · {t(`employmentTypes.${employmentTypeKeys[exp.employmentType]}`)}
              </span>
              <span className="block text-caption text-muted-foreground sm:hidden">{exp.duration}</span>
              {showSummary && <span className="mt-1.5 block text-body text-muted-foreground">{exp.summary}</span>}
            </span>
            <span className="hidden shrink-0 text-caption text-muted-foreground sm:block">{exp.duration}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </Link>
        </li>
      ))}
    </GroupedList>
  );
}
