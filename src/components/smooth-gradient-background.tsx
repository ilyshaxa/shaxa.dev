'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

const colors = [
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta/Pink
  '#00ffff', // Cyan
  '#ff8000', // Orange
  '#8000ff', // Purple
  '#ff0080', // Hot Pink
  '#00ff80', // Spring Green
  '#ff4000', // Red-Orange
  '#4000ff', // Blue-Purple
  '#ff6b6b', // Coral
  '#4ecdc4', // Turquoise
  '#45b7d1', // Sky Blue
  '#96ceb4', // Mint Green
  '#feca57', // Golden Yellow
  '#ff9ff3', // Pink
  '#54a0ff', // Light Blue
  '#5f27cd', // Purple
];

export function SmoothGradientBackground() {
  const { actualTheme } = useTheme();
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [nextColor, setNextColor] = useState(colors[1]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let colorIndex = 0;
    let nextColorIndex = 1;
    let animationProgress = 0;

    const animate = () => {
      animationProgress += 0.005; // Slow, smooth transition
      
      if (animationProgress >= 1) {
        // Transition complete, move to next color
        animationProgress = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % colors.length;
        setCurrentColor(colors[colorIndex]);
        setNextColor(colors[nextColorIndex]);
      }
      
      setProgress(animationProgress);
      requestAnimationFrame(animate);
    };

    // Initialize colors
    setCurrentColor(colors[0]);
    setNextColor(colors[1]);
    
    animate();
  }, []);

  // Interpolate between current and next color
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentGradientColor = interpolateColor(currentColor, nextColor, progress);

  return (
    <div className="fixed inset-0 z-0">
      {/* Theme-aware base background */}
      <div className={`absolute inset-0 ${actualTheme === 'dark' ? 'bg-black' : 'bg-white'}`} />
      
      {/* Smooth gradient overlay */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(135deg, ${currentGradientColor}${actualTheme === 'dark' ? '20' : '10'}, ${currentGradientColor}${actualTheme === 'dark' ? '10' : '05'}, ${currentGradientColor}${actualTheme === 'dark' ? '05' : '02'})`,
          filter: 'blur(80px)',
        }}
      />
      
      {/* Subtle noise texture for depth */}
      <div className={`absolute inset-0 bg-[url('/noise.svg')] ${actualTheme === 'dark' ? 'opacity-5' : 'opacity-2'} pointer-events-none`} />
    </div>
  );
}
