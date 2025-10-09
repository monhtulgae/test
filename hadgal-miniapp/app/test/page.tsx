"use client";
import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import voiceAnimation from "@/public/animations/voice.json";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSavings";
import { useLocalTokens } from "@/app/hooks/useLocalTokens";

type PendingSaving = Saving & { id?: string };

export default function ContractPage() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingSaving, setPendingSaving] = useState<PendingSaving | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { create } = useLocalSavings();
  const { addTokens } = useLocalTokens();
  const router = useRouter();

  // ---------- Voice helpers (SSR-safe) ----------
  const waitForVoices = () =>
    new Promise<void>((resolve) => {
      if (typeof window === "undefined" || typeof speechSynthesis === "undefined") {
        resolve();
        return;
      }
      const voices = speechSynthesis.getVoices();
      if (voices.length) return resolve();
      const handler = () => {
        speechSynthesis.removeEventListener("voiceschanged", handler);
        resolve();
      };
      speechSynthesis.addEventListener("voiceschanged", handler);
    });

  const speakText = async (text: string) => {
    if (typeof window === "undefined" || typeof speechSynthesis === "undefined") return;
    if (!text?.trim()) return;

    await waitForVoices();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "mn-MN";
    utter.rate = 1.15; // natural-ish
    utter.pitch = 1.0;

    const voices = speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === "mn-MN") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("mn")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (preferred) utter.voice = preferred;

    utter.onend = () => {
      toast.success("Уншилт дууслаа", { position: "top-center" });
      utterRef.current = null;
    };
    utter.onerror = () => {
      toast.error("Дуу хоолой уншуулахад алдаа гарлаа.", { position: "top-center" });
      utterRef.current = null;
    };

    // cancel any previous
    speechSynthesis.cancel();
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

  // ---------- Load pending ----------
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

  // ---------- Validation ----------
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
          toast.error("Ногоон хадгаламжийн төсөл сонгоогүй байна.");
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

  // ---------- Approve ----------
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

      toast.success("Хадгаламж амжилттай үүсгэгдлээ!", { position: "top-center" });
      localStorage.removeItem("pendingSaving");
      router.replace(`/savings/${newSaving.id}`);
    } catch (e) {
      console.error(e);
      toast.error("Алдаа гарлаа, дахин оролдоно уу!");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="relative w-full min-h-screen p-4 pb-32 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800">
      {/* Header */}
      <div className="mb-4 mt-2 flex items-center space-x-3">
        <button
          className="text-white/90 hover:text-white transition"
          onClick={() => router.back()}
          aria-label="Буцах"
        >
          <Image src="/images/arrow-left.png" alt="back" width={22} height={22} />
        </button>
        <h1 className="text-2xl font-bold text-white">Гэрээ байгуулах</h1>
      </div>

      {/* Contract viewer */}
      <div className="w-full max-w-2xl mx-auto h-[72vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
        {[
          "/contract/geree-page1.png",
          "/contract/geree-page2.png",
          "/contract/geree-page3.png",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Гэрээ ${i + 1}`}
            className="w-full object-contain mb-2"
          />
        ))}
      </div>

      {/* Bottom Actions (sticky) */}
      <div className="fixed left-0 right-0 bottom-0">
        <div className="mx-auto max-w-2xl">
          <div className="m-4 rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl p-3">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowReadModal(true)}
                className="flex-1 bg-gradient-to-r from-white via-gray-200 to-white text-emerald-800 px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-emerald-200 transition"
              >
                Унших
              </button>
              <button
                onClick={() => {
                  setShowAssistant(true);
                  handleRead();
                }}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-emerald-200/20 transition"
              >
                Сонсох
              </button>
              <button
                onClick={handleApprove}
                disabled={submitting || !pendingSaving}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition border ${
                  submitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-200"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-emerald-200/20"
                }`}
              >
                {submitting ? "Илгээж байна..." : "Зөвшөөрөх"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assistant bottom sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 transition-transform duration-500 ${
          showAssistant ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showAssistant}
      >
        <div className="mx-auto max-w-2xl rounded-t-3xl bg-white/90 backdrop-blur-lg shadow-[0_-8px_40px_rgba(0,0,0,0.35)] border-t border-emerald-100">
          <div className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-emerald-900 mb-3">Ухаалаг туслах</h2>
            <img src="/images/digi-hero.gif" className="w-36 h-36 object-contain mb-1" alt="assistant" />
            <div className="w-56 h-24">
              <Lottie animationData={voiceAnimation} loop />
            </div>
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => {
                  setShowAssistant(false);
                  if (typeof window !== "undefined" && typeof speechSynthesis !== "undefined") {
                    speechSynthesis.cancel();
                  }
                }}
                className="flex-1 bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 rounded-xl px-4 py-3 font-semibold transition"
              >
                Болих
              </button>
              <button
                onClick={handleApprove}
                disabled={submitting || !pendingSaving}
                className={`flex-1 rounded-xl px-4 py-3 font-bold transition ${
                  submitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {submitting ? "Илгээж байна..." : "Зөвшөөрөх"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Read modal */}
      {showReadModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowReadModal(false)}
          />
          <div className="relative z-10 max-w-3xl mx-auto mt-8 mb-6 rounded-2xl bg-white shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="text-lg font-semibold text-emerald-900">Гэрээ унших</h3>
              <button
                onClick={() => setShowReadModal(false)}
                className="text-gray-600 hover:text-black transition"
                aria-label="Хаах"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto p-4 bg-emerald-50/30">
              <img src="/contract/geree-page1.png" className="w-full rounded-lg mb-3 border border-emerald-100" />
              <img src="/contract/geree-page2.png" className="w-full rounded-lg mb-3 border border-emerald-100" />
              <img src="/contract/geree-page3.png" className="w-full rounded-lg border border-emerald-100" />
            </div>
            <div className="flex gap-3 p-4 border-t bg-white">
              <button
                onClick={() => setShowReadModal(false)}
                className="flex-1 bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 rounded-xl px-4 py-3 font-semibold transition"
              >
                Болих
              </button>
              <button
                onClick={handleApprove}
                disabled={submitting || !pendingSaving}
                className={`flex-1 rounded-xl px-4 py-3 font-bold transition ${
                  submitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {submitting ? "Илгээж байна..." : "Зөвшөөрөх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
