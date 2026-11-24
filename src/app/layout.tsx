import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SitePreloader from "@/components/SitePreloader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://discord.gg/sanam'),
  title: {
    default: "SANAM™ • Official Discord Community",
    template: "%s | SANAM™ Discord",
  },
  description:
    "Welcome to SANAM™ — an ultra-premium Discord sanctuary. Voice hangouts, daily gaming lobbies, 24/7 music, giveaways, and authentic vibes.",
  keywords: [
    "SANAM Discord",
    "Discord Server",
    "SANAM Community",
    "Gaming Discord",
    "Music Lounge",
    "Voice Hangout",
    "discord.gg/sanam",
  ],
  authors: [{ name: "SANAM Team" }],
  icons: {
    icon: [
      { url: "/sanam-logo.gif", type: "image/gif" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/sanam-logo.gif",
  },
  openGraph: {
    title: "SANAM™ • Official Discord Community",
    description:
      "Join SANAM™ and become part of a community built around vibes, friendships and unforgettable moments.",
    url: "https://discord.gg/sanam",
    siteName: "SANAM™ Community",
    images: [
      {
        url: "/sanam-logo.png",
        width: 1200,
        height: 630,
        alt: "SANAM Community Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANAM™ • Official Discord Community",
    description:
      "Welcome to SANAM™ — Voice lounges, gaming, and pure vibes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
    >
      <head>
        <link rel="icon" type="image/gif" href="/sanam-logo.gif" />
        <link rel="icon" type="image/png" sizes="192x192" href="/sanam-logo.png" />
        <link rel="apple-touch-icon" href="/sanam-logo.png" />
      </head>
      <body className="bg-[#080808] text-white min-h-screen antialiased selection:bg-[#FF6A00] selection:text-[#080808]">
        <SitePreloader />
        {children}
      </body>
    </html>
  );
}
