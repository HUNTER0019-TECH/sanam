export interface DiscordEmbedItem {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
    width?: number;
    height?: number;
  };
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  video?: {
    url: string;
    width?: number;
    height?: number;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

export interface ChannelMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
    roleColor: string;
    bot?: boolean;
    badge?: string;
  };
  content: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'audio' | 'embed' | 'video';
    url?: string;
    title?: string;
    description?: string;
  };
  embeds?: DiscordEmbedItem[];
  stickers?: {
    id: string;
    name: string;
    url: string;
  }[];
  mediaVideo?: string;
  mediaGif?: string;
  reactions?: { emoji: string; id?: string; count: number }[];
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar: string;
  speaking: boolean;
  muted?: boolean;
  deafened?: boolean;
  mute?: boolean;
  deaf?: boolean;
  activity?: string;
  bot?: boolean;
  status?: string;
}

export interface ChannelItem {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'voice' | 'announcement';
  position?: number;
  unread?: boolean;
  description?: string;
  participants?: VoiceParticipant[];
  messages?: ChannelMessage[];
}

export interface StaffMember {
  id: string;
  name: string;
  discordTag: string;
  role: 'OWNER' | 'CO_OWNER' | 'GIRLS_OWNER' | 'MANAGER' | 'ADMIN' | 'MODERATOR' | 'STAFF' | 'SUPPORT';
  roleColor: string;
  roleDescription: string;
  avatar: string;
  banner?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  joinedDate: string;
  badges: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlightTag?: string;
  stats?: string;
}

export interface ServerStats {
  totalMembers: number;
  onlineMembers: number;
  voiceActiveMembers: number;
  boostLevel: number;
  boostCount: number;
  rolesCount: number;
  channelsCount: number;
  messagesToday: number;
}
