"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutContent } from "@/components/about-content";
import { CtaSection } from "@/components/cta-section";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <AboutContent />
      </div>
      <CtaSection />
      <Footer />
    </main>
  );
}
