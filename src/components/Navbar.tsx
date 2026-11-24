'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ExternalLink, 
  Radio
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playChannelSwitch();
  };

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Live Server', href: '/live-server' },
    { label: 'Shop', href: '/shop' },
    { label: 'Activity', href: '/activity' },
    { label: 'Features', href: '/features' },
    { label: 'Staff Team', href: '/team' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3.5">
      <div 
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0e0e0e]/85 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] shadow-orange-500/5' 
            : 'bg-white/[0.02] backdrop-blur-md border border-white/[0.06]'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          
          {/* Logo & Brand */}
          <Link 
            href="/" 
            onClick={() => sounds.playChannelSwitch()}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl p-0.5 bg-gradient-to-br from-[#FF6A00] to-[#FF8C32] shadow-[0_0_20px_rgba(255,106,0,0.4)] group-hover:shadow-[0_0_28px_rgba(255,106,0,0.7)] transition-all duration-300 shrink-0 overflow-hidden">
              <img
                src="/sanam-logo.gif"
                alt="SANAM Server Logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/sanam-logo.png';
                }}
                className="w-full h-full object-cover rounded-[10px]"
              />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8C32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6A00]"></span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wider text-white font-mono flex items-center gap-1.5">
                {DISCORD_CONFIG.serverName}
                <span className="text-[10px] font-sans font-semibold tracking-normal px-1.5 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF8C32] border border-[#FF6A00]/30">
                  COMMUNITY
                </span>
              </span>
              <span className="text-[11px] text-[#A1A1A1] -mt-0.5 tracking-tight hidden sm:block font-mono">
                discord.gg/sanam
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clickable separate pages) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => sounds.playChannelSwitch()}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-white bg-white/[0.08] border border-[#FF6A00]/40 shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                      : 'text-[#A1A1A1] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF6A00] rounded-full shadow-[0_0_8px_#FF6A00]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Live Pulse + Sound Toggle + Join CTA */}
          <div className="flex items-center gap-3">
            
            {/* Live Online Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{DISCORD_CONFIG.stats.onlineMembers.toLocaleString()} Online</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Interface Sounds' : 'Unmute Interface Sounds'}
              className="p-2 rounded-xl text-[#A1A1A1] hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all duration-200"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF8C32]" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>

            {/* Join Server CTA */}
            <a
              href={DISCORD_CONFIG.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playJoinGlow()}
              className="btn-orange-glow px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white tracking-wide flex items-center gap-2"
            >
              <span>Join Server</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#A1A1A1] hover:text-white bg-white/[0.04] border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-5 border-t border-white/[0.08] bg-[#0c0c0c]/95 rounded-b-2xl mt-1 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    sounds.playChannelSwitch();
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-white bg-[#FF6A00]/15 border border-[#FF6A00]/30 font-semibold'
                      : 'text-[#A1A1A1] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 flex items-center justify-between text-xs text-[#A1A1A1] px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {DISCORD_CONFIG.stats.onlineMembers.toLocaleString()} online
              </span>
              <span className="text-[#FF8C32]">ID: {DISCORD_CONFIG.guildId.slice(0, 8)}...</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
