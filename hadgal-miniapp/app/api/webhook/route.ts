import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Webhook received:", body);

  // ✅ TODO: Handle payment status here (success/fail)
  // Example: update donation, mark invoice complete, etc.

  return NextResponse.json({ status: "ok" });
}
