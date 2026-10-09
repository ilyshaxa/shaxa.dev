'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Stagger offset in seconds; capped at 0.2s so content never waits on a long cascade. */
  delay?: number;
  distance?: number;
  className?: string;
}

const offsets = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
} as const;

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 16,
  className = '',
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const [dx, dy] = offsets[direction];

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: dx * distance, y: dy * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.2 }}
      transition={{ ...spring.default, delay: Math.min(delay, 0.2) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
