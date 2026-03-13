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

// Get all technicians with pagination and filtering
router.get(
  '/',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const serviceCentreId = req.query.serviceCentreId as string | undefined;
    const available = req.query.available as string | undefined;

    let query = 'SELECT * FROM technicians WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    // Filter by service centre
    if (serviceCentreId) {
      query += ` AND service_centre_id = $${paramCount++}`;
      params.push(serviceCentreId);
    }

    // Filter by availability
    if (available !== undefined) {
      query += ` AND available = $${paramCount++}`;
      params.push(available === 'true');
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
    const technicians = result.rows;

    const { response, statusCode } = successResponse(
      {
        data: technicians,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Technicians retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Get technician by ID
router.get(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT * FROM technicians WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Technician not found', 404);
      return res.status(statusCode).json(response);
    }

    const technician = result.rows[0];

    const { response, statusCode } = successResponse(
      technician,
      'Technician retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Create technician (admin only)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const { name, email, phone, serviceCentreId, specializations } = req.body;
    const errors: Record<string, string[]> = {};

    // Validate inputs
    if (!name) {
      errors.name = ['Name is required'];
    } else {
      const nameValidation = InputValidator.validateName(name);
      if (!nameValidation.valid) {
        errors.name = nameValidation.errors;
      }
    }

    if (!email) {
      errors.email = ['Email is required'];
    } else if (!InputValidator.validateEmail(email)) {
      errors.email = ['Invalid email address'];
    }

    if (!serviceCentreId) {
      errors.serviceCentreId = ['Service centre is required'];
    }

    if (phone && !InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Check for duplicate email
    const emailCheck = await pool.query('SELECT id FROM technicians WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      const { response, statusCode } = errorResponse('Email already in use', 400);
      return res.status(statusCode).json(response);
    }

    // Verify service centre exists
    const centreResult = await pool.query('SELECT id FROM service_centres WHERE id = $1', [
      serviceCentreId,
    ]);
    if (centreResult.rows.length === 0) {
      const { response, statusCode } = errorResponse('Service centre not found', 404);
      return res.status(statusCode).json(response);
    }

    // Create technician
    const result = await pool.query(
      `INSERT INTO technicians (name, email, phone, service_centre_id, specializations, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        email,
        phone || null,
        serviceCentreId,
        Array.isArray(specializations) ? JSON.stringify(specializations) : '[]',
        true,
      ]
    );

    const technician = result.rows[0];

    const { response, statusCode } = successResponse(
      technician,
      'Technician created successfully',
      201
    );
    res.status(statusCode).json(response);
  })
);

// Update technician (admin only)
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const { name, email, phone, available, specializations } = req.body;

    // Get current technician
    const result = await pool.query('SELECT * FROM technicians WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Technician not found', 404);
      return res.status(statusCode).json(response);
    }

    const technician = result.rows[0];
    const errors: Record<string, string[]> = {};

    // Validate inputs if provided
    if (name && name !== technician.name) {
      const nameValidation = InputValidator.validateName(name);
      if (!nameValidation.valid) {
        errors.name = nameValidation.errors;
      }
    }

    if (email && email !== technician.email) {
      if (!InputValidator.validateEmail(email)) {
        errors.email = ['Invalid email address'];
      } else {
        // Check for duplicate email
        const emailCheck = await pool.query('SELECT id FROM technicians WHERE email = $1 AND id != $2', [
          email,
          req.params.id,
        ]);
        if (emailCheck.rows.length > 0) {
          errors.email = ['Email already in use'];
        }
      }
    }

    if (phone && !InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Update technician with dynamic fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined && name !== null) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (email !== undefined && email !== null) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (phone !== undefined && phone !== null) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }

    if (available !== undefined && available !== null) {
      updates.push(`available = $${paramCount++}`);
      values.push(available);
    }

    if (specializations !== undefined && specializations !== null) {
      updates.push(`specializations = $${paramCount++}`);
      values.push(JSON.stringify(specializations));
    }

    if (updates.length === 0) {
      const { response, statusCode } = successResponse(
        technician,
        'No updates provided'
      );
      return res.status(statusCode).json(response);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const updateResult = await pool.query(
      `UPDATE technicians SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    const updated = updateResult.rows[0];

    const { response, statusCode } = successResponse(updated, 'Technician updated successfully');
    res.status(statusCode).json(response);
  })
);

// Delete technician (admin only)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT id FROM technicians WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Technician not found', 404);
      return res.status(statusCode).json(response);
    }

    await pool.query('DELETE FROM technicians WHERE id = $1', [req.params.id]);

    const { response, statusCode } = successResponse(null, 'Technician deleted successfully');
    res.status(statusCode).json(response);
  })
);

export { router as technicianRoutes };
