import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const email = `user_${Date.now()}@example.com`;
  const password = 'password123';

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, refreshes, and returns profile', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password })
      .expect(201);

    expect(register.body.accessToken).toBeDefined();
    expect(register.body.refreshToken).toBeDefined();

    const me = await request(app.getHttpServer())
      .get('/api/v1/user/me')
      .set('Authorization', `Bearer ${register.body.accessToken}`)
      .expect(200);

    expect(me.body.email).toBe(email);
    expect(me.body.tier).toBe('FREE');
    expect(me.body.scansRemaining).toBe(10);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(201);

    const refreshed = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: login.body.refreshToken })
      .expect(201);

    expect(refreshed.body.accessToken).toBeDefined();
  });

  it('rejects invalid login', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'wrongpassword' })
      .expect(401);
  });
});
