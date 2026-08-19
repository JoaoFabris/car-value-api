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
    const email = `test_${Date.now()}@test.com`;

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password123' })
      .expect(201);

    const body = response.body as { id: number; email: string };

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = `test_${Date.now()}@test.com`;

    // 1. Realiza o cadastro e captura os cookies de resposta
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password123' })
      .expect(201);

    const cookie = signupResponse.get('Set-Cookie');
    expect(cookie).toBeDefined();

    // 2. Faz o GET /auth/me enviando o cookie de sessão obtido
    const { body } = (await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie!)
      .expect(200)) as { body: { id: number; email: string } };

    expect(body.email).toEqual(email);
  });

  afterEach(async () => {
    await app.close();
  });
});
