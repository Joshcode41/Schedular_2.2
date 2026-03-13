import { Pool } from 'pg';

/**
 * Advanced Serializer System for API Response Formatting
 * Handles data transformation, validation, and formatting
 */

export interface SerializerOptions {
  include?: string[];
  exclude?: string[];
  transform?: Record<string, (value: any) => any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * Base Serializer class for handling data transformation
 */
export class BaseSerializer {
  protected include: string[] = [];
  protected exclude: string[] = [];
  protected transforms: Record<string, (value: any) => any> = {};

  constructor(options: SerializerOptions = {}) {
    this.include = options.include || [];
    this.exclude = options.exclude || [];
    this.transforms = options.transform || {};
  }

  /**
   * Serialize single object
   */
  serialize(data: any): any {
    if (!data) return null;
    return this.transformData(data);
  }

  /**
   * Serialize array of objects
   */
  serializeMany(data: any[]): any[] {
    if (!Array.isArray(data)) return [];
    return data.map(item => this.serialize(item));
  }

  /**
   * Transform data based on includes/excludes and custom transforms
   */
  protected transformData(data: any): any {
    let transformed = { ...data };

    // Apply exclude filter
    if (this.exclude.length > 0) {
      this.exclude.forEach(key => {
        delete transformed[key];
      });
    }

    // Apply include filter
    if (this.include.length > 0) {
      const included: any = {};
      this.include.forEach(key => {
        if (key in data) {
          included[key] = transformed[key];
        }
      });
      transformed = included;
    }

    // Apply custom transforms
    Object.keys(this.transforms).forEach(key => {
      if (key in transformed && transformed[key] !== undefined) {
        transformed[key] = this.transforms[key](transformed[key]);
      }
    });

    return transformed;
  }
}

/**
 * User Serializer
 */
export class UserSerializer extends BaseSerializer {
  constructor(options: SerializerOptions = {}) {
    super({
      exclude: ['password'],
      ...options,
      transform: {
        createdAt: (value) => value ? new Date(value).toISOString() : null,
        updatedAt: (value) => value ? new Date(value).toISOString() : null,
        phone: (value) => value || null,
        ...options.transform,
      },
    });
  }
}

/**
 * Appointment Serializer
 */
export class AppointmentSerializer extends BaseSerializer {
  constructor(options: SerializerOptions = {}) {
    super({
      ...options,
      transform: {
        appointmentDate: (value) => value ? new Date(value).toISOString() : null,
        createdAt: (value) => value ? new Date(value).toISOString() : null,
        updatedAt: (value) => value ? new Date(value).toISOString() : null,
        ...options.transform,
      },
    });
  }
}

/**
 * Technician Serializer
 */
export class TechnicianSerializer extends BaseSerializer {
  constructor(options: SerializerOptions = {}) {
    super({
      ...options,
      transform: {
        createdAt: (value) => value ? new Date(value).toISOString() : null,
        updatedAt: (value) => value ? new Date(value).toISOString() : null,
        ...options.transform,
      },
    });
  }
}

/**
 * Service Centre Serializer
 */
export class ServiceCentreSerializer extends BaseSerializer {
  constructor(options: SerializerOptions = {}) {
    super({
      ...options,
      transform: {
        createdAt: (value) => value ? new Date(value).toISOString() : null,
        updatedAt: (value) => value ? new Date(value).toISOString() : null,
        ...options.transform,
      },
    });
  }
}

/**
 * Utility function to create standardized successful response
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): { response: ApiResponse<T>; statusCode: number } {
  return {
    response: {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    },
    statusCode,
  };
}

/**
 * Utility function to create standardized error response
 */
export function errorResponse(
  error: string | Record<string, string[]>,
  statusCode: number = 400,
  message?: string
): { response: ApiResponse; statusCode: number } {
  const response: ApiResponse = {
    success: false,
    message: message || (typeof error === 'string' ? error : 'Validation failed'),
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  if (typeof error === 'object') {
    response.errors = error;
  } else {
    response.error = error;
  }

  return { response, statusCode };
}

/**
 * Input Validator
 */
export class InputValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validatePhone(phone: string): boolean {
    // Basic phone validation - accepts 10+ digits
    const phoneRegex = /^[+]?[\d\s\-()]+$/.test(phone);
    return phoneRegex && phone.replace(/\D/g, '').length >= 10;
  }

  static validateName(name: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (name.length > 100) {
      errors.push('Name must not exceed 100 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateRole(role: string): boolean {
    return ['customer', 'technician', 'admin'].includes(role);
  }
}

/**
 * Pagination Helper
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class PaginationHelper {
  static getPaginationParams(query: any): { offset: number; limit: number; page: number } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const offset = (page - 1) * limit;

    return { offset, limit, page };
  }

  static formatPaginationMeta(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}

/**
 * Error Handler Utility
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

export function handleAsyncError(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
