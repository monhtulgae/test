"use client";
import { useCallback } from "react";

export interface DigiTokenData {
  userId: string;
  balance: number;
}
export function useLocalTokens() {
  const loadAll = useCallback((): DigiTokenData[] => {
    try {
      const raw = localStorage.getItem("digipay_tokens");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);
  const saveAll = useCallback((data: DigiTokenData[]) => {
    localStorage.setItem("digipay_tokens", JSON.stringify(data));
  }, []);
  const getBalance = useCallback(
    (userId: string): number => {
      const all = loadAll();
      const found = all.find((t) => t.userId === userId);
      return found ? found.balance : 0;
    },
    [loadAll]
  );
  const setBalance = useCallback(
    (userId: string, amount: number) => {
      const all = loadAll();
      const idx = all.findIndex((t) => t.userId === userId);
      if (idx === -1) {
        all.push({ userId, balance: amount });
      } else {
        all[idx].balance = amount;
      }
      saveAll(all);
    },
    [loadAll, saveAll]
  );
  const addTokens = useCallback(
    (userId: string, plusAmount: number) => {
      const current = getBalance(userId);
      setBalance(userId, current + plusAmount);
    },
    [getBalance, setBalance]
  );
  return { getBalance, setBalance, addTokens };
}
