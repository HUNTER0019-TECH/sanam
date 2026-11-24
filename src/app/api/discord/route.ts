import { NextResponse } from 'next/server';
import { DISCORD_CONFIG } from '@/config/discord';
import { getGatewayVoiceMembers } from '@/lib/discordVoiceGateway';

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id?: string | null;
  permission_overwrites?: { id: string; type: number; allow: string; deny: string }[];
}

// In-memory cache to prevent Discord 429 rate limits
interface CacheStore {
  guildData: any;
  lastGuildFetch: number;
  channels: DiscordChannel[];
  lastChannelsFetch: number;
  widgetData: any;
  lastWidgetFetch: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __discordApiCache: CacheStore | undefined;
}

const cache: CacheStore = globalThis.__discordApiCache || {
  guildData: null,
  lastGuildFetch: 0,
  channels: [],
  lastChannelsFetch: 0,
  widgetData: null,
  lastWidgetFetch: 0,
};
globalThis.__discordApiCache = cache;

const CHANNELS_CACHE_TTL = 30000; // 30 seconds
const WIDGET_CACHE_TTL = 8000;    // 8 seconds

// Unicode font map for small-caps & stylistic Discord symbols to normalize names
const UNICODE_FONT_MAP: Record<string, string> = {
  'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ғ': 'f', 'ɢ': 'g', 'ʜ': 'h',
  'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o', 'ᴘ': 'p',
  'ǫ': 'q', 'ʀ': 'r', 's': 's', 'ᴛ': 't', 'ᴜ': 'u', 'ᴠ': 'v', 'ᴡ': 'w', 'x': 'x',
  'ʏ': 'y', 'ᴢ': 'z',
  'ˢ': 's', 'ᵃ': 'a', 'ⁿ': 'n', 'ᵐ': 'm', 'ᵗ': 't', 'ʰ': 'h', 'ᵉ': 'e', 'ᵒ': 'o',
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
};

function cleanDiscordName(str?: string): string {
  if (!str) return '';
  let s = str.normalize('NFKD');
  for (const [k, v] of Object.entries(UNICODE_FONT_MAP)) {
    if (s.includes(k)) {
      s = s.split(k).join(v);
    }
  }
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Check if @everyone has VIEW_CHANNEL (1024 / 0x400) denied without an explicit allow
function isPermissionHidden(
  overwrites?: { id: string; type?: number; allow?: string; deny: string }[],
  guildId?: string
): boolean {
  if (!overwrites || !guildId) return false;
  const everyone = overwrites.find((o) => o.id === guildId);
  if (!everyone) return false;
  try {
    const allowBig = BigInt(everyone.allow || '0');
    // If explicitly allowed 1024, it is NOT hidden
    if ((allowBig & BigInt(1024)) === BigInt(1024)) return false;

    const denyBig = BigInt(everyone.deny || '0');
    return (denyBig & BigInt(1024)) === BigInt(1024);
  } catch {
    return false;
  }
}

// Category blacklist keywords (internal staff, ticket, logs)
const HIDDEN_CATEGORY_KEYWORDS = [
  'staff',
  'vantex ticket',
  'vantex logs',
  'ticket created',
  'tickets',
  'modlog',
  'antinu',
  'wick',
  'logs',
];

// Specific unwanted / private channel keywords
const HIDDEN_CHANNEL_KEYWORDS = [
  'setup',
  'gateway',
  'server-work',
  'moderation',
  'server-review',
  'owner-chat',
  'staff-',
  'ticket-',
  'transcript',
  'paid-promo',
  'mod-req',
  'management-',
  'how-to-invite',
  'quarantined-chat',
  'wick-logs',
  'modlogs',
  'antinuke',
  'vantex-automod',
];

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID || DISCORD_CONFIG.guildId;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  let totalMembers = 10759;
  let presenceCount = 1114;
  let guildName = DISCORD_CONFIG.serverName;
  let iconUrl = DISCORD_CONFIG.serverIcon;
  let allChannels: DiscordChannel[] = cache.channels || [];
  let widgetVoiceMembers: Record<string, { id: string; name: string; avatar: string; status: string; deaf?: boolean; mute?: boolean; activity?: string; bot?: boolean }[]> = {};

  const now = Date.now();

  // 1. Fetch live widget data (cached for 8s)
  if (now - cache.lastWidgetFetch > WIDGET_CACHE_TTL || !cache.widgetData) {
    try {
      const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
        cache: 'no-store',
      });
      if (widgetRes.ok) {
        cache.widgetData = await widgetRes.json();
        cache.lastWidgetFetch = now;
      }
    } catch (err) {
      console.warn('Widget fetch warning', err);
    }
  }

  if (cache.widgetData) {
    const widgetData = cache.widgetData;
    if (widgetData.presence_count) presenceCount = widgetData.presence_count;

    (widgetData.members || []).forEach((m: { id: string; username: string; avatar_url: string; status: string; channel_id?: string; deaf?: boolean; mute?: boolean; game?: { name: string } }) => {
      if (m.channel_id) {
        if (!widgetVoiceMembers[m.channel_id]) widgetVoiceMembers[m.channel_id] = [];
        widgetVoiceMembers[m.channel_id].push({
          id: m.id,
          name: m.username,
          avatar: m.avatar_url,
          status: m.status,
          deaf: Boolean(m.deaf),
          mute: Boolean(m.mute),
          activity: m.game?.name || undefined,
          bot: true,
        });
      }
    });
  }

  // 2. Fetch real-time Voice States from Discord Gateway WebSocket
  let gatewayVoiceMembers: Record<string, any[]> = {};
  try {
    gatewayVoiceMembers = await getGatewayVoiceMembers();
  } catch (gwErr) {
    console.warn('Gateway voice fetch error', gwErr);
  }

  // Merge gateway and widget voice members with strict deduplication by ID and normalized cleaned name
  const voiceMembersMerged: Record<string, any[]> = {};
  const allVcIds = new Set([...Object.keys(gatewayVoiceMembers), ...Object.keys(widgetVoiceMembers)]);

  for (const vcId of allVcIds) {
    const listGw = gatewayVoiceMembers[vcId] || [];
    const listWidget = widgetVoiceMembers[vcId] || [];
    const seenIds = new Set<string>();
    const seenCleanNames = new Set<string>();
    const combined: any[] = [];

    // Gateway data first (contains accurate user IDs, nicks, avatars, human vs bot)
    for (const m of listGw) {
      if (!m || !m.name) continue;
      const clean = cleanDiscordName(m.name);
      if (seenIds.has(m.id) || (clean && seenCleanNames.has(clean))) continue;
      if (m.id) seenIds.add(m.id);
      if (clean) seenCleanNames.add(clean);
      combined.push(m);
    }

    // Add any widget participant not already present
    for (const m of listWidget) {
      if (!m || !m.name) continue;
      const clean = cleanDiscordName(m.name);
      if (seenIds.has(m.id) || (clean && seenCleanNames.has(clean))) continue;
      if (m.id) seenIds.add(m.id);
      if (clean) seenCleanNames.add(clean);
      combined.push(m);
    }

    // Sort: Human members first, then alphabetical
    combined.sort((a, b) => {
      if (Boolean(a.bot) !== Boolean(b.bot)) {
        return a.bot ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });

    voiceMembersMerged[vcId] = combined;
  }

  // 3. Fetch full guild info and channels via Bot Token (cached for 30s)
  if (botToken) {
    const needChannels = now - cache.lastChannelsFetch > CHANNELS_CACHE_TTL || cache.channels.length === 0;

    if (needChannels) {
      try {
        const headers = {
          Authorization: `Bot ${botToken}`,
          'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
        };

        // Guild Info
        const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
          headers,
          cache: 'no-store',
        });

        if (guildRes.ok) {
          const guildData = await guildRes.json();
          cache.guildData = guildData;
          cache.lastGuildFetch = now;
        }

        // Channels
        const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
          headers,
          cache: 'no-store',
        });

        if (channelsRes.ok) {
          const channelsData = await channelsRes.json();
          if (Array.isArray(channelsData)) {
            cache.channels = channelsData;
            cache.lastChannelsFetch = now;
            allChannels = channelsData;
          }
        } else if (channelsRes.status === 429) {
          console.warn('Discord channels rate limited, serving cached channels');
        }
      } catch (botErr) {
        console.warn('Bot API fetch warning', botErr);
      }
    } else {
      allChannels = cache.channels;
    }
  }

  if (cache.guildData) {
    const guildData = cache.guildData;
    guildName = guildData.name || guildName;
    if (guildData.approximate_member_count) totalMembers = guildData.approximate_member_count;
    if (guildData.approximate_presence_count) presenceCount = guildData.approximate_presence_count;
    if (guildData.icon) {
      const isGif = guildData.icon.startsWith('a_');
      iconUrl = `https://cdn.discordapp.com/icons/${guildId}/${guildData.icon}.${isGif ? 'gif' : 'png'}?size=256`;
    }
  }

  // 4. Process channels: Keep ACCESS category and community channels, hide internal staff/ticket categories
  if (allChannels.length > 0) {
    const categoryMap: Record<string, { id: string; name: string; position: number }> = {};
    const hiddenCategoryIds = new Set<string>();

    allChannels.forEach((ch) => {
      if (ch.type === 4) {
        const lower = ch.name.toLowerCase();
        const isAccessCat = lower.includes('access');
        const isHiddenByName = HIDDEN_CATEGORY_KEYWORDS.some((kw) => lower.includes(kw));

        // NEVER hide ACCESS category!
        if (isAccessCat) {
          categoryMap[ch.id] = { id: ch.id, name: ch.name, position: ch.position };
        } else if (isHiddenByName) {
          hiddenCategoryIds.add(ch.id);
        } else {
          categoryMap[ch.id] = { id: ch.id, name: ch.name, position: ch.position };
        }
      }
    });

    // Filter unhidden non-category channels
    const filteredChannels = allChannels.filter((ch) => {
      // Don't include category items as channels
      if (ch.type === 4) return false;

      const lower = ch.name.toLowerCase();

      // Check channel blacklist keywords
      const isHiddenChannel = HIDDEN_CHANNEL_KEYWORDS.some((kw) => lower.includes(kw));
      if (isHiddenChannel) return false;

      // Always show channels under ACCESS category (Image 2)
      const parentCat = ch.parent_id ? categoryMap[ch.parent_id] : null;
      const isUnderAccess = parentCat && parentCat.name.toLowerCase().includes('access');
      if (isUnderAccess) {
        return true;
      }

      // Check if parent category is hidden (staff, ticket, logs)
      if (ch.parent_id && hiddenCategoryIds.has(ch.parent_id)) {
        return false;
      }

      // Check if channel itself has @everyone VIEW_CHANNEL denied
      if (isPermissionHidden(ch.permission_overwrites, guildId)) {
        return false;
      }

      return true;
    });

    // Sort channels by category position then channel position
    filteredChannels.sort((a, b) => {
      const catA = a.parent_id && categoryMap[a.parent_id] ? categoryMap[a.parent_id].position : 0;
      const catB = b.parent_id && categoryMap[b.parent_id] ? categoryMap[b.parent_id].position : 0;
      if (catA !== catB) return catA - catB;
      return a.position - b.position;
    });

    const formattedChannels = filteredChannels.map((ch) => {
      const parentCat = ch.parent_id ? categoryMap[ch.parent_id]?.name : null;
      const isVoice = ch.type === 2;
      const isAnnouncement = ch.type === 5;
      const participants = isVoice && voiceMembersMerged[ch.id] ? voiceMembersMerged[ch.id] : [];

      return {
        id: ch.id,
        name: ch.name,
        type: isVoice ? 'voice' : isAnnouncement ? 'announcement' : 'text',
        category: parentCat || 'COMMUNITY',
        position: ch.position,
        participants,
        participantCount: participants.length,
      };
    });

    return NextResponse.json({
      source: 'live_discord_bot',
      id: guildId,
      name: guildName,
      icon_url: iconUrl,
      total_count: totalMembers,
      presence_count: presenceCount,
      channels: formattedChannels,
      is_live_widget: true,
      widget_enabled: true,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
      },
    });
  }

  return NextResponse.json({
    source: 'fallback',
    id: guildId,
    name: DISCORD_CONFIG.serverName,
    icon_url: DISCORD_CONFIG.serverIcon,
    total_count: totalMembers,
    presence_count: presenceCount,
    channels: [],
    is_live_widget: false,
    widget_enabled: true,
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
