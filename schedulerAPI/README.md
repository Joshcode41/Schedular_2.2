# Scheduler API Backend

Backend API for the Scheduler Application built with Express.js and TypeScript.

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Installation

```bash
cd schedulerAPI
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The API will be available at `http://localhost:3001`

### Production Build

```bash
pnpm build
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Technicians
- `GET /api/technicians` - Get all technicians
- `GET /api/technicians/:id` - Get technician by ID
- `POST /api/technicians` - Create new technician
- `PUT /api/technicians/:id` - Update technician
- `DELETE /api/technicians/:id` - Delete technician

### Service Centres
- `GET /api/service-centres` - Get all service centres
- `GET /api/service-centres/:id` - Get service centre by ID
- `POST /api/service-centres` - Create new service centre
- `PUT /api/service-centres/:id` - Update service centre
- `DELETE /api/service-centres/:id` - Delete service centre

## Health Check

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-10T12:00:00Z",
  "apiVersion": "1.0.0"
}
```

## CORS Configuration

The API is configured to accept requests from the frontend URL specified in `.env` (default: `http://localhost:5173`).

## Project Structure

```
schedulerAPI/
├── src/
│   ├── index.ts          # Main server file
│   ├── routes/
│   │   ├── auth.ts       # Authentication routes
│   │   ├── users.ts      # User management
│   │   ├── appointments.ts
│   │   ├── technicians.ts
│   │   └── serviceCentres.ts
│   └── types/            # TypeScript types (add as needed)
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development Notes

- All routes use mock data in-memory storage
- For production, replace with actual database (PostgreSQL, MongoDB, etc.)
- Password hashing should be implemented in production
- Consider adding authentication middleware
- Add validation middleware for request bodies
- Implement proper error handling and logging
