"use client";
import { useCallback } from "react";

export type Saving =
  | {
      id: string;
      userId: string;
      type: string;
      typeId: "term";
      dans: string;
      amount: number;
      interest: number;
      openedAt: string;
      durationMonths: number;
      date_interest: string;
      total_interest: string;
      interest_date: string;
      next_interest: string;
    }
  | {
      id: string;
      userId: string;
      type: string;
      typeId: "non-term";
      dans: string;
      amount: number;
      interest: number;
      openedAt: string;
      date_interest: string;
      total_interest: string;
      interest_date: string;
      next_interest: string;
    }
  | {
      id: string;
      userId: string;
      type: string;
      typeId: "goal";
      dans: string;
      amount: number;
      interest: number;
      openedAt: string;
      durationMonths: number;
      goalAmount: number;
      goalPurpose: string;
      date_interest: string;
      total_interest: string;
      interest_date: string;
      next_interest: string;
    }
  | {
      id: string;
      userId: string;
      type: string;
      typeId: "green";
      dans: string;
      amount: number;
      interest: number;
      openedAt: string;
      greenType: string;
      date_interest: string;
      total_interest: string;
      interest_date: string;
      next_interest: string;
    };

export function useLocalSavings() {
  const loadAll = useCallback((): Saving[] => {
    try {
      const raw = localStorage.getItem("savings");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveAll = useCallback((data: Saving[]) => {
    localStorage.setItem("savings", JSON.stringify(data));
  }, []);

  const getAll = useCallback(
    (userId: string): Saving[] => {
      return loadAll().filter((s) => s.userId === userId);
    },
    [loadAll]
  );

  const getById = useCallback(
    (userId: string, id: string): Saving | undefined => {
      return loadAll().find((s) => s.userId === userId && s.id === id);
    },
    [loadAll]
  );

  const create = useCallback(
    (saving: Saving): Saving => {
        const all = loadAll();
        const newItem: Saving = {
        ...saving,
        id: Date.now().toString(),
        };
        all.push(newItem);
        saveAll(all);
        return newItem;
    },
    [loadAll, saveAll]
    );

  const remove = useCallback(
    (userId: string, id: string) => {
      const all = loadAll();
      const filtered = all.filter(
        (s) => !(s.userId === userId && s.id === id)
      );
      saveAll(filtered);
    },
    [loadAll, saveAll]
  );

  return { getAll, getById, create, remove };
}
