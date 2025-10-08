"use client";

import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BackCoin({uri}: {uri? : string}) {
  const router = useRouter();

  return (
    <div className="flex justify-between p-3">
      <div 
        onClick={() => (uri ? router.push(uri) : router.back())}
        className="cursor-pointer text-blue-400 hover:text-blue-200 transition"
      >
        {"<Back"}
      </div>
      <div className="flex">
        <div className="text-green-400 bg-green-800 rounded-full p-1 flex mr-0.5">
          <FaStar></FaStar>
        </div>
        <span> 0</span>
      </div>
    </div>
  );
}