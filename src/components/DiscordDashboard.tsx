'use client';

import { useState, useEffect, useRef } from 'react';
import { DISCORD_CONFIG, CHANNELS_DATA } from '@/config/discord';
import { ChannelItem, ChannelMessage, VoiceParticipant } from '@/types/discord';
import { sounds } from '@/lib/sound';
import DiscordMessageContent from '@/components/DiscordMessageContent';
import {
  Hash,
  Volume2,
  Megaphone,
  Mic,
  MicOff,
  Headphones,
  Smile,
  Send,
  PlusCircle,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Flame,
  VolumeX,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface DiscordApiChannel {
  id: string;
  name: string;
  position: number;
  category: string;
  type: 'text' | 'voice' | 'announcement';
  participants: VoiceParticipant[];
  participantCount: number;
}

interface DiscordApiResponse {
  source?: string;
  name?: string;
  icon_url?: string;
  total_count?: number;
  presence_count?: number;
  channels?: DiscordApiChannel[];
  is_live_widget?: boolean;
}

export default function DiscordDashboard() {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('1462431029691416632'); // Default to ! π , txt . <3
  const [micMuted, setMicMuted] = useState<boolean>(false);
  const [deafened, setDeafened] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [apiData, setApiData] = useState<DiscordApiResponse | null>(null);
  const [channels, setChannels] = useState<ChannelItem[]>(CHANNELS_DATA);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch server channels & guild details (with periodic sync for voice & counts)
  const fetchServerData = (preserveSelection = true) => {
    fetch('/api/discord')
      .then((res) => res.json())
      .then((data: DiscordApiResponse) => {
        setApiData(data);
        if (data.channels && data.channels.length > 0) {
          const realChannels: ChannelItem[] = data.channels.map((ch) => {
            const seen = new Set<string>();
            const uniqueParticipants: VoiceParticipant[] = [];
            (ch.participants || []).forEach((p) => {
              const normName = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]/gi, '').trim() : '';
              if (!seen.has(p.id) && (!normName || !seen.has(normName))) {
                if (p.id) seen.add(p.id);
                if (normName) seen.add(normName);
                uniqueParticipants.push(p);
              }
            });

            return {
              id: ch.id,
              name: ch.name,
              category: ch.category,
              type: ch.type,
              position: ch.position,
              description:
                ch.type === 'voice'
                  ? `Live Discord voice room with ${uniqueParticipants.length} active attendee(s).`
                  : `Real-time chat feed from #${ch.name}.`,
              participants: uniqueParticipants,
            };
          });

          setChannels(realChannels);
          try {
            sessionStorage.removeItem('sanam_live_channels');
            sessionStorage.removeItem('sanam_live_data');
            sessionStorage.setItem('sanam_live_channels_v3', JSON.stringify(realChannels));
            sessionStorage.setItem('sanam_live_data_v3', JSON.stringify(data));
          } catch {}

          // Find the main text chat or active VC only on initial load
          if (!preserveSelection) {
            const mainChat = realChannels.find((c) => c.name.includes('txt') || c.name.includes('chat'));
            if (mainChat) {
              setSelectedChannelId(mainChat.id);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch live discord data', err);
      });
  };

  useEffect(() => {
    // Purge any legacy / outdated session cache
    try {
      sessionStorage.removeItem('sanam_live_channels');
      sessionStorage.removeItem('sanam_live_data');
      const cached = sessionStorage.getItem('sanam_live_channels_v3');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed.some((c: any) => c.name?.includes('confession'))) {
          setChannels(parsed);
        }
      }
      const cachedData = sessionStorage.getItem('sanam_live_data_v3');
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    } catch {}

    fetchServerData(false);

    // Auto poll voice channels and presence every 6 seconds
    const interval = setInterval(() => {
      fetchServerData(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // 2. Fetch real live Discord messages for the selected text channel
  const fetchChannelMessages = (chId: string, isInitial = false) => {
    // Only hydrate from static channel on initial channel switch
    if (isInitial) {
      const targetCh = channels.find((c) => c.id === chId) || CHANNELS_DATA.find((c) => c.id === chId);
      if (targetCh && targetCh.messages && targetCh.messages.length > 0) {
        setMessages(targetCh.messages);
      }
      setLoadingMessages(true);
    }

    fetch(`/api/discord/messages?channelId=${chId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else if (isInitial) {
          const targetCh = channels.find((c) => c.id === chId) || CHANNELS_DATA.find((c) => c.id === chId);
          if (!targetCh || !targetCh.messages || targetCh.messages.length === 0) {
            setMessages([
              {
                id: `init-${chId}`,
                author: {
                  name: 'SANAM Bot',
                  avatar: '/sanam-logo.png',
                  roleColor: '#FF6A00',
                  bot: true,
                  badge: 'SYSTEM',
                },
                content: `Welcome to this channel! Join discord.gg/sanam to chat live with 10,750+ members.`,
                timestamp: 'Live Feed',
              },
            ]);
          }
        }
        setLoadingMessages(false);
        if (isInitial) {
          setTimeout(() => {
            if (chatScrollRef.current) {
              chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
            }
          }, 100);
        }
      })
      .catch(() => {
        setLoadingMessages(false);
      });
  };

  useEffect(() => {
    const current = channels.find((c) => c.id === selectedChannelId);
    if (current && current.type !== 'voice') {
      fetchChannelMessages(selectedChannelId, true);

      // Auto poll every 3 seconds for new live chat messages
      const interval = setInterval(() => {
        fetchChannelMessages(selectedChannelId, false);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedChannelId, channels]);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const isVoice = selectedChannel?.type === 'voice';

  const handleChannelSelect = (channel: ChannelItem) => {
    setSelectedChannelId(channel.id);
    if (channel.type === 'voice') {
      fetchServerData(true);
      sounds.playVoiceJoin();
    } else {
      sounds.playChannelSwitch();
      fetchChannelMessages(channel.id, true);
    }
  };

  const toggleCategory = (title: string) => {
    sounds.playChannelSwitch();
    setCollapsedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isVoice) return;

    sounds.playChannelSwitch();

    const newMessage: ChannelMessage = {
      id: `user-${Date.now()}`,
      author: {
        name: 'You (SANAM Member)',
        avatar: '/sanam-logo.png',
        roleColor: '#FF8C32',
        badge: 'MEMBER',
      },
      content: inputMessage.trim(),
      timestamp: 'Just now',
      reactions: [{ emoji: '🧡', count: 1 }],
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  // Group channels by Category
  const categoriesMap: Record<string, ChannelItem[]> = {};
  channels.forEach((ch) => {
    let cat = ch.category || 'ᡣ𐭩. Official . ✦';
    if (cat === 'COMMUNITY') cat = 'ᡣ𐭩. Official . ✦';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(ch);
  });

  const categoryList = Object.keys(categoriesMap).map((catTitle) => ({
    title: catTitle,
    items: categoriesMap[catTitle],
  }));

  const totalInVc = channels
    .filter((c) => c.type === 'voice')
    .reduce((acc, curr) => acc + (curr.participants?.length || 0), 0);

  return (
    <section id="dashboard" className="relative py-10 px-3 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Status Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono uppercase tracking-wider font-bold">
              LIVE DISCORD BOT CONNECTED • {apiData?.total_count || 10759} MEMBERS • {apiData?.presence_count || 1109} ONLINE
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-sans uppercase truncate">
            {apiData?.name || 'SANAM™'}
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
            Real server channels, real voice participants, and live chat feed synchronized directly with Discord.
          </p>
        </div>

        {/* Outer Discord Glass Frame */}
        <div className="glass-panel-orange rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)] border border-white/10 backdrop-blur-2xl">
          
          {/* Top Window Bar */}
          <div className="h-11 px-4 bg-[#0a0a0a]/90 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF6A00]/80 shadow-[0_0_8px_rgba(255,106,0,0.6)]" />
              <span className="w-3 h-3 rounded-full bg-[#FF8C32]/40" />
              <span className="w-3 h-3 rounded-full bg-white/20" />
            </div>

            <div className="text-xs font-mono text-[#A1A1A1] flex items-center gap-2 truncate max-w-md">
              <Flame className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" />
              <span className="text-white font-semibold truncate">SANAM™</span>
              <span className="text-white/40">•</span>
              <span className="truncate">{isVoice ? `🔊 ${selectedChannel?.name}` : `#${selectedChannel?.name}`}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono hidden sm:inline">
                {(apiData?.presence_count || 1109).toLocaleString()} Online
              </span>
            </div>
          </div>

          {/* Main App Grid: Left Sidebar + Right Viewport */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[640px] bg-[#0c0c0c]/90">
            
            {/* LEFT SIDEBAR (All Categories & Channels) */}
            <div className="md:col-span-5 lg:col-span-4 border-r border-white/[0.08] bg-[#0e0e0e]/95 flex flex-col justify-between">
              
              <div>
                {/* Real Server Header with Real Icon */}
                <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-br from-[#FF6A00] to-[#FF8C32] shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0 overflow-hidden relative">
                      <img
                        src="/sanam-logo.gif"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/sanam-logo.png';
                        }}
                        alt="SANAM™"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                        <span className="truncate">SANAM™</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">
                          VERIFIED
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A1A1A1] flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="text-emerald-400 font-medium">
                          {(apiData?.presence_count || 1109).toLocaleString()} Online
                        </span>
                        <span>•</span>
                        <span className="text-white/80">{(apiData?.total_count || 10759).toLocaleString()} Members</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#A1A1A1] shrink-0" />
                </div>

                {/* All Unhidden Channels & Categories List */}
                <div className="p-2.5 space-y-3.5 max-h-[520px] overflow-y-auto">
                  {categoryList.map((cat) => {
                    const isCollapsed = Boolean(collapsedCategories[cat.title]);
                    return (
                      <div key={cat.title}>
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(cat.title)}
                          className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-[#A1A1A1]/90 tracking-wider uppercase hover:text-white transition-colors"
                        >
                          <span className="flex items-center gap-1 truncate">
                            {isCollapsed ? (
                              <ChevronRight className="w-3 h-3 text-[#FF6A00] shrink-0" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-[#FF6A00] shrink-0" />
                            )}
                            <span className="truncate">{cat.title}</span>
                          </span>
                          <span className="text-[9px] font-mono opacity-60 shrink-0">
                            {cat.items.length}
                          </span>
                        </button>

                        {/* Channels in Category */}
                        {!isCollapsed && (
                          <div className="space-y-1 mt-1">
                            {cat.items.map((ch) => {
                              const isSelected = ch.id === selectedChannelId;
                              const hasUsers = Boolean(ch.participants && ch.participants.length > 0);

                              return (
                                <div key={ch.id} className="space-y-0.5">
                                  {/* Channel Row */}
                                  <button
                                    onClick={() => handleChannelSelect(ch)}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all group ${
                                      isSelected
                                        ? 'bg-[#FF6A00]/20 text-white border border-[#FF6A00]/40 shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                                        : 'text-[#A1A1A1] hover:text-white hover:bg-white/[0.04]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {ch.type === 'voice' ? (
                                        <Volume2
                                          className={`w-4 h-4 shrink-0 ${
                                            hasUsers
                                              ? 'text-emerald-400'
                                              : isSelected
                                              ? 'text-[#FF6A00]'
                                              : 'text-[#FF8C32]/70 group-hover:text-[#FF6A00]'
                                          }`}
                                        />
                                      ) : ch.type === 'announcement' ? (
                                        <Megaphone
                                          className={`w-4 h-4 shrink-0 ${
                                            isSelected ? 'text-[#FF6A00]' : 'text-[#FF8C32]/70 group-hover:text-[#FF6A00]'
                                          }`}
                                        />
                                      ) : (
                                        <Hash
                                          className={`w-4 h-4 shrink-0 ${
                                            isSelected ? 'text-[#FF6A00]' : 'text-[#A1A1A1] group-hover:text-white'
                                          }`}
                                        />
                                      )}
                                      <span className="truncate">{ch.name}</span>
                                    </div>

                                    {/* Member count chip for voice channels */}
                                    {ch.type === 'voice' && hasUsers && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 font-bold shrink-0 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                        {ch.participants!.length}
                                      </span>
                                    )}
                                  </button>

                                  {/* REAL PARTICIPANTS SITTING IN VC (Directly under the voice channel) */}
                                  {ch.type === 'voice' && hasUsers && (
                                    <div className="pl-6 space-y-1 py-0.5">
                                      {ch.participants!.map((p) => (
                                        <div
                                          key={`${ch.id}-${p.id}-${p.name}`}
                                          className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-[#FF6A00]/30 transition-all text-xs"
                                        >
                                          <div className="flex items-center gap-2 truncate">
                                            <div className="relative shrink-0">
                                              <img
                                                src={p.avatar}
                                                alt={p.name}
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                  const target = e.currentTarget;
                                                  target.onerror = null;
                                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'Member')}&background=FF6A00&color=fff&bold=true`;
                                                }}
                                                className="w-5 h-5 rounded-full object-cover border border-[#FF6A00]"
                                              />
                                              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            </div>
                                            <span className="text-[11px] font-semibold text-white/95 truncate">
                                              {p.name}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0 text-[#A1A1A1]">
                                            {p.deaf && (
                                              <span title="Deafened">
                                                <VolumeX className="w-3 h-3 text-rose-400" />
                                              </span>
                                            )}
                                            {p.mute && (
                                              <span title="Muted">
                                                <MicOff className="w-3 h-3 text-amber-400" />
                                              </span>
                                            )}
                                            {!p.mute && !p.deaf && (
                                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Voice / Profile Bottom Pill */}
              <div className="p-3 border-t border-white/[0.08] bg-[#0a0a0a]/90 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                      alt="Guest avatar"
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#080808]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">SANAM Guest</div>
                    <div className="text-[10px] text-[#A1A1A1] font-mono">#web-guest</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      sounds.playChannelSwitch();
                      setMicMuted(!micMuted);
                    }}
                    title={micMuted ? 'Unmute' : 'Mute'}
                    className={`p-1.5 rounded-lg border transition-all ${
                      micMuted
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'text-[#A1A1A1] hover:text-white bg-white/[0.03] border-white/[0.06]'
                    }`}
                  >
                    {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      sounds.playChannelSwitch();
                      setDeafened(!deafened);
                    }}
                    title={deafened ? 'Undeafen' : 'Deafen'}
                    className={`p-1.5 rounded-lg border transition-all ${
                      deafened
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'text-[#A1A1A1] hover:text-white bg-white/[0.03] border-white/[0.06]'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT VIEWPORT (Real Live Discord Chat Stream OR Voice Stage) */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-[#080808]/85">
              
              {/* Channel Header */}
              <div className="h-14 px-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0c0c0c]/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white truncate">
                    {isVoice ? (
                      <Volume2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    ) : (
                      <Hash className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    )}
                    <span className="truncate">{selectedChannel?.name}</span>
                  </div>
                  {selectedChannel?.description && (
                    <>
                      <span className="text-white/20 hidden sm:inline">|</span>
                      <span className="text-xs text-[#A1A1A1] truncate max-w-sm hidden sm:inline">
                        {selectedChannel.description}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[#A1A1A1] shrink-0">
                  <button
                    onClick={() => {
                      fetchChannelMessages(selectedChannelId);
                      fetchServerData(true);
                    }}
                    title="Refresh Chat Feed & Voice Attendees"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#A1A1A1] hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin text-[#FF6A00]' : ''}`} />
                  </button>

                  <a
                    href={DISCORD_CONFIG.inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playJoinGlow()}
                    className="btn-orange-glow px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,106,0,0.3)]"
                  >
                    <span>Join Server</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Viewport Content */}
              {isVoice ? (
                /* VOICE ROOM STAGE WITH REAL PARTICIPANTS */
                <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                  <div className="max-w-xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-xs text-[#FF8C32] font-semibold mb-6">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF6A00]" />
                      Voice Lounge • 384kbps Stereo HD Audio
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-sans">
                      {selectedChannel?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A1A1A1] mb-8">
                      {selectedChannel?.description}
                    </p>

                    {/* Participant Cards Grid */}
                    {selectedChannel?.participants && selectedChannel.participants.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {selectedChannel.participants.map((p) => (
                          <div
                            key={p.id}
                            className="liquid-glass rounded-2xl p-4 flex items-center gap-4 border border-white/10 group hover:border-[#FF6A00]/50 transition-all duration-300 text-left"
                          >
                            <div className="relative shrink-0">
                              <img
                                src={p.avatar}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.onerror = null;
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'Member')}&background=FF6A00&color=fff&bold=true`;
                                }}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6A00] speaking-pulse"
                              />
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold border-2 border-[#080808]">
                                ⚡
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-bold text-white truncate block">
                                {p.name}
                              </span>
                              <span className="text-xs text-[#FF8C32] flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                Active in Voice
                              </span>
                              {p.activity && (
                                <span className="text-[10px] text-[#A1A1A1] truncate block mt-0.5">
                                  {p.activity}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-8 p-6 rounded-2xl liquid-glass border border-white/10 text-center">
                        <Volume2 className="w-8 h-8 text-[#FF8C32] mx-auto mb-2 opacity-60" />
                        <div className="text-sm font-semibold text-white">This voice channel is currently empty</div>
                        <div className="text-xs text-[#A1A1A1] mt-1">
                          Click below to hop into Discord and hang out!
                        </div>
                      </div>
                    )}

                    {/* Animated Sound Waveform Indicator */}
                    <div className="flex items-center justify-center gap-1.5 h-10 mb-6">
                      {[40, 75, 90, 60, 30, 85, 100, 65, 45, 80, 50, 70, 95, 35].map(
                        (h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-gradient-to-t from-[#FF6A00] to-[#FF8C32] rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 0.08}s`,
                              animationDuration: '0.8s',
                            }}
                          />
                        )
                      )}
                    </div>

                    <a
                      href={DISCORD_CONFIG.inviteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.playVoiceJoin()}
                      className="btn-orange-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-[0_0_30px_rgba(255,106,0,0.4)]"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Join {selectedChannel?.name} on Discord</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* REAL DISCORD CHAT STREAM */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  
                  {/* Message History */}
                  <div ref={chatScrollRef} className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[460px]">
                    {/* Welcome Banner in Chat */}
                    <div className="pb-4 mb-2 border-b border-white/[0.06] text-left flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 flex items-center justify-center text-[#FF6A00] mb-2">
                          <Hash className="w-5 h-5" />
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          Welcome to #{selectedChannel?.name}!
                        </h4>
                        <p className="text-xs text-[#A1A1A1]">
                          Showing live messages directly from Discord server.
                        </p>
                      </div>

                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Feed
                      </div>
                    </div>

                    {/* Loading Spinner */}
                    {loadingMessages && messages.length === 0 && (
                      <div className="py-12 flex flex-col items-center justify-center text-center text-[#A1A1A1]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FF6A00] mb-2" />
                        <span className="text-xs">Fetching live Discord chat messages...</span>
                      </div>
                    )}

                    {/* Messages List */}
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3 text-left group hover:bg-white/[0.02] p-1.5 rounded-xl transition-colors">
                        <img
                          src={msg.author.avatar}
                          alt={msg.author.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.author.name || 'SANAM')}&background=FF6A00&color=fff&bold=true`;
                          }}
                          className="w-9 h-9 rounded-full object-cover border border-white/10 mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-bold truncate"
                              style={{ color: msg.author.roleColor }}
                            >
                              {msg.author.name}
                            </span>
                            {msg.author.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-white/90 border border-white/10 uppercase shrink-0">
                                {msg.author.badge}
                              </span>
                            )}
                            <span className="text-[10px] text-[#A1A1A1] shrink-0">
                              {msg.timestamp}
                            </span>
                          </div>

                          <DiscordMessageContent
                            content={msg.content}
                            embeds={msg.embeds}
                            mediaVideo={msg.mediaVideo}
                            mediaGif={msg.mediaGif}
                            stickers={msg.stickers}
                            attachment={msg.attachment}
                          />

                          {/* Reaction Badges */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {msg.reactions.map((r, i) => (
                                <button
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white/90 transition-colors"
                                >
                                  {r.id ? (
                                    <img
                                      src={`https://cdn.discordapp.com/emojis/${r.id}.webp?size=48&quality=lossless`}
                                      alt={r.emoji}
                                      className="w-4 h-4 object-contain inline-block"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.endsWith('.png')) {
                                          target.src = `https://cdn.discordapp.com/emojis/${r.id}.png?size=48`;
                                        }
                                      }}
                                    />
                                  ) : (
                                    <span>{r.emoji}</span>
                                  )}
                                  <span className="text-[11px] font-mono text-[#FF8C32] font-semibold">
                                    {r.count}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Box */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 sm:p-4 bg-[#0a0a0a]/90 border-t border-white/[0.08]"
                  >
                    <div className="liquid-glass rounded-2xl px-3 py-2 flex items-center gap-2 border border-white/10 focus-within:border-[#FF6A00]/50 transition-all">
                      <button
                        type="button"
                        onClick={() => sounds.playChannelSwitch()}
                        className="text-[#A1A1A1] hover:text-white p-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={`Message #${selectedChannel?.name}...`}
                        className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-[#A1A1A1] focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playChannelSwitch();
                          setInputMessage((prev) => prev + ' 🧡');
                        }}
                        className="text-[#A1A1A1] hover:text-white p-1"
                      >
                        <Smile className="w-4 h-4" />
                      </button>

                      <button
                        type="submit"
                        className="p-1.5 rounded-xl bg-[#FF6A00] hover:bg-[#FF8C32] text-white transition-all shadow-[0_0_12px_rgba(255,106,0,0.4)]"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
