import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

const member = {
  username: 'apitestmember',
  email: 'apitestmember@hk.com',
  password: 'member123',
};

describe('Member Endpoints', () => {
  let memberToken: string;
  let memberId: string;

  beforeAll(async () => {
    await connect();
    server = app.listen();
    // Register member
    const regRes = await request(server)
      .post('/api/members/register')
      .send(member);
    memberId = regRes.body.id;
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

  it('should register a member', async () => {
    const res = await request(server)
      .post('/api/members/register')
      .send({ username: 'newmember', email: 'newmember@hk.com', password: 'newpass123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login a member', async () => {
    const res = await request(server)
      .post('/api/members/login')
      .send({ username: member.username, password: member.password });
    expect(res.status).toBe(200);
    expect(res.body.tokens).toHaveProperty('access');
  });

  it('should add and list favourites', async () => {
    // Add favourite
    const favRes = await request(server)
      .post(`/api/members/${memberId}/favourites`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ hotelId: 'somehotelid' });
    expect(favRes.status).toBe(200);
    // List favourites
    const listRes = await request(server)
      .get(`/api/members/${memberId}/favourites`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.favorites)).toBe(true);
  });

  it('should remove favourite', async () => {
    // Add favourite first
    await request(server)
      .post(`/api/members/${memberId}/favourites`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ hotelId: 'removehotelid' });
    // Remove favourite
    const res = await request(server)
      .delete(`/api/members/${memberId}/favourites/removehotelid`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.status).toBe(200);
  });
});
