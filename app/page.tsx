import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/landing/Hero';
import { TyreFinderSection } from '@/components/landing/TyreFinderSection';
import { TyreVisualizer } from '@/components/landing/TyreVisualizer';
import { SocialProofBento } from '@/components/landing/SocialProofBento';
import { FeaturedCatalog } from '@/components/landing/FeaturedCatalog';
import { LineFloatingButton } from '@/components/shared/LineFloatingButton';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TyreFinderSection />
        <FeaturedCatalog />
        <TyreVisualizer />
        <SocialProofBento />
      </main>
      <Footer />
      <LineFloatingButton />
    </>
  );
}
