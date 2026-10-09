'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface CrossfadeIconProps {
  showAlt: boolean;
  icon: LucideIcon;
  altIcon: LucideIcon;
  className?: string;
}

/** Two stacked icons that cross-fade. Both stay mounted, so a mid-flight toggle just retargets. */
export function CrossfadeIcon({ showAlt, icon: Icon, altIcon: AltIcon, className = 'size-5' }: CrossfadeIconProps) {
  return (
    <span aria-hidden className={cn('relative inline-flex', className)}>
      <motion.span
        className="absolute inset-0 flex"
        initial={false}
        animate={{ opacity: showAlt ? 0 : 1, scale: showAlt ? 0.8 : 1 }}
        transition={spring.snappy}
      >
        <Icon className="size-full" />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex"
        initial={false}
        animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.8 }}
        transition={spring.snappy}
      >
        <AltIcon className="size-full" />
      </motion.span>
    </span>
  );
}
