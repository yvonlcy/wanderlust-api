import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

describe('Auth Flow', () => {
  beforeAll(async () => {
    await connect();
    server = app.listen(); // listen on random port for Supertest
  });
  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should register user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@hk.com', password: '123456', role: 'member' });
    console.log('DEBUG:', res.status, res.body);
    expect(res.status).toBe(201);
    // add more assertions
  });

  // add login, JWT validation tests
});
