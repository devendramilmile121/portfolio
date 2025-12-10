import React, { useEffect, useRef } from 'react';
import { SeasonalEffectSettings } from '@/hooks/useSeasonalEffects';

interface SnowEffectProps {
  settings: SeasonalEffectSettings;
}

const SnowEffect: React.FC<SnowEffectProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to set canvas size
    const resizeCanvas = () => {
      // Set canvas internal resolution to full window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial size
    resizeCanvas();
    
    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);

    // Parse settings
    const particleCount = settings.particleCount || 100;
    const [minSize, maxSize] = (settings.particleSize || '2px-8px')
      .split('-')
      .map((s) => parseInt(s));
    const particleOpacity = settings.particleOpacity || 0.8;
    const [minSpeedSec, maxSpeedSec] = (settings.fallSpeed || '2s-8s')
      .split('-')
      .map((s) => parseInt(s));
    // Convert seconds to pixels per frame (assuming 60fps)
    // 2s to fall means canvas.height / 120 pixels per frame
    // 8s to fall means canvas.height / 480 pixels per frame
    const minSpeed = canvas.height / (minSpeedSec * 60);
    const maxSpeed = canvas.height / (maxSpeedSec * 60);
    const color = settings.color || '#ffffff';
    const blur = settings.blur || '0px';

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: minSize + Math.random() * (maxSize - minSize),
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      opacity: particleOpacity,
    }));

    // Animation loop
    const animate = () => {
      // Clear canvas completely (transparent)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += Math.sin(particle.y * 0.02) * 0.3; // Slight sideways drift

        // Reset particle if it falls off screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.filter = blur;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.filter = 'none';
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
        display: 'block',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default SnowEffect;
