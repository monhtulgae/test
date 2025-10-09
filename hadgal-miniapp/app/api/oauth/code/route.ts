import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = 'https://digithon.khanbank.com/v3/superapp/oauth/code';
    const fullUrl = new URL(url);
    fullUrl.searchParams.append('grant_type', 'code');

    console.log('Request URL:', fullUrl.toString());
    console.log('Request Body:', body);

    const response = await fetch(fullUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Server response:', data);

    let code: string | null = null;
    if (data.siteUrl) {
      const urlParams = new URL(data.siteUrl).searchParams;
      code = urlParams.get('code');
    }

    return NextResponse.json({ ...data, code });
  } catch (error: any) {
    console.error('Error in /api/oauth/code:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
