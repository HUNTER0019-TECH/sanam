'use client';

import { STAFF_TEAM } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  ShieldCheck, 
  Crown, 
  Star, 
  Sparkles, 
  Copy, 
  Check, 
  Heart,
  Flame,
  Radio
} from 'lucide-react';
import { useState } from 'react';

export default function TeamSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTag = (id: string, tag: string) => {
    sounds.playChannelSwitch();
    navigator.clipboard.writeText(tag);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const owners = STAFF_TEAM.filter((m) => m.role === 'OWNER');
  const coOwners = STAFF_TEAM.filter((m) => m.role === 'CO_OWNER');
  const girlsOwners = STAFF_TEAM.filter((m) => m.role === 'GIRLS_OWNER');
  const staffMembers = STAFF_TEAM.filter((m) => m.role === 'STAFF');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]';
      case 'idle':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]';
      case 'dnd':
        return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]';
      default:
        return 'bg-zinc-500';
    }
  };

  return (
    <section id="team" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#FF8C32] uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(255,106,0,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Leadership & Moderation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase">
            MEET THE <span className="text-orange-gradient">SANAM TEAM</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1A1] mt-3">
            The dedicated owners, community leads, and staff keeping the SANAM universe safe, active, and vibrant 24/7.
          </p>
        </div>

        {/* 1. SERVER OWNERS TIER */}
        <div className="mb-20">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <Crown className="w-5 h-5 text-[#FF6A00] fill-[#FF6A00]" />
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Server Owners
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF8C32] border border-[#FF6A00]/30 font-bold">
              FOUNDERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {owners.map((owner) => (
              <div 
                key={owner.id}
                onMouseEnter={() => sounds.playChannelSwitch()}
                className="liquid-glass rounded-3xl p-7 border-2 border-[#FF6A00]/40 shadow-[0_15px_45px_rgba(255,106,0,0.15)] hover:border-[#FF6A00]/80 hover:shadow-[0_20px_60px_rgba(255,106,0,0.3)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Top ambient orange back-light glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-radial from-[#FF6A00]/25 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div>
                  {/* Top row: Avatar & Crown */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br from-[#FF6A00] via-[#FF8C32] to-white/20 shadow-[0_0_25px_rgba(255,106,0,0.35)]">
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=FF6A00&color=fff&bold=true`;
                          }}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      
                      {/* Status indicator */}
                      <span
                        className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#080808] ${getStatusColor(
                          owner.status
                        )}`}
                        title={`Status: ${owner.status}`}
                      />

                      {/* Crown Icon */}
                      <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF8C32] p-0.5 shadow-[0_0_12px_rgba(255,106,0,0.6)] flex items-center justify-center text-white">
                        <Crown className="w-4 h-4 fill-white" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#FF6A00]/15 text-[#FF8C32] border border-[#FF6A00]/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                      OWNER
                    </span>
                  </div>

                  {/* Owner Name */}
                  <h4 className="text-xl font-bold text-white mb-1 truncate group-hover:text-[#FF8C32] transition-colors">
                    {owner.name}
                  </h4>

                  {/* Copy Tag */}
                  <button
                    onClick={() => handleCopyTag(owner.id, owner.discordTag)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#FF6A00]/15 border border-white/[0.08] hover:border-[#FF6A00]/40 text-xs font-mono text-[#A1A1A1] hover:text-white transition-all mb-3.5 group/tag"
                  >
                    <span>@{owner.discordTag}</span>
                    {copiedId === owner.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover/tag:opacity-100" />
                    )}
                  </button>

                  <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
                    {owner.roleDescription}
                  </p>

                  {/* Custom status message */}
                  {owner.customStatus && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#FF8C32] mb-4">
                      <Sparkles className="w-3 h-3 text-[#FF6A00]" />
                      <span className="truncate">{owner.customStatus}</span>
                    </div>
                  )}
                </div>

                {/* Badges footer */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {owner.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/80"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SERVER CO-OWNERS TIER */}
        <div className="mb-20">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Server Co-Owners
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
              CO-OWNERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coOwners.map((coOwner) => (
              <div 
                key={coOwner.id}
                onMouseEnter={() => sounds.playChannelSwitch()}
                className="liquid-glass rounded-3xl p-7 border-2 border-amber-500/40 shadow-[0_15px_45px_rgba(245,158,11,0.15)] hover:border-amber-400/80 hover:shadow-[0_20px_60px_rgba(245,158,11,0.3)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Top ambient amber back-light glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-radial from-amber-500/25 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div>
                  {/* Top row: Avatar & Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-[#FF8C32] to-white/20 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                        <img
                          src={coOwner.avatar}
                          alt={coOwner.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coOwner.name)}&background=FFA500&color=fff&bold=true`;
                          }}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      
                      {/* Status indicator */}
                      <span
                        className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#080808] ${getStatusColor(
                          coOwner.status
                        )}`}
                        title={`Status: ${coOwner.status}`}
                      />

                      {/* Co-Owner Badge */}
                      <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-[#FF8C32] p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center text-white">
                        <Star className="w-4 h-4 fill-white" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                      CO-OWNER
                    </span>
                  </div>

                  {/* Co-Owner Name */}
                  <h4 className="text-xl font-bold text-white mb-1 truncate group-hover:text-amber-400 transition-colors">
                    {coOwner.name}
                  </h4>

                  {/* Copy Tag */}
                  <button
                    onClick={() => handleCopyTag(coOwner.id, coOwner.discordTag)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/40 text-xs font-mono text-[#A1A1A1] hover:text-white transition-all mb-3.5 group/tag"
                  >
                    <span>@{coOwner.discordTag}</span>
                    {copiedId === coOwner.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover/tag:opacity-100" />
                    )}
                  </button>

                  <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
                    {coOwner.roleDescription}
                  </p>

                  {/* Custom status message */}
                  {coOwner.customStatus && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-amber-400 mb-4">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="truncate">{coOwner.customStatus}</span>
                    </div>
                  )}
                </div>

                {/* Badges footer */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {coOwner.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/80"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. GIRLS OWNERS TIER */}
        <div className="mb-20">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Girls Owners
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 font-bold">
              LEADERSHIP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {girlsOwners.map((girlOwner) => (
              <div 
                key={girlOwner.id}
                onMouseEnter={() => sounds.playChannelSwitch()}
                className="liquid-glass rounded-3xl p-7 border-2 border-pink-500/30 shadow-[0_15px_45px_rgba(244,114,182,0.12)] hover:border-pink-500/70 hover:shadow-[0_20px_60px_rgba(244,114,182,0.25)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-radial from-pink-500/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br from-pink-500 via-rose-400 to-white/20 shadow-[0_0_25px_rgba(244,114,182,0.35)]">
                        <img
                          src={girlOwner.avatar}
                          alt={girlOwner.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(girlOwner.name)}&background=FF4D8D&color=fff&bold=true`;
                          }}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      
                      <span
                        className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#080808] ${getStatusColor(
                          girlOwner.status
                        )}`}
                        title={`Status: ${girlOwner.status}`}
                      />

                      <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 p-0.5 shadow-[0_0_12px_rgba(244,114,182,0.6)] flex items-center justify-center text-white">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                      GIRLS OWNER
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1 truncate group-hover:text-pink-400 transition-colors">
                    {girlOwner.name}
                  </h4>

                  <button
                    onClick={() => handleCopyTag(girlOwner.id, girlOwner.discordTag)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-pink-500/15 border border-white/[0.08] hover:border-pink-500/40 text-xs font-mono text-[#A1A1A1] hover:text-white transition-all mb-3.5 group/tag"
                  >
                    <span>@{girlOwner.discordTag}</span>
                    {copiedId === girlOwner.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover/tag:opacity-100" />
                    )}
                  </button>

                  <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
                    {girlOwner.roleDescription}
                  </p>

                  {girlOwner.customStatus && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-pink-400 mb-4">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span className="truncate">{girlOwner.customStatus}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {girlOwner.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/80"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STAFF TEAM TIER */}
        <div>
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <ShieldCheck className="w-5 h-5 text-[#FF8C32]" />
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Staff Team
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A1A1A1] border border-white/10 font-bold">
              MODERATORS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((staff) => (
              <div 
                key={staff.id}
                onMouseEnter={() => sounds.playChannelSwitch()}
                className="liquid-glass rounded-3xl p-6 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-[#FF6A00]/50 hover:shadow-[0_20px_50px_rgba(255,106,0,0.18)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/15 group-hover:border-[#FF6A00] transition-colors">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=FF8C32&color=fff&bold=true`;
                          }}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      
                      <span
                        className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#080808] ${getStatusColor(
                          staff.status
                        )}`}
                        title={`Status: ${staff.status}`}
                      />
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-[#FF8C32] border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase">
                      STAFF
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-0.5 truncate group-hover:text-[#FF8C32] transition-colors">
                    {staff.name}
                  </h4>

                  <button
                    onClick={() => handleCopyTag(staff.id, staff.discordTag)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-[#FF6A00]/15 border border-white/[0.06] hover:border-[#FF6A00]/30 text-xs font-mono text-[#A1A1A1] hover:text-white transition-all mb-3 group/tag"
                  >
                    <span>@{staff.discordTag}</span>
                    {copiedId === staff.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover/tag:opacity-100" />
                    )}
                  </button>

                  <p className="text-xs text-[#A1A1A1] leading-relaxed mb-3">
                    {staff.roleDescription}
                  </p>

                  {staff.customStatus && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-[#FF8C32] mb-3">
                      <Sparkles className="w-2.5 h-2.5 text-[#FF6A00]" />
                      <span className="truncate">{staff.customStatus}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1">
                  {staff.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-medium px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#A1A1A1]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
