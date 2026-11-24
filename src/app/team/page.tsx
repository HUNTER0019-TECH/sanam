import type { Metadata } from 'next';
import BackgroundGlow from '@/components/BackgroundGlow';
import Navbar from '@/components/Navbar';
import TeamSection from '@/components/TeamSection';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Staff Hierarchy & Team • SANAM Discord',
  description: 'Meet the SANAM staff team, founder, managers, moderators and support squad.',
};

export default function TeamPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden pt-24">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TeamSection />
      </div>

      <JoinSection />
      <Footer />
    </main>
  );
}
