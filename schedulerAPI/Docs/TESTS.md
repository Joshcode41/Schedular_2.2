# Scheduler API - Testing Documentation

## 📋 Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Test Setup](#test-setup)
3. [Manual Testing Guide](#manual-testing-guide)
4. [Test Scenarios](#test-scenarios)
5. [API Testing Tools](#api-testing-tools)
6. [Automation Testing](#automation-testing)
7. [Performance Testing](#performance-testing)
8. [Known Issues](#known-issues)

---

## 🎯 Testing Strategy

### Current Status: Manual Testing (No Automated Tests Yet)

**Testing Pyramid:**
```
         /\
        /  \     E2E Tests (Not Started)
       /    \
      /      \
     /--------\   Integration Tests (Not Started)
    /          \
   /            \ Unit Tests (Not Started)
  /              \
 /------------------\ Manual Testing (In Progress)
```

### Test Coverage
- **Current Coverage:** ~0% (Manual testing only)
- **Target Coverage:** 80%+ for production
- **Priority Order:**
  1. Authentication endpoints (High Risk)
  2. Business logic endpoints (High Risk)
  3. Data validation (Medium Risk)
  4. Edge cases (Medium Risk)

---

## 🔧 Test Setup

### Prerequisites

```bash
# Install Jest and testing dependencies (TODO)
pnpm add -D jest @types/jest ts-jest supertest @types/supertest

# Create jest.config.js
# Create test directory structure
mkdir -p tests/unit tests/integration tests/fixtures
```

### Recommended Test Stack

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12"
  }
}
```

### Jest Configuration (TODO)

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};
```

---

## 🧪 Manual Testing Guide

### Using cURL

#### 1. Health Check
```bash
curl -X GET http://localhost:3001/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-03-10T12:00:00Z",
  "apiVersion": "1.0.0"
}
```

#### 2. User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "role": "customer"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "customer",
    "createdAt": "2024-03-10T12:00:00Z"
  },
  "token": "bearer_uuid-here"
}
```

#### 3. User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

#### 4. Get Current User
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer bearer_user-id-here"
```

#### 5. List All Appointments
```bash
curl -X GET http://localhost:3001/api/appointments
```

---

## 📝 Test Scenarios

### Authentication Tests

#### Scenario 1: Successful Login
```typescript
// TODO: Create test/unit/auth.test.ts
describe('POST /api/auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
  });
});
```

#### Scenario 2: Invalid Password
```typescript
it('should fail with invalid password', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'customer@example.com',
      password: 'wrongpassword',
      role: 'customer'
    });
  
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('error');
});
```

#### Scenario 3: Missing Required Fields
```typescript
it('should fail with missing email', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      password: 'password123',
      role: 'customer'
    });
  
  expect(response.status).toBe(400);
});
```

### User Management Tests

#### Scenario 4: Create User (Admin)
```typescript
// TODO: Create test/unit/users.test.ts
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        phone: '1234567890'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

#### Scenario 5: Get User by ID
```typescript
describe('GET /api/users/:id', () => {
  it('should return user details', async () => {
    const response = await request(app)
      .get('/api/users/user-id');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email');
  });
  
  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/invalid-id');
    
    expect(response.status).toBe(404);
  });
});
```

### Appointment Tests

#### Scenario 6: Create Appointment
```typescript
// TODO: Create test/unit/appointments.test.ts
describe('POST /api/appointments', () => {
  it('should create new appointment', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        customerId: 'customer-id',
        serviceCentreId: 'centre-id',
        preferredDate: '2024-03-15',
        preferredTime: '10:00',
        serviceType: 'AC Repair',
        notes: 'Unit not cooling'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pending');
  });
});
```

#### Scenario 7: Cancel Appointment
```typescript
describe('PATCH /api/appointments/:id/cancel', () => {
  it('should cancel appointment with reason', async () => {
    const response = await request(app)
      .patch('/api/appointments/appointment-id/cancel')
      .send({ reason: 'Emergency at home' });
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('cancelled');
    expect(response.body).toHaveProperty('cancelledAt');
  });
});
```

---

## 🛠️ API Testing Tools

### Recommended Tools

#### 1. Postman
- Download: https://www.postman.com/downloads/
- Import API collection (TODO: Create)
- Features: GUI testing, environment variables, test scripts

#### 2. Insomnia
- Download: https://insomnia.rest/
- Lightweight alternative to Postman
- Good for quick API testing

#### 3. REST Client Extension (VS Code)
- Install: REST Client extension
- Create `.http` files for quick testing

**Example:** `api-tests.http`
```http
### Health Check
GET http://localhost:3001/health

### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "role": "customer"
}

### Get All Appointments
GET http://localhost:3001/api/appointments
```

---

## 🤖 Automation Testing

### Phase 1: Setup (Not Started)

```bash
# Install testing framework
pnpm add -D jest ts-jest supertest

# Create test structure
mkdir -p tests/{unit,integration,fixtures}
```

### Phase 2: Unit Tests (Not Started)

```typescript
// tests/unit/auth.test.ts
import request from 'supertest';
import app from '../../src/index';

describe('Authentication Routes', () => {
  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@example.com',
          password: 'password123',
          role: 'customer'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});
```

### Phase 3: Integration Tests (Not Started)

```typescript
// tests/integration/appointments.test.ts
describe('Appointment Workflow', () => {
  test('complete appointment lifecycle', async () => {
    // Create appointment
    // Get appointment
    // Update appointment
    // Cancel appointment
    // Verify status changes
  });
});
```

### Phase 4: Test Execution

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test auth.test.ts

# Watch mode (re-run on changes)
pnpm test -- --watch
```

**Expected Output:**
```
PASS  tests/unit/auth.test.ts
PASS  tests/unit/users.test.ts
PASS  tests/unit/appointments.test.ts

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Coverage:    78.5% Statements
```

---

## ⚡ Performance Testing

### Load Testing (TODO)

```bash
# Install Apache Bench or wrk
# apt-get install apache2-utils  # Linux
# brew install wrk              # macOS

# Test endpoint under load
ab -n 1000 -c 100 http://localhost:3001/health

# Using wrk (recommended)
wrk -t12 -c400 -d30s http://localhost:3001/api/appointments
```

### Performance Metrics to Track
- **Response Time:** < 200ms
- **Throughput:** > 100 req/sec
- **Error Rate:** < 0.1%
- **Memory Usage:** < 100MB
- **CPU Usage:** < 50%

### Load Test Scenarios

```bash
# Scenario 1: Light Load
wrk -t2 -c10 -d10s http://localhost:3001/api/users

# Scenario 2: Medium Load
wrk -t4 -c100 -d30s http://localhost:3001/api/appointments

# Scenario 3: Heavy Load
wrk -t8 -c500 -d60s http://localhost:3001/api/appointments
```

---

## 🐛 Known Issues

### Issue 1: In-Memory Data Loss
**Severity:** High  
**Description:** All data is lost when server restarts  
**Impact:** 🔴 CRITICAL for production  
**Solution:** Implement database persistence (See: Missing Features)  
**Status:** Not Fixed

```
Test Case: Create appointment → Restart server → Verify data lost
Result: FAILED ❌ (Data not persisted)
Expected: PASSED ✅ (Data should persist)
```

### Issue 2: No Password Hashing
**Severity:** Critical  
**Description:** Passwords stored in plaintext  
**Impact:** 🔴 SECURITY RISK  
**Solution:** Implement bcrypt before production  
**Status:** Not Fixed

```
Test Case: Register user → Check database password
Result: FAILED ❌ (Plaintext password)
Expected: PASSED ✅ (Hashed password)
```

### Issue 3: Mock JWT Tokens
**Severity:** High  
**Description:** JWT tokens not properly signed  
**Impact:** 🔴 No real authentication  
**Solution:** Implement proper JWT signing  
**Status:** Not Fixed

### Issue 4: No Input Validation
**Severity:** Medium  
**Description:** Requests not validated with schemas  
**Impact:** 🟡 Backend could accept invalid data  
**Solution:** Add Zod validation middleware  
**Status:** Partial

---

## 📊 Test Coverage Roadmap

### Current Status
```
Unit Tests:        0% (0/50 tests)
Integration Tests: 0% (0/30 tests)
E2E Tests:         0% (0/20 tests)
├─ Auth:           0%
├─ Users:          0%
├─ Appointments:   0%
├─ Technicians:    0%
└─ Service Centres:0%
```

### Target (4 Weeks)
```
Unit Tests:        100% (50/50 tests)
Integration Tests: 80% (24/30 tests)
E2E Tests:         60% (12/20 tests)
Overall Coverage:  85%
```

---

## 🚀 Next Steps

1. **Immediate (This Week)**
   - [ ] Install Jest and Supertest
   - [ ] Create test file structure
   - [ ] Write 10 authentication tests
   - [ ] Set up CI/CD for auto-testing

2. **Short-term (This Month)**
   - [ ] Achieve 50% code coverage
   - [ ] Create integration tests
   - [ ] Set up API documentation tests
   - [ ] Create test data fixtures

3. **Medium-term (This Quarter)**
   - [ ] Achieve 85% code coverage
   - [ ] Create E2E tests
   - [ ] Set up performance baselines
   - [ ] Create load test scenarios

4. **Long-term (This Year)**
   - [ ] Achieve 95% code coverage
   - [ ] Implement chaos engineering tests
   - [ ] Create security tests
   - [ ] Establish continuous monitoring

---

**Last Updated:** March 10, 2026  
**Test Status:** 🔴 NOT STARTED (Manual Testing Only)  
**Priority:** HIGH - Essential for Production Release
