'use client';

import { useState } from 'react';
import BackgroundGlow from '@/components/BackgroundGlow';
import Navbar from '@/components/Navbar';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';
import { DISCORD_CONFIG } from '@/config/discord';
import { sounds } from '@/lib/sound';
import { 
  ShoppingBag, 
  Sparkles, 
  Rocket, 
  Calendar, 
  Bot, 
  Check, 
  ArrowRight, 
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  ShieldCheck,
  Video,
  Radio,
  Mic,
  Smile,
  Zap,
  ExternalLink
} from 'lucide-react';

interface ToolScreenshot {
  url: string;
  title: string;
  description: string;
}

interface ShopItem {
  id: string;
  category: 'promo' | 'events' | 'bots';
  title: string;
  tagline: string;
  icon: any;
  platformBadge?: string;
  popular?: boolean;
  pricing: {
    inr: string;
    usd: string;
    period?: string;
  };
  features: string[];
  ctaLabel: string;
  ticketDepartment: string;
  screenshots?: ToolScreenshot[];
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'promo' | 'events' | 'bots'>('all');
  const [activePreviewTool, setActivePreviewTool] = useState<ShopItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const shopItems: ShopItem[] = [
    {
      id: 'pc-event-tool',
      category: 'events',
      title: 'PC Event Tool (Hunter VC Manager)',
      tagline: 'High-speed desktop Discord VC joiner & event suite. Multi-VC split distribution, camera video, screen share, and custom RPC.',
      icon: Monitor,
      platformBadge: '🖥️ Windows PC Edition',
      popular: true,
      pricing: {
        inr: '₹1,159',
        usd: '$14',
        period: 'Lifetime License',
      },
      features: [
        'Fast VC Joiner — Instant 1-click bulk voice channel joiner (supports 90+ tokens)',
        'Multi-VC Split Join — Split bots between 2 servers simultaneously (50/50 ratio)',
        'Full Media Controls — Camera ON (Video), Screen Share (Stream), Mic Mute & Deafen',
        'Custom Discord RPC — "Watching" status with custom server logo & live profile preview',
        'Token Vault & Status — Masked token manager, active checker, join/leave controls',
        'Auto Reconnect & Reset — Instant force-rejoin, system logs, and crash-resilient routing',
      ],
      ctaLabel: 'Buy PC Event Tool (₹1,159)',
      ticketDepartment: 'PC Event Tool',
      screenshots: [
        {
          url: '/shop/pc-tool-1.jpg',
          title: 'Dashboard & Bulk Voice Joiner',
          description: 'Control up to 90+ active tokens, bulk voice join target channels, or distribute across two servers with Multi-VC Split.',
        },
        {
          url: '/shop/pc-tool-2.jpg',
          title: 'Discord Rich Presence (RPC) Customizer',
          description: 'Set custom "Watching" or "Competing" status with your server icon, custom text, and clickable buttons with live Discord preview.',
        },
        {
          url: '/shop/pc-tool-3.jpg',
          title: 'Bulk Media Controls & Split Ratio',
          description: 'Toggle Camera ON, Screen Share, Mute, Deafen, and adjust 50% split ratio deployment with 1-click controls.',
        },
        {
          url: '/shop/pc-tool-4.jpg',
          title: 'Account Vault & Token Management',
          description: 'Manage, validate, filter, and assign Discord accounts with individual status indicators and connection triggers.',
        },
      ],
    },
    {
      id: 'phone-event-tool',
      category: 'events',
      title: 'Phone / Web Event Tool (Hunter Rapid Pro)',
      tagline: 'Cloud-powered Discord suite accessible directly on Phone (Android/iOS) and Web. Fast reactions, button clicker, and Multi-VC matrix.',
      icon: Smartphone,
      platformBadge: '📱 Phone / Cloud Web Suite',
      popular: true,
      pricing: {
        inr: '₹2,199',
        usd: '$27',
        period: 'Lifetime Cloud Access',
      },
      features: [
        'Fast Reactions & Button Clicker — Instant emoji reaction & component button clicker for giveaways',
        'Cloud VC Joiner — Single Channel & Multi-VC Matrix joiner without installing software on phone',
        'Complete Media Suite — Camera On (Video), Screen Share (Stream), Random Self-Mute, and Self-Deafen',
        'Cloud Token Vault — Secure masked token storage, bulk validator, token tester, and purge engine',
        'Proxy Routing & Bot Listener — Built-in proxy manager for zero rate limits and live console feed',
        'Universal Access — Runs on Chrome, Safari, Android, iPhone, Tablet & Desktop via secure Web UI',
      ],
      ctaLabel: 'Buy Phone Event Tool (₹2,199)',
      ticketDepartment: 'Phone Event Tool',
      screenshots: [
        {
          url: '/shop/phone-tool-1.jpg',
          title: 'Mobile Dashboard & Quick Launch',
          description: 'Overview of loaded tokens, voice status, proxy routing, and 1-click quick launch triggers for reactor and voice joiner.',
        },
        {
          url: '/shop/phone-tool-2.jpg',
          title: 'Emoji Reaction & Component Button Clicker',
          description: 'Paste Discord message link to trigger ultra-fast emoji spam or component button clicks across all accounts for giveaways.',
        },
        {
          url: '/shop/phone-tool-3.jpg',
          title: 'Discord Voice Manager & Media Matrix',
          description: 'Unified Single Channel & Multi-VC Matrix with Random Self-Mute, Self-Deafen, Auto Reconnect, Video Camera, and Screen Share.',
        },
        {
          url: '/shop/phone-tool-4.jpg',
          title: 'Cloud Token Vault Management',
          description: 'Securely store, add, check, and filter Discord account tokens with instant live status reporting in the cloud.',
        },
      ],
    },
    {
      id: 'server-promo',
      category: 'promo',
      title: 'Server Promotion & Organic Reach',
      tagline: 'Scale your Discord community with targeted organic reach across 10,700+ verified active SANAM members.',
      icon: Rocket,
      platformBadge: '🚀 Official Promotion Tiers',
      pricing: {
        inr: 'See Banner Plans',
        usd: 'Tier 1 to 4',
        period: 'Only INR / LTC Accepted',
      },
      features: [
        'Tier 1 (3 Days Promo) — 2x @everyone + 3x @here, Greet, Nitro Givy & Support server promo (₹1,300 / 14$ LTC)',
        'Tier 2 (36 Hours Promo) — @everyone + 2x extra @here, Greet, Nitro Givy & Support promo (₹999 / 11$ LTC)',
        'Tier 3 (1 Day Promo) — @everyone + extra @here / Greet, Nitro Givy & Support promo (₹650 / 7$ LTC)',
        'Tier 4 (1 Day Promo) — @everyone, Nitro Givy & Promo in our support server (₹400 / 4.5$ LTC)',
        '100% Real Members — Zero tokens/alts, maximum reach with active gamer & creator audience',
        'Payment Methods — Only INR (UPI) & LTC (Litecoin) accepted. Fast 2-hour slot deployment',
      ],
      ctaLabel: 'Book Promo Slot Now',
      ticketDepartment: 'Server Promotion',
      screenshots: [
        {
          url: '/shop/promo-banner.jpg',
          title: 'Official SANAM Server Promo Plans & Pricing Banner',
          description: 'Tier 1 (3 Days - ₹1,300 / 14$ LTC) | Tier 2 (36 Hours - ₹999 / 11$ LTC) | Tier 3 (1 Day - ₹650 / 7$ LTC) | Tier 4 (1 Day - ₹400 / 4.5$ LTC). Only INR & LTC accepted.',
        },
      ],
    },
    {
      id: 'develop-discord-bot',
      category: 'bots',
      title: 'Develop Custom Discord Bot',
      tagline: 'Custom Discord bots ranging from 24/7 crystal-clear Music Bots to High-Security Anti-Nuke systems with Web Dashboards.',
      icon: Bot,
      platformBadge: '⚡ Music to High-Security Dashboards',
      popular: true,
      pricing: {
        inr: '₹1,500 – ₹15,000',
        usd: '$18 – $180',
        period: 'Starts ₹1,500 up to ₹15,000',
      },
      features: [
        '24/7 Hi-Fi Music Bots — Crystal-clear stereo audio, Spotify/YouTube support & DJ filters (Starts ₹1,500)',
        'High-Security Anti-Nuke — Anti-raid defense, role permission guards, audit alerts & exploit preventions',
        'Custom Web Dashboard — Full-stack real-time online web control panel for server owners & staff',
        'Advanced Ticket & Support — Multi-department tickets, transcript logs, and auto-close systems',
        'Custom Economy & Leveling — Virtual coins, daily rewards, leaderboards, and casino/gambling games',
        'Full Source Code + Cloud Deploy — Complete codebase delivery, 24/7 cloud hosting setup & warranty',
      ],
      ctaLabel: 'Commission Bot (₹1,500 – ₹15k)',
      ticketDepartment: 'Bot Development',
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handleOrderClick = (department: string) => {
    sounds.playJoinGlow();
    window.open(`${DISCORD_CONFIG.inviteUrl}`, '_blank');
  };

  const openPreview = (tool: ShopItem) => {
    sounds.playChannelSwitch();
    setActivePreviewTool(tool);
    setActiveImageIndex(0);
  };

  const closePreview = () => {
    sounds.playChannelSwitch();
    setActivePreviewTool(null);
  };

  const nextImage = () => {
    if (!activePreviewTool?.screenshots) return;
    sounds.playChannelSwitch();
    setActiveImageIndex((prev) => (prev + 1) % activePreviewTool.screenshots!.length);
  };

  const prevImage = () => {
    if (!activePreviewTool?.screenshots) return;
    sounds.playChannelSwitch();
    setActiveImageIndex((prev) => 
      prev === 0 ? activePreviewTool.screenshots!.length - 1 : prev - 1
    );
  };

  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden pt-24">
      <BackgroundGlow />
      <Navbar />

      <section className="relative py-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#FF8C32] uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(255,106,0,0.15)]">
              <ShoppingBag className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>SANAM Official Store & Event Tools</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
              COMMUNITY STORE & <br />
              <span className="text-orange-gradient">EVENT TOOLS</span>
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1A1] leading-relaxed">
              Equip your community with professional PC and Phone Discord Event Tools (Fast VC Joiner, Fast Reactions, Camera Video, Screen Share), 
              verified server promotion to 10,700+ members, or custom bot development.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'events', label: '🏆 Event Tools (PC & Phone)' },
                { id: 'promo', label: '🚀 Server Promo' },
                { id: 'bots', label: '🤖 Develop Discord Bot' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playChannelSwitch();
                    setSelectedCategory(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === tab.id
                      ? 'bg-[#FF6A00] text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] scale-105'
                      : 'bg-white/[0.03] text-[#A1A1A1] hover:text-white border border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`liquid-glass rounded-3xl p-7 sm:p-8 border flex flex-col justify-between relative group transition-all duration-300 hover:border-[#FF6A00]/60 ${
                    item.popular
                      ? 'border-[#FF6A00]/50 shadow-[0_0_40px_rgba(255,106,0,0.2)] bg-gradient-to-b from-[#FF6A00]/10 via-transparent to-transparent'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF8C32] text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(255,106,0,0.5)] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-white" />
                      <span>Verified Event Tool</span>
                    </div>
                  )}

                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.15)] group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      
                      {item.platformBadge && (
                        <span className="text-[11px] font-mono font-bold tracking-wide text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                          {item.platformBadge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                      {item.title}
                    </h2>

                    <p className="text-xs text-[#A1A1A1] leading-relaxed mb-6">
                      {item.tagline}
                    </p>

                    {/* Price Header / Banner Plans */}
                    {item.id === 'server-promo' ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6A00]/10 to-transparent border border-[#FF6A00]/30 mb-6 flex items-center justify-between">
                        <div>
                          <span className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                            <span>Official Plans</span>
                            <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-[#FF6A00]/20 text-[#FF8C32]">
                              Tier 1 - 4
                            </span>
                          </span>
                          <span className="text-xs text-[#A1A1A1] mt-0.5 block">
                            Pricing defined in official banner below
                          </span>
                        </div>
                        <span className="text-xs text-[#FF8C32] font-semibold font-mono bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/10">
                          INR / LTC
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6 flex items-baseline justify-between">
                        <div>
                          <span className="text-3xl font-black text-white font-mono">{item.pricing.inr}</span>
                          <span className="text-xs text-[#A1A1A1] ml-1.5 font-mono">({item.pricing.usd})</span>
                        </div>
                        {item.pricing.period && (
                          <span className="text-xs text-[#FF8C32] font-semibold">{item.pricing.period}</span>
                        )}
                      </div>
                    )}

                    {/* Banner Preview for Server Promo */}
                    {item.id === 'server-promo' && (
                      <div 
                        onClick={() => openPreview(item)}
                        className="mb-6 rounded-2xl overflow-hidden border border-[#FF6A00]/30 shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:border-[#FF6A00] transition-all cursor-pointer group/banner relative"
                        title="Click to zoom pricing banner"
                      >
                        <img 
                          src="/shop/promo-banner.jpg" 
                          alt="Server Promo Tiers Banner" 
                          className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 flex items-center justify-center gap-2 transition-opacity text-white text-xs font-bold">
                          <Eye className="w-4 h-4 text-[#FF8C32]" />
                          <span>Click to Zoom Official Pricing Banner</span>
                        </div>
                      </div>
                    )}

                    {/* Feature Highlights Grid */}
                    <div className="space-y-3 mb-8 text-left">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider block mb-2">
                        Features & Capabilities:
                      </span>
                      {item.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#A1A1A1]">
                          <div className="w-4 h-4 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                    {/* Tool Preview Button */}
                    {item.screenshots && item.screenshots.length > 0 && (
                      <button
                        onClick={() => openPreview(item)}
                        className="btn-glass w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white/90 hover:text-white flex items-center justify-center gap-2 border border-[#FF6A00]/40 hover:border-[#FF6A00] hover:bg-[#FF6A00]/15 transition-all shadow-[0_0_15px_rgba(255,106,0,0.15)] cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#FF8C32]" />
                        <span>
                          {item.id === 'server-promo' 
                            ? 'View Official Pricing Banner (Full HD)' 
                            : `Tool Preview (${item.screenshots.length} Screenshots)`}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOrderClick(item.ticketDepartment)}
                      className="btn-orange-glow w-full py-3.5 rounded-2xl text-sm font-bold text-white tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,106,0,0.25)] group-hover:shadow-[0_0_35px_rgba(255,106,0,0.5)] transition-all cursor-pointer"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How It Works Banner */}
          <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 mb-16 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
              How Ordering Works
            </h3>
            <p className="text-sm text-[#A1A1A1] max-w-xl mx-auto mb-8">
              All tools, transactions, and commissions are handled securely inside the SANAM Discord server via our verified ticketing system.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#FF6A00]/15 text-[#FF6A00] font-mono font-bold flex items-center justify-center mb-3">
                  01
                </div>
                <div className="text-sm font-bold text-white mb-1">Open a Ticket</div>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Join SANAM Discord and navigate to #tickets. Select PC Tool, Phone Tool, Promo, or Bot Dev.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#FF8C32]/15 text-[#FF8C32] font-mono font-bold flex items-center justify-center mb-3">
                  02
                </div>
                <div className="text-sm font-bold text-white mb-1">Instant Setup & Keys</div>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Our management team delivers your activation license, download link, or web credentials instantly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center mb-3">
                  03
                </div>
                <div className="text-sm font-bold text-white mb-1">24/7 Support</div>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Complete setup guidance for VC joining, reaction clickers, camera & stream controls with ongoing updates.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TOOL PREVIEW MODAL */}
      {activePreviewTool && activePreviewTool.screenshots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-5xl rounded-3xl bg-[#0c0c0c] border border-[#FF6A00]/40 shadow-[0_0_60px_rgba(255,106,0,0.3)] overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00]">
                  <activePreviewTool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    {activePreviewTool.title}
                    <span className="text-xs font-mono font-semibold text-[#FF8C32] px-2 py-0.5 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25">
                      {activePreviewTool.pricing.inr}
                    </span>
                  </h3>
                  <span className="text-xs text-[#A1A1A1]">
                    Screenshot {activeImageIndex + 1} of {activePreviewTool.screenshots.length}: {activePreviewTool.screenshots[activeImageIndex].title}
                  </span>
                </div>
              </div>

              <button
                onClick={closePreview}
                className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-[#A1A1A1] hover:text-rose-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body with Nav */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-2 sm:p-4 min-h-[300px]">
              <img
                src={activePreviewTool.screenshots[activeImageIndex].url}
                alt={activePreviewTool.screenshots[activeImageIndex].title}
                className="max-h-[60vh] w-auto object-contain rounded-xl border border-white/10 shadow-2xl"
              />

              {/* Prev Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-6 w-11 h-11 rounded-full bg-black/70 hover:bg-[#FF6A00] text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer"
                title="Previous Screenshot"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-6 w-11 h-11 rounded-full bg-black/70 hover:bg-[#FF6A00] text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer"
                title="Next Screenshot"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Description & Thumbnails */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0e0e0e] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left max-w-xl">
                <h4 className="text-sm font-bold text-white mb-0.5">
                  {activePreviewTool.screenshots[activeImageIndex].title}
                </h4>
                <p className="text-xs text-[#A1A1A1]">
                  {activePreviewTool.screenshots[activeImageIndex].description}
                </p>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2">
                {activePreviewTool.screenshots.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playChannelSwitch();
                      setActiveImageIndex(idx);
                    }}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-[#FF6A00] scale-105 shadow-[0_0_12px_rgba(255,106,0,0.5)]' 
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Order Button inside Modal */}
              <button
                onClick={() => handleOrderClick(activePreviewTool.ticketDepartment)}
                className="btn-orange-glow px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Order Tool ({activePreviewTool.pricing.inr})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      <JoinSection />
      <Footer />
    </main>
  );
}
