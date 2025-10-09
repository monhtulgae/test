'use client';
import { useState } from 'react';

export default function HomePage() {
  const [code, setCode] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/oauth/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: "XoAnuEsxVQ1BSsoJnWEyO07Al2Xm6Q6U",
          redirectUrl: "https://hadgal-digi.vercel.app",
          scope: "scope", // check exact required value
          userId: "102508250375347",
          response_type: "code",
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCode(data.code);
        // exchangeCode(code || "");
        exchangeCode(data.code);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exchangeCode = async (code: string) => {
    try {
      const res = await fetch("/api/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      console.log("Token response:", data);
      getUserInfo(data.access_token);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserInfo = async (accessToken: string) => {
  try {
    const res = await fetch(`/api/oauth/user-info?access_token=${accessToken}`);
    const data = await res.json();
    console.log("User Info:", data);
  } catch (err) {
    console.error("Error:", err);
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h1>Fetch Authorization Code</h1>
      <button onClick={fetchCode} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Code'}
      </button>

      {code && (
        <div style={{ marginTop: 20 }}>
          <strong>Authorization Code:</strong> {code}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
