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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 pb-24 p-4">
      <div className="flex justify-between items-center mb-6 mt-3 ml-1">
        <div>
          <h1 className="text-2xl font-bold text-white">Хуримтлал</h1>
        </div>
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
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all"
        >
          <span className="text-green-300 font-bold">{token}</span>
          <Image src="/images/coin.png" alt="coin" width={24} height={24} />
        </button>
      </div>

      <div className="flex justify-between mb-6 space-x-3">
        <button 
          onClick={handleClick1} 
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 w-full max-w-32 h-28 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-100"
        >
          <div className="bg-emerald-100 rounded-full p-2 mb-2">
            <Image src="/images/kind.png" alt="icon" width={32} height={32} />
          </div>
          <span className="text-sm font-semibold text-gray-800">Сайн үйлс</span>
        </button>
        
        <button 
          onClick={handleClick2} 
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 w-full max-w-32 h-28 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-100"
        >
          <div className="bg-emerald-100 rounded-full p-2 mb-2">
            <Image src="/images/green.png" alt="icon" width={32} height={32} />
          </div>
          <span className="text-sm font-semibold text-gray-800">Ногоон</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 w-full max-w-32 h-28 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-100"
        >
          <div className="bg-emerald-100 rounded-full p-2 mb-2">
            <Image src="/images/token.png" alt="icon" width={32} height={32} />
          </div>
          <span className="text-sm font-semibold text-gray-800">Оноо</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-5 flex items-center justify-between mb-6 text-white shadow-lg">
        <div className="flex-1">
          <p className="font-bold text-xl mb-1">Digi хадгал ✨</p>
          <p className="font-normal text-white/90 text-sm mb-4">Өнөөдрөөс эхлээд ирээдүйдээ хөрөнгө оруулья!</p>
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-white via-gray-200 to-white text-emerald-800 px-4 py-3.5 rounded-xl font-bold hover:bg-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-emerald-200 shadow-sm group"
            >
            <span className="text-lg">Хуримтлал үүсгэх</span>
            <Image
                src="/images/image.png"
                alt="arrow"
                width={25}
                height={25}
                className="ml-4 mt-1 transition-transform duration-300 group-hover:translate-x-1"
            />
        </button>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Image src="/images/digi-hero.png" alt="Digi Hero" width={100} height={100} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-800">Миний хуримтлал</h2>
          {savings.length > 0 && (
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
              {savings.length} ширхэг
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : savings.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Image src="/images/saving.png" alt="saving" width={32} height={32} />
            </div>
            <p className="text-gray-500 mb-4">Танд одоогоор хадгаламж байхгүй байна.</p>
            <button
              onClick={handleClick}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Эхний хадгаламж үүсгэх
            </button>
          </div>
        ) : (
          <>
            <div className="bg-emerald-50 rounded-xl p-4 mb-5">
              <p className="text-gray-600 text-sm">Нийт хуримтлал</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₮{new Intl.NumberFormat('mn-MN').format(
                  savings.reduce((sum, s) => sum + s.amount, 0)
                )}
              </p>
            </div>
            
            <div className="space-y-4">
              {savings.map((s) => (
                <div 
                  key={s.id} 
                  className="flex flex-col p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-emerald-100 transition-all duration-300 bg-white"
                >
                  <div className="flex flex-row justify-between items-center mb-3">
                    <div>
                      <p className="font-medium text-gray-800">{s.type}</p>
                      <p className="font-normal text-gray-500 text-sm">{formatAccount(s.id)}</p>
                    </div>
                    <p className="text-gray-800 font-bold text-lg">
                      ₮{new Intl.NumberFormat('mn-MN').format(s.amount)}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <button
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex-1"
                      onClick={() => {
                        setSelectedSavingId(s.id);
                        setShowDepositModal(true);
                      }}
                    >
                      Орлого хийх
                    </button>
                    <button
                      onClick={() => handleGoToSavings(s.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex-1"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-100 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-emerald-900">Орлого нэмэх</h2>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Дүн (₮)</label>
              <input
                type="number"
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-white border border-green-900 p-3 rounded-lg text-gray-700"
              />
            </div>
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount("");
                }}
                className="px-4 py-3 bg-gray-300 text-gray-700 text-xl font-bold rounded-lg hover:bg-gray-400 transition-colors flex-1"
              >
                Болих
              </button>
              <button
                onClick={() => {
                  if (!depositAmount || Number(depositAmount) <= 0) {
                    toast.error("Дүнгээ зөв оруулна уу!", {
                      duration: 3000,
                      position: "top-center",
                    });
                    return;
                  }
                  
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
                  }
                  
                  toast.success("Орлого амжилттай хийгдлээ!", {
                    duration: 3000,
                    position: "top-center",
                  });

                  setDepositAmount("");
                  setShowDepositModal(false);
                }}
                className="px-4 py-3 bg-emerald-500 text-white text-xl rounded-lg font-bold hover:bg-emerald-600 transition-colors flex-1"
              >
                Нэмэх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}