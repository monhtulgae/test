export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return; // SSR-safe
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;

  try {
    return JSON.parse(stored) as T;
  } catch (err) {
    console.error(`Error parsing localStorage for key "${key}"`, err);
    return defaultValue;
  }
}

export function clearStorage(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
