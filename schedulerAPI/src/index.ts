import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { userRoutes } from './routes/users';
import { appointmentRoutes } from './routes/appointments';
import { technicianRoutes } from './routes/technicians';
import { serviceCentreRoutes } from './routes/serviceCentres';
import { initializeDatabase, seedDatabase } from './db/init';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security middleware - helmet adds various HTTP headers for protection
app.use(helmet());

// Rate limiting - applies to all routes by default
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Rate limiting for authentication endpoints (lenient for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per windowMs (increased for development)
  message: 'Too many login/register attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// CORS Configuration - support multiple ports for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      apiVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'Server is healthy',
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/service-centres', serviceCentreRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(err.errors && { errors: err.errors }),
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║   🚀 Scheduler API Server Started                           ║
║   ✅ Running on: http://localhost:${PORT}                      ║
║   📡 Environment: ${(process.env.NODE_ENV || 'development').padEnd(30)} ║
║   🌐 CORS Origins:                                          ║
${allowedOrigins.map((url) => `║      - ${url.padEnd(45)} ║`).join('\n')}
║   🗄️  Database: PostgreSQL (localhost)                      ║
║   📊 API Version: 1.0.0                                    ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
