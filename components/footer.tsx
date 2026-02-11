"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

export function Footer() {
  const { t, dir } = useLocale();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-foreground text-background" dir={dir}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-tight">
              {"LUXE"}
              <span className="text-accent">.</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest opacity-50">
              {t.footer.quick_links}
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest opacity-50">
              {t.footer.contact_us}
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm opacity-70">
              <p>info@luxeinteriors.com</p>
              <p>+971 4 123 4567</p>
              <p>Dubai, United Arab Emirates</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-background/10 pt-8 text-center text-xs opacity-50">
          <p>
            {"2026 LUXE Interiors. "}
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
