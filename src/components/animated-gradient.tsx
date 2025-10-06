'use client';

import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradient({ children, className = '' }: AnimatedGradientProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        animate={{
          background: [
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
            'linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6)',
            'linear-gradient(45deg, #ec4899, #3b82f6, #8b5cf6)',
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '300% 300%',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
