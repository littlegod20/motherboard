import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuotaService } from './quota.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly quota: QuotaService,
  ) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  }

  async getProfile(userId: string) {
    let user = await this.findById(userId);
    user = await this.quota.ensureQuotaWindow(user);
    const limit = this.quota.monthlyLimit(user.tier);

    return {
      id: user.id,
      email: user.email,
      tier: user.tier,
      scansUsedThisMonth: user.scansUsedThisMonth,
      scansRemaining: this.quota.scansRemaining(user),
      monthlyLimit: limit,
      subscriptionStatus: user.tier === 'PRO' ? 'active' : 'none',
      stripeCustomerId: user.stripeCustomerId,
      createdAt: user.createdAt,
    };
  }
}
