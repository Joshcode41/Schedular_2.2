import { authMiddleware, requireRole } from '../../middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('authMiddleware', () => {
    it('should allow request with valid JWT token', () => {
      const secret = process.env.JWT_SECRET || 'test-secret';
      const token = jwt.sign(
        { userId: '123', role: 'customer', email: 'test@example.com' },
        secret,
        { expiresIn: '24h' }
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject request without authorization header', () => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', () => {
      mockRequest.headers = {
        authorization: 'InvalidToken',
      };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should reject request with expired token', () => {
      const secret = process.env.JWT_SECRET || 'test-secret';
      const expiredToken = jwt.sign(
        { userId: '123', role: 'customer' },
        secret,
        { expiresIn: '-1h' } // Already expired
      );

      mockRequest.headers = {
        authorization: `Bearer ${expiredToken}`,
      };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('requireRole', () => {
    it('should allow user with matching role', () => {
      const middleware = requireRole(['admin', 'technician']);
      (mockRequest as any).user = {
        userId: '123',
        role: 'admin',
      };

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject user without matching role', () => {
      const middleware = requireRole(['admin']);
      (mockRequest as any).user = {
        userId: '123',
        role: 'customer',
      };

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
});
