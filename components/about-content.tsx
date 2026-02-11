"use client";

import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { Target, Eye, BookOpen } from "lucide-react";

const stats = [
  { value: "150+", keyEn: "projects" },
  { value: "12+", keyEn: "years" },
  { value: "200+", keyEn: "clients" },
  { value: "15", keyEn: "awards" },
];

export function AboutContent() {
  const { t, dir } = useLocale();

  const statLabels: Record<string, string> = {
    projects: t.about.stats.projects,
    years: t.about.stats.years,
    clients: t.about.stats.clients,
    awards: t.about.stats.awards,
  };

  return (
    <section dir={dir}>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/about.jpg"
          alt="Our design studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {"About Us"}
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold text-background md:text-6xl text-balance">
              {t.about.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-accent">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.about.story_title}
              </span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t.about.story}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.keyEn}
                className="border border-border p-6 text-center"
              >
                <p className="font-serif text-3xl font-bold text-accent md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {statLabels[stat.keyEn]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-24 grid gap-8 md:grid-cols-2">
          <div className="border border-border p-8 md:p-10">
            <div className="flex items-center gap-3 text-accent">
              <Target className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.about.mission_title}
              </span>
            </div>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t.about.mission}
            </p>
          </div>
          <div className="border border-border p-8 md:p-10">
            <div className="flex items-center gap-3 text-accent">
              <Eye className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t.about.vision_title}
              </span>
            </div>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t.about.vision}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
