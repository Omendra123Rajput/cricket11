// Simple in-memory cache with TTL for serverless
// Resets on cold start — fine for friend-scale usage

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function cacheClear(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

// TTL constants
export const CACHE_TTL = {
  SCORES: 30 * 1000,       // 30 seconds
  STATS: 5 * 60 * 1000,    // 5 minutes
  SCHEDULE: 60 * 60 * 1000, // 1 hour
} as const;
