'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const lightThemeColors = [
  'rgba(29, 78, 216, 0.6)',  // darker blue with more contrast
  'rgba(107, 33, 168, 0.6)', // darker purple with more contrast
  'rgba(190, 24, 93, 0.6)',  // darker pink with more contrast
  'rgba(21, 128, 61, 0.6)',  // darker green with more contrast
  'rgba(202, 138, 4, 0.6)',  // darker yellow with more contrast
];

const darkThemeColors = [
  'rgba(59, 130, 246, 0.5)', // blue
  'rgba(147, 51, 234, 0.5)', // purple
  'rgba(236, 72, 153, 0.5)', // pink
  'rgba(34, 197, 94, 0.5)',  // green
  'rgba(251, 191, 36, 0.5)', // yellow
];

const techIcons = ['</>', '{}', '[]', '()', 'grep', '&&', '||', '=='];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const { actualTheme } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const colors = actualTheme === 'dark' ? darkThemeColors : lightThemeColors;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const initParticles = () => {
      // Reduced from 50 to 25 particles
      const particleCount = window.innerWidth < 768 ? 15 : 25;
      particlesRef.current = Array.from({ length: particleCount }, createParticle);
    };

    // Target 30 FPS for smoother performance
    const FPS = 30;
    const frameDelay = 1000 / FPS;

    const animate = (currentTime: number) => {
      // Throttle to target FPS
      if (currentTime - lastFrameTimeRef.current < frameDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTimeRef.current = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.font = `${particle.size * 4}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(
          techIcons[index % techIcons.length],
          particle.x,
          particle.y
        );
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [actualTheme, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
