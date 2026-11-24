'use client';

import Link from 'next/link';
import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  Flame, 
  ExternalLink, 
  ShieldCheck, 
  Radio, 
  Heart,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#060606]/90 backdrop-blur-2xl z-10">
      
      {/* Top ambient orange strip */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF6A00]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF8C32] p-0.5 shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0 overflow-hidden">
                <img 
                  src="/sanam-logo.gif" 
                  alt="SANAM Logo" 
                  className="w-full h-full object-cover rounded-[10px]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/sanam-logo.png';
                  }}
                />
              </div>
              <span className="text-xl font-bold tracking-wider text-white font-mono">
                {DISCORD_CONFIG.serverName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1A1] max-w-sm leading-relaxed">
              {DISCORD_CONFIG.subtitle} An ultra-premium Discord haven built for gaming lobbies, late-night voice hangs, and authentic digital connections.
            </p>

            {/* Server Operational Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#A1A1A1]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Discord Gateway v10 • Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1A1]">
              <li>
                <Link href="/" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/live-server" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Live Server
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Store & Services
                </Link>
              </li>
              <li>
                <Link href="/activity" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Activity
                </Link>
              </li>
              <li>
                <Link href="/features" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/team" onClick={() => sounds.playChannelSwitch()} className="hover:text-white transition-colors">
                  Staff Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels Directory */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Channels
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1A1]">
              <li>#welcome</li>
              <li>#rules</li>
              <li>#announcements</li>
              <li>#general</li>
              <li>#media & #memes</li>
              <li>Voice Lounges (384kbps)</li>
            </ul>
          </div>

          {/* Social Links & Join */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Connect & Socials
            </h4>
            
            <div className="flex items-center gap-2">
              {/* Discord */}
              <a
                href={DISCORD_CONFIG.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playJoinGlow()}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-[#FF6A00]/20 border border-white/10 hover:border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00] transition-all"
                title="Discord"
              >
                <Flame className="w-4 h-4" />
              </a>

              {/* Twitter / X SVG */}
              <a
                href={DISCORD_CONFIG.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-all"
                title="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* YouTube SVG */}
              <a
                href={DISCORD_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-all"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram SVG */}
              <a
                href={DISCORD_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-all"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* GitHub SVG */}
              <a
                href={DISCORD_CONFIG.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-all"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>

            <a
              href={DISCORD_CONFIG.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playJoinGlow()}
              className="btn-orange-glow w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <span>Instant Discord Invite</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A1A1A1] gap-3">
          <div>
            © 2026 <span className="text-white font-medium">SANAM</span> Discord Community. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#A1A1A1]">
            <span>Official Community Sanctuary • discord.gg/sanam</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
