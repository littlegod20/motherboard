import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  createTestApp,
  TEST_IMAGE_URL,
} from './helpers/create-test-app';

describe('Triage (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    const email = `triage_${Date.now()}@example.com`;
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123' });
    accessToken = reg.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates session, analyzes a check, and completes', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/triage/sessions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(created.body.checks).toHaveLength(5);
    const sessionId = created.body.id as string;

    const check = await request(app.getHttpServer())
      .post(`/api/v1/triage/sessions/${sessionId}/checks/power-connectors`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ imageUrl: TEST_IMAGE_URL })
      .expect(201);

    expect(check.body.status).toBe('pass');

    const completed = await request(app.getHttpServer())
      .post(`/api/v1/triage/sessions/${sessionId}/complete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(completed.body.status).toBe('COMPLETED');
    expect(completed.body.primarySuspect).toBeDefined();
  });
});
