'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { Briefcase, Building, Calendar, Check, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getAllExperiences, localizeExperiences } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';

interface ExperienceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const rowIconClass = 'size-5 text-muted-foreground';
const neighborClass =
  'block rounded-lg bg-secondary p-5 transition-[scale,background-color] duration-100 active:scale-[0.98] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]';

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const t = useTranslations('experienceDetail');
  const tAbout = useTranslations('about');
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
    <article className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-[980px]">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/about`}>
            <ChevronLeft className="size-4" />
            {t('backToAbout')}
          </Link>
        </Button>

        <ScrollReveal className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {experience.logo && (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-[22px] bg-secondary">
              <Image src={experience.logo} alt={`${experience.company} logo`} width={52} height={52} className="object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-title-1 text-balance">{experience.position}</h1>
            <p className="mt-2 text-body-lg text-muted-foreground">
              {experience.company} · {experience.duration}
            </p>
            {experience.isCurrent && (
              <Badge className="mt-3 bg-success/15 text-success">
                <span aria-hidden className="size-1.5 rounded-full bg-success" />
                {t('current')}
              </Badge>
            )}
          </div>
        </ScrollReveal>

        <p className="mt-8 max-w-[680px] text-body-lg text-pretty">{experience.description}</p>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <section>
              <h2 className="text-title-2">{t('responsibilities.title')}</h2>
              <ul className="mt-6 space-y-3">
                {experience.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3 text-body text-muted-foreground">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-title-2">{t('achievements.title')}</h2>
              <ul className="mt-6 space-y-3">
                {experience.achievements.map((item) => (
                  <li key={item} className="flex gap-3 text-body text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-10">
            <section>
              <h2 className="mb-3 px-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                {t('companyInfo.title')}
              </h2>
              <GroupedList>
                {experience.location && (
                  <GroupedListItem leading={<MapPin className={rowIconClass} />} title={experience.location} />
                )}
                {experience.teamSize && (
                  <GroupedListItem
                    leading={<Users className={rowIconClass} />}
                    title={t('companyInfo.teamSize', { size: experience.teamSize })}
                  />
                )}
                {experience.industry && (
                  <GroupedListItem leading={<Building className={rowIconClass} />} title={experience.industry} />
                )}
                <GroupedListItem leading={<Calendar className={rowIconClass} />} title={experience.duration} />
                <GroupedListItem leading={<Briefcase className={rowIconClass} />} title={employmentType} />
                {experience.website && <GroupedListItem title={t('visitWebsite')} href={experience.website} />}
              </GroupedList>
            </section>
            <section>
              <h2 className="mb-3 px-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                {t('skillsAndTech')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1 text-[0.9375rem] font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
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
      </div>
    </article>
  );
}
