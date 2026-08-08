import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';

describe('Billing (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects webhook without valid signature', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/billing/webhook')
      .set('Content-Type', 'application/json')
      .send({ type: 'checkout.session.completed' });

    // Without Stripe configured fully, service may return 503 or 400
    expect([400, 503]).toContain(res.status);
  });

  it('returns billing unavailable when Stripe is not configured', async () => {
    const email = `bill_${Date.now()}@example.com`;
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123' });

    await request(app.getHttpServer())
      .post('/api/v1/billing/checkout')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .expect(503);
  });
});
