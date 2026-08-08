import { SetMetadata } from '@nestjs/common';

export const REQUIRED_TIER_KEY = 'requiredTier';
export type RequiredTier = 'FREE' | 'PRO';
export const RequiresTier = (tier: RequiredTier) =>
  SetMetadata(REQUIRED_TIER_KEY, tier);
