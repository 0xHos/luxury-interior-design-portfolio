"use client";

import React from "react"

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import useSWR, { mutate } from "swr";
import type { Service } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const emptyForm = {
  id: 0,
  icon: "Palette",
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
};

export function AdminServices() {
  const { locale } = useLocale();
  const { data: services } = useSWR<Service[]>("/api/services", fetcher);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setForm({
      id: service.id,
      icon: service.icon,
      title_en: service.title_en,
      title_ar: service.title_ar,
      description_en: service.description_en,
      description_ar: service.description_ar,
    });
    setEditing(true);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/admin/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    mutate("/api/services");
    mutate("/api/stats");
    setShowForm(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    mutate("/api/services");
    mutate("/api/stats");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {"Services"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Manage your service offerings"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          {"Add Service"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <div
            key={service.id}
            className="border border-border bg-background p-6"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                {service.icon}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Edit service"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete service"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
              {locale === "ar" ? service.title_ar : service.title_en}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {locale === "ar"
                ? service.description_ar
                : service.description_en}
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
                {editing ? "Edit Service" : "New Service"}
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
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {"Icon Name"}
                </label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                >
                  <option value="Palette">{"Palette"}</option>
                  <option value="Building2">{"Building2"}</option>
                  <option value="Lightbulb">{"Lightbulb"}</option>
                  <option value="Home">{"Home"}</option>
                  <option value="Sofa">{"Sofa"}</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Title (English)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title_en}
                    onChange={(e) =>
                      setForm({ ...form, title_en: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.title_ar}
                    onChange={(e) =>
                      setForm({ ...form, title_ar: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {"Description (English)"}
                </label>
                <textarea
                  rows={3}
                  value={form.description_en}
                  onChange={(e) =>
                    setForm({ ...form, description_en: e.target.value })
                  }
                  className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {"Description (Arabic)"}
                </label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={form.description_ar}
                  onChange={(e) =>
                    setForm({ ...form, description_ar: e.target.value })
                  }
                  className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="mt-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                {editing ? "Update Service" : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
