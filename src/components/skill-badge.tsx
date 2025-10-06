'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  category: 'frontend' | 'backend' | 'tools';
  index: number;
}

const categoryColors = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-green-500 to-emerald-500',
  tools: 'from-purple-500 to-pink-500',
};

export function SkillBadge({ skill, category, index }: SkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={cn(
        'glass-dark px-4 py-2 rounded-full text-sm font-medium',
        'bg-gradient-to-r',
        categoryColors[category],
        'bg-clip-text text-transparent',
        'border border-gray-200/30 dark:border-white/20 hover:border-gray-300/50 dark:hover:border-white/40',
        'transition-all duration-300 cursor-default'
      )}
    >
      {skill}
    </motion.div>
  );
}
