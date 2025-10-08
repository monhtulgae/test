import { NextResponse } from "next/server";
import organizations from "@/app/data/organizations.json";

export async function GET() {
  try {
    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error loading organizations.json:", error);
    return NextResponse.json(
      { error: "Failed to load organizations" },
      { status: 500 }
    );
  }
}
