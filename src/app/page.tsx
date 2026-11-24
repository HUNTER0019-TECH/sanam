import BackgroundGlow from "@/components/BackgroundGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutServer from "@/components/AboutServer";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Dynamic Liquid Orange Particle Mesh & Ambient Glow */}
      <BackgroundGlow />

      {/* Glassmorphic Sticky Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About SANAM Server & Community Story */}
      <AboutServer />

      {/* Join Community CTA Banner */}
      <JoinSection />

      {/* Black Glass Footer */}
      <Footer />
    </main>
  );
}
