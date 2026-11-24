import { NextRequest, NextResponse } from 'next/server';
import { DiscordEmbedItem } from '@/types/discord';
import { CHANNELS_DATA } from '@/config/discord';

// Helper to convert Discord integer colors (e.g. 16242282) to hex strings (#f7d5ea)
function decimalToHexColor(dec?: number): string | undefined {
  if (typeof dec !== 'number' || dec <= 0) return undefined;
  return `#${dec.toString(16).padStart(6, '0')}`;
}

// Helper to recursively collect text content from Discord message components (Vantex, Wick, modern bots)
function extractComponentText(components?: any[]): string[] {
  if (!Array.isArray(components) || components.length === 0) return [];
  const lines: string[] = [];

  for (const comp of components) {
    if (typeof comp.content === 'string' && comp.content.trim()) {
      lines.push(comp.content.trim());
    }
    if (Array.isArray(comp.components)) {
      lines.push(...extractComponentText(comp.components));
    }
  }

  return lines;
}

// In-memory rate limiter to protect Discord API and prevent scraping / DoS
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 40;

// Short cache (3 seconds) to serve concurrent visitors instantly and prevent Discord 429s
interface MessageCacheEntry {
  data: any;
  cachedAt: number;
}
const messageCache = new Map<string, MessageCacheEntry>();
const MESSAGE_CACHE_TTL = 3000; // 3 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  entry.count++;
  return false;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again shortly.', messages: [] },
      { status: 429, headers: { 'Retry-After': '5' } }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId');
  const rawToken = process.env.DISCORD_BOT_TOKEN;
  const botToken = rawToken ? rawToken.trim().replace(/^["']|["']$/g, '').trim() : undefined;

  // Security: Strict Snowflake ID validation (17 to 20 digits only)
  if (!channelId || !/^\d{17,20}$/.test(channelId)) {
    return NextResponse.json({ messages: [] }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  // If botToken is not configured yet on Vercel, serve fallback real channel messages
  if (!botToken) {
    const fallbackCh = CHANNELS_DATA.find((c) => c.id === channelId);
    return NextResponse.json(
      { messages: fallbackCh?.messages || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
        },
      }
    );
  }

  // Check in-memory cache for instant 0ms responses
  const now = Date.now();
  const cached = messageCache.get(channelId);
  if (cached && now - cached.cachedAt < MESSAGE_CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=10',
      },
    });
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=35`, {
      headers: {
        Authorization: `Bot ${botToken}`,
        'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();

      const formatted = (data || []).reverse().map((m: any) => {
        // Build author avatar URL
        let avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
        if (m.author?.avatar) {
          const isGif = m.author.avatar.startsWith('a_');
          avatarUrl = `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.${isGif ? 'gif' : 'png'}?size=128`;
        }

        // Format timestamp
        const date = new Date(m.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 1. Process content & user mentions
        let content = m.content || '';

        // If content is empty, check modern Discord UI components (e.g. Vantex AFK or buttons)
        if (!content.trim() && m.components) {
          const extracted = extractComponentText(m.components);
          if (extracted.length > 0) {
            content = extracted.join('\n');
          }
        }

        // Map mentions array for clean replacement: <@userId> -> @DisplayName
        if (Array.isArray(m.mentions)) {
          m.mentions.forEach((u: { id: string; global_name?: string; username: string }) => {
            const displayName = u.global_name || u.username;
            const regex = new RegExp(`<@!?${u.id}>`, 'g');
            content = content.replace(regex, `@${displayName}`);
          });
        }

        // 2. Process embeds
        let embeds: DiscordEmbedItem[] = [];
        let mediaVideo: string | undefined = undefined;
        let mediaGif: string | undefined = undefined;

        if (Array.isArray(m.embeds)) {
          m.embeds.forEach((e: any) => {
            // Tenor GIFV embeds
            if (e.type === 'gifv' || e.video?.url) {
              if (e.video?.url) mediaVideo = e.video.url;
              if (e.thumbnail?.url) mediaGif = e.thumbnail.url;
            }

            // Rich embeds (Wick, Vantex, Bot Announcements)
            const color = decimalToHexColor(e.color) || '#FF6A00';
            const embedItem: DiscordEmbedItem = {
              title: e.title,
              description: e.description,
              url: e.url,
              color,
              author: e.author ? {
                name: e.author.name,
                icon_url: e.author.icon_url,
                url: e.author.url,
              } : undefined,
              footer: e.footer ? {
                text: e.footer.text,
                icon_url: e.footer.icon_url,
              } : undefined,
              thumbnail: e.thumbnail ? {
                url: e.thumbnail.url,
                width: e.thumbnail.width,
                height: e.thumbnail.height,
              } : undefined,
              image: e.image ? {
                url: e.image.url,
                width: e.image.width,
                height: e.image.height,
              } : undefined,
              video: e.video ? {
                url: e.video.url,
                width: e.video.width,
                height: e.video.height,
              } : undefined,
              fields: Array.isArray(e.fields) ? e.fields.map((f: any) => ({
                name: f.name,
                value: f.value,
                inline: Boolean(f.inline),
              })) : undefined,
            };

            // Only add if there is meaningful content
            if (
              embedItem.title ||
              embedItem.description ||
              (embedItem.fields && embedItem.fields.length > 0) ||
              embedItem.image ||
              embedItem.thumbnail
            ) {
              embeds.push(embedItem);
            }
          });
        }

        // If content is still empty, and we have an embed description/title, use it
        if (!content.trim() && embeds.length > 0) {
          const first = embeds[0];
          if (first.description) {
            content = ''; // Embed will render the card directly
          }
        }

        // 3. Process stickers
        let stickers: { id: string; name: string; url: string }[] = [];
        if (Array.isArray(m.sticker_items)) {
          stickers = m.sticker_items.map((s: any) => ({
            id: s.id,
            name: s.name,
            url: `https://media.discordapp.net/stickers/${s.id}.png?size=160`,
          }));
        }

        // 4. Process attachments
        let attachment: any = undefined;
        if (Array.isArray(m.attachments) && m.attachments.length > 0) {
          const firstAtt = m.attachments[0];
          const isImg = firstAtt.content_type?.startsWith('image') || /\.(png|jpe?g|gif|webp)$/i.test(firstAtt.url);
          const isVid = firstAtt.content_type?.startsWith('video') || /\.(mp4|webm|mov)$/i.test(firstAtt.url);
          attachment = {
            type: isVid ? 'video' : isImg ? 'image' : 'embed',
            url: firstAtt.url,
            title: firstAtt.filename,
          };
        }

        // Check if raw content is a Tenor link with no embeds yet
        if (!mediaVideo && !mediaGif && content.includes('tenor.com/view/')) {
          mediaGif = content.trim();
        }

        return {
          id: m.id,
          author: {
            name: m.author?.global_name || m.author?.username || 'Discord User',
            avatar: avatarUrl,
            roleColor: m.author?.bot ? '#FF8C32' : '#FFFFFF',
            bot: Boolean(m.author?.bot),
            badge: m.author?.bot ? 'BOT' : undefined,
          },
          content,
          timestamp: `Today at ${timeStr}`,
          attachment,
          embeds: embeds.length > 0 ? embeds : undefined,
          stickers: stickers.length > 0 ? stickers : undefined,
          mediaVideo,
          mediaGif,
          reactions: (m.reactions || []).map((r: any) => ({
            emoji: r.emoji.name,
            id: r.emoji.id || undefined,
            count: r.count,
          })),
        };
      });

      const responsePayload = { messages: formatted };
      messageCache.set(channelId, { data: responsePayload, cachedAt: Date.now() });

      return NextResponse.json(responsePayload, {
        headers: {
          'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=10',
        },
      });
    }
  } catch (err) {
    console.warn('Failed to fetch messages for channel', channelId, err);
  }

  // Fallback to static messages from CHANNELS_DATA
  const fallbackCh = CHANNELS_DATA.find((c) => c.id === channelId);
  return NextResponse.json({ messages: fallbackCh?.messages || [] }, {
    headers: {
      'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
    },
  });
}
