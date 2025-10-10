'use client';

import { motion } from 'framer-motion';
import { Code, Cpu, Database, Globe, Zap, Server, GitBranch, Container, Cloud, Terminal, Layers, GitCommit, Monitor, HardDrive, Network, Shield, Settings, Box, Activity, Wrench, Cog } from 'lucide-react';

const floatingElements = [
  { icon: Code, delay: 0, x: 10, y: 20 },
  { icon: Cpu, delay: 1, x: -15, y: 30 },
  { icon: Database, delay: 2, x: 20, y: -10 },
  { icon: Globe, delay: 3, x: -10, y: -20 },
  { icon: Zap, delay: 4, x: 15, y: 25 },
  { icon: Server, delay: 5, x: -25, y: 15 },
  { icon: GitBranch, delay: 6, x: 30, y: 35 },
  { icon: Container, delay: 7, x: -20, y: -15 },
  { icon: Cloud, delay: 8, x: 25, y: -25 },
  { icon: Terminal, delay: 9, x: -30, y: 25 },
  { icon: Layers, delay: 10, x: 15, y: -30 },
  { icon: GitCommit, delay: 11, x: -10, y: 40 },
  { icon: Box, delay: 12, x: 35, y: 10 },
  { icon: Activity, delay: 13, x: -35, y: -5 },
  { icon: Monitor, delay: 14, x: 5, y: -35 },
  { icon: HardDrive, delay: 15, x: -5, y: 45 },
  { icon: Network, delay: 16, x: 40, y: -15 },
  { icon: Shield, delay: 17, x: -40, y: 20 },
  { icon: Settings, delay: 18, x: 10, y: -40 },
  { icon: Wrench, delay: 19, x: -15, y: 50 },
  { icon: Cog, delay: 20, x: 25, y: 45 },
];

export function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-white/30 dark:text-white/30"
          style={{
            left: `${20 + element.x}%`,
            top: `${20 + element.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
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
