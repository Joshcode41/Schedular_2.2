# Scheduler UI - Comprehensive Codebase Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Module Structure](#module-structure)
4. [Component Hierarchy](#component-hierarchy)
5. [Configuration](#configuration)
6. [Packages & Dependencies](#packages--dependencies)
7. [Functional Features](#functional-features)
8. [Missing Features & TODOs](#missing-features--todos)
9. [Setup & Installation](#setup--installation)
10. [Development Workflow](#development-workflow)

---

## 📌 Project Overview

**Scheduler UI** is a modern React-based frontend application built with **Vite**, **TypeScript**, **Tailwind CSS**, and **Radix UI**. It provides:

- Role-based authentication (Customer, Technician, Admin)
- Appointment booking and management
- Technician assignment dashboard
- Admin control panel
- Real-time service status updates
- Dark mode with customizable color themes

**Technology Stack:**
- Runtime: Node.js
- Build Tool: Vite 6.3.5
- Framework: React 18.3.1
- Language: TypeScript 5.x
- Styling: Tailwind CSS 4.1.12
- UI Components: Radix UI + shadcn/ui
- Form Management: React Hook Form 7.55.0
- Validation: Zod 4.3.6
- Routing: React Router 7.13.0
- HTTP Client: Fetch API (custom wrapper)
- Notifications: Sonner 2.0.3

---

## 🏗️ Architecture

### Application Structure

```
schedulerUI/
├── src/
│   ├── main.tsx          # Entry point
│   ├── app/
│   │   ├── App.tsx       # Root component with routing & theme
│   │   ├── routes.tsx    # Route definitions
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context providers
│   │   ├── pages/        # Page-level components
│   │   └── lib/          # Utilities and mock data
│   ├── services/         # API calls and external services
│   └── styles/           # Global styles
└── vite.config.ts        # Vite configuration
```

### Data Flow

```
User Action
    ↓
Component State (React Hook Form)
    ↓
API Service Call
    ↓
Backend Response
    ↓
Global State Update (Toast notification)
    ↓
Component Re-render
    ↓
UI Update
```

### Component Hierarchy

```
App
├── ThemeProvider (Context)
└── RouterProvider
    └── RootLayout
        ├── Header
        │   ├── Logo
        │   ├── Navigation
        │   └── ThemeSwitcher
        ├── Main Content
        │   └── Outlet (Page Components)
        └── Toaster (Notifications)
```

---

## 📁 Module Structure

### Entry Points

#### `src/main.tsx`
**Purpose:** Application bootstrap

**Responsibilities:**
- Mount React app to DOM
- Import global styles
- Create root element

### Core Application (`src/app/`)

#### **App.tsx**
**Purpose:** Root application component

**Key Features:**
- Wraps entire app with `ThemeProvider`
- Initializes `RouterProvider`
- Sets up context providers

**Code:**
```typescript
export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
```

#### **routes.tsx**
**Purpose:** Define application routes

**Route Structure:**
```typescript
Root Layout (/)
├── Public Routes
│   ├── /login (LoginPage)
│   └── /register (RegisterPage)
├── Customer Routes (/customer/*)
│   ├── /dashboard (CustomerDashboard)
│   ├── /book (BookAppointment)
│   ├── /appointment/:id (AppointmentDetails)
│   └── /feedback/:id (FeedbackForm)
├── Technician Routes (/technician/*)
│   ├── /dashboard (TechnicianDashboard)
│   └── /update-status/:id (UpdateStatus)
└── Admin Routes (/admin/*)
    ├── /dashboard (AdminDashboard)
    ├── /calendar-management (CalendarManagement)
    ├── /customer-crm (CustomerCRM)
    ├── /service-centres (ServiceCentreManagement)
    ├── /technician-assignment (TechnicianAssignment)
    ├── /users (UserManagement)
    └── /reports (ReportsAnalytics)
```

### Components (`src/app/components/`)

#### **RootLayout.tsx**
**Purpose:** Main layout wrapper for authenticated pages

**Features:**
- Sticky header with navigation
- Role-based nav items
- User profile dropdown
- Theme switcher
- Mobile responsive sidebar
- Main content area with Outlet
- Toast notification system

**Navigation Logic:**
```typescript
- Customer: Dashboard, Book Appointment
- Technician: My Assignments
- Admin: Dashboard, Calendar, CRM, Service Centres, 
         Technician Assignment, Users, Reports
```

#### **ThemeSwitcher.tsx** ⭐ NEW
**Purpose:** Theme and color scheme switcher

**Features:**
- Light/Dark/System theme modes
- 6 color themes (Blue, Purple, Green, Rose, Amber, Slate)
- Persistent storage (localStorage)
- Dropdown menu interface

**Usage:**
```typescript
<ThemeSwitcher />
```

#### **UI Components** (`src/app/components/ui/`)

Radix UI + shadcn/ui component library including:

```
├── accordion.tsx           # Expandable content sections
├── alert-dialog.tsx        # Confirmation dialogs
├── button.tsx              # Primary action buttons
├── card.tsx                # Content containers
├── form.tsx                # Form wrapper
├── input.tsx               # Text input fields
├── password-input.tsx      # ⭐ NEW Password field with toggle
├── label.tsx               # Input labels
├── select.tsx              # Dropdown selects
├── table.tsx               # Data tables
├── tabs.tsx                # Tabbed content
├── dialog.tsx              # Modal dialogs
├── drawer.tsx              # Side drawer
├── skeleton.tsx            # Loading placeholders
├── sonner.tsx              # Toast notification system
└── use-mobile.ts           # Mobile detection hook
```

**Key Component:** `PasswordInput.tsx` ⭐ NEW
```typescript
Props:
- id?: string
- label?: string
- placeholder?: string
- value?: string
- onChange?: (e) => void
- error?: string
- disabled?: boolean

Features:
- Show/hide password toggle
- Eye icon from lucide-react
- Error message display
- Dark mode support
```

### Context Providers (`src/app/context/`)

#### **ThemeContext.tsx** ⭐ NEW
**Purpose:** Global theme management

**Exports:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  isDark: boolean;
}

useTheme() // Custom hook to access theme
```

**Features:**
- System theme detection
- localStorage persistence
- CSS class injection (dark mode)
- Color theme management

**Storage Keys:**
- `localStorage.getItem('theme')`
- `localStorage.getItem('colorTheme')`

### Pages (`src/app/pages/`)

#### Authentication Pages

**LoginPage.tsx** ✅ FIXED
- Email/password input with password toggle
- Role selection (Customer/Technician/Admin)
- Form validation with Zod
- Google login button (demo)
- Link to registration
- Demo credentials display

**RegisterPage.tsx** ✅ UPDATED
- Full name input
- Email input
- Phone number input
- Password input with toggle
- Confirm password with toggle
- Password matching validation
- Link to login page

#### Customer Pages

**CustomerDashboard.tsx**
- Welcome message
- Upcoming appointments
- Quick action buttons
- Recent activity/history

**BookAppointment.tsx**
- Service selection
- Date/time picker
- Service centre selection
- Location selection
- Notes input
- Form submission with validation

**AppointmentDetails.tsx**
- Appointment status
- Technician information
- Service details
- Timeline/history
- Contact information
- Cancel appointment button

**FeedbackForm.tsx**
- Rating system (1-5 stars)
- Service quality feedback
- Technician rating
- Comments/suggestions
- Submit button

#### Technician Pages

**TechnicianDashboard.tsx**
- Assigned appointments list
- Status indicators
- Quick actions
- Navigation to detailed views

**UpdateStatus.tsx**
- Current appointment info
- Status update dropdown
- Notes field
- Time tracking
- Complete/reschedule options

#### Admin Pages

**AdminDashboard.tsx**
- System overview
- Key metrics/KPIs
- Recent activities
- Quick access to other admin functions

**CalendarManagement.tsx**
- Calendar view
- Event management
- Availability management
- Conflict detection

**CustomerCRM.tsx**
- Customer list
- Contact information
- Interaction history
- Communication tools

**ServiceCentreManagement.tsx**
- Centre list/table
- Add/edit centres
- Location management
- Service offerings
- Staff assignment

**TechnicianAssignment.tsx**
- Technician list
- Availability management
- Service assignment
- Specialization tracking

**UserManagement.tsx**
- User CRUD operations
- Role management
- Status updates
- Bulk actions

**ReportsAnalytics.tsx**
- Key metrics
- Charts and graphs
- Date range filters
- Export functionality

### Services (`src/services/`)

#### **api.ts** ⭐ NEW COMPLETE
**Purpose:** Centralized API client and endpoint definitions

**Features:**
```typescript
class ApiClient {
  - getHeaders()      // Inject auth token
  - request()         // Fetch with error handling
  - get()             // GET requests
  - post()            // POST requests
  - put()             // PUT requests
  - patch()           // PATCH requests
  - delete()          // DELETE requests
  - setToken()        // Save JWT token
  - clearToken()      // Remove token on logout
}

Exported Modules:
- apiClient           // Direct API client
- authApi {}          // Auth endpoints
- usersApi {}         // User endpoints
- appointmentsApi {}  // Appointment endpoints
- techniciansApi {}   // Technician endpoints
- serviceCentresApi {}// Service centre endpoints
```

**Usage Example:**
```typescript
import { authApi, appointmentsApi } from '@/services/api';

// Login
const { user, token } = await authApi.login(email, password, role);

// Create appointment
const appointment = await appointmentsApi.create({
  customerId: '...',
  serviceType: 'AC Repair',
  // ...
});
```

### Utilities (`src/app/lib/`)

#### **mockData.ts**
**Purpose:** Dummy data for demo mode

**Exports:**
```typescript
currentUser      // Current logged-in user state
setCurrentUser() // Update user state
users[]          // Array of demo users
```

**Demo Users:**
```
- Customer: John (customer@example.com)
- Technician: Jane (tech@example.com)
- Admin: Admin (admin@example.com)
```

### Styles (`src/styles/`)

#### **index.css** (Main entry point)
Imports:
- `fonts.css` - Custom fonts
- `tailwind.css` - Tailwind directives
- `theme.css` - Theme colors

#### **tailwind.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### **theme.css**
Custom CSS variables for:
- Color schemes
- Theme variables
- Dark mode overrides

---

## ⚙️ Configuration

### Vite Configuration (`vite.config.ts`)

```typescript
defineConfig({
  plugins: [
    react(),       // React + JSX support
    tailwindcss()  // Tailwind CSS processing
  ],
  resolve: {
    alias: {
      '@': './src'  // Path alias for cleaner imports
    }
  },
  assetsInclude: [
    '**/*.svg',
    '**/*.csv'
  ]
});
```

### Build Output
- **Development:** Unoptimized, source maps included
- **Production:** Minified, optimized, no source maps

### Environment Variables

#### `.env.development`
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Scheduler
VITE_APP_VERSION=1.0.0
```

#### `.env.production`
```env
VITE_API_URL=https://api.scheduler.example.com/api
VITE_APP_NAME=Scheduler
VITE_APP_VERSION=1.0.0
```

**Usage in Code:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

### TypeScript Configuration (`tsconfig.json`)

**Key Settings:**
- Target: ES2020
- Module: ESNext
- Strict Mode: Enabled
- JSX: React-JSX
- Path Aliases: Configured

---

## 📦 Packages & Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI library |
| react-dom | 18.3.1 | React DOM binding |
| react-router | 7.13.0 | Client-side routing |
| react-hook-form | 7.55.0 | Form state management |
| zod | 4.3.6 | Schema validation |
| tailwindcss | 4.1.12 | Utility CSS framework |
| @radix-ui/* | Latest | Headless UI components |
| lucide-react | 0.487.0 | Icon library |
| sonner | 2.0.3 | Toast notifications |
| motion | 12.23.24 | Animation library |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | 6.3.5 | Build tool |
| @vitejs/plugin-react | 4.7.0 | React plugin for Vite |
| typescript | 5.x | Type checking |
| tailwindcss | 4.1.12 | CSS utility framework |
| @tailwindcss/vite | 4.1.12 | Tailwind integration |

---

## ✅ Functional Features

### Authentication System ✅
- ✅ Login page with role selection
- ✅ Register/signup page
- ✅ Password visibility toggle
- ✅ Form validation (Zod)
- ✅ Mock JWT token management
- ✅ Session persistence

### Theme System ⭐ NEW ✅
- ✅ Light mode
- ✅ Dark mode
- ✅ System preference detection
- ✅ 6 color themes (Blue, Purple, Green, Rose, Amber, Slate)
- ✅ LocalStorage persistence
- ✅ Instant theme switching
- ✅ CSS class injection
- ✅ Dark mode in components

### Customer Features ✅
- ✅ View dashboard
- ✅ Browse available services
- ✅ Book appointments (form)
- ✅ View appointment details
- ✅ Provide feedback
- ✅ View appointment history

### Technician Features ✅
- ✅ View assigned appointments
- ✅ Update appointment status
- ✅ View customer details
- ✅ Access dashboard

### Admin Features ✅
- ✅ Admin dashboard
- ✅ Service centre management
- ✅ Technician assignment
- ✅ User management
- ✅ Customer CRM
- ✅ Calendar management
- ✅ Reports and analytics

### UI Features ✅
- ✅ Responsive design (mobile-first)
- ✅ Password visibility toggle
- ✅ Theme switcher with themes
- ✅ Toast notifications
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Skeleton screens

---

## ❌ Missing Features & TODOs

### High Priority

1. **🔐 Real Authentication**
   - [ ] Implement JWT token verification
   - [ ] Add proper login flow with real backend
   - [ ] Implement refresh token mechanism
   - [ ] Add session timeout
   - [ ] Implement logout functionality
   - [ ] Add protected routes middleware

   ```typescript
   // TODO: Create auth/ProtectedRoute.tsx
   // Current: No route protection
   // Required: Check token before rendering
   // Example:
   // - Redirect to /login if no token
   // - Verify token validity
   // - Check user role for route access
   ```

2. **💾 API Integration**
   - [ ] Connect all forms to backend
   - [ ] Implement real data persistence
   - [ ] Handle API errors properly
   - [ ] Add loading states for API calls
   - [ ] Implement optimistic updates

   ```typescript
   // TODO: Update BookAppointment.tsx
   // Current: Form submission logs to console
   // Required: 
   // - Call appointmentsApi.create()
   // - Show loading spinner
   // - Handle errors with toast
   // - Redirect on success
   ```

3. **📊 Real Data**
   - [ ] Remove mock data (mockData.ts)
   - [ ] Fetch users from API
   - [ ] Fetch appointments from API
   - [ ] Fetch technicians from API
   - [ ] Implement data caching/state management

   ```typescript
   // TODO: Create hooks for data fetching
   // - useUsers()
   // - useAppointments()
   // - useTechnicians()
   // - useServiceCentres()
   ```

4. **🔄 State Management**
   - [ ] Consider Redux or Zustand for global state
   - [ ] Implement user context
   - [ ] Add authentication context
   - [ ] Cache API responses
   - [ ] Implement undo/redo

   ```typescript
   // TODO: Create context/UserContext.tsx
   // Current: Using local component state
   // Required: Global user state management
   ```

5. **📱 Advanced Features**
   - [ ] Real-time updates (WebSocket)
   - [ ] Push notifications
   - [ ] Offline support
   - [ ] Progressive Web App (PWA)
   - [ ] Service workers

   ```typescript
   // TODO: Implement WebSocket connection
   // For real-time appointment updates
   ```

### Medium Priority

6. **🧪 Testing**
   - [ ] Unit tests for components
   - [ ] Integration tests for pages
   - [ ] E2E tests with Cypress/Playwright
   - [ ] Component snapshot tests
   - [ ] API mocking for tests

   ```bash
   # TODO: Set up testing framework
   # pnpm add -D vitest @testing-library/react
   # Create tests/ folder
   # Write component tests
   ```

7. **📊 Data Visualization**
   - [ ] Implement charts on admin dashboard
   - [ ] Add calendar view for appointments
   - [ ] Create analytics page with graphs
   - [ ] Add data export functionality
   - [ ] Implement filters and search

8. **🔔 Notifications**
   - [ ] Email notifications
   - [ ] SMS notifications
   - [ ] Push notifications
   - [ ] In-app notification history
   - [ ] Notification preferences

9. **🎨 UI Enhancements**
   - [ ] Add more animations
   - [ ] Improve loading states
   - [ ] Add skeleton screens
   - [ ] Better error pages (404, 500)
   - [ ] Accessibility improvements (WCAG)

10. **📝 Documentation**
    - [ ] Component storybook
    - [ ] Design system documentation
    - [ ] API integration guide
    - [ ] Deployment guide
    - [ ] User guide

### Low Priority

11. **⚡ Performance**
    - [ ] Code splitting by route
    - [ ] Lazy load components
    - [ ] Image optimization
    - [ ] Cache API responses
    - [ ] Implement pagination

    ```typescript
    // TODO: Add React.lazy() for routes
    // const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
    ```

12. **🌐 Internationalization**
    - [ ] Add multi-language support
    - [ ] Implement i18n library
    - [ ] Add timezone support
    - [ ] Regional date/time formatting

13. **♿ Accessibility**
    - [ ] ARIA labels
    - [ ] Keyboard navigation
    - [ ] Screen reader support
    - [ ] Color contrast compliance
    - [ ] Focus management

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### Installation Steps

```bash
# Navigate to UI directory
cd schedulerUI

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.development

# Start development server
pnpm dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm preview

# Output: dist/ folder ready for deployment
```

---

## 🔧 Development Workflow

### Project Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

### Running Commands

```bash
# Start development server with auto-reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

### Development Tips

1. **Hot Module Replacement (HMR)**
   - Changes auto-reflect in browser
   - Component state is preserved
   - Styles update instantly

2. **Debugging**
   - Use React Developer Tools extension
   - Browser DevTools -> Sources tab
   - Console logs for debugging

3. **API Testing**
   - Backend must run on localhost:3001
   - Check `.env.development` for API URL
   - Use VS Code REST Client for quick API tests

4. **Component Development**
   - Work on single page/component
   - Use mock data during development
   - Test with different screen sizes
   - Check dark mode appearance

### Useful Extensions

```json
{
  "recommendations": [
    "ES7+ React/Redux/React-Native snippets",
    "Tailwind CSS IntelliSense",
    "Prettier - Code formatter",
    "REST Client",
    "Thunder Client",
    "React Developer Tools"
  ]
}
```

---

## 📊 Component Statistics

```
Total Components:  40+
├── UI Components: 25+
├── Page Components: 12
├── Layout Components: 2
└── Custom Components: 1+

Total Lines of Code: ~8,000
├── Components: ~5,000
├── Services: ~1,500
├── Styles: ~800
└── Config: ~700
```

---

## 🎯 Performance Metrics

**Target Metrics:**
- **Page Load Time:** < 2 seconds
- **First Contentful Paint:** < 1 second
- **Lighthouse Score:** 90+
- **Bundle Size:** < 300KB (gzipped)

**Current Status:** ⏳ To be measured

---

## 🛣️ Future Roadmap

### Phase 1 (Week 1-2) - API Integration
- [ ] Connect all forms to backend
- [ ] Implement JWT authentication
- [ ] Add protected routes
- [ ] Handle API errors

### Phase 2 (Week 3-4) - Testing & QA
- [ ] Write unit tests
- [ ] Create integration tests
- [ ] Fix bugs and issues
- [ ] Performance optimization

### Phase 3 (Month 2) - Advanced Features
- [ ] Real-time updates (WebSocket)
- [ ] Push notifications
- [ ] Data visualization
- [ ] Analytics dashboard

### Phase 4 (Month 3+) - Polish & Deploy
- [ ] Accessibility improvements
- [ ] Deployment setup
- [ ] Production optimization
- [ ] User documentation

---

**Last Updated:** March 10, 2026  
**Version:** 1.0.0  
**Status:** Alpha (Ready for API Integration)
