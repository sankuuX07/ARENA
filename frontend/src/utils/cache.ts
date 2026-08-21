/**
 * Simple in-memory promise caching utility to prevent duplicate inflight API requests
 * and cache successful GET requests for a short TTL (e.g., 30s) to improve dashboard responsiveness.
 */

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const memoizePromise = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 30000 // Default TTL: 30 seconds
): Promise<T> => {
  const now = Date.now();
  const cached = cache.get(key);

  // If we have a cached promise and it hasn't expired, return it
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.promise;
  }

  // Otherwise, create a new promise, cache it, and execute the fetcher
  const promise = fetcher().catch((err) => {
    // If it fails, remove from cache so we can try again immediately next time
    cache.delete(key);
    throw err;
  });

  cache.set(key, { promise, timestamp: now });
  return promise;
};

export const clearCache = (keyPattern?: string) => {
  if (!keyPattern) {
    cache.clear();
    return;
  }
  
  const keys = Array.from(cache.keys());
  for (const k of keys) {
    if (k.includes(keyPattern)) {
      cache.delete(k);
    }
  }
};
