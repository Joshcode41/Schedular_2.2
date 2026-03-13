# Scheduler Application - Full Setup Guide

This is a complete scheduling system with a React frontend (`schedulerUI`) and Express.js backend (`schedulerAPI`).

## 📁 Project Structure

```
scheduler31/
├── schedulerAPI/     # Backend API (Express.js + TypeScript)
└── schedulerUI/      # Frontend App (React + Vite + TypeScript)
```

## 🚀 Quick Start - Development Mode

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### 1. Setup Backend (schedulerAPI)

```powershell
# Open PowerShell in the project root
cd schedulerAPI

# Install dependencies
pnpm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
pnpm dev
```

The backend will be available at: **http://localhost:3001**

### 2. Setup Frontend (schedulerUI)

**In a new PowerShell terminal:**

```powershell
cd schedulerUI

# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at: **http://localhost:5173**

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Health Check**: http://localhost:3001/health

## 🔐 Demo Login Credentials

The app uses mock authentication. You can log in with any email/password combination:

**Available Roles:**
- **Customer** - Book and manage appointments
- **Technician** - View and update service assignments
- **Admin** - Manage all aspects of the system

Example:
- Email: `customer@example.com` → Password: `password123`
- Email: `tech@example.com` → Password: `password123`
- Email: `admin@example.com` → Password: `password123`

Or just use any random credentials - they'll all work in demo mode!

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Auth Endpoints
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Users Management
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Appointments
- `GET /appointments` - List all appointments
- `POST /appointments` - Create appointment
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id` - Update appointment
- `PATCH /appointments/:id/cancel` - Cancel appointment
- `DELETE /appointments/:id` - Delete appointment

### Technicians
- `GET /technicians` - List all technicians
- `POST /technicians` - Add technician
- `PUT /technicians/:id` - Update technician
- `DELETE /technicians/:id` - Delete technician

### Service Centres
- `GET /service-centres` - List service centres
- `POST /service-centres` - Add service centre
- `PUT /service-centres/:id` - Update centre
- `DELETE /service-centres/:id` - Delete centre

## 📦 Build for Production

### Frontend Production Build
```powershell
cd schedulerUI
pnpm build
# Output: dist/ folder ready for deployment
```

### Backend Production Build
```powershell
cd schedulerAPI
pnpm build
pnpm start
```

## 🔗 Frontend Configuration

The frontend is configured to connect to the backend via environment variables:

- **.env.development** - Used during `pnpm dev`
- **.env.production** - Used during `pnpm build`

Current configuration:
```
VITE_API_URL=http://localhost:3001/api
```

Update `VITE_API_URL` in `.env.production` when deploying to production.

## 📝 Features

### Customer Features
- ✅ Browse available services and technicians
- ✅ Book appointments at preferred service centre
- ✅ View appointment history
- ✅ Provide feedback and ratings
- ✅ Manage profile

### Technician Features
- ✅ View assigned appointments
- ✅ Update appointment status
- ✅ View customer details
- ✅ Manage availability

### Admin Features
- ✅ Complete user management
- ✅ Service centre management
- ✅ Technician assignment
- ✅ Calendar and schedule management
- ✅ Customer CRM
- ✅ Analytics and reports

## 🔧 Development Tools

### Frontend
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **React Hook Form** - Form state management
- **Zod** - TypeScript validation
- **Radix UI** - Accessible component library

### Backend
- **Express.js** - Web server framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin request handling
- **Dotenv** - Environment configuration

## 📚 Project Structure Details

### Frontend (schedulerUI)
```
src/
├── app/
│   ├── components/        # Reusable React components
│   │   └── ui/           # Radix UI & shadcn components
│   ├── pages/            # Page components (routes)
│   │   ├── customer/     # Customer-specific pages
│   │   ├── technician/   # Technician-specific pages
│   │   └── admin/        # Admin-specific pages
│   ├── lib/              # Utilities and helpers
│   ├── App.tsx           # Main app component
│   └── routes.tsx        # Route definitions
├── services/
│   └── api.ts            # API client and endpoints
├── styles/               # Global CSS
└── main.tsx              # Entry point
```

### Backend (schedulerAPI)
```
src/
├── routes/
│   ├── auth.ts           # Authentication endpoints
│   ├── users.ts          # User management
│   ├── appointments.ts   # Appointment handling
│   ├── technicians.ts    # Technician management
│   └── serviceCentres.ts # Service centre management
└── index.ts              # Server entry point
```

## 🚨 Troubleshooting

### White Screen Issue (FIXED ✅)
**Problem**: App shows white screen  
**Solution**: LoginPage component missing return statement - FIXED!

### Port Already in Use
```powershell
# Kill process on port 3001 (backend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Kill process on port 5173 (frontend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### API Connection Issues
1. Ensure backend is running on port 3001
2. Check `.env.development` in schedulerUI has correct `VITE_API_URL`
3. Verify CORS is enabled in backend

### Dependencies Not Installing
```powershell
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
pnpm install --force
```

## 📖 Next Steps

1. **Customize the API** - Replace mock data with real database (PostgreSQL, MongoDB, etc.)
2. **Add Authentication** - Implement JWT tokens and password hashing
3. **Set up Database** - Configure Supabase or another backend service
4. **Deploy** - Use Vercel (frontend) and Railway/Heroku (backend)
5. **Add Testing** - Set up Jest and React Testing Library

## 📧 Support & Questions

Refer to the individual README files:
- Frontend: [schedulerUI/README.md](schedulerUI/README.md)
- Backend: [schedulerAPI/README.md](schedulerAPI/README.md)

---

**Happy coding! 🚀**
