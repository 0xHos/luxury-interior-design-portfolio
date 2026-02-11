"use client";

import Link from "next/link";
import {
  BarChart3,
  FolderOpen,
  Wrench,
  Star,
  MessageSquare,
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { key: "stats", icon: BarChart3, label: "Dashboard" },
  { key: "projects", icon: FolderOpen, label: "Projects" },
  { key: "services", icon: Wrench, label: "Services" },
  { key: "testimonials", icon: Star, label: "Testimonials" },
  { key: "contacts", icon: MessageSquare, label: "Messages" },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  return (
    <aside className="flex h-full flex-col border-e border-border bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <Link href="/" className="font-serif text-xl font-bold text-foreground">
          {"LUXE"}
          <span className="text-accent">.</span>
        </Link>
        <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
          {"Admin"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onSectionChange(section.key)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <Link
          href="/"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {"Back to Website"}
        </Link>
      </div>
    </aside>
  );
}
