import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

const operator = {
  username: 'hoteloperator',
  email: 'hoteloperator@hk.com',
  password: 'operator123',
  agency: 'HotelAgency',
  signupCode: process.env.SIGNUP_CODE || 'WL-AGENCY-2025',
};

const member = {
  username: 'hotelmember',
  email: 'hotelmember@hk.com',
  password: 'member123',
};

describe('Hotel Endpoints', () => {
  let operatorToken: string;

  beforeAll(async () => {
    await connect();
    server = app.listen();
    // Register operator
    await request(server)
      .post('/api/operators/register')
      .send(operator);
    // Login operator
    const opLogin = await request(server)
      .post('/api/operators/login')
      .send({ username: operator.username, password: operator.password });
    operatorToken = opLogin.body.token;
    // Register member
    await request(server)
      .post('/api/members/register')
      .send(member);
    // Login member
    await request(server)
      .post('/api/members/login')
      .send({ username: member.username, password: member.password });

  });

  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should allow operator to create a hotel', async () => {
    const res = await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'Test Hotel', star: 5, city: 'Hong Kong', country: 'HK', address: '1 Main St' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

  });

  it('should list hotels', async () => {
    // Create a hotel first
    await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'List Hotel', star: 4, city: 'Macau', country: 'MO', address: '2 Main St' });
    const res = await request(server)
      .get('/api/hotels');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('hotels');
    expect(Array.isArray(res.body.hotels)).toBe(true);
  });

  it('should get hotel by id', async () => {
    // Create hotel
    const createRes = await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'Get Hotel', star: 3, city: 'Shenzhen', country: 'CN', address: '3 Main St' });
    const id = createRes.body.id;
    const res = await request(server)
      .get(`/api/hotels/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', id);
    expect(res.body).toHaveProperty('name', 'Get Hotel');
  });

  it('should allow operator to update hotel', async () => {
    // Create hotel
    const createRes = await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'Update Hotel', star: 4, city: 'Guangzhou', country: 'CN', address: '4 Main St' });
    const id = createRes.body.id;
    const res = await request(server)
      .put(`/api/hotels/${id}`)
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'Updated Hotel', star: 4, city: 'Guangzhou', country: 'CN', address: '4 Main St' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg');
  });

  it('should allow operator to delete hotel', async () => {
    // Create hotel
    const createRes = await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'Delete Hotel', star: 2, city: 'Zhuhai', country: 'CN', address: '5 Main St' });
    const id = createRes.body.id;
    const res = await request(server)
      .delete(`/api/hotels/${id}`)
      .set('Authorization', `Bearer ${operatorToken}`);
    expect(res.status).toBe(204);
  });
});
