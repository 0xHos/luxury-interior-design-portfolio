"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectDetail } from "@/components/project-detail";
import { CtaSection } from "@/components/cta-section";

export default function ProjectDetailPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <ProjectDetail />
      </div>
      <CtaSection />
      <Footer />
    </main>
  );
}
