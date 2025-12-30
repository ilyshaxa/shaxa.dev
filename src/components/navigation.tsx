'use client';

import { useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ClientOnly } from '@/components/client-only';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const { setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const getThemeIcon = () => (actualTheme === 'dark' ? Moon : Sun);

  const ThemeIcon = getThemeIcon();

  // Remove locale prefix from pathname for comparison
  const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(en|uz|ru)/, '') || '/';
  };

  const currentPath = getPathWithoutLocale(pathname);

  const navItems = [
    { href: `/${locale}`, label: t('home'), path: '/' },
    { href: `/${locale}/about`, label: t('about'), path: '/about' },
    { href: `/${locale}/projects`, label: t('projects'), path: '/projects' },
    { href: `/${locale}/contact`, label: t('contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  // CV download handler
  const handleCvDownload = () => {
    const cvUrls: Record<string, string> = {
      en: '/cv/shaxriyor-jabborov-cv-en.pdf',
      uz: '/cv/shaxriyor-jabborov-cv-uz.pdf',
      ru: '/cv/shaxriyor-jabborov-cv-ru.pdf',
    };
    
    const cvUrl = cvUrls[locale] || cvUrls.en;
    
    // Get localized language name
    const languageNameKey = `languageNames.${locale}` as 'languageNames.en' | 'languageNames.uz' | 'languageNames.ru';
    const languageName = t(languageNameKey) || t('languageNames.en');
    
    // Show localized toast notification
    toast.success(t('downloadingCV', { language: languageName }));
    
    // Wait 2 seconds before downloading to let user read the notification
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = `shaxriyor-jabborov-cv-${locale}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    startTransition(() => {
      router.replace(`/${newLocale}${pathWithoutLocale}`);
      router.refresh();
    });
  };

  // Deterministic pill animation: measure active link and animate an absolute indicator
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

  const updateIndicator = () => {
    const container = linksContainerRef.current;
    if (!container) return;
    const activeItem = navItems.find(item => isActive(item.path));
    if (!activeItem) {
      setIndicator(null);
      return;
    }
    const active = linkRefs.current[activeItem.href];
    if (!active) {
      setIndicator(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setIndicator({ x: activeRect.left - containerRect.left, width: activeRect.width });
  };

  useLayoutEffect(() => {
    updateIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/10 bg-clip-padding backdrop-filter backdrop-blur-sm border-b border-gray-100 dark:border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-gradient"
            >
              shaxa.dev
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative" ref={linksContainerRef}>
            {indicator && (
              <motion.div
                className="absolute top-0 bottom-0 rounded-md bg-black/5 dark:bg-white/10"
                initial={false}
                animate={{ x: indicator.x, width: indicator.width }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{ left: 0 }}
              />
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el: HTMLAnchorElement | null) => {
                  linkRefs.current[item.href] = el;
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="glass"
                    size="sm"
                    title={t('changeLanguage')}
                    aria-label={t('changeLanguage')}
                    className="gap-1.5"
                  >
                    <span className="text-base leading-none">
                      {languages.find(lang => lang.code === locale)?.flag || '🌐'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {locale === lang.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </ClientOnly>

            <ClientOnly>
              <Button
                variant="glass"
                size="sm"
                onClick={cycleTheme}
                title={t('currentTheme', { theme: t(`themeNames.${actualTheme}` as 'themeNames.light' | 'themeNames.dark') })}
                aria-label={actualTheme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}
                className="relative w-9 h-9 p-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={actualTheme}
                    initial={{ rotate: -180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 180, scale: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {actualTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-foreground" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </ClientOnly>
            
            <Button
              variant="glass"
              size="sm"
              onClick={handleCvDownload}
              className="text-foreground"
              title={t('downloadCV')}
              aria-label={t('downloadCV')}
            >
              <Download className="h-4 w-4 mr-2 text-foreground/90" />
              {t('cv')}
            </Button>
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher Mobile */}
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="glass"
                    size="sm"
                    title={t('changeLanguage')}
                    aria-label={t('changeLanguage')}
                    className="gap-1.5"
                  >
                    <span className="text-base leading-none">
                      {languages.find(lang => lang.code === locale)?.flag || '🌐'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {locale === lang.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </ClientOnly>

            <ClientOnly>
              <Button
                variant="glass"
                size="sm"
                onClick={cycleTheme}
                title={t('currentTheme', { theme: t(`themeNames.${actualTheme}` as 'themeNames.light' | 'themeNames.dark') })}
                aria-label={actualTheme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}
                className="relative w-9 h-9 p-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={actualTheme}
                    initial={{ rotate: -180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 180, scale: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {actualTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-foreground" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </ClientOnly>
            
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
              aria-label={isOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-4 w-4 text-foreground" /> : <Menu className="h-4 w-4 text-foreground" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/10 dark:bg-black/10 bg-clip-padding backdrop-filter backdrop-blur-sm border-t border-gray-100 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCvDownload}
                  className="w-full justify-start bg-white/10 dark:bg-black/10 bg-clip-padding backdrop-filter backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/20 border border-gray-100 dark:border-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('downloadCV')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
