'use client';

import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languageNames, locales, type Locale } from '@/types/i18n';

interface CvMenuProps {
  /** The trigger, rendered via DropdownMenuTrigger asChild. */
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function CvMenu({ children, align = 'end' }: CvMenuProps) {
  const locale = useLocale();
  const t = useTranslations('navigation');

  const download = (cvLocale: Locale) => {
    const link = document.createElement('a');
    link.href = `/cv/shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.download = `shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.click();
    toast.success(t('cvDownloaded', { language: t(`languageNames.${cvLocale}`) }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => download(code)}
            aria-current={locale === code ? 'true' : undefined}
            className="cursor-pointer"
          >
            <span lang={code}>{languageNames[code]}</span>
            {locale === code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
