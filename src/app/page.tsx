import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Regulasi from "@/components/landing/Regulasi";
import { CTA, Footer } from "@/components/landing/CtaFooter";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Regulasi />
      <CTA />
      <Footer />
    </main>
  );
}
