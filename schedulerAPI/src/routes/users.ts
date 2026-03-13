import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import {
  UserSerializer,
  successResponse,
  errorResponse,
  InputValidator,
  handleAsyncError,
} from '../utils/serializers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userSerializer = new UserSerializer();

// Get all users with pagination (admin only)
router.get(
  '/',
  authMiddleware,
  handleAsyncError(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const role = req.query.role as string | undefined;

    // Build query
    let query = 'SELECT id, email, name, phone, role, created_at FROM users';
    const params: any[] = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM users ${role ? 'WHERE role = $1' : ''}`,
      role ? [role] : []
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const users = result.rows.map((user) => userSerializer.serialize(user));

    const { response, statusCode } = successResponse(
      {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Users retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Get user by ID
router.get(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: Request, res: Response) => {
    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('User not found', 404);
      return res.status(statusCode).json(response);
    }

    const serializedUser = userSerializer.serialize(result.rows[0]);
    const { response, statusCode } = successResponse(serializedUser, 'User retrieved successfully');
    res.status(statusCode).json(response);
  })
);

// Create new user (admin only)
router.post(
  '/',
  authMiddleware,
  handleAsyncError(async (req: Request, res: Response) => {
    const { name, email, role, phone, password } = req.body;
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

    if (!role || !InputValidator.validateRole(role)) {
      errors.role = ['Invalid role'];
    }

    if (phone && !InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      const { response, statusCode } = errorResponse('Email already exists', 409);
      return res.status(statusCode).json(response);
    }

    // Create user with temporary password (should require password reset)
    const bcrypt = require('bcrypt');
    const tempPassword = password || 'TempPassword123!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, name, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, role, created_at',
      [email, hashedPassword, name, phone || null, role]
    );

    const newUser = result.rows[0];
    const serializedUser = userSerializer.serialize(newUser);

    const { response, statusCode } = successResponse(serializedUser, 'User created successfully', 201);
    res.status(statusCode).json(response);
  })
);

// Update user
router.put(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('User not found', 404);
      return res.status(statusCode).json(response);
    }

    const user = result.rows[0];
    const { name, email, phone, role } = req.body;
    const errors: Record<string, string[]> = {};

    // Validate inputs if provided
    if (name && name !== user.name) {
      const nameValidation = InputValidator.validateName(name);
      if (!nameValidation.valid) {
        errors.name = nameValidation.errors;
      }
    }

    if (email && email !== user.email) {
      if (!InputValidator.validateEmail(email)) {
        errors.email = ['Invalid email address'];
      } else {
        const existingUser = await pool.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email, req.params.id]
        );
        if (existingUser.rows.length > 0) {
          errors.email = ['Email already exists'];
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

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (phone) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (role) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const updateResult = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, phone, role, created_at`,
      values
    );

    const updatedUser = updateResult.rows[0];
    const serializedUser = userSerializer.serialize(updatedUser);

    const { response, statusCode } = successResponse(serializedUser, 'User updated successfully');
    res.status(statusCode).json(response);
  })
);

// Delete user
router.delete(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: Request, res: Response) => {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('User not found', 404);
      return res.status(statusCode).json(response);
    }

    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    const { response, statusCode } = successResponse(null, 'User deleted successfully');
    res.status(statusCode).json(response);
  })
);

export { router as userRoutes };
