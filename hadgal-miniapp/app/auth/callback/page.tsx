"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");

    if (code) {
      console.log("Received code:", code);
      // ✅ Now send code to your backend for token exchange
      router.push(`/dashboard`); // or wherever you want
    }
  }, [searchParams, router]);

  return <p>Authenticating...</p>;
}
