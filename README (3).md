# 🗓️ Scheduler App — Full-Stack React + Node.js Scheduling System

> **Enterprise-Grade Appointment & Technician Scheduling Platform**  
> Built with React 18, TypeScript, Node.js/Express, and PostgreSQL

[![Status](https://img.shields.io/badge/Status-Alpha--Development-orange)](.)
[![Frontend](https://img.shields.io/badge/Frontend-70%25_Complete-yellow)](.)
[![Backend](https://img.shields.io/badge/Backend-60%25_Complete-yellow)](.)
[![Tests](https://img.shields.io/badge/Tests-0%25_Coverage-red)](.)
[![Production Ready](https://img.shields.io/badge/Production_Ready-30%25-red)](.)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Tech Stack](#-tech-stack)
4. [Module Structure](#-module-structure)
5. [Current State Assessment](#-current-state-assessment)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Identified Gaps & Issues](#-identified-gaps--issues)
8. [Security Analysis](#-security-analysis)
9. [Workflow Definitions](#-workflow-definitions)
10. [Testing Strategy](#-testing-strategy)
11. [Performance Considerations](#-performance-considerations)
12. [Setup & Installation](#-setup--installation)
13. [Recommended Enhancements Roadmap](#-recommended-enhancements-roadmap)
14. [Deployment Readiness](#-deployment-readiness)

---

## 📌 Project Overview

The **Scheduler App** is a full-stack appointment scheduling platform designed to manage end-to-end service workflows between customers, technicians, and service centres. It provides role-based access for three user types and handles the complete appointment lifecycle from booking through delivery.

### Core Business Functions

| Domain | Features |
|---|---|
| **Customer Portal** | Book appointments, track status, submit feedback |
| **Technician Portal** | Manage workload, update appointment status, view schedules |
| **Admin Portal** | User management, CRM, analytics, service centre oversight, calendar management |
| **Scheduling Engine** | Availability checking, technician assignment, conflict detection *(planned)* |
| **Notifications** | Email/SMS alerts for appointment changes *(planned)* |

---

## 🏗️ Architecture

### System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                           │
│         React 18 + TypeScript + Vite (schedulerUI)           │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Customer   │  │  Technician  │  │      Admin       │   │
│  │   Portal    │  │    Portal    │  │     Portal       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP / REST API
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                        API LAYER                              │
│          Express.js + TypeScript (schedulerAPI)               │
│                                                              │
│   CORS → Auth Middleware → Route Handlers → Serializers      │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐  │
│  │  /auth   │ │ /users   │ │/appoints   │ │ /techs     │  │
│  └──────────┘ └──────────┘ └────────────┘ └────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │ SQL / Connection Pool
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                       DATA LAYER                              │
│                    PostgreSQL Database                        │
│                                                              │
│   users │ appointments │ technicians │ service_centres       │
│                         feedback                             │
└──────────────────────────────────────────────────────────────┘
```

### Backend Request Flow

```
Client Request
    ↓
CORS Middleware (multi-port: 5173, 5174, 5175, 3000)
    ↓
JSON Parser + URL Encoder (50MB limit)
    ↓
Request Logger (timestamps + request ID)
    ↓
Route Handlers (/api/auth, /api/users, /api/appointments, etc.)
    ↓
Serializers (BaseSerializer → exclude passwords, format response)
    ↓
Structured JSON Response
```

---

## 🛠️ Tech Stack

### Frontend (`schedulerUI`)

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.3.1 | UI rendering |
| Language | TypeScript | Latest | Type safety |
| Build Tool | Vite | Latest | Fast development & bundling |
| Routing | React Router | v7 | SPA navigation |
| UI Library | Radix UI + shadcn/ui | Latest | Accessible components |
| Charts | Recharts | Latest | Analytics dashboards |
| Validation | Zod | Latest | Form schema validation |
| HTTP Client | Custom Axios-like | — | API communication |
| Styling | Tailwind CSS | Latest | Utility-first CSS |
| State | React Context API | — | Auth + Theme state |

### Backend (`schedulerAPI`)

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | 18+ | Server runtime |
| Framework | Express.js | 4.18.2 | REST API framework |
| Language | TypeScript | 5.3.3 | Type safety |
| Database | PostgreSQL | 14+ | Persistent data store |
| ORM | `pg` (raw) | Latest | DB connection pool |
| Validation | Zod | Latest | Request schema validation |
| ID Generation | UUID v4 | 9.0.1 | Unique identifiers |
| Dev Tools | tsx | 4.7.0 | Hot reload in development |
| Environment | dotenv | 16.4.5 | Env variable management |

### Planned Additions (from Roadmap)

| Package | Purpose | Priority |
|---|---|---|
| `bcrypt` | Password hashing | 🔴 Critical |
| `jsonwebtoken` | JWT authentication | 🔴 Critical |
| `helmet` | Security headers | 🔴 Critical |
| `express-rate-limit` | Rate limiting | 🔴 Critical |
| `prisma` | ORM + migrations | 🟠 High |
| `jest` + `ts-jest` | Backend testing | 🟠 High |
| `vitest` | Frontend testing | 🟠 High |
| `nodemailer` | Email notifications | 🟡 Medium |
| `redis` | Caching layer | 🟡 Medium |
| `swagger-ui-express` | API documentation | 🟡 Medium |

---

## 📁 Module Structure

### Frontend Structure (`schedulerUI`)

```
schedulerUI/
├── src/
│   ├── main.tsx                          # Entry point
│   ├── app/
│   │   ├── App.tsx                       # Root: ThemeProvider > AuthProvider > Router
│   │   ├── routes.tsx                    # All route definitions (protected + public)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx           # ✅ Auth state, login/register/logout
│   │   │   └── ThemeContext.tsx          # ✅ Light/Dark/System + 6 color schemes
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx        # ✅ Role-based route guard
│   │   │   └── ui/                       # ✅ 30+ Radix UI components
│   │   └── pages/
│   │       ├── LoginPage.tsx             # ✅ Zod validation, demo credentials
│   │       ├── RegisterPage.tsx          # ✅ Full registration form
│   │       ├── customer/
│   │       │   ├── CustomerDashboard.tsx # ✅ Appointments + stats (mock data)
│   │       │   ├── BookAppointment.tsx   # ⚠️ Form complete, API not wired
│   │       │   ├── AppointmentDetails.tsx# ✅ Full detail + cancel dialog
│   │       │   └── FeedbackForm.tsx      # ✅ Post-service feedback
│   │       ├── technician/
│   │       │   ├── TechnicianDashboard.tsx # ✅ Workload view (mock data)
│   │       │   └── UpdateStatus.tsx      # ✅ Status update flow
│   │       └── admin/
│   │           ├── AdminDashboard.tsx    # ✅ Charts, metrics (mock data)
│   │           ├── ServiceCentreManagement.tsx # ⚠️ Structure only
│   │           ├── TechnicianAssignment.tsx    # ⚠️ Structure only
│   │           ├── UserManagement.tsx          # ⚠️ Structure only
│   │           ├── ReportsAnalytics.tsx        # ⚠️ Structure only
│   │           ├── CustomerCRM.tsx             # ⚠️ Structure only
│   │           └── CalendarManagement.tsx      # ⚠️ Structure only
│   └── services/
│       └── api.ts                        # ✅ HTTP client, typed API methods
```

### Backend Structure (`schedulerAPI`)

```
schedulerAPI/
├── src/
│   ├── index.ts                          # ✅ Server bootstrap, middleware, health check
│   ├── routes/
│   │   ├── auth.ts                       # ⚠️ Works, but no JWT / plain text passwords
│   │   ├── users.ts                      # ❌ In-memory Map, no DB persistence
│   │   ├── appointments.ts               # ❌ In-memory Map, no DB persistence
│   │   ├── technicians.ts                # ❌ In-memory Map, no DB persistence
│   │   └── serviceCentres.ts             # ❌ In-memory Map, no DB persistence
│   ├── db/
│   │   ├── connection.ts                 # ✅ PostgreSQL pool configured
│   │   └── init.ts                       # ⚠️ Schema created, plain text passwords
│   └── utils/
│       └── serializers.ts                # ✅ BaseSerializer, InputValidator, AppError
├── package.json
├── tsconfig.json
└── .env.example                          # ⚠️ Needs documentation
```

---

## 📊 Current State Assessment

### Module Rating Summary

| Module | Status | Completion | Priority |
|---|---|---|---|
| Auth (Frontend) | ✅ Well-implemented | 80% | Fix backend security |
| Auth (Backend) | ⚠️ Security gaps | 50% | 🔴 Critical fixes needed |
| Customer Dashboard | ✅ UI complete | 70% | Wire real API |
| Admin Dashboard | ✅ UI complete | 65% | Wire real API |
| Technician Dashboard | ✅ UI complete | 65% | Wire real API |
| Booking Flow | ⚠️ Partial | 50% | Complete API integration |
| DB Schema | ✅ Good structure | 75% | Add migrations (Prisma) |
| Serializers | ✅ Excellent | 90% | Minor improvements |
| Testing | ❌ Not started | 0% | 🔴 Must start immediately |
| Security | ❌ Critical gaps | 20% | 🔴 Critical fixes needed |
| Documentation | ⚠️ Partial | 40% | Expand incrementally |

### Strengths ✅

- Well-organized modular architecture (frontend + backend separated cleanly)
- Comprehensive Radix UI component library (30+ components ready)
- Strong theme system (light/dark/system + 6 color schemes)
- Excellent serializer pattern with `BaseSerializer` — password auto-excluded
- Typed throughout with TypeScript (70-80% coverage)
- Role-based routing with `ProtectedRoute` guard
- Zod validation on all forms
- CORS configured for multi-port development

### Weaknesses ⚠️

- Zero test coverage (0%) across both frontend and backend
- Plain text password storage (critical security vulnerability)
- No JWT implementation (mock tokens used)
- In-memory data storage for most routes (data lost on restart)
- Mock data used in dashboards instead of real API calls
- No rate limiting or security headers
- No workflow/state machine enforcing appointment lifecycle

---

## 🔌 API Endpoints Reference

### Base URL
```
Development: http://localhost:3001
Health Check: GET /health
```

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ✅ Works |
| POST | `/api/auth/login` | Login (returns token) | ⚠️ No JWT |
| POST | `/api/auth/logout` | Logout session | ✅ Works |
| GET | `/api/auth/me` | Get current user | ✅ Works |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+254712000000",
  "role": "customer"
}
```

**Login Response (current — insecure):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "customer" },
    "token": "bearer_uuid"
  }
}
```

> ⚠️ **Current token format `bearer_{userId}` is NOT real JWT.** See [Security Analysis](#-security-analysis).

### Users (`/api/users`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/users` | List all users | ⚠️ Mock data |
| GET | `/api/users/:id` | Get user by ID | ⚠️ Mock data |
| POST | `/api/users` | Create user | ⚠️ Mock data |
| PUT | `/api/users/:id` | Update user | ⚠️ Mock data |
| DELETE | `/api/users/:id` | Delete user | ⚠️ Mock data |

### Appointments (`/api/appointments`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/appointments` | List appointments | ⚠️ Mock data |
| GET | `/api/appointments/:id` | Get appointment | ⚠️ Mock data |
| POST | `/api/appointments` | Create appointment | ⚠️ Mock data |
| PUT | `/api/appointments/:id` | Update appointment | ⚠️ Mock data |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment | ⚠️ Mock data |
| DELETE | `/api/appointments/:id` | Delete appointment | ⚠️ Mock data |

**Create Appointment Request:**
```json
{
  "customerId": "uuid",
  "serviceCentreId": "uuid",
  "preferredDate": "2026-04-15",
  "preferredTime": "10:00",
  "serviceType": "AC Repair",
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "vehicleYear": "2020",
  "registrationNumber": "KAA 123B",
  "notes": "Unit not cooling properly"
}
```

### Technicians (`/api/technicians`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/technicians` | List all technicians | ⚠️ Mock data |
| GET | `/api/technicians/:id` | Get technician profile | ⚠️ Mock data |
| POST | `/api/technicians` | Add technician | ⚠️ Mock data |
| PUT | `/api/technicians/:id` | Update technician | ⚠️ Mock data |
| DELETE | `/api/technicians/:id` | Remove technician | ⚠️ Mock data |

### Service Centres (`/api/service-centres`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/service-centres` | List all centres | ⚠️ Mock data |
| GET | `/api/service-centres/:id` | Get centre details | ⚠️ Mock data |
| POST | `/api/service-centres` | Create centre | ⚠️ Mock data |
| PUT | `/api/service-centres/:id` | Update centre | ⚠️ Mock data |
| DELETE | `/api/service-centres/:id` | Delete centre | ⚠️ Mock data |

### Standard Response Format

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2026-03-11T10:00:00Z",
    "version": "1.0.0"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_NOT_FOUND",
    "message": "Appointment with ID xyz does not exist",
    "details": {}
  }
}
```

---

## 🚨 Identified Gaps & Issues

### Critical Issues 🔴

#### 1. Plain Text Password Storage
- **Location:** `src/db/init.ts`, `src/routes/auth.ts`
- **Impact:** Complete data breach if database is compromised
- **Fix:**
```typescript
import bcrypt from 'bcrypt';

// On registration:
const hashedPassword = await bcrypt.hash(password, 10);

// On login:
const isValid = await bcrypt.compare(inputPassword, user.password);
```

#### 2. No JWT Implementation
- **Location:** `src/routes/auth.ts`
- **Current:** Returns `bearer_${user.id}` (anyone can guess any user's token)
- **Fix:**
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '24h' }
);
```

#### 3. In-Memory Data Storage
- **Location:** All routes except `auth.ts`
- **Impact:** All data (users, appointments, technicians) is lost when the server restarts
- **Fix:** Migrate all route handlers to use `db/connection.ts` pool with proper SQL queries or Prisma ORM

#### 4. Auto-User Creation in Login
- **Location:** `src/routes/auth.ts` login handler
- **Impact:** Any email/password combination can create a new account via the login endpoint
- **Fix:** Remove demo auto-creation or isolate it behind a dedicated `/api/auth/demo-login` endpoint

#### 5. No Rate Limiting
- **Location:** `src/index.ts`
- **Impact:** Open to brute-force attacks and DDoS
- **Fix:**
```typescript
import rateLimit from 'express-rate-limit';

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

#### 6. localStorage Token Storage (Frontend)
- **Location:** `AuthContext.tsx`
- **Impact:** Token accessible to any JavaScript — XSS vulnerability
- **Fix:** Use `httpOnly` cookies via `js-cookie` or a cookie-based session

### High Priority Issues 🟠

| Issue | Location | Fix |
|---|---|---|
| No security headers | `src/index.ts` | Add `helmet()` middleware |
| No input sanitization on backend routes | All routes | Add Zod middleware per route |
| No database transactions | `src/db/init.ts` | Wrap multi-table ops in `BEGIN/COMMIT` |
| No pagination on list endpoints | All GET list routes | Add `LIMIT/OFFSET` with query params |
| No appointment conflict detection | `appointments.ts` | Check overlapping time slots before insert |
| 404 route missing on frontend | `routes.tsx` | Add `path: "*"` route |
| No Error Boundary on frontend | `App.tsx` | Wrap routes in React Error Boundary |
| Admin pages are structure-only | 6 admin pages | Complete implementation with real API |

### Medium Priority Issues 🟡

| Issue | Effort | Notes |
|---|---|---|
| No email verification on registration | Medium | SMTP + verification token |
| No password reset flow | Medium | Token-based reset email |
| No real-time updates | High | Consider WebSocket or polling |
| Appointment cancellation policy not enforced | Medium | Time-based cutoff rules |
| No technician assignment algorithm | High | Skill matching + availability |
| No audit trail for data changes | Medium | Implement activity logging table |
| Missing Swagger/OpenAPI docs | Medium | `swagger-jsdoc` + `swagger-ui-express` |

---

## 🔒 Security Analysis

### Current Status

| Area | Risk Level | Status | Action Required |
|---|---|---|---|
| Password Storage | 🔴 Critical | Plain text | Implement bcrypt immediately |
| Token Authentication | 🔴 Critical | Fake bearer token | Implement JWT with expiration |
| Auto-User Creation | 🔴 Critical | Any email creates account | Remove from production |
| Rate Limiting | 🔴 Critical | None | Add `express-rate-limit` |
| Security Headers | 🟠 High | Missing | Add `helmet.js` |
| XSS (localStorage) | 🟠 High | Vulnerable | Switch to httpOnly cookies |
| SQL Injection | 🟢 Low | Parameterized queries | Keep using `$1, $2` placeholders |
| CORS | 🟢 Low | Configured | Review allowed origins for production |
| HTTPS | 🟡 Medium | Not enforced | Add redirect + `helmet.hsts()` |
| Input Validation | 🟡 Medium | Partial (auth only) | Add Zod middleware to all routes |

### Security Implementation Priority

```
Week 1:
  ✅ npm install bcrypt jsonwebtoken helmet express-rate-limit
  ✅ Hash all passwords with bcrypt (rounds: 10)
  ✅ Implement JWT signing + verification middleware
  ✅ Add helmet() to src/index.ts
  ✅ Add rate limiters to auth and API routes

Week 2:
  ✅ Create authMiddleware to protect all /api routes
  ✅ Switch frontend token to httpOnly cookies
  ✅ Add Zod validation middleware to all POST/PUT routes
  ✅ Remove auto-user creation from login
```

---

## 🔄 Workflow Definitions

### Appointment Lifecycle (State Machine)

```
Pending ──→ Confirmed ──→ In Progress ──→ Completed
   │              │                            │
   └──→ Cancelled └──→ Cancelled          Feedback
```

**State Transition Table:**

| From | To | Trigger | Actor | Validation Required |
|---|---|---|---|---|
| `pending` | `confirmed` | Admin assigns technician | Admin | Technician available |
| `pending` | `cancelled` | Customer cancels | Customer | Before cutoff time |
| `confirmed` | `in_progress` | Technician starts work | Technician | Within appointment window |
| `confirmed` | `cancelled` | Admin cancels | Admin | Notify customer |
| `in_progress` | `completed` | Technician marks done | Technician | Notes required |
| `completed` | — | Customer leaves feedback | Customer | One feedback per appointment |

**Implementation Pattern (to be built):**

```typescript
// src/workflows/AppointmentWorkflow.ts

const TRANSITIONS: Record<string, string[]> = {
  pending:     ['confirmed', 'cancelled'],
  confirmed:   ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed:   [],
  cancelled:   [],
};

export function canTransition(current: string, target: string): boolean {
  return TRANSITIONS[current]?.includes(target) ?? false;
}

export function validateTransition(appointment: Appointment, target: string): void {
  if (!canTransition(appointment.status, target)) {
    throw new AppError(
      `Cannot transition from '${appointment.status}' to '${target}'`,
      400,
      'INVALID_STATE_TRANSITION'
    );
  }

  if (target === 'confirmed' && !appointment.technicianId) {
    throw new AppError('A technician must be assigned before confirming', 400, 'MISSING_TECHNICIAN');
  }
}
```

---

## 🧪 Testing Strategy

### Current Coverage

```
Unit Tests:        0% ❌
Integration Tests: 0% ❌
E2E Tests:         0% ❌
```

### Target Coverage by Phase

| Phase | Target | Timeline |
|---|---|---|
| Phase 1 | 50% | Month 1 |
| Phase 2 | 80% | Month 2 |
| Phase 3 | 90%+ | Month 3 |

### Test Setup

**Backend:**
```bash
pnpm add -D jest @types/jest ts-jest supertest @types/supertest

# jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};
```

**Frontend:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom
```

### Priority Test Cases

**1. Authentication (Critical):**
```typescript
// schedulerAPI/src/routes/__tests__/auth.test.ts

describe('POST /api/auth/login', () => {
  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrong', role: 'customer' });
    expect(res.status).toBe(401);
  });

  it('returns JWT on success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@example.com', password: 'password123', role: 'customer' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toMatch(/^eyJ/); // JWT format
  });
});
```

**2. Appointment State Machine:**
```typescript
describe('Appointment Workflow', () => {
  it('allows pending → confirmed transition', async () => { /* ... */ });
  it('blocks pending → completed directly', async () => { /* ... */ });
  it('requires technician for confirmation', async () => { /* ... */ });
});
```

**3. Protected Route (Frontend):**
```typescript
test('redirects unauthenticated user to login', () => {
  render(
    <MemoryRouter initialEntries={['/customer/dashboard']}>
      <AuthProvider>
        <Routes>
          <Route path="/customer/dashboard"
            element={<ProtectedRoute requiredRole="customer"><div>Dashboard</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText('Login Page')).toBeInTheDocument();
});
```

### Test Directory Structure (To Be Built)

```
schedulerAPI/src/
└── routes/
    └── __tests__/
        ├── auth.test.ts         ❌
        ├── users.test.ts        ❌
        ├── appointments.test.ts ❌
        ├── technicians.test.ts  ❌
        └── serviceCentres.test.ts ❌

schedulerUI/src/
└── app/
    ├── pages/__tests__/
    │   ├── LoginPage.test.tsx   ❌
    │   ├── RegisterPage.test.tsx ❌
    │   └── customer/
    │       └── CustomerDashboard.test.tsx ❌
    ├── context/__tests__/
    │   └── AuthContext.test.tsx ❌
    └── services/__tests__/
        └── api.test.ts          ❌
```

---

## ⚡ Performance Considerations

### Current Good Practices ✅

- Vite for fast frontend HMR and optimized builds
- PostgreSQL connection pooling via `pg` library
- Pagination-ready list endpoint structure
- TypeScript for compile-time error catching

### Areas to Optimize

| Area | Issue | Recommendation |
|---|---|---|
| DB Queries | N+1 queries possible | Use JOIN queries; add `pg` query analysis |
| Indexes | Missing on key columns | Add index on `appointments.status`, `appointments.customer_id`, `users.email` |
| Caching | No caching layer | Add Redis for session tokens + frequent lookups |
| Frontend Bundle | Not yet analyzed | Run `vite build --report` + lazy load admin pages |
| List Endpoints | No pagination implemented | Add `?page=1&limit=20` query parameter support |

### Recommended Database Indexes

```sql
-- Add after initial schema creation
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_technician ON appointments(technician_id);
CREATE INDEX idx_appointments_date ON appointments(preferred_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

### Environment Variables

Create `.env` in `schedulerAPI/`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scheduler_db
DB_USER=postgres
DB_PASSWORD=your_password

# Security (REQUIRED before production)
JWT_SECRET=your-very-long-random-secret-key-here
BCRYPT_ROUNDS=10

# CORS
FRONTEND_URL=http://localhost:5173

# Email (planned)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASSWORD=your_smtp_password
```

### Backend Setup

```bash
cd schedulerAPI

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env
# Edit .env with your values

# Initialize database
psql -U postgres -c "CREATE DATABASE scheduler_db;"

# Start development server (auto-creates tables on first run)
pnpm dev

# Verify health
curl http://localhost:3001/health
```

### Frontend Setup

```bash
cd schedulerUI

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
# http://localhost:5173
```

### Demo Credentials (Development Only)

| Role | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `password123` |
| Technician | `tech@example.com` | `password123` |
| Admin | `admin@example.com` | `admin123` |

> ⚠️ These credentials are for local development only. Remove or change before any deployment.

---

## 🗺️ Recommended Enhancements Roadmap

### Phase 1 — Security & Foundation (Weeks 1–4) 🔴

**Estimated: 40–60 hours**

| Task | Effort | Owner |
|---|---|---|
| Implement bcrypt password hashing | 4 hrs | Backend |
| Implement JWT authentication | 8 hrs | Backend |
| Add `helmet` security headers | 2 hrs | Backend |
| Add rate limiting | 2 hrs | Backend |
| Migrate all routes from mock to PostgreSQL | 16 hrs | Backend |
| Add Prisma ORM for migrations | 8 hrs | Backend |
| Add `authMiddleware` to protect routes | 4 hrs | Backend |
| Switch frontend from localStorage to cookies | 4 hrs | Frontend |
| Remove auto-user creation in login | 1 hr | Backend |
| Write 20 critical auth + appointment tests | 12 hrs | QA |

**Deliverables:**
- Real JWT-based authentication
- Persistent database for all entities
- 30%+ test coverage
- No critical security vulnerabilities

### Phase 2 — Feature Completion (Weeks 5–10) 🟠

**Estimated: 60–80 hours**

| Task | Effort |
|---|---|
| Complete all 6 admin pages with real API | 24 hrs |
| Wire all dashboard pages to real API | 16 hrs |
| Implement appointment workflow state machine | 8 hrs |
| Add conflict detection for bookings | 6 hrs |
| Implement email verification on registration | 8 hrs |
| Add password reset flow | 8 hrs |
| Add search + filtering on list endpoints | 8 hrs |
| Add pagination to all list endpoints | 4 hrs |
| Achieve 70% test coverage | 16 hrs |

### Phase 3 — Polish & Enhancement (Weeks 11–16) 🟡

**Estimated: 40–60 hours**

| Task | Effort |
|---|---|
| Email/SMS notifications for appointment changes | 12 hrs |
| Real-time status updates (polling or WebSocket) | 8 hrs |
| Analytics and reporting (real data) | 12 hrs |
| Swagger/OpenAPI documentation | 6 hrs |
| Redis caching for sessions + frequent queries | 8 hrs |
| Accessibility audit (a11y) | 6 hrs |
| Performance optimization + bundle analysis | 6 hrs |

### Phase 4 — Advanced (Ongoing)

- Payment integration (Stripe / M-Pesa)
- Mobile-responsive improvements
- Technician skill-based smart assignment
- Customer rating analytics
- Predictive availability model

---

## 📦 Deployment Readiness

### Checklist

| Area | Backend | Frontend |
|---|---|---|
| Security hardened | ❌ Not ready | ❌ Not ready |
| Tests passing (>80%) | ❌ 0% | ❌ 0% |
| Real database persistence | ❌ Partial | N/A |
| Error handling complete | ⚠️ Partial | ⚠️ Partial |
| Rate limiting | ❌ Missing | N/A |
| HTTPS configured | ❌ Missing | ❌ Missing |
| Environment secrets secured | ⚠️ Local only | ⚠️ Local only |
| API documented | ❌ Missing | N/A |
| Error boundaries | N/A | ❌ Missing |
| 404 page | ✅ Done | ❌ Missing |
| Bundle optimized | N/A | ⚠️ Not analyzed |

### Recommended Production Stack

```
Frontend:   Vercel / Netlify (static React build)
Backend:    Railway / Render / Fly.io (Node.js container)
Database:   Supabase / Railway PostgreSQL / AWS RDS
Cache:      Upstash Redis
Email:      SendGrid / Resend
Monitoring: Sentry (errors) + UptimeRobot (uptime)
CI/CD:      GitHub Actions
```

---

## 📞 Troubleshooting

**Port 3001 already in use:**
```bash
# Linux/macOS
lsof -ti:3001 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

**Database connection refused:**
```bash
# Ensure PostgreSQL is running
pg_isready -h localhost -p 5432

# Create DB if missing
psql -U postgres -c "CREATE DATABASE scheduler_db;"
```

**CORS errors in browser:**
- Check `FRONTEND_URL` in `.env` matches exactly where Vite is running (including port)
- Clear browser cache and restart both servers

**Module not found:**
```bash
pnpm install --force
```

---

## 📝 Key Lessons from Production ERP Systems Applied Here

The following patterns from mature ERP system development have been incorporated into this roadmap:

**1. Centralized Base Patterns** — Just as the Bengo ERP uses `BaseOrder` and `BaseOrderSerializer`, this project benefits from `BaseSerializer` (already implemented) and should extend that to a `BaseRepository` pattern for database access.

**2. Audit Trail** — Production systems log every data mutation. An `audit_log` table should be added to track who changed what and when.

**3. State Machine Workflows** — The appointment lifecycle should be formally enforced with a transition table (not just status string updates), preventing illegal state jumps.

**4. Document/ID Services** — Appointment reference numbers should be human-readable and auto-generated (e.g., `APT-20260311-0042`) using a centralized generation service.

**5. Standardized Error Codes** — All errors should carry a machine-readable `code` (e.g., `APPOINTMENT_CONFLICT`) in addition to a human message, enabling frontend-specific error handling.

---

## 📈 Success Metrics

| Metric | Current | Phase 1 Target | Phase 2 Target |
|---|---|---|---|
| Test coverage | 0% | 50% | 80% |
| Critical security issues | 5 | 0 | 0 |
| API response time (p95) | Unknown | < 300ms | < 200ms |
| Data persistence | ❌ | ✅ | ✅ |
| Production uptime | N/A | 99% | 99.9% |

---

## 📅 Document Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-11 | Initial comprehensive audit and documentation |

---

**Prepared by:** Development Team  
**Last Updated:** March 11, 2026  
**Status:** ✅ Ready for Implementation  
**Next Review:** After Phase 1 completion (4 weeks)
