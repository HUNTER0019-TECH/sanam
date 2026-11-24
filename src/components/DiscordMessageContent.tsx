'use client';

import React from 'react';
import { DiscordEmbedItem } from '@/types/discord';
import { ExternalLink, Film, Hash, MessageSquare } from 'lucide-react';

interface DiscordMessageContentProps {
  content: string;
  embeds?: DiscordEmbedItem[];
  mediaVideo?: string;
  mediaGif?: string;
  stickers?: { id: string; name: string; url: string }[];
  attachment?: {
    type: 'image' | 'audio' | 'embed' | 'video';
    url?: string;
    title?: string;
    description?: string;
  };
}

// Format Discord timestamp e.g. <t:1795408850:R> or <t:1795408850:F>
function formatDiscordTimestamp(timestampStr: string): string {
  try {
    const match = timestampStr.match(/<t:(\d+)(?::([a-zA-Z]))?>/);
    if (!match) return timestampStr;
    const unixSeconds = parseInt(match[1], 10);
    const date = new Date(unixSeconds * 1000);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    return date.toLocaleDateString();
  } catch {
    return timestampStr;
  }
}

// Parse text into tokens: custom emojis, mentions, bold, italic, code, links
export function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  // Split lines first to handle blockquotes and headings
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        // Heading 1 / 2 / 3
        if (line.startsWith('# ')) {
          return (
            <h3 key={lineIdx} className="text-base sm:text-lg font-bold text-white mt-1 mb-1">
              {renderInlineTokens(line.slice(2))}
            </h3>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h4 key={lineIdx} className="text-sm sm:text-base font-bold text-[#FF8C32] mt-1 mb-0.5">
              {renderInlineTokens(line.slice(3))}
            </h4>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h5 key={lineIdx} className="text-xs sm:text-sm font-semibold text-white/90 mt-1 mb-0.5">
              {renderInlineTokens(line.slice(4))}
            </h5>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={lineIdx}
              className="pl-3 py-0.5 border-l-2 border-[#FF6A00] text-white/80 text-xs sm:text-sm bg-white/[0.02] rounded-r-md my-0.5"
            >
              {renderInlineTokens(line.slice(2))}
            </blockquote>
          );
        }

        // Code block triple backtick line or block
        if (line.startsWith('```') && line.endsWith('```') && line.length > 6) {
          const codeContent = line.slice(3, -3);
          return (
            <pre
              key={lineIdx}
              className="p-2.5 rounded-xl bg-[#070707] border border-white/10 font-mono text-xs text-amber-200/90 overflow-x-auto whitespace-pre-wrap my-1.5 shadow-inner"
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInlineTokens(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline token parser for custom emojis, user mentions, bold, italic, code, links
function renderInlineTokens(line: string): React.ReactNode {
  // Regex to match:
  // 1. Custom animated emoji: <a:name:id>
  // 2. Custom static emoji: <:name:id>
  // 3. User mention: @DisplayName or <@id> or <@!id>
  // 4. Role mention: <@&id>
  // 5. Channel mention: <#id>
  // 6. Bold: **text**
  // 7. Italic: *text* or _text_
  // 8. Strikethrough: ~~text~~
  // 9. Inline code: `text`
  // 10. Discord timestamp: <t:1234567:R>
  // 11. Links: http...
  const pattern = /(<a?:[a-zA-Z0-9_~]+:[0-9]+>|<t:[0-9]+(?::[a-zA-Z])?>|<@&?[0-9]+>|<#[0-9]+>|@[a-zA-Z0-9_—͟͞★么𝕻𝖎𝖞𝖚𝖘𝖍〆\s]+?(?=\s|$)|(?:\*\*[^*]+\*\*)|(?:\*[^*]+\*)|(?:__[^_]+__)|(?:~~[^~]+~~)|(?:`[^`]+`)|(?:https?:\/\/[^\s]+))/g;

  const parts = line.split(pattern);
  if (parts.length <= 1) return line;

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. Custom Discord Emoji: <:name:id> or <a:name:id>
    const emojiMatch = part.match(/^<(a)?:([a-zA-Z0-9_~]+):([0-9]+)>$/);
    if (emojiMatch) {
      const isAnimated = Boolean(emojiMatch[1]);
      const name = emojiMatch[2];
      const id = emojiMatch[3];
      const ext = isAnimated ? 'gif' : 'webp';
      const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=48&quality=lossless`;

      return (
        <img
          key={idx}
          src={url}
          alt={`:${name}:`}
          title={`:${name}:`}
          loading="lazy"
          className="inline-block w-5 h-5 mx-0.5 align-middle object-contain hover:scale-125 transition-transform"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.endsWith('.png')) {
              target.src = `https://cdn.discordapp.com/emojis/${id}.png?size=48`;
            }
          }}
        />
      );
    }

    // 2. Discord Relative Timestamp: <t:1795408850:R>
    if (part.startsWith('<t:') && part.endsWith('>')) {
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.06] text-[#A1A1A1] text-[11px] font-mono mx-0.5"
        >
          {formatDiscordTimestamp(part)}
        </span>
      );
    }

    // 3. User Mention: <@123> or @Name
    if (part.startsWith('<@') && part.endsWith('>')) {
      const userId = part.replace(/[<@!>]/g, '');
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded bg-[#FF6A00]/20 text-[#FF8C32] font-semibold text-xs border border-[#FF6A00]/40 shadow-[0_0_8px_rgba(255,106,0,0.2)]"
        >
          @{userId.slice(0, 6)}...
        </span>
      );
    }

    if (part.startsWith('@') && part.length > 1) {
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded bg-[#FF6A00]/20 text-[#FF8C32] font-semibold text-xs border border-[#FF6A00]/40 shadow-[0_0_8px_rgba(255,106,0,0.2)]"
        >
          {part}
        </span>
      );
    }

    // 4. Role Mention: <@&123>
    if (part.startsWith('<@&') && part.endsWith('>')) {
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/40"
        >
          @Role
        </span>
      );
    }

    // 5. Channel Mention: <#123>
    if (part.startsWith('<#') && part.endsWith('>')) {
      return (
        <span
          key={idx}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 mx-0.5 rounded bg-white/10 text-white/90 font-medium text-xs border border-white/20"
        >
          <Hash className="w-3 h-3 text-[#FF6A00] inline" />
          channel
        </span>
      );
    }

    // 6. Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-white">
          {renderInlineTokens(part.slice(2, -2))}
        </strong>
      );
    }

    // 7. Underline: __text__
    if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
      return (
        <u key={idx} className="underline decoration-[#FF6A00]/60 underline-offset-2">
          {renderInlineTokens(part.slice(2, -2))}
        </u>
      );
    }

    // 8. Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={idx} className="line-through text-white/50">
          {renderInlineTokens(part.slice(2, -2))}
        </del>
      );
    }

    // 9. Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={idx} className="italic text-white/90">
          {renderInlineTokens(part.slice(1, -1))}
        </em>
      );
    }

    // 10. Inline code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#0a0a0a] text-amber-300 font-mono text-xs border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 11. Links (Tenor or normal web URLs)
    if (part.startsWith('http://') || part.startsWith('https://')) {
      // If it's a Tenor URL, we handle media display below, but make it clickable
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF8C32] hover:text-[#FF6A00] underline underline-offset-2 break-all inline-flex items-center gap-1 mx-0.5 text-xs font-mono"
        >
          <span>{part.length > 45 ? `${part.slice(0, 42)}...` : part}</span>
          <ExternalLink className="w-2.5 h-2.5 inline" />
        </a>
      );
    }

    return part;
  });
}

export default function DiscordMessageContent({
  content,
  embeds,
  mediaVideo,
  mediaGif,
  stickers,
  attachment,
}: DiscordMessageContentProps) {
  return (
    <div className="space-y-2.5">
      {/* 1. Main Text Content with custom emojis & markdown */}
      {content && content.trim().length > 0 && (
        <div className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans break-words">
          {renderFormattedText(content)}
        </div>
      )}

      {/* 2. Discord Rich Embeds (Wick, Vantex, Bot notifications) */}
      {embeds && embeds.length > 0 && (
        <div className="space-y-2 mt-2">
          {embeds.map((emb, embIdx) => {
            const railColor = emb.color || '#FF6A00';

            return (
              <div
                key={embIdx}
                className="rounded-2xl bg-[#090909]/90 border border-white/10 p-3 sm:p-4 text-left max-w-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-md"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: railColor,
                }}
              >
                {/* Author Info */}
                {emb.author && (
                  <div className="flex items-center gap-2 mb-1.5">
                    {emb.author.icon_url && (
                      <img
                        src={emb.author.icon_url}
                        alt={emb.author.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs font-bold text-white/90">{emb.author.name}</span>
                  </div>
                )}

                {/* Title */}
                {emb.title && (
                  <div className="text-sm font-bold text-white mb-1">
                    {emb.url ? (
                      <a
                        href={emb.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF8C32] hover:underline"
                      >
                        {emb.title}
                      </a>
                    ) : (
                      emb.title
                    )}
                  </div>
                )}

                {/* Description */}
                {emb.description && (
                  <div className="text-xs sm:text-sm text-white/80 leading-relaxed mb-2 break-words">
                    {renderFormattedText(emb.description)}
                  </div>
                )}

                {/* Fields Grid */}
                {emb.fields && emb.fields.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/[0.06]">
                    {emb.fields.map((f, fIdx) => (
                      <div key={fIdx} className={f.inline ? '' : 'sm:col-span-2'}>
                        <div className="text-[10px] uppercase font-bold text-[#A1A1A1] tracking-wider">
                          {f.name}
                        </div>
                        <div className="text-xs text-white/90 mt-0.5 break-words">
                          {renderFormattedText(f.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Embed Image */}
                {emb.image?.url && (
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 max-h-72">
                    <img
                      src={emb.image.url}
                      alt="Embed content"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Footer */}
                {emb.footer?.text && (
                  <div className="mt-2.5 pt-1.5 border-t border-white/[0.06] text-[10px] text-[#A1A1A1] flex items-center gap-1.5">
                    {emb.footer.icon_url && (
                      <img
                        src={emb.footer.icon_url}
                        alt="footer icon"
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                    )}
                    <span>{emb.footer.text}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Tenor Video / MP4 loop (Rulezz munna bhaiya gif, etc.) */}
      {mediaVideo && (
        <div className="mt-2 max-w-md rounded-2xl overflow-hidden border border-[#FF6A00]/40 shadow-[0_0_20px_rgba(255,106,0,0.2)] bg-black">
          <video
            src={mediaVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-h-80 object-cover"
          />
          <div className="px-3 py-1 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between text-[10px] text-[#A1A1A1]">
            <span className="flex items-center gap-1 font-mono text-[#FF8C32]">
              <Film className="w-3 h-3" /> Tenor Animated Media
            </span>
            <span className="text-emerald-400 font-bold">Auto-Loop</span>
          </div>
        </div>
      )}

      {/* 4. Tenor Image / GIF fallback */}
      {!mediaVideo && mediaGif && (
        <div className="mt-2 max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
          <img
            src={mediaGif}
            alt="Animated GIF"
            loading="lazy"
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      {/* 5. Attachments (Images, Videos, Files) */}
      {attachment?.url && (
        <div className="mt-2 max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#0c0c0c]">
          {attachment.type === 'video' ? (
            <video
              src={attachment.url}
              controls
              className="w-full max-h-80 object-cover"
            />
          ) : attachment.type === 'image' ? (
            <img
              src={attachment.url}
              alt={attachment.title || 'Attachment'}
              loading="lazy"
              className="w-full max-h-80 object-cover hover:scale-[1.02] transition-transform cursor-pointer"
            />
          ) : (
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs text-white truncate">{attachment.title || 'Attached File'}</span>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FF8C32] hover:text-[#FF6A00] flex items-center gap-1"
              >
                <span>Download</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* 6. Stickers */}
      {stickers && stickers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {stickers.map((stk) => (
            <div key={stk.id} className="p-2 rounded-2xl bg-white/[0.04] border border-white/10">
              <img
                src={stk.url}
                alt={stk.name}
                title={stk.name}
                loading="lazy"
                className="w-24 h-24 object-contain hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
