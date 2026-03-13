# Scheduler Application - Complete Integration Guide

## ✅ System Status

### Frontend (React + TypeScript + Vite)
- **URL**: http://localhost:5174
- **Status**: ✅ Running
- **Port**: 5174
- **Framework**: React 18.3.1 with React Router 7.13.0
- **Build Tool**: Vite 6.3.5

### Backend (Node.js + Express + PostgreSQL)
- **URL**: http://localhost:3001/api
- **Status**: ✅ Running
- **Port**: 3001
- **Runtime**: Node.js with tsx
- **Database**: PostgreSQL

---

## 🔄 Frontend-Backend Integration

### API Base URL Configuration
**File**: `schedulerUI/.env.development`
```
VITE_API_URL=http://localhost:3001/api
```

### API Client Setup
**File**: `schedulerUI/src/services/api.ts`

The API client with proper serialization handling:
- ✅ Handles both legacy and new serialized response formats
- ✅ Automatic error extraction from `response.errors` object
- ✅ Debug logging for all API calls
- ✅ Request timeout handling (30 seconds default)
- ✅ Proper token management with Bearer authentication

### CORS Configuration
**File**: `schedulerAPI/src/index.ts`

Allowed origins for development:
- http://localhost:5173
- http://localhost:5174
- http://localhost:3000
- http://127.0.0.1:5173
- http://127.0.0.1:5174

---

## 🏗️ Advanced Serializers (Backend)

**File**: `schedulerAPI/src/utils/serializers.ts`

### Included Serializers:

#### 1. **BaseSerializer**
   - Generic data transformation
   - Include/exclude field filtering
   - Custom field transformations

#### 2. **UserSerializer**
   - Excludes password fields automatically
   - Formats timestamps to ISO format
   - Null handling for optional fields

#### 3. **AppointmentSerializer**
   - Formats appointment dates to ISO
   - Handles status and cancellation data
   - Timestamp normalization

#### 4. **TechnicianSerializer**
   - Specializations array handling
   - Availability status serialization
   - Timestamp formatting

#### 5. **ServiceCentreSerializer**
   - Service list array handling
   - Location and operating hours formatting
   - Contact information normalization

### Input Validators
- ✅ Email validation with regex
- ✅ Password requirements (minimum 6 characters)
- ✅ Phone number validation (10+ digits)
- ✅ Name validation (2-100 characters)
- ✅ Role validation (customer, technician, admin)

### Response Format
All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2026-03-11T...",
    "version": "1.0.0"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "fieldName": ["error 1", "error 2"]
  },
  "message": "Validation failed",
  "meta": {
    "timestamp": "2026-03-11T...",
    "version": "1.0.0"
  }
}
```

---

## 🔐 Authentication Flow

### Register Endpoint
- **Path**: `POST /api/auth/register`
- **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "password": "SecurePass123",
    "role": "customer"
  }
  ```
- **Response**: Returns user object + bearer token
- **Validation**: Full input validation with field-specific error messages

### Login Endpoint
- **Path**: `POST /api/auth/login`
- **Request**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "customer"
  }
  ```
- **Response**: Returns authenticated user + bearer token
- **Demo Mode**: Auto-creates users if they don't exist

### Get Current User
- **Path**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Current user object (password excluded)

---

## 📱 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Technicians
- `GET /api/technicians` - List all technicians
- `GET /api/technicians/:id` - Get technician by ID
- `POST /api/technicians` - Create new technician
- `PUT /api/technicians/:id` - Update technician
- `DELETE /api/technicians/:id` - Delete technician

### Service Centres
- `GET /api/service-centres` - List all service centres
- `GET /api/service-centres/:id` - Get centre by ID
- `POST /api/service-centres` - Create new centre
- `PUT /api/service-centres/:id` - Update centre
- `DELETE /api/service-centres/:id` - Delete centre

### Health Check
- `GET /health` - Server health status (includes database and environment info)

---

## 🛠️ Frontend Pages & Components

### Login Page
- **File**: `schedulerUI/src/app/pages/LoginPage.tsx`
- Features:
  - Role selection dropdown (customer, technician, admin)
  - Email validation
  - Password field with visibility toggle
  - Google login placeholder
  - Demo credentials display
  - Form state management with React Hook Form

### Register Page
- **File**: `schedulerUI/src/app/pages/RegisterPage.tsx`
- Features:
  - Full name input
  - Email validation
  - Phone number input
  - Password with confirmation
  - Password mismatch detection
  - Comprehensive validation messaging
  - Loading state during submission

### Auth Context
- **File**: `schedulerUI/src/app/context/AuthContext.tsx`
- Provides:
  - User state management
  - Token persistence (localStorage)
  - Login/register/logout functions
  - Auth state recovery on app load
  - Error handling with toast notifications

---

## 🔄 Data Flow Example: User Registration

1. **User fills form** (RegisterPage.tsx)
   - Name, Email, Phone, Password, Password Confirmation

2. **Form Validation** (React Hook Form + Zod)
   - Client-side validation before submission
   - Error messages shown in real-time

3. **API Request** (api.ts)
   ```
   POST /api/auth/register
   Content-Type: application/json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "+254712345678",
     "password": "SecurePass123",
     "role": "customer"
   }
   ```

4. **Backend Processing** (auth.ts route)
   - Input validation with InputValidator
   - Email uniqueness check
   - User creation in database
   - Password hashing (in production)
   - Serialized response creation

5. **Serialization** (serializers.ts)
   - UserSerializer removes password field
   - Timestamps converted to ISO format
   - Response wrapped in success envelope

6. **API Response**
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "uuid",
         "name": "John Doe",
         "email": "john@example.com",
         "phone": "+254712345678",
         "role": "customer",
         "createdAt": "2026-03-11T..."
       },
       "token": "bearer_uuid"
     },
     "message": "Registration successful",
     "meta": {...}
   }
   ```

7. **Frontend Processing** (AuthContext)
   - Extract user and token from response
   - Store token in localStorage
   - Store user object in state
   - Set API client token
   - Show success toast
   - Redirect to dashboard

---

## 🐛 Debugging & Logs

### Browser Console Logs
The frontend logs all API calls:
```
[API] POST /auth/login
[API] Response: {...}
```

### Backend Console Logs
The backend shows timestamped request logs:
```
[2026-03-11T...] POST /api/auth/register
[2026-03-11T...] GET /api/users
```

### Error Tracing
- Frontend errors caught and shown as toast notifications
- Validation errors include field-specific messages
- Backend errors logged with full stack trace in development mode

---

## ✨ Key Features Implemented

### ✅ Complete Integration
- Frontend properly sends requests with `Content-Type: application/json`
- Backend responds with consistent JSON format
- CORS properly configured for development
- Token-based authentication works end-to-end

### ✅ Advanced Serializers
- Data transformation on the fly
- Automatic password field exclusion
- Timestamp ISO formatting
- Null/undefined field handling
- Custom field transformations

### ✅ Comprehensive Validation
- Input validation on both client and server
- Detailed error messages with field names
- Email, phone, password strength checks
- Role enumeration validation

### ✅ Error Handling
- Centralized error responses
- Multiple error format fallbacks
- Timeout handling
- Network error management
- User-friendly error messaging

### ✅ TypeScript Support
- Full type safety for API responses
- Proper interface definitions
- Generic type parameters
- Type inference throughout

---

## 🚀 Testing the Integration

### Test Registration
1. Navigate to http://localhost:5174/register
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +254712345678
   - Password: SecurePass123
3. Click "Create Account"
4. Check browser console for API logs
5. Should redirect to dashboard

### Test Login
1. Navigate to http://localhost:5174/login
2. Select role: Customer
3. Enter email: john@example.com
4. Enter password: SecurePass123
5. Click "Sign In"
6. Should redirect to dashboard

### Test Form Validation
1. Try submitting empty form
   - See validation errors appear in real-time
2. Try invalid email
   - See email validation error
3. Try passwords that don't match
   - See password mismatch error
4. Try password under 6 characters
   - See password length requirement

### Test API Endpoints
Use curl or Postman to test:
```bash
# Health check
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+254712345678",
    "password": "SecurePass123",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123",
    "role": "customer"
  }'
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (http://localhost:5174)          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React App (RegisterPage / LoginPage)               │   │
│  │  - React Hook Form                                  │   │
│  │  - Zod Validation                                   │   │
│  │  - Toast Notifications                              │   │
│  └────────────────┬────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │ JSON + Authorization Header
                    │ http://localhost:3001/api
┌───────────────────┼─────────────────────────────────────────┐
│                   │  Node.js Backend (Express)              │
│  ┌────────────────┴────────────────────────────────────┐   │
│  │  API Routes (auth, users, appointments, etc)        │   │
│  │  - Input Validation (InputValidator)                │   │
│  │  - CORS Middleware                                  │   │
│  │  - Error Handling Middleware                        │   │
│  │  - Request Logging Middleware                       │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────┴────────────────────────────────────┐   │
│  │  Advanced Serializers                               │   │
│  │  - UserSerializer (excludes password)               │   │
│  │  - AppointmentSerializer                            │   │
│  │  - TechnicianSerializer                             │   │
│  │  - ServiceCentreSerializer                          │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────┴────────────────────────────────────┐   │
│  │  PostgreSQL Database Connection                     │   │
│  │  - User table                                       │   │
│  │  - Appointments table                               │   │
│  │  - Technicians table                                │   │
│  │  - Service centres table                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 File Structure

### Frontend
```
schedulerUI/
├── src/
│  ├── services/
│  │  └── api.ts (API Client with serialization support)
│  ├── app/
│  │  ├── context/
│  │  │  └── AuthContext.tsx (Auth state + API calls)
│  │  └── pages/
│  │     ├── LoginPage.tsx (Login form)
│  │     └── RegisterPage.tsx (Registration form)
│  └── main.tsx
├── vite.config.ts (Port 5174 configuration)
├── tsconfig.json (TypeScript configuration)
└── .env.development (API URL configuration)
```

### Backend
```
schedulerAPI/
├── src/
│  ├── utils/
│  │  └── serializers.ts (Advanced serializer system)
│  ├── routes/
│  │  ├── auth.ts (Authentication with serializers)
│  │  ├── users.ts (User management)
│  │  ├── appointments.ts (Appointment management)
│  │  ├── technicians.ts (Technician management)
│  │  └── serviceCentres.ts (Service centre management)
│  ├── db/
│  │  ├── connection.ts (PostgreSQL connection)
│  │  └── init.ts (Database initialization)
│  └── index.ts (Express app setup, CORS, error handling)
└── package.json
```

---

## ✔️ Verification Checklist

- [x] Frontend running on http://localhost:5174
- [x] Backend running on http://localhost:3001
- [x] CORS configured for both ports
- [x] API client updated to handle serialized responses
- [x] All routes use advanced serializers
- [x] Input validation on all endpoints
- [x] Error handling with detailed messages
- [x] Auth context properly handles responses
- [x] Login and Register forms work end-to-end
- [x] Form validation shows real-time feedback
- [x] Console logs API calls for debugging
- [x] Token management fully functional
- [x] localStorage persistence working
- [x] Success/error toasts displaying
- [x] Redirect to dashboard on success

---

## 🆘 Troubleshooting

### "Invalid input: expected string, received undefined"
✅ **Fixed**: All Controller fields now have explicit `rules` props and fallback values with `||""`

### "CORS error: Cross-Origin Request Blocked"
✅ **Fixed**: Added multiple allowed origins (5173, 5174, 3000) to backend CORS config

### "Cannot connect to API"
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check frontend API URL in `.env.development`
3. Verify CORS headers in browser DevTools Network tab

### Form not submitting
1. Check browser console for validation errors
2. Verify form data in console.log output
3. Check backend logs for request errors
4. Ensure all required fields are filled

### Token not persisting
1. Check localStorage in DevTools Application tab
2. Verify `localStorage.setItem` is being called
3. Check for localStorage permission issues
4. Verify token format (should have "bearer_" prefix)

---

## 📝 Next Steps

1. **Add more form pages** (Appointments, Technicians, etc.)
2. **Implement dashboard pages** for each role
3. **Add protected routes** for authenticated-only pages
4. **Enhance database schema** with proper migrations
5. **Add password hashing** (bcrypt) for production
6. **Implement JWT tokens** instead of bearer tokens
7. **Add email verification** flow
8. **Add refresh token** mechanism
9. **Implement pagination** for list endpoints
10. **Add search and filtering** capabilities

---

**Last Updated**: March 11, 2026
**System Status**: ✅ Fully Functional & Integrated
**Ready for**: Development & Testing
