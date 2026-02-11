import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { icon, title_en, title_ar, description_en, description_ar } = body;

  if (!title_en || !title_ar) {
    return NextResponse.json({ error: "Titles are required" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO services (icon, title_en, title_ar, description_en, description_ar) VALUES (?, ?, ?, ?, ?)"
    )
    .run(icon || "Palette", title_en, title_ar, description_en || "", description_ar || "");

  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, icon, title_en, title_ar, description_en, description_ar } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    "UPDATE services SET icon=?, title_en=?, title_ar=?, description_en=?, description_ar=? WHERE id=?"
  ).run(icon, title_en, title_ar, description_en, description_ar, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM services WHERE id = ?").run(Number(id));
  return NextResponse.json({ success: true });
}
