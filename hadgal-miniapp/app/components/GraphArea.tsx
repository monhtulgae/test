"use client";

import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage"; 
import PieChart from "./Chart";
import { CgKey } from "react-icons/cg";

type NumberProps = {
  amount: number;
  interest: number;
};

type ProjectData = {
  id: number;
  name: string;
  value: number;
  interest: number;
};

export default function GraphArea({ interest }: NumberProps) {

  const orgData: ProjectData[] = [
    { id:1, name: "Лантуун Дохио", value: 100000, interest: 0 },
    { id:2, name: "Хүүхэд хамгаалал арга зүйн төв", value: 0, interest: 0 },
    { id:3, name: "Монголын эмэгтэйчүүдийн сан", value: 0, interest: 0 },
    { id:4, name: "Хөөрхөн зүрх", value: 0, interest: 0 },
    { id:5, name: "Хүчирхийллийн эсрэг үндэсний төв", value: 0, interest: 0 },
    { id:6, name: "Хүүхэд хамгааллын үндэсний сүлжээ", value: 0, interest: 0 },
  ];

  const projData: ProjectData[] = [
    { id:1, name: "Говийн Нарны Цахилгаан Станц", value: 100000, interest: 2.3 },
    { id:2, name: "Салхит Салхин Цахилгаан Станц", value: 0, interest: 3 },
    { id:3, name: "Улаанбаатар Ногоон Дээвэр төсөл", value: 0, interest: 4.3 },
    { id:4, name: "Хаягдал багатай түлш", value: 0, interest: 2.1 },
    { id:5, name: "Био газ төсөл", value: 0, interest: 5 },
    { id:6, name: "Малын хаягдал арьс ширийг боловсруулах төсөл", value: 0, interest: 3 },
    { id:7, name: "Ойжуулалт", value: 0, interest: 2.9 },
    { id:8, name: "Эко-Жуулчлалын Маршрут (Тэрэлж)", value: 0, interest: 3.1 },
  ];

  const defaultData = interest === -1 ? orgData : projData;
  const nameType = interest === -1 ? "organizations" : "projects";

  const [dList, setDList] = useState<ProjectData[]>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage<ProjectData[]>(`${nameType}`, defaultData);
    setDList(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(`${nameType}`, dList);
    }
  }, [dList, isLoaded]);

  const amount = () => {
    let total = 0;
    for (const d of dList) {
      total += d.value;
    }

    return total.toLocaleString("mn-MN", {maximumFractionDigits: 0});
  }

  const rate = () => {
    let total = 0;

    for (const d of dList) {
      total += d.interest * d.value;
    }

    return (total / 100).toLocaleString("mn-MN", {maximumFractionDigits: 0});
  }

  return (
    <div className="my-2 bg-white p-3">
      {interest === -1 ? (
        <div className="mb-3">Нийт хандивласан: {amount()}</div>
      ) : (
        <>
          <div className="mb-3">Нийт хөрөнгө оруулалт: {amount()}</div>
          <div className="mb-3">Нийт ашиг: {rate()}</div>
        </>
      )}
 
      <hr />

      <div className="">
        <p>{interest === -1 ? "Хандивласан төсөл" : "Хөрөнгө оруулсан төсөл"}</p>
        <div className="relative z-10 w-full max-w-sm mx-auto overflow-visible aspect-square">
          <PieChart 
            data={dList}
          />
        </div>
      </div>
    </div>
  );
}
