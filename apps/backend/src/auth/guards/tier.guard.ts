import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  REQUIRED_TIER_KEY,
  RequiredTier,
} from '../../common/decorators/requires-tier.decorator';
import { AuthUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class TierGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredTier>(
      REQUIRED_TIER_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required === 'FREE') {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;
    if (!user || user.tier !== 'PRO') {
      throw new ForbiddenException({
        code: 'PRO_REQUIRED',
        message: 'Pro subscription required',
      });
    }
    return true;
  }
}
