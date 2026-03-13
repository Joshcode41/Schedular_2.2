import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/connection';
import {
  UserSerializer,
  successResponse,
  errorResponse,
  InputValidator,
  AppError,
  handleAsyncError,
} from '../utils/serializers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userSerializer = new UserSerializer();

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
    role: 'customer' | 'technician' | 'admin';
  };
}

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'customer' | 'technician';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

/**
 * Generate JWT token
 */
function generateToken(userId: string, role: string, email: string): string {
  return jwt.sign(
    {
      userId,
      role,
      email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// Register endpoint
router.post(
  '/register',
  handleAsyncError(async (req: RegisterRequest, res: Response) => {
    const { email, password, name, phone, role } = req.body;
    const errors: Record<string, string[]> = {};

    // Validate inputs
    if (!email) {
      errors.email = ['Email is required'];
    } else if (!InputValidator.validateEmail(email)) {
      errors.email = ['Invalid email address'];
    }

    if (!password) {
      errors.password = ['Password is required'];
    } else {
      const passwordValidation = InputValidator.validatePassword(password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors;
      }
    }

    if (!name) {
      errors.name = ['Name is required'];
    } else {
      const nameValidation = InputValidator.validateName(name);
      if (!nameValidation.valid) {
        errors.name = nameValidation.errors;
      }
    }

    if (!phone) {
      errors.phone = ['Phone is required'];
    } else if (!InputValidator.validatePhone(phone)) {
      errors.phone = ['Invalid phone number'];
    }

    if (!role || !InputValidator.validateRole(role)) {
      errors.role = ['Invalid role'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      const { response, statusCode } = errorResponse('Email already registered', 409);
      return res.status(statusCode).json(response);
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, role, created_at',
      [email, hashedPassword, name, phone, role]
    );

    const user = result.rows[0];
    const serializedUser = userSerializer.serialize(user);
    const token = generateToken(user.id, user.role, user.email);

    const { response, statusCode } = successResponse(
      {
        user: serializedUser,
        token,
      },
      'Registration successful',
      201
    );

    res.status(statusCode).json(response);
  })
);

// Login endpoint
router.post(
  '/login',
  handleAsyncError(async (req: LoginRequest, res: Response) => {
    const { email, password, role } = req.body;
    const errors: Record<string, string[]> = {};

    // Validate inputs
    if (!email) {
      errors.email = ['Email is required'];
    } else if (!InputValidator.validateEmail(email)) {
      errors.email = ['Invalid email address'];
    }

    if (!password) {
      errors.password = ['Password is required'];
    }

    if (!role || !InputValidator.validateRole(role)) {
      errors.role = ['Invalid role'];
    }

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Find user by email and role
    const result = await pool.query(
      'SELECT id, email, name, phone, role, password FROM users WHERE email = $1 AND role = $2',
      [email, role]
    );

    const user = result.rows[0];

    // User not found
    if (!user) {
      const { response, statusCode } = errorResponse('Invalid email or password', 401);
      return res.status(statusCode).json(response);
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const { response, statusCode } = errorResponse('Invalid email or password', 401);
      return res.status(statusCode).json(response);
    }

    const serializedUser = userSerializer.serialize(user);
    const token = generateToken(user.id, user.role, user.email);

    const { response, statusCode } = successResponse(
      {
        user: serializedUser,
        token,
      },
      'Login successful'
    );

    res.status(statusCode).json(response);
  })
);

// Logout endpoint
router.post(
  '/logout',
  handleAsyncError(async (req: Request, res: Response) => {
    const { response, statusCode } = successResponse(null, 'Logout successful');
    res.status(statusCode).json(response);
  })
);

// Get current user (protected)
router.get(
  '/me',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = $1',
      [userId]
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

export default router;
export { router as authRoutes };
