import { useEffect, useState } from 'react';

export interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

/**
 * Generic localStorage-backed state hook.
 * - Reads initial value from storage (key) with optional custom (de)serialization.
 * - Defaults to JSON serialization; falls back to raw string when parse fails.
 * - Persists on change; ignores storage errors.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>,
) {
  const { serialize, deserialize } = options || {};

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      if (deserialize) return deserialize(raw);
      // Try JSON first, then raw string as T
      try {
        return JSON.parse(raw) as T;
      } catch {
        return (raw as unknown) as T;
      }
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const out = serialize ? serialize(value) : JSON.stringify(value);
      localStorage.setItem(key, out);
    } catch {
      // ignore write errors
    }
  }, [key, value, serialize]);

  return [value, setValue] as const;
}

