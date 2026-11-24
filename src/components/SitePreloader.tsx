'use client';

import { useState, useEffect } from 'react';
import { Flame, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { sounds } from '@/lib/sound';

export default function SitePreloader() {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing SANAM Sanctuary...');
  const [isDone, setIsDone] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  const statusMessages = [
    { threshold: 0, text: 'Waking up SANAM Sanctuary...' },
    { threshold: 22, text: 'Establishing secure Gateway handshake...' },
    { threshold: 48, text: 'Synchronizing live voice lounges & members...' },
    { threshold: 74, text: 'Tuning 384kbps lossless audio & perks...' },
    { threshold: 92, text: 'Welcome to SANAM™ • Ready!' },
  ];

  useEffect(() => {
    // Check if user already saw the intro in this session
    try {
      const alreadySeen = sessionStorage.getItem('sanam_preloader_seen');
      if (alreadySeen) {
        // Quick subtle 250ms fade for returning visitors so they don't get blocked
        setProgress(100);
        setStatusText('Welcome Back to SANAM™');
        const fastTimer = setTimeout(() => {
          setIsDone(true);
          setTimeout(() => setShouldRender(false), 500);
        }, 300);
        return () => clearTimeout(fastTimer);
      }
    } catch {}

    // First visit: Smooth animated sequence (~1.8 seconds)
    const startTime = Date.now();
    const duration = 1800; // 1.8s for ultra-smooth & fast perception

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease-out curve calculation
      const t = elapsed / duration;
      const easeProgress = Math.min(100, Math.floor((1 - Math.pow(1 - t, 2.5)) * 100));

      setProgress(easeProgress);

      // Update status text
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (easeProgress >= statusMessages[i].threshold) {
          setStatusText(statusMessages[i].text);
          break;
        }
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setStatusText('Welcome to SANAM™');

        try {
          sessionStorage.setItem('sanam_preloader_seen', 'true');
        } catch {}

        // Small pause at 100% then trigger silky fade-out
        setTimeout(() => {
          setIsDone(true);
          try {
            sounds.playVoiceJoin();
          } catch {}
          // Unmount after CSS fade-out finishes
          setTimeout(() => {
            setShouldRender(false);
          }, 700);
        }, 250);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    try {
      sessionStorage.setItem('sanam_preloader_seen', 'true');
      sounds.playChannelSwitch();
    } catch {}
    setProgress(100);
    setIsDone(true);
    setTimeout(() => setShouldRender(false), 600);
  };

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={isDone}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080808] transition-all duration-700 ease-out select-none ${
        isDone
          ? 'opacity-0 scale-105 pointer-events-none blur-sm'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#FF6A00]/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#FF8C32]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Cyber Background Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Center Content Box */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        
        {/* Animated Rotating Radar Rings with Server Logo in Center */}
        <div className="relative w-36 h-36 mb-7 flex items-center justify-center">
          
          {/* Outer Rotating Dash Ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#preloader-gradient)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              className="opacity-70"
            />
            <defs>
              <linearGradient id="preloader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6A00" />
                <stop offset="50%" stopColor="#FF8C32" />
                <stop offset="100%" stopColor="#FFA04D" />
              </linearGradient>
            </defs>
          </svg>

          {/* Counter-rotating Inner Ring */}
          <svg className="absolute inset-2 w-[120px] h-[120px] animate-[spin_12s_linear_infinite_reverse]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#FF6A00"
              strokeWidth="1"
              strokeDasharray="18 12"
              className="opacity-40"
            />
          </svg>

          {/* Pulsing Speaking Halo Ring */}
          <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-[#FF6A00]/25 to-[#FF8C32]/10 blur-md animate-pulse" />

          {/* Logo Glass Container */}
          <div className="relative w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-[#FF6A00] to-[#FF8C32] shadow-[0_0_35px_rgba(255,106,0,0.45)] flex items-center justify-center overflow-hidden border border-white/20">
            <img
              src="/sanam-logo.gif"
              alt="SANAM™"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/sanam-logo.png';
              }}
              className="w-full h-full object-cover rounded-[20px]"
            />

            {/* Live Online Dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080808] flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.8)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
          </div>
        </div>

        {/* Brand Name & Verified Pill */}
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-[#FF6A00] animate-bounce" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-white to-[#FF8C32] bg-clip-text text-transparent">
            SANAM™
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-[#A1A1A1] font-medium tracking-wide mb-6">
          A Place Where Vibes Become Memories
        </p>

        {/* High-tech Progress Bar */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#A1A1A1] flex items-center gap-1.5 truncate max-w-[210px] text-[11px]">
              <Sparkles className="w-3 h-3 text-[#FF6A00] shrink-0 animate-spin" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="text-white font-bold text-xs bg-[#FF6A00]/20 px-2 py-0.5 rounded-md border border-[#FF6A00]/30 text-[#FF8C32]">
              {progress}%
            </span>
          </div>

          {/* Progress Track */}
          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/10 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8C32] to-[#FFA04D] shadow-[0_0_15px_rgba(255,106,0,0.8)] transition-all duration-150 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light bar across progress */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* Discrete Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="mt-8 text-[11px] text-[#A1A1A1] hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center gap-1 group font-mono"
        >
          <span>Enter SANAM Now</span>
          <ChevronRight className="w-3 h-3 text-[#FF6A00] group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
}
