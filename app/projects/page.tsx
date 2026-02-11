"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectsGrid } from "@/components/projects-grid";
import { CtaSection } from "@/components/cta-section";

export default function ProjectsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <ProjectsGrid />
      </div>
      <CtaSection />
      <Footer />
    </main>
  );
}
