import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;


describe('Auth Flow', () => {
  beforeAll(async () => {
    await connect();
    server = app.listen();
  });
  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should register user', async () => {
    const res = await request(server)
      .post('/api/members/register')
      .send({ username: 'testuser', email: 'test@hk.com', password: '123456', role: 'member' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login user and return JWT', async () => {
    // Register first
    await request(server)
      .post('/api/members/register')
      .send({ username: 'testuser', email: 'test@hk.com', password: '123456', role: 'member' });
    // Login
    const res = await request(server)
      .post('/api/members/login')
      .send({ username: 'testuser', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tokens');
    expect(res.body.tokens).toHaveProperty('access');
    expect(res.body.tokens).toHaveProperty('refresh');
    // Optionally: check JWT structure
    const jwtParts = res.body.tokens.access.split('.');
    expect(jwtParts.length).toBe(3);
  });

  it('should not login with wrong password', async () => {
    // Register first
    await request(server)
      .post('/api/members/register')
      .send({ username: 'testuser', email: 'test@hk.com', password: '123456', role: 'member' });
    // Wrong password
    const res = await request(server)
      .post('/api/members/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('should access protected /api/profile with JWT', async () => {
    // Register and login to get token
    await request(server)
      .post('/api/members/register')
      .send({ username: 'testuser', email: 'test@hk.com', password: '123456', role: 'member' });
    const loginRes = await request(server)
      .post('/api/members/login')
      .send({ username: 'testuser', password: '123456' });
    const token = loginRes.body.tokens.access;
    // Access protected route
    const res = await request(server)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('role', 'member');
  });

  it('should not access /api/profile without JWT', async () => {
    const res = await request(server)
      .get('/api/profile');
    expect(res.status).toBe(401);
  });

});
