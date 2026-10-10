'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientOnly } from '@/components/client-only';
import { CrossfadeIcon } from '@/components/crossfade-icon';
import { useTheme } from '@/components/theme-provider';
import { spring } from '@/lib/motion';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';
import { languageNames, locales, type Locale } from '@/types/i18n';

const localePrefix = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

function stripLocale(path: string) {
  return path.replace(localePrefix, '') || '/';
}

function useLanguageSwitch() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const switchTo = (code: Locale) => {
    if (code === locale) return;
    startTransition(() => {
      router.replace(`/${code}${stripLocale(pathname)}`);
      router.refresh();
    });
  };

  return { locale, switchTo };
}

/** Desktop: an "EN ▾" pill that opens a menu of endonyms. */
function LanguageMenu() {
  const { locale, switchTo } = useLanguageSwitch();
  const t = useTranslations('navigation');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 gap-1 px-3 has-[>svg]:px-3 text-[0.8125rem] uppercase"
          aria-label={`${locale.toUpperCase()}, ${t('changeLanguage')}`}
          title={t('changeLanguage')}
        >
          {locale}
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchTo(code)}
            aria-current={locale === code ? 'true' : undefined}
            className="min-h-11 cursor-pointer"
          >
            <span lang={code}>{languageNames[code]}</span>
            {locale === code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Mobile sheet: the three languages inline, so no menu opens over the sheet. */
function LanguageList() {
  const { locale, switchTo } = useLanguageSwitch();
  const t = useTranslations('navigation');

  return (
    <div role="group" aria-label={t('changeLanguage')} className="flex flex-wrap gap-2">
      {locales.map((code) => (
        <Button
          key={code}
          lang={code}
          variant={locale === code ? 'default' : 'secondary'}
          aria-pressed={locale === code}
          onClick={() => switchTo(code)}
          className="h-11 px-4 text-[0.875rem]"
        >
          {languageNames[code]}
        </Button>
      ))}
    </div>
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
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const burgerRef = useRef<HTMLButtonElement>(null);

  const navItems = useMemo(
    () => [
      { href: `/${locale}/about`, label: t('about'), path: '/about' },
      { href: `/${locale}/projects`, label: t('projects'), path: '/projects' },
      { href: `/${locale}/contact`, label: t('contact'), path: '/contact' },
    ],
    [locale, t]
  );

  // Home highlights nothing: the wordmark is Home.
  const activeHref = navItems.find((item) => currentPath.startsWith(item.path))?.href ?? null;

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
    if (isDesktop) setIsOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      // The focused element inside the sheet unmounts; hand focus back to the button that opened it.
      burgerRef.current?.focus();
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
        <div className="page-container flex h-12 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link
            href={`/${locale}`}
            className="inline-flex h-11 items-center text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground md:justify-self-start"
          >
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
                aria-current={item.href === activeHref ? (currentPath === item.path ? 'page' : 'true') : undefined}
                className={cn(
                  'relative flex h-11 items-center rounded-full px-3.5 text-[0.8125rem] transition-colors',
                  item.href === activeHref ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center md:justify-self-end">
            <div className="hidden items-center md:flex">
              <LanguageMenu />
              <ClientOnly fallback={<div className="size-11" />}>
                <ThemeToggle />
              </ClientOnly>
            </div>
            <Button
              ref={burgerRef}
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
            <div className="page-container pb-6 pt-2">
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
                    aria-current={item.href === activeHref ? (currentPath === item.path ? 'page' : 'true') : undefined}
                    className={cn(
                      'block border-b border-border py-3 text-title-2',
                      item.href === activeHref ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 flex items-center justify-between gap-3">
                <LanguageList />
                <ClientOnly fallback={<div className="size-11" />}>
                  <ThemeToggle />
                </ClientOnly>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
