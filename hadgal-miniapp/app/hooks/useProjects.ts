"use client";
import { useCallback } from "react";
import { Projects } from "@/app/type/Project";
import rawData from "@/app/data/projects.json";

export function useProjects() {
  const loadAll = useCallback(async (): Promise<Projects[]> => {
    try {
      return rawData as Projects[];
    } catch (error) {
      console.error("Error loading local projects:", error);
      return [];
    }
  }, []);

  const getById = useCallback(async (id: number): Promise<Projects | undefined> => {
    try {
      return (rawData as Projects[]).find((p) => p.id === id);
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  }, []);

  return { loadAll, getById };
}
