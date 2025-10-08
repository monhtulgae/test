import { NextResponse } from "next/server";
import { fakeSavings } from "../route";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || "123";

  const allSavings = fakeSavings[userId] || [];
  const saving = allSavings.find((s: any) => s.id === id);

  if (!saving) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(saving);
}

