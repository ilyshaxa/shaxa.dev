'use client';

import { useEffect, useState } from 'react';

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
];

export function DynamicGradientBackground() {
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const generateGradient = () => {
      // Pick one random color
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Create a gradient with the same color but different opacities
      const angle = Math.floor(Math.random() * 360);
      const gradientString = `linear-gradient(${angle}deg, ${selectedColor}40, ${selectedColor}20, ${selectedColor}10)`;
      
      return gradientString;
    };

    // Generate initial gradient
    setGradient(generateGradient());

    // Change gradient every 8 seconds
    const interval = setInterval(() => {
      setGradient(generateGradient());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Dynamic gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-3000 ease-in-out"
        style={{ background: gradient }}
      />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49Im5vaXNlIiB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNCIvPgo8L3N2Zz4K')] opacity-30" />
    </div>
  );
}
