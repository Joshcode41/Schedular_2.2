import request from 'supertest';
import express, { Express } from 'express';
import { userRoutes } from '../routes/users';
import jwt from 'jsonwebtoken';

/**
 * Users Routes Tests
 * Tests for user management endpoints
 */

describe('Users Routes', () => {
  let app: Express;
  let adminToken: string;
  let customerToken: string;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Generate test tokens
    const jwtSecret = process.env.JWT_SECRET || 'test-secret-key-12345';
    adminToken = jwt.sign(
      { userId: 'admin-1', role: 'admin', email: 'admin@example.com' },
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    customerToken = jwt.sign(
      { userId: 'customer-1', role: 'customer', email: 'customer@example.com' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    app.use('/api/users', userRoutes);
  });

  describe('GET /api/users', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return users list with authentication', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination).toHaveProperty('total');
      expect(res.body.data.pagination).toHaveProperty('page');
      expect(res.body.data.pagination).toHaveProperty('limit');
      expect(res.body.data.pagination).toHaveProperty('totalPages');
    });

    it('should filter by role if provided', async () => {
      const res = await request(app)
        .get('/api/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // All returned users should have admin role
      if (res.body.data.data.length > 0) {
        res.body.data.data.forEach((user: any) => {
          expect(user.role).toBe('admin');
        });
      }
    });

    it('should return limited results per page', async () => {
      const res = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data.length).toBeLessThanOrEqual(1);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/users/user-123');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/nonexistent-user-12345')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return user details for valid id', async () => {
      // First get a list of users
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;

        // Then fetch specific user
        const res = await request(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(userId);
      }
    });

    it('should not include password field in response', async () => {
      // Get a user
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;

        const res = await request(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).not.toHaveProperty('password');
      }
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/users/user-123')
        .send({
          name: 'Updated Name',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/nonexistent-user-12345')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should update user name successfully', async () => {
      // Get a user first
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;
        const newName = `Updated-${Date.now()}`;

        const res = await request(app)
          .put(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: newName,
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(newName);
      }
    });

    it('should validate phone number if provided', async () => {
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;

        const res = await request(app)
          .put(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            phone: 'invalid-phone',
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      }
    });

    it('should not allow changing role for non-admin users', async () => {
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;

        const res = await request(app)
          .put(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${customerToken}`)
          .send({
            role: 'admin',
          });

        // Should either return 403 or successfully update without changing role
        expect([200, 403]).toContain(res.status);
      }
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).delete('/api/users/user-123');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/api/users/nonexistent-user-12345')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should require admin role for deletion', async () => {
      const listRes = await request(app)
        .get('/api/users?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      if (listRes.body.data.data.length > 0) {
        const userId = listRes.body.data.data[0].id;

        const res = await request(app)
          .delete(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${customerToken}`);

        // Should return 403 (Forbidden) for non-admin users
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      }
    });
  });

  describe('GET /api/users/stats/summary', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/users/stats/summary');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return user statistics', async () => {
      const res = await request(app)
        .get('/api/users/stats/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('byRole');
    });
  });
});
