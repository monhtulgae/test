import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://hadgal-digi.vercel.app");
    params.append("client_id", "XoAnuEsxVQ1BSsoJnWEyO07Al2Xm6Q6U");
    params.append("client_secret", "5081LT3KeVloAwRi");

    const response = await fetch(
      "https://digithon.khanbank.com/v3/superapp/oauth/token?grant_type=authorization_code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error exchanging code:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
