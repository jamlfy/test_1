import request from 'supertest';
import app from '../../src/main.js';

describe('Auth API', () => {
  it.todo('POST /api/auth/register - creates user and returns token');
  it.todo('POST /api/auth/register - rejects duplicate email');
  it.todo('POST /api/auth/register - rejects invalid role');
  it.todo('POST /api/auth/login - returns token on valid credentials');
  it.todo('POST /api/auth/login - rejects invalid password');
  it.todo('POST /api/auth/login - rejects non-existent email');
  it.todo('GET /api/auth/me - returns current user');
  it.todo('GET /api/auth/me - rejects without token');
  it.todo('GET /api/auth/me - rejects with invalid token');
});
