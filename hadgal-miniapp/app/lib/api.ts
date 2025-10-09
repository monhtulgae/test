export interface GetCodeRequest {
  clientId: string;
  redirectUrl: string;
  scope: string;
  userId: string;
  response_type: string;
}

export interface GetCodeResponse {
  siteUrl?: string;
  code?: string | null;
  [key: string]: any;
}

export async function getCode(body: GetCodeRequest): Promise<GetCodeResponse> {
  try {
    const res = await fetch('/api/oauth/get', {  // updated path
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    return data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch code');
  }
}
