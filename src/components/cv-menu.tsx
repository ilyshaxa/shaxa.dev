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

const cvOptions = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'uz', flag: '🇺🇿', name: "O'zbekcha" },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
] as const;

type CvLocale = (typeof cvOptions)[number]['code'];

interface CvMenuProps {
  /** The trigger, rendered via DropdownMenuTrigger asChild. */
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function CvMenu({ children, align = 'end' }: CvMenuProps) {
  const locale = useLocale();
  const t = useTranslations('navigation');

  const download = (cvLocale: CvLocale) => {
    const link = document.createElement('a');
    link.href = `/cv/shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.download = `shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.click();
    toast.success(`${t(`languageNames.${cvLocale}`)} CV download complete`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {cvOptions.map((option) => (
          <DropdownMenuItem key={option.code} onClick={() => download(option.code)} className="cursor-pointer">
            <span>{option.flag}</span>
            <span>{option.name}</span>
            {locale === option.code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
