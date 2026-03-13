import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/serializers';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email?: string;
  };
}

/**
 * JWT Authentication Middleware
 * Verifies Bearer token and extracts user info into req.user
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('Missing authorization header', 401, 'UNAUTHORIZED');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Invalid authorization header format. Expected: Bearer <token>', 401, 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string;
      role: string;
      email?: string;
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: error.message,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        message: error.userMessage || error.message,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error?.message || 'Invalid token',
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Ensures user has one of the required roles
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `This action requires one of these roles: ${roles.join(', ')}`,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }

    next();
  };
};
