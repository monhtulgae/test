import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";


interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const filePath = path.join(process.cwd(), "data", "organizations.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const organizations = JSON.parse(fileData);

    return NextResponse.json(organizations[Number(id) - 1]);
  } catch (error) {
    console.error("Error reading organizations.json:", error);
    return NextResponse.json(
      { error: "Failed to load organizations" },
      { status: 500 }
    );
  }
}


