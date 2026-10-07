export class RedisCache {
  private cacheMap: Map<string, string> = new Map();

  public async get(key: string): Promise<string | null> {
    return this.cacheMap.get(key) || null;
  }

  public async set(key: string, value: string, ttlMs: number = 3600000): Promise<void> {
    this.cacheMap.set(key, value);
  }

  public async acquireLock(lockKey: string, ttlMs: number): Promise<boolean> {
    if (this.cacheMap.has(lockKey)) {
      return false; // Lock already held
    }
    this.cacheMap.set(lockKey, "LOCKED");
    return true;
  }

  public async releaseLock(lockKey: string): Promise<void> {
    this.cacheMap.delete(lockKey);
  }
}
