"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminProjects } from "@/components/admin/admin-projects";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminContacts } from "@/components/admin/admin-contacts";
import { Globe, Menu, X } from "lucide-react";

type Section = "stats" | "projects" | "services" | "testimonials" | "contacts";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { locale, setLocale, dir } = useLocale();

  return (
    <div className="flex min-h-screen bg-secondary/30" dir={dir}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 w-64 transform transition-transform duration-300 lg:static lg:transform-none ${
          sidebarOpen
            ? "ltr:translate-x-0 rtl:translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full lg:ltr:translate-x-0 lg:rtl:translate-x-0"
        }`}
      >
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={(s) => {
            setActiveSection(s as Section);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <button
            type="button"
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <div className="hidden lg:block" />
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "AR" : "EN"}
          </button>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeSection === "stats" && <AdminStats />}
          {activeSection === "projects" && <AdminProjects />}
          {activeSection === "services" && <AdminServices />}
          {activeSection === "testimonials" && <AdminTestimonials />}
          {activeSection === "contacts" && <AdminContacts />}
        </div>
      </div>
    </div>
  );
}
