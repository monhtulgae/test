"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import greenAnimation from "@/public/animations/green.json";
import { useUserId } from "@/app/hooks/useUserId";
import { useProjects } from "@/app/hooks/useProjects";
import { useLocalTokens } from "@/app/hooks/useLocalTokens";
import { Projects } from "@/app/type/Project";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSavings";

export default function GreenSavingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const userId = useUserId();

  const { getById } = useLocalSavings();
  const { loadAll: loadProjects } = useProjects();
  const { getBalance } = useLocalTokens();

  const [saving, setSaving] = useState<Saving | null>(null);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    if (!userId || !id) return;

    const savingData = getById(userId, id as string);
    console.log(savingData);
    setSaving(savingData ?? null);

    loadProjects().then((res) => {
      console.log("Loaded projects:", res);
      setProjects(res);
    });
    setTokens(getBalance(userId));
  }, [id, userId, getById, loadProjects, getBalance]);

  const selectedProject = useMemo(() => {
    if (!saving) return null;
    return projects.find((p) => p.id === Number(saving.projectId)) || null;
  }, [saving, projects]);

  const fmtMoney = (n: number | undefined) =>
    `₮${(n ?? 0).toLocaleString("mn-MN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (!saving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-6 text-white">
        <button onClick={() => router.back()} className="mb-4">
          <Image src="/images/arrow.png" alt="back" width={22} height={22} />
        </button>
        <p>Хадгаламж олдсонгүй.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          className="text-white/90 hover:text-white transition"
          onClick={() => router.back()}
        >
          <Image src="/images/arrow.png" alt="back" width={22} height={22} />
        </button>
        <h1 className="text-2xl font-bold text-white">Миний хөрөнгө</h1>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-emerald-800">{saving.type}</h2>
        <p className="mt-2 text-gray-700">{saving.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard label="Миний хөрөнгө" value={fmtMoney(saving.amount)} />
        <InfoCard label="Жилийн өгөөж (IRR)" value={`${saving.interest}%`} />
        <InfoCard
          label="Төслийн нийт хөрөнгө"
          value={fmtMoney(selectedProject?.budget)}
        />
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg">
        <Lottie animationData={greenAnimation} loop className="w-full h-60" />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-5 shadow text-center">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-xl font-bold text-emerald-800 mt-2">{value}</p>
    </div>
  );
}
