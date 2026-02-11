"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
}
