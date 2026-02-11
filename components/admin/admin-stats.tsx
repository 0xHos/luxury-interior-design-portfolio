"use client";

import { FolderOpen, Wrench, Star, MessageSquare } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Stats {
  projects: number;
  services: number;
  testimonials: number;
  contacts: number;
  unreadContacts: number;
}

export function AdminStats() {
  const { data: stats } = useSWR<Stats>("/api/stats", fetcher);

  const cards = [
    {
      label: "Total Projects",
      value: stats?.projects ?? 0,
      icon: FolderOpen,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Services",
      value: stats?.services ?? 0,
      icon: Wrench,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials ?? 0,
      icon: Star,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Messages",
      value: stats?.contacts ?? 0,
      icon: MessageSquare,
      color: "text-accent",
      bg: "bg-accent/10",
      badge: stats?.unreadContacts
        ? `${stats.unreadContacts} unread`
        : undefined,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        {"Dashboard Overview"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {"Welcome back. Here is your portfolio summary."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="border border-border bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-md p-2 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                {card.badge && (
                  <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="mt-4 font-serif text-3xl font-bold text-foreground">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
