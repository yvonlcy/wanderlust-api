import request from 'supertest';
import app from '../src/index';
import { connect, closeDatabase, clearDatabase } from './utils/mongo';
import http from 'http';

let server: http.Server;

const operator = {
  username: 'apitestoperator',
  email: 'apitestoperator@hk.com',
  password: 'operator123',
  agency: 'TestAgency',
  signupCode: process.env.SIGNUP_CODE || 'WL-AGENCY-2025',
};

describe('Operator Endpoints', () => {
  let operatorToken: string;
  beforeAll(async () => {
    await connect();
    server = app.listen();
    // Register operator
    await request(server)
      .post('/api/operators/register')
      .send(operator);
    // Login operator
    const loginRes = await request(server)
      .post('/api/operators/login')
      .send({ username: operator.username, password: operator.password });
    operatorToken = loginRes.body.token;
  });
  afterAll(async () => {
    await closeDatabase();
    if (server) server.close();
  });
  afterEach(async () => await clearDatabase());

  it('should register an operator', async () => {
    const res = await request(server)
      .post('/api/operators/register')
      .send({ ...operator, username: 'newoperator', email: 'newoperator@hk.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login an operator', async () => {
    const res = await request(server)
      .post('/api/operators/login')
      .send({ username: operator.username, password: operator.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should allow operator to create a hotel (protected endpoint)', async () => {
    const hotel = {
      name: 'Operator Hotel',
      city: 'Test City',
      star: 4,
      address: '123 Test St',
      description: 'A test hotel',
      price: 100
    };
    const res = await request(server)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send(hotel);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
