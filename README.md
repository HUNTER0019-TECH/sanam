# SANAM • Ultra-Premium Discord Community Website

An Apple-inspired **Black & Orange Liquid Glass / Glassmorphism** website created for Discord server **SANAM**.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP & ScrollTrigger**, **Framer Motion**, and **Lucide Icons**.

---

## 🎨 Color Palette & Aesthetic

| Token | Color Code | Description |
|---|---|---|
| **Main Background** | `#080808` | Deep obsidian black background |
| **Secondary Background** | `#111111` | Subtle container dark contrast |
| **Glass Cards** | `rgba(255, 255, 255, 0.04)` | Ultra-frosted glass cards with `backdrop-blur-2xl` |
| **Glass Borders** | `rgba(255, 255, 255, 0.10)` | Crisp specular glass edge highlights |
| **Primary Accent** | `#FF6A00` | Vibrant molten orange |
| **Secondary Accent** | `#FF8C32` | Soft radiant amber orange |
| **Text** | `#FFFFFF` | Crisp high-contrast typography |
| **Secondary Text** | `#A1A1A1` | Subdued muted labels and descriptions |

---

## ⚡ Key Features

1. **Liquid Glass Hero Section**:
   - Animated black background with subtle orange particles canvas (`BackgroundGlow.tsx`).
   - Specular glowing headline: `"WELCOME TO SANAM"`.
   - Subtitle: `"A Place Where Vibes Become Memories."`
   - Glowing orange **JOIN SANAM SERVER** button with amber confetti burst on click.
   - Live Server Statistics (Total Members: 14,820+, Online: 3,412, Active in VCs: 184).
   - Floating liquid glass preview cards with GSAP floating physics.

2. **Live Discord Dashboard**:
   - Mac-style glass window frame with orange status dots.
   - Text Channels:
     - **INFORMATION**: `#welcome`, `#rules`, `#announcements`, `#roles`
     - **COMMUNITY**: `#general`, `#media`, `#memes`, `#confessions`
   - Voice Channels:
     - `General VC`, `Chill Room`, `Gaming Room`, `Music Room`
   - Real-time animated audio visualizer waves (orange equalizer bars).
   - Dynamic Voice Lounge Stage with participant avatars, speaking green/orange pulses, mute/deafen status.
   - Interactive chat simulator where users can type and send test messages with instant feedback!

3. **Community Activity & Pulse Radar**:
   - Live Voice Room cards with member counts and hop-in CTAs.
   - Active Games & Music tracker (Valorant scrims, Minecraft SMP, Spotify synced jam).
   - Activity Telemetry (28,540 daily messages, Level 3 Nitro boost tier, 9:00 PM peak IST hour, 99.98% uptime).

4. **8 Premium Feature Cards**:
   - Friendly Community, Voice Hangouts (384kbps HD), Gaming, Music (24/7 Lossless), Events, Giveaways, Memes, and Community Vibes.
   - GSAP ScrollTrigger staggered entrance with orange rim-light reflections.

5. **Staff Team Hierarchy**:
   - **OWNER**: Prominent spotlight card with Crown badge, founder story, custom status, and glowing orange border.
   - **MANAGER**, **ADMIN**, **MODERATOR**, **STAFF**, and **SUPPORT** in hierarchy order.
   - One-click copy for `@discord` username tags with copied tooltip feedback.

6. **Web Audio Sound Effects**:
   - Synthesized Discord-like haptic bleeps on channel clicks and join buttons using the Web Audio API (zero bulky mp3 downloads). Includes an instant mute/unmute toggle in the navbar.

7. **Join Community Section**:
   - `"FIND YOUR PEOPLE. FIND YOUR VIBE."` with high-glow call-to-action and trust badges.

---

## ⚙️ Configuration

All configuration values (Discord invite link, Server ID, staff members, channels, and social links) are centralized and easily editable in:

📁 `src/config/discord.ts`

### Connecting Live Discord Widget API:
If you want to pull live Discord server members directly from Discord:
1. In your Discord Server: Go to **Server Settings > Widget** and enable **"Enable Server Widget"**.
2. Copy your **Server ID**.
3. Open `src/config/discord.ts`:
   ```ts
   export const DISCORD_CONFIG = {
     serverName: 'SANAM',
     guildId: 'YOUR_ACTUAL_DISCORD_SERVER_ID',
     useLiveDiscordWidget: true, // set to true
     inviteUrl: 'https://discord.gg/your_invite_code',
     ...
   };
   ```

---

## 🚀 Deployment Guide (Vercel & GitHub)

### 1. Push to GitHub
```bash
git remote add origin https://github.com/HUNTER0019-TECH/sanam.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import the repository `HUNTER0019-TECH/sanam`.
2. Under **Environment Variables**, add:
   - `DISCORD_GUILD_ID` = `1456936572057423884`
   - `DISCORD_BOT_TOKEN` = `(Your Discord Bot Token from Discord Developer Portal)`
3. Click **Deploy**. Vercel will automatically build and assign a global HTTPS production domain!

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/HUNTER0019-TECH/sanam.git
cd sanam

# Install dependencies
npm install

# Start local dev server (port 3005)
npm run dev

# Build for production
npm run build
npm start
```
