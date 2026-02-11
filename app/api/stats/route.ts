import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const projects = (db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number }).count;
  const services = (db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number }).count;
  const testimonials = (db.prepare("SELECT COUNT(*) as count FROM testimonials").get() as { count: number }).count;
  const contacts = (db.prepare("SELECT COUNT(*) as count FROM contacts").get() as { count: number }).count;
  const unreadContacts = (db.prepare("SELECT COUNT(*) as count FROM contacts WHERE read = 0").get() as { count: number }).count;

  return NextResponse.json({ projects, services, testimonials, contacts, unreadContacts });
}
