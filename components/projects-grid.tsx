"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import useSWR from "swr";
import type { Project } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const categories = ["all", "residential", "commercial", "hospitality"] as const;

export function ProjectsGrid() {
  const { t, locale, dir } = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: projects } = useSWR<Project[]>(
    activeCategory === "all"
      ? "/api/projects"
      : `/api/projects?category=${activeCategory}`,
    fetcher
  );

  const categoryLabels: Record<string, string> = {
    all: t.projects_page.all,
    residential: t.projects_page.residential,
    commercial: t.projects_page.commercial,
    hospitality: t.projects_page.hospitality,
  };

  return (
    <section className="py-16 md:py-24" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {"Portfolio"}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            {t.projects_page.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            {t.projects_page.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={
                    JSON.parse(project.images)[0] ||
                    "/images/projects/project1.jpg"
                   || "/placeholder.svg"}
                  alt={locale === "ar" ? project.title_ar : project.title_en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/20" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {project.category}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
                  {locale === "ar" ? project.title_ar : project.title_en}
                </h3>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.year}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {"View Project"}
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
