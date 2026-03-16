import request from 'supertest';
import express, { Express } from 'express';
import jwt from 'jsonwebtoken';
import { InputValidator } from '../utils/serializers';

/**
 * Mock the database pool before importing routes
 */
const mockPool = {
  query: jest.fn(),
};

jest.mock('../db/connection', () => mockPool);

// Now import routes after mocking
import authRoutes from '../routes/auth';

/**
 * Auth Routes Tests
 * Tests for user registration, login, logout, and profile endpoints
 */

describe('Auth Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
    mockPool.query.mockReset();
  });

  describe('POST /register', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'ValidPass123',
          name: 'John Doe',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('email');
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'ValidPass123',
          name: 'John Doe',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('email');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          name: 'John Doe',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('password');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('name');
    });

    it('should return 400 if phone is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123',
          name: 'John Doe',
          phone: '123',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('phone');
    });

    it('should return 400 if role is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123',
          name: 'John Doe',
          phone: '1234567890',
          role: 'invalid-role',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('role');
    });

    it('should return 400 if email already exists', async () => {
      // Mock pool.query to return existing user
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 'user-123' }] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com', // Seed user
          password: 'ValidPass123',
          name: 'John Doe',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already registered');
    });

    it('should register user with valid inputs', async () => {
      const newUserId = `user-${Date.now()}`;
      const newUserEmail = `newuser-${Date.now()}@example.com`;
      
      // Mock pool.query - first call checks if user exists (no), second call inserts user
      mockPool.query.mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({
          rows: [
            {
              id: newUserId,
              email: newUserEmail,
              name: 'Jane Doe',
              phone: '1234567890',
              role: 'customer',
              created_at: new Date(),
            },
          ],
        }); // Insert new user

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: newUserEmail,
          password: 'ValidPass123',
          name: 'Jane Doe',
          phone: '1234567890',
          role: 'customer',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(newUserEmail);
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          role: 'customer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 if user email not found', async () => {
      // Mock pool.query to return no user
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent-12345@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 if password is incorrect', async () => {
      // Mock pool.query to return user with hashed password (bcrypt of 'correctpassword')
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'admin-id',
            email: 'admin@example.com',
            name: 'Admin User',
            phone: '1234567890',
            role: 'admin',
            password: hashedPassword,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword',
          role: 'admin',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with correct credentials', async () => {
      // Mock pool.query to return user with correct hashed password
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'admin-id',
            email: 'admin@example.com',
            name: 'Admin User',
            phone: '1234567890',
            role: 'admin',
            password: hashedPassword,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('admin@example.com');
    });
  });

  describe('POST /logout', () => {
    it('should logout successfully', async () => {
      // First, login to get a token
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'admin-id',
            email: 'admin@example.com',
            name: 'Admin User',
            phone: '1234567890',
            role: 'admin',
            password: hashedPassword,
          },
        ],
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
        });

      expect(loginRes.status).toBe(200);
      const token = loginRes.body.data.token;

      // Then logout
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('successful');
    });
  });

  describe('GET /me', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 if invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return current user with valid token', async () => {
      // Generate a valid token directly without needing login
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const token = jwt.sign(
        {
          userId: 'admin-id',
          role: 'admin',
          email: 'admin@example.com',
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set up mock for the pool.query call in the GET /me endpoint
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'admin-id',
            email: 'admin@example.com',
            name: 'Admin User',
            phone: '1234567890',
            role: 'admin',
            created_at: new Date(),
          },
        ],
      });

      // Get current user
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('role');
    });
  });
});
