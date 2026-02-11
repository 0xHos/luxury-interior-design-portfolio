"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { ArrowRight, MapPin, Calendar, Maximize, Tag } from "lucide-react";
import useSWR from "swr";
import type { Project } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProjectDetail() {
  const params = useParams();
  const { t, locale, dir } = useLocale();
  const { data } = useSWR<{ project: Project; related: Project[] }>(
    params.id ? `/api/projects/${params.id}` : null,
    fetcher
  );

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const { project, related } = data;
  const images: string[] = JSON.parse(project.images);

  const infoItems = [
    {
      icon: <Tag className="h-4 w-4" />,
      label: t.project_detail.category,
      value: project.category,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: t.project_detail.location,
      value: project.location,
    },
    {
      icon: <Maximize className="h-4 w-4" />,
      label: t.project_detail.size,
      value: project.size,
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: t.project_detail.year,
      value: String(project.year),
    },
  ];

  return (
    <section dir={dir}>
      {/* Hero Image */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <Image
          src={images[0] || "/images/projects/project1.jpg"}
          alt={locale === "ar" ? project.title_ar : project.title_en}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {project.category}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-background md:text-6xl text-balance">
              {locale === "ar" ? project.title_ar : project.title_en}
            </h1>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {locale === "ar"
                ? project.description_ar
                : project.description_en}
            </p>
          </div>

          {/* Info Sidebar */}
          <div className="border border-border p-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
              {"Project Details"}
            </h3>
            <div className="mt-6 flex flex-col gap-5">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="text-accent">{item.icon}</div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-8 flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
            >
              {t.project_detail.cta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* Related Projects */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {t.project_detail.related}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/projects/${rp.id}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={
                        JSON.parse(rp.images)[0] ||
                        "/images/projects/project1.jpg"
                       || "/placeholder.svg"}
                      alt={locale === "ar" ? rp.title_ar : rp.title_en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {rp.category}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
                      {locale === "ar" ? rp.title_ar : rp.title_en}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
