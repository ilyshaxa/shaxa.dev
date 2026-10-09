'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Download, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientOnly } from '@/components/client-only';
import { CrossfadeIcon } from '@/components/crossfade-icon';
import { CvMenu } from '@/components/cv-menu';
import { useTheme } from '@/components/theme-provider';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

function stripLocale(path: string) {
  return path.replace(/^\/(en|uz|ru)/, '') || '/';
}

function LanguageMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const [, startTransition] = useTransition();
  const current = languages.find((language) => language.code === locale);

  const switchTo = (code: string) => {
    startTransition(() => {
      router.replace(`/${code}${stripLocale(pathname)}`);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('changeLanguage')} title={t('changeLanguage')}>
          <span className="text-base leading-none">{current?.flag ?? '🌐'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} onClick={() => switchTo(language.code)} className="cursor-pointer">
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const t = useTranslations('navigation');
  const isDark = actualTheme === 'dark';

  // Cross-fade the whole page instead of flashing between light and dark.
  // flushSync makes next-themes apply the class inside the view-transition callback.
  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    if (reduceMotion || typeof document.startViewTransition !== 'function') {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
      title={t('currentTheme', { theme: t(isDark ? 'themeNames.dark' : 'themeNames.light') })}
    >
      <CrossfadeIcon showAlt={isDark} icon={Sun} altIcon={Moon} />
    </Button>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const currentPath = stripLocale(pathname);

  const navItems = useMemo(
    () => [
      { href: `/${locale}`, label: t('home'), path: '/' },
      { href: `/${locale}/about`, label: t('about'), path: '/about' },
      { href: `/${locale}/projects`, label: t('projects'), path: '/projects' },
      { href: `/${locale}/contact`, label: t('contact'), path: '/contact' },
    ],
    [locale, t]
  );

  const activeHref =
    navItems.find((item) => (item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)))?.href ??
    null;

  // Sliding pill: measure the active link and spring the indicator to it.
  const linksRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

  const measureIndicator = useCallback(() => {
    const container = linksRef.current;
    const active = activeHref ? linkRefs.current[activeHref] : null;
    if (!container || !active) {
      setIndicator(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setIndicator({ x: activeRect.left - containerRect.left, width: activeRect.width });
  }, [activeHref]);

  useLayoutEffect(() => {
    measureIndicator();
    // Label widths change once the web font arrives.
    document.fonts?.ready.then(measureIndicator);
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  // Hairline under the bar only once content scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="material-bar relative">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">
            shaxa.dev
          </Link>

          <div ref={linksRef} className="relative hidden items-center gap-1 md:flex">
            {indicator && (
              <motion.div
                aria-hidden
                className="absolute inset-y-2 left-0 rounded-full bg-black/[0.05] dark:bg-white/[0.1]"
                initial={false}
                animate={{ x: indicator.x, width: indicator.width }}
                transition={spring.snappy}
              />
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(element) => {
                  linkRefs.current[item.href] = element;
                }}
                aria-current={item.href === activeHref ? 'page' : undefined}
                className={cn(
                  'relative flex h-11 items-center rounded-full px-3.5 text-[0.8125rem] transition-colors',
                  item.href === activeHref ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <LanguageMenu />
            <ClientOnly fallback={<div className="size-11" />}>
              <ThemeToggle />
            </ClientOnly>
            <CvMenu>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" title={t('downloadCV')} aria-label={t('downloadCV')}>
                <Download className="size-4" />
                {t('cv')}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </CvMenu>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <CrossfadeIcon showAlt={isOpen} icon={Menu} altIcon={X} />
            </Button>
          </div>
        </div>
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-border"
          initial={false}
          animate={{ opacity: isScrolled || isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-scrim"
            aria-hidden
            className="fixed inset-x-0 bottom-0 top-12 -z-10 bg-black/20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="material-sheet overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.default}
          >
            <div className="px-6 pb-6 pt-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.default, delay: index * 0.03 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={item.href === activeHref ? 'page' : undefined}
                    className={cn(
                      'block border-b border-border py-3 text-title-2',
                      item.href === activeHref ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <CvMenu align="start">
                <Button variant="secondary" className="mt-6 w-full">
                  <Download className="size-4" />
                  {t('downloadCV')}
                  <ChevronDown className="ml-auto size-4" />
                </Button>
              </CvMenu>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
