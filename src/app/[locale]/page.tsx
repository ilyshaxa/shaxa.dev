'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { ChevronDown, ChevronRight, Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CvMenu } from '@/components/cv-menu';
import { ExperienceList } from '@/components/experience-list';
import { ProjectCarousel } from '@/components/project-carousel';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { SkillsBento } from '@/components/skills-bento';
import { AVATAR_BLUR_DATA_URL } from '@/lib/avatar';
import { getAllProjects, getProfile, localizeExperiences, localizeProjects } from '@/lib/data';
import { spring } from '@/lib/motion';

export default function Home() {
  const profile = getProfile();
  const baseProjects = getAllProjects();
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations('home');
  const tProfile = useTranslations('profile');

  const projects = useMemo(() => localizeProjects(baseProjects, messages), [baseProjects, messages]);
  const experiences = useMemo(() => localizeExperiences(profile.experience, messages), [profile.experience, messages]);
  const featuredProjects = projects.filter((project) => project.featured);
  const carouselProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <div>
      {/* Hero */}
      <section className="px-4 pb-24 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.default}
          className="mx-auto flex max-w-[980px] flex-col items-center text-center"
        >
          <div className="size-[270px] overflow-hidden rounded-full ring-1 ring-border">
            <Image
              src="/images/profile.jpg"
              alt="Shaxriyor Jabborov"
              width={270}
              height={270}
              className="size-full object-cover"
              quality={75}
              priority
              fetchPriority="high"
              placeholder="blur"
              blurDataURL={AVATAR_BLUR_DATA_URL}
            />
          </div>
          <h1 className="mt-8 text-display text-balance">{profile.name}</h1>
          <p className="mt-3 text-title-2 text-muted-foreground text-balance">
            {t('hero.roles.devops')} · {t('hero.roles.awsCertified')}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {tProfile('location')}
          </p>
          <p className="mt-6 max-w-[40rem] text-body-lg text-muted-foreground text-pretty">{tProfile('shortBio')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <CvMenu align="center">
              <Button size="lg">
                <Download className="size-5" />
                {t('hero.downloadCV')}
                <ChevronDown className="size-4 opacity-80" />
              </Button>
            </CvMenu>
            <Button asChild variant="plain" size="lg">
              <Link href={`/${locale}/contact`}>
                {t('cta.getInTouch')}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <SectionHeader title={t('skills.title')} />
          </ScrollReveal>
          <SkillsBento skills={profile.skills} />
        </div>
      </section>

      {/* Experience */}
      <section className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-[980px]">
          <ScrollReveal>
            <SectionHeader title={t('experience.title')} />
          </ScrollReveal>
          <ScrollReveal>
            <ExperienceList experiences={experiences} initialCount={3} />
          </ScrollReveal>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal className="px-4 sm:px-6 lg:px-8">
            <SectionHeader title={t('projects.title')} />
          </ScrollReveal>
          <ProjectCarousel projects={carouselProjects} />
          <div className="mt-8 text-center">
            <Button asChild variant="plain">
              <Link href={`/${locale}/projects`}>
                {t('projects.seeAll')}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-32 pt-24 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-title-1 text-balance">{t('cta.title')}</h2>
          <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{t('cta.subtitle')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t('cta.getInTouch')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/about`}>{t('cta.viewFullProfile')}</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
