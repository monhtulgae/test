"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import voiceAnimation from "@/public/animations/voice.json";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSavings";
import { useRef } from "react";
import { useLocalTokens } from "@/app/hooks/useLocalTokens";

type PendingSaving = Saving & { id?: string };

export default function ContractPage() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingSaving, setPendingSaving] = useState<PendingSaving | null>(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { create } = useLocalSavings();
  const router = useRouter();
  const { addTokens } = useLocalTokens();

  const waitForVoices = () =>
    new Promise<void>((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) return resolve();
      const handler = () => {
        speechSynthesis.removeEventListener("voiceschanged", handler);
        resolve();
      };
      speechSynthesis.addEventListener("voiceschanged", handler);
    });

  const speakText = async (text: string) => {
    if (!text?.trim()) return;
    await waitForVoices();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "mn-MN";
    utter.rate = 1.8;
    utter.pitch = 2.1;

    const voices = speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === "mn-MN") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("mn")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en"));

    if (preferred) utter.voice = preferred;
    utter.onend = () => {
      toast.success("Уншилт дууслаа");
      utterRef.current = null;
    }
    utter.onerror = () => {
      toast.error("Дуу хоолой уншуулахад алдаа гарлаа.");
      utterRef.current = null;
    };
    utterRef.current = utter;
    speechSynthesis.speak(utter);
  };

  const handleRead = async () => {
    try {
      const res = await fetch("/contract/geree.txt");
      if (!res.ok) throw new Error("Cannot fetch geree.txt");
      const text = await res.text();
      await speakText(text);
    } catch (e) {
      toast.error("Текст унших файл олдсонгүй эсвэл алдаа гарлаа.");
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pendingSaving");
      if (!raw) {
        toast.error("Мэдээлэл алга. Эхнээс нь бөглөнө үү.");
        router.replace("/create_savings");
        return;
      }
      const parsed = JSON.parse(raw);
      setPendingSaving(parsed);
    } catch {
      toast.error("Өгөгдөл уншихад алдаа гарлаа.");
      router.replace("/create_savings");
    }
  }, [router]);

  const validateByType = (s: PendingSaving | null): s is Saving => {
    if (!s) return false;
    if (!s.userId || !s.dans || !s.openedAt || !s.type || !s.typeId) return false;
    if (typeof s.amount !== "number" || s.amount <= 0) return false;
    if (typeof s.interest !== "number") return false;

    switch (s.typeId) {
      case "term":
        if (typeof (s as any).durationMonths !== "number" || (s as any).durationMonths <= 0) {
          toast.error("Хугацаатай хадгаламжийн хугацаа (сар) алга байна.");
          return false;
        }
        return true;
      case "goal": {
        const g = s as any;
        if (typeof g.durationMonths !== "number" || g.durationMonths <= 0) {
          toast.error("Зорилготой хадгаламжийн хугацаа (сар) алга байна.");
          return false;
        }
        if (typeof g.goalAmount !== "number" || g.goalAmount <= 0) {
          toast.error("Зорилгын нийт дүн буруу байна.");
          return false;
        }
        if (!g.goalPurpose || String(g.goalPurpose).trim() === "") {
          toast.error("Зорилгын тайлбар дутуу байна.");
          return false;
        }
        return true;
      }
      case "green":
        if (!(s as any).greenType || String((s as any).greenType).trim() === "") {
          toast.error("Ногоон хадгаламжийн төсөл (greenType) сонгоогүй байна.");
          return false;
        }
        return true;
      case "non-term":
        return true;
      default:
        toast.error("Төрөл тодорхойгүй байна.");
        return false;
    }
  };

  const handleApprove = () => {
    if (!pendingSaving) return;
    if (!validateByType(pendingSaving)) return;
    setSubmitting(true);

    try {
      const newSaving = create({ ...(pendingSaving as Saving), id: "" } as Saving);
      const depositAmount = Number(pendingSaving.amount);
      const tokenAmount = Math.floor(depositAmount / 10000);

      if (tokenAmount > 0) {
        addTokens(pendingSaving.userId, tokenAmount);
        toast.success(`🎉 Та ${tokenAmount} DigiToken авлаа!`, {
          duration: 4000,
          position: "top-center",
        });
      }
      toast.success("Хадгаламж амжилттай үүсгэгдлээ!");
      localStorage.removeItem("pendingSaving");
      router.replace(`/savings/${newSaving.id}`);
    } catch (e) {
      console.error(e);
      toast.error("Алдаа гарлаа, дахин оролдоно уу!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col p-4 bg-gray-50">
      <div className="mb-4 flex flex-row items-center space-x-3">
        <button
          className="text-gray-600 hover:text-black transition"
          onClick={() => router.back()}
        >
          <Image src="/images/arrow-left.png" alt="back" width={20} height={20} />
        </button>
        <h1 className="text-2xl font-bold text-black">Гэрээ байгуулах</h1>
      </div>
      <div className="w-full max-w-md h-[700px] overflow-y-auto rounded-lg shadow-lg bg-white">
        {[
          "/contract/geree-page1.png",
          "/contract/geree-page2.png",
          "/contract/geree-page3.png",
        ].map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Гэрээ ${index + 1}`}
            className="w-full object-contain mb-2"
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center h-90 shadow-xl rounded-t-3xl w-full border-t-2">
        <div className="flex gap-20 mt-30 bg-white p-4 w-full max-w-md justify-center h-20 items-center">
          <button
            onClick={() => setShowReadModal(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-xl"
          >
            Унших
          </button>
          <button
            onClick={() => {
              setShowAssistant(true);
              handleRead();
            }}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-xl"
          >
            Сонсох
          </button>
        </div>
      </div>
    
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white shadow-xl rounded-t-3xl transition-transform duration-500 ${
          showAssistant ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center text-center h-180 p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl text-gray-600 font-semibold mb-5">Ухаалаг туслах</h2>
          <img src="/images/digi-hero.gif" className="w-45 mb-1" alt="assistant" />
          <div className="flex items-center justify-center w-60">
            <Lottie animationData={voiceAnimation} loop={true} />
          </div>
          <div className="flex gap-10 mt-6">
            <button
              onClick={() => setShowAssistant(false)}
              className="bg-gray-500 border px-4 py-2 rounded-lg text-white text-xl w-35"
            >
              Болих
            </button>
            <button
              onClick={handleApprove}
              disabled={submitting || !pendingSaving}
              className={`px-4 py-2 rounded-lg text-xl w-35 ${
                submitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? "Илгээж байна..." : "Зөвшөөрөх"}
            </button>
          </div>
        </div>
      </div>

      {showReadModal && (
        <div className="fixed inset-0 bg-white flex flex-col z-50">
          <div className="flex-1 overflow-y-auto p-4">
            <img src="/contract/geree-page1.png" className="w-full mb-4" />
            <img src="/contract/geree-page2.png" className="w-full mb-4" />
            <img src="/contract/geree-page3.png" className="w-full" />
          </div>

          <div className="flex mb-4 justify-center gap-20 mt-6">
            <button
              onClick={() => setShowReadModal(false)}
              className="bg-gray-500 border px-4 py-2 rounded-lg text-white text-xl w-35"
            >
              Болих
            </button>
            <button
              onClick={handleApprove}
              disabled={submitting || !pendingSaving}
              className={`px-4 py-2 rounded-lg text-xl w-35 ${
                submitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? "Илгээж байна..." : "Зөвшөөрөх"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}