import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import {
  successResponse,
  errorResponse,
  handleAsyncError,
} from '../utils/serializers';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateTransition } from '../workflows/appointmentWorkflow';

const router = Router();

// Get all appointments with pagination and filtering
router.get(
  '/',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const customerId = req.query.customerId as string | undefined;
    const technicianId = req.query.technicianId as string | undefined;

    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    // Filter by status
    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    // Filter by customer (customers can only see their own)
    if (req.user.role === 'customer') {
      query += ` AND customer_id = $${paramCount++}`;
      params.push(req.user.userId);
    } else if (customerId) {
      query += ` AND customer_id = $${paramCount++}`;
      params.push(customerId);
    }

    // Filter by technician
    if (technicianId) {
      query += ` AND technician_id = $${paramCount++}`;
      params.push(technicianId);
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    query += ` ORDER BY appointment_date DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const appointments = result.rows;

    const { response, statusCode } = successResponse(
      {
        data: appointments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Appointments retrieved successfully'
    );
    res.status(statusCode).json(response);
  })
);

// Get appointment by ID
router.get(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Appointment not found', 404);
      return res.status(statusCode).json(response);
    }

    const appointment = result.rows[0];

    // Check access (customer can only view own appointments)
    if (req.user.role === 'customer' && appointment.customer_id !== req.user.userId) {
      const { response, statusCode } = errorResponse('Unauthorized', 403);
      return res.status(statusCode).json(response);
    }

    const { response, statusCode } = successResponse(appointment, 'Appointment retrieved successfully');
    res.status(statusCode).json(response);
  })
);

// Create appointment
router.post(
  '/',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const {
      serviceCentreId,
      preferredDate,
      preferredTime,
      serviceType,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      registrationNumber,
      notes,
    } = req.body;

    const errors: Record<string, string[]> = {};

    // Validation
    if (!serviceCentreId) errors.serviceCentreId = ['Service centre is required'];
    if (!preferredDate) errors.preferredDate = ['Preferred date is required'];
    if (!serviceType) errors.serviceType = ['Service type is required'];
    if (!vehicleMake) errors.vehicleMake = ['Vehicle make is required'];
    if (!vehicleModel) errors.vehicleModel = ['Vehicle model is required'];
    if (!registrationNumber) errors.registrationNumber = ['Registration number is required'];

    if (Object.keys(errors).length > 0) {
      const { response, statusCode } = errorResponse(errors, 400, 'Validation failed');
      return res.status(statusCode).json(response);
    }

    // Verify service centre exists
    const centreResult = await pool.query('SELECT id FROM service_centres WHERE id = $1', [
      serviceCentreId,
    ]);
    if (centreResult.rows.length === 0) {
      const { response, statusCode } = errorResponse('Service centre not found', 404);
      return res.status(statusCode).json(response);
    }

    // Create appointment
    const appointmentDate = `${preferredDate} ${preferredTime || '09:00'}`;
    const result = await pool.query(
      `INSERT INTO appointments (
        customer_id, service_centre_id, appointment_date, status, 
        service_type, description, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        req.user.userId,
        serviceCentreId,
        appointmentDate,
        'pending',
        serviceType,
        `${vehicleYear} ${vehicleMake} ${vehicleModel} (${registrationNumber})`,
        notes || null,
      ]
    );

    const appointment = result.rows[0];

    const { response, statusCode } = successResponse(
      appointment,
      'Appointment created successfully',
      201
    );
    res.status(statusCode).json(response);
  })
);

// Update appointment status
router.patch(
  '/:id/status',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const { newStatus, notes } = req.body;

    if (!newStatus) {
      const { response, statusCode } = errorResponse('Status is required', 400);
      return res.status(statusCode).json(response);
    }

    // Get current appointment
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Appointment not found', 404);
      return res.status(statusCode).json(response);
    }

    const appointment = result.rows[0];

    // Validate state transition
    try {
      validateTransition(appointment, newStatus, req.user.role);
    } catch (error: any) {
      const { response, statusCode } = errorResponse(error.message, 400);
      return res.status(statusCode).json(response);
    }

    // Update appointment
    const updateResult = await pool.query(
      'UPDATE appointments SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [newStatus, notes || appointment.notes, req.params.id]
    );

    const updated = updateResult.rows[0];

    const { response, statusCode } = successResponse(updated, 'Appointment updated successfully');
    res.status(statusCode).json(response);
  })
);

// Cancel appointment
router.patch(
  '/:id/cancel',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Appointment not found', 404);
      return res.status(statusCode).json(response);
    }

    const appointment = result.rows[0];

    // Validate transition
    try {
      validateTransition(appointment, 'cancelled', req.user.role);
    } catch (error: any) {
      const { response, statusCode } = errorResponse(error.message, 400);
      return res.status(statusCode).json(response);
    }

    // Cancel appointment
    const updateResult = await pool.query(
      'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['cancelled', req.params.id]
    );

    const updated = updateResult.rows[0];

    const { response, statusCode } = successResponse(updated, 'Appointment cancelled successfully');
    res.status(statusCode).json(response);
  })
);

// Delete appointment
router.delete(
  '/:id',
  authMiddleware,
  handleAsyncError(async (req: any, res: Response) => {
    const result = await pool.query('SELECT id FROM appointments WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      const { response, statusCode } = errorResponse('Appointment not found', 404);
      return res.status(statusCode).json(response);
    }

    await pool.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);

    const { response, statusCode } = successResponse(null, 'Appointment deleted successfully');
    res.status(statusCode).json(response);
  })
);

export { router as appointmentRoutes };
