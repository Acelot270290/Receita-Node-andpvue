import request from 'supertest';
import app from '../app'; // sua aplicação Express
import AppDataSource from '../data-source'; // conexão TypeORM

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const uniqueLogin = `testuser_${Date.now()}`;

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        login: uniqueLogin,
        senha: 'password123',
        nome: 'Test User',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuário registrado com sucesso.');
  });

  it('deve falhar ao registrar um usuário com dados faltando', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        login: 'testuser_fail',
        // senha ausente propositalmente
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('deve falhar ao registrar um usuário com login duplicado', async () => {
    const uniqueLogin = `existinguser_${Date.now()}`;

    await request(app)
      .post('/api/auth/register')
      .send({
        login: uniqueLogin,
        senha: 'password123',
        nome: 'Existing User',
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        login: uniqueLogin,
        senha: 'anotherpassword',
        nome: 'Another User',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message', 'Este login já está registrado.');
  });
});

// Teste básico só para garantir execução do Jest
describe('Sanity test', () => {
  it('soma simples', () => {
    expect(2 + 2).toBe(4);
  });
});
