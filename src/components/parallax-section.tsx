'use client';

import { motion } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({ children, className = '' }: ParallaxSectionProps) {
  return (
    <motion.div className={className}>
      {children}
    </motion.div>
  );
}
