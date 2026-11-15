import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import InteractiveCalculator from "@/components/landing/InteractiveCalculator";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Regulasi from "@/components/landing/Regulasi";
import Roadmap from "@/components/landing/Roadmap";
import InteractiveFaq from "@/components/landing/InteractiveFaq";
import { CTA, Footer } from "@/components/landing/CtaFooter";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <InteractiveCalculator />
      <Features />
      <Pricing />
      <Regulasi />
      <Roadmap />
      <InteractiveFaq />
      <CTA />
      <Footer />
    </main>
  );
}
