"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"
import { useUserId } from "../hooks/useUserId";
import { useLocalTokens } from "../hooks/useLocalTokens";

export default function BackCoin({uri}: {uri? : string}) {
  const router = useRouter();
  const userId = useUserId();
  const { getBalance } = useLocalTokens();
  const token = userId ? getBalance(userId) : 0;

  return (
    <div className="flex justify-between p-2">
      <div 
        onClick={() => (uri ? router.push(uri) : router.back())}
        className="cursor-pointer text-blue-400 mt-3 ml-2 hover:text-blue-200 transition"
      >
      <Image src="/images/arrow-left.png" alt="back" width={20} height={20} />
      </div>
      <div className="flex">
        <div className="flex items-center space-x-1 mt-3 mr-3">
          <span className="text-green-500 font-bold">{token}</span>
          <Image src="/images/coin.png" alt="coin" width={30} height={30} />
        </div>
      </div>
    </div>
  );
}