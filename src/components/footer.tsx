'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/data';
import { useTheme } from 'next-themes';
import { LastUpdated } from '@/components/last-updated';

export function Footer() {
  const profile = getProfile();
  const { theme } = useTheme();

  return (
    <footer className={`py-16 px-4 sm:px-6 lg:px-8 relative z-10 border-t ${
      theme === 'light' 
        ? 'border-gray-200/60' 
        : 'border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex justify-center space-x-6">
            <Button
              asChild
              variant="glass"
              size="sm"
            >
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Shaxriyor's GitHub profile"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="glass"
              size="sm"
            >
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Connect with Shaxriyor on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="glass"
              size="sm"
            >
              <a 
                href={profile.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Shaxriyor on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="glass"
              size="sm"
            >
              <a 
                href={`mailto:${profile.email}`}
                aria-label="Send email to Shaxriyor"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="glass"
              size="sm"
            >
              <a 
                href={profile.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Shaxriyor on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground">
            © 2025 {profile.name}. Made with Next.js, TypeScript & VibeCoding ☕
          </p>
          <LastUpdated />
          <p className="text-muted-foreground">
            Feel free to use this template from my <a href="https://github.com/ilyshaxa/shaxa.dev" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
