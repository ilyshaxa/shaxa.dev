'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 1.05, 
          y: -20,
          transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
