import { NextResponse } from "next/server";
import projects from "@/app/data/projects.json";

export async function GET(
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  if (isNaN(id) || id < 1 || id > projects.length) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(projects[id - 1]);
}
