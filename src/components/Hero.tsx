'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  Users, 
  Radio, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Zap
} from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline for Hero typography
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.12 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleJoinClick = () => {
    sounds.playJoinGlow();
    // Premium orange and amber confetti burst
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6A00', '#FF8C32', '#FFA54F', '#FFFFFF', '#333333'],
    });
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      {/* Decorative center radial glow behind text */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] rounded-full pointer-events-none opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at center, #FF6A00 0%, #FF8C32 30%, transparent 75%)',
        }}
      />

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Server Identity Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(255,106,0,0.15)] group hover:border-[#FF6A00]/40 transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
          </span>
          <span className="text-xs uppercase tracking-widest text-[#A1A1A1] font-semibold group-hover:text-white transition-colors">
            Discord Partner Level • Server V2.4
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-xs text-[#FF8C32] font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#FF8C32]" /> Level 3 Nitro
          </span>
        </div>

        {/* Main Headline */}
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-sans mb-6 leading-[1.08]"
        >
          WELCOME TO{' '}
          <span className="relative inline-block text-orange-gradient">
            SANAM
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent opacity-80" />
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-[#A1A1A1] max-w-2xl mx-auto font-normal leading-relaxed mb-10 tracking-tight"
        >
          {DISCORD_CONFIG.subtitle}
        </p>

        {/* CTA Buttons */}
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <a
            href={DISCORD_CONFIG.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoinClick}
            className="btn-orange-glow w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white tracking-wide flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,106,0,0.35)]"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>JOIN SANAM SERVER</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/live-server"
            onClick={() => sounds.playChannelSwitch()}
            className="btn-glass w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-semibold text-white/90 hover:text-white flex items-center justify-center gap-2"
          >
            <span>Explore Community</span>
            <Sparkles className="w-4 h-4 text-[#FF8C32]" />
          </Link>
        </div>

        {/* Live Server Statistics Bar (Liquid Glass) */}
        <div 
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full max-w-3xl"
        >
          {/* Real Total Members */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-white/10 group">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FF8C32] group-hover:scale-105 group-hover:border-[#FF6A00]/40 transition-all duration-300 shadow-[0_0_15px_rgba(255,106,0,0.1)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                10,759+
              </div>
              <div className="text-xs uppercase font-medium tracking-wider text-[#A1A1A1] mt-0.5">
                Total Members
              </div>
            </div>
          </div>

          {/* Real Online Members */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-white/10 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all duration-300">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-center gap-2">
                1,109+
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-xs uppercase font-medium tracking-wider text-[#A1A1A1] mt-0.5">
                Online Members
              </div>
            </div>
          </div>

          {/* Level 3 Boost */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-white/10 group">
            <div className="w-12 h-12 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 flex items-center justify-center text-[#FF6A00] group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,106,0,0.15)]">
              <Zap className="w-6 h-6 fill-[#FF6A00]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF8C32] font-mono tracking-tight">
                Level 3
              </div>
              <div className="text-xs uppercase font-medium tracking-wider text-[#A1A1A1] mt-0.5">
                Discord Nitro Boosted
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
