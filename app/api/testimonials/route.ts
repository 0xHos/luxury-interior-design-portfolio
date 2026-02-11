import { NextResponse } from "next/server";
import { getDb, type Testimonial } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const testimonials = db
    .prepare("SELECT * FROM testimonials ORDER BY id")
    .all() as Testimonial[];
  return NextResponse.json(testimonials);
}
