"use client";

import React from "react"

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { Send, MessageCircle, Phone, MapPin, Mail, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const { t, dir } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: t.contact.phone,
      value: "+971 4 123 4567",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: t.contact.email,
      value: "info@luxeinteriors.com",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t.contact.address,
      value: "Dubai Design District, Dubai, UAE",
    },
  ];

  return (
    <section className="py-16 md:py-24" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {"Contact"}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            {t.contact.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {t.contact.name}
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="mt-2 w-full resize-none border border-border bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>

              {status === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {t.contact.success}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {t.contact.error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {status === "loading" ? "..." : t.contact.submit}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="border border-border p-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                {"Get in Touch"}
              </h3>
              <div className="mt-6 flex flex-col gap-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <div className="mt-0.5 text-accent">{info.icon}</div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/97141234567"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
              >
                <MessageCircle className="h-4 w-4" />
                {t.contact.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
