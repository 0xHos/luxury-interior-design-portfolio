"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { ArrowRight } from "lucide-react";
import useSWR from "swr";
import type { Project } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function FeaturedProjects() {
  const { t, locale, dir } = useLocale();
  const { data: projects } = useSWR<Project[]>(
    "/api/projects?featured=true",
    fetcher
  );

  return (
    <section className="bg-secondary/30 py-24 md:py-32" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {"Portfolio"}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              {t.featured.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
              {t.featured.subtitle}
            </p>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            {t.featured.view_all}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects?.slice(0, 4).map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={`group relative overflow-hidden ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  i === 0 ? "aspect-square" : "aspect-[4/5]"
                } overflow-hidden`}
              >
                <Image
                  src={JSON.parse(project.images)[0] || "/images/projects/project1.jpg"}
                  alt={locale === "ar" ? project.title_ar : project.title_en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/30" />

                {/* Overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-6 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="bg-background/90 backdrop-blur-sm p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {project.category}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
                      {locale === "ar" ? project.title_ar : project.title_en}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {project.location}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
