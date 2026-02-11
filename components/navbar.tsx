"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";

export function Navbar() {
  const { t, locale, setLocale, dir } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      dir={dir}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-foreground"
        >
          {"LUXE"}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground uppercase"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link
            href="/contact"
            className="rounded-none bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            {t.hero.cta_consult}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden" dir={dir}>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setLocale(locale === "en" ? "ar" : "en");
                setMobileOpen(false);
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Globe className="h-4 w-4" />
              {locale === "en" ? "العربية" : "English"}
            </button>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block bg-foreground px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest text-background"
            >
              {t.hero.cta_consult}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
