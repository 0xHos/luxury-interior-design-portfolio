import { NextResponse } from "next/server";
import { getDb, type Service } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const services = db
    .prepare("SELECT * FROM services ORDER BY id")
    .all() as Service[];
  return NextResponse.json(services);
}
