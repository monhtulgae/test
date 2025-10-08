import { NextResponse } from "next/server";
import projects from "@/app/data/projects.json";

export async function GET() {
  try {
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error loading projects.json:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
