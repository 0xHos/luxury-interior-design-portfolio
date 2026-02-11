"use client";

import React from "react"

import { useLocale } from "@/lib/locale-context";
import { Palette, Building2, Lightbulb } from "lucide-react";
import useSWR from "swr";
import type { Service } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="h-8 w-8" />,
  Building2: <Building2 className="h-8 w-8" />,
  Lightbulb: <Lightbulb className="h-8 w-8" />,
};

export function ServicesSection() {
  const { t, locale, dir } = useLocale();
  const { data: services } = useSWR<Service[]>("/api/services", fetcher);

  return (
    <section className="py-24 md:py-32" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {"What We Do"}
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            {t.services.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services?.map((service) => (
            <div
              key={service.id}
              className="group border border-border p-8 transition-all hover:border-accent hover:bg-secondary/50 md:p-10"
            >
              <div className="text-accent">
                {iconMap[service.icon] || <Palette className="h-8 w-8" />}
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                {locale === "ar" ? service.title_ar : service.title_en}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {locale === "ar"
                  ? service.description_ar
                  : service.description_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
