import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  createTestApp,
  TINY_PNG_BASE64,
} from './helpers/create-test-app';
import { RedisService } from '../src/cache/redis.service';

describe('Scan (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    const email = `scan_${Date.now()}@example.com`;
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123' });
    accessToken = reg.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a scan with mocked AI and returns history', async () => {
    const scan = await request(app.getHttpServer())
      .post('/api/v1/scan')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        croppedImage: TINY_PNG_BASE64,
        tapX: 0.5,
        tapY: 0.5,
      })
      .expect(201);

    expect(scan.body.name).toBe('Electrolytic Capacitor');
    expect(scan.body.scanId).toBeDefined();
    expect(scan.body.confidence).toBe(96);

    const history = await request(app.getHttpServer())
      .get('/api/v1/scan/history')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(history.body.items.length).toBeGreaterThanOrEqual(1);

    await request(app.getHttpServer())
      .post(`/api/v1/scan/${scan.body.scanId}/feedback`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ rating: 'up' })
      .expect(201);
  });

  it('rate limits burst scan requests when Redis window exceeded', async () => {
    const redis = app.get(RedisService);
    const email = `burst_${Date.now()}@example.com`;
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123' });
    const token = reg.body.accessToken as string;

    // Pre-fill rate limit bucket
    const userId = reg.body.user.id as string;
    for (let i = 0; i < 5; i++) {
      await redis.checkRateLimit(`user:${userId}:scan`, 5, 60);
    }

    const res = await request(app.getHttpServer())
      .post('/api/v1/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({
        croppedImage: TINY_PNG_BASE64,
        tapX: 0.2,
        tapY: 0.2,
      });

    expect(res.status).toBe(429);
    expect(res.body.code).toBe('RATE_LIMITED');
  });
});
