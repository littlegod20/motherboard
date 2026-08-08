import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedbackRating, Prisma, Tier } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { ComponentResult } from '../ai/schemas/component-result.schema';
import { RedisService } from '../cache/redis.service';
import { ImageFetchService } from '../media/image-fetch.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuotaService } from '../users/quota.service';
import { CreateScanDto } from './dto/create-scan.dto';

@Injectable()
export class ScanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly redis: RedisService,
    private readonly quota: QuotaService,
    private readonly config: ConfigService,
    private readonly images: ImageFetchService,
  ) {}

  async createScan(userId: string, dto: CreateScanDto) {
    await this.enforceBurstLimit(userId);

    let user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    user = await this.quota.ensureQuotaWindow(user);

    if (this.quota.scansRemaining(user) <= 0) {
      throw new ForbiddenException({
        code: 'QUOTA_EXCEEDED',
        message: 'Monthly scan quota exceeded',
        details: {
          tier: user.tier,
          limit: this.quota.monthlyLimit(user.tier),
        },
      });
    }

    const image = await this.images.fetchAllowlistedImage(dto.imageUrl);
    const cacheKey = `scan:result:${image.hash}`;
    const ttl = this.config.get<number>('SCAN_CACHE_TTL_SEC', 86400);

    let result: ComponentResult;
    let provider = 'cache';
    let cacheHit = false;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      result = JSON.parse(cached) as ComponentResult;
      cacheHit = true;
    } else {
      const aiOut = await this.ai.identifyComponent(
        image.base64,
        image.mimeType,
      );
      result = aiOut.result;
      provider = aiOut.provider;
      await this.redis.set(cacheKey, JSON.stringify(result), ttl);
    }

    // Normalize confidence if model returned 0-100
    if (result.confidence > 1) {
      result.confidence = result.confidence / 100;
    }

    const scan = await this.prisma.scan.create({
      data: {
        userId,
        imageHash: image.hash,
        tapX: dto.tapX,
        tapY: dto.tapY,
        componentName: result.name,
        confidence: result.confidence,
        thumbnailUrl: dto.imageUrl,
        aiResponse: result as unknown as Prisma.InputJsonValue,
      },
    });

    if (!cacheHit) {
      await this.quota.consumeScan(userId);
    }

    return this.toScanResponse(
      scan.id,
      result,
      provider,
      cacheHit,
      scan.thumbnailUrl,
    );
  }

  async history(userId: string, page = 1, limit = 20, q?: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const take = user.tier === Tier.FREE ? Math.min(limit, 5) : Math.min(limit, 50);
    const skip = user.tier === Tier.FREE ? 0 : (page - 1) * take;

    const where: Prisma.ScanWhereInput = {
      userId,
      ...(q && user.tier === Tier.PRO
        ? { componentName: { contains: q, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.scan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.scan.count({ where: { userId } }),
    ]);

    return {
      items: items.map((s) => ({
        id: s.id,
        title: s.componentName,
        timestamp: s.createdAt.toISOString(),
        confidence: Math.round(s.confidence * 100),
        thumbnailUrl: s.thumbnailUrl,
      })),
      page: user.tier === Tier.FREE ? 1 : page,
      limit: take,
      total: user.tier === Tier.FREE ? Math.min(total, 5) : total,
    };
  }

  async getById(userId: string, scanId: string) {
    const scan = await this.prisma.scan.findFirst({
      where: { id: scanId, userId },
      include: { feedback: true },
    });
    if (!scan) {
      throw new NotFoundException({
        code: 'SCAN_NOT_FOUND',
        message: 'Scan not found',
      });
    }

    const result = scan.aiResponse as ComponentResult;
    return {
      ...this.toScanResponse(
        scan.id,
        result,
        'stored',
        false,
        scan.thumbnailUrl,
      ),
      feedback: scan.feedback?.rating?.toLowerCase() ?? null,
      createdAt: scan.createdAt.toISOString(),
    };
  }

  async submitFeedback(
    userId: string,
    scanId: string,
    rating: 'up' | 'down',
  ) {
    const scan = await this.prisma.scan.findFirst({
      where: { id: scanId, userId },
    });
    if (!scan) {
      throw new NotFoundException({
        code: 'SCAN_NOT_FOUND',
        message: 'Scan not found',
      });
    }

    const feedback = await this.prisma.scanFeedback.upsert({
      where: { scanId },
      create: {
        scanId,
        rating: rating === 'up' ? FeedbackRating.UP : FeedbackRating.DOWN,
      },
      update: {
        rating: rating === 'up' ? FeedbackRating.UP : FeedbackRating.DOWN,
      },
    });

    return { scanId, rating: feedback.rating.toLowerCase() };
  }

  private async enforceBurstLimit(userId: string) {
    const limit = this.config.get<number>('BURST_RATE_LIMIT', 5);
    const windowSec = this.config.get<number>('BURST_RATE_WINDOW_SEC', 60);
    const { allowed } = await this.redis.checkRateLimit(
      `user:${userId}:scan`,
      limit,
      windowSec,
    );
    if (!allowed) {
      throw new HttpException(
        {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Try again shortly.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private toScanResponse(
    scanId: string,
    result: ComponentResult,
    provider: string,
    cacheHit: boolean,
    imageUrl?: string | null,
  ) {
    const confidencePct = Math.round(result.confidence * 100);
    return {
      scanId,
      id: scanId,
      name: result.name,
      designator: result.designator,
      confidence: confidencePct,
      type: result.type,
      package: result.package,
      voltage: result.voltage,
      related: result.related,
      knownFailureSigns: result.knownFailureSigns,
      category: result.category,
      description: result.description,
      upgradeNotes: result.upgradeNotes,
      specifications: result.specifications,
      imageUrl: imageUrl ?? null,
      provider,
      cacheHit,
    };
  }
}
