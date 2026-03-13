# AutoService Pro - Scheduling System UI

A comprehensive car service scheduling system built with React, TypeScript, and Tailwind CSS **with integrated CRM capabilities**.

## 🎯 Overview

This application provides complete UI pages for a car service scheduling system with three distinct user roles: Customer, Technician, and Administrator. The system now includes advanced features like CRM, calendar management, staff scheduling, real-time messaging, and automated conflict detection.

## 🆕 **NEW FEATURES ADDED**

### 🔐 **Enhanced Authentication**
- ✅ **Google OAuth Integration** - Sign in with Google button
- ✅ Cloud-enabled login ready for OAuth 2.0
- ✅ Demo mode for easy testing

### 📅 **Calendar Management** (NEW!)
- ✅ Week-view calendar with automated scheduling logic
- ✅ Real-time capacity monitoring
- ✅ **Double-booking prevention**
- ✅ **Conflict detection** for time slots
- ✅ Resource availability tracking (service bays)
- ✅ Technician workload balancing
- ✅ Visual capacity indicators
- ✅ Automated alerts for overbooking risks

### 💼 **Customer CRM** (NEW!)
- ✅ Complete customer database management
- ✅ Vehicle history tracking
- ✅ Service history with detailed records
- ✅ Lead management pipeline
- ✅ Lead source tracking (Google, Website, Phone, Referral)
- ✅ Customer lifecycle management
- ✅ VIP customer identification
- ✅ Customer notes and preferences
- ✅ MOT due date tracking
- ✅ Service reminder automation ready

### 👔 **Staff Management** (NEW!)
- ✅ Shift planning and scheduling
- ✅ PTO (Paid Time Off) tracking
- ✅ Time-off request approval workflow
- ✅ Break time management
- ✅ Multi-centre shift allocation

### 💬 **Communication & Alerts** (NEW!)
- ✅ Internal messaging system
- ✅ Real-time notifications
- ✅ Appointment change alerts
- ✅ Message threading
- ✅ Unread message indicators
- ✅ Link notifications to appointments

### 📊 **Resource Management** (NEW!)
- ✅ Service bay availability tracking
- ✅ Bay type management (General, MOT, Bodywork, Diagnostic)
- ✅ Real-time bay status (Available, Occupied, Maintenance)
- ✅ Equipment allocation

### 🎯 **Automated Logic**
- ✅ Prevents double-booking automatically
- ✅ Validates technician availability
- ✅ Checks shift schedules before assignment
- ✅ Suggests optimal time slots
- ✅ Balances workload across staff
- ✅ Auto-alerts on capacity issues

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Management**: React Hook Form v7.55
- **Validation**: Zod
- **Notifications**: Sonner
- **Charts**: Recharts

### File Structure
```
src/app/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── RootLayout.tsx   # Main layout with navigation
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── customer/
│   │   ├── CustomerDashboard.tsx
│   │   ├── BookAppointment.tsx
│   │   ├── AppointmentDetails.tsx
│   │   └── FeedbackForm.tsx
│   ├── technician/
│   │   ├── TechnicianDashboard.tsx
│   │   └── UpdateStatus.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── ServiceCentreManagement.tsx
│       ├── TechnicianAssignment.tsx
│       ├── UserManagement.tsx
│       └── ReportsAnalytics.tsx
├── lib/
│   └── mockData.ts      # Mock data and type definitions
├── routes.tsx           # Route configuration
└── App.tsx             # Main app component
```

## 👥 User Roles & Features

### Customer Role
- **Dashboard**: View all appointments (upcoming, completed, cancelled)
- **Book Appointment**: Complete booking form with vehicle details, service type, date/time selection
- **Appointment Details**: View full appointment information with cancel option
- **Feedback Form**: Submit ratings and comments after service completion

### Technician Role
- **Dashboard**: View assigned appointments with priority indicators
- **Update Status**: Update repair status with detailed remarks
- Real-time workload overview

### Administrator Role
- **Dashboard**: System overview with key metrics and charts
- **Service Centre Management**: Add/edit/delete service centres with capacity management
- **Technician Assignment**: Assign technicians to appointments with workload visibility
- **User Management**: Manage all system users (customers, technicians, admins)
- **Reports & Analytics**: Comprehensive reports with charts and export functionality

## 🎨 UI Features

### Design System
- Consistent color scheme with role-based theming
- Responsive layout (mobile-first approach)
- Accessible components from shadcn/ui
- Status badges with color coding
- Interactive charts for data visualization

### Key Components
- **Cards**: Primary container for content sections
- **Tables**: Data display with sorting and actions
- **Forms**: Validated forms with error handling
- **Dialogs**: Modal windows for add/edit operations
- **Tabs**: Organized content navigation
- **Badges**: Status and role indicators
- **Charts**: Bar, Line, and Pie charts for analytics

## 📊 Data Management

### Mock Data (`lib/mockData.ts`)
The application uses comprehensive mock data including:
- **Users**: Customer, technician, and admin accounts
- **Service Centres**: 4 locations with capacity tracking
- **Technicians**: 5 technicians with specializations
- **Appointments**: Sample bookings with various statuses
- **Feedback**: Customer reviews and ratings

### Type Safety
All data structures are fully typed with TypeScript interfaces:
- `User`, `ServiceCentre`, `Technician`, `Appointment`, `Feedback`
- Helper functions for data filtering and retrieval

## 🚀 Getting Started

### Demo Mode
The login page allows switching between roles for testing:
1. Select role (Customer/Technician/Admin)
2. Enter any valid email and password (min 6 characters)
3. System automatically logs in as the corresponding role

### Navigation
- Role-specific navigation menu in header
- Breadcrumb navigation for context
- Quick action buttons throughout the interface

## 🔑 Key Features

### Customer Features
✅ Book appointments with vehicle and service details
✅ View appointment history with status tracking
✅ Cancel appointments (within allowed window)
✅ Submit feedback after service completion
✅ Real-time service centre availability

### Technician Features
✅ View assigned appointments with priority
✅ Update repair status (Confirmed, In Progress, Delayed, Completed)
✅ Add detailed remarks for each appointment
✅ Today's appointments highlighted

### Admin Features
✅ System-wide dashboard with metrics
✅ Service centre capacity management
✅ Technician assignment with workload balancing
✅ User management (CRUD operations)
✅ Comprehensive reports and analytics
✅ Export functionality for reports

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Single column layout, hamburger menu
- **Tablet**: Two-column grids where appropriate
- **Desktop**: Full multi-column layout with sidebar navigation

## 🎯 Future Integration Points

This UI is designed to integrate with your Next.js backend:

### API Integration Points
1. **Authentication**: Replace mock login with NextAuth.js
2. **Data Fetching**: Replace mock data with Prisma queries
3. **Real-time Updates**: Add WebSocket for live status updates
4. **File Upload**: Add vehicle photo uploads
5. **Payment Integration**: M-PESA integration hooks
6. **SMS Notifications**: Notification triggers throughout the flow

### Database Schema Alignment
The mock data structure matches your Prisma schema requirements:
- User with role-based access
- Service centres with capacity
- Appointments with status tracking
- Feedback with ratings

## 🎨 Customization

### Branding
Update in `/src/components/RootLayout.tsx`:
- Logo/icon
- Application name
- Color scheme (primary blue can be changed in theme)

### Service Types
Modify in `/src/lib/mockData.ts`:
```typescript
export const serviceTypes = [
  "Oil Change & General Service",
  // Add your custom service types
];
```

## 📝 Notes

- All forms include client-side validation with Zod
- Toast notifications for user feedback
- Loading states ready for async operations
- Error boundaries can be added for production
- All components follow accessibility best practices

## 🔄 Migration to Next.js

To adapt this for your Next.js 15 app:

1. **Components**: Move components to Next.js structure
2. **Routing**: Convert to Next.js App Router
3. **Data Fetching**: Replace with Server Components and Server Actions
4. **Authentication**: Integrate NextAuth.js middleware
5. **API Routes**: Create API routes for CRUD operations
6. **Database**: Connect Prisma client

## 📚 Dependencies

All required packages are already installed:
- react-router: Navigation
- react-hook-form: Form management
- zod: Schema validation
- sonner: Toast notifications
- recharts: Data visualization
- lucide-react: Icons
- All shadcn/ui dependencies

## 🎓 Learning Resources

- [React Router Documentation](https://reactrouter.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Recharts Examples](https://recharts.org/)