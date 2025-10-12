'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Database, Globe, Zap, Server, GitBranch, Container, Cloud, Terminal, Layers, GitCommit, Monitor, HardDrive, Network, Shield, Settings, Box, Activity, Wrench, Cog } from 'lucide-react';

const icons = [Code, Cpu, Database, Globe, Zap, Server, GitBranch, Container, Cloud, Terminal, Layers, GitCommit, Monitor, HardDrive, Network, Shield, Settings, Box, Activity, Wrench, Cog];

export function FloatingElements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingElements = useMemo(() => {
    return icons.map((icon, index) => {
      // Divide icons into 4 quadrants
      const quadrant = index % 4;
      let x, y;
      
      switch(quadrant) {
        case 0: // Top-left quadrant
          x = Math.random() * 25; // 0 to 25%
          y = Math.random() * 25; // 0 to 25%
          break;
        case 1: // Top-right quadrant
          x = 75 + Math.random() * 25; // 75 to 100%
          y = Math.random() * 25; // 0 to 25%
          break;
        case 2: // Bottom-left quadrant
          x = Math.random() * 25; // 0 to 25%
          y = 75 + Math.random() * 25; // 75 to 100%
          break;
        case 3: // Bottom-right quadrant
          x = 75 + Math.random() * 25; // 75 to 100%
          y = 75 + Math.random() * 25; // 75 to 100%
          break;
        default:
          x = 50;
          y = 50;
      }
      
      return {
        icon,
        delay: Math.random() * 5,
        x,
        y,
      };
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-700/50 dark:text-white/30"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.1, 1, 0],
            y: [0, -10, -20, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            delay: element.delay,
            ease: 'easeInOut',
          }}
        >
          <element.icon className="h-6 w-6" />
        </motion.div>
      ))}
    </div>
  );
}
