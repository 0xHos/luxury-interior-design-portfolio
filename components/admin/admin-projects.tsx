"use client";

import React from "react"

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import useSWR, { mutate } from "swr";
import type { Project } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const emptyForm = {
  id: 0,
  category: "residential",
  location: "",
  size: "",
  year: new Date().getFullYear(),
  images: [] as string[],
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  featured: false,
};

export function AdminProjects() {
  const { locale } = useLocale();
  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = projects?.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.title_en.toLowerCase().includes(query) ||
      p.title_ar.includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  function openCreate() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
  }

  function openEdit(project: Project) {
    setForm({
      id: project.id,
      category: project.category,
      location: project.location,
      size: project.size,
      year: project.year,
      images: JSON.parse(project.images),
      title_en: project.title_en,
      title_ar: project.title_ar,
      description_en: project.description_en,
      description_ar: project.description_ar,
      featured: project.featured === 1,
    });
    setEditing(true);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = "/api/admin/projects";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    mutate("/api/projects");
    mutate("/api/stats");
    setShowForm(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    mutate("/api/projects");
    mutate("/api/stats");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {"Projects"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Manage your portfolio projects"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          {"Add Project"}
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-background py-2.5 pe-4 ps-10 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {"Title"}
              </th>
              <th className="px-4 py-3 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                {"Category"}
              </th>
              <th className="px-4 py-3 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                {"Location"}
              </th>
              <th className="px-4 py-3 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                {"Year"}
              </th>
              <th className="px-4 py-3 text-end text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {"Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((project) => (
              <tr
                key={project.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {locale === "ar" ? project.title_ar : project.title_en}
                  {project.featured === 1 && (
                    <span className="ms-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      {"Featured"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize hidden sm:table-cell">
                  {project.category}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {project.location}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {project.year}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Edit project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-background p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {editing ? "Edit Project" : "New Project"}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Category"}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  >
                    <option value="residential">{"Residential"}</option>
                    <option value="commercial">{"Commercial"}</option>
                    <option value="hospitality">{"Hospitality"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Location"}
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Size"}
                  </label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) =>
                      setForm({ ...form, size: e.target.value })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {"Year"}
                  </label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: Number(e.target.value) })
                    }
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="accent-accent"
                    />
                    {"Featured"}
                  </label>
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
                {editing ? "Update Project" : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
