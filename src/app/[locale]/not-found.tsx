'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="page-container flex min-h-[60vh] flex-col justify-center pb-24 pt-12">
      <p className="text-title-2 text-muted-foreground">404</p>
      <h1 className="mt-2 text-title-1 text-balance">{t('title')}</h1>
      <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">{t('body')}</p>
      <Button asChild variant="plain" size="lg" className="mt-6 self-start">
        <Link href={`/${locale}`}>
          {t('cta')}
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
