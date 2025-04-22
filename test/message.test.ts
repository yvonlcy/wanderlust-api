import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

const member1 = {
  username: 'msgmember1',
  email: 'msgmember1@hk.com',
  password: 'member123',
};
const member2 = {
  username: 'msgmember2',
  email: 'msgmember2@hk.com',
  password: 'member456',
};

describe('Message Endpoints', () => {
  let member1Token: string, member2Token: string, member1Id: string, member2Id: string;
  beforeAll(async () => {
    await connect();
    server = app.listen();
    // Register and login both members
    const reg1 = await request(server).post('/api/members/register').send(member1);
    member1Id = reg1.body.id;
    const reg2 = await request(server).post('/api/members/register').send(member2);
    member2Id = reg2.body.id;
    const login1 = await request(server).post('/api/members/login').send({ username: member1.username, password: member1.password });
    member1Token = login1.body.tokens.access;
    const login2 = await request(server).post('/api/members/login').send({ username: member2.username, password: member2.password });
    member2Token = login2.body.tokens.access;
  });
  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should send a message (authenticated)', async () => {
    const res = await request(server)
      .post('/api/messages')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({ fromId: member1Id, toId: member2Id, content: 'Hello there!' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should not send a message without authentication', async () => {
    const res = await request(server)
      .post('/api/messages')
      .send({ fromId: member1Id, toId: member2Id, content: 'Unauthenticated!' });
    expect(res.status).toBe(401);
  });

  it('should list messages for a user (authenticated)', async () => {
    // Send a message first
    await request(server)
      .post('/api/messages')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({ fromId: member1Id, toId: member2Id, content: 'Hi again!' });
    const res = await request(server)
      .get('/api/messages?userId=' + member1Id)
      .set('Authorization', `Bearer ${member1Token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  it('should reply to a message (authenticated)', async () => {
    // Send a message first
    const msgRes = await request(server)
      .post('/api/messages')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({ fromId: member1Id, toId: member2Id, content: 'Reply test!' });
    const msgId = msgRes.body.id;
    const res = await request(server)
      .post(`/api/messages/${msgId}/reply`)
      .set('Authorization', `Bearer ${member2Token}`)
      .send({ fromId: member2Id, content: 'Replying to your message.' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should delete a message (authenticated)', async () => {
    // Send a message first
    const msgRes = await request(server)
      .post('/api/messages')
      .set('Authorization', `Bearer ${member1Token}`)
      .send({ fromId: member1Id, toId: member2Id, content: 'Delete me!' });
    const msgId = msgRes.body.id;
    const res = await request(server)
      .delete(`/api/messages/${msgId}`)
      .set('Authorization', `Bearer ${member1Token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
