import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // ✅ Promise биш, шууд объект
) {
  const { id } = context.params;

  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const projects = JSON.parse(fileData);

    return NextResponse.json(projects[Number(id) - 1]);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
