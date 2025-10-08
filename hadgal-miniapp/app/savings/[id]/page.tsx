"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import greenAnimation from "@/public/animations/green.json";
import termAnimation from "@/public/animations/lock.json";
import nonTermAnimation from "@/public/animations/cashflow.json";
import goalAnimation from "@/public/animations/target.json";
import { useUserId } from "../../hooks/useUserId";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSavings";

export default function SavingsDetailPage() {
  const { id } = useParams();
  const userId = useUserId();
  const { getById } = useLocalSavings();
  const router = useRouter();
  const formatAccount = (id: string) => id.replace(/(.{4})/g, "$1 ").trim();
  const [saving, setSaving] = useState<Saving | null>(null);

  useEffect(() => {
    if (!userId || !id) return;
    const data = getById(userId, id as string);
    setSaving(data ?? null);
  }, [id, userId, getById]);

  const fmtMoney = (n: number) =>
    `₮${(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtDate = (d: Date) => d.toISOString().split("T")[0];

  const addDays = (d: Date, days: number) => {
    const t = new Date(d);
    t.setDate(t.getDate() + days);
    return t;
  };

  const diffDays = (from: Date, to: Date) => {
    const ms = to.getTime() - from.getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  };

  const computed = useMemo(() => {
    if (!saving) {
      return {
        dayInterestStr: "-",
        accumulatedInterestStr: "-",
        maturityInterestStr: "-",
        interestDateStr: "-",
        nextInterestDateStr: "-",
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
      maturityInterest = (amount * (annualRate / 100)) * (durationMonths / 12);
    }
    const interestDate = opened;
    const nextInterestDate = addDays(today, 30);

    return {
      dayInterestStr: fmtMoney(dayInterest),
      accumulatedInterestStr: fmtMoney(accumulatedInterest),
      maturityInterestStr: maturityInterest !== null ? fmtMoney(maturityInterest) : "-",
      interestDateStr: fmtDate(interestDate),
      nextInterestDateStr: fmtDate(nextInterestDate),
    };
  }, [saving]);

  if (!saving) return <div className="p-4">Хуримтлал олдсонгүй</div>;

  const animationData =
    saving.typeId === "term"
      ? termAnimation
      : saving.typeId === "non-term"
      ? nonTermAnimation
      : saving.typeId === "goal"
      ? goalAnimation
      : greenAnimation;

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex items-center mb-4">
        <button
          className="text-gray-600 hover:text-black mr-2"
          onClick={() => router.back()}
        >
          <Image src="/images/arrow-left.png" alt="back" width={20} height={20} />
        </button>
        <h1 className="text-xl font-bold text-black">Хуримтлал дэлгэрэнгүй</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-2">
        <DetailRow label="Дансны нэр" value={saving.type} />
        <DetailRow label="Дансны дугаар" value={saving.id} />
        <DetailRow label="Харилцах дансны дугаар" value={formatAccount(saving.dans)} />
        <DetailRow label="Нийт үлдэгдэл" value={fmtMoney(Number(saving.amount) || 0)} />
        <DetailRow label="Хүү" value={`${saving.interest}%`} />
        <DetailRow label="Данс нээсэн огноо" value={saving.openedAt} />
        {saving.typeId === "term" && (
          <DetailRow label="Хугацаа" value={`${(saving as any).durationMonths} сар`} />
        )}
        {saving.typeId === "goal" && (
          <>
            <DetailRow label="Зорилгын нийт дүн" value={fmtMoney(Number((saving as any).goalAmount) || 0)} />
            <DetailRow label="Зорилгын зорилго" value={(saving as any).goalPurpose} />
            <DetailRow label="Хугацаа" value={`${(saving as any).durationMonths} сар`} />
          </>
        )}
        {saving.typeId === "green" && (
          <DetailRow label="Ногоон төсөл" value={(saving as any).greenType} />
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-2">
        <DetailRow label="Өдрийн хүү" value={computed.dayInterestStr} />
        <DetailRow label="Хуримтлагдсан хүү" value={computed.accumulatedInterestStr} />
        <DetailRow label="Хугацааны эцэст олгогдох хүү" value={computed.maturityInterestStr} />
        <DetailRow label="Хүү олгосон огноо" value={computed.interestDateStr} />
        <DetailRow label="Дараагийн хүү олгох огноо" value={computed.nextInterestDateStr} />
      </div>

      <div className="relative bg-gray-100 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-center h-80">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}