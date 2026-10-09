'use client';

import { MotionConfig } from 'framer-motion';
import { spring } from '@/lib/motion';

// reducedMotion="user": under prefers-reduced-motion, framer drops transform/layout animation
// and keeps opacity. Unspecified transitions default to the critically damped spring.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring.default}>
      {children}
    </MotionConfig>
  );
}
