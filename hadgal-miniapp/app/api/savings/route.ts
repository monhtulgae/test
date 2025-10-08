import { NextResponse } from "next/server";

export const fakeSavings: Record<string, any[]> = {
  "123": [
    {
      id: "1",
      type: "Хугацаатай хадгаламж",
      dans: "1234567890",
      amount: 1250000,
      interest: 7.2,
      openedAt: "2025-09-12",
      date_interest: "*****",
      saving_interest: "*****",
      total_interest: "*****",
      interest_date: "2025-10-12",
      next_interest: "2025-11-12"
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "123";
  const data = fakeSavings[userId] || [];
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    userId = "123",
    type,
    dans,
    amount,
    interest = 7.2,
    openedAt = new Date().toISOString().split("T")[0],
    date_interest = "*****",
    saving_interest = "*****",
    total_interest = "*****",
    interest_date = "*****",
    next_interest = "*****"
  } = body;

  if (!fakeSavings[userId]) {
    fakeSavings[userId] = [];
  }

  const newSaving = {
    id: Date.now().toString(),
    type,
    dans,
    amount,
    interest,
    openedAt,
    date_interest,
    saving_interest,
    total_interest,
    interest_date,
    next_interest
  };

  fakeSavings[userId].push(newSaving);

  return NextResponse.json({ success: true, data: newSaving });
}

