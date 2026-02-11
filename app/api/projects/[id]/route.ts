import { NextResponse } from "next/server";
import { getDb, type Project } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const project = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(Number(id)) as Project | undefined;

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const related = db
    .prepare(
      "SELECT * FROM projects WHERE category = ? AND id != ? LIMIT 3"
    )
    .all(project.category, project.id) as Project[];

  return NextResponse.json({ project, related });
}
