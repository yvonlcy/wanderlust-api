import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

const member = {
  username: 'profilemember',
  email: 'profilemember@hk.com',
  password: 'profile123',
};

describe('Profile Endpoint', () => {
  let memberToken: string;
  beforeAll(async () => {
    await connect();
    server = app.listen();
    // Register member
    await request(server)
      .post('/api/members/register')
      .send(member);
    // Login member
    const loginRes = await request(server)
      .post('/api/members/login')
      .send({ username: member.username, password: member.password });
    memberToken = loginRes.body.tokens.access;
  });
  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should get the profile of the logged in user', async () => {
    const res = await request(server)
      .get('/api/profile')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('role', 'member');
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('email');
  });
});
