'use client';

import { useMemo } from 'react';
import { Award, ChevronDown, Download, GraduationCap } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CvMenu } from '@/components/cv-menu';
import { ExperienceList } from '@/components/experience-list';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { SectionHeader } from '@/components/section-header';
import { StackList } from '@/components/stack-list';
import { ThemedImage } from '@/components/themed-image';
import { getAllExperiences, getProfile, localizeEducation, localizeExperiences } from '@/lib/data';

function LogoTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
      {children}
    </span>
  );
}

export default function AboutPage() {
  const profile = getProfile();
  const messages = useMessages();
  const experiences = useMemo(() => localizeExperiences(getAllExperiences(), messages), [messages]);
  const education = useMemo(() => localizeEducation(profile.education, messages), [profile.education, messages]);
  const t = useTranslations('about');
  const tHero = useTranslations('home.hero');
  const tProfile = useTranslations('profile');

  return (
    <div className="section-stack pb-24 md:pb-32">
      <section className="page-container pt-12 md:pt-20">
        <h1 className="text-title-1 text-balance">{t('title')}</h1>
        <div className="mt-8 max-w-[40rem] space-y-5 text-body-lg text-muted-foreground text-pretty">
          <p>{t('intro.p1')}</p>
          <p>{t('intro.p2')}</p>
          <p>{t('intro.p3')}</p>
        </div>
        <CvMenu align="start">
          <Button size="lg" variant="secondary" className="mt-8">
            <Download className="size-5" />
            {tHero('downloadCV')}
            <ChevronDown className="size-4 opacity-80" />
          </Button>
        </CvMenu>
      </section>

      <section className="page-container">
        <SectionHeader title={t('headings.experience')} />
        <ExperienceList experiences={experiences} showSummary />
      </section>

      <section className="page-container">
        <SectionHeader title={t('headings.stack')} />
        <StackList stack={profile.stack} />
      </section>

      <section className="page-container">
        <SectionHeader title={t('headings.education')} />
        <GroupedList>
          {education.map((edu) => {
            const logo = edu.logo || edu.logoLight || edu.logoDark;
            return (
              <GroupedListItem
                key={edu.slug}
                leading={
                  <LogoTile>
                    {logo ? (
                      <ThemedImage
                        src={logo}
                        lightSrc={edu.logoLight}
                        darkSrc={edu.logoDark}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <GraduationCap className="size-5 text-muted-foreground" />
                    )}
                  </LogoTile>
                }
                title={edu.degree}
                subtitle={`${edu.institution} · ${edu.year}`}
                href={edu.website}
              />
            );
          })}
        </GroupedList>
      </section>

      <section className="page-container">
        <SectionHeader title={t('headings.certifications')} />
        <GroupedList>
          {profile.certifications.map((certification) => (
            <GroupedListItem
              key={certification.slug}
              leading={
                <LogoTile>
                  <Award className="size-5 text-muted-foreground" />
                </LogoTile>
              }
              title={certification.title}
              // Year only: Chromium has no Uzbek month names, so a month-and-year date renders as "2026 M09" in uz.
              subtitle={`${certification.issuer} · ${certification.issued.slice(0, 4)}`}
              href={certification.url}
            />
          ))}
        </GroupedList>
      </section>

      <section className="page-container">
        <SectionHeader title={t('headings.languages')} />
        <GroupedList>
          {profile.languages.map((language) => (
            <GroupedListItem
              key={language.name}
              title={tProfile(`languages.${language.name}`)}
              trailing={t(`languages.level.${language.level}`)}
            />
          ))}
        </GroupedList>
      </section>
    </div>
  );
}
