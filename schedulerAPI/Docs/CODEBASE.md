# Scheduler API - Comprehensive Codebase Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Module Structure](#module-structure)
4. [Configuration](#configuration)
5. [Packages & Dependencies](#packages--dependencies)
6. [API Endpoints](#api-endpoints)
7. [Functional Features](#functional-features)
8. [Missing Features & TODOs](#missing-features--todos)
9. [Setup & Installation](#setup--installation)
10. [Future Roadmap](#future-roadmap)

---

## 📌 Project Overview

**Scheduler API** is a backend service built with **Express.js** and **TypeScript** that provides REST API endpoints for a comprehensive scheduling system. It handles:

- User authentication and management
- Appointment scheduling and management
- Technician management
- Service centre management
- Customer relationship management

**Technology Stack:**
- Runtime: Node.js
- Framework: Express.js 4.18.2
- Language: TypeScript 5.3.3
- CORS: Enabled for frontend communication
- Environment: dotenv 16.4.5

---

## 🏗️ Architecture

### Request Flow

```
Client Request
    ↓
CORS Middleware
    ↓
Express Middleware (JSON Parser, URL Encoder)
    ↓
Request Logger
    ↓
Route Handlers (API Logic)
    ↓
Response Generator
    ↓
Client Response
```

### Error Handling Strategy

- Global error handler catches all errors
- Returns structured JSON with error messages
- In development: Includes stack traces
- In production: Hides sensitive information

### CORS Configuration

```
Allowed Origins: http://localhost:5173 (configurable via .env)
Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Allowed Headers: Content-Type, Authorization
```

---

## 📁 Module Structure

### Root Entry: `src/index.ts`

**Purpose:** Server initialization and main application setup

**Key Responsibilities:**
- Initialize Express application
- Load environment variables via dotenv
- Configure middleware (CORS, JSON parsing, logging)
- Register API route handlers
- Start server on specified port
- Define health check endpoint

**Environment Variables Used:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - CORS origin

### Route Modules

#### 1. **Authentication Routes** (`src/routes/auth.ts`)

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current authenticated user

**Features:**
- Form validation using Zod schemas
- Mock JWT token generation
- User session management via token
- Demo credentials support

**Current Implementation:**
- In-memory user storage (Map)
- Basic password validation (no hashing)
- Mock token: `bearer_{userId}`

**Validation Rules:**
```
Register:
- email: Required, valid email format
- password: Min 6 characters
- name: Required
- role: customer | technician

Login:
- email: Required, valid email format
- password: Min 6 characters
- role: Required (customer | technician | admin)
```

#### 2. **Users Management** (`src/routes/users.ts`)

**Endpoints:**
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Features:**
- CRUD operations on user records
- UUID-based user IDs
- Timestamp tracking (createdAt, updatedAt)
- User role management

**Mock Data:**
Two sample users pre-populated:
```typescript
- Customer: John Customer (customer@example.com)
- Technician: Jane Technician (tech@example.com)
```

#### 3. **Appointments Management** (`src/routes/appointments.ts`)

**Endpoints:**
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment

**Features:**
- Appointment lifecycle management (pending → completed/cancelled)
- Service type selection
- Technician assignment
- Time slot management
- Cancellation with reason tracking

**Appointment States:**
- pending: Initial state
- confirmed: Technician assigned
- in-progress: Service ongoing
- completed: Service finished
- cancelled: User cancelled

#### 4. **Technicians Management** (`src/routes/technicians.ts`)

**Endpoints:**
- `GET /api/technicians` - List all technicians
- `GET /api/technicians/:id` - Get technician profile
- `POST /api/technicians` - Add new technician
- `PUT /api/technicians/:id` - Update technician
- `DELETE /api/technicians/:id` - Remove technician

**Features:**
- Technician profile management
- Service/specialization tracking
- Availability status
- Assignment history (stored client-side)

**Technician Attributes:**
- name: Full name
- email: Contact email
- phone: Mobile number
- serviceCentre: Assigned centre
- specializations: Array of skills
- available: Availability status

#### 5. **Service Centres** (`src/routes/serviceCentres.ts`)

**Endpoints:**
- `GET /api/service-centres` - List all centres
- `GET /api/service-centres/:id` - Get centre details
- `POST /api/service-centres` - Create new centre
- `PUT /api/service-centres/:id` - Update centre
- `DELETE /api/service-centres/:id` - Delete centre

**Features:**
- Centre location and hours management
- Service offerings
- Contact information
- Technician assignment tracking

**Centre Attributes:**
- name: Centre name
- location: Street address
- city: City name
- phone: Contact number
- email: Centre email
- workingHours: Operating hours
- services: Array of services offered

---

## ⚙️ Configuration

### Environment Variables (`.env.example`)

```env
PORT=3001                                    # API server port
NODE_ENV=development                         # Environment mode
FRONTEND_URL=http://localhost:5173          # CORS origin for frontend
```

### TypeScript Configuration (`tsconfig.json`)

**Key Settings:**
- Target: ES2020
- Module: ESNext
- Module Resolution: Node
- Strict Mode: Enabled
- Declaration Maps: Enabled
- Source Maps: Enabled

**Output:** Compiled code in `dist/` directory

### Build & Run Configuration

**Development:**
```bash
pnpm dev  # Uses tsx for live reload
```

**Production:**
```bash
pnpm build  # Compiles to dist/
pnpm start  # Runs compiled code
```

---

## 📦 Packages & Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web server framework |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| dotenv | ^16.4.5 | Environment variable management |
| uuid | ^9.0.1 | Generate unique identifiers |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @types/express | ^4.17.21 | TypeScript types for Express |
| @types/node | ^20.10.6 | TypeScript types for Node.js |
| @types/cors | ^2.8.17 | TypeScript types for CORS |
| typescript | ^5.3.3 | TypeScript compiler |
| tsx | ^4.7.0 | TypeScript executor with hot reload |

---

## 🔌 API Endpoints

### Response Format

**Success Response:**
```json
{
  "id": "uuid",
  "field1": "value",
  "createdAt": "2024-03-10T12:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### Complete Endpoint Reference

See `schedulerAPI/README.md` for full endpoint documentation

---

## ✅ Functional Features

### Currently Working

#### 1. **Authentication System**
- ✅ User registration with role selection
- ✅ User login with email/password
- ✅ Mock JWT token generation
- ✅ Session management
- ✅ Logout functionality

#### 2. **User Management**
- ✅ List all users (pagination ready)
- ✅ Get user by ID
- ✅ Create new users
- ✅ Update user information
- ✅ Delete users
- ✅ User role management (customer/technician/admin)

#### 3. **Appointment Management**
- ✅ Create appointments
- ✅ View attachment details
- ✅ Update appointment information
- ✅ Cancel appointments with reason
- ✅ Delete appointments
- ✅ Status tracking

#### 4. **Technician Management**
- ✅ Add technicians
- ✅ Update technician profiles
- ✅ View technician details
- ✅ Track specializations
- ✅ Availability status management
- ✅ Assign to service centres

#### 5. **Service Centre Management**
- ✅ Add service centres
- ✅ Update centre information
- ✅ View centre details
- ✅ Track operating hours
- ✅ Manage services offered
- ✅ Contact information management

#### 6. **API Utilities**
- ✅ Health check endpoint (`/health`)
- ✅ CORS for development
- ✅ Request logging
- ✅ Error handling
- ✅ 404 handler for undefined routes

---

## ❌ Missing Features & TODOs

### High Priority

1. **🔐 Authentication Security**
   - [ ] Implement bcrypt for password hashing
   - [ ] Add JWT token signing with secret key
   - [ ] Implement token refresh mechanism
   - [ ] Add role-based access control (RBAC) middleware
   - [ ] Implement token expiration
   - [ ] Add logout token blacklist

   ```typescript
   // TODO: Replace mock token with JWT
   // Current: bearer_{userId}
   // Required: Proper JWT signing with expiration
   // Example:
   // const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' })
   ```

2. **💾 Database Integration**
   - [ ] Replace in-memory storage with PostgreSQL
   - [ ] Create database schema and migrations
   - [ ] Set up ORM (Prisma or TypeORM)
   - [ ] Implement connection pooling
   - [ ] Add database transaction support

   ```typescript
   // TODO: Move from Map-based storage to database
   // Current: In-memory Map for all entities
   // Required: PostgreSQL with Prisma ORM
   ```

3. **🔄 Data Validation**
   - [ ] Add Zod schema validation for all routes
   - [ ] Implement request sanitization
   - [ ] Add input type conversion
   - [ ] Create validation middleware

   ```typescript
   // TODO: Add body validation to all POST/PUT routes
   // Current: Basic null checks
   // Required: Zod schemas for all payloads
   ```

4. **📝 Middleware Stack**
   - [ ] Add authentication middleware
   - [ ] Add authorization middleware (RBAC)
   - [ ] Add request validation middleware
   - [ ] Add rate limiting
   - [ ] Add request/response compression

   ```typescript
   // TODO: Create middleware/
   // - authenticateToken.ts
   // - authorizeRole.ts
   // - validateRequest.ts
   // - rateLimiter.ts
   ```

5. **📊 Logging & Monitoring**
   - [ ] Implement structured logging (Winston/Pino)
   - [ ] Add request/response logging
   - [ ] Add error logging
   - [ ] Implement APM (Application Performance Monitoring)
   - [ ] Add health metrics endpoint

   ```typescript
   // TODO: Replace console.log with structured logging
   // Current: Simple console output
   // Required: Winston or Pino logger
   ```

### Medium Priority

6. **🔄 Business Logic**
   - [ ] Implement appointment scheduling algorithm
   - [ ] Add technician assignment logic
   - [ ] Add availability checking
   - [ ] Add conflict detection
   - [ ] Implement cancellation policies

7. **📧 Notifications**
   - [ ] Email notifications for appointments
   - [ ] SMS notifications
   - [ ] Push notifications
   - [ ] Notification preferences management
   - [ ] Notification templates

8. **🧪 Testing**
   - [ ] Unit tests for routes
   - [ ] Integration tests for APIs
   - [ ] End-to-end tests
   - [ ] Performance tests
   - [ ] Load testing

   ```bash
   # TODO: Add test framework
   # Required: Jest + Supertest
   # mkdir tests/
   # Create: routes.test.ts, auth.test.ts, etc.
   ```

9. **📚 Documentation**
   - [ ] OpenAPI/Swagger documentation
   - [ ] API usage examples
   - [ ] Error code documentation
   - [ ] Rate limiting documentation
   - [ ] Deployment guide

10. **🔐 Security**
    - [ ] SQL injection prevention (automatic with ORM)
    - [ ] XSS prevention
    - [ ] CSRF protection
    - [ ] API rate limiting
    - [ ] DDoS protection
    - [ ] Security headers

### Low Priority

11. **📱 Advanced Features**
    - [ ] Real-time updates (WebSocket)
    - [ ] File upload handling
    - [ ] Image processing
    - [ ] PDF generation
    - [ ] Timezone support

12. **🌐 Internationalization**
    - [ ] Multi-language support
    - [ ] Timezone handling
    - [ ] Currency support
    - [ ] Regional configurations

13. **⚡ Performance**
    - [ ] Database indexing
    - [ ] Query optimization
    - [ ] Caching strategy (Redis)
    - [ ] API response compression
    - [ ] Pagination optimization

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- pnpm installed

### Installation Steps

```bash
# Navigate to API directory
cd schedulerAPI

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Start development server
pnpm dev

# Or for production
pnpm build
pnpm start
```

### Verify Installation

```bash
# Check health endpoint
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-03-10T12:00:00Z",
#   "apiVersion": "1.0.0"
# }
```

---

## 🛣️ Future Roadmap

### Phase 1 (Next Sprint)
- [ ] Database setup with PostgreSQL
- [ ] User authentication JWT implementation
- [ ] Basic role-based access control
- [ ] Input validation schemas
- [ ] Unit tests (50% coverage)

### Phase 2
- [ ] Appointment scheduling logic
- [ ] Notification system
- [ ] Advanced filtering/search
- [ ] Pagination for list endpoints
- [ ] Unit tests (100% coverage)

### Phase 3
- [ ] WebSocket real-time updates
- [ ] File upload handling
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Integration tests

### Phase 4
- [ ] Mobile app API support
- [ ] Microservices architecture
- [ ] Advanced caching strategies
- [ ] Performance optimization
- [ ] Global deployment ready

---

## 📞 Support & Debugging

### Common Issues

**Port 3001 already in use:**
```bash
# Kill the process
Kill-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

**CORS errors:**
- Check `.env` file has correct `FRONTEND_URL`
- Ensure frontend is running on expected port

**Module not found:**
```bash
pnpm install --force
npm cache clean --force
```

---

## 📝 Important Notes

1. **This is the current production status:**
   - All endpoints are functional with mock data
   - No persistent database yet
   - Authentication is mock-based
   - Restarting server loses all data

2. **Ready for immediate improvement:**
   - Database integration is straightforward
   - All routes follow same pattern
   - Easy to add validation
   - Security can be enhanced quickly

3. **Code quality:**
   - All code is typed with TypeScript
   - Consistent error handling
   - Modular route structure
   - Easy to test and extend

---

**Last Updated:** March 10, 2026  
**Version:** 1.0.0  
**Status:** Alpha (Ready for Integration Testing)
