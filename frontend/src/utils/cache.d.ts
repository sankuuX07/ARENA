/**
 * Simple in-memory promise caching utility to prevent duplicate inflight API requests
 * and cache successful GET requests for a short TTL (e.g., 30s) to improve dashboard responsiveness.
 */
export declare const memoizePromise: <T>(key: string, fetcher: () => Promise<T>, ttlMs?: number) => Promise<T>;
export declare const clearCache: (keyPattern?: string) => void;
//# sourceMappingURL=cache.d.ts.map