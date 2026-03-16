import {
  UserSerializer,
  AppointmentSerializer,
  TechnicianSerializer,
  ServiceCentreSerializer,
  InputValidator,
  successResponse,
  errorResponse,
  AppError,
  PaginationHelper,
} from '../utils/serializers';

/**
 * Serializers and Utilities Tests
 * Tests for data transformation and validation
 */

describe('Serializers', () => {
  describe('UserSerializer', () => {
    it('should exclude password from serialized output', () => {
      const serializer = new UserSerializer();
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        password: 'hashed_password',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const result = serializer.serialize(user);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
    });

    it('should format timestamps to ISO string', () => {
      const serializer = new UserSerializer();
      const now = new Date();
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        createdAt: now,
        updatedAt: now,
      };

      const result = serializer.serialize(user);

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(result.createdAt).toBe(now.toISOString());
    });

    it('should handle null phone gracefully', () => {
      const serializer = new UserSerializer();
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
      };

      const result = serializer.serialize(user);

      expect(result.phone).toBeNull();
    });

    it('should serialize multiple users', () => {
      const serializer = new UserSerializer();
      const users = [
        {
          id: '1',
          email: 'test1@example.com',
          name: 'User 1',
          password: 'secret1',
        },
        {
          id: '2',
          email: 'test2@example.com',
          name: 'User 2',
          password: 'secret2',
        },
      ];

      const result = serializer.serializeMany(users);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      result.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should handle empty array', () => {
      const serializer = new UserSerializer();
      const result = serializer.serializeMany([]);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return null for null input', () => {
      const serializer = new UserSerializer();
      const result = serializer.serialize(null);

      expect(result).toBeNull();
    });
  });

  describe('AppointmentSerializer', () => {
    it('should format appointment dates to ISO string', () => {
      const serializer = new AppointmentSerializer();
      const now = new Date();
      const appointment = {
        id: 'apt-1',
        appointmentDate: now,
        createdAt: now,
        updatedAt: now,
      };

      const result = serializer.serialize(appointment);

      expect(result.appointmentDate).toBe(now.toISOString());
      expect(result.createdAt).toBe(now.toISOString());
    });

    it('should handle null dates', () => {
      const serializer = new AppointmentSerializer();
      const appointment = {
        id: 'apt-1',
        appointmentDate: null,
        createdAt: null,
      };

      const result = serializer.serialize(appointment);

      expect(result.appointmentDate).toBeNull();
      expect(result.createdAt).toBeNull();
    });
  });

  describe('TechnicianSerializer', () => {
    it('should serialize technician data', () => {
      const serializer = new TechnicianSerializer();
      const technician = {
        id: 'tech-1',
        name: 'John Tech',
        email: 'tech@example.com',
        createdAt: new Date('2024-01-01'),
      };

      const result = serializer.serialize(technician);

      expect(result.id).toBe('tech-1');
      expect(result.name).toBe('John Tech');
      expect(typeof result.createdAt).toBe('string');
    });
  });

  describe('ServiceCentreSerializer', () => {
    it('should serialize service centre data', () => {
      const serializer = new ServiceCentreSerializer();
      const centre = {
        id: 'centre-1',
        name: 'Centre 1',
        location: 'Downtown',
        createdAt: new Date('2024-01-01'),
      };

      const result = serializer.serialize(centre);

      expect(result.id).toBe('centre-1');
      expect(result.name).toBe('Centre 1');
      expect(typeof result.createdAt).toBe('string');
    });
  });
});

describe('InputValidator', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(InputValidator.validateEmail('test@example.com')).toBe(true);
      expect(InputValidator.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(InputValidator.validateEmail('name+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(InputValidator.validateEmail('notanemail')).toBe(false);
      expect(InputValidator.validateEmail('test@')).toBe(false);
      expect(InputValidator.validateEmail('@example.com')).toBe(false);
      expect(InputValidator.validateEmail('test @example.com')).toBe(false);
    });

    it('should reject empty emails', () => {
      expect(InputValidator.validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const result = InputValidator.validatePassword('ValidPassword123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject passwords shorter than 6 characters', () => {
      const result = InputValidator.validatePassword('short');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    it('should return errors array for invalid passwords', () => {
      const result = InputValidator.validatePassword('abc');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validatePhone', () => {
    it('should accept valid phone numbers', () => {
      expect(InputValidator.validatePhone('1234567890')).toBe(true);
      expect(InputValidator.validatePhone('+1 (234) 567-8900')).toBe(true);
      expect(InputValidator.validatePhone('123-456-7890')).toBe(true);
    });

    it('should reject phone numbers with less than 10 digits', () => {
      expect(InputValidator.validatePhone('12345')).toBe(false);
      expect(InputValidator.validatePhone('123-456')).toBe(false);
    });

    it('should reject empty phone numbers', () => {
      expect(InputValidator.validatePhone('')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should accept valid names', () => {
      const result = InputValidator.validateName('John Doe');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject names shorter than 2 characters', () => {
      const result = InputValidator.validateName('J');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    it('should reject names longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = InputValidator.validateName(longName);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name must not exceed 100 characters');
    });

    it('should reject empty names', () => {
      const result = InputValidator.validateName('');
      expect(result.valid).toBe(false);
    });

    it('should reject whitespace-only names', () => {
      const result = InputValidator.validateName('   ');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateRole', () => {
    it('should accept valid roles', () => {
      expect(InputValidator.validateRole('customer')).toBe(true);
      expect(InputValidator.validateRole('technician')).toBe(true);
      expect(InputValidator.validateRole('admin')).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(InputValidator.validateRole('invalid')).toBe(false);
      expect(InputValidator.validateRole('user')).toBe(false);
      expect(InputValidator.validateRole('')).toBe(false);
    });
  });
});

describe('Response Helpers', () => {
  describe('successResponse', () => {
    it('should create success response with data', () => {
      const data = { id: '1', name: 'Test' };
      const { response, statusCode } = successResponse(data, 'Success message', 200);

      expect(statusCode).toBe(200);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.message).toBe('Success message');
      expect(response.meta).toBeDefined();
      expect(response.meta).toHaveProperty('timestamp');
      expect(response.meta).toHaveProperty('version');
    });

    it('should use default message if not provided', () => {
      const { response } = successResponse({});

      expect(response.message).toBe('Success');
    });

    it('should use default status code if not provided', () => {
      const { statusCode } = successResponse({});

      expect(statusCode).toBe(200);
    });
  });

  describe('errorResponse', () => {
    it('should create error response with string error', () => {
      const { response, statusCode } = errorResponse('Something went wrong', 500, 'Error message');

      expect(statusCode).toBe(500);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Something went wrong');
      expect(response.message).toBe('Error message');
    });

    it('should create error response with validation errors object', () => {
      const errors = { email: ['Invalid email'], password: ['Too short'] };
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');

      expect(statusCode).toBe(400);
      expect(response.success).toBe(false);
      expect(response.errors).toEqual(errors);
      expect(response.message).toBe('Validation failed');
    });

    it('should use error message as default message if not provided', () => {
      const { response } = errorResponse('Custom error', 400);

      expect(response.message).toBe('Custom error');
    });

    it('should use default message for validation errors', () => {
      const { response } = errorResponse({ field: ['error'] }, 400);

      expect(response.message).toBe('Validation failed');
    });

    it('should use default status code if not provided', () => {
      const { statusCode } = errorResponse('Error');

      expect(statusCode).toBe(400);
    });
  });
});

describe('AppError', () => {
  it('should create error with message and status code', () => {
    const error = new AppError('Test error', 500);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error instanceof Error).toBe(true);
  });

  it('should support error code as third parameter', () => {
    const error = new AppError('Test error', 400, 'VALIDATION_ERROR');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('should support validation errors object as third parameter', () => {
    const validationErrors = { email: ['Invalid email'] };
    const error = new AppError('Validation failed', 400, validationErrors);

    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(validationErrors);
  });

  it('should use default status code', () => {
    const error = new AppError('Test error');

    expect(error.statusCode).toBe(500);
  });
});

describe('PaginationHelper', () => {
  describe('getPaginationParams', () => {
    it('should return default pagination params', () => {
      const params = PaginationHelper.getPaginationParams({});

      expect(params.page).toBe(1);
      expect(params.limit).toBe(10);
      expect(params.offset).toBe(0);
    });

    it('should parse page and limit from query', () => {
      const params = PaginationHelper.getPaginationParams({ page: '2', limit: '20' });

      expect(params.page).toBe(2);
      expect(params.limit).toBe(20);
      expect(params.offset).toBe(20);
    });

    it('should enforce minimum page of 1', () => {
      const params = PaginationHelper.getPaginationParams({ page: '0' });

      expect(params.page).toBe(1);
    });

    it('should enforce maximum limit of 100', () => {
      const params = PaginationHelper.getPaginationParams({ limit: '200' });

      expect(params.limit).toBe(100);
    });

    it('should enforce minimum limit of 1', () => {
      const params = PaginationHelper.getPaginationParams({ limit: '0' });

      expect(params.limit).toBe(1);
    });
  });

  describe('formatPaginationMeta', () => {
    it('should format pagination metadata', () => {
      const meta = PaginationHelper.formatPaginationMeta(100, 1, 10);

      expect(meta.total).toBe(100);
      expect(meta.page).toBe(1);
      expect(meta.limit).toBe(10);
      expect(meta.pages).toBe(10);
    });

    it('should calculate correct number of pages', () => {
      const meta = PaginationHelper.formatPaginationMeta(25, 1, 10);

      expect(meta.pages).toBe(3); // Math.ceil(25 / 10)
    });

    it('should handle edge case of single item', () => {
      const meta = PaginationHelper.formatPaginationMeta(1, 1, 10);

      expect(meta.pages).toBe(1);
    });
  });
});
