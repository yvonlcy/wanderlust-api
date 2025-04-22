import request from 'supertest';
import app from '../src/index';
import http from 'http';

describe('Health Endpoint', () => {
  let server: http.Server;
  beforeAll(() => {
    server = app.listen();
  });
  afterAll(() => {
    if (server) server.close();
  });
  it('should return status ok', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
