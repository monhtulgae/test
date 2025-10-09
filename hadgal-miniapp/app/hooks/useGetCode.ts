import { useState } from 'react';
import { getCode, GetCodeRequest, GetCodeResponse } from '@/app/lib/api';

export function useGetCode() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCode = async (body: GetCodeRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data: GetCodeResponse = await getCode(body);
      setCode(data.code ?? null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { code, loading, error, fetchCode };
}
