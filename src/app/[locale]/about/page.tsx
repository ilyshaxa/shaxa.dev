'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Award, Code, Globe, GraduationCap, Heart, type LucideIcon } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { ExperienceList } from '@/components/experience-list';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { SkillsBento } from '@/components/skills-bento';
import { ThemedImage } from '@/components/themed-image';
import { getAllExperiences, getProfile, localizeEducation, localizeExperiences } from '@/lib/data';
import { cn } from '@/lib/utils';

const values: Array<{
  key: 'codeQuality' | 'userCentric' | 'continuousLearning' | 'collaboration';
  icon: LucideIcon;
  color: string;
}> = [
  { key: 'codeQuality', icon: Code, color: 'text-[#007aff] dark:text-[#0a84ff]' },
  { key: 'userCentric', icon: Heart, color: 'text-[#ff2d55] dark:text-[#ff375f]' },
  { key: 'continuousLearning', icon: GraduationCap, color: 'text-[#af52de] dark:text-[#bf5af2]' },
  { key: 'collaboration', icon: Globe, color: 'text-[#34c759] dark:text-[#30d158]' },
];

const funFacts = ['linux', 'fitness', 'gaming', 'learner'] as const;

const tileClass = 'rounded-tile bg-secondary p-6 md:p-8 contrast-more:border contrast-more:border-foreground/40';
const sectionClass = 'mt-24 md:mt-32';

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
  const tProfile = useTranslations('profile');

  const activeCertifications = profile.certifications.filter(
    (cert) => cert.status !== 'Planned' && cert.status !== 'Expired'
  );

  const languageName = (name: string) => {
    try {
      return tProfile(`languages.${name}`);
    } catch {
      return name;
    }
  };

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[980px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('title')} subtitle={t('subtitle')} />
        </ScrollReveal>

        {/* Bio */}
        <ScrollReveal className="mx-auto max-w-[680px] space-y-6 text-body-lg text-muted-foreground text-pretty">
          <p>{tProfile('bio')}</p>
          <p>{t('sections.bio.additionalText')}</p>
        </ScrollReveal>

        {/* Experience */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.experience.title')} subtitle={t('sections.experience.subtitle')} />
          </ScrollReveal>
          <ScrollReveal>
            <ExperienceList experiences={experiences} variant="detailed" />
          </ScrollReveal>
        </section>

        {/* Education & certifications */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.education.title')} subtitle={t('sections.education.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <ScrollReveal>
              <h3 className="mb-3 px-1 text-headline">{t('sections.education.educationTab')}</h3>
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
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <h3 className="mb-3 px-1 text-headline">{t('sections.education.certificationsTab')}</h3>
              {activeCertifications.length > 0 ? (
                <GroupedList>
                  {activeCertifications.map((cert) => {
                    const logo = cert.logo || cert.logoLight || cert.logoDark;
                    return (
                      <GroupedListItem
                        key={cert.name}
                        leading={
                          <LogoTile>
                            {logo ? (
                              <ThemedImage
                                src={logo}
                                lightSrc={cert.logoLight}
                                darkSrc={cert.logoDark}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-contain p-1.5"
                                unoptimized={cert.logo?.includes('british-council')}
                              />
                            ) : (
                              <Award className="size-5 text-muted-foreground" />
                            )}
                          </LogoTile>
                        }
                        title={cert.name}
                        subtitle={`${cert.issuer} · ${cert.year}`}
                      />
                    );
                  })}
                </GroupedList>
              ) : (
                <div className="rounded-lg bg-secondary px-6 py-10 text-center">
                  <p className="text-headline">{t('sections.education.comingSoon')}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{t('sections.education.comingSoonDesc')}</p>
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>

        {/* Skills & languages */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.skills.title')} subtitle={t('sections.skills.subtitle')} />
          </ScrollReveal>
          <SkillsBento skills={profile.skills} />
          <ScrollReveal className="mt-16">
            <h3 className="mb-3 px-1 text-headline">{t('sections.skills.languages')}</h3>
            <GroupedList>
              {profile.languages.map((language) => (
                <GroupedListItem
                  key={language.name}
                  leading={
                    language.flag ? (
                      <span className="relative block h-6 w-8 overflow-hidden rounded-[4px]">
                        <Image src={language.flag} alt="" fill sizes="32px" className="object-cover" />
                      </span>
                    ) : (
                      <Globe className="size-5 text-muted-foreground" />
                    )
                  }
                  title={languageName(language.name)}
                  trailing={language.level}
                />
              ))}
            </GroupedList>
          </ScrollReveal>
        </section>

        {/* Values */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.values.title')} subtitle={t('sections.values.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {values.map(({ key, icon: Icon, color }, index) => (
              <ScrollReveal key={key} delay={index * 0.05} className={tileClass}>
                <Icon className={cn('size-7', color)} strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 text-headline">{t(`sections.values.${key}.title`)}</h3>
                <p className="mt-2 text-body text-muted-foreground">{t(`sections.values.${key}.description`)}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Fun facts (titles already start with an emoji) */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.funFacts.title')} subtitle={t('sections.funFacts.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {funFacts.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.05} className={tileClass}>
                <h3 className="text-headline">{t(`sections.funFacts.${key}.title`)}</h3>
                <p className="mt-2 text-body text-muted-foreground">{t(`sections.funFacts.${key}.description`)}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
