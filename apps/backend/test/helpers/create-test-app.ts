import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AllExceptionsFilter } from '../../src/common/filters/http-exception.filter';
import { RequestIdInterceptor } from '../../src/common/interceptors/request-id.interceptor';
import { AiService } from '../../src/ai/ai.service';

export const mockComponentResult = {
  name: 'Electrolytic Capacitor',
  designator: 'C47 · Main VRM Filter Bank',
  confidence: 0.96,
  type: 'Aluminum Electrolytic',
  package: 'Radial, 8x11mm',
  voltage: '16V',
  related: 'VRM MOSFETs, PWM Controller',
  knownFailureSigns: ['Bulging or domed top vent'],
  category: 'Power Delivery',
  description: 'Filters power on the VRM rail.',
  upgradeNotes: 'Match voltage and ESR when replacing.',
  specifications: { voltage: '16V' },
};

export const mockAiService: Pick<
  AiService,
  'identifyComponent' | 'analyzeTriageCheck'
> = {
  identifyComponent: async () => ({
    result: mockComponentResult,
    provider: 'mock',
  }),
  analyzeTriageCheck: async () => ({
    result: {
      status: 'pass' as const,
      confidence: 0.94,
      resultText: 'No issues detected.',
      findings: ['Looks healthy'],
    },
    provider: 'mock',
  }),
};

export async function createTestApp(
  aiOverride: Partial<AiService> = mockAiService as AiService,
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(AiService)
    .useValue(aiOverride)
    .compile();

  const app = moduleFixture.createNestApplication({ bodyParser: true });
  app.setGlobalPrefix('api/v1', { exclude: ['health', 'ready'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new RequestIdInterceptor());
  await app.init();
  // Ensure HTTP server is listening for supertest
  await app.listen(0);
  return app;
}

/** Minimal valid 1x1 PNG */
export const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
