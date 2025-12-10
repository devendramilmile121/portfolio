import React, { useEffect, useRef } from 'react';
import { SeasonalEffectSettings } from '@/hooks/useSeasonalEffects';

interface CrackerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface CrackerExplosion {
  x: number;
  y: number;
  particles: CrackerParticle[];
}

interface CrackersEffectProps {
  settings: SeasonalEffectSettings;
}

const CrackersEffect: React.FC<CrackersEffectProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const explosionsRef = useRef<CrackerExplosion[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const lastCrackerTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Parse settings
    const crackerCount = settings.crackerCount || 50;
    const [minSize, maxSize] = (settings.crackerSize || '3px-10px')
      .split('-')
      .map((s) => parseInt(s));
    const colors = (settings.color || '#FFD700,#FF6347,#00CED1,#FF1493').split(',');
    const [minDuration, maxDuration] = (settings.duration || '1s-3s')
      .split('-')
      .map((s) => parseInt(s) * 1000); // Convert to ms
    const particlesPerCracker = settings.particlesPerCracker || 20;

    // Create a cracker explosion
    const createCrackerExplosion = (x: number, y: number) => {
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      const maxLife = Math.ceil((duration / 1000) * 60); // Convert to frames (60fps)
      
      const particles: CrackerParticle[] = Array.from(
        { length: particlesPerCracker },
        () => {
          const angle = Math.random() * Math.PI * 2;
          const velocity = 2 + Math.random() * 8;
          return {
            x,
            y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: minSize + Math.random() * (maxSize - minSize),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            life: 0,
            maxLife,
          };
        }
      );

      explosionsRef.current.push({ x, y, particles });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Periodically create new crackers
      const now = Date.now();
      if (now - lastCrackerTimeRef.current > 300) {
        for (let i = 0; i < 3; i++) {
          createCrackerExplosion(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.6
          );
        }
        lastCrackerTimeRef.current = now;
      }

      // Update and draw explosions
      explosionsRef.current = explosionsRef.current.filter((explosion) => {
        explosion.particles = explosion.particles.filter((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.2; // Gravity
          particle.life++;
          particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);

          // Draw particle
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();

          return particle.life < particle.maxLife;
        });

        return explosion.particles.length > 0;
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [settings]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default CrackersEffect;
