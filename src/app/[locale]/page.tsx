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
import { ProjectRow } from '@/components/project-row';
import { SectionHeader } from '@/components/section-header';
import { StackList } from '@/components/stack-list';
import { AVATAR_BLUR_DATA_URL } from '@/lib/avatar';
import { getAllProjects, getProfile, localizeExperiences, localizeProjects } from '@/lib/data';
import { spring } from '@/lib/motion';

function SeeMore({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button asChild variant="plain">
      <Link href={href}>
        {children}
        <ChevronRight className="size-4" />
      </Link>
    </Button>
  );
}

export default function Home() {
  const profile = getProfile();
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations('home');
  const tProfile = useTranslations('profile');

  const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
  const featured = projects.filter((project) => project.featured);
  const experiences = useMemo(() => localizeExperiences(profile.experience, messages), [profile.experience, messages]);

  return (
    <div className="section-stack pb-24 md:pb-32">
      {/* Hero: text left, photo right on desktop; a small photo above the text on mobile. */}
      <section className="page-container pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.default}
          className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16"
        >
          <div className="size-28 overflow-hidden rounded-full ring-1 ring-border md:order-2 md:size-[270px]">
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
          <div className="md:order-1">
            <h1 className="text-display text-balance">{profile.name}</h1>
            <p className="mt-3 text-title-2 text-muted-foreground">{t('hero.role')}</p>
            <p className="mt-6 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">{t('hero.lead')}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              {tProfile('location')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <CvMenu align="start">
                <Button size="lg">
                  <Download className="size-5" />
                  {t('hero.downloadCV')}
                  <ChevronDown className="size-4 opacity-80" />
                </Button>
              </CvMenu>
              <Button asChild variant="plain" size="lg">
                <Link href={`/${locale}/contact`}>
                  {t('hero.getInTouch')}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="page-container">
        <SectionHeader
          title={t('work.title')}
          action={<SeeMore href={`/${locale}/projects`}>{t('work.all')}</SeeMore>}
        />
        <div className="flex flex-col gap-4">
          {featured.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="page-container">
        <SectionHeader
          title={t('experience.title')}
          action={<SeeMore href={`/${locale}/about`}>{t('experience.more')}</SeeMore>}
        />
        <ExperienceList experiences={experiences} />
      </section>

      <section className="page-container">
        <SectionHeader title={t('stack.title')} />
        <StackList stack={profile.stack} />
      </section>

      <section className="page-container">
        <h2 className="text-title-1 text-balance">{t('contact.title')}</h2>
        <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">
          {t.rich('contact.body', {
            address: profile.email,
            mail: (chunks) => (
              <a href={`mailto:${profile.email}`} className="text-primary underline-offset-4 hover:underline">
                {chunks}
              </a>
            ),
          })}
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href={`/${locale}/contact`}>{t('contact.cta')}</Link>
        </Button>
      </section>
    </div>
  );
}
