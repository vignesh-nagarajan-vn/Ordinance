import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { ModernTools } from "@/components/sections/ModernTools";
import { ActionableInsights } from "@/components/sections/ActionableInsights";
import { DemoCTA } from "@/components/sections/DemoCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <ModernTools />
      <ActionableInsights />
      <DemoCTA />
      <Footer />
    </main>
  );
}
