import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth system (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = `test_${Date.now()}@test.com`; // E-mail único para não conflitar no banco

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password123' })
      .expect(201); // 201 Created é o status padrão para POST no NestJS

    const body = response.body as { id: number; email: string };

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });

  afterEach(async () => {
    await app.close();
  });
});
