'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BackgroundGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const orb3Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. GSAP subtle organic breathing for liquid orange ambient lights
    if (orb1Ref.current && orb2Ref.current && orb3Ref.current) {
      gsap.to(orb1Ref.current, {
        x: '+=60',
        y: '+=40',
        scale: 1.15,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orb2Ref.current, {
        x: '-=50',
        y: '-=35',
        scale: 0.9,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });

      gsap.to(orb3Ref.current, {
        x: '+=30',
        y: '-=50',
        scale: 1.1,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }

    // 2. Interactive Canvas subtle orange particle dust
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      maxAlpha: number;
      alphaSpeed: number;
    }

    const particleCount = Math.min(width > 768 ? 28 : 14, 35);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.8,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.08,
        alpha: Math.random() * 0.4 + 0.1,
        maxAlpha: Math.random() * 0.45 + 0.2,
        alphaSpeed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;

        if (p.alpha > p.maxAlpha || p.alpha < 0.05) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Loop boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle (zero shadowBlur for silky 120fps performance)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 120, 20, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 contain-strict">
      {/* Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Subtle Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 106, 0, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Orb 1: Upper right glow - hardware accelerated */}
      <div
        ref={orb1Ref}
        className="absolute -top-32 right-[10%] w-[520px] h-[520px] rounded-full blur-[120px] opacity-25 will-change-transform"
        style={{
          background: 'radial-gradient(circle, #FF6A00 0%, #FF8C32 40%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Orb 2: Center left subtle glow - hardware accelerated */}
      <div
        ref={orb2Ref}
        className="absolute top-[40%] -left-36 w-[560px] h-[560px] rounded-full blur-[130px] opacity-20 will-change-transform"
        style={{
          background: 'radial-gradient(circle, #FF7B1A 0%, rgba(255, 106, 0, 0.4) 45%, transparent 75%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Orb 3: Bottom right ambient glow - hardware accelerated */}
      <div
        ref={orb3Ref}
        className="absolute -bottom-32 right-[20%] w-[480px] h-[480px] rounded-full blur-[120px] opacity-15 will-change-transform"
        style={{
          background: 'radial-gradient(circle, #FF8C32 0%, #FF6A00 35%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Top subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-transparent to-[#080808]/80 pointer-events-none" />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
