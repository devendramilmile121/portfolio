import React, { useEffect, useRef } from 'react';
import { SeasonalEffectSettings } from '@/hooks/useSeasonalEffects';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiEffectProps {
  settings: SeasonalEffectSettings;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

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
    const particleCount = settings.particleCount || 150;
    const [minSize, maxSize] = (settings.particleSize || '3px-6px')
      .split('-')
      .map((s) => parseInt(s));
    const colors = settings.colors || ['#FFD700', '#FF6347', '#00CED1', '#FF1493', '#32CD32'];
    const [minSpeed, maxSpeed] = (settings.fallSpeed || '3s-6s')
      .split('-')
      .map((s) => parseInt(s) / 1000);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = minSpeed + Math.random() * (maxSpeed - minSpeed);
        return {
          x: Math.random() * canvas.width,
          y: -10,
          vx: Math.cos(angle) * velocity * 2,
          vy: velocity,
          size: minSize + Math.random() * (maxSize - minSize),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
        };
      });
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99; // Air resistance
        particle.rotation += particle.rotationSpeed;
        particle.opacity -= 0.003;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        ctx.restore();

        return particle.y < canvas.height && particle.opacity > 0;
      });

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

export default ConfettiEffect;
