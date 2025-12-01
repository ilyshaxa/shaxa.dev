'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Database, Globe, Server, Container, Cloud, Terminal } from 'lucide-react';

// Reduced from 21 to 8 icons for better performance
const icons = [Code, Cpu, Database, Globe, Server, Container, Cloud, Terminal];

export function FloatingElements() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if mobile
    setIsMobile(window.innerWidth < 768);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const floatingElements = useMemo(() => {
    // Further reduce on mobile
    const iconsToUse = isMobile ? icons.slice(0, 4) : icons;
    
    return iconsToUse.map((icon, index) => {
      // Divide icons into 4 quadrants
      const quadrant = index % 4;
      let x, y;
      
      switch(quadrant) {
        case 0: // Top-left quadrant
          x = Math.random() * 20; // 0 to 20%
          y = Math.random() * 20; // 0 to 20%
          break;
        case 1: // Top-right quadrant
          x = 80 + Math.random() * 20; // 80 to 100%
          y = Math.random() * 20; // 0 to 20%
          break;
        case 2: // Bottom-left quadrant
          x = Math.random() * 20; // 0 to 20%
          y = 80 + Math.random() * 20; // 80 to 100%
          break;
        case 3: // Bottom-right quadrant
          x = 80 + Math.random() * 20; // 80 to 100%
          y = 80 + Math.random() * 20; // 80 to 100%
          break;
        default:
          x = 50;
          y = 50;
      }
      
      return {
        icon,
        delay: index * 1.5,
        x,
        y,
      };
    });
  }, [isMobile]);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-700/40 dark:text-white/20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0, 1, 1, 0],
            y: [0, -15, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: element.delay,
            ease: 'easeInOut',
            repeatDelay: 2,
          }}
        >
          <element.icon className="h-5 w-5" />
        </motion.div>
      ))}
    </div>
  );
}
