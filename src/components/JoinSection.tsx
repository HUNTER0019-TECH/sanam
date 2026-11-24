'use client';

import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { Flame, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function JoinSection() {
  const handleJoinClick = () => {
    sounds.playJoinGlow();
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#FF6A00', '#FF8C32', '#FFA54F', '#FFFFFF'],
    });
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="liquid-glass rounded-3xl p-8 sm:p-16 border-2 border-white/10 relative overflow-hidden text-center shadow-[0_20px_80px_rgba(0,0,0,0.85)]">
          
          {/* Intense center liquid orange back-glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[140px] opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #FF6A00 0%, #FF8C32 40%, transparent 75%)',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#FF8C32] uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              Your Invitation Is Ready
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-sans uppercase mb-6 leading-tight">
              FIND YOUR PEOPLE.{' '}
              <span className="text-orange-gradient">FIND YOUR VIBE.</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#A1A1A1] leading-relaxed mb-10 max-w-2xl">
              {DISCORD_CONFIG.description}
            </p>

            {/* CTA Button */}
            <a
              href={DISCORD_CONFIG.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoinClick}
              className="btn-orange-glow px-9 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,106,0,0.45)] hover:shadow-[0_0_60px_rgba(255,106,0,0.7)] group"
            >
              <Flame className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>JOIN SANAM</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Trust checkmarks */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A1A1A1]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Instant Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No Paywalls
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Respectful Community
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF8C32]" />
                14,800+ Members
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
