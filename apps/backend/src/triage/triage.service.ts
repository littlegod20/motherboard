import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  TriageCheckStatus,
  TriageSessionStatus,
} from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { RedisService } from '../cache/redis.service';
import { decodeImagePayload } from '../common/utils/image.util';
import { PrismaService } from '../prisma/prisma.service';
import { QuotaService } from '../users/quota.service';
import { DEFAULT_TRIAGE_CHECKLIST } from './triage.checklist';

@Injectable()
export class TriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly redis: RedisService,
    private readonly quota: QuotaService,
    private readonly config: ConfigService,
  ) {}

  async createSession(userId: string) {
    const session = await this.prisma.triageSession.create({
      data: {
        userId,
        checks: {
          create: DEFAULT_TRIAGE_CHECKLIST.map((item) => ({
            checkKey: item.checkKey,
            label: item.label,
            detail: item.detail,
            status: TriageCheckStatus.PENDING,
          })),
        },
      },
      include: { checks: { orderBy: { createdAt: 'asc' } } },
    });

    return this.toSessionResponse(session);
  }

  async listSessions(userId: string, page = 1, limit = 20) {
    const take = Math.min(limit, 50);
    const skip = (page - 1) * take;
    const [items, total] = await Promise.all([
      this.prisma.triageSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { checks: true },
      }),
      this.prisma.triageSession.count({ where: { userId } }),
    ]);

    return {
      items: items.map((s) => ({
        id: s.id,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
        completedAt: s.completedAt?.toISOString() ?? null,
        completedChecks: s.checks.filter((c) => c.status !== 'PENDING').length,
        totalChecks: s.checks.length,
        primarySuspect: s.primarySuspect,
      })),
      page,
      limit: take,
      total,
    };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await this.findOwnedSession(userId, sessionId);
    return this.toSessionResponse(session);
  }

  async analyzeCheck(
    userId: string,
    sessionId: string,
    checkKey: string,
    imagePayload: string,
  ) {
    await this.enforceBurstLimit(userId);

    let user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    user = await this.quota.ensureQuotaWindow(user);
    if (this.quota.scansRemaining(user) <= 0) {
      throw new ForbiddenException({
        code: 'QUOTA_EXCEEDED',
        message: 'Monthly scan quota exceeded',
      });
    }

    const session = await this.findOwnedSession(userId, sessionId);
    if (session.status === TriageSessionStatus.COMPLETED) {
      throw new BadRequestException({
        code: 'SESSION_COMPLETED',
        message: 'Triage session already completed',
      });
    }

    const check = session.checks.find((c) => c.checkKey === checkKey);
    if (!check) {
      throw new NotFoundException({
        code: 'CHECK_NOT_FOUND',
        message: `Unknown check key: ${checkKey}`,
      });
    }

    const template = DEFAULT_TRIAGE_CHECKLIST.find(
      (c) => c.checkKey === checkKey,
    );
    const image = decodeImagePayload(imagePayload);
    const cacheKey = `triage:result:${image.hash}:${checkKey}`;
    const ttl = this.config.get<number>('SCAN_CACHE_TTL_SEC', 86400);

    let cacheHit = false;
    let provider = 'cache';
    let aiResult: {
      status: 'pass' | 'fail' | 'pending';
      confidence: number;
      resultText: string;
      findings: string[];
    };

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      aiResult = JSON.parse(cached);
      cacheHit = true;
    } else {
      const out = await this.ai.analyzeTriageCheck(
        image.base64,
        image.mimeType,
        check.label,
        check.detail,
      );
      aiResult = out.result;
      provider = out.provider;
      await this.redis.set(cacheKey, JSON.stringify(aiResult), ttl);
      await this.quota.consumeScan(userId);
    }

    if (aiResult.confidence > 1) {
      aiResult.confidence = aiResult.confidence / 100;
    }

    const statusMap: Record<string, TriageCheckStatus> = {
      pass: TriageCheckStatus.PASS,
      fail: TriageCheckStatus.FAIL,
      pending: TriageCheckStatus.PENDING,
    };

    const updated = await this.prisma.triageCheckResult.update({
      where: { id: check.id },
      data: {
        status: statusMap[aiResult.status] ?? TriageCheckStatus.PENDING,
        confidence: aiResult.confidence,
        resultText: aiResult.resultText,
        imageHash: image.hash,
        aiResponse: {
          ...aiResult,
          provider,
          cacheHit,
          instructions: template?.instructions,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      sessionId,
      checkKey: updated.checkKey,
      label: updated.label,
      detail: updated.detail,
      status: updated.status.toLowerCase(),
      confidence: Math.round((updated.confidence ?? 0) * 100),
      resultText: updated.resultText,
      instructions: template?.instructions,
      provider,
      cacheHit,
    };
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.findOwnedSession(userId, sessionId);
    const fails = session.checks
      .filter((c) => c.status === TriageCheckStatus.FAIL)
      .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));

    const primarySuspect =
      fails.length > 0
        ? {
            title: `${fails[0].label} — Fault Detected`,
            confidence: Math.round((fails[0].confidence ?? 0) * 100),
            detail: fails[0].resultText ?? fails[0].detail,
            checkKey: fails[0].checkKey,
          }
        : {
            title: 'No primary fault detected',
            confidence: 0,
            detail: 'All completed checks passed or remain pending.',
            checkKey: null,
          };

    const updated = await this.prisma.triageSession.update({
      where: { id: sessionId },
      data: {
        status: TriageSessionStatus.COMPLETED,
        completedAt: new Date(),
        primarySuspect: primarySuspect as Prisma.InputJsonValue,
      },
      include: { checks: { orderBy: { createdAt: 'asc' } } },
    });

    return this.toSessionResponse(updated);
  }

  private async findOwnedSession(userId: string, sessionId: string) {
    const session = await this.prisma.triageSession.findFirst({
      where: { id: sessionId, userId },
      include: { checks: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Triage session not found',
      });
    }
    return session;
  }

  private async enforceBurstLimit(userId: string) {
    const limit = this.config.get<number>('BURST_RATE_LIMIT', 5);
    const windowSec = this.config.get<number>('BURST_RATE_WINDOW_SEC', 60);
    const { allowed } = await this.redis.checkRateLimit(
      `user:${userId}:triage`,
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

  private toSessionResponse(
    session: Prisma.TriageSessionGetPayload<{
      include: { checks: true };
    }>,
  ) {
    const templateMap = new Map(
      DEFAULT_TRIAGE_CHECKLIST.map((c) => [c.checkKey, c]),
    );

    return {
      id: session.id,
      status: session.status,
      createdAt: session.createdAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
      primarySuspect: session.primarySuspect,
      checks: session.checks.map((c) => ({
        id: c.checkKey,
        checkKey: c.checkKey,
        label: c.label,
        detail: c.detail,
        status: c.status.toLowerCase(),
        confidence:
          c.confidence != null ? Math.round(c.confidence * 100) : undefined,
        resultText: c.resultText ?? undefined,
        instructions: templateMap.get(c.checkKey)?.instructions,
      })),
    };
  }
}
