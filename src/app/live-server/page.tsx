import type { Metadata } from 'next';
import BackgroundGlow from '@/components/BackgroundGlow';
import Navbar from '@/components/Navbar';
import DiscordDashboard from '@/components/DiscordDashboard';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Live Server • SANAM Discord Dashboard',
  description: 'Interactive Discord server dashboard with real-time text and voice channel explorer for SANAM.',
};

export default function LiveServerPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden pt-24">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DiscordDashboard />
      </div>

      <JoinSection />
      <Footer />
    </main>
  );
}
