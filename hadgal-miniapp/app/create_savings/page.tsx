"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserId } from "@/app/hooks/useUserId";
import Lottie from "lottie-react";
import termAnimation from "@/public/animations/lock.json";
import nonTermAnimation from "@/public/animations/cashflow.json";
import goalAnimation from "@/public/animations/target.json";
import greenAnimation from "@/public/animations/green.json";
import toast from "react-hot-toast";
import { useEffect } from "react";

const SAVING_TYPES = [
  { id: "term", label: "Хугацаатай хадгаламж", animation: termAnimation },
  { id: "non-term", label: "Хугацаагүй хадгаламж", animation: nonTermAnimation },
  { id: "goal", label: "Зорилготой хадгаламж", animation: goalAnimation },
  { id: "green", label: "Ногоон хадгаламж", animation: greenAnimation },
] as const;

type SavingTypeId = (typeof SAVING_TYPES)[number]["id"];

const INTEREST_BY_TYPE: Record<SavingTypeId, number> = {
  "term": 9.5,
  "non-term": 4.8,
  "goal": 8.0,
  "green": 7.2,
};

const GREEN_OPTIONS = [
  { value: "tree", label: "Мод тарих сан" },
  { value: "clean-energy", label: "Сэргээгдэх эрчим хүч" },
  { value: "carbon-offset", label: "Нүүрстөрөгч бууруулах төсөл" },
];

interface BaseSaving {
  userId: string;
  type: string;
  typeId: SavingTypeId;
  dans: string;
  amount: number;
  interest: number;
  openedAt: string;
  date_interest?: string;
  total_interest?: number;
  interest_date?: string;
  next_interest?: string;
}

interface TermSaving extends BaseSaving {
  typeId: "term";
  durationMonths: number;
}

interface NonTermSaving extends BaseSaving {
  typeId: "non-term";
}

interface GoalSaving extends BaseSaving {
  typeId: "goal";
  durationMonths: number;
  goalAmount: number;
  goalPurpose: string;
}

interface GreenSaving extends BaseSaving {
  typeId: "green";
  greenType: string;
}

type AnySaving = TermSaving | NonTermSaving | GoalSaving | GreenSaving;

export default function SavingsPage() {
  const router = useRouter();
  const userId = useUserId();

  const [selectedType, setSelectedType] = useState<SavingTypeId | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");

  const [duration, setDuration] = useState<string>("");

  const [goalAmount, setGoalAmount] = useState<string>("");
  const [goalPurpose, setGoalPurpose] = useState<string>("");

  const [greenType, setGreenType] = useState<string>("");

  const selectedSaving = useMemo(
    () => (selectedType ? SAVING_TYPES.find((t) => t.id === selectedType)! : null),
    [selectedType]
  );

  const interest = useMemo(() => {
    if (!selectedType) return 0;
    return INTEREST_BY_TYPE[selectedType];
  }, [selectedType]);

  const isFormValid = useMemo(() => {
    if (!selectedType) return false;

    const hasCommon = amount.trim() !== "" && accountNumber.trim() !== "" && Number(amount) > 0;

    if (!hasCommon) return false;

    switch (selectedType) {
      case "term":
        return duration.trim() !== "" && Number(duration) > 0;
      case "non-term":
        return true;
      case "goal":
        return (
          duration.trim() !== "" &&
          Number(duration) > 0 &&
          goalAmount.trim() !== "" &&
          Number(goalAmount) > 0 &&
          goalPurpose.trim() !== ""
        );
      case "green":
        return greenType.trim() !== "";
      default:
        return false;
    }
  }, [selectedType, amount, accountNumber, duration, goalAmount, goalPurpose, greenType]);

  const resetAll = () => {
    setAmount("");
    setAccountNumber("");
    setDuration("");
    setGoalAmount("");
    setGoalPurpose("");
    setGreenType("");
  };

  const handleSubmit = () => {
    if (!userId || !isFormValid || !selectedType || !selectedSaving) return;

    const base: BaseSaving = {
      userId,
      type: selectedSaving.label,
      typeId: selectedType,
      dans: accountNumber.trim(),
      amount: Number(amount),
      interest,
      openedAt: new Date().toISOString().split("T")[0],
    };

    let payload: AnySaving;
    if (selectedType === "term") {
      payload = {
        ...base,
        typeId: "term",
        durationMonths: Number(duration),
      };
    } else if (selectedType === "non-term") {
      payload = {
        ...base,
        typeId: "non-term",
      };
    } else if (selectedType === "goal") {
      payload = {
        ...base,
        typeId: "goal",
        durationMonths: Number(duration),
        goalAmount: Number(goalAmount),
        goalPurpose: goalPurpose.trim(),
      };
    } else {
      payload = {
        ...base,
        typeId: "green",
        greenType,
      };
    }

    localStorage.setItem("pendingSaving", JSON.stringify(payload));
    router.push("/contract");
  };
  useEffect(() => {
    if (isFormValid && selectedType) {
      toast.success(
        `Та "${selectedSaving?.label}" төрлийн ₮${Number(amount).toLocaleString()} төгрөгийн хадгаламж үүсгэж байна.
        Жилийн хүү: ${interest}%  
        1 сарын дараа: ₮${Number(amount).toLocaleString()} → ₮${(
        Number(amount) * (1 + ((interest / 100) / 12))
        ).toLocaleString()}`,
        {
          duration: 7000,
          position: "top-center",
        }
      );
    }
  }, [isFormValid, selectedType, amount, interest, selectedSaving]);

  if (!selectedType) {
    return (
      <div className="p-4 flex flex-col bg-gray-50 min-h-screen">
        <div className="mb-4 flex flex-row items-center space-x-3">
          <button
            className="text-gray-600 hover:text-black transition"
            onClick={() => router.push("/home")}
          >
            <Image src="/images/arrow-left.png" alt="back" width={20} height={20} />
          </button>
          <h1 className="text-2xl font-bold text-black">Хуримтлал үүсгэх</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-4">
          {SAVING_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setSelectedType(t.id);
                resetAll();
              }}
              className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <Lottie animationData={t.animation} loop={true} className="w-full h-48" />
              <div className="absolute inset-0 shadow border-2 bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-3xl bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg drop-shadow-md">
                  {t.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col bg-gray-50 min-h-screen">
      <div className="mb-4 flex flex-row items-center space-x-3">
        <button
          className="text-gray-600 hover:text-black transition"
          onClick={() => router.push("/home")}
        >
          <Image src="/images/arrow-left.png" alt="back" width={20} height={20} />
        </button>
        <h1 className="text-2xl font-bold text-black">Хуримтлал үүсгэх</h1>
      </div>

      <div className="relative mb-6">
        <Lottie animationData={selectedSaving!.animation} loop={true} className="w-full h-48" />

        <div className="absolute inset-0 shadow border-2 flex items-center justify-center rounded-xl">
          <span className="text-white font-bold text-3xl bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg drop-shadow-md">
            {selectedSaving!.label}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-sm font-semibold text-gray-500">
          Хүү: {interest.toFixed(1)}%
        </div>
      </div>
      <div className="flex flex-row gap-2 mb-6">
        {SAVING_TYPES.filter((t) => t.id !== selectedType).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedType(t.id);
              resetAll();
            }}
            className="flex-1 relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <Lottie animationData={t.animation} loop={true} className="w-full h-30" />
            <div className="absolute inset-0 border-2 shadow flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm text-center px-2 bg-white/30 backdrop-blur-md shadow-lg drop-shadow-md rounded-lg">
                {t.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-black">Мэдээлэл бөглөх</h2>
      <div className="grid grid-cols-1 gap-3">
        <input
          type="number"
          min={0}
          placeholder="Хадгалах дүн (₮)"
          className="w-full border p-2 rounded border-gray-500 text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Харилцах дансны дугаар"
          className="w-full border p-2 rounded border-gray-500 text-black"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        {selectedType === "term" && (
          <input
            type="number"
            min={1}
            placeholder="Хугацаа (сар)"
            className="w-full border p-2 rounded border-gray-500 text-black"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        )}
        {selectedType === "goal" && (
          <>
            <input
              type="number"
              min={1}
              placeholder="Зорилгын нийт дүн (₮)"
              className="w-full border p-2 rounded border-gray-500 text-black"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Юунд зориулах вэ?"
              className="w-full border p-2 rounded border-gray-500 text-black"
              value={goalPurpose}
              onChange={(e) => setGoalPurpose(e.target.value)}
            />
            <input
              type="number"
              min={1}
              placeholder="Хугацаа (сар)"
              className="w-full border p-2 rounded border-gray-500 text-black"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </>
        )}
        {selectedType === "green" && (
          <select
            className="w-full border p-2 rounded border-gray-500 text-black bg-white"
            value={greenType}
            onChange={(e) => setGreenType(e.target.value)}
          >
            <option value="">— Төсөл сонгох —</option>
            {GREEN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full p-3 rounded-lg text-lg font-semibold transition mt-10 mb-4 ${
          isFormValid
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Гэрээ байгуулах
      </button>

      <button
        type="button"
        onClick={() => router.push("/home")}
        className="w-full bg-gray-300 p-3 rounded-lg text-lg text-gray-500 font-semibold hover:bg-green-600 transition hover:text-white"
      >
        Болих
      </button>
    </div>
  );
}