'use client';

import Link from 'next/link';
import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  Users, 
  Sparkles, 
  Headphones, 
  Trophy, 
  ShieldCheck, 
  Flame, 
  Zap, 
  ArrowRight,
  Radio,
  Heart
} from 'lucide-react';

export default function AboutServer() {
  const highlights = [
    {
      icon: Users,
      value: '10,760+',
      label: 'Verified Members',
      subtext: 'Thriving community across India & global',
      glow: 'from-[#FF6A00]/20 to-[#FF8C32]/5',
      borderColor: 'border-[#FF6A00]/30',
      iconColor: 'text-[#FF6A00]',
    },
    {
      icon: Zap,
      value: 'Level 3',
      label: 'Nitro Server Boost',
      subtext: '384kbps HD crystal voice & custom perks',
      glow: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-[#FF8C32]',
    },
    {
      icon: Radio,
      value: '1,140+',
      label: 'Daily Online Peak',
      subtext: 'Non-stop active chat & voice lounges',
      glow: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Trophy,
      value: '₹50,000+',
      label: 'Nitro & Cash Won',
      subtext: 'Regular gaming tournaments & giveaways',
      glow: 'from-purple-500/20 to-pink-500/5',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  const storyPillars = [
    {
      icon: Flame,
      title: 'Warm Vibes & Late-Night Talks',
      description:
        'SANAM isn\'t just another Discord server; it\'s a late-night sanctuary. Whether you\'re looking for chill conversation in #Bakchodi-vc, deep late-night heart-to-hearts, or casual daytime banter, there\'s always a welcoming group waiting for you.',
      badge: 'COMMUNITY SPIRIT',
      accent: 'border-[#FF6A00]/40',
    },
    {
      icon: Headphones,
      title: '24/7 Hi-Fi Stereo Music & Gaming',
      description:
        'Hop into our dedicated 24/7 music bots streaming high-fidelity Lo-Fi, Pop, EDM, and acoustic tracks. Team up with active squadmates for Valorant, BGMI, GTA, and Minecraft in crystal-clear 384kbps bitrate voice channels.',
      badge: 'AUDIO & GAMING',
      accent: 'border-[#FF8C32]/40',
    },
    {
      icon: Trophy,
      title: 'Weekly Giveaways & Event Battles',
      description:
        'From high-energy PFP Battle mega events and movie nights to massive Discord Nitro and cash giveaways hosted by server management, active members get rewarded constantly for being part of the family.',
      badge: 'REWARDS & EVENTS',
      accent: 'border-amber-500/40',
    },
    {
      icon: ShieldCheck,
      title: 'Active 24/7 Protection & Fair Moderation',
      description:
        'Our experienced staff team and anti-nuke automod systems maintain a respectful, welcoming space free from toxicity, harassment, and spam. Everyone from casual wanderers to verified creators is respected.',
      badge: 'SAFE & VERIFIED',
      accent: 'border-emerald-500/40',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#FF8C32] uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5 text-[#FF6A00] fill-[#FF6A00]" />
            <span>The Heart of Our Space</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-5 leading-tight">
            WHY 10,700+ MEMBERS <br />
            <span className="text-orange-gradient">CALL SANAM HOME</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#A1A1A1] leading-relaxed">
            Born as a close-knit circle of friends and creators, SANAM has evolved into one of the most vibrant, 
            supportive, and technologically advanced Discord spaces. Here is what makes our community truly special.
          </p>
        </div>

        {/* 4 Big Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {highlights.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`liquid-glass rounded-3xl p-6 border ${stat.borderColor} bg-gradient-to-b ${stat.glow} transition-all duration-300 hover:scale-[1.02] group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white/95 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-[#A1A1A1] leading-snug">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Pillars 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {storyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`liquid-glass rounded-3xl p-7 border border-white/10 ${pillar.accent} hover:border-[#FF6A00]/60 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF8C32] px-2.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25">
                      {pillar.badge}
                    </span>
                    <Icon className="w-5 h-5 text-[#FF6A00] group-hover:rotate-12 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm text-[#A1A1A1] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Call to Live Server Page */}
        <div className="liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#FF6A00]/10 via-transparent to-transparent">
          <div className="text-left max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#FF8C32] font-semibold block mb-1.5">
              Live Voice & Chat Telemetry
            </span>
            <h4 className="text-2xl font-bold text-white tracking-tight mb-2">
              Want to see who is speaking right now?
            </h4>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Explore our full real-time interactive Discord dashboard featuring live voice attendees, real messages, and public channels.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/live-server"
              onClick={() => sounds.playChannelSwitch()}
              className="btn-orange-glow w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold text-white tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,106,0,0.3)]"
            >
              <span>Explore Live Server</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <a
              href={DISCORD_CONFIG.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playJoinGlow()}
              className="btn-glass w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-semibold text-white/90 hover:text-white flex items-center justify-center gap-2"
            >
              <span>Join SANAM</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
