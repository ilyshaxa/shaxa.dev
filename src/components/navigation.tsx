'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download, Key, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { getProfile } from '@/lib/data';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const profile = getProfile();
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 liquid-glass dark:liquid-glass-dark border-b border-gray-200/30 dark:border-white/20 shadow-lg dark:shadow-2xl"
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
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-md"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="bg-gray-100/50 dark:bg-white/10 hover:bg-gray-200/50 dark:hover:bg-white/20"
              title={`Current theme: ${theme} (${actualTheme})`}
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="glass-dark hover:bg-white/10"
            >
              <a href={profile.cvUrl} download>
                <Download className="h-4 w-4 mr-2" />
                CV
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="glass-dark hover:bg-white/10"
            >
              <a href={profile.sshKeyUrl} download>
                <Key className="h-4 w-4 mr-2" />
                SSH
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="bg-gray-100/50 dark:bg-white/10 hover:bg-gray-200/50 dark:hover:bg-white/20"
              title={`Current theme: ${theme} (${actualTheme})`}
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="glass-dark hover:bg-white/10"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="md:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
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
                  className="w-full justify-start glass-dark hover:bg-white/10"
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
                  className="w-full justify-start glass-dark hover:bg-white/10"
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
