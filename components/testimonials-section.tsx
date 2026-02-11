"use client";

import { useLocale } from "@/lib/locale-context";
import { Star, Quote } from "lucide-react";
import useSWR from "swr";
import type { Testimonial } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TestimonialsSection() {
  const { t, locale, dir } = useLocale();
  const { data: testimonials } = useSWR<Testimonial[]>(
    "/api/testimonials",
    fetcher
  );

  return (
    <section className="py-24 md:py-32" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {"Testimonials"}
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            {t.testimonials.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials?.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative border border-border p-8 md:p-10"
            >
              <Quote className="absolute top-6 opacity-5 h-16 w-16 text-foreground ltr:right-6 rtl:left-6" />
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground italic">
                {locale === "ar"
                  ? testimonial.review_ar
                  : testimonial.review_en}
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <p className="font-serif text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
