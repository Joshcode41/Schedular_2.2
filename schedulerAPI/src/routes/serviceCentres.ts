import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import {
  successResponse,
  errorResponse,
  InputValidator,
  handleAsyncError,
} from '../utils/serializers';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Get all service centres with pagination
router.get(
  '/',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const city = req.query.city as string | undefined;

    let query = 'SELECT * FROM service_centres WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    // Filter by city
    if (city) {
      query += ` AND city = $${paramCount++}`;
      params.push(city);
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    query += ` ORDER BY name ASC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const serviceCentres = result.rows;

    const { response, statusCode } = successResponse(
      {
        data: serviceCentres,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Service centres retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Get service centre by ID
router.get(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT * FROM service_centres WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Service centre not found', 404);
      return res.status(statusCode).json(response);
    }

    const centre = result.rows[0];

    const { response, statusCode } = successResponse(
      centre,
      'Service centre retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Create service centre (admin only)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const { name, location, city, phone, email, workingHours, services } = req.body;
    const errors: Record<string, string[]> = {};

    // Validate inputs
    if (!name) {
      errors.name = ['Name is required'];
    }

    if (!location) {
      errors.location = ['Location is required'];
    }

    if (!city) {
      errors.city = ['City is required'];
    }

    if (!phone) {
      errors.phone = ['Phone is required'];
    } else if (!InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (email && !InputValidator.validateEmail(email)) {
      errors.email = ['Invalid email address'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Create service centre
    const result = await pool.query(
      `INSERT INTO service_centres (name, location, city, phone, email, working_hours, services)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        location,
        city,
        phone,
        email || null,
        workingHours || null,
        Array.isArray(services) ? JSON.stringify(services) : '[]',
      ]
    );

    const centre = result.rows[0];

    const { response, statusCode } = successResponse(
      centre,
      'Service centre created successfully',
      201
    );
    res.status(statusCode).json(response);
  })
);

// Update service centre (admin only)
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const { name, location, city, phone, email, workingHours, services } = req.body;

    // Get current centre
    const result = await pool.query('SELECT * FROM service_centres WHERE id = $1', [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Service centre not found', 404);
      return res.status(statusCode).json(response);
    }

    const centre = result.rows[0];
    const errors: Record<string, string[]> = {};

    // Validate inputs if provided
    if (phone && !InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (email && !InputValidator.validateEmail(email)) {
      errors.email = ['Invalid email address'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Update centre with dynamic fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined && name !== null) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (location !== undefined && location !== null) {
      updates.push(`location = $${paramCount++}`);
      values.push(location);
    }

    if (city !== undefined && city !== null) {
      updates.push(`city = $${paramCount++}`);
      values.push(city);
    }

    if (phone !== undefined && phone !== null) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }

    if (email !== undefined && email !== null) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (workingHours !== undefined && workingHours !== null) {
      updates.push(`working_hours = $${paramCount++}`);
      values.push(workingHours);
    }

    if (services !== undefined && services !== null) {
      updates.push(`services = $${paramCount++}`);
      values.push(JSON.stringify(services));
    }

    if (updates.length === 0) {
      const { response, statusCode } = successResponse(centre, 'No updates provided');
      return res.status(statusCode).json(response);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const updateResult = await pool.query(
      `UPDATE service_centres SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    const updated = updateResult.rows[0];

    const { response, statusCode } = successResponse(
      updated,
      'Service centre updated successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Delete service centre (admin only)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT id FROM service_centres WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Service centre not found', 404);
      return res.status(statusCode).json(response);
    }

    await pool.query('DELETE FROM service_centres WHERE id = $1', [req.params.id]);

    const { response, statusCode } = successResponse(null, 'Service centre deleted successfully');
    res.status(statusCode).json(response);
  })
);

export { router as serviceCentreRoutes };
