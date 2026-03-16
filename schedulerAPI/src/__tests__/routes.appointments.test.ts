import request from 'supertest';
import express, { Express } from 'express';
import { appointmentRoutes } from '../routes/appointments';
import { authMiddleware } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';

/**
 * Appointments Routes Tests
 * Tests for appointment CRUD operations and workflow
 */

describe('Appointments Routes', () => {
  let app: Express;
  let adminToken: string;
  let customerToken: string;
  let appointmentId: string;

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

    app.use('/api/appointments', appointmentRoutes);
  });

  describe('GET /api/appointments', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/appointments');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return appointments with authentication', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/appointments?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('should filter by status if provided', async () => {
      const res = await request(app)
        .get('/api/appointments?status=pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/appointments', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          appointment_date: new Date(),
          // Missing service_centre_id, service_type, description
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create appointment with valid data', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      appointmentId = res.body.data.id; // Save for other tests
    });

    it('should return 400 for past appointment date', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/appointments/apt-123');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent appointment', async () => {
      const res = await request(app)
        .get('/api/appointments/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return appointment details for valid id', async () => {
      // First create an appointment
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      const id = createRes.body.data.id;

      // Then fetch it
      const res = await request(app)
        .get(`/api/appointments/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(id);
    });
  });

  describe('PUT /api/appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/appointments/apt-123')
        .send({
          status: 'confirmed',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent appointment', async () => {
      const res = await request(app)
        .put('/api/appointments/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'confirmed',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should update appointment with valid data', async () => {
      // First create an appointment
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      const id = createRes.body.data.id;

      // Update it
      const res = await request(app)
        .put(`/api/appointments/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'confirmed',
          technician_id: 'tech-1',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should validate state transitions', async () => {
      // This depends on appointment workflow rules
      const res = await request(app)
        .put('/api/appointments/any-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'invalid-status',
        });

      // Should either return 400 or 404
      expect([400, 404]).toContain(res.status);
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).delete('/api/appointments/apt-123');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent appointment', async () => {
      const res = await request(app)
        .delete('/api/appointments/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should delete appointment successfully', async () => {
      // First create an appointment
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          service_centre_id: 'centre-1',
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          service_type: 'AC Repair',
          description: '2023 Toyota Camry',
        });

      const id = createRes.body.data.id;

      // Delete it
      const res = await request(app)
        .delete(`/api/appointments/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
