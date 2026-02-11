"use client";

import React from "react"

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import useSWR, { mutate } from "swr";
import type { Testimonial } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const emptyForm = {
  id: 0,
  name: "",
  review_en: "",
  review_ar: "",
  rating: 5,
};

export function AdminTestimonials() {
  const { locale } = useLocale();
  const { data: testimonials } = useSWR<Testimonial[]>(
    "/api/testimonials",
    fetcher
  );
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      id: t.id,
      name: t.name,
      review_en: t.review_en,
      review_ar: t.review_ar,
      rating: t.rating,
    });
    setEditing(true);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/admin/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    mutate("/api/testimonials");
    mutate("/api/stats");
    setShowForm(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    mutate("/api/testimonials");
    mutate("/api/stats");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {"Testimonials"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Manage client testimonials"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          {"Add Testimonial"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials?.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border border-border bg-background p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-accent text-accent"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(testimonial)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Edit testimonial"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(testimonial.id)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete testimonial"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic line-clamp-4">
              {locale === "ar"
                ? testimonial.review_ar
                : testimonial.review_en}
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-background p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {editing ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Client Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Rating"}
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {`${r} Stars`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {"Review (English)"}
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.review_en}
                  onChange={(e) =>
                    setForm({ ...form, review_en: e.target.value })
                  }
                  className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {"Review (Arabic)"}
                </label>
                <textarea
                  rows={3}
                  required
                  dir="rtl"
                  value={form.review_ar}
                  onChange={(e) =>
                    setForm({ ...form, review_ar: e.target.value })
                  }
                  className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="mt-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                {editing ? "Update Testimonial" : "Create Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
