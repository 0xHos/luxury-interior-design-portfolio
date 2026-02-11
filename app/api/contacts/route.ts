import { NextResponse } from "next/server";
import { getDb, type Contact } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const contacts = db
    .prepare("SELECT * FROM contacts ORDER BY created_at DESC")
    .all() as Contact[];
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  const db = getDb();
  const result = db
    .prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)")
    .run(name, email, message);

  return NextResponse.json({ id: result.lastInsertRowid, success: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE contacts SET read = 1 WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
