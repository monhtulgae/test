"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserId } from "../hooks/useUserId";
import { useLocalSavings } from "../hooks/useLocalSavings";
import { useLocalTokens } from "../hooks/useLocalTokens";
import toast from "react-hot-toast";

export default function Home() {
  const userId = useUserId();
  const { getAll } = useLocalSavings();
  const { getBalance, addTokens } = useLocalTokens();
  const token = userId ? getBalance(userId) : 0;

  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedSavingId, setSelectedSavingId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const router = useRouter();

  const handleClick = () => {
    router.push("/create_savings");
  };
  const handleClick1 = () => {
    router.push("/charity");
  };
  const handleClick2 = () => {
    router.push("/greenasset")
  }

  const handleGoToSavings = (id: string) => {
    router.push(`/savings/${id}`);
  };

  const formatAccount = (id: string) => id.replace(/(.{4})/g, "$1 ").trim();

  useEffect(() => {
    if (!userId) return;
    const data = getAll(userId);
    setSavings(data);
    setLoading(false);
  }, [userId, getAll]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-7">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Хуримтлал</h1>
        <button
          onClick={() => {
            toast.success(
              `Таны одоогийн токен: ${token}\n💰 10,000₮ тутамд 1 токен олгогдоно.`,
              {
                duration: 5000,
                position: "top-center",
              }
            );
          }}
          className="flex items-center space-x-1"
        >
          <span className="text-green-500 font-bold">{token}</span>
          <Image src="/images/coin.png" alt="coin" width={30} height={30} />
        </button>
      </div>

      <div className="flex justify-between mb-4 space-x-2">
        <button onClick={handleClick1} className="flex flex-col justify-center bg-white rounded-lg shadow-md p-4 w-40 h-30 hover:shadow-lg hover:scale-105 transition-transform duration-200">
          <Image src="/images/kind.png" alt="icon" width={40} height={40} />
          <span className="mt-2 text-black font-bold">Сайн үйлс</span>
        </button>
        <button onClick={handleClick2} className="flex flex-col justify-center bg-white rounded-lg shadow-md p-4 w-40 h-30 hover:shadow-lg hover:scale-105 transition-transform duration-200">
          <Image src="/images/green.png" alt="icon" width={40} height={40} />
          <span className="mt-2 text-black font-bold">Ногоон</span>
        </button>
        <button className="flex flex-col justify-center bg-white rounded-lg shadow-md p-4 w-40 h-30 hover:shadow-lg hover:scale-105 transition-transform duration-200">
          <Image src="/images/token.png" alt="icon" width={40} height={40} />
          <span className="mt-2 text-black font-bold">Оноо</span>
        </button>
      </div>

      <div className="bg-green-600 rounded-xl p-4 flex items-center justify-between mb-4 text-white">
        <div>
          <p className="font-bold text-xl">Digi хадгал ✨</p>
          <p className="font-normal text-white/80">Өнөөдрөөс эхлээд ирээдүйдээ хөрөнгө оруулья!</p>
          <button
            onClick={handleClick}
            className="mt-2 bg-green-400 px-4 py-2 rounded-lg font-semibold hover:bg-green-900 flex items-center hover:animate-pulse"
          >
            <span>Хуримтлал үүсгэх</span>
            <Image
              src="/images/arrow-right.png"
              alt="arrow"
              width={20}
              height={20}
              className="inline-block ml-2"
            />
          </button>
        </div>
        <Image src="/images/digi-hero.png" alt="Digi Hero" width={100} height={100} />
      </div>

      <div className="bg-white rounded-xl p-4 w-full ">
        <h2 className="font-bold mb-2 text-black text-xl">Миний хуримтлал</h2>

        {loading ? (
          <p>Ачаалж байна...</p>
        ) : savings.length === 0 ? (
          <p className="text-gray-500">Танд одоогоор хадгаламж байхгүй байна.</p>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Нийт хуримтлал: ₮
              {new Intl.NumberFormat('mn-MN').format(
                savings.reduce((sum, s) => sum + s.amount, 0)
              )}
            </p>
            <div className="space-y-3">
              {savings.map((s) => (
                <div key={s.id} className="flex flex-col justify-between p-3 border rounded-lg border-gray-200 hover:shadow-lg hover:scale-105 transition-transform duration-200">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <div>
                      <p className="font-normal text-gray-600">{s.type}:</p>
                      <p className="font-normal text-gray-400">{formatAccount(s.id)}</p>
                    </div>
                    <p className="text-gray-600 font-bold">₮{new Intl.NumberFormat('mn-MN').format(s.amount)}</p>
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-green-600 hover:text-white hover:animate-pulse"
                      onClick={() => {
                        setSelectedSavingId(s.id);
                        setShowDepositModal(true);
                      }}
                    >
                      Орлого хийх
                    </button>
                    <button
                      onClick={() => handleGoToSavings(s.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-green-600 hover:text-white hover:animate-pulse"
                    >
                      Дэлгэрэнгүй
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-100">
            <h2 className="text-2xl font-bold mb-3 text-center text-gray-700">Орлого нэмэх</h2>
            <input
              type="number"
              placeholder="Дүн (₮)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full border p-2 rounded mb-4 border-gray-600 text-gray-700"
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount("");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded text-gray-700 text-xl w-32 font-bold hover:bg-gray-600 hover:text-white hover:animate-pulse"
              >
                Болих
              </button>
              <button
                onClick={() => {
                  if (!depositAmount || Number(depositAmount) <= 0) return;
                  const updated = savings.map((s) =>
                    s.id === selectedSavingId
                      ? { ...s, amount: s.amount + Number(depositAmount) }
                      : s
                  );
                  localStorage.setItem("savings", JSON.stringify(updated));
                  setSavings(updated);

                  const depositNum = Number(depositAmount);
                  const tokenAmount = Math.floor(depositNum / 10000);

                  if (tokenAmount > 0 && userId) {
                    addTokens(userId, tokenAmount);
                    toast.success(`🎉 ${tokenAmount} DigiToken нэмэгдлээ!`, {
                      duration: 4000,
                      position: "top-center",
                    });
                    toast.success("Орлого амжилттай хийгдлээ!", {
                      duration: 3000,
                      position: "top-center",
                    });
                  } else {
                    toast.success("Орлого амжилттай хийгдлээ!", {
                      duration: 3000,
                      position: "top-center",
                    });
                  }

                  setDepositAmount("");
                  setShowDepositModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded text-xl font-bold w-32 hover:bg-green-900 hover:text-white hover:animate-pulse"
              >
                Нэмэх
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-t-lg shadow-lg border-t border-gray-200 w-100 flex justify-between"> 
        <button className="flex flex-col items-center text-gray-600 p-2 rounded-lg w-20 hover:shadow-md hover:bg-gray-200 hover:text-black hover:font-bold hover:animate-pulse"> 
          <Image src="/images/home.png" alt="home" width={30} height={30} /> 
          <span>Нүүр</span> 
        </button> 
        <button className="flex flex-col items-center text-gray-600 p-2 rounded-lg w-20 hover:shadow-md hover:bg-gray-200 hover:text-black hover:font-bold hover:animate-pulse">
          <Image src="/images/gift.png" alt="home" width={30} height={30} /> 
          <span>Лояалти</span> 
        </button> 
        <button className="flex flex-col items-center text-gray-600 p-2 rounded-lg w-20 hover:shadow-md hover:bg-gray-200 hover:text-black hover:font-bold hover:animate-pulse"> 
          <Image src="/images/pocket.png" alt="home" width={30} height={30} /> 
          <span>Хэтэвч</span> 
        </button> 
        <button className="flex flex-col items-center text-black shadow-md p-2 rounded-lg bg-gray-200 w-20 font-bold"> 
          <Image src="/images/saving.png" alt="home" width={30} height={30} /> 
          <span>Хадгал</span> 
          </button> 
      </div> */}
    </div>
  );
}
