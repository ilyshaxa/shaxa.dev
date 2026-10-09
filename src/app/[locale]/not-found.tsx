'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-display text-muted-foreground">404</p>
        <h1 className="mt-4 text-title-2">{t('notFound')}</h1>
        <p className="mx-auto mt-3 max-w-md text-body text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="plain" className="mt-6">
          <Link href={`/${locale}`}>
            {t('backToHome')}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
