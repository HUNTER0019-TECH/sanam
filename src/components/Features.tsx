'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURES_DATA } from '@/config/discord';
import { sounds } from '@/lib/sound';
import {
  Users,
  Mic,
  Gamepad2,
  Music,
  CalendarCheck,
  Gift,
  Sparkles,
  Flame,
  ArrowUpRight
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-glass-card',
        { opacity: 0, y: 35, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Mic':
        return <Mic className="w-6 h-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      case 'Music':
        return <Music className="w-6 h-6" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6" />;
      case 'Gift':
        return <Gift className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Flame':
      default:
        return <Flame className="w-6 h-6" />;
    }
  };

  return (
    <section 
      id="features" 
      ref={containerRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#FF8C32] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
            What Makes SANAM Special
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase">
            CRAFTED FOR <span className="text-orange-gradient">PURE VIBES</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1A1] mt-3">
            Every feature is hand-tailored to foster friendships, late-night talks, and memorable moments.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((feat) => (
            <div
              key={feat.id}
              onMouseEnter={() => sounds.playChannelSwitch()}
              className="feature-glass-card liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 group hover:border-[#FF6A00]/40 hover:shadow-[0_12px_40px_rgba(255,106,0,0.18)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Top ambient orange gradient spot on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#FF6A00]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FF6A00] group-hover:scale-110 group-hover:bg-[#FF6A00]/15 group-hover:border-[#FF6A00]/40 transition-all duration-300 shadow-[0_0_15px_rgba(255,106,0,0.1)]">
                    {getIcon(feat.iconName)}
                  </div>

                  {feat.highlightTag && (
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.05] text-[#FF8C32] border border-white/[0.08] group-hover:border-[#FF6A00]/30 transition-colors">
                      {feat.highlightTag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF8C32] transition-colors flex items-center justify-between">
                  <span>{feat.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#A1A1A1] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {feat.stats && (
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A1A1A1]">
                  <span>Server Highlight</span>
                  <span className="font-mono font-bold text-white">
                    {feat.stats}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
