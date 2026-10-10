'use client';

import { useTranslations } from 'next-intl';
import { getProfile } from '@/lib/data';

export function Footer() {
  const profile = getProfile();
  const t = useTranslations('footer');

  // Brand names are not translated; only "Email" is.
  const links = [
    { href: profile.github, label: 'GitHub', external: true },
    { href: profile.linkedin, label: 'LinkedIn', external: true },
    { href: profile.twitter, label: 'X', external: true },
    { href: profile.instagram, label: 'Instagram', external: true },
    { href: `mailto:${profile.email}`, label: t('email'), external: false },
  ];

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="page-container flex flex-col gap-1 py-6 text-caption text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{t('copyright', { year: new Date().getFullYear(), name: profile.name })}</p>
        <ul className="flex flex-wrap gap-x-5">
          {links.map(({ href, label, external }) => (
            <li key={label}>
              <a
                href={href}
                className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
