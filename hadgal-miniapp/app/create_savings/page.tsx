"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserId } from "@/app/hooks/useUserId";
import Lottie from "lottie-react";
import termAnimation from "@/public/animations/lock.json";
import nonTermAnimation from "@/public/animations/cashflow.json";
import goalAnimation from "@/public/animations/target.json";
import greenAnimation from "@/public/animations/green.json";
import toast from "react-hot-toast";

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

    const hasCommon =
      amount.trim() !== "" &&
      accountNumber.trim() !== "" &&
      Number(amount) > 0;

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

    const base = {
      userId,
      type: selectedSaving.label,
      typeId: selectedType,
      dans: accountNumber.trim(),
      amount: Number(amount),
      interest,
      openedAt: new Date().toISOString().split("T")[0],
    };

    let payload: any;
    if (selectedType === "term") {
      payload = {
        ...base,
        typeId: "term",
        durationMonths: Number(duration),
      };
    } else if (selectedType === "non-term") {
      payload = { ...base, typeId: "non-term" };
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
          Number(amount) * (1 + (interest / 1200))
        ).toLocaleString()}`,
        {
          duration: 7000,
          position: "top-center",
        }
      );
    }
  }, [isFormValid, selectedType, amount, interest, selectedSaving]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-4 pb-24">
      <div className="flex flex-row items-center space-x-3 mb-6 mt-3">
        <button
          className="text-white hover:text-gray-200 transition"
          onClick={() => router.push("/home")}
        >
          <Image src="/images/arrow.png" alt="back" width={23} height={23} />
        </button>
        <h1 className="text-2xl font-bold text-white">Хуримтлал үүсгэх</h1>
      </div>

      {!selectedType ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SAVING_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedType(t.id);
                resetAll();
              }}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-emerald-300/40 transition transform duration-300 bg-white/20 border border-white/20 backdrop-blur-md"
            >
              <Lottie animationData={t.animation} loop className="w-full h-48" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-3xl bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl">
                  {t.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <Lottie
              animationData={selectedSaving!.animation}
              loop
              className="w-full h-48"
            />
          <div className="absolute inset-0 flex items-center text-center justify-center bg-white/20">
              <span className="text-white font-bold text-2xl bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl">
                {selectedSaving!.label}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-sm font-semibold text-gray-700">
              Хүү: {interest.toFixed(1)}%
            </div>
          </div>

          <div className="flex flex-row gap-3 mb-6">
            {SAVING_TYPES.filter((t) => t.id !== selectedType).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedType(t.id);
                  resetAll();
                }}
                className="flex-1 relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <Lottie animationData={t.animation} loop className="w-full h-32" />
                <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                  <span className="text-white font-semibold text-sm text-center px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg">
                    {t.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-emerald-800">
              Мэдээлэл бөглөх
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="number"
                min={0}
                placeholder="Хадгалах дүн (₮)"
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Харилцах дансны дугаар"
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              {selectedType === "term" && (
                <input
                  type="number"
                  min={1}
                  placeholder="Хугацаа (сар)"
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
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
                    className="w-full border border-emerald-300 p-3 rounded-lg text-gray-800 focus:outline-none"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Юунд зориулах вэ?"
                    className="w-full border border-emerald-300 p-3 rounded-lg text-gray-800 focus:outline-none"
                    value={goalPurpose}
                    onChange={(e) => setGoalPurpose(e.target.value)}
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Хугацаа (сар)"
                    className="w-full border border-emerald-300 p-3 rounded-lg text-gray-800 focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </>
              )}
              {selectedType === "green" && (
                <select
                  className="w-full border border-emerald-300 p-3 rounded-lg text-gray-800 focus:outline-none bg-white"
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
              className={`w-full p-3 rounded-lg text-lg font-semibold transition mt-6 ${
                isFormValid
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Гэрээ байгуулах
            </button>

            <button
              type="button"
              onClick={() => router.push("/home")}
              className="w-full mt-3 bg-gray-200 p-3 rounded-lg text-lg text-gray-700 font-semibold hover:bg-gray-300 transition"
            >
              Болих
            </button>
          </div>
        </>
      )}
    </div>
  );
}
