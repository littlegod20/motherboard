import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;
  private ready = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      enableReadyCheck: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    });

    this.client.on('error', (err) => {
      this.ready = false;
      this.logger.warn(`Redis error: ${err.message}`);
    });
    this.client.on('ready', () => {
      this.ready = true;
      this.logger.log('Redis ready');
    });

    try {
      await this.client.connect();
      this.ready = true;
    } catch (err) {
      this.ready = false;
      this.logger.warn(
        `Redis unavailable at startup: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        this.client.disconnect();
      } catch {
        // ignore
      }
    }
  }

  isReady(): boolean {
    return this.ready && this.client?.status === 'ready';
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isReady()) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSec?: number): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      if (ttlSec) {
        await this.client.set(key, value, 'EX', ttlSec);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch {
      return false;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client.del(key);
    } catch {
      // ignore
    }
  }

  /**
   * Sliding-window rate limit. Returns true if allowed.
   * Fail-closed when Redis is down (returns false).
   */
  async checkRateLimit(
    key: string,
    limit: number,
    windowSec: number,
  ): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.isReady()) {
      return { allowed: false, remaining: 0 };
    }

    const now = Date.now();
    const windowStart = now - windowSec * 1000;
    const redisKey = `rl:${key}`;

    try {
      const multi = this.client.multi();
      multi.zremrangebyscore(redisKey, 0, windowStart);
      multi.zadd(redisKey, now.toString(), `${now}-${Math.random()}`);
      multi.zcard(redisKey);
      multi.expire(redisKey, windowSec);
      const results = await multi.exec();
      const count = (results?.[2]?.[1] as number) ?? limit + 1;
      const allowed = count <= limit;
      return { allowed, remaining: Math.max(0, limit - count) };
    } catch {
      return { allowed: false, remaining: 0 };
    }
  }

  async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
