// Setup file for Jest tests
beforeAll(() => {
  // Initialize test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-12345';
  process.env.BCRYPT_ROUNDS = '10';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/scheduler_db_test';
});

afterEach(() => {
  // Clear mocks after each test
  jest.clearAllMocks();
});

afterAll(() => {
  // Cleanup after all tests
  jest.resetAllMocks();
});
