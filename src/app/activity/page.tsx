import type { Metadata } from 'next';
import BackgroundGlow from '@/components/BackgroundGlow';
import Navbar from '@/components/Navbar';
import ServerActivity from '@/components/ServerActivity';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Community Activity & Telemetry • SANAM Discord',
  description: 'Live voice room radar, active games and music, and community pulse telemetry.',
};

export default function ActivityPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden pt-24">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ServerActivity />
      </div>

      <JoinSection />
      <Footer />
    </main>
  );
}
