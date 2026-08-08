import { Tier } from '@prisma/client';
import { QuotaService } from './quota.service';

describe('QuotaService', () => {
  const config = {
    get: (key: string, def?: number) => {
      if (key === 'FREE_MONTHLY_SCAN_LIMIT') return 10;
      if (key === 'PRO_MONTHLY_SCAN_LIMIT') return 300;
      return def;
    },
  };

  const prisma = {
    user: {
      update: jest.fn(),
    },
  };

  const service = new QuotaService(prisma as never, config as never);

  it('computes remaining scans', () => {
    const remaining = service.scansRemaining({
      tier: Tier.FREE,
      scansUsedThisMonth: 3,
    } as never);
    expect(remaining).toBe(7);
  });

  it('uses pro limit', () => {
    expect(service.monthlyLimit(Tier.PRO)).toBe(300);
  });
});
