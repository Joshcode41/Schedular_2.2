# 🗺️ WAY FORWARD — Scheduler App Completion Roadmap

**Generated:** March 16, 2026  
**Based on:** COMPREHENSIVE_AUDIT.md · AUDIT_REPORT.md · INTEGRATION_GUIDE.md · REVIEW_NOTES.md · PROJECT_SUMMARY.md  
**Author:** Joshua  
**Goal:** Bring the Scheduler App from ~75% to fully functional and production-ready

---

## 📊 Where You Stand Right Now

| Area | Completion | Blocker |
|------|-----------|---------|
| Backend routes | ✅ 95% | Service Centres missing PUT/DELETE |
| Database schema | ✅ 100% | — |
| Auth (bcrypt + JWT) | ✅ 100% | — |
| Backend tests | ⚠️ 45% | Route tests failing (DB connection in test env) |
| Frontend UI | ✅ 80% | — |
| Frontend ↔ API wiring | ❌ 20% | 13 of 15 pages still use mockData |
| Frontend tests | ❌ 0% | Not set up yet |
| Security | ⚠️ 70% | localStorage XSS, missing httpOnly cookies |
| Documentation | ✅ 80% | — |

**The single biggest gap:** your frontend pages exist and look great, but most of them read from `mockData.ts` instead of your real API. Fixing that is the fastest path to a fully working app.

---

## 🔴 PHASE 1 — Fix the Two Remaining Backend Gaps
**Time estimate: ~3 hours**  
**Do this first — it unblocks the frontend wiring.**

### 1.1 Complete Service Centres Route

File: `schedulerAPI/src/routes/serviceCentres.ts`

Add the two missing endpoints:

```typescript
// PUT /api/service-centres/:id  — Update a centre
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, location, address, phone, email, operating_hours } = req.body;
  const errors = InputValidator.validateServiceCentre({ name, location, address });
  if (errors.length > 0) return res.status(400).json({ success: false, errors });

  const result = await pool.query(
    `UPDATE service_centres
     SET name=$1, location=$2, address=$3, phone=$4, email=$5,
         operating_hours=$6, updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [name, location, address, phone, email, JSON.stringify(operating_hours), id]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Centre not found' });
  return res.json({ success: true, data: ServiceCentreSerializer.serialize(result.rows[0]) });
});

// DELETE /api/service-centres/:id  — Remove a centre
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const result = await pool.query(
    'DELETE FROM service_centres WHERE id=$1 RETURNING id', [req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Centre not found' });
  return res.json({ success: true, message: 'Service centre deleted' });
});
```

### 1.2 Fix the Failing Route Tests

Files: `src/__tests__/routes.auth.test.ts`, `routes.users.test.ts`, `routes.appointments.test.ts`

The tests are failing because they hit the real PostgreSQL pool. Use a test database or mock the pool:

```typescript
// At the top of each route test file
jest.mock('../../db/connection', () => ({
  pool: {
    query: jest.fn(),
  },
}));

import { pool } from '../../db/connection';
const mockPool = pool as jest.Mocked<typeof pool>;

// Then in each test
mockPool.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1 });
```

Or create a `.env.test` with a separate test database and add `"test:db": "jest --testPathPattern=routes"` to your scripts.

---

## 🟠 PHASE 2 — Wire the Frontend to the Real API
**Time estimate: ~8–10 hours**  
**This is the core work that makes the app actually functional.**

Your `useData.ts` hooks and `api.ts` client already exist — the pages just aren't using them. The pattern is the same for every page: replace `mockData` imports with hook calls.

### 2.1 Remove Mock Data Dependency

In `schedulerUI/src/lib/mockData.ts`, add a top comment:

```typescript
// ⚠️  DEPRECATED — Do not import from this file in new code.
// Replace all usages with hooks from src/app/hooks/useData.ts
```

Then tackle each page in this order:

---

### 2.2 Customer Pages (Highest Priority)

**`CustomerDashboard.tsx`**
```typescript
// ❌ Before
import { mockAppointments } from '@/lib/mockData';

// ✅ After
import { useAppointments } from '@/app/hooks/useData';

const { appointments, loading, error } = useAppointments({ customerId: user?.id });
```

**`BookAppointment.tsx`** — form already built, just needs the submit handler:
```typescript
const { createAppointment } = useAppointments();

const onSubmit = async (data: BookingFormData) => {
  await createAppointment({
    customer_id: user!.id,
    service_centre_id: data.serviceCentreId,
    appointment_date: data.date,
    service_type: data.serviceType,
    description: data.description,
  });
  navigate('/customer/appointments');
};
```

**`AppointmentDetails.tsx`**
```typescript
const { id } = useParams();
const { appointment, loading } = useAppointment(id!);
```

**`FeedbackForm.tsx`**
```typescript
const { submitFeedback } = useFeedback();

const onSubmit = async (data: FeedbackData) => {
  await submitFeedback({ appointment_id: appointmentId, ...data });
  toast.success('Thank you for your feedback!');
};
```

---

### 2.3 Technician Pages

**`TechnicianDashboard.tsx`**
```typescript
const { appointments, loading } = useAppointments({ technicianId: user?.id });
```

**`UpdateStatus.tsx`** — this one already has a form, just needs the submit:
```typescript
const { updateAppointment } = useAppointments();

const onSubmit = async (data: StatusUpdateData) => {
  await updateAppointment(appointmentId, {
    status: data.status,
    notes: data.notes,
  });
};
```

---

### 2.4 Admin Pages

These are more complex. Wire them in this order:

| Page | Hook to Use | Estimated Time |
|------|-------------|---------------|
| `UserManagement.tsx` | `useUsers()` | 1 hr |
| `ServiceCentreManagement.tsx` | `useServiceCentres()` | 1 hr |
| `TechnicianAssignment.tsx` | `useTechnicians()` + `useAppointments()` | 1.5 hrs |
| `AdminDashboard.tsx` | `useUsers()` + `useAppointments()` for stats | 1 hr |
| `ReportsAnalytics.tsx` | `useAppointments()` + Recharts | 1.5 hrs |
| `CustomerCRM.tsx` | `useUsers({ role: 'customer' })` | 1 hr |
| `CalendarManagement.tsx` | `useAppointments()` | 1 hr |

**Pattern for all admin list pages:**
```typescript
const [page, setPage] = useState(1);
const { users, total, loading, refetch } = useUsers({ page, limit: 10 });

// Render a loading skeleton while loading === true
// Render error state if error !== null
// Render table with users when data is ready
// Wire delete/edit buttons to API calls + refetch()
```

---

### 2.5 Add Loading & Error States Everywhere

Every page that calls an API needs these three states:

```tsx
if (loading) return <PageSkeleton />;
if (error) return <ErrorBanner message={error} onRetry={refetch} />;
if (!data) return <EmptyState message="No data found" />;
```

Create reusable components for these if they don't already exist:
- `src/app/components/PageSkeleton.tsx`
- `src/app/components/ErrorBanner.tsx`
- `src/app/components/EmptyState.tsx`

---

## 🔴 PHASE 3 — Fix the Security Issue (XSS Vulnerability)
**Time estimate: ~2–3 hours**  
**Do this before any real users touch the app.**

Right now your JWT is stored in `localStorage`, which is vulnerable to XSS attacks — any malicious script on the page can steal it.

### 3.1 Backend: Set httpOnly Cookie Instead of Returning Token

In `schedulerAPI/src/routes/auth.ts`, after login/register succeeds:

```typescript
// ❌ Before: returning token in response body
return res.json({ success: true, data: { user, token } });

// ✅ After: set as httpOnly cookie + return user only
res.cookie('auth_token', token, {
  httpOnly: true,        // JS cannot read this
  secure: process.env.NODE_ENV === 'production',   // HTTPS only in prod
  sameSite: 'strict',    // Prevents CSRF
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
});
return res.json({ success: true, data: { user } });
```

Also update `POST /auth/logout`:
```typescript
res.clearCookie('auth_token');
return res.json({ success: true, message: 'Logged out' });
```

### 3.2 Backend: Read Token from Cookie in Auth Middleware

In `schedulerAPI/src/middleware/authMiddleware.ts`:

```typescript
// Install: pnpm add cookie-parser @types/cookie-parser
// In index.ts: app.use(cookieParser());

export const authenticateToken = (req, res, next) => {
  // Try cookie first, fall back to Authorization header (for API clients)
  const token = req.cookies?.auth_token
    || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};
```

### 3.3 Frontend: Remove localStorage Token Storage

In `schedulerUI/src/app/context/AuthContext.tsx`:

```typescript
// ❌ Remove these lines
localStorage.setItem('auth_token', token);
const token = localStorage.getItem('auth_token');
localStorage.removeItem('auth_token');

// ✅ The cookie is now sent automatically by the browser.
// All you need to keep is the user object in state.
// Add credentials: 'include' to all API calls (see next step)
```

### 3.4 Frontend: Send Credentials with Every Request

In `schedulerUI/src/services/api.ts`, update the fetch config:

```typescript
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  ...options,
  credentials: 'include',  // ← send httpOnly cookie automatically
  headers: {
    'Content-Type': 'application/json',
    ...options.headers,
  },
});
```

---

## 🟡 PHASE 4 — Frontend Testing Setup
**Time estimate: ~4–6 hours to set up + write first batch**  
**Target: 60% coverage before going to production**

### 4.1 Install Testing Dependencies

```bash
cd schedulerUI
pnpm add -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom @vitest/coverage-v8
```

### 4.2 Update `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/app/components/ui/'],
    },
  },
});
```

### 4.3 Create `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});
```

### 4.4 Add Scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4.5 Write Tests in This Order

Start with the most critical paths:

**1. Auth tests** — `src/app/context/AuthContext.test.tsx`
```typescript
it('stores user in state after successful login', async () => {
  mockFetch({ user: mockUser });
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await act(() => result.current.login('john@email.com', 'pass', 'customer'));
  expect(result.current.user).toEqual(mockUser);
});
```

**2. ProtectedRoute tests** — `src/app/components/ProtectedRoute.test.tsx`
```typescript
it('redirects unauthenticated user to /login', () => {
  renderWithRouter(<ProtectedRoute />, { authState: null });
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
});
```

**3. Form tests** — `LoginPage.test.tsx`, `RegisterPage.test.tsx`
```typescript
it('shows validation error for empty email', async () => {
  render(<LoginPage />);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});
```

**4. Page snapshot tests** — for the 6 most-used pages

---

## 🟡 PHASE 5 — Nice-to-Have Features (After MVP)
**Prioritised by business value**

### 5.1 Email Notifications (~3–4 hrs)

```bash
pnpm add nodemailer @types/nodemailer
```

Create `schedulerAPI/src/services/emailService.ts` with three templates:
- Appointment confirmation (to customer + technician)
- Appointment status update
- Password reset link

Add to your `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
```

Trigger emails inside the appointments route after `status` changes.

### 5.2 Password Reset Flow (~2–3 hrs)

Backend:
- `POST /api/auth/forgot-password` — generates a signed 1-hour reset token, emails it
- `POST /api/auth/reset-password` — validates token, hashes new password, clears token

Frontend:
- `ForgotPasswordPage.tsx` — email input form
- `ResetPasswordPage.tsx` — new password + confirm form

### 5.3 Refresh Token (~2 hrs)

Right now tokens expire after 24h and users get logged out silently. Add:

```typescript
// Backend: issue refresh token (7 days) alongside access token (15 min)
// Frontend: interceptor in api.ts that auto-calls /auth/refresh on 401
```

### 5.4 Swagger API Documentation (~1–2 hrs)

```bash
pnpm add swagger-ui-express swagger-jsdoc @types/swagger-ui-express
```

Add JSDoc annotations to your routes and serve Swagger UI at `/api/docs`.

### 5.5 Real-time Updates (~4–6 hrs)

For the technician dashboard — appointment status changes should reflect live.

```bash
pnpm add socket.io socket.io-client
```

Emit `appointment:updated` events from the backend after any status change. Subscribe in `TechnicianDashboard.tsx`.

---

## 🚀 PHASE 6 — Deployment
**Do this once MVP is solid**

### 6.1 Pre-Deployment Checklist

```
Backend:
  ☐ All .env variables documented in .env.example
  ☐ DATABASE_URL uses connection pooling (PgBouncer or pg pool settings)
  ☐ JWT_SECRET is a long random string (openssl rand -base64 64)
  ☐ NODE_ENV=production in deployment environment
  ☐ CORS origins updated to production frontend URL
  ☐ Remove all console.log statements (or replace with a logger like pino)

Frontend:
  ☐ VITE_API_URL set to production backend URL in .env.production
  ☐ pnpm build runs without TypeScript errors
  ☐ No hardcoded localhost URLs anywhere
  ☐ Error boundaries on all major page trees
```

### 6.2 Recommended Deployment Stack

| Service | What | Cost |
|---------|------|------|
| **Railway** | Backend (Express + PostgreSQL) | Free tier available |
| **Vercel** | Frontend (React/Vite) | Free tier |
| **Neon** | Managed PostgreSQL (alternative) | Free tier |
| **Resend** | Email service (cleaner than Gmail SMTP) | Free tier |

### 6.3 Deployment Steps

```bash
# 1. Push your code to GitHub

# 2. Create a Railway project
#    - Add a PostgreSQL service
#    - Add a Web Service pointed at schedulerAPI/
#    - Set all env variables in Railway dashboard

# 3. Run migrations on production DB
#    railway run -- node -e "require('./src/db/init').initDatabase()"

# 4. Deploy frontend to Vercel
#    - Connect your GitHub repo
#    - Set root to schedulerUI/
#    - Add VITE_API_URL = https://your-railway-url.up.railway.app/api
```

---

## 📋 Master Checklist (Print This)

### Phase 1 — Backend gaps (~3 hrs)
- [ ] Add PUT/DELETE to serviceCentres route
- [ ] Fix route tests (mock DB connection)

### Phase 2 — API wiring (~8–10 hrs)  ← The big one
- [ ] `CustomerDashboard.tsx` → `useAppointments()`
- [ ] `BookAppointment.tsx` → `createAppointment()` on submit
- [ ] `AppointmentDetails.tsx` → `useAppointment(id)`
- [ ] `FeedbackForm.tsx` → `submitFeedback()`
- [ ] `TechnicianDashboard.tsx` → `useAppointments({ technicianId })`
- [ ] `UpdateStatus.tsx` → `updateAppointment()` on submit
- [ ] `UserManagement.tsx` → `useUsers()`
- [ ] `ServiceCentreManagement.tsx` → `useServiceCentres()`
- [ ] `TechnicianAssignment.tsx` → `useTechnicians()`
- [ ] `AdminDashboard.tsx` → real stats from API
- [ ] `ReportsAnalytics.tsx` → real data from API
- [ ] `CustomerCRM.tsx` → `useUsers({ role: 'customer' })`
- [ ] `CalendarManagement.tsx` → `useAppointments()`
- [ ] Add loading/error/empty states to every page
- [ ] Delete (or deprecate) mockData.ts

### Phase 3 — Security (~2–3 hrs)
- [ ] Install `cookie-parser`
- [ ] Backend sets httpOnly cookie on login/register
- [ ] Auth middleware reads from cookie
- [ ] Frontend removes all localStorage token code
- [ ] All fetch calls include `credentials: 'include'`

### Phase 4 — Frontend tests (~4–6 hrs)
- [ ] Install vitest + testing-library
- [ ] Configure `vite.config.ts` test block
- [ ] Write AuthContext tests
- [ ] Write ProtectedRoute tests
- [ ] Write LoginPage + RegisterPage tests
- [ ] Write tests for 3 most-used pages
- [ ] Run `pnpm test:coverage` and reach 60%+

### Phase 5 — Nice-to-have
- [ ] Email notifications (nodemailer)
- [ ] Password reset flow
- [ ] Refresh tokens
- [ ] Swagger docs at `/api/docs`

### Phase 6 — Deploy
- [ ] Pre-deployment checklist complete
- [ ] Backend on Railway with PostgreSQL
- [ ] Frontend on Vercel
- [ ] Production smoke test (register → login → book → status update)

---

## ⏱️ Realistic Time Breakdown

| Phase | Work | Estimated Hours |
|-------|------|----------------|
| Phase 1 | Backend gaps | 3 hrs |
| Phase 2 | API wiring (the main event) | 8–10 hrs |
| Phase 3 | Security fix | 2–3 hrs |
| Phase 4 | Frontend tests | 4–6 hrs |
| Phase 5 | Email + password reset | 4–6 hrs |
| Phase 6 | Deployment | 2–4 hrs |
| **Total** | **MVP + deployed** | **~25–32 hrs** |

Working 3–4 hours a day: **7–10 days to a production-ready, fully functional app.**

---

## 🧭 Recommended Daily Order of Work

```
Day 1:  Phase 1 (backend gaps + fix failing tests)
Day 2:  Phase 2a (all 4 customer pages wired)
Day 3:  Phase 2b (technician pages + UpdateStatus)
Day 4:  Phase 2c (admin pages: UserMgmt, ServiceCentres, TechnicianAssignment)
Day 5:  Phase 2d (AdminDashboard, Reports, CRM, Calendar + loading/error states)
Day 6:  Phase 3 (security: httpOnly cookies end-to-end)
Day 7:  Phase 4 (set up vitest, write auth + form tests)
Day 8:  Phase 4 (page tests, hit 60% coverage)
Day 9:  Phase 5 (email notifications + password reset)
Day 10: Phase 6 (deploy to Railway + Vercel, smoke test)
```

---

*This document was generated by synthesising all project audit files as of March 16, 2026.*  
*Update this file as phases are completed.*
