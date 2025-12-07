
type CacheEntry<T> = {
    value: T;
    expiry: number;
};

class InMemoryCache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    set(key: string, value: any, ttlSeconds: number) {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { value, expiry });
    }

    get(key: string) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }
}

export const statsCache = new InMemoryCache();
