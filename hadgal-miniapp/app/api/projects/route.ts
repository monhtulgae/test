import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const projects = JSON.parse(fileData);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}