'use client';

import { Github, Instagram, Linkedin, Mail, Twitter, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/last-updated';
import { getProfile } from '@/lib/data';

export function Footer() {
  const profile = getProfile();
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const socials: Array<{ href: string; label: string; icon: LucideIcon; external: boolean }> = [
    { href: profile.github, label: "Visit Shaxriyor's GitHub profile", icon: Github, external: true },
    { href: profile.linkedin, label: 'Connect with Shaxriyor on LinkedIn', icon: Linkedin, external: true },
    { href: profile.twitter, label: 'Follow Shaxriyor on Twitter', icon: Twitter, external: true },
    { href: `mailto:${profile.email}`, label: 'Send email to Shaxriyor', icon: Mail, external: false },
    { href: profile.instagram, label: 'Follow Shaxriyor on Instagram', icon: Instagram, external: true },
  ];

  return (
    <footer className="relative z-10 bg-secondary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-5 text-center text-caption text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-1">
          {socials.map(({ href, label, icon: Icon, external }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <a href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <Icon className="size-5" />
              </a>
            </Button>
          ))}
        </div>
        <div aria-hidden className="h-px w-full max-w-md bg-border" />
        <p>{t('copyright', { year: currentYear, name: profile.name })}</p>
        <LastUpdated />
        <p>
          {t('template')}{' '}
          <a
            href="https://github.com/ilyshaxa/shaxa.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t('github')}
          </a>
        </p>
      </div>
    </footer>
  );
}
