import type { Metadata } from 'next';
import BackgroundGlow from '@/components/BackgroundGlow';
import Navbar from '@/components/Navbar';
import Features from '@/components/Features';
import JoinSection from '@/components/JoinSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Server Features • SANAM Discord',
  description: 'Explore the 8 bespoke features and community perks in SANAM.',
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden pt-24">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Features />
      </div>

      <JoinSection />
      <Footer />
    </main>
  );
}
