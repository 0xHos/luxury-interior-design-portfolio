import { NextResponse } from "next/server";
import { getDb, type Project } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const db = getDb();
  let projects: Project[];

  if (featured === "true") {
    projects = db
      .prepare("SELECT * FROM projects WHERE featured = 1 ORDER BY year DESC")
      .all() as Project[];
  } else if (category && category !== "all") {
    projects = db
      .prepare("SELECT * FROM projects WHERE category = ? ORDER BY year DESC")
      .all(category) as Project[];
  } else {
    projects = db
      .prepare("SELECT * FROM projects ORDER BY year DESC")
      .all() as Project[];
  }

  return NextResponse.json(projects);
}
