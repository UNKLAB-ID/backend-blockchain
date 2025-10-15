const request = require('supertest');
const app = require('../../src/app');

describe('App Routes', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('api');
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('users');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return example users response', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for nonexistent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error.status).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should have rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(res => {
          expect(res.headers).toHaveProperty('x-ratelimit-limit');
          expect(res.headers).toHaveProperty('x-ratelimit-remaining');
        });
    });
  });

  describe('Security Headers', () => {
    it('should have security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(res => {
          expect(res.headers).toHaveProperty('x-api-version');
          expect(res.headers).toHaveProperty('x-ratelimit-applied');
          expect(res.headers).toHaveProperty('cache-control');
          expect(res.headers['cache-control']).toMatch(/no-cache/);
        });
    });
  });
});