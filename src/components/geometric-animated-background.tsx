'use client';

import { useEffect, useRef } from 'react';

export function GeometricAnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw animated geometric patterns
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 2;

      // Animated circles
      for (let i = 0; i < 8; i++) {
        const radius = (maxRadius / 8) * (i + 1);
        const angle = time + i * 0.5;
        const x = centerX + Math.cos(angle) * 50;
        const y = centerY + Math.sin(angle) * 30;
        
        ctx.save();
        ctx.globalAlpha = 0.1 - (i * 0.01);
        ctx.strokeStyle = `hsl(${(time * 50 + i * 45) % 360}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Animated hexagons
      for (let i = 0; i < 6; i++) {
        const size = 20 + i * 15;
        const x = centerX + Math.cos(time + i * 1.2) * 100;
        const y = centerY + Math.sin(time + i * 1.2) * 80;
        
        ctx.save();
        ctx.globalAlpha = 0.15 - (i * 0.02);
        ctx.strokeStyle = `hsl(${(time * 30 + i * 60) % 360}, 80%, 50%)`;
        ctx.lineWidth = 1.5;
        ctx.translate(x, y);
        ctx.rotate(time + i * 0.3);
        
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Animated triangles
      for (let i = 0; i < 4; i++) {
        const size = 30 + i * 20;
        const x = centerX + Math.cos(time * 0.7 + i * 1.5) * 150;
        const y = centerY + Math.sin(time * 0.7 + i * 1.5) * 100;
        
        ctx.save();
        ctx.globalAlpha = 0.2 - (i * 0.04);
        ctx.strokeStyle = `hsl(${(time * 40 + i * 90) % 360}, 60%, 70%)`;
        ctx.lineWidth = 1;
        ctx.translate(x, y);
        ctx.rotate(-time + i * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Floating dots
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.5 + i * 0.3) + 1) * canvas.width / 2;
        const y = (Math.cos(time * 0.3 + i * 0.4) + 1) * canvas.height / 2;
        const size = 2 + Math.sin(time + i) * 1;
        
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(time * 2 + i) * 0.2;
        ctx.fillStyle = `hsl(${(time * 20 + i * 18) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Animated geometric canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
    </div>
  );
}
