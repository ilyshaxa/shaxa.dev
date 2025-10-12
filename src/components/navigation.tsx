'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ClientOnly } from '@/components/client-only';
import { getProfile } from '@/lib/data';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const profile = getProfile();
  const { setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const getThemeIcon = () => (actualTheme === 'dark' ? Moon : Sun);

  const ThemeIcon = getThemeIcon();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  // Deterministic pill animation: measure active link and animate an absolute indicator
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

  const updateIndicator = () => {
    const container = linksContainerRef.current;
    if (!container) return;
    const active = linkRefs.current[pathname];
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
  }, [pathname]);

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
      className="fixed top-0 left-0 right-0 z-50 bg-blue-0 dark:bg-blue-0 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 dark:bg-opacity-10 border-b border-gray-100 dark:border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
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
                  isActive(item.href)
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
            <ClientOnly>
              <Button
                variant="glass"
                size="sm"
                onClick={cycleTheme}
                title={`Current theme: ${actualTheme}`}
              >
                <ThemeIcon className="h-4 w-4 text-foreground" />
              </Button>
            </ClientOnly>
            
            <Button
              variant="glass"
              size="sm"
              asChild
              className="text-foreground"
            >
              <a href={profile.cvUrl} download>
                <Download className="h-4 w-4 mr-2 text-foreground/90" />
                CV
              </a>
            </Button>
            
            <Button
              variant="glass"
              size="sm"
              asChild
              className="text-foreground"
            >
              <a href={profile.sshKeyUrl} download>
                <Key className="h-4 w-4 mr-2 text-foreground/90" />
                SSH
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ClientOnly>
              <Button
                variant="glass"
                size="sm"
                onClick={cycleTheme}
                title={`Current theme: ${actualTheme}`}
              >
                <ThemeIcon className="h-4 w-4 text-foreground" />
              </Button>
            </ClientOnly>
            
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
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
            className="md:hidden bg-blue-400 dark:bg-blue-600 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 dark:bg-opacity-10 border-t border-gray-100 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                    isActive(item.href)
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
                  asChild
                  className="w-full justify-start bg-blue-400 dark:bg-blue-600 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20 border border-gray-100 dark:border-white/10"
                >
                  <a href={profile.cvUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </a>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-blue-400 dark:bg-blue-600 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20 border border-gray-100 dark:border-white/10"
                >
                  <a href={profile.sshKeyUrl} download>
                    <Key className="h-4 w-4 mr-2" />
                    Download SSH Key
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
