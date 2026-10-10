'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulletList } from '@/components/bullet-list';
import { InlineList } from '@/components/inline-list';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { getAllExperiences, localizeExperiences } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';

interface ExperienceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const neighborClass =
  'block rounded-lg bg-secondary p-5 contrast-more:border contrast-more:border-foreground/40 transition-[scale,background-color] duration-100 active:scale-[0.98] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]';

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const t = useTranslations('experienceDetail');
  const tAbout = useTranslations('about');
  const tHome = useTranslations('home.stack');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { slug } = use(params);
  const messages = useMessages();
  const allExperiences = useMemo(() => localizeExperiences(getAllExperiences(), messages), [messages]);
  const index = allExperiences.findIndex((exp) => exp.slug === slug);

  if (index === -1) {
    notFound();
  }

  const experience = allExperiences[index];
  const prev = index > 0 ? allExperiences[index - 1] : null;
  const next = index < allExperiences.length - 1 ? allExperiences[index + 1] : null;
  const employmentType = tAbout(`employmentTypes.${employmentTypeKeys[experience.employmentType]}`);

  return (
    <article className="page-container pb-24 pt-10 md:pb-32 md:pt-16">
      <Button asChild variant="plain" size="sm" className="min-h-11">
        <Link href={`/${locale}/about`}>
          <ChevronLeft className="size-4" />
          {t('back')}
        </Link>
      </Button>

      <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
        {experience.logo && (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-[18px] bg-secondary">
            <Image src={experience.logo} alt="" width={40} height={40} className="size-10 object-contain" />
          </div>
        )}
        <div>
          <h1 className="text-title-1 text-balance">{experience.position}</h1>
          <p className="mt-2 text-body-lg text-muted-foreground">
            {experience.company} · {experience.duration}
          </p>
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <section>
          <h2 className="text-title-2">{t('whatIDid')}</h2>
          <BulletList items={experience.points} />
        </section>

        <aside className="space-y-8">
          <GroupedList>
            <GroupedListItem title={t('company')} trailing={experience.company} />
            <GroupedListItem title={t('dates')} trailing={experience.duration} />
            <GroupedListItem title={t('type')} trailing={employmentType} />
            {experience.website && <GroupedListItem title={t('website')} href={experience.website} />}
          </GroupedList>
          <section>
            <h2 className="text-caption text-muted-foreground">{tHome('title')}</h2>
            <InlineList items={experience.technologies} className="mt-2 text-body text-muted-foreground" />
          </section>
        </aside>
      </div>

      <nav className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/${locale}/about/${prev.slug}`} className={neighborClass}>
            <span className="flex items-center gap-1 text-caption text-muted-foreground">
              <ChevronLeft className="size-3.5" aria-hidden />
              {tCommon('previous')}
            </span>
            <span className="mt-1 block text-headline">{prev.company}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={`/${locale}/about/${next.slug}`} className={`${neighborClass} sm:text-right`}>
            <span className="flex items-center gap-1 text-caption text-muted-foreground sm:justify-end">
              {tCommon('next')}
              <ChevronRight className="size-3.5" aria-hidden />
            </span>
            <span className="mt-1 block text-headline">{next.company}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
