"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import greenAnimation from "@/public/animations/green.json";
import termAnimation from "@/public/animations/lock.json";
import nonTermAnimation from "@/public/animations/cashflow.json";
import goalAnimation from "@/public/animations/target.json";
import { useUserId } from "@/app/hooks/useUserId";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSavings";

export default function SavingsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const userId = useUserId();
  const { getById } = useLocalSavings();

  const [saving, setSaving] = useState<Saving | null>(null);

  const formatAccount = (s: string) => (s || "").replace(/(.{4})/g, "$1 ").trim();
  const fmtMoney = (n: number) =>
    `₮${(n ?? 0).toLocaleString("mn-MN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const fmtDate = (d: Date) => d.toISOString().split("T")[0];
  const addDays = (d: Date, days: number) => {
    const t = new Date(d);
    t.setDate(t.getDate() + days);
    return t;
  };
  const diffDays = (from: Date, to: Date) => {
    const ms = to.getTime() - from.getTime();
    return Math.max(0, Math.floor(ms / 86_400_000));
  };

  useEffect(() => {
    if (!userId || !id) return;
    const data = getById(userId, id as string);
    setSaving(data ?? null);
  }, [id, userId, getById]);

  const computed = useMemo(() => {
    if (!saving) {
      return {
        dayInterest: 0,
        dayInterestStr: "-",
        accumulatedInterestStr: "-",
        maturityInterestStr: "-",
        interestDateStr: "-",
        nextInterestDateStr: "-",
        daysSoFar: 0,
      };
    }

    const amount = Number(saving.amount) || 0;
    const annualRate = Number(saving.interest) || 0;
    const opened = new Date(saving.openedAt);
    const today = new Date();

    const dayInterest = (amount * (annualRate / 100)) / 365;
    const daysSoFar = diffDays(opened, today);
    const accumulatedInterest = dayInterest * daysSoFar;

    let maturityInterest: number | null = null;
    if (saving.typeId === "term" || saving.typeId === "goal") {
      const durationMonths = Number((saving as any).durationMonths) || 0;
      maturityInterest = amount * (annualRate / 100) * (durationMonths / 12);
    }

    const interestDate = addDays(opened, 30);
    const nextInterestDate = addDays(today, 60);

    return {
      dayInterest,
      dayInterestStr: fmtMoney(dayInterest),
      accumulatedInterestStr: fmtMoney(accumulatedInterest),
      maturityInterestStr: maturityInterest !== null ? fmtMoney(maturityInterest) : "-",
      interestDateStr: fmtDate(interestDate),
      nextInterestDateStr: fmtDate(nextInterestDate),
      daysSoFar,
    };
  }, [saving]);

  if (!saving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            className="text-white/90 hover:text-white transition"
            onClick={() => router.back()}
          >
            <Image src="/images/arrow-left.png" alt="back" width={22} height={22} />
          </button>
          <h1 className="text-2xl font-bold text-white">Хадгаламж олдсонгүй</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-white/90">
            Танайд тохирох хадгаламжийн мэдээлэл илэрсэнгүй. Буцах товчийг дарж жагсаалт руу орно уу.
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/home")}
              className="px-5 py-3 rounded-xl font-semibold bg-white text-emerald-800 hover:bg-emerald-50 transition"
            >
              Нүүр хуудас руу
            </button>
          </div>
        </div>
      </div>
    );
  }

  const animationData =
    saving.typeId === "term"
      ? termAnimation
      : saving.typeId === "non-term"
      ? nonTermAnimation
      : saving.typeId === "goal"
      ? goalAnimation
      : greenAnimation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 mb-0">
      <div className="w-full h-2">
      </div>
      <div className="flex items-center justify-between mb-6 mt-2 ml-3">
        <div className="flex items-center gap-3">
          <button
            className="text-white/90 hover:text-white transition"
            onClick={() => router.back()}
            aria-label="Буцах"
          >
            <Image src="/images/arrow.png" alt="back" width={22} height={22} />
          </button>
          <h1 className="text-2xl font-bold text-white">Хуримтлал дэлгэрэнгүй</h1>
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl p-5 shadow-xl m-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-black/90 text-sm">Нийт үлдэгдэл</p>
            <p className="text-2xl sm:text-4xl font-extrabold text-black/90 mt-1">
              {fmtMoney(Number(saving.amount) || 0)}
            </p>
            <p className="text-black/90 text-lg mt-2">
              {saving.typeId === "term"
                ? "Хугацаатай хадгаламж"
                : saving.typeId === "green"
                ? "Ногоон хадгаламж"
                : saving.typeId === "goal"
                ? "Зорилготой хадгаламж"
                : "Хугацаагүй хадгаламж"}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <InfoPill label="Өдрийн хүү дүн" value={computed.dayInterestStr} />
          <InfoPill label="Хуримтлагдсан хүү дүн" value={computed.accumulatedInterestStr} />
          <InfoPill
            label="Эцсийн хүү (хугацаа) дүн"
            value={computed.maturityInterestStr}
          />
        </div>
      </div>

      <div className="rounded-3xl shadow-lg">
        <div className="bg-white/5 rounded-xl p-6 shadow-lg m-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <DetailRow label="Хүү (жилийн)" value={`${saving.interest}%`} />
          <DetailRow label="Дансны дугаар" value={formatAccount(saving.id)} />
          <DetailRow label="Харилцах данс" value={formatAccount(saving.dans)} />
          <DetailRow label="Нээсэн огноо" value={saving.openedAt} />
          {saving.typeId === "term" && (
            <DetailRow
              label="Хугацаа"
              value={`${(saving as any).durationMonths} сар`}
            />
          )}
          {saving.typeId === "goal" && (
            <>
              <DetailRow
                label="Зорилгын нийт дүн"
                value={fmtMoney(Number((saving as any).goalAmount) || 0)}
              />
              <DetailRow label="Зорилго" value={(saving as any).goalPurpose} />
              <DetailRow
                label="Хугацаа"
                value={`${(saving as any).durationMonths} сар`}
              />
            </>
          )}
          {saving.typeId === "green" && (
            <DetailRow label="Ногоон төсөл" value={(saving as any).greenType} />
          )}
          <DetailRow label="Анхны хүү олголт (огноо)" value={computed.interestDateStr} />
          <DetailRow label="Дараагийн олголт (огноо)" value={computed.nextInterestDateStr} />
        </div>
      </div>
        <div className=" overflow-hidden rounded-2xl m-3 mb-0">
          <Lottie animationData={animationData} loop className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/3">
      <span className="text-white-700">{label}</span>
      <span className="font-semibold text-white-900 text-right ml-4 break-words">
        {value || "-"}
      </span>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white backdrop-blur-md px-4 py-3 text-white shadow">
      <p className="text-black/90 text-sm">{label}</p>
      <p className="text-lg font-bold mt-1 text-black">{value}</p>
    </div>
  );
}
