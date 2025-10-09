import { NextResponse } from "next/server";
import organizations from "@/app/data/organizations.json";

export async function GET(
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  if (isNaN(id) || id < 1 || id > organizations.length) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(organizations[id - 1]);
}
