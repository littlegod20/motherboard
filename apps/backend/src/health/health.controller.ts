import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../cache/redis.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('ready')
  async ready() {
    let dbOk = false;
    let redisOk = false;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    redisOk = await this.redis.ping();

    if (!dbOk || !redisOk) {
      throw new ServiceUnavailableException({
        code: 'NOT_READY',
        message: 'Dependencies unavailable',
        details: { database: dbOk, redis: redisOk },
      });
    }

    return {
      status: 'ready',
      database: true,
      redis: true,
      timestamp: new Date().toISOString(),
    };
  }
}
