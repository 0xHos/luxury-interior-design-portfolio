import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, review_en, review_ar, rating } = body;

  if (!name || !review_en || !review_ar) {
    return NextResponse.json({ error: "Name and reviews are required" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO testimonials (name, review_en, review_ar, rating) VALUES (?, ?, ?, ?)"
    )
    .run(name, review_en, review_ar, rating || 5);

  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, review_en, review_ar, rating } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    "UPDATE testimonials SET name=?, review_en=?, review_ar=?, rating=? WHERE id=?"
  ).run(name, review_en, review_ar, rating, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(Number(id));
  return NextResponse.json({ success: true });
}
