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
        {/* Liquid Glass Overlay Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.1, 
            scale: 1,
            transition: {
              duration: 0.8,
              delay: 0.2,
            }
          }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-3xl -z-10"
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
