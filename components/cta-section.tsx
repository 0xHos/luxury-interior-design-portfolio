"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const { t, dir } = useLocale();

  return (
    <section className="bg-foreground py-24 md:py-32" dir={dir}>
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-background md:text-5xl text-balance">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-background/70 leading-relaxed">
          {t.cta.subtitle}
        </p>
        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 bg-accent px-10 py-4 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
        >
          {t.cta.button}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
