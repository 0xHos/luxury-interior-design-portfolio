import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    category,
    location,
    size,
    year,
    images,
    title_en,
    title_ar,
    description_en,
    description_ar,
    featured,
  } = body;

  if (!title_en || !title_ar || !category) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    );
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO projects (category, location, size, year, images, title_en, title_ar, description_en, description_ar, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      category,
      location || "",
      size || "",
      year || new Date().getFullYear(),
      JSON.stringify(images || []),
      title_en,
      title_ar,
      description_en || "",
      description_ar || "",
      featured ? 1 : 0
    );

  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const {
    id,
    category,
    location,
    size,
    year,
    images,
    title_en,
    title_ar,
    description_en,
    description_ar,
    featured,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE projects SET category=?, location=?, size=?, year=?, images=?, title_en=?, title_ar=?, description_en=?, description_ar=?, featured=? WHERE id=?`
  ).run(
    category,
    location,
    size,
    year,
    JSON.stringify(images || []),
    title_en,
    title_ar,
    description_en,
    description_ar,
    featured ? 1 : 0,
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM projects WHERE id = ?").run(Number(id));
  return NextResponse.json({ success: true });
}
