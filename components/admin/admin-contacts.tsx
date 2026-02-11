"use client";

import { Mail, MailOpen, Search } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import type { Contact } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function AdminContacts() {
  const { data: contacts } = useSWR<Contact[]>("/api/contacts", fetcher);
  const [search, setSearch] = useState("");

  const filtered = contacts?.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.message.toLowerCase().includes(query)
    );
  });

  async function markAsRead(id: number) {
    await fetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate("/api/contacts");
    mutate("/api/stats");
  }

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {"Messages"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {"View and manage contact submissions"}
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-background py-2.5 pe-4 ps-10 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* Messages List */}
      <div className="mt-6 flex flex-col gap-3">
        {filtered?.map((contact) => (
          <div
            key={contact.id}
            className={`border bg-background p-5 ${
              contact.read
                ? "border-border"
                : "border-accent/50 bg-accent/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {contact.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                  )}
                  <span className="font-medium text-foreground text-sm truncate">
                    {contact.name}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {contact.email}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {contact.message}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(contact.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!contact.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(contact.id)}
                  className="flex-shrink-0 rounded bg-accent/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
                >
                  {"Mark Read"}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered?.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {"No messages found."}
          </div>
        )}
      </div>
    </div>
  );
}
