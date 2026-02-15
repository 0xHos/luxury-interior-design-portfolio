"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { t, dir } = useLocale();

  return (
    <section className="relative min-h-screen overflow-hidden" dir={dir}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury interior design"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="mb-6 inline-block border border-background/20 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-background/80">
                {"Interior Design Studio"}
              </span>
            </div>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-background md:text-7xl lg:text-8xl">
              <span className="text-balance">{t.hero.headline}</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-background/80 md:text-lg">
              {t.hero.subheadline}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="group flex items-center gap-2 bg-accent px-8 py-4 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
              >
                {t.hero.cta_projects}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-background/30 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:bg-background/10"
              >
                {t.hero.cta_consult}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-background/50">
            {"Scroll"}
          </span>
          <div className="h-12 w-px bg-background/30" />
        </div>
      </div>
    </section>
  );
}
