"use client";
import { useCallback } from "react";

export type Saving = {
  id: string;
  userId: string;
  type: string;
  typeId: number;
  amount: number;
  interest: number;
  openedAt: string;
  dans: string;
  projectId?: number;
  description: string;
  budget: number;
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
      }
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

  return { getAll, create, getById, remove };
}
