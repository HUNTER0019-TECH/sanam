import { DISCORD_CONFIG } from '@/config/discord';

interface LiveVoiceMember {
  id: string;
  name: string;
  avatar: string;
  status: string;
  bot: boolean;
  deaf?: boolean;
  mute?: boolean;
  activity?: string;
  speaking?: boolean;
}

// In-memory map of channelId -> list of active voice members
type VoiceMap = Record<string, LiveVoiceMember[]>;

interface GatewayState {
  ws: WebSocket | null;
  heartbeatInterval: NodeJS.Timeout | null;
  voiceStates: Record<string, { channelId: string; deaf?: boolean; mute?: boolean }>;
  memberCache: Record<string, { name: string; avatar: string; bot: boolean }>;
  isReady: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __discordGatewayState: GatewayState | undefined;
}

const state: GatewayState = globalThis.__discordGatewayState || {
  ws: null,
  heartbeatInterval: null,
  voiceStates: {},
  memberCache: {},
  isReady: false,
};

globalThis.__discordGatewayState = state;

const GUILD_ID = process.env.DISCORD_GUILD_ID || DISCORD_CONFIG.guildId;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

async function fetchMemberDetails(userId: string): Promise<{ name: string; avatar: string; bot: boolean }> {
  if (state.memberCache[userId]) {
    return state.memberCache[userId];
  }

  if (!BOT_TOKEN) {
    return { name: 'Member', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', bot: false };
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
      },
      cache: 'force-cache',
    });

    if (res.ok) {
      const data = await res.json();
      const name = data.nick || data.user?.global_name || data.user?.username || 'Member';
      let avatar = '';
      if (data.avatar) {
        const isGif = data.avatar.startsWith('a_');
        avatar = `https://cdn.discordapp.com/guilds/${GUILD_ID}/users/${userId}/avatars/${data.avatar}.${isGif ? 'gif' : 'png'}?size=128`;
      } else if (data.user?.avatar) {
        const isGif = data.user.avatar.startsWith('a_');
        avatar = `https://cdn.discordapp.com/avatars/${userId}/${data.user.avatar}.${isGif ? 'gif' : 'png'}?size=128`;
      } else {
        try {
          const index = Number((BigInt(userId) >> BigInt(22)) % BigInt(6));
          avatar = `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        } catch {
          avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6A00&color=fff&bold=true`;
        }
      }

      const info = { name, avatar, bot: Boolean(data.user?.bot) };
      state.memberCache[userId] = info;
      return info;
    }
  } catch (err) {
    console.warn(`Failed to fetch member details for ${userId}:`, err);
  }

  return { name: 'Member', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', bot: false };
}

export function initDiscordGateway() {
  if (!BOT_TOKEN || typeof WebSocket === 'undefined') return;
  if (state.ws && (state.ws.readyState === WebSocket.OPEN || state.ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    state.ws = ws;

    ws.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data as string);
        const { op, d, t } = payload;

        if (op === 10) {
          // Op 10: Hello -> start heartbeat
          if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
          state.heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 1, d: null }));
            }
          }, d.heartbeat_interval);

          // Identify
          ws.send(
            JSON.stringify({
              op: 2,
              d: {
                token: BOT_TOKEN,
                intents: 1 | 128 | 512, // GUILDS | GUILD_VOICE_STATES | GUILD_MESSAGES
                properties: {
                  os: 'windows',
                  browser: 'sanam-bot',
                  device: 'sanam-bot',
                },
              },
            })
          );
        } else if (t === 'READY') {
          state.isReady = true;
        } else if (t === 'GUILD_CREATE' && d.id === GUILD_ID) {
          // Process all active voice states in guild
          state.voiceStates = {};
          if (Array.isArray(d.voice_states)) {
            for (const vs of d.voice_states) {
              if (vs.channel_id && vs.user_id) {
                state.voiceStates[vs.user_id] = {
                  channelId: vs.channel_id,
                  deaf: Boolean(vs.deaf || vs.self_deaf),
                  mute: Boolean(vs.mute || vs.self_mute),
                };
                // Pre-warm member cache
                fetchMemberDetails(vs.user_id).catch(() => {});
              }
            }
          }
        } else if (t === 'VOICE_STATE_UPDATE' && d.guild_id === GUILD_ID) {
          // Live voice state update (join, leave, switch)
          if (!d.channel_id) {
            // User left voice
            delete state.voiceStates[d.user_id];
          } else {
            // User joined or moved channel
            state.voiceStates[d.user_id] = {
              channelId: d.channel_id,
              deaf: Boolean(d.deaf || d.self_deaf),
              mute: Boolean(d.mute || d.self_mute),
            };
            fetchMemberDetails(d.user_id).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Discord Gateway message parse error', err);
      }
    };

    ws.onclose = () => {
      state.isReady = false;
      if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
      // Reconnect after 5 seconds
      setTimeout(() => {
        initDiscordGateway();
      }, 5000);
    };

    ws.onerror = (err) => {
      console.warn('Discord Gateway error', err);
    };
  } catch (err) {
    console.warn('Failed to initialize Discord Gateway', err);
  }
}

const UNICODE_FONT_MAP: Record<string, string> = {
  'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ғ': 'f', 'ɢ': 'g', 'ʜ': 'h',
  'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o', 'ᴘ': 'p',
  'ǫ': 'q', 'ʀ': 'r', 's': 's', 'ᴛ': 't', 'ᴜ': 'u', 'ᴠ': 'v', 'ᴡ': 'w', 'x': 'x',
  'ʏ': 'y', 'ᴢ': 'z',
  'ˢ': 's', 'ᵃ': 'a', 'ⁿ': 'n', 'ᵐ': 'm', 'ᵗ': 't', 'ʰ': 'h', 'ᵉ': 'e', 'ᵒ': 'o',
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

export async function getGatewayVoiceMembers(): Promise<VoiceMap> {
  // Ensure gateway is running
  initDiscordGateway();

  const voiceMap: VoiceMap = {};

  const entries = Object.entries(state.voiceStates);
  for (const [userId, vs] of entries) {
    const member = await fetchMemberDetails(userId);
    if (!voiceMap[vs.channelId]) {
      voiceMap[vs.channelId] = [];
    }
    voiceMap[vs.channelId].push({
      id: userId,
      name: member.name,
      avatar: member.avatar,
      status: 'online',
      bot: member.bot,
      deaf: vs.deaf,
      mute: vs.mute,
      speaking: !vs.mute,
    });
  }

  // Deduplicate and Sort: Human members first, then bots
  for (const chId in voiceMap) {
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const uniqueList: LiveVoiceMember[] = [];

    for (const m of voiceMap[chId]) {
      const clean = cleanDiscordName(m.name);
      if (seenIds.has(m.id) || (clean && seenNames.has(clean))) continue;
      seenIds.add(m.id);
      if (clean) seenNames.add(clean);
      uniqueList.push(m);
    }

    uniqueList.sort((a, b) => {
      if (a.bot !== b.bot) return a.bot ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    voiceMap[chId] = uniqueList;
  }

  return voiceMap;
}
