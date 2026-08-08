import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tier, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  monthlyLimit(tier: Tier): number {
    return tier === Tier.PRO
      ? this.config.get<number>('PRO_MONTHLY_SCAN_LIMIT', 300)
      : this.config.get<number>('FREE_MONTHLY_SCAN_LIMIT', 10);
  }

  async ensureQuotaWindow(user: User): Promise<User> {
    const now = new Date();
    const resetAt = new Date(user.scanQuotaResetAt);
    const needsReset =
      now.getUTCFullYear() > resetAt.getUTCFullYear() ||
      (now.getUTCFullYear() === resetAt.getUTCFullYear() &&
        now.getUTCMonth() > resetAt.getUTCMonth());

    if (!needsReset) {
      return user;
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        scansUsedThisMonth: 0,
        scanQuotaResetAt: now,
      },
    });
  }

  scansRemaining(user: User): number {
    return Math.max(0, this.monthlyLimit(user.tier) - user.scansUsedThisMonth);
  }

  async consumeScan(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { scansUsedThisMonth: { increment: 1 } },
    });
  }
}
