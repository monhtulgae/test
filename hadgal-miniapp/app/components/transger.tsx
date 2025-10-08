"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TransferSec({ projectId, url }: { projectId: number, url: string }) {
  const router = useRouter();

  return (
    <div className="bg-green-500 mt-4 shadow-2xl rounded-2xl p-3">
      <div className="justify-center text-center mb-2 text-white font-medium">
        Сайн сайханд хувь нэмэр оруулах
      </div>
      <div className="flex justify-center gap-2">
        <div
          className="bg-amber-100 rounded-xl px-5 py-1.5 flex-1 text-center cursor-pointer hover:bg-amber-200 transition"
          onClick={() => router.back()}
        >
          Буцах
        </div>
        <div
          className="bg-green-200 rounded-xl px-5 py-1.5 flex-1 text-center cursor-pointer hover:bg-green-300 transition"
          onClick={() => router.push(`/complete?${url}=${projectId}`)}
        >
          Туслах
        </div>
      </div>
    </div>
  );
}
