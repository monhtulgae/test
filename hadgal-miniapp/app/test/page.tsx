"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserId } from "../hooks/useUserId";
import { useLocalTokens } from "../hooks/useLocalTokens";
import toast from "react-hot-toast";
import { config } from "@/config/index";

export default function Home() {
  const userId = useUserId();
  const { getBalance } = useLocalTokens();
  const token = userId ? getBalance(userId) : 0;

  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleClick = () => {
    router.push(`${config.apiBaseUrl}/test1`);
  };
  const handleClick1 = () => {
    router.push(`${config.apiBaseUrl}/charity`);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("savings");
      if (stored) {
        const data = JSON.parse(stored);
        if (userId) {
          const filtered = data.filter((p: any) => p.userId === userId);
          setSavings(filtered);
        } else {
          setSavings(data);
        }
      } else {
        setSavings([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("LocalStorage-оос өгөгдөл уншихад алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 pb-24 p-4">
      <div className="flex justify-between items-center mb-5 mt-3 ml-1">
        <div>
          <h1 className="text-2xl font-bold text-white">АмьдСан</h1>
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
          <span className="text-green-300 text-sm font-bold">{token}</span>
          <Image src="/images/coin.png" alt="coin" width={18} height={18} />
        </button>
      </div>

      <div className="flex justify-between mb-3 space-x-3">
        <button
          onClick={handleClick1}
          className="flex flex-row bg-white rounded-xl shadow-lg p-4 w-full h-20 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-100"
        >
          <div className="p-2">
            <Image src="/images/kind.png" alt="icon" width={40} height={40} />
          </div>
          <span className="text-xl font-bold text-gray-800 mt-2 ml-7">
            Сайн үйлс
          </span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-2 flex items-center justify-between mb-3 text-white shadow-lg">
        <div className="flex-1 ml-1">
          <p className="font-bold text-xl mb-1">Ногоон хөрөнгө ✨</p>
          <p className="font-normal text-white/90 text-sm mb-4">
            Өнөөдрөөс эхлээд ирээдүйдээ хөрөнгө оруулья!
          </p>
          <button
            onClick={handleClick}
            className="bg-gradient-to-r w-59 from-white via-gray-200 to-white text-emerald-800 px-2 py-2 rounded-xl font-bold hover:bg-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-emerald-200 shadow-sm group"
          >
            <span className="text-sm">Ногоо хөрөнгө оруулалт</span>
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
          <h2 className="font-bold text-lg text-gray-800">Миний өгөөж</h2>
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
            <p className="text-gray-500 mb-4">
              Танд одоогоор хөрөнгө оруулсан төсөл байхгүй байна.
            </p>
            <button
              onClick={handleClick}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Эхний хөрөнгө оруулах
            </button>
          </div>
        ) : (
          <>
            <div className="bg-emerald-50 rounded-xl p-4 mb-5">
              <p className="text-gray-600 text-sm">Нийт хөрөнгө оруулсан төсөл дүн</p>
              <p className="text-xl font-bold text-emerald-700">
                ₮
                {new Intl.NumberFormat("mn-MN").format(
                  savings.reduce((sum, s) => sum + s.amount, 0)
                )}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-lg text-gray-800">Миний хөрөнгө</h2>
              {savings.map((s) => (
                <div
                  key={s.id}
                  onClick={() => router.push(`/green/${s.projectId}`)}
                  className="flex flex-col p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-emerald-100 transition-all duration-300 bg-white"
                >
                  <div className="flex flex-row justify-between items-center mb-3">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{s.type}</p>
                    </div>
                    <p className="text-gray-800 font-bold text-lg">
                      ₮{new Intl.NumberFormat("mn-MN").format(s.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}