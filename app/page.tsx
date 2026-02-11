"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ServicesSection } from "@/components/services-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
