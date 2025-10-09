import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract access_token from query or headers if needed
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("access_token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing access_token" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://digithon.khanbank.com/v3/superapp/user/info",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error fetching user info:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
